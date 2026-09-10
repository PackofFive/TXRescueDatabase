begin;

alter table shelter_rescue_partners
  drop constraint if exists shelter_rescue_partners_relationship_status_check;

update shelter_rescue_partners
set relationship_status = case relationship_status
  when 'saved' then 'considering'
  when 'active' then 'approved'
  when 'paused' then 'on_hold'
  when 'do_not_contact' then 'do_not_use'
  else relationship_status
end;

alter table shelter_rescue_partners
  alter column relationship_status set default 'considering';

alter table shelter_rescue_partners
  add constraint shelter_rescue_partners_relationship_status_check
  check (relationship_status in (
    'considering',
    'vetting',
    'approved',
    'preferred',
    'on_hold',
    'do_not_use'
  ));

comment on column shelter_rescue_partners.relationship_status is
  'Private shelter workflow: considering, vetting, approved, preferred, on_hold, or do_not_use.';

commit;
