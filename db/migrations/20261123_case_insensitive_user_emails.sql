begin;

do $$
begin
  if exists (
    select lower(email)
    from users
    group by lower(email)
    having count(*) > 1
  ) then
    raise exception 'Duplicate Pack of Five login emails exist when capitalization is ignored. Resolve those records before applying this migration.';
  end if;
end;
$$;

create unique index if not exists users_email_case_insensitive_unique
  on users (lower(email));

comment on index users_email_case_insensitive_unique is
  'Ensures email capitalization can never create a second Pack of Five login for the same address.';

commit;
