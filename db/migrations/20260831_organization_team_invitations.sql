-- Pack of Five secure organization team invitations
-- Safe to run more than once.

begin;

create table if not exists organization_access_invites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  email text not null,
  access_level text not null
    check (access_level in ('administrator', 'contributor', 'viewer')),
  token_hash text not null unique,
  status text not null default 'sent'
    check (status in ('sent', 'accepted', 'cancelled', 'expired')),
  invited_by uuid not null references users(id) on delete restrict,
  accepted_by uuid references users(id) on delete set null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists organization_access_invites_active_unique
  on organization_access_invites (org_id, lower(email))
  where status = 'sent';

create index if not exists organization_access_invites_org_created_idx
  on organization_access_invites (org_id, created_at desc);

alter table organization_access_audit
  drop constraint if exists organization_access_audit_action_check;

alter table organization_access_audit
  add constraint organization_access_audit_action_check
  check (action in (
    'membership_created',
    'access_level_changed',
    'membership_suspended',
    'membership_restored',
    'membership_removed',
    'ownership_transferred',
    'invitation_sent',
    'invitation_resent',
    'invitation_cancelled',
    'invitation_accepted'
  ));

create or replace function pof_accept_organization_invite(
  p_token_hash text,
  p_user_id uuid
)
returns jsonb
language plpgsql
as $$
declare
  v_invite organization_access_invites%rowtype;
  v_user users%rowtype;
  v_membership organization_memberships%rowtype;
begin
  select * into v_user
  from users
  where id = p_user_id
    and status = 'approved';

  if v_user.id is null then
    raise exception 'An approved Pack of Five account is required.' using errcode = '42501';
  end if;

  select * into v_invite
  from organization_access_invites
  where token_hash = p_token_hash
  for update;

  if v_invite.id is null then
    raise exception 'This invitation is invalid.' using errcode = 'P0002';
  end if;

  if v_invite.status <> 'sent' then
    raise exception 'This invitation is no longer available.';
  end if;

  if v_invite.expires_at <= now() then
    update organization_access_invites
    set status = 'expired', updated_at = now()
    where id = v_invite.id;
    raise exception 'This invitation has expired. Ask the Organization Owner to resend it.';
  end if;

  if lower(trim(v_user.email)) <> lower(trim(v_invite.email)) then
    raise exception 'Sign in with the email address that received this invitation.' using errcode = '42501';
  end if;

  insert into organization_memberships (
    user_id,
    org_id,
    access_level,
    status,
    granted_by,
    granted_at,
    updated_at,
    suspended_at,
    removed_at
  ) values (
    v_user.id,
    v_invite.org_id,
    v_invite.access_level,
    'active',
    v_invite.invited_by,
    now(),
    now(),
    null,
    null
  )
  on conflict (org_id, user_id) do update
  set
    access_level = excluded.access_level,
    status = 'active',
    granted_by = excluded.granted_by,
    granted_at = now(),
    updated_at = now(),
    suspended_at = null,
    removed_at = null
  returning * into v_membership;

  update organization_access_invites
  set
    status = 'accepted',
    accepted_by = v_user.id,
    accepted_at = now(),
    updated_at = now()
  where id = v_invite.id;

  insert into organization_access_audit (
    org_id,
    membership_id,
    affected_user_id,
    actor_user_id,
    action,
    previous_access_level,
    new_access_level,
    reason
  ) values (
    v_invite.org_id,
    v_membership.id,
    v_user.id,
    v_user.id,
    'invitation_accepted',
    null,
    v_invite.access_level,
    'Accepted secure team invitation'
  );

  return jsonb_build_object(
    'ok', true,
    'organizationId', v_invite.org_id,
    'membershipId', v_membership.id,
    'accessLevel', v_invite.access_level
  );
end;
$$;

comment on table organization_access_invites is
  'Expiring, one-time, organization-specific invitations. Raw invitation tokens are never stored.';

comment on function pof_accept_organization_invite(text, uuid) is
  'Atomically validates and accepts a team invitation for the matching approved account email.';

commit;
