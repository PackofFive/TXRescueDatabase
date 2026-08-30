-- Allow uncommitted workbook previews to be archived without deleting their
-- audit history. Safe to run more than once.

begin;

alter table import_jobs
  drop constraint if exists import_jobs_status_check;

alter table import_jobs
  add constraint import_jobs_status_check
  check (status in (
    'created', 'previewing', 'ready', 'blocked', 'committing',
    'committed', 'failed', 'rolled_back', 'expired', 'archived'
  ));

commit;
