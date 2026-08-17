-- Batch 10 of 10 — organizations 541 to 580
-- Paste this whole file into the Neon SQL Editor and click Run.

begin;

-- 541. McKinney Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'McKinney Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'McKinney', 'Collin', 'City of McKinney', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 542. McClendon-Chisolm Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'McClendon-Chisolm Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'McLendon-Chisholm', 'Rockwall', 'City of McLendon-Chisholm', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 543. Melissa Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Melissa Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Melissa', 'Collin', 'City of Melissa', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 544. Mesquite Animal Shelter and Adoption Center
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Mesquite Animal Shelter and Adoption Center', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Mesquite', 'Dallas', 'City of Mesquite', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 545. Midlothian Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Midlothian Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Midlothian', 'Ellis', 'City of Midlothian', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 546. City of Milford
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'City of Milford', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Milford', 'Ellis', 'City of Milford', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 547. Murphy Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Murphy Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Murphy', 'Collin', 'City of Murphy', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 548. North Richland Hills Animal Adoption and Rescue Center
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'North Richland Hills Animal Adoption and Rescue Center', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'North Richland Hills', 'Tarrant', 'City of North Richland Hills', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 549. Northlake Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Northlake Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Northlake', 'Denton', 'Town of Northlake', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 550. Oak Point Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Oak Point Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Oak Point', 'Denton', 'City of Oak Point', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 551. Ovilla Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Ovilla Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Ovilla', 'Ellis', 'City of Ovilla', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 552. Palmer Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Palmer Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Palmer', 'Ellis', 'City of Palmer', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 553. Parker Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Parker Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Parker', 'Collin', 'City of Parker', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 554. City of Pecan Hill
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'City of Pecan Hill', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Pecan Hill', 'Ellis', 'City of Pecan Hill', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 555. Plano Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Plano Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Plano', 'Collin', 'City of Plano', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 556. Princeton Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Princeton Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Princeton', 'Collin', 'City of Princeton', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 557. Prosper Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Prosper Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Prosper', 'Collin', 'Town of Prosper', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 558. Red Oak Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Red Oak Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Red Oak', 'Ellis', 'City of Red Oak', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 559. Richardson Animal Shelter
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Richardson Animal Shelter', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Richardson', 'Dallas', 'City of Richardson', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 560. Richland Hills Animal Services Center
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Richland Hills Animal Services Center', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Richland Hills', 'Tarrant', 'City of Richland Hills', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 561. Rockwall Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Rockwall Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Rockwall', 'Rockwall', 'City of Rockwall', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 562. City of Rowlett Animal Shelter
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'City of Rowlett Animal Shelter', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Rowlett', 'Dallas', 'City of Rowlett', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 563. Royse City Animal Shelter
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Royse City Animal Shelter', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Royse City', 'Rockwall', 'City of Royse City', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 564. Sachse Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Sachse Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Sachse', 'Dallas', 'City of Sachse', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 565. Saginaw Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Saginaw Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Saginaw', 'Tarrant', 'City of Saginaw', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 566. Seagoville Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Seagoville Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Seagoville', 'Dallas', 'City of Seagoville', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 567. Sherman Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Sherman Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Sherman', 'Grayson', 'City of Sherman', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 568. Southlake Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Southlake Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Southlake', 'Tarrant', 'City of Southlake', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 569. Sunnyvale Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Sunnyvale Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Sunnyvale', 'Dallas', 'Town of Sunnyvale', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 570. The Colony Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'The Colony Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'The Colony', 'Denton', 'City of The Colony', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 571. Trophy Club Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Trophy Club Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Trophy Club', 'Denton', 'Town of Trophy Club', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 572. University Park Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'University Park Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'University Park', 'Dallas', 'City of University Park', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 573. Van Alstyne
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Van Alstyne', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Van Alstyne', 'Grayson', 'City of Van Alstyne', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 574. Venus Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Venus Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Venus', 'Johnson', 'City of Venus', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 575. Watauga Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Watauga Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Watauga', 'Tarrant', 'City of Watauga', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 576. Waxahachie Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Waxahachie Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Waxahachie', 'Ellis', 'City of Waxahachie', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 577. Weatherford Parker County Animal Shelter
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Weatherford Parker County Animal Shelter', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Weatherford', 'Parker', 'Weatherford / participating Parker County jurisdictions', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 578. City of White Settlement Animal Shelter
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'City of White Settlement Animal Shelter', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'White Settlement', 'Tarrant', 'City of White Settlement', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 579. Wise County Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Wise County Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, NULL, 'Wise', 'Wise County / applicable county jurisdiction', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 580. Wylie Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Wylie Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Wylie', 'Collin', 'City of Wylie', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current stray/surrender procedures, shelter destination, hours, and after-hours instructions before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Government animal-control resource. Keep separate from private rescues because authority, service boundaries, and intake obligations are determined by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

commit;
