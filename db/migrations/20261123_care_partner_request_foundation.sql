begin;

alter table organization_requests
  add column if not exists care_partner_category text,
  add column if not exists care_partner_credentials text,
  add column if not exists care_partner_services text;

alter table organizations
  add column if not exists care_partner_category text,
  add column if not exists care_partner_credentials text,
  add column if not exists care_partner_services text;

comment on column organization_requests.care_partner_credentials is
  'Private verification information supplied with a Care Partner request. Never expose in the public directory.';

comment on column organizations.care_partner_credentials is
  'Private Care Partner verification information. Never expose through public organization APIs.';

commit;
