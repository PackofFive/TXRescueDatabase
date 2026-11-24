begin;

alter table care_partner_animal_assignment_events
  alter column actor_user_id drop not null;

alter table care_partner_animal_assignment_events
  add column if not exists system_generated boolean not null default false;

create or replace function expire_care_partner_animal_assignments()
returns integer
language plpgsql
as $$
declare
  expired_count integer;
begin
  with expired as (
    update care_partner_animal_assignments
    set status = 'expired',
        ended_at = coalesce(ended_at, expires_at),
        end_reason = coalesce(end_reason, 'Assignment reached its approved expiration time.'),
        updated_at = now()
    where status = 'active'
      and expires_at <= now()
    returning id
  ), recorded as (
    insert into care_partner_animal_assignment_events
      (assignment_id, event_type, old_status, new_status, note, actor_user_id, system_generated)
    select id, 'assignment_expired', 'active', 'expired',
      'Assignment automatically expired at its approved expiration time.', null, true
    from expired
    returning assignment_id
  )
  select count(*)::integer into expired_count from recorded;

  return expired_count;
end;
$$;

comment on function expire_care_partner_animal_assignments() is
  'Marks elapsed Care Partner animal assignments expired and creates one permanent system audit event per assignment.';

commit;
