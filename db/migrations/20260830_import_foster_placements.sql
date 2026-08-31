-- Phase 2 workbook support for Foster Placements.
-- Adds operational placement fields and atomic commit/rollback wrappers.

begin;

alter table foster_assignments
  add column if not exists review_date date,
  add column if not exists expected_end text,
  add column if not exists placement_status text,
  add column if not exists coordinator text,
  add column if not exists supplies_issued text,
  add column if not exists next_check_in text;

create or replace function pof_commit_rescue_workbook_import(
  p_job_id uuid,
  p_confirmation_id uuid,
  p_actor_id uuid,
  p_organization_id uuid,
  p_include_foster_placements boolean
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_result jsonb;
  v_row import_rows%rowtype;
  v_before jsonb;
  v_after jsonb;
  v_entity_id uuid;
  v_animal_id uuid;
  v_foster_id text;
  v_external_id text;
  v_can_submit_updates boolean;
  v_can_add_photos boolean;
  v_can_add_behavior_notes boolean;
  v_created integer := 0;
  v_updated integer := 0;
  v_total_created integer;
  v_total_updated integer;
begin
  if not p_include_foster_placements then
    raise exception 'Foster Placements support must be explicitly enabled.';
  end if;

  -- The original four-argument function commits Animals, Medical, and Tasks.
  -- This call and the placement work below share one database transaction.
  v_result := pof_commit_rescue_workbook_import(
    p_job_id,
    p_confirmation_id,
    p_actor_id,
    p_organization_id
  );

  for v_row in
    select *
    from import_rows
    where job_id = p_job_id
      and selected = true
      and sheet_name = 'Foster Placements'
    order by row_number
    for update
  loop
    v_external_id := nullif(
      btrim(v_row.source_payload ->> 'external_foster_assignment_id'),
      ''
    );
    v_animal_id := null;
    v_foster_id := null;

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
      raise exception 'Foster Placements row % could not resolve Animal ID.',
        v_row.row_number;
    end if;

    select
      profile.id::text,
      relationship.can_submit_updates,
      relationship.can_add_photos,
      relationship.can_add_behavior_notes
    into
      v_foster_id,
      v_can_submit_updates,
      v_can_add_photos,
      v_can_add_behavior_notes
    from foster_profiles profile
    join foster_organization_relationships relationship
      on relationship.foster_id = profile.id
     and relationship.organization_id = p_organization_id
     and relationship.status = 'approved'
    where lower(profile.email) = lower(
      btrim(v_row.source_payload ->> 'foster_email')
    );

    if v_foster_id is null then
      raise exception
        'Foster Placements row % no longer matches an approved foster relationship.',
        v_row.row_number;
    end if;

    if v_row.proposed_action = 'create' then
      if exists (
        select 1
        from foster_assignments assignment
        where assignment.animal_id = v_animal_id
          and assignment.ended_at is null
      ) then
        raise exception
          'Foster Placements row % conflicts with an active assignment.',
          v_row.row_number;
      end if;

      insert into foster_assignments (
        id,
        foster_id,
        animal_id,
        organization_id,
        started_at,
        notes,
        can_submit_updates,
        can_add_photos,
        can_add_behavior_notes,
        access_overrides,
        review_date,
        expected_end,
        placement_status,
        coordinator,
        supplies_issued,
        next_check_in
      )
      values (
        gen_random_uuid(),
        v_foster_id,
        v_animal_id,
        p_organization_id,
        (v_row.source_payload ->> 'start_date')::date::timestamptz,
        nullif(btrim(v_row.source_payload ->> 'notes'), ''),
        coalesce(v_can_submit_updates, true),
        coalesce(v_can_add_photos, true),
        coalesce(v_can_add_behavior_notes, true),
        '{}'::jsonb,
        nullif(v_row.source_payload ->> 'review_date', '')::date,
        nullif(btrim(v_row.source_payload ->> 'expected_end'), ''),
        nullif(btrim(v_row.source_payload ->> 'status'), ''),
        nullif(btrim(v_row.source_payload ->> 'coordinator'), ''),
        nullif(btrim(v_row.source_payload ->> 'supplies_issued'), ''),
        nullif(btrim(v_row.source_payload ->> 'next_check_in'), '')
      )
      returning id into v_entity_id;

      select to_jsonb(assignment)
      into v_after
      from foster_assignments assignment
      where assignment.id = v_entity_id;

      insert into import_changes (
        job_id, import_row_id, organization_id, entity_type,
        entity_id, operation, before_payload, after_payload
      )
      values (
        p_job_id, v_row.id, p_organization_id, 'foster_assignment',
        v_entity_id::text, 'create', null, v_after
      );

      v_created := v_created + 1;
    elsif v_row.proposed_action = 'update' then
      v_entity_id := v_row.target_entity_id::uuid;

      select to_jsonb(assignment)
      into v_before
      from foster_assignments assignment
      where assignment.id = v_entity_id
        and assignment.organization_id = p_organization_id
      for update;

      if v_before is null then
        raise exception
          'Foster Placements row % lost its exact update target.',
          v_row.row_number;
      end if;

      if v_before ->> 'animal_id' is distinct from v_animal_id::text
         or v_before ->> 'foster_id' is distinct from v_foster_id then
        raise exception
          'Foster Placements row % cannot change the assignment animal or foster.',
          v_row.row_number;
      end if;

      update foster_assignments
      set
        started_at = coalesce(
          nullif(v_row.source_payload ->> 'start_date', '')::date::timestamptz,
          started_at
        ),
        notes = coalesce(
          nullif(btrim(v_row.source_payload ->> 'notes'), ''), notes
        ),
        review_date = coalesce(
          nullif(v_row.source_payload ->> 'review_date', '')::date,
          review_date
        ),
        expected_end = coalesce(
          nullif(btrim(v_row.source_payload ->> 'expected_end'), ''),
          expected_end
        ),
        placement_status = coalesce(
          nullif(btrim(v_row.source_payload ->> 'status'), ''),
          placement_status
        ),
        coordinator = coalesce(
          nullif(btrim(v_row.source_payload ->> 'coordinator'), ''),
          coordinator
        ),
        supplies_issued = coalesce(
          nullif(btrim(v_row.source_payload ->> 'supplies_issued'), ''),
          supplies_issued
        ),
        next_check_in = coalesce(
          nullif(btrim(v_row.source_payload ->> 'next_check_in'), ''),
          next_check_in
        )
      where id = v_entity_id
        and organization_id = p_organization_id;

      select to_jsonb(assignment)
      into v_after
      from foster_assignments assignment
      where assignment.id = v_entity_id;

      insert into import_changes (
        job_id, import_row_id, organization_id, entity_type,
        entity_id, operation, before_payload, after_payload
      )
      values (
        p_job_id, v_row.id, p_organization_id, 'foster_assignment',
        v_entity_id::text, 'update', v_before, v_after
      );

      v_updated := v_updated + 1;
    else
      raise exception 'Foster Placements row % is not approved for commit.',
        v_row.row_number;
    end if;

    if v_external_id is not null then
      insert into import_entity_keys (
        organization_id, entity_type, external_id, entity_id, created_by
      )
      values (
        p_organization_id, 'foster_assignment', v_external_id,
        v_entity_id, p_actor_id
      )
      on conflict (organization_id, entity_type, external_id)
      do update set entity_id = excluded.entity_id, updated_at = now();
    end if;
  end loop;

  v_total_created := coalesce((v_result ->> 'created')::integer, 0) + v_created;
  v_total_updated := coalesce((v_result ->> 'updated')::integer, 0) + v_updated;

  if v_created > 0 or v_updated > 0 then
    insert into audit_log (
      entity_type, entity_id, changed_by, field_name, new_value
    )
    values (
      'import_job', p_job_id, p_actor_id,
      'workbook_foster_placements_imported',
      jsonb_build_object(
        'organizationId', p_organization_id,
        'created', v_created,
        'updated', v_updated
      )::text
    );
  end if;

  update import_jobs
  set
    summary = summary || jsonb_build_object(
      'commitCounts', jsonb_build_object(
        'created', v_total_created,
        'updated', v_total_updated
      )
    ),
    updated_at = now()
  where id = p_job_id
    and organization_id = p_organization_id;

  return v_result || jsonb_build_object(
    'created', v_total_created,
    'updated', v_total_updated,
    'fosterPlacementsCreated', v_created,
    'fosterPlacementsUpdated', v_updated
  );
end;
$$;

revoke all on function pof_commit_rescue_workbook_import(
  uuid, uuid, uuid, uuid, boolean
) from public;

create or replace function pof_rollback_rescue_workbook_import(
  p_job_id uuid,
  p_actor_id uuid,
  p_organization_id uuid,
  p_reason text,
  p_include_foster_placements boolean
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
  v_result jsonb;
  v_reason text := btrim(coalesce(p_reason, ''));
  v_reverted_created integer := 0;
  v_reverted_updated integer := 0;
  v_other_changes boolean;
  v_total_created integer;
  v_total_updated integer;
begin
  if not p_include_foster_placements then
    raise exception 'Foster Placements support must be explicitly enabled.';
  end if;

  if char_length(v_reason) < 10 or char_length(v_reason) > 500 then
    raise exception 'A rollback reason between 10 and 500 characters is required.';
  end if;

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

  select * into v_job
  from import_jobs
  where id = p_job_id
    and organization_id = p_organization_id
  for update;

  if not found or v_job.status <> 'committed' then
    raise exception 'Only a committed import can be rolled back.';
  end if;

  if v_job.rollback_expires_at is null or v_job.rollback_expires_at <= now() then
    raise exception 'The rollback window has expired.';
  end if;

  for v_change in
    select *
    from import_changes change
    where change.job_id = p_job_id
      and change.organization_id = p_organization_id
      and change.entity_type = 'foster_assignment'
      and change.rolled_back_at is null
    order by change.applied_at desc, change.id desc
    for update
  loop
    select to_jsonb(assignment)
    into v_current
    from foster_assignments assignment
    where assignment.id = v_change.entity_id::uuid
      and assignment.organization_id = p_organization_id
    for update;

    if v_current is null then
      raise exception 'Foster assignment record % no longer exists; rollback stopped safely.',
        v_change.entity_id;
    end if;

    if v_current is distinct from v_change.after_payload then
      raise exception 'Foster assignment record % changed after import; rollback stopped safely.',
        v_change.entity_id;
    end if;

    if v_change.operation = 'create' then
      delete from import_entity_keys key
      where key.organization_id = p_organization_id
        and key.entity_type = 'foster_assignment'
        and key.entity_id = v_change.entity_id::uuid;

      delete from foster_assignments
      where id = v_change.entity_id::uuid
        and organization_id = p_organization_id;

      v_reverted_created := v_reverted_created + 1;
    elsif v_change.operation = 'update' then
      update foster_assignments
      set
        started_at = (v_change.before_payload ->> 'started_at')::timestamptz,
        notes = v_change.before_payload ->> 'notes',
        review_date = nullif(v_change.before_payload ->> 'review_date', '')::date,
        expected_end = v_change.before_payload ->> 'expected_end',
        placement_status = v_change.before_payload ->> 'placement_status',
        coordinator = v_change.before_payload ->> 'coordinator',
        supplies_issued = v_change.before_payload ->> 'supplies_issued',
        next_check_in = v_change.before_payload ->> 'next_check_in'
      where id = v_change.entity_id::uuid
        and organization_id = p_organization_id;

      v_reverted_updated := v_reverted_updated + 1;
    else
      raise exception 'Unsupported foster assignment import operation: %.',
        v_change.operation;
    end if;

    update import_changes
    set rolled_back_at = now(), rolled_back_by = p_actor_id
    where id = v_change.id;
  end loop;

  select exists (
    select 1
    from import_changes change
    where change.job_id = p_job_id
      and change.organization_id = p_organization_id
      and change.rolled_back_at is null
  ) into v_other_changes;

  if v_other_changes then
    v_result := pof_rollback_rescue_workbook_import(
      p_job_id, p_actor_id, p_organization_id, v_reason
    );
  else
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

    insert into audit_log (
      entity_type, entity_id, changed_by, field_name, old_value, new_value
    )
    values (
      'import_job', p_job_id, p_actor_id,
      'workbook_import_rollback_reason', null, v_reason
    );

    update import_jobs
    set
      status = 'rolled_back',
      rolled_back_at = now(),
      updated_at = now(),
      summary = summary || jsonb_build_object('rollbackReason', v_reason)
    where id = p_job_id;

    v_result := jsonb_build_object(
      'ok', true,
      'jobId', p_job_id,
      'revertedCreates', 0,
      'revertedUpdates', 0,
      'rolledBackAt', now(),
      'reason', v_reason
    );
  end if;

  v_total_created :=
    coalesce((v_result ->> 'revertedCreates')::integer, 0) + v_reverted_created;
  v_total_updated :=
    coalesce((v_result ->> 'revertedUpdates')::integer, 0) + v_reverted_updated;

  if v_reverted_created > 0 or v_reverted_updated > 0 then
    insert into audit_log (
      entity_type, entity_id, changed_by, field_name, new_value
    )
    values (
      'import_job', p_job_id, p_actor_id,
      'workbook_foster_placements_rolled_back',
      jsonb_build_object(
        'organizationId', p_organization_id,
        'revertedCreates', v_reverted_created,
        'revertedUpdates', v_reverted_updated
      )::text
    );
  end if;

  update import_jobs
  set
    summary = summary || jsonb_build_object(
      'rollbackCounts', jsonb_build_object(
        'revertedCreates', v_total_created,
        'revertedUpdates', v_total_updated
      ),
      'rollbackReason', v_reason
    ),
    updated_at = now()
  where id = p_job_id
    and organization_id = p_organization_id;

  return v_result || jsonb_build_object(
    'revertedCreates', v_total_created,
    'revertedUpdates', v_total_updated,
    'fosterPlacementsRevertedCreates', v_reverted_created,
    'fosterPlacementsRevertedUpdates', v_reverted_updated,
    'reason', v_reason
  );
end;
$$;

revoke all on function pof_rollback_rescue_workbook_import(
  uuid, uuid, uuid, text, boolean
) from public;

commit;
