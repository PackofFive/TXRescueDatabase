begin;
create table if not exists shelter_rescue_partners (
  id uuid primary key default gen_random_uuid(),
  shelter_org_id uuid not null references organizations(id) on delete cascade,
  rescue_org_id uuid not null references organizations(id) on delete cascade,
  added_by uuid references users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint shelter_rescue_partners_different_orgs check (shelter_org_id <> rescue_org_id),
  constraint shelter_rescue_partners_unique unique (shelter_org_id, rescue_org_id)
);
create index if not exists shelter_rescue_partners_shelter_idx on shelter_rescue_partners (shelter_org_id, created_at desc);
comment on table shelter_rescue_partners is 'Rescue organizations intentionally saved by a shelter as frequent or trusted partners.';
commit;
