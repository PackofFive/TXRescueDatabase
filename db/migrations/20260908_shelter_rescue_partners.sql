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

alter table shelter_rescue_partners
  add column if not exists relationship_status text not null default 'saved',
  add column if not exists private_notes text,
  add column if not exists primary_contact text,
  add column if not exists last_worked_with_at date,
  add column if not exists next_review_at date;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'shelter_rescue_partners_relationship_status_check'
  ) then
    alter table shelter_rescue_partners
      add constraint shelter_rescue_partners_relationship_status_check
      check (relationship_status in ('saved','preferred','active','paused','do_not_contact'));
  end if;
end
$$;
comment on table shelter_rescue_partners is 'Rescue organizations intentionally saved by a shelter as frequent or trusted partners.';
commit;
