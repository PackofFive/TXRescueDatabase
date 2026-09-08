begin;

-- Keep cncashen@gmail.com connected to Test Page - Pack Of Five.
-- Remove only its organization access to Test Shelter; no organization or
-- animal records are deleted.
update organization_memberships
set
  status = 'removed',
  shelter_express_access = false,
  removed_at = now(),
  updated_at = now()
where id = 'e458b5be-79b5-4215-bc68-845895f1d7c3'::uuid
  and user_id = 'fede3619-c339-4865-bce4-ad8863bada87'::uuid
  and org_id = '32bd17db-7f92-4514-b495-66f058131f75'::uuid;

-- Replace the old broad value with the current portal-routing value.
update organizations
set
  org_type = 'Private Shelter',
  updated_at = now()
where id = '32bd17db-7f92-4514-b495-66f058131f75'::uuid
  and name = 'Test Shelter';

-- End existing sessions so the header and portal access refresh immediately.
update users
set session_version = session_version + 1
where id = 'fede3619-c339-4865-bce4-ad8863bada87'::uuid;

insert into organization_access_audit (
  org_id,
  membership_id,
  affected_user_id,
  action,
  previous_access_level,
  reason
)
values (
  '32bd17db-7f92-4514-b495-66f058131f75'::uuid,
  'e458b5be-79b5-4215-bc68-845895f1d7c3'::uuid,
  'fede3619-c339-4865-bce4-ad8863bada87'::uuid,
  'membership_removed',
  'owner',
  'Separated rescue and shelter test access to enforce one organization per login'
);

commit;

select
  account.email,
  organization.name as organization_name,
  organization.org_type,
  membership.status,
  membership.shelter_express_access
from users account
join organization_memberships membership on membership.user_id = account.id
join organizations organization on organization.id = membership.org_id
where account.id = 'fede3619-c339-4865-bce4-ad8863bada87'::uuid
order by organization.name;
