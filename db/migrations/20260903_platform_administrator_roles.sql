begin;

create table if not exists platform_administrator_memberships (
  user_id uuid primary key references users(id) on delete cascade,
  access_level text not null check (access_level in ('platform_owner', 'case_administrator', 'directory_moderator')),
  status text not null default 'active' check (status in ('active', 'suspended')),
  granted_by uuid references users(id) on delete set null,
  granted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists platform_administrator_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  access_level text not null check (access_level in ('platform_owner', 'case_administrator', 'directory_moderator')),
  token_hash text not null unique,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired')),
  invited_by uuid not null references users(id),
  accepted_by uuid references users(id),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists platform_admin_pending_invitation_email_idx
  on platform_administrator_invitations (lower(email))
  where status = 'pending';

create table if not exists platform_administrator_audit (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references users(id) on delete set null,
  target_user_id uuid references users(id) on delete set null,
  invitation_id uuid references platform_administrator_invitations(id) on delete set null,
  action text not null,
  previous_access_level text,
  new_access_level text,
  reason text,
  created_at timestamptz not null default now()
);

-- Preserve every existing administrator's access during rollout. Their access
-- can be narrowed from the new Admin Team panel after deployment.
insert into platform_administrator_memberships (
  user_id, access_level, status, granted_by
)
select id, 'platform_owner', 'active', id
from users
where role = 'admin' and status = 'approved'
on conflict (user_id) do nothing;

comment on table platform_administrator_memberships is
  'Platform-only administration roles. These never grant access to a rescue organization workspace.';
comment on table platform_administrator_invitations is
  'Single-use, exact-email, short-lived invitations issued only by an active Platform Owner.';
comment on table platform_administrator_audit is
  'Immutable history of platform administrator invitations and access changes.';

commit;
