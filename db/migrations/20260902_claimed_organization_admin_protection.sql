-- Pack of Five claimed-organization administrator assistance audit
-- Claimed organizations remain owner-controlled. Exceptional profile help must
-- be owner-requested, explained, and permanently attributable to an admin.

begin;

create table if not exists organization_admin_assistance_audit (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  actor_user_id uuid not null references users(id) on delete restrict,
  owner_request_confirmed boolean not null default false,
  support_reference text not null,
  reason text not null,
  changes jsonb not null,
  created_at timestamptz not null default now(),
  check (owner_request_confirmed = true),
  check (length(trim(support_reference)) >= 3),
  check (length(trim(reason)) >= 20)
);

create index if not exists organization_admin_assistance_org_created_idx
  on organization_admin_assistance_audit (org_id, created_at desc);

comment on table organization_admin_assistance_audit is
  'Permanent break-glass history for owner-requested administrator assistance on claimed organization profiles.';

commit;
