begin;

do $$
begin
  if exists (
    select 1
    from animal_help_offers
    where offer_type = 'tag_request'
      and status = 'accepted'
      and transfer_completed_at is null
    group by animal_id
    having count(*) > 1
  ) then
    raise exception 'More than one active approved tag exists for an animal. Resolve the duplicate approvals before running this migration.';
  end if;
end;
$$;

create unique index if not exists animal_help_offers_one_approved_tag_per_animal_idx
  on animal_help_offers (animal_id)
  where offer_type = 'tag_request'
    and status = 'accepted'
    and transfer_completed_at is null;

comment on index animal_help_offers_one_approved_tag_per_animal_idx is
  'Only one rescue tag may be approved and awaiting transfer for an animal at a time.';

commit;
