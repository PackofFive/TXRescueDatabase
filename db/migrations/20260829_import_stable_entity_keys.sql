-- Organization-scoped stable IDs used for exact workbook matching.
-- This does not change rescue records or run an import.

begin;

create extension if not exists "pgcrypto";

create table if not exists import_entity_keys (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  entity_type text not null check (entity_type in ('animal', 'medical', 'task')),
  external_id text not null check (external_id <> ''),
  entity_id uuid not null,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, entity_type, external_id),
  unique (organization_id, entity_type, entity_id)
);

create index if not exists idx_import_entity_keys_exact_match
  on import_entity_keys (organization_id, entity_type, external_id);

commit;
