begin;

alter table volunteer_profiles
  add column if not exists user_id uuid references users(id) on delete set null,
  add column if not exists availability_status text not null default 'available',
  add column if not exists pause_new_assignments boolean not null default false,
  add column if not exists weekly_hours_capacity integer;

create unique index if not exists volunteer_profiles_user_unique
  on volunteer_profiles (user_id)
  where user_id is not null;

alter table volunteer_profiles
  drop constraint if exists volunteer_profiles_availability_status_check;

alter table volunteer_profiles
  add constraint volunteer_profiles_availability_status_check
  check (
    availability_status in (
      'available',
      'limited',
      'near_capacity',
      'at_capacity',
      'temporarily_unavailable'
    )
  );

alter table volunteer_profiles
  drop constraint if exists volunteer_profiles_weekly_hours_capacity_check;

alter table volunteer_profiles
  add constraint volunteer_profiles_weekly_hours_capacity_check
  check (
    weekly_hours_capacity is null
    or weekly_hours_capacity between 0 and 168
  );

alter table volunteer_organization_relationships
  add column if not exists portal_access_level text not null default 'none',
  add column if not exists verified_weekly_hours integer,
  add column if not exists capacity_status text not null default 'review_required',
  add column if not exists capacity_reviewed_at timestamptz,
  add column if not exists capacity_reviewed_by uuid references users(id) on delete set null;

alter table volunteer_organization_relationships
  drop constraint if exists volunteer_relationships_portal_access_level_check;

alter table volunteer_organization_relationships
  add constraint volunteer_relationships_portal_access_level_check
  check (
    portal_access_level in (
      'none',
      'viewer',
      'contributor',
      'coordinator'
    )
  );

alter table volunteer_organization_relationships
  drop constraint if exists volunteer_relationships_verified_weekly_hours_check;

alter table volunteer_organization_relationships
  add constraint volunteer_relationships_verified_weekly_hours_check
  check (
    verified_weekly_hours is null
    or verified_weekly_hours between 0 and 168
  );

alter table volunteer_organization_relationships
  drop constraint if exists volunteer_relationships_capacity_status_check;

alter table volunteer_organization_relationships
  add constraint volunteer_relationships_capacity_status_check
  check (
    capacity_status in (
      'review_required',
      'available',
      'limited',
      'near_capacity',
      'at_capacity',
      'temporarily_unavailable'
    )
  );

create table if not exists volunteer_category_approvals (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null
    references volunteer_organization_relationships(id) on delete cascade,
  category text not null
    check (
      category in (
        'foster_care',
        'transport',
        'shelter_visits',
        'events_outreach',
        'photography_media',
        'fundraising_donations',
        'administrative_help',
        'medical_support',
        'volunteer_coordination'
      )
    ),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'suspended', 'declined')),
  permission_level text not null default 'view'
    check (permission_level in ('view', 'contribute', 'coordinate')),
  approved_at timestamptz,
  approved_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (relationship_id, category)
);

create index if not exists volunteer_category_approvals_relationship_idx
  on volunteer_category_approvals (relationship_id, status, category);

comment on column volunteer_organization_relationships.portal_access_level is
  'Volunteer Portal access only. This never grants Rescue Manager or platform Admin access.';

comment on table volunteer_category_approvals is
  'Each rescue independently approves a volunteer service category and permission level. Approval by one rescue does not apply to another rescue.';

comment on column volunteer_category_approvals.category is
  'Supported categories include Foster Care, Transport, Shelter Visits, Events & Outreach, Photography & Media, Fundraising & Donations, Administrative Help, Medical Support, and Volunteer Coordination.';

commit;
