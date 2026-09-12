-- Preserve shelter/rescue relationship history instead of deleting it.
-- Safe to run more than once.
begin;
alter table shelter_rescue_partners
  add column if not exists archived_at timestamptz,
  add column if not exists archived_by uuid references users(id) on delete set null,
  add column if not exists archive_reason text;
create index if not exists shelter_rescue_partners_active_idx on shelter_rescue_partners(shelter_org_id,relationship_status,updated_at desc) where archived_at is null;
create index if not exists shelter_rescue_partners_archived_idx on shelter_rescue_partners(shelter_org_id,archived_at desc) where archived_at is not null;
comment on column shelter_rescue_partners.archived_at is 'Removes the relationship from active workflows while preserving its complete private record.';
comment on column shelter_rescue_partners.archived_by is 'Account that archived the private shelter/rescue relationship.';
comment on column shelter_rescue_partners.archive_reason is 'Private reason the relationship left the active partner list.';
commit;
