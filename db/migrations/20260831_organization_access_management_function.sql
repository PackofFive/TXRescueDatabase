-- Pack of Five guarded organization access management
-- Safe to run more than once.

begin;

create or replace function pof_manage_organization_access(
  p_org_id uuid,
  p_actor_id uuid,
  p_membership_id uuid,
  p_action text,
  p_new_access_level text default null,
  p_reason text default null
)
returns jsonb
language plpgsql
as $$
declare
  v_actor_is_platform_admin boolean := false;
  v_actor_membership organization_memberships%rowtype;
  v_target organization_memberships%rowtype;
  v_previous_level text;
  v_previous_status text;
  v_current_owner organization_memberships%rowtype;
begin
  select exists (
    select 1
    from users
    where id = p_actor_id
      and role = 'admin'
      and status = 'approved'
  ) into v_actor_is_platform_admin;

  select *
  into v_actor_membership
  from organization_memberships
  where org_id = p_org_id
    and user_id = p_actor_id
    and status = 'active'
  for update;

  if not v_actor_is_platform_admin and (
    v_actor_membership.id is null
    or v_actor_membership.access_level <> 'owner'
  ) then
    raise exception 'Organization Owner access is required.' using errcode = '42501';
  end if;

  select *
  into v_target
  from organization_memberships
  where id = p_membership_id
    and org_id = p_org_id
  for update;

  if v_target.id is null then
    raise exception 'Organization membership not found.' using errcode = 'P0002';
  end if;

  v_previous_level := v_target.access_level;
  v_previous_status := v_target.status;

  if p_action = 'change_level' then
    if p_new_access_level not in ('administrator', 'contributor', 'viewer') then
      raise exception 'Choose Administrator, Contributor, or Viewer. Use ownership transfer to assign Owner.';
    end if;

    if v_target.access_level = 'owner' then
      raise exception 'The active Owner cannot be changed here. Transfer ownership instead.';
    end if;

    if v_target.status <> 'active' then
      raise exception 'Restore this membership before changing its access level.';
    end if;

    update organization_memberships
    set access_level = p_new_access_level, updated_at = now()
    where id = v_target.id;

    insert into organization_access_audit (
      org_id, membership_id, affected_user_id, actor_user_id, action,
      previous_access_level, new_access_level, reason
    ) values (
      p_org_id, v_target.id, v_target.user_id, p_actor_id,
      'access_level_changed', v_previous_level, p_new_access_level,
      nullif(trim(p_reason), '')
    );

  elsif p_action = 'suspend' then
    if v_target.access_level = 'owner' then
      raise exception 'Transfer ownership before suspending the current Owner.';
    end if;

    update organization_memberships
    set status = 'suspended', suspended_at = now(), removed_at = null, updated_at = now()
    where id = v_target.id;

    insert into organization_access_audit (
      org_id, membership_id, affected_user_id, actor_user_id, action,
      previous_access_level, new_access_level, reason
    ) values (
      p_org_id, v_target.id, v_target.user_id, p_actor_id,
      'membership_suspended', v_previous_level, v_previous_level,
      nullif(trim(p_reason), '')
    );

  elsif p_action = 'restore' then
    if v_target.status not in ('suspended', 'removed') then
      raise exception 'Only suspended or removed memberships can be restored.';
    end if;

    update organization_memberships
    set status = 'active', suspended_at = null, removed_at = null, updated_at = now()
    where id = v_target.id;

    insert into organization_access_audit (
      org_id, membership_id, affected_user_id, actor_user_id, action,
      previous_access_level, new_access_level, reason
    ) values (
      p_org_id, v_target.id, v_target.user_id, p_actor_id,
      'membership_restored', v_previous_level, v_previous_level,
      nullif(trim(p_reason), '')
    );

  elsif p_action = 'remove' then
    if v_target.access_level = 'owner' then
      raise exception 'Transfer ownership before removing the current Owner.';
    end if;

    update organization_memberships
    set status = 'removed', removed_at = now(), suspended_at = null, updated_at = now()
    where id = v_target.id;

    insert into organization_access_audit (
      org_id, membership_id, affected_user_id, actor_user_id, action,
      previous_access_level, new_access_level, reason
    ) values (
      p_org_id, v_target.id, v_target.user_id, p_actor_id,
      'membership_removed', v_previous_level, v_previous_level,
      nullif(trim(p_reason), '')
    );

  elsif p_action = 'transfer_ownership' then
    if v_target.status <> 'active' then
      raise exception 'Ownership can only be transferred to an active member.';
    end if;

    select *
    into v_current_owner
    from organization_memberships
    where org_id = p_org_id
      and status = 'active'
      and access_level = 'owner'
    for update;

    if v_current_owner.id is null then
      raise exception 'The organization does not have an active Owner.';
    end if;

    if v_current_owner.id = v_target.id then
      raise exception 'This member is already the Organization Owner.';
    end if;

    update organization_memberships
    set access_level = 'administrator', updated_at = now()
    where id = v_current_owner.id;

    update organization_memberships
    set access_level = 'owner', updated_at = now()
    where id = v_target.id;

    insert into organization_access_audit (
      org_id, membership_id, affected_user_id, actor_user_id, action,
      previous_access_level, new_access_level, reason
    ) values (
      p_org_id, v_target.id, v_target.user_id, p_actor_id,
      'ownership_transferred', v_previous_level, 'owner',
      nullif(trim(p_reason), '')
    );

  else
    raise exception 'Unknown organization access action.';
  end if;

  return jsonb_build_object(
    'ok', true,
    'organizationId', p_org_id,
    'membershipId', p_membership_id,
    'action', p_action,
    'previousAccessLevel', v_previous_level,
    'previousStatus', v_previous_status
  );
end;
$$;

comment on function pof_manage_organization_access(uuid, uuid, uuid, text, text, text) is
  'Atomically manages organization access. Only the active Organization Owner or an approved platform admin may call it successfully.';

commit;
