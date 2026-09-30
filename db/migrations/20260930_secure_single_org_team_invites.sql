-- Enforce one managed organization per login at invitation acceptance time.
-- Existing foster, volunteer, and pet-owner profiles remain attached to the login.
-- Safe to run more than once.

begin;

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
  v_other_organization_name text;
  v_org_type text;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));

  select * into v_user from users where id = p_user_id and status = 'approved';
  if v_user.id is null then raise exception 'An approved Pack of Five account is required.' using errcode = '42501'; end if;
  if v_user.role = 'admin' then raise exception 'Platform administrator accounts cannot accept organization team invitations.' using errcode = '42501'; end if;

  select * into v_invite from organization_access_invites where token_hash = p_token_hash for update;
  if v_invite.id is null then raise exception 'This invitation is invalid.' using errcode = 'P0002'; end if;
  if v_invite.status <> 'sent' then raise exception 'This invitation is no longer available.'; end if;
  if v_invite.expires_at <= now() then
    update organization_access_invites set status = 'expired', updated_at = now() where id = v_invite.id;
    raise exception 'This invitation has expired. Ask the Organization Owner to resend it.';
  end if;
  if lower(trim(v_user.email)) <> lower(trim(v_invite.email)) then
    raise exception 'Sign in with the email address that received this invitation.' using errcode = '42501';
  end if;

  select organization.name into v_other_organization_name
  from organization_memberships membership
  join organizations organization on organization.id = membership.org_id
  where membership.user_id = v_user.id
    and membership.status = 'active'
    and membership.org_id <> v_invite.org_id
  limit 1;
  if v_other_organization_name is not null then
    raise exception 'This login is already connected to %. Each login may manage only one organization. Use a different email for this organization.', v_other_organization_name using errcode = '23505';
  end if;

  select org_type into v_org_type from organizations where id = v_invite.org_id;
  if v_invite.shelter_express_access and coalesce(v_org_type, '') not in ('Shelter','Municipal Shelter','Private Shelter','Animal Control') then
    raise exception 'Shelter Express access can only be granted by a shelter organization.' using errcode = '42501';
  end if;

  insert into organization_memberships (
    user_id, org_id, access_level, status, shelter_express_access,
    granted_by, granted_at, updated_at, suspended_at, removed_at
  ) values (
    v_user.id, v_invite.org_id, v_invite.access_level, 'active', v_invite.shelter_express_access,
    v_invite.invited_by, now(), now(), null, null
  )
  on conflict (org_id, user_id) do update set
    access_level = excluded.access_level,
    status = 'active',
    shelter_express_access = excluded.shelter_express_access,
    granted_by = excluded.granted_by,
    granted_at = now(),
    updated_at = now(),
    suspended_at = null,
    removed_at = null
  returning * into v_membership;

  update users set org_id = v_invite.org_id, role = 'org' where id = v_user.id;
  update organization_access_invites set status = 'accepted', accepted_by = v_user.id, accepted_at = now(), updated_at = now() where id = v_invite.id;

  insert into organization_access_audit (
    org_id, membership_id, affected_user_id, actor_user_id, action,
    previous_access_level, new_access_level, reason
  ) values (
    v_invite.org_id, v_membership.id, v_user.id, v_user.id, 'invitation_accepted',
    null, v_invite.access_level,
    case when v_invite.shelter_express_access then 'Accepted secure Shelter Express staff invitation' else 'Accepted secure team invitation' end
  );

  return jsonb_build_object('ok',true,'organizationId',v_invite.org_id,'membershipId',v_membership.id,'accessLevel',v_invite.access_level,'shelterExpressAccess',v_invite.shelter_express_access);
end;
$$;

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
  v_org_type text;
begin
  select * into v_invite from organization_access_invites where token_hash = p_token_hash for update;
  if v_invite.id is null then raise exception 'This invitation is invalid.' using errcode = 'P0002'; end if;
  if v_invite.status <> 'sent' then raise exception 'This invitation is no longer available.'; end if;
  if v_invite.expires_at <= now() then
    update organization_access_invites set status = 'expired', updated_at = now() where id = v_invite.id;
    raise exception 'This invitation has expired. Ask the Organization Owner to resend it.';
  end if;
  if exists (select 1 from users where lower(email) = lower(v_invite.email)) then
    raise exception 'A Pack of Five account already uses this email. Sign in before accepting the invitation.';
  end if;

  select org_type into v_org_type from organizations where id = v_invite.org_id;
  if v_invite.shelter_express_access and coalesce(v_org_type, '') not in ('Shelter','Municipal Shelter','Private Shelter','Animal Control') then
    raise exception 'Shelter Express access can only be granted by a shelter organization.' using errcode = '42501';
  end if;

  insert into users (email,password_hash,role,org_id,status)
  values (lower(trim(v_invite.email)),p_password_hash,'org',v_invite.org_id,'approved')
  returning * into v_user;

  insert into organization_memberships (
    user_id,org_id,access_level,status,shelter_express_access,granted_by,granted_at,updated_at
  ) values (
    v_user.id,v_invite.org_id,v_invite.access_level,'active',v_invite.shelter_express_access,v_invite.invited_by,now(),now()
  ) returning * into v_membership;

  update organization_access_invites set status='accepted',accepted_by=v_user.id,accepted_at=now(),updated_at=now() where id=v_invite.id;
  insert into organization_access_audit (
    org_id,membership_id,affected_user_id,actor_user_id,action,previous_access_level,new_access_level,reason
  ) values (
    v_invite.org_id,v_membership.id,v_user.id,v_user.id,'invitation_accepted',null,v_invite.access_level,
    case when v_invite.shelter_express_access then 'Created account and accepted Shelter Express staff invitation' else 'Created verified account and accepted secure team invitation' end
  );

  return jsonb_build_object('ok',true,'accountCreated',true,'email',v_user.email,'organizationId',v_invite.org_id,'membershipId',v_membership.id,'accessLevel',v_invite.access_level,'shelterExpressAccess',v_invite.shelter_express_access);
end;
$$;

comment on function pof_accept_organization_invite(text,uuid) is
  'Atomically accepts an exact-email invitation while enforcing one active managed organization per non-admin login.';
comment on function pof_create_account_from_organization_invite(text,text) is
  'Atomically creates an organization-enabled account from an exact-email invitation.';

commit;
