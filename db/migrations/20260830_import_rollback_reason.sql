-- Require and preserve a human-readable reason for every workbook rollback.
-- The existing guarded rollback remains the source of truth for reversing data.

begin;

create or replace function pof_rollback_rescue_workbook_import(
  p_job_id uuid,
  p_actor_id uuid,
  p_organization_id uuid,
  p_reason text
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_reason text := btrim(coalesce(p_reason, ''));
  v_result jsonb;
begin
  if char_length(v_reason) < 10 then
    raise exception 'A rollback reason of at least 10 characters is required.';
  end if;

  if char_length(v_reason) > 500 then
    raise exception 'The rollback reason cannot exceed 500 characters.';
  end if;

  -- The three-argument function performs the permission check, safety checks,
  -- rollback, status update, and original audit entry in this transaction.
  v_result := pof_rollback_rescue_workbook_import(
    p_job_id,
    p_actor_id,
    p_organization_id
  );

  update import_jobs
  set
    summary = summary || jsonb_build_object('rollbackReason', v_reason),
    updated_at = now()
  where id = p_job_id
    and organization_id = p_organization_id;

  insert into audit_log (
    entity_type, entity_id, changed_by, field_name, old_value, new_value
  )
  values (
    'import_job', p_job_id, p_actor_id,
    'workbook_import_rollback_reason', null, v_reason
  );

  return v_result || jsonb_build_object('reason', v_reason);
end;
$$;

revoke all on function pof_rollback_rescue_workbook_import(uuid, uuid, uuid, text)
  from public;

commit;
