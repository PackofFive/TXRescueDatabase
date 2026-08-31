begin;

create extension if not exists pgcrypto;

create table if not exists volunteer_profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  city text,
  state text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists volunteer_profiles_email_unique
  on volunteer_profiles (lower(email))
  where email is not null and btrim(email) <> '';

create table if not exists volunteer_organization_relationships (
  id uuid primary key default gen_random_uuid(),
  volunteer_id uuid not null references volunteer_profiles(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'inactive', 'declined')),
  role_title text,
  skills text[] not null default '{}',
  availability_notes text,
  background_check_status text not null default 'not_started'
    check (background_check_status in ('not_started', 'pending', 'cleared', 'flagged')),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (volunteer_id, organization_id)
);

create index if not exists volunteer_relationships_organization_idx
  on volunteer_organization_relationships (organization_id, status, created_at desc);

comment on table volunteer_profiles is
  'Volunteer identities are separate from foster profiles. A person may have both profiles without either role granting the other role permissions.';

comment on table volunteer_organization_relationships is
  'Organization-specific volunteer approval, skills, availability, and screening. This table does not grant foster or portal access.';

commit;
