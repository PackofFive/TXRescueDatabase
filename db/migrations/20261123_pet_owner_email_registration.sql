begin;

create table if not exists personal_account_signup_tokens (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  password_hash text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  constraint personal_account_signup_token_hash_check
    check (token_hash ~ '^[a-f0-9]{64}$')
);

create index if not exists personal_account_signup_email_created_idx
  on personal_account_signup_tokens (lower(email), created_at desc);

create index if not exists personal_account_signup_expiry_idx
  on personal_account_signup_tokens (expires_at)
  where used_at is null;

comment on table personal_account_signup_tokens is
  'Single-use email verification tokens for personal Pack of Five account registration. Passwords are stored only as secure hashes.';

commit;
