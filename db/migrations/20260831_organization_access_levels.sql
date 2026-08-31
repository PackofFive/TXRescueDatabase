-- Pack of Five organization access levels
-- Safe to run more than once and compatible with the existing
-- organization_memberships table.

begin;

create extension if not exists "pgcrypto";

-- Keep the existing org_id, role, and permissions columns. Add the clearer
-- access level and lifecycle fields needed for secure organization access.
alter table organization_memberships
  add column if not exists access_level text,
  add column if not exists status text not null default 'active',
  add column if not exists granted_by uuid references users(id) on delete set null,
  add column if not exists granted_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists suspended_at timestamptz,
  add column if not exists removed_at timestamptz;

-- Translate any earlier role names into the new explicit levels.
update organization_memberships
set access_level = case
  when lower(role) = 'owner' then 'owner'
  when lower(role) in ('admin', 'administrator') then 'administrator'
  when lower(role) in ('member', 'editor', 'contributor') then 'contributor'
  when lower(role) in ('view', 'viewer', 'read_only', 'readonly') then 'viewer'
  else 'viewer'
end
where access_level is null
   or access_level not in ('owner', 'administrator', 'contributor', 'viewer');

alter table organization_memberships
  alter column access_level set default 'viewer',
  alter column access_level set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'organization_memberships_access_level_check'
  ) then
    alter table organization_memberships
      add constraint organization_memberships_access_level_check
      check (access_level in ('owner', 'administrator', 'contributor', 'viewer'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'organization_memberships_status_check'
  ) then
    alter table organization_memberships
      add constraint organization_memberships_status_check
      check (status in ('invited', 'active', 'suspended', 'removed'));
  end if;
end
$$;

create unique index if not exists organization_memberships_org_user_unique
  on organization_memberships (org_id, user_id);

create index if not exists organization_memberships_user_idx
  on organization_memberships (user_id, status, org_id);

create index if not exists organization_memberships_org_idx
  on organization_memberships (org_id, status, access_level);

-- Preserve approved organization users that predate the membership table.
-- They start as administrators. The owner assignment below safely promotes
-- exactly one active member per organization when no owner exists.
insert into organization_memberships (
  user_id,
  org_id,
  access_level,
  status
)
select
  users.id,
  users.org_id,
  'administrator',
  'active'
from users
where users.role = 'org'
  and users.status = 'approved'
  and users.org_id is not null
  and not exists (
    select 1
    from organization_memberships membership
    where membership.user_id = users.id
      and membership.org_id = users.org_id
  );

-- If an organization has no active owner, promote its earliest active member.
with organizations_without_owner as (
  select distinct membership.org_id
  from organization_memberships membership
  where membership.status = 'active'
    and not exists (
      select 1
      from organization_memberships owner_membership
      where owner_membership.org_id = membership.org_id
        and owner_membership.status = 'active'
        and owner_membership.access_level = 'owner'
    )
), first_membership as (
  select distinct on (membership.org_id)
    membership.id
  from organization_memberships membership
  join organizations_without_owner missing_owner
    on missing_owner.org_id = membership.org_id
  where membership.status = 'active'
  order by membership.org_id, membership.created_at asc, membership.id asc
)
update organization_memberships membership
set
  access_level = 'owner',
  updated_at = now()
from first_membership
where membership.id = first_membership.id;

create unique index if not exists organization_one_active_owner_idx
  on organization_memberships (org_id)
  where access_level = 'owner' and status = 'active';

create table if not exists organization_access_audit (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
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
  on organization_access_audit (org_id, created_at desc);

comment on table organization_memberships is
  'Organization-specific Rescue Manager access. Membership in one organization never grants access to another.';

comment on column organization_memberships.access_level is
  'Owner controls organization access; administrator can edit organization settings; contributor handles operational records; viewer is read-only.';

comment on table organization_access_audit is
  'Permanent security history for organization membership, permission, suspension, removal, and ownership changes.';

commit;
