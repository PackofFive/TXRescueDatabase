-- High-trust confirmation receipts for Rescue Manager imports.
-- This migration does not import or change rescue records.

begin;

create extension if not exists "pgcrypto";

-- Preview permission and commit permission are intentionally separate so
-- future admin levels can review imports without being allowed to run them.
insert into user_permissions (user_id, permission_key)
select u.id, 'rescue_workbook_commit'
from users u
where u.role = 'admin'
  and u.status = 'approved'
  and not exists (
    select 1
    from user_permissions up
    where up.user_id = u.id
      and up.permission_key = 'rescue_workbook_commit'
      and up.organization_id is null
      and up.revoked_at is null
  );

create table if not exists import_confirmations (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references import_jobs(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete restrict,
  preflight_digest text not null
    check (preflight_digest ~ '^[0-9a-f]{64}$'),
  selected_count integer not null check (selected_count > 0),
  confirmed_by uuid not null references users(id) on delete restrict,
  confirmed_at timestamptz not null default now(),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  revoked_at timestamptz,
  check (expires_at > confirmed_at)
);

-- A job may have only one active, unconsumed confirmation. A new safety check
-- or changed row selection revokes the old receipt before creating another.
create unique index if not exists uq_import_confirmations_active_job
  on import_confirmations (job_id)
  where consumed_at is null and revoked_at is null;

create index if not exists idx_import_confirmations_expiration
  on import_confirmations (expires_at)
  where consumed_at is null and revoked_at is null;

create index if not exists idx_import_confirmations_org
  on import_confirmations (organization_id, confirmed_at desc);

commit;
