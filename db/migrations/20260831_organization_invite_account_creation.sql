-- Pack of Five atomic account creation from a secure organization invitation
-- Safe to run more than once.

begin;

create or replace function pof_create_account_from_organization_invite(
  p_token_hash text,
  p_password_hash text
)
returns jsonb
language plpgsql
as $$
declare
  v_invite organization_access_invites%rowtype;
  v_user users%rowtype;
  v_membership organization_memberships%rowtype;
begin
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

  if exists (
    select 1 from users where lower(email) = lower(v_invite.email)
  ) then
    raise exception 'A Pack of Five account already uses this email. Sign in before accepting the invitation.';
  end if;

  insert into users (
    email,
    password_hash,
    role,
    org_id,
    status
  ) values (
    lower(trim(v_invite.email)),
    p_password_hash,
    'org',
    v_invite.org_id,
    'approved'
  )
  returning * into v_user;

  insert into organization_memberships (
    user_id,
    org_id,
    access_level,
    status,
    granted_by,
    granted_at,
    updated_at
  ) values (
    v_user.id,
    v_invite.org_id,
    v_invite.access_level,
    'active',
    v_invite.invited_by,
    now(),
    now()
  )
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
    'Created verified account and accepted secure team invitation'
  );

  return jsonb_build_object(
    'ok', true,
    'accountCreated', true,
    'email', v_user.email,
    'organizationId', v_invite.org_id,
    'membershipId', v_membership.id,
    'accessLevel', v_invite.access_level
  );
end;
$$;

comment on function pof_create_account_from_organization_invite(text, text) is
  'Atomically creates an approved account and accepts the email-verified organization invitation.';

commit;
