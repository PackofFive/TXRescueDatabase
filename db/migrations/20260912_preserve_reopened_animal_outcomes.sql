begin;

alter table animal_outcomes
  add column if not exists reopened_at timestamptz,
  add column if not exists reopened_by uuid references users(id) on delete set null,
  add column if not exists reopen_reason text;

create index if not exists animal_outcomes_active_lookup_idx
  on animal_outcomes (animal_id, org_id)
  where reopened_at is null;

comment on column animal_outcomes.reopened_at is
  'When set, the outcome was reversed and the animal returned to active work. The outcome row remains as history.';

comment on column animal_outcomes.reopened_by is
  'User who reopened the animal while preserving the prior outcome record.';

comment on column animal_outcomes.reopen_reason is
  'Optional reason the prior outcome was reversed.';

commit;
