-- Preserve what the animal and organizations were called when custody changed.
-- These values live on the existing immutable transfer record so later profile
-- edits cannot rewrite the historical handoff.

begin;

alter table animal_transfer_events
  add column if not exists animal_snapshot jsonb,
  add column if not exists from_organization_name text,
  add column if not exists to_organization_name text,
  add column if not exists snapshot_captured_at timestamptz;

create or replace function pof_capture_animal_transfer_snapshot()
returns trigger
language plpgsql
as $$
declare
  v_animal animals%rowtype;
begin
  select * into v_animal
  from animals
  where id = new.animal_id;

  if not found then
    raise exception 'Animal not found for transfer snapshot.';
  end if;

  select name into new.from_organization_name
  from organizations
  where id = new.from_org_id;

  select name into new.to_organization_name
  from organizations
  where id = new.to_org_id;

  new.animal_snapshot := jsonb_build_object(
    'animalId', v_animal.id,
    'name', v_animal.name,
    'temporaryName', v_animal.temporary_name,
    'publicName', v_animal.public_name,
    'species', v_animal.species,
    'publicSpecies', v_animal.public_species,
    'breedOrType', v_animal.breed_or_type,
    'publicBreedOrType', v_animal.public_breed_or_type,
    'sex', v_animal.sex,
    'birthDate', v_animal.birth_date,
    'weightLbs', v_animal.weight_lbs,
    'urgency', v_animal.urgency,
    'custody', v_animal.custody,
    'placement', v_animal.placement,
    'notes', v_animal.notes,
    'publicSummary', v_animal.public_summary,
    'publicNeed', v_animal.public_need,
    'externalListingUrl', v_animal.external_listing_url
  );
  new.snapshot_captured_at := coalesce(new.completed_at, now());

  return new;
end;
$$;

drop trigger if exists animal_transfer_capture_snapshot on animal_transfer_events;
create trigger animal_transfer_capture_snapshot
before insert on animal_transfer_events
for each row execute function pof_capture_animal_transfer_snapshot();

comment on column animal_transfer_events.animal_snapshot is
  'Immutable animal identity and intake snapshot captured immediately before custody transfer.';
comment on column animal_transfer_events.snapshot_captured_at is
  'Time the immutable transfer snapshot was captured; null on legacy transfers created before snapshot support.';

commit;
