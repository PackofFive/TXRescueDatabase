-- TX Animal Rescue & Resource Database — schema for Neon Postgres
-- Run this once against your Neon database (via the Neon SQL editor,
-- or `psql $DATABASE_URL -f db/schema.sql`).

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ─────────────────────────────────────────────────────────────
-- ORGANIZATIONS — one row per rescue/shelter/resource org.
-- Mirrors the Master Directory tab of the source spreadsheet.
-- ─────────────────────────────────────────────────────────────
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org_type text,                    -- Rescue / Municipal Shelter / Wildlife Rescue / etc.
  species text[] default '{}',      -- e.g. {Dog,Cat}
  focus text,
  specialty text,
  c3_status text,                   -- 501(c)(3): Yes / No / Unclear
  city text,
  county text,
  service_area text,
  region text,
  statewide text,                   -- Yes / No / Unclear
  intake_status text,
  intake_restrictions text,
  intake_form_url text,
  website text,
  social_media text,
  public_email text,
  public_phone text,
  resource_status text default 'Verification Needed',
  last_verified date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- CAPABILITIES — one row per org, one column per capability flag.
-- Status values are always one of the five in CAPABILITY_STATUSES
-- (see lib/constants.ts) — enforced at the application layer so
-- the UI can keep offering exactly those five options.
-- "Unknown" is the default and must never be silently treated as "No".
-- ─────────────────────────────────────────────────────────────
create table capabilities (
  org_id uuid primary key references organizations(id) on delete cascade,
  owner_surrender text not null default 'Unknown',
  shelter_pull text not null default 'Unknown',
  stray_found text not null default 'Unknown',
  emergency_medical text not null default 'Unknown',
  cruelty_neglect text not null default 'Unknown',
  behavioral text not null default 'Unknown',
  senior text not null default 'Unknown',
  special_needs text not null default 'Unknown',
  neonatal text not null default 'Unknown',
  pregnant_nursing text not null default 'Unknown',
  breed_specific text not null default 'Unknown',
  wildlife text not null default 'Unknown',
  farm_equine text not null default 'Unknown',
  transport text not null default 'Unknown',
  temporary_foster text not null default 'Unknown',
  pet_retention text not null default 'Unknown',
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- USERS — org accounts and admin accounts.
-- role = 'org' | 'admin'. An 'org' user is tied to exactly one
-- organization via org_id and can only ever affect that org's data
-- — enforced in the API layer on every request, not just the UI.
-- ─────────────────────────────────────────────────────────────
create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role text not null default 'org' check (role in ('org','admin')),
  org_id uuid references organizations(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- SUBMISSIONS — the review queue. A pending change to one field
-- of one organization, submitted by one user. Approving a
-- submission is the ONLY way a review-required field changes;
-- auto-publish fields are written directly by the API and never
-- pass through this table.
-- ─────────────────────────────────────────────────────────────
create table submissions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  submitted_by uuid not null references users(id),
  target_table text not null check (target_table in ('organizations','capabilities')),
  field_name text not null,
  field_label text not null,
  old_value text,
  new_value text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by uuid references users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- UPDATE LOG — permanent audit trail. Every published change,
-- whether auto-published or approved from the queue, gets a row
-- here. This is your Update Log tab, made durable.
-- ─────────────────────────────────────────────────────────────
create table update_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete set null,
  changed_by uuid references users(id),
  field_name text not null,
  old_value text,
  new_value text,
  source text not null default 'org_submission' check (source in ('org_submission','admin_direct','import')),
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- INVITES — self-signup-with-approval flow. An admin (or an org
-- requesting access) creates an invite tied to an email and,
-- once claimed, a pending user account is created for admin approval.
-- ─────────────────────────────────────────────────────────────
create table invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  org_id uuid references organizations(id) on delete set null,
  invited_by uuid references users(id),
  status text not null default 'sent' check (status in ('sent','claimed','expired')),
  created_at timestamptz not null default now()
);

create index idx_organizations_region on organizations(region);
create index idx_organizations_county on organizations(county);
create index idx_submissions_status on submissions(status);
create index idx_submissions_org on submissions(org_id);
create index idx_update_log_org on update_log(org_id);
create index idx_users_org on users(org_id);
