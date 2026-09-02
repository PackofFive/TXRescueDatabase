-- Pack of Five guided organization claim/access case workflow
-- Adds deadlines, next actions, communications, and evidence tracking.

begin;

create extension if not exists "pgcrypto";

alter table organization_claim_issue_reports
  add column if not exists due_at timestamptz,
  add column if not exists next_action text,
  add column if not exists last_activity_at timestamptz not null default now(),
  add column if not exists reporter_notified_at timestamptz,
  add column if not exists owner_notified_at timestamptz,
  add column if not exists current_owner_email text,
  add column if not exists reporter_evidence_received_at timestamptz,
  add column if not exists owner_response_received_at timestamptz,
  add column if not exists official_record_checked_at timestamptz,
  add column if not exists official_record_checked_by uuid references users(id) on delete set null;

update organization_claim_issue_reports
set
  due_at = coalesce(due_at, created_at + interval '7 days'),
  next_action = coalesce(next_action, 'Review the report and request evidence.'),
  last_activity_at = coalesce(last_activity_at, updated_at, created_at)
where due_at is null or next_action is null;

alter table organization_claim_issue_reports
  alter column due_at set default (now() + interval '7 days'),
  alter column due_at set not null;

do $$
declare
  constraint_name text;
begin
  select conname into constraint_name
  from pg_constraint
  where conrelid = 'organization_claim_issue_reports'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%status%';

  if constraint_name is not null then
    execute format('alter table organization_claim_issue_reports drop constraint %I', constraint_name);
  end if;

  alter table organization_claim_issue_reports
    add constraint organization_claim_issue_reports_status_check
    check (status in (
      'pending',
      'waiting_documents',
      'waiting_reporter',
      'waiting_owner',
      'ready_decision',
      'reviewing',
      'resolved',
      'rejected'
    ));
end
$$;

create table if not exists organization_claim_case_messages (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references organization_claim_issue_reports(id) on delete cascade,
  actor_user_id uuid references users(id) on delete set null,
  audience text not null check (audience in ('reporter', 'current_owner', 'admin')),
  message_type text not null,
  subject text,
  message_body text not null,
  delivery_status text not null default 'not_applicable'
    check (delivery_status in ('not_applicable', 'pending', 'sent', 'failed')),
  recipient_email text,
  provider_message_id text,
  delivery_error text,
  created_at timestamptz not null default now()
);

create index if not exists organization_claim_case_messages_report_created_idx
  on organization_claim_case_messages (report_id, created_at asc);

create table if not exists organization_claim_case_evidence (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references organization_claim_issue_reports(id) on delete cascade,
  submitted_by text not null check (submitted_by in ('reporter', 'current_owner', 'admin')),
  evidence_type text not null,
  title text not null,
  storage_key text,
  external_url text,
  content_type text,
  file_size_bytes integer,
  review_status text not null default 'unreviewed'
    check (review_status in ('unreviewed', 'supports', 'conflicts', 'insufficient')),
  review_note text,
  reviewed_by uuid references users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  check (storage_key is not null or external_url is not null)
);

create index if not exists organization_claim_case_evidence_report_created_idx
  on organization_claim_case_evidence (report_id, created_at asc);

comment on table organization_claim_case_messages is
  'Private timeline of automated emails, party communications, and internal administrator notes for organization claim cases.';

comment on table organization_claim_case_evidence is
  'Private evidence metadata for organization claim/access cases. Evidence never grants access automatically.';

commit;
