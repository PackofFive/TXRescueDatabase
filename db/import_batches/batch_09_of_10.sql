-- Batch 9 of 10 — organizations 481 to 540
-- Paste this whole file into the Neon SQL Editor and click Run.

begin;

-- 481. City of Bardwell
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'City of Bardwell', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Bardwell', 'Ellis', 'City of Bardwell', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 482. Bedford Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Bedford Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Bedford', 'Tarrant', 'City of Bedford', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.bedfordtx.gov/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 483. Benbrook Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Benbrook Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Benbrook', 'Tarrant', 'City of Benbrook', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.benbrook-tx.gov/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 484. City of Bridgeport Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'City of Bridgeport Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Bridgeport', 'Wise', 'City of Bridgeport', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.cityofbridgeport.net/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 485. City of Burleson Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'City of Burleson Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Burleson', 'Johnson', 'City of Burleson', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.burlesontx.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 486. Carrollton Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Carrollton Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Carrollton', 'Dallas', 'City of Carrollton', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.cityofcarrollton.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 487. Cedar Hill – Tri-City Animal Shelter and Adoption Center
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Cedar Hill – Tri-City Animal Shelter and Adoption Center', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Cedar Hill', 'Dallas', 'Cedar Hill, DeSoto and Duncanville', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.cedarhilltx.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 488. Cleburne Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Cleburne Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Cleburne', 'Johnson', 'City of Cleburne', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.cleburne.net/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 489. Cockrell Hill Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Cockrell Hill Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Cockrell Hill', 'Dallas', 'City of Cockrell Hill', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.cockrellhill.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 490. Colleyville Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Colleyville Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Services', NULL,
  NULL, 'Colleyville', 'Tarrant', 'City of Colleyville', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.colleyville.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 491. Commerce Animal Shelter
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Commerce Animal Shelter', 'Municipal Shelter / Animal Control', '{"Dog","Cat"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Commerce', 'Hunt', 'City of Commerce', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://commercetx.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 492. Coppell Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Coppell Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Coppell', 'Dallas', 'City of Coppell', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.coppelltx.gov/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 493. Corinth Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Corinth Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Corinth', 'Denton', 'City of Corinth', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.cityofcorinth.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 494. Crandall Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Crandall Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Crandall', 'Kaufman', 'City of Crandall', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.crandalltexas.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 495. Crowley Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Crowley Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Crowley', 'Tarrant', 'City of Crowley', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.ci.crowley.tx.us/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 496. Dallas Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Dallas Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Dallas', 'Dallas', 'City of Dallas', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://bedallas90.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 497. Decatur Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Decatur Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Decatur', 'Wise', 'City of Decatur', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.decaturtx.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 498. City of Denton Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'City of Denton Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Denton', 'Denton', 'City of Denton', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.cityofdenton.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 499. DeSoto Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'DeSoto Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'DeSoto', 'Dallas', 'City of DeSoto; shelter services coordinated through Tri-City Animal Shelter', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.desototexas.gov/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 500. Duncanville Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Duncanville Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Duncanville', 'Dallas', 'City of Duncanville; shelter services coordinated through Tri-City Animal Shelter', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.duncanvilletx.gov/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal or contracted animal-control resource. Keep separate from private rescues because legal authority, service boundaries, and intake rules differ by jurisdiction.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 501. Ellis County Sheriff’s Department
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Ellis County Sheriff’s Department', 'Municipal Shelter / Animal Control', '{"Other"}', 'County Animal Control / Law Enforcement', NULL,
  NULL, NULL, 'Ellis', 'Unincorporated Ellis County / sheriff jurisdiction', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 502. Ennis Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Ennis Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Ennis', 'Ellis', 'City of Ennis', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 503. Euless Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Euless Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Euless', 'Tarrant', 'City of Euless', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 504. Farmers Branch Animal Adoption Center
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Farmers Branch Animal Adoption Center', 'Municipal Shelter / Animal Control', '{"Dog","Cat"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Farmers Branch', 'Dallas', 'City of Farmers Branch', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 505. Farmersville Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Farmersville Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Farmersville', 'Collin', 'City of Farmersville', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 506. Fate Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Fate Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Services', NULL,
  NULL, 'Fate', 'Rockwall', 'City of Fate', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 507. Ferris Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Ferris Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Ferris', 'Ellis', 'City of Ferris', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 508. Flower Mound Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Flower Mound Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Flower Mound', 'Denton', 'Town of Flower Mound', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 509. Forney Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Forney Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Forney', 'Kaufman', 'City of Forney', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 510. Fort Worth Animal Care and Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Fort Worth Animal Care and Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Fort Worth', 'Tarrant', 'City of Fort Worth', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 511. Frisco Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Frisco Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Frisco', 'Collin', 'City of Frisco', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 512. Garland Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Garland Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Garland', 'Dallas', 'City of Garland', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 513. Garrett Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Garrett Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Garrett', 'Ellis', 'City of Garrett', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 514. Glenn Heights Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Glenn Heights Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Glenn Heights', 'Dallas', 'City of Glenn Heights', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 515. Granbury Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Granbury Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Granbury', 'Hood', 'City of Granbury', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 516. Grand Prairie Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Grand Prairie Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Grand Prairie', 'Dallas', 'City of Grand Prairie', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 517. Grapevine Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Grapevine Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Grapevine', 'Tarrant', 'City of Grapevine', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 518. Greenville Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Greenville Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Greenville', 'Hunt', 'City of Greenville', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 519. Haltom City Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Haltom City Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Haltom City', 'Tarrant', 'City of Haltom City', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 520. Heath Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Heath Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Heath', 'Rockwall', 'City of Heath', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 521. Hickory Creek Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Hickory Creek Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Services', NULL,
  NULL, 'Hickory Creek', 'Denton', 'Town of Hickory Creek', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 522. Highland Park Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Highland Park Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Highland Park', 'Dallas', 'Town of Highland Park', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 523. Highland Village Animal Care Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Highland Village Animal Care Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Services', NULL,
  NULL, 'Highland Village', 'Denton', 'City of Highland Village', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 524. City of Hurst Animal Services Center
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'City of Hurst Animal Services Center', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Hurst', 'Tarrant', 'City of Hurst', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 525. Hutchins Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Hutchins Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Services', NULL,
  NULL, 'Hutchins', 'Dallas', 'City of Hutchins', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/county animal-control intake is jurisdiction-dependent. Confirm where the animal was found or resides, current surrender/stray procedures, hours, and after-hours instructions before referral.', NULL, NULL,
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

-- 526. Irving Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Irving Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Irving', 'Dallas', 'City of Irving', 'DFW / North Texas', 'No',
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

-- 527. Italy Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Italy Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Italy', 'Ellis', 'City of Italy', 'DFW / North Texas', 'No',
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

-- 528. Joshua Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Joshua Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Joshua', 'Johnson', 'City of Joshua', 'DFW / North Texas', 'No',
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

-- 529. Kaufman Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Kaufman Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Kaufman', 'Kaufman', 'City of Kaufman', 'DFW / North Texas', 'No',
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

-- 530. Keller Animal Services and Adoptions
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Keller Animal Services and Adoptions', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Keller', 'Tarrant', 'City of Keller', 'DFW / North Texas', 'No',
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

-- 531. Kennedale Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Kennedale Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Services', NULL,
  NULL, 'Kennedale', 'Tarrant', 'City of Kennedale', 'DFW / North Texas', 'No',
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

-- 532. Krum Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Krum Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Krum', 'Denton', 'City of Krum', 'DFW / North Texas', 'No',
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

-- 533. Lake Dallas Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lake Dallas Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Services', NULL,
  NULL, 'Lake Dallas', 'Denton', 'City of Lake Dallas', 'DFW / North Texas', 'No',
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

-- 534. Lancaster Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lancaster Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Lancaster', 'Dallas', 'City of Lancaster', 'DFW / North Texas', 'No',
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

-- 535. Lavon Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lavon Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Lavon', 'Collin', 'City of Lavon', 'DFW / North Texas', 'No',
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

-- 536. Lewisville Animal Shelter and Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lewisville Animal Shelter and Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Lewisville', 'Denton', 'City of Lewisville', 'DFW / North Texas', 'No',
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

-- 537. Little Elm Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Little Elm Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Little Elm', 'Denton', 'Town of Little Elm', 'DFW / North Texas', 'No',
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

-- 538. Lucas Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lucas Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Services', NULL,
  NULL, 'Lucas', 'Collin', 'City of Lucas', 'DFW / North Texas', 'No',
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

-- 539. Mansfield Animal Care and Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Mansfield Animal Care and Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Mansfield', 'Tarrant', 'City of Mansfield', 'DFW / North Texas', 'No',
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

-- 540. Maypearl Animal Care Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Maypearl Animal Care Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Maypearl', 'Ellis', 'City of Maypearl', 'DFW / North Texas', 'No',
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


commit;
