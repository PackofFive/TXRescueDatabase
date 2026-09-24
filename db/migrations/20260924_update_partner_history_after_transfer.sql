-- Keep an existing shelter/rescue partner record's "last worked with" date
-- in sync with completed animal transfers. This never creates a partner,
-- restores an archived partner, or changes the shelter's private status.

begin;

create or replace function pof_update_partner_history_after_transfer()
returns trigger
language plpgsql
as $$
begin
  update shelter_rescue_partners
  set last_worked_with_at = greatest(
        coalesce(last_worked_with_at, new.completed_at::date),
        new.completed_at::date
      ),
      updated_at = now()
  where shelter_org_id = new.from_org_id
    and rescue_org_id = new.to_org_id;

  return new;
end;
$$;

drop trigger if exists animal_transfer_updates_partner_history on animal_transfer_events;
create trigger animal_transfer_updates_partner_history
after insert on animal_transfer_events
for each row execute function pof_update_partner_history_after_transfer();

-- Bring existing saved relationships up to date from retained transfers.
update shelter_rescue_partners relationship
set last_worked_with_at = greatest(
      coalesce(relationship.last_worked_with_at, latest.latest_transfer_date),
      latest.latest_transfer_date
    ),
    updated_at = now()
from (
  select
    from_org_id,
    to_org_id,
    max(completed_at)::date as latest_transfer_date
  from animal_transfer_events
  group by from_org_id, to_org_id
) latest
where relationship.shelter_org_id = latest.from_org_id
  and relationship.rescue_org_id = latest.to_org_id
  and (
    relationship.last_worked_with_at is null
    or relationship.last_worked_with_at < latest.latest_transfer_date
  );

commit;
