begin;

create table if not exists care_partner_assignment_documents (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references care_partner_animal_assignments(id) on delete restrict,
  animal_document_id uuid not null references animal_documents(id) on delete restrict,
  uploaded_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  unique (assignment_id, animal_document_id)
);

create index if not exists care_partner_assignment_documents_assignment_idx
  on care_partner_assignment_documents (assignment_id, created_at desc);

comment on table care_partner_assignment_documents is
  'Permanent link between a private animal document and the Care Partner assignment under which it was uploaded.';

commit;
