begin;

alter table animal_help_offers
  drop constraint if exists animal_help_offers_offer_type_check;

alter table animal_help_offers
  add constraint animal_help_offers_offer_type_check
  check (
    offer_type in (
      'rescue_interest',
      'tag_request',
      'foster',
      'transport',
      'medical_support',
      'donation',
      'other'
    )
  );

commit;
