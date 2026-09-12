-- Private Shelter Express notes and append-only activity history for help offers.
-- Safe to run more than once.

begin;

alter table animal_help_offers
  add column if not exists internal_notes text not null default '';

create table if not exists shelter_offer_activity (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references animal_help_offers(id) on delete restrict,
  org_id uuid not null references organizations(id) on delete restrict,
  actor_user_id uuid references users(id) on delete set null,
  action text not null check (action in ('note_added', 'status_changed')),
  previous_status text,
  new_status text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists shelter_offer_activity_offer_created_idx
  on shelter_offer_activity (offer_id, created_at desc);

create or replace function pof_prevent_shelter_offer_activity_change()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Shelter offer activity is append-only and cannot be changed or deleted.';
end;
$$;

drop trigger if exists shelter_offer_activity_immutable on shelter_offer_activity;
create trigger shelter_offer_activity_immutable
before update or delete on shelter_offer_activity
for each row execute function pof_prevent_shelter_offer_activity_change();

commit;
