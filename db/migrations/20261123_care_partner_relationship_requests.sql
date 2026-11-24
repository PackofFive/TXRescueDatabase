begin;

create table if not exists care_partner_relationships (
  id uuid primary key default gen_random_uuid(),
  care_partner_org_id uuid not null references organizations(id) on delete restrict,
  partner_org_id uuid not null references organizations(id) on delete restrict,
  status text not null default 'requested'
    check (status in ('requested', 'active', 'declined', 'suspended', 'ended')),
  request_message text,
  requested_by uuid not null references users(id),
  reviewed_by uuid references users(id),
  reviewed_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (care_partner_org_id, partner_org_id),
  check (care_partner_org_id <> partner_org_id)
);

create table if not exists care_partner_relationship_events (
  id uuid primary key default gen_random_uuid(),
  relationship_id uuid not null references care_partner_relationships(id) on delete restrict,
  event_type text not null,
  old_status text,
  new_status text,
  note text,
  actor_user_id uuid not null references users(id),
  created_at timestamptz not null default now()
);

create index if not exists care_partner_relationships_provider_status_idx
  on care_partner_relationships (care_partner_org_id, status, updated_at desc);

create index if not exists care_partner_relationships_partner_status_idx
  on care_partner_relationships (partner_org_id, status, updated_at desc);

create index if not exists care_partner_relationship_events_relationship_idx
  on care_partner_relationship_events (relationship_id, created_at desc);

comment on table care_partner_relationships is
  'Organization-level Care Partner connections. A relationship alone never grants access to an animal record.';

comment on table care_partner_relationship_events is
  'Permanent audit trail for Care Partner relationship requests and decisions.';

commit;
