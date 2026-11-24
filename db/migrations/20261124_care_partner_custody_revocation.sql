begin;

create or replace function revoke_care_partner_assignments_on_custody_change()
returns trigger
language plpgsql
as $$
begin
  with revoked as (
    update care_partner_animal_assignments
    set status = 'revoked', ended_at = now(), updated_at = now(),
        end_reason = 'Animal custody changed.'
    where animal_id = new.id and status = 'active'
    returning id
  )
  insert into care_partner_animal_assignment_events
    (assignment_id, event_type, old_status, new_status, note, system_generated)
  select id, 'assignment_revoked_custody_changed', 'active', 'revoked',
    'Animal custody changed. A new assignment is required.', true
  from revoked;
  return new;
end;
$$;

drop trigger if exists care_partner_revoke_on_custody_change on animals;
create trigger care_partner_revoke_on_custody_change
after update of current_org_id on animals
for each row
when (old.current_org_id is distinct from new.current_org_id)
execute function revoke_care_partner_assignments_on_custody_change();

with revoked as (
  update care_partner_animal_assignments assignment
  set status = 'revoked', ended_at = now(), updated_at = now(),
      end_reason = 'Animal custody changed.'
  from animals animal, care_partner_relationships relationship
  where animal.id = assignment.animal_id
    and relationship.id = assignment.relationship_id
    and assignment.status = 'active'
    and (
      animal.current_org_id is distinct from relationship.partner_org_id
      or exists (
        select 1 from animal_transfer_events transfer
        where transfer.animal_id = assignment.animal_id
          and transfer.from_org_id = relationship.partner_org_id
          and transfer.completed_at >= assignment.created_at
      )
    )
  returning assignment.id
)
insert into care_partner_animal_assignment_events
  (assignment_id, event_type, old_status, new_status, note, system_generated)
select id, 'assignment_revoked_custody_changed', 'active', 'revoked',
  'Prior custody change found when enabling automatic revocation.', true
from revoked;

commit;
