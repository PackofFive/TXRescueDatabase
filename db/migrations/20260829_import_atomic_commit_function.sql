-- Atomic commit function for approved Pack of Five workbook previews.
-- Installing this function does not run an import or change rescue records.

begin;

create or replace function pof_commit_rescue_workbook_import(
  p_job_id uuid,
  p_confirmation_id uuid,
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
  v_confirmation import_confirmations%rowtype;
  v_row import_rows%rowtype;
  v_before jsonb;
  v_after jsonb;
  v_entity_id uuid;
  v_animal_id uuid;
  v_custody_event_id uuid;
  v_external_id text;
  v_priority text;
  v_created integer := 0;
  v_updated integer := 0;
  v_selected integer := 0;
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
    raise exception 'Workbook commit permission is required.';
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

  if v_job.status <> 'ready' then
    raise exception 'Import job is not ready.';
  end if;

  select *
  into v_confirmation
  from import_confirmations
  where id = p_confirmation_id
    and job_id = p_job_id
    and organization_id = p_organization_id
    and confirmed_by = p_actor_id
    and consumed_at is null
    and revoked_at is null
    and expires_at > now()
  for update;

  if not found then
    raise exception 'A current one-time import approval is required.';
  end if;

  if coalesce(v_job.summary #>> '{preflight,passed}', 'false') <> 'true'
     or v_job.summary #>> '{preflight,digest}' is distinct from
        v_confirmation.preflight_digest then
    raise exception 'The approval does not match the successful safety check.';
  end if;

  select count(*)::integer
  into v_selected
  from import_rows
  where job_id = p_job_id
    and selected = true;

  if v_selected = 0 or v_selected <> v_confirmation.selected_count then
    raise exception 'The selected rows no longer match the approval.';
  end if;

  if exists (
    select 1
    from import_rows
    where job_id = p_job_id
      and proposed_action in ('warning', 'error')
  ) then
    raise exception 'Review and error rows must be resolved before commit.';
  end if;

  if exists (
    select 1
    from import_rows
    where job_id = p_job_id
      and selected = true
      and (
        proposed_action not in ('create', 'update')
        or jsonb_array_length(
          coalesce(normalized_payload -> 'deferredFields', '[]'::jsonb)
        ) > 0
        or jsonb_array_length(
          coalesce(normalized_payload -> 'mappedFields', '[]'::jsonb)
        ) = 0
      )
  ) then
    raise exception 'Selected rows contain unapproved or deferred fields.';
  end if;

  update import_jobs
  set status = 'committing', updated_at = now(), error_message = null
  where id = p_job_id;

  -- Animals are committed first so Medical and Tasks can resolve new stable IDs.
  for v_row in
    select *
    from import_rows
    where job_id = p_job_id
      and selected = true
      and sheet_name = 'Animals'
    order by row_number
    for update
  loop
    v_external_id := nullif(btrim(v_row.source_payload ->> 'animal_id'), '');
    v_priority := lower(nullif(btrim(v_row.source_payload ->> 'priority'), ''));

    if v_row.proposed_action = 'create' then
      if nullif(btrim(v_row.source_payload ->> 'species_type'), '') is null then
        raise exception 'Animals row % requires Species / Type.', v_row.row_number;
      end if;

      insert into animals (
        name,
        species,
        breed_or_type,
        sex,
        birth_date,
        current_org_id,
        custody,
        urgency,
        visibility,
        notes,
        created_by,
        source
      )
      values (
        nullif(btrim(v_row.source_payload ->> 'name'), ''),
        btrim(v_row.source_payload ->> 'species_type'),
        nullif(btrim(v_row.source_payload ->> 'breed_description'), ''),
        nullif(btrim(v_row.source_payload ->> 'sex'), ''),
        nullif(v_row.source_payload ->> 'estimated_dob', '')::date,
        p_organization_id,
        'rescue',
        case
          when v_priority in ('normal', 'elevated', 'urgent', 'critical')
            then v_priority
          else 'normal'
        end,
        'private',
        nullif(btrim(v_row.source_payload ->> 'notes'), ''),
        p_actor_id,
        nullif(btrim(v_row.source_payload ->> 'intake_source'), '')
      )
      returning id into v_entity_id;

      select to_jsonb(animal)
      into v_after
      from animals animal
      where animal.id = v_entity_id;

      insert into import_changes (
        job_id, import_row_id, organization_id, entity_type,
        entity_id, operation, before_payload, after_payload
      )
      values (
        p_job_id, v_row.id, p_organization_id, 'animal',
        v_entity_id::text, 'create', null, v_after
      );

      if nullif(v_row.source_payload ->> 'intake_date', '') is not null then
        insert into animal_custody_events (
          animal_id, event_type, org_id, recorded_by, started_at
        )
        values (
          v_entity_id, 'intake', p_organization_id, p_actor_id,
          (v_row.source_payload ->> 'intake_date')::date::timestamptz
        )
        returning id into v_custody_event_id;

        select to_jsonb(event)
        into v_after
        from animal_custody_events event
        where event.id = v_custody_event_id;

        insert into import_changes (
          job_id, import_row_id, organization_id, entity_type,
          entity_id, operation, before_payload, after_payload
        )
        values (
          p_job_id, v_row.id, p_organization_id, 'custody_event',
          v_custody_event_id::text, 'create', null, v_after
        );
      end if;

      v_created := v_created + 1;
    else
      v_entity_id := v_row.target_entity_id::uuid;

      select to_jsonb(animal)
      into v_before
      from animals animal
      where animal.id = v_entity_id
        and animal.current_org_id = p_organization_id
      for update;

      if v_before is null then
        raise exception 'Animals row % lost its exact update target.', v_row.row_number;
      end if;

      update animals
      set
        name = coalesce(nullif(btrim(v_row.source_payload ->> 'name'), ''), name),
        species = coalesce(nullif(btrim(v_row.source_payload ->> 'species_type'), ''), species),
        breed_or_type = coalesce(nullif(btrim(v_row.source_payload ->> 'breed_description'), ''), breed_or_type),
        sex = coalesce(nullif(btrim(v_row.source_payload ->> 'sex'), ''), sex),
        birth_date = coalesce(nullif(v_row.source_payload ->> 'estimated_dob', '')::date, birth_date),
        source = coalesce(nullif(btrim(v_row.source_payload ->> 'intake_source'), ''), source),
        urgency = case
          when v_priority in ('normal', 'elevated', 'urgent', 'critical')
            then v_priority
          else urgency
        end,
        notes = coalesce(nullif(btrim(v_row.source_payload ->> 'notes'), ''), notes),
        updated_at = now()
      where id = v_entity_id;

      select to_jsonb(animal)
      into v_after
      from animals animal
      where animal.id = v_entity_id;

      insert into import_changes (
        job_id, import_row_id, organization_id, entity_type,
        entity_id, operation, before_payload, after_payload
      )
      values (
        p_job_id, v_row.id, p_organization_id, 'animal',
        v_entity_id::text, 'update', v_before, v_after
      );

      v_updated := v_updated + 1;
    end if;

    if v_external_id is not null then
      insert into import_entity_keys (
        organization_id, entity_type, external_id, entity_id, created_by
      )
      values (
        p_organization_id, 'animal', v_external_id, v_entity_id, p_actor_id
      )
      on conflict (organization_id, entity_type, external_id)
      do update set
        entity_id = excluded.entity_id,
        updated_at = now();
    end if;
  end loop;

  for v_row in
    select *
    from import_rows
    where job_id = p_job_id
      and selected = true
      and sheet_name = 'Medical'
    order by row_number
    for update
  loop
    v_external_id := nullif(btrim(v_row.source_payload ->> 'external_medical_record_id'), '');

    select key.entity_id
    into v_animal_id
    from import_entity_keys key
    where key.organization_id = p_organization_id
      and key.entity_type = 'animal'
      and key.external_id = v_row.source_payload ->> 'animal_id'
    limit 1;

    if v_animal_id is null then
      select animal.id
      into v_animal_id
      from animals animal
      where animal.current_org_id = p_organization_id
        and animal.id::text = v_row.source_payload ->> 'animal_id'
      limit 1;
    end if;

    if v_animal_id is null then
      raise exception 'Medical row % could not resolve Animal ID.', v_row.row_number;
    end if;

    if v_row.proposed_action = 'create' then
      insert into animal_medical_records (
        animal_id, record_type, title, provider, occurred_at,
        due_at, status, notes, created_by
      )
      values (
        v_animal_id,
        'imported',
        btrim(v_row.source_payload ->> 'service_vaccine'),
        nullif(btrim(v_row.source_payload ->> 'provider'), ''),
        nullif(v_row.source_payload ->> 'service_date', '')::date,
        nullif(v_row.source_payload ->> 'next_due', '')::date,
        'completed',
        nullif(btrim(v_row.source_payload ->> 'notes'), ''),
        p_actor_id
      )
      returning id into v_entity_id;

      select to_jsonb(medical)
      into v_after
      from animal_medical_records medical
      where medical.id = v_entity_id;

      insert into import_changes (
        job_id, import_row_id, organization_id, entity_type,
        entity_id, operation, before_payload, after_payload
      )
      values (
        p_job_id, v_row.id, p_organization_id, 'medical',
        v_entity_id::text, 'create', null, v_after
      );
      v_created := v_created + 1;
    else
      v_entity_id := v_row.target_entity_id::uuid;

      select to_jsonb(medical)
      into v_before
      from animal_medical_records medical
      join animals animal on animal.id = medical.animal_id
      where medical.id = v_entity_id
        and animal.current_org_id = p_organization_id
      for update of medical;

      if v_before is null then
        raise exception 'Medical row % lost its exact update target.', v_row.row_number;
      end if;

      update animal_medical_records
      set
        title = coalesce(nullif(btrim(v_row.source_payload ->> 'service_vaccine'), ''), title),
        provider = coalesce(nullif(btrim(v_row.source_payload ->> 'provider'), ''), provider),
        occurred_at = coalesce(nullif(v_row.source_payload ->> 'service_date', '')::date, occurred_at),
        due_at = coalesce(nullif(v_row.source_payload ->> 'next_due', '')::date, due_at),
        notes = coalesce(nullif(btrim(v_row.source_payload ->> 'notes'), ''), notes),
        updated_at = now()
      where id = v_entity_id;

      select to_jsonb(medical)
      into v_after
      from animal_medical_records medical
      where medical.id = v_entity_id;

      insert into import_changes (
        job_id, import_row_id, organization_id, entity_type,
        entity_id, operation, before_payload, after_payload
      )
      values (
        p_job_id, v_row.id, p_organization_id, 'medical',
        v_entity_id::text, 'update', v_before, v_after
      );
      v_updated := v_updated + 1;
    end if;

    if v_external_id is not null then
      insert into import_entity_keys (
        organization_id, entity_type, external_id, entity_id, created_by
      )
      values (
        p_organization_id, 'medical', v_external_id, v_entity_id, p_actor_id
      )
      on conflict (organization_id, entity_type, external_id)
      do update set entity_id = excluded.entity_id, updated_at = now();
    end if;
  end loop;

  for v_row in
    select *
    from import_rows
    where job_id = p_job_id
      and selected = true
      and sheet_name = 'Tasks'
    order by row_number
    for update
  loop
    v_external_id := nullif(btrim(v_row.source_payload ->> 'task_id'), '');
    v_priority := lower(nullif(btrim(v_row.source_payload ->> 'priority'), ''));

    select key.entity_id
    into v_animal_id
    from import_entity_keys key
    where key.organization_id = p_organization_id
      and key.entity_type = 'animal'
      and key.external_id = v_row.source_payload ->> 'animal_id'
    limit 1;

    if v_animal_id is null then
      select animal.id
      into v_animal_id
      from animals animal
      where animal.current_org_id = p_organization_id
        and animal.id::text = v_row.source_payload ->> 'animal_id'
      limit 1;
    end if;

    if v_animal_id is null then
      raise exception 'Tasks row % could not resolve Animal ID.', v_row.row_number;
    end if;

    if v_row.proposed_action = 'create' then
      insert into animal_reminders (
        animal_id, org_id, title, notes, due_at,
        priority, status, created_by
      )
      values (
        v_animal_id,
        p_organization_id,
        btrim(v_row.source_payload ->> 'task'),
        nullif(btrim(v_row.source_payload ->> 'notes'), ''),
        nullif(v_row.source_payload ->> 'due_date', '')::date::timestamptz,
        case
          when v_priority in ('critical', 'high', 'normal', 'info')
            then v_priority
          else 'normal'
        end,
        'open',
        p_actor_id
      )
      returning id into v_entity_id;

      select to_jsonb(reminder)
      into v_after
      from animal_reminders reminder
      where reminder.id = v_entity_id;

      insert into import_changes (
        job_id, import_row_id, organization_id, entity_type,
        entity_id, operation, before_payload, after_payload
      )
      values (
        p_job_id, v_row.id, p_organization_id, 'task',
        v_entity_id::text, 'create', null, v_after
      );
      v_created := v_created + 1;
    else
      v_entity_id := v_row.target_entity_id::uuid;

      select to_jsonb(reminder)
      into v_before
      from animal_reminders reminder
      where reminder.id = v_entity_id
        and reminder.org_id = p_organization_id
      for update;

      if v_before is null then
        raise exception 'Tasks row % lost its exact update target.', v_row.row_number;
      end if;

      update animal_reminders
      set
        title = coalesce(nullif(btrim(v_row.source_payload ->> 'task'), ''), title),
        notes = coalesce(nullif(btrim(v_row.source_payload ->> 'notes'), ''), notes),
        due_at = coalesce(nullif(v_row.source_payload ->> 'due_date', '')::date::timestamptz, due_at),
        priority = case
          when v_priority in ('critical', 'high', 'normal', 'info')
            then v_priority
          else priority
        end,
        updated_at = now()
      where id = v_entity_id;

      select to_jsonb(reminder)
      into v_after
      from animal_reminders reminder
      where reminder.id = v_entity_id;

      insert into import_changes (
        job_id, import_row_id, organization_id, entity_type,
        entity_id, operation, before_payload, after_payload
      )
      values (
        p_job_id, v_row.id, p_organization_id, 'task',
        v_entity_id::text, 'update', v_before, v_after
      );
      v_updated := v_updated + 1;
    end if;

    if v_external_id is not null then
      insert into import_entity_keys (
        organization_id, entity_type, external_id, entity_id, created_by
      )
      values (
        p_organization_id, 'task', v_external_id, v_entity_id, p_actor_id
      )
      on conflict (organization_id, entity_type, external_id)
      do update set entity_id = excluded.entity_id, updated_at = now();
    end if;
  end loop;

  insert into audit_log (
    entity_type, entity_id, changed_by, field_name, new_value
  )
  values (
    'import_job', p_job_id, p_actor_id, 'workbook_import_committed',
    jsonb_build_object(
      'organizationId', p_organization_id,
      'created', v_created,
      'updated', v_updated
    )::text
  );

  update import_confirmations
  set consumed_at = now()
  where id = p_confirmation_id;

  update import_jobs
  set
    status = 'committed',
    committed_at = now(),
    rollback_expires_at = now() + interval '7 days',
    updated_at = now(),
    summary = summary || jsonb_build_object(
      'commitCounts', jsonb_build_object(
        'created', v_created,
        'updated', v_updated
      )
    )
  where id = p_job_id;

  return jsonb_build_object(
    'ok', true,
    'jobId', p_job_id,
    'created', v_created,
    'updated', v_updated,
    'rollbackExpiresAt', now() + interval '7 days'
  );
end;
$$;

revoke all on function pof_commit_rescue_workbook_import(uuid, uuid, uuid, uuid)
  from public;

commit;
