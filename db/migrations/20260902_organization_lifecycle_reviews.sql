-- Pack of Five claimed-organization closure and dormancy reviews

begin;

create table if not exists organization_lifecycle_reviews (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  review_type text not null check (review_type in ('owner_requested_closure','possible_dormancy')),
  status text not null default 'waiting_owner' check (status in ('waiting_owner','ready_decision','archived','cancelled')),
  reason text not null check (length(trim(reason)) >= 20),
  owner_email text,
  owner_contacted_at timestamptz,
  owner_response_received_at timestamptz,
  response_due_at timestamptz not null,
  initiated_by uuid not null references users(id) on delete restrict,
  decision_reason text,
  decided_by uuid references users(id) on delete restrict,
  decided_at timestamptz,
  opening_email_status text,
  outcome_email_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists organization_one_open_lifecycle_review_idx
  on organization_lifecycle_reviews (org_id)
  where status in ('waiting_owner','ready_decision');

create index if not exists organization_lifecycle_reviews_due_idx
  on organization_lifecycle_reviews (status, response_due_at);

comment on table organization_lifecycle_reviews is
  'Documented owner outreach and waiting periods before a claimed organization may be archived for closure or prolonged dormancy.';

commit;
