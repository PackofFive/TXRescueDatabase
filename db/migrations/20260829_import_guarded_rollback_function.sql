-- Guarded rollback for Pack of Five workbook imports.
-- Installing this function does not roll back or change any records.

begin;

create or replace function pof_rollback_rescue_workbook_import(
  p_job_id uuid,
  p_actor_id uuid,
  p_organization_id uuid
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_job import_jobs%rowtype;
  v_change import_changes%rowtype;
  v_current jsonb;
  v_reverted_created integer := 0;
  v_reverted_updated integer := 0;
begin
  if not exists (
    select 1
    from user_permissions permission
    where permission.user_id = p_actor_id
      and permission.permission_key = 'rescue_workbook_commit'
      and permission.revoked_at is null
      and (
        permission.organization_id is null
        or permission.organization_id = p_organization_id
      )
  ) then
    raise exception 'Workbook commit permission is required for rollback.';
  end if;

  select *
  into v_job
  from import_jobs
  where id = p_job_id
    and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Import job was not found for this organization.';
  end if;

  if v_job.status <> 'committed' then
    raise exception 'Only a committed import can be rolled back.';
  end if;

  if v_job.rollback_expires_at is null
     or v_job.rollback_expires_at <= now() then
    raise exception 'The rollback window has expired.';
  end if;

  if not exists (
    select 1
    from import_changes change
    where change.job_id = p_job_id
      and change.organization_id = p_organization_id
      and change.rolled_back_at is null
  ) then
    raise exception 'No active import changes were found.';
  end if;

  -- Reverse application order so Tasks and Medical are removed/restored before
  -- their Animals, and custody events are removed before created Animals.
  for v_change in
    select *
    from import_changes change
    where change.job_id = p_job_id
      and change.organization_id = p_organization_id
      and change.rolled_back_at is null
    order by change.applied_at desc, change.id desc
    for update
  loop
    v_current := null;

    if v_change.entity_type = 'animal' then
      select to_jsonb(animal)
      into v_current
      from animals animal
      where animal.id = v_change.entity_id::uuid
        and animal.current_org_id = p_organization_id
      for update;
    elsif v_change.entity_type = 'medical' then
      select to_jsonb(medical)
      into v_current
      from animal_medical_records medical
      join animals animal on animal.id = medical.animal_id
      where medical.id = v_change.entity_id::uuid
        and animal.current_org_id = p_organization_id
      for update of medical;
    elsif v_change.entity_type = 'task' then
      select to_jsonb(reminder)
      into v_current
      from animal_reminders reminder
      where reminder.id = v_change.entity_id::uuid
        and reminder.org_id = p_organization_id
      for update;
    elsif v_change.entity_type = 'custody_event' then
      select to_jsonb(event)
      into v_current
      from animal_custody_events event
      where event.id = v_change.entity_id::uuid
        and event.org_id = p_organization_id
      for update;
    else
      raise exception 'Unsupported rollback entity type: %.', v_change.entity_type;
    end if;

    if v_current is null then
      raise exception '% record % no longer exists; rollback stopped safely.',
        v_change.entity_type, v_change.entity_id;
    end if;

    if v_current is distinct from v_change.after_payload then
      raise exception '% record % changed after import; rollback stopped safely.',
        v_change.entity_type, v_change.entity_id;
    end if;

    if v_change.operation = 'create' then
      if v_change.entity_type in ('animal', 'medical', 'task') then
        delete from import_entity_keys key
        where key.organization_id = p_organization_id
          and key.entity_type = v_change.entity_type
          and key.entity_id = v_change.entity_id::uuid;
      end if;

      if v_change.entity_type = 'task' then
        delete from animal_reminders
        where id = v_change.entity_id::uuid
          and org_id = p_organization_id;
      elsif v_change.entity_type = 'medical' then
        delete from animal_medical_records medical
        using animals animal
        where medical.id = v_change.entity_id::uuid
          and animal.id = medical.animal_id
          and animal.current_org_id = p_organization_id;
      elsif v_change.entity_type = 'custody_event' then
        delete from animal_custody_events
        where id = v_change.entity_id::uuid
          and org_id = p_organization_id;
      elsif v_change.entity_type = 'animal' then
        delete from animals
        where id = v_change.entity_id::uuid
          and current_org_id = p_organization_id;
      end if;

      v_reverted_created := v_reverted_created + 1;
    elsif v_change.operation = 'update' then
      if v_change.before_payload is null then
        raise exception 'Update snapshot % is missing its before state.', v_change.id;
      end if;

      if v_change.entity_type = 'animal' then
        update animals
        set
          name = v_change.before_payload ->> 'name',
          species = v_change.before_payload ->> 'species',
          breed_or_type = v_change.before_payload ->> 'breed_or_type',
          sex = v_change.before_payload ->> 'sex',
          birth_date = nullif(v_change.before_payload ->> 'birth_date', '')::date,
          source = v_change.before_payload ->> 'source',
          urgency = v_change.before_payload ->> 'urgency',
          notes = v_change.before_payload ->> 'notes',
          updated_at = (v_change.before_payload ->> 'updated_at')::timestamptz
        where id = v_change.entity_id::uuid
          and current_org_id = p_organization_id;
      elsif v_change.entity_type = 'medical' then
        update animal_medical_records
        set
          title = v_change.before_payload ->> 'title',
          provider = v_change.before_payload ->> 'provider',
          occurred_at = nullif(v_change.before_payload ->> 'occurred_at', '')::date,
          due_at = nullif(v_change.before_payload ->> 'due_at', '')::date,
          notes = v_change.before_payload ->> 'notes',
          updated_at = (v_change.before_payload ->> 'updated_at')::timestamptz
        where id = v_change.entity_id::uuid;
      elsif v_change.entity_type = 'task' then
        update animal_reminders
        set
          title = v_change.before_payload ->> 'title',
          notes = v_change.before_payload ->> 'notes',
          due_at = nullif(v_change.before_payload ->> 'due_at', '')::timestamptz,
          priority = v_change.before_payload ->> 'priority',
          updated_at = (v_change.before_payload ->> 'updated_at')::timestamptz
        where id = v_change.entity_id::uuid
          and org_id = p_organization_id;
      else
        raise exception 'Custody event updates are not supported by this import.';
      end if;

      v_reverted_updated := v_reverted_updated + 1;
    else
      raise exception 'Unsupported import operation: %.', v_change.operation;
    end if;

    update import_changes
    set
      rolled_back_at = now(),
      rolled_back_by = p_actor_id
    where id = v_change.id;
  end loop;

  insert into audit_log (
    entity_type, entity_id, changed_by, field_name, old_value, new_value
  )
  values (
    'import_job', p_job_id, p_actor_id, 'workbook_import_rolled_back',
    'committed',
    jsonb_build_object(
      'organizationId', p_organization_id,
      'revertedCreates', v_reverted_created,
      'revertedUpdates', v_reverted_updated
    )::text
  );

  update import_jobs
  set
    status = 'rolled_back',
    rolled_back_at = now(),
    updated_at = now(),
    summary = summary || jsonb_build_object(
      'rollbackCounts', jsonb_build_object(
        'revertedCreates', v_reverted_created,
        'revertedUpdates', v_reverted_updated
      )
    )
  where id = p_job_id;

  return jsonb_build_object(
    'ok', true,
    'jobId', p_job_id,
    'revertedCreates', v_reverted_created,
    'revertedUpdates', v_reverted_updated,
    'rolledBackAt', now()
  );
end;
$$;

revoke all on function pof_rollback_rescue_workbook_import(uuid, uuid, uuid)
  from public;

commit;
