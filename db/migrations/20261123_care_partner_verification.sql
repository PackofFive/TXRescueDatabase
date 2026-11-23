begin;

alter table organizations
  add column if not exists care_partner_review_status text not null default 'not_reviewed',
  add column if not exists care_partner_review_notes text,
  add column if not exists care_partner_reviewed_by uuid references users(id),
  add column if not exists care_partner_reviewed_at timestamptz;

create table if not exists care_partner_verification_reviews (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete restrict,
  status text not null check (status in ('pending', 'verified', 'declined', 'suspended')),
  notes text not null,
  reviewed_by uuid not null references users(id),
  created_at timestamptz not null default now()
);

create index if not exists care_partner_verification_reviews_org_created_idx
  on care_partner_verification_reviews (org_id, created_at desc);

comment on column organizations.care_partner_review_notes is
  'Private administrator verification notes. Never expose through public organization APIs.';

comment on table care_partner_verification_reviews is
  'Immutable Care Partner verification decision history for audit and appeal review.';

commit;
