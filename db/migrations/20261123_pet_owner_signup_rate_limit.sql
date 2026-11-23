begin;

alter table personal_account_signup_tokens
  add column if not exists requested_ip_hash text;

create index if not exists personal_account_signup_ip_created_idx
  on personal_account_signup_tokens (requested_ip_hash, created_at desc);

comment on column personal_account_signup_tokens.requested_ip_hash is
  'One-way hash used only to rate-limit verification-email abuse; the original IP address is not stored.';

commit;
