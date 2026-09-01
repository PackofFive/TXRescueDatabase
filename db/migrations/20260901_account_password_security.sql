begin;

alter table users
  add column if not exists session_version integer not null default 1,
  add column if not exists password_changed_at timestamptz;

create table if not exists password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  requested_ip_hash text,
  constraint password_reset_tokens_expiry_after_creation
    check (expires_at > created_at)
);

create index if not exists password_reset_tokens_user_created_idx
  on password_reset_tokens (user_id, created_at desc);

create index if not exists password_reset_tokens_active_idx
  on password_reset_tokens (token_hash, expires_at)
  where used_at is null;

create table if not exists account_security_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  email_hash text,
  event_type text not null,
  ip_hash text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint account_security_events_type_check check (
    event_type in (
      'password_reset_requested',
      'password_reset_completed',
      'password_changed',
      'password_reset_rejected',
      'login_failed',
      'login_succeeded'
    )
  )
);

create index if not exists account_security_events_user_created_idx
  on account_security_events (user_id, created_at desc);

create index if not exists account_security_events_email_created_idx
  on account_security_events (email_hash, created_at desc);

create index if not exists account_security_events_ip_created_idx
  on account_security_events (ip_hash, created_at desc);

comment on column users.session_version is
  'Incremented after a password change so previously issued sessions can be rejected.';

comment on table password_reset_tokens is
  'Hashed, single-use, short-lived tokens for account password recovery. Raw tokens are never stored.';

comment on table account_security_events is
  'Security audit and throttling history. Email and IP values are stored only as one-way hashes.';

commit;
