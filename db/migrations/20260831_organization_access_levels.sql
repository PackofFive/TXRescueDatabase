-- Pack of Five organization access levels
-- Safe to run more than once.
--
-- Levels are intentionally separate from users.role:
-- owner         Full organization control, including access management.
-- administrator Organization settings and public profile editing.
-- contributor   Operational record work, but no organization settings.
-- viewer        Read-only Rescue Manager access.

begin;

create extension if not exists "pgcrypto";

create table if not exists organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  access_level text not null default 'viewer'
    check (access_level in ('owner', 'administrator', 'contributor', 'viewer')),
  status text not null default 'active'
    check (status in ('invited', 'active', 'suspended', 'removed')),
  granted_by uuid references users(id) on delete set null,
  granted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  suspended_at timestamptz,
  removed_at timestamptz,
  unique (organization_id, user_id)
);

create index if not exists organization_memberships_user_idx
  on organization_memberships (user_id, status, organization_id);

create index if not exists organization_memberships_org_idx
  on organization_memberships (organization_id, status, access_level);

create unique index if not exists organization_one_active_owner_idx
  on organization_memberships (organization_id)
  where access_level = 'owner' and status = 'active';

create table if not exists organization_access_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  membership_id uuid references organization_memberships(id) on delete set null,
  affected_user_id uuid references users(id) on delete set null,
  actor_user_id uuid references users(id) on delete set null,
  action text not null
    check (action in (
      'membership_created',
      'access_level_changed',
      'membership_suspended',
      'membership_restored',
      'membership_removed',
      'ownership_transferred'
    )),
  previous_access_level text,
  new_access_level text,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists organization_access_audit_org_created_idx
  on organization_access_audit (organization_id, created_at desc);

-- Preserve existing access without giving every current organization user
-- ownership. The earliest approved organization account becomes the initial
-- owner; additional approved accounts become administrators.
with ranked_users as (
  select
    u.id as user_id,
    u.org_id as organization_id,
    row_number() over (
      partition by u.org_id
      order by u.created_at asc, u.id asc
    ) as member_number
  from users u
  where u.role = 'org'
    and u.status = 'approved'
    and u.org_id is not null
)
insert into organization_memberships (
  organization_id,
  user_id,
  access_level,
  status
)
select
  ranked_users.organization_id,
  ranked_users.user_id,
  case
    when ranked_users.member_number = 1 then 'owner'
    else 'administrator'
  end,
  'active'
from ranked_users
on conflict (organization_id, user_id) do nothing;

comment on table organization_memberships is
  'Organization-specific Rescue Manager access. Membership in one organization never grants access to another.';

comment on column organization_memberships.access_level is
  'Owner controls organization access; administrator can edit organization settings; contributor handles operational records; viewer is read-only.';

comment on table organization_access_audit is
  'Permanent security history for organization membership, permission, suspension, removal, and ownership changes.';

commit;
