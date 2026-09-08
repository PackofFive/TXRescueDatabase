begin;

create or replace function pof_enforce_one_active_organization_per_user()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'active' and exists (
    select 1
    from organization_memberships existing
    where existing.user_id = new.user_id
      and existing.status = 'active'
      and existing.org_id <> new.org_id
      and (tg_op = 'INSERT' or existing.id <> new.id)
  ) then
    raise exception 'This Pack of Five login is already connected to another organization. Use a different email for this organization.'
      using errcode = '23505';
  end if;

  return new;
end;
$$;

drop trigger if exists organization_memberships_one_active_org on organization_memberships;

create trigger organization_memberships_one_active_org
before insert or update of user_id, org_id, status
on organization_memberships
for each row
execute function pof_enforce_one_active_organization_per_user();

comment on function pof_enforce_one_active_organization_per_user() is
  'Prevents a Pack of Five login from holding active access to more than one organization. Personal foster, volunteer, pet-owner, and platform-admin access remain additive.';

commit;
