begin;

alter table animal_help_offers
  add column if not exists requesting_org_id uuid references organizations(id) on delete restrict,
  add column if not exists requesting_user_id uuid references users(id) on delete set null;

create index if not exists animal_help_offers_requesting_org_tag_idx
  on animal_help_offers (requesting_org_id, status, created_at desc)
  where offer_type = 'tag_request';

commit;
