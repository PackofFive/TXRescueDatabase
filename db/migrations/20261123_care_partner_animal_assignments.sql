begin;

create table if not exists care_partner_animal_assignments (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references care_partner_relationships(id) on delete restrict,
  animal_id uuid not null references animals(id) on delete restrict,
  status text not null default 'active'
    check (status in ('active', 'completed', 'revoked', 'expired')),
  purpose text not null,
  can_view_medical_summary boolean not null default false,
  can_upload_documents boolean not null default false,
  can_add_care_notes boolean not null default false,
  authorization_confirmed_at timestamptz not null,
  expires_at timestamptz not null,
  assigned_by uuid not null references users(id),
  ended_by uuid references users(id),
  ended_at timestamptz,
  end_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at > authorization_confirmed_at)
);

create unique index if not exists care_partner_animal_assignments_active_unique
  on care_partner_animal_assignments (relationship_id, animal_id)
  where status = 'active';

create index if not exists care_partner_animal_assignments_relationship_idx
  on care_partner_animal_assignments (relationship_id, status, expires_at);

create index if not exists care_partner_animal_assignments_animal_idx
  on care_partner_animal_assignments (animal_id, status, expires_at);

create table if not exists care_partner_animal_assignment_events (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references care_partner_animal_assignments(id) on delete restrict,
  event_type text not null,
  old_status text,
  new_status text,
  note text,
  actor_user_id uuid not null references users(id),
  created_at timestamptz not null default now()
);

create index if not exists care_partner_animal_assignment_events_assignment_idx
  on care_partner_animal_assignment_events (assignment_id, created_at desc);

comment on table care_partner_animal_assignments is
  'Time-limited, animal-specific Care Partner authorization. The organization relationship alone grants no animal access.';

comment on table care_partner_animal_assignment_events is
  'Permanent audit history for animal-specific Care Partner authorization changes.';

commit;
