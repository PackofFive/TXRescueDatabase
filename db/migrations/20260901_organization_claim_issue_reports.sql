-- Pack of Five organization claim and access issue reports
-- Safe to run more than once.

begin;

create extension if not exists "pgcrypto";

create table if not exists organization_claim_issue_reports (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  reporter_name text not null,
  reporter_email text not null,
  reporter_phone text,
  relationship_to_org text not null,
  issue_type text not null,
  previous_org_email text,
  details text not null,
  evidence_url text,
  status text not null default 'pending',
  reviewed_by uuid references users(id) on delete set null,
  reviewed_at timestamptz,
  resolution_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organization_claim_issue_reports_issue_type_check
    check (issue_type in (
      'already_claimed',
      'lost_email_access',
      'wrong_owner',
      'organization_details_wrong',
      'other'
    )),
  constraint organization_claim_issue_reports_status_check
    check (status in ('pending', 'reviewing', 'resolved', 'rejected')),
  constraint organization_claim_issue_reports_relationship_check
    check (relationship_to_org in (
      'owner',
      'director',
      'staff',
      'board_member',
      'authorized_volunteer',
      'former_representative',
      'other'
    ))
);

create index if not exists organization_claim_issue_reports_status_created_idx
  on organization_claim_issue_reports (status, created_at asc);

create index if not exists organization_claim_issue_reports_org_created_idx
  on organization_claim_issue_reports (org_id, created_at desc);

create index if not exists organization_claim_issue_reports_email_created_idx
  on organization_claim_issue_reports (lower(reporter_email), created_at desc);

comment on table organization_claim_issue_reports is
  'Private, auditable reports about organization ownership, claims, and lost access. Reports never grant access automatically.';

comment on column organization_claim_issue_reports.evidence_url is
  'Optional link supplied for administrative review. It is private and must not be displayed in the public directory.';

commit;
