-- Pack of Five organization logo storage metadata
-- Logo files are stored privately in R2 and served through an approved public endpoint.

begin;

alter table organizations
  add column if not exists logo_storage_key text,
  add column if not exists logo_content_type text,
  add column if not exists logo_updated_at timestamptz;

comment on column organizations.logo_storage_key is
  'Private R2 object key for the organization logo. Never expose this storage key publicly.';

comment on column organizations.logo_content_type is
  'Validated image content type for the stored organization logo.';

commit;
