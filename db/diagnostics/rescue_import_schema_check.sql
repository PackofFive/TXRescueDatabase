-- READ-ONLY diagnostic for the Rescue Manager import transaction.
-- This query does not create, update, or delete anything.

with target_tables(table_name) as (
  values
    ('animals'),
    ('animal_custody_events'),
    ('animal_medical_records'),
    ('animal_reminders'),
    ('audit_log'),
    ('users'),
    ('organizations'),
    ('user_permissions'),
    ('import_jobs'),
    ('import_rows'),
    ('import_changes'),
    ('import_entity_keys'),
    ('import_confirmations')
),
columns_report as (
  select
    'COLUMN'::text as report_type,
    c.table_name,
    c.ordinal_position::text as position_or_name,
    c.column_name as item,
    concat(
      c.data_type,
      case
        when c.udt_name <> c.data_type then ' (' || c.udt_name || ')'
        else ''
      end,
      ' | nullable=', c.is_nullable,
      ' | default=', coalesce(c.column_default, '<none>')
    ) as details
  from information_schema.columns c
  join target_tables t on t.table_name = c.table_name
  where c.table_schema = 'public'
),
constraints_report as (
  select
    'CONSTRAINT'::text as report_type,
    tc.table_name,
    tc.constraint_name as position_or_name,
    tc.constraint_type as item,
    coalesce(
      string_agg(
        concat(
          kcu.column_name,
          case
            when ccu.table_name is not null
              then ' -> ' || ccu.table_name || '.' || ccu.column_name
            else ''
          end
        ),
        ', ' order by kcu.ordinal_position
      ),
      '<table-level constraint>'
    ) as details
  from information_schema.table_constraints tc
  join target_tables t on t.table_name = tc.table_name
  left join information_schema.key_column_usage kcu
    on kcu.constraint_schema = tc.constraint_schema
   and kcu.constraint_name = tc.constraint_name
   and kcu.table_name = tc.table_name
  left join information_schema.constraint_column_usage ccu
    on ccu.constraint_schema = tc.constraint_schema
   and ccu.constraint_name = tc.constraint_name
  where tc.table_schema = 'public'
  group by
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type
),
checks_report as (
  select
    'CHECK'::text as report_type,
    cls.relname as table_name,
    con.conname as position_or_name,
    'CHECK EXPRESSION'::text as item,
    pg_get_constraintdef(con.oid, true) as details
  from pg_constraint con
  join pg_class cls on cls.oid = con.conrelid
  join pg_namespace ns on ns.oid = cls.relnamespace
  join target_tables t on t.table_name = cls.relname
  where ns.nspname = 'public'
    and con.contype = 'c'
)
select * from columns_report
union all
select * from constraints_report
union all
select * from checks_report
order by table_name, report_type, position_or_name;
