begin;

create table if not exists care_partner_care_notes (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references care_partner_animal_assignments(id) on delete restrict,
  animal_id uuid not null references animals(id) on delete restrict,
  note_type text not null default 'observation'
    check (note_type in ('observation', 'treatment_update', 'recommendation', 'addendum')),
  note_text text not null,
  observed_at timestamptz not null,
  addendum_to_note_id uuid references care_partner_care_notes(id) on delete restrict,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  check (length(trim(note_text)) between 10 and 5000),
  check ((note_type = 'addendum') = (addendum_to_note_id is not null))
);

create index if not exists care_partner_care_notes_assignment_idx
  on care_partner_care_notes (assignment_id, observed_at desc, created_at desc);

create index if not exists care_partner_care_notes_animal_idx
  on care_partner_care_notes (animal_id, observed_at desc, created_at desc);

comment on table care_partner_care_notes is
  'Append-only professional observations created under an animal-specific Care Partner assignment. Corrections are added as linked addenda; original entries are retained.';

commit;
