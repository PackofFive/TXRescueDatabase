-- Pack of Five
-- Create ONLY the missing foster_invitations table.
-- No BEGIN/COMMIT wrapper, so a later statement cannot roll it back.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $migration$
DECLARE
  user_id_type text;
  org_id_type text;
BEGIN
  SELECT format_type(a.atttypid, a.atttypmod)
  INTO user_id_type
  FROM pg_attribute a
  JOIN pg_class c ON c.oid = a.attrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = current_schema()
    AND c.relname = 'users'
    AND a.attname = 'id'
    AND a.attnum > 0
    AND NOT a.attisdropped
  LIMIT 1;

  SELECT format_type(a.atttypid, a.atttypmod)
  INTO org_id_type
  FROM pg_attribute a
  JOIN pg_class c ON c.oid = a.attrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = current_schema()
    AND c.relname = 'organizations'
    AND a.attname = 'id'
    AND a.attnum > 0
    AND NOT a.attisdropped
  LIMIT 1;

  IF user_id_type IS NULL THEN
    RAISE EXCEPTION 'users.id type could not be detected';
  END IF;

  IF org_id_type IS NULL THEN
    RAISE EXCEPTION 'organizations.id type could not be detected';
  END IF;

  EXECUTE format($sql$
    CREATE TABLE IF NOT EXISTS foster_invitations (
      id text PRIMARY KEY
        DEFAULT ('finvite_' || replace(gen_random_uuid()::text, '-', '')),

      organization_id %s NOT NULL
        REFERENCES organizations(id)
        ON DELETE CASCADE,

      foster_id text NULL
        REFERENCES foster_profiles(id)
        ON DELETE SET NULL,

      invited_email text NOT NULL,
      invited_name text NULL,

      token_hash text NOT NULL UNIQUE,

      status text NOT NULL DEFAULT 'pending'
        CHECK (
          status IN (
            'pending',
            'accepted',
            'expired',
            'revoked'
          )
        ),

      expires_at timestamptz NOT NULL,

      invited_by %s NULL
        REFERENCES users(id)
        ON DELETE SET NULL,

      accepted_by %s NULL
        REFERENCES users(id)
        ON DELETE SET NULL,

      accepted_at timestamptz NULL,
      revoked_at timestamptz NULL,

      created_at timestamptz NOT NULL DEFAULT now()
    )
  $sql$, org_id_type, user_id_type, user_id_type);
END
$migration$;

CREATE INDEX IF NOT EXISTS idx_foster_invitations_org_status
  ON foster_invitations (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_foster_invitations_email
  ON foster_invitations (lower(invited_email));

SELECT
  table_schema,
  table_name
FROM information_schema.tables
WHERE table_schema = current_schema()
  AND table_name = 'foster_invitations';
