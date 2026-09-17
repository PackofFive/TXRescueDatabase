begin;

alter table animal_help_offers
  add column if not exists source_org_id uuid references organizations(id) on delete restrict,
  add column if not exists transfer_completed_at timestamptz,
  add column if not exists transfer_completed_by uuid references users(id) on delete set null;

update animal_help_offers offer
set source_org_id = animal.current_org_id
from animals animal
where animal.id = offer.animal_id
  and offer.offer_type = 'tag_request'
  and offer.source_org_id is null;

create table if not exists animal_transfer_events (
  id uuid primary key default gen_random_uuid(),
  animal_id uuid not null references animals(id) on delete restrict,
  offer_id uuid not null unique references animal_help_offers(id) on delete restrict,
  from_org_id uuid not null references organizations(id) on delete restrict,
  to_org_id uuid not null references organizations(id) on delete restrict,
  completed_by uuid references users(id) on delete set null,
  completed_at timestamptz not null default now(),
  note text
);

create index if not exists animal_transfer_events_animal_idx
  on animal_transfer_events (animal_id, completed_at desc);

create index if not exists animal_transfer_events_orgs_idx
  on animal_transfer_events (from_org_id, to_org_id, completed_at desc);

create or replace function prevent_animal_transfer_event_changes()
returns trigger
language plpgsql
as $$
begin
  raise exception 'Animal transfer records are permanent and cannot be changed or deleted.';
end;
$$;

drop trigger if exists animal_transfer_events_immutable on animal_transfer_events;
create trigger animal_transfer_events_immutable
before update or delete on animal_transfer_events
for each row execute function prevent_animal_transfer_event_changes();

create or replace function complete_shelter_tag_transfer(
  p_offer_id uuid,
  p_rescue_org_id uuid,
  p_user_id uuid
)
returns table (animal_id uuid, completed_at timestamptz)
language plpgsql
as $$
declare
  v_offer animal_help_offers%rowtype;
  v_current_org_id uuid;
  v_completed_at timestamptz := now();
begin
  select * into v_offer
  from animal_help_offers
  where id = p_offer_id
  for update;

  if not found
    or v_offer.offer_type <> 'tag_request'
    or v_offer.requesting_org_id is distinct from p_rescue_org_id then
    raise exception 'Tag request not found.';
  end if;

  if v_offer.status <> 'accepted' then
    raise exception 'The shelter must approve this tag before transfer.';
  end if;

  if v_offer.transfer_completed_at is not null then
    raise exception 'This transfer has already been completed.';
  end if;

  select current_org_id into v_current_org_id
  from animals
  where id = v_offer.animal_id
  for update;

  if v_offer.source_org_id is null or v_current_org_id is distinct from v_offer.source_org_id then
    raise exception 'The shelter is no longer the current custodian of this animal.';
  end if;

  if v_offer.source_org_id = p_rescue_org_id then
    raise exception 'The source and receiving organizations must be different.';
  end if;

  insert into animal_transfer_events (
    animal_id, offer_id, from_org_id, to_org_id, completed_by, completed_at,
    note
  ) values (
    v_offer.animal_id, v_offer.id, v_offer.source_org_id, p_rescue_org_id,
    p_user_id, v_completed_at, 'Shelter tag transfer confirmed by receiving rescue.'
  );

  insert into animal_custody_events (
    animal_id, event_type, org_id, recorded_by, started_at
  ) values (
    v_offer.animal_id, 'shelter_transfer_in', p_rescue_org_id, p_user_id, v_completed_at
  );

  update animals
  set current_org_id = p_rescue_org_id,
      custody = 'rescue',
      placement = null,
      public_share_enabled = false,
      updated_at = v_completed_at
  where id = v_offer.animal_id;

  update animal_help_offers
  set transfer_completed_at = v_completed_at,
      transfer_completed_by = p_user_id,
      updated_at = v_completed_at
  where id = v_offer.id;

  insert into audit_log (
    entity_type, entity_id, changed_by, field_name, new_value
  ) values (
    'animal', v_offer.animal_id, p_user_id, 'shelter_tag_transfer_completed',
    json_build_object(
      'offerId', v_offer.id,
      'fromOrganizationId', v_offer.source_org_id,
      'toOrganizationId', p_rescue_org_id,
      'completedAt', v_completed_at
    )::text
  );

  return query select v_offer.animal_id, v_completed_at;
end;
$$;

commit;
