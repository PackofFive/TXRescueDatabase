-- Close obsolete rescue-tag requests after a shelter animal transfers.
-- The offers and their activity remain available in the shelter's private history.

begin;

alter table shelter_offer_activity
  drop constraint if exists shelter_offer_activity_action_check;

alter table shelter_offer_activity
  add constraint shelter_offer_activity_action_check
  check (action in ('note_added', 'status_changed', 'auto_closed_after_transfer'));

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
  v_competing_offer record;
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

  for v_competing_offer in
    select id, status
    from animal_help_offers
    where animal_id = v_offer.animal_id
      and id <> v_offer.id
      and offer_type = 'tag_request'
      and status in ('new', 'reviewing', 'contacted', 'accepted')
      and transfer_completed_at is null
    for update
  loop
    update animal_help_offers
    set status = 'closed',
        updated_at = v_completed_at
    where id = v_competing_offer.id;

    insert into shelter_offer_activity (
      offer_id, org_id, actor_user_id, action, previous_status, new_status, note
    ) values (
      v_competing_offer.id, v_offer.source_org_id, null,
      'auto_closed_after_transfer', v_competing_offer.status, 'closed',
      'Automatically closed because the animal transferred to another rescue.'
    );
  end loop;

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
