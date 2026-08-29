-- Pack of Five Rescue Manager workbook-import foundation
-- Safe to run more than once. This migration creates permissions and audit
-- records only; it does not import a workbook or change rescue records.

begin;

create extension if not exists "pgcrypto";

-- Permissions are separate from users.role so future admin levels can be
-- introduced without another authorization redesign.
create table if not exists user_permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  permission_key text not null,
  organization_id uuid references organizations(id) on delete cascade,
  granted_by uuid references users(id) on delete set null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  check (permission_key <> '')
);

create unique index if not exists uq_user_permissions_global_active
  on user_permissions (user_id, permission_key)
  where organization_id is null and revoked_at is null;

create unique index if not exists uq_user_permissions_org_active
  on user_permissions (user_id, permission_key, organization_id)
  where organization_id is not null and revoked_at is null;

create index if not exists idx_user_permissions_lookup
  on user_permissions (user_id, permission_key, organization_id)
  where revoked_at is null;

-- Preserve access for currently approved platform admins. Future staff can be
-- granted or denied this permission independently of their broad role.
insert into user_permissions (user_id, permission_key)
select u.id, 'rescue_workbook_import'
from users u
where u.role = 'admin'
  and u.status = 'approved'
  and not exists (
    select 1
    from user_permissions up
    where up.user_id = u.id
      and up.permission_key = 'rescue_workbook_import'
      and up.organization_id is null
      and up.revoked_at is null
  );

create table if not exists import_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  uploaded_by uuid not null references users(id) on delete restrict,
  template_id text not null,
  template_version text,
  schema_version text not null,
  status text not null default 'created'
    check (status in (
      'created', 'previewing', 'ready', 'blocked', 'committing',
      'committed', 'failed', 'rolled_back', 'expired'
    )),
  selected_sheets text[] not null default '{}',
  summary jsonb not null default '{}'::jsonb,
  idempotency_key text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  committed_at timestamptz,
  rolled_back_at timestamptz,
  rollback_expires_at timestamptz,
  unique (organization_id, idempotency_key)
);

create index if not exists idx_import_jobs_org_created
  on import_jobs (organization_id, created_at desc);

create index if not exists idx_import_jobs_status
  on import_jobs (status, created_at);

create table if not exists import_rows (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references import_jobs(id) on delete cascade,
  sheet_name text not null,
  row_number integer not null check (row_number > 0),
  entity_type text not null,
  proposed_action text not null
    check (proposed_action in ('create', 'update', 'skip', 'warning', 'error')),
  selected boolean not null default true,
  target_entity_id text,
  source_payload jsonb not null default '{}'::jsonb,
  normalized_payload jsonb not null default '{}'::jsonb,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, sheet_name, row_number)
);

create index if not exists idx_import_rows_job_action
  on import_rows (job_id, proposed_action);

-- Every committed create or update receives an immutable before/after record.
-- These records are the source of truth for a later guarded rollback action.
create table if not exists import_changes (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references import_jobs(id) on delete restrict,
  import_row_id uuid references import_rows(id) on delete set null,
  organization_id uuid not null references organizations(id) on delete restrict,
  entity_type text not null,
  entity_id text not null,
  operation text not null check (operation in ('create', 'update')),
  before_payload jsonb,
  after_payload jsonb not null,
  applied_at timestamptz not null default now(),
  rolled_back_at timestamptz,
  rolled_back_by uuid references users(id) on delete set null
);

create index if not exists idx_import_changes_job
  on import_changes (job_id, applied_at);

create index if not exists idx_import_changes_entity
  on import_changes (organization_id, entity_type, entity_id);

-- Only metadata and a private storage reference belong here. Workbook bytes
-- must never be placed in a public bucket or stored in this table.
create table if not exists import_files (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references import_jobs(id) on delete cascade,
  storage_key text not null,
  original_filename text not null,
  content_type text not null,
  byte_size bigint not null check (byte_size >= 0),
  sha256 text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  deleted_at timestamptz
);

create index if not exists idx_import_files_expiration
  on import_files (expires_at)
  where deleted_at is null;

commit;
