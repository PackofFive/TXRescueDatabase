-- Batch 8 of 10 — organizations 421 to 480
-- Paste this whole file into the Neon SQL Editor and click Run.

begin;

-- 421. Saving Shepherds of Minnesota
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Saving Shepherds of Minnesota', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 17 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 422. Saving Shepherds Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Saving Shepherds Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 17 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 423. Saving Sully Dog Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Saving Sully Dog Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 17 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 424. Second Chance Rescue Minnesota
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Second Chance Rescue Minnesota', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 17 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 425. Second Chances Pet Rehab and Sanctuary
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Second Chances Pet Rehab and Sanctuary', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 17 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 426. The Bond Between aka Second Hand Hounds
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'The Bond Between aka Second Hand Hounds', 'Rescue', '{"Dog","Cat","Other"}', 'All Breed; Foster Rescue; Pet Support', NULL,
  'Yes', 'Minnetonka', NULL, 'Minnesota / Upper Midwest', NULL, 'No',
  'Limited', NULL, NULL, 'https://www.thebondbetween.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Secondhand Hounds rebranded as The Bond Between. Minnesota-based foster rescue and pet-support organization; not a Texas-local intake resource.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Yes' from new_org;

-- 427. Seventh Heaven Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Seventh Heaven Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 428. Shadows Sanctuary
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Shadows Sanctuary', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 429. Shar Pei Nation Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Shar Pei Nation Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 430. SHARP Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'SHARP Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 431. Shenandoah Shepherd Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Shenandoah Shepherd Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Foster Rescue; Shelter Transfer', 'German Shepherd and shepherd mixes',
  NULL, NULL, NULL, 'Virginia / Mid-Atlantic with transport network', NULL, 'No',
  'Limited', NULL, NULL, 'https://shenandoahrescue.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Active foster-based shepherd rescue. Not a Texas-local intake resource; capacity depends on foster and transport availability.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 432. SNARR Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'SNARR Animal Rescue', 'Rescue', '{"Dog","Cat"}', 'Special Needs; Medical; Behavioral; Foster Rescue', NULL,
  'Yes', NULL, NULL, 'Northeastern U.S. / national special-needs cases', NULL, 'No',
  'Limited', NULL, NULL, 'https://snarrnortheast.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Special Needs Animal Rescue & Rehabilitation Northeast focuses on animals with significant medical/behavioral needs. Not a Texas-local general intake rescue.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 433. Society for Companion Animals
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Society for Companion Animals', 'Rescue', '{"Dog","Cat"}', 'Transport; Shelter Transfer', NULL,
  'Yes', 'Dallas', 'Dallas', 'Texas shelter-to-out-of-state transport network', 'DFW / North Texas', 'Yes',
  'Restricted Program', NULL, NULL, 'https://www.societyforcompanionanimals.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Dallas-based nonprofit focused on transporting adoptable dogs/cats from Texas shelters to partner organizations in areas with stronger adoption demand; not general public surrender intake.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'Yes', 'No', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 434. Strong Paws Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Strong Paws Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 435. Tattered Paws and Golden Hearts
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Tattered Paws and Golden Hearts', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 436. The Big Mutt Network
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'The Big Mutt Network', 'Rescue', '{"Dog"}', 'Large Breed; Medical; Foster Rescue', 'Large and giant breed dogs',
  NULL, NULL, NULL, 'Arizona / Southwest', NULL, 'No',
  'Limited', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Active large-breed rescue network; not a Texas-local intake resource. Capacity should be confirmed directly.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 437. The No-Kill Project
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'The No-Kill Project', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 438. The Pittie Project PNW
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'The Pittie Project PNW', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 439. Trevors Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Trevors Animal Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 440. Trina & Friends K9 Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Trina & Friends K9 Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 441. Twin Cities Pet Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Twin Cities Pet Rescue', 'Rescue', '{"Dog","Cat"}', 'All Breed; Foster Rescue', NULL,
  'Yes', 'Saint Paul', NULL, 'Twin Cities / Minnesota', NULL, 'No',
  'Limited', NULL, NULL, 'https://www.twincitiespetrescue.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Minnesota foster-based rescue with current adoption/foster operations; not a Texas-local intake resource.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 442. Wags and Wiggles
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Wags and Wiggles', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 443. AlmostHome Dogz Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'AlmostHome Dogz Rescue', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '214-926-1521', 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 444. Altus Animal Aid, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Altus Animal Aid, Inc.', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '580-477-0807', 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 445. Animal Rescue Friends
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Animal Rescue Friends', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '972-842-8506', 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 446. Animal Rescue Klub (ARK)
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Animal Rescue Klub (ARK)', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '972-562-4357 (voicemail)', 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 447. Animal Rescue League (ARL)
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Animal Rescue League (ARL)', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '972-420-0641', 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 448. Animal Rescue of Texas (ART)
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Animal Rescue of Texas (ART)', 'Rescue/Support', '{"Dog","Cat"}', 'All Breed; Foster Rescue', NULL,
  'Yes', 'Dallas', 'Dallas', 'Dallas-Fort Worth / North Texas', 'DFW / North Texas', 'No',
  'Limited', NULL, NULL, 'https://www.animalrescueoftexas.org/',
  NULL, NULL, '214-276-7802', 'Verified – Restricted Intake',
  '2026-08-12', 'North Texas foster-based rescue. Capacity is foster-dependent; verify before referral.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 449. ASPCA
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'ASPCA', 'Rescue/Support', '{"Dog","Cat","Other"}', 'National Support; Cruelty; Disaster Response; Veterinary Access', NULL,
  'Yes', NULL, NULL, 'United States', NULL, 'Yes',
  'Restricted Program', NULL, NULL, 'https://www.aspca.org/',
  NULL, NULL, '817-473-9869', 'Verified – Restricted Intake',
  '2026-08-12', 'National animal-welfare organization, not a general DFW public-intake rescue. Baseline phone number should not be treated as a local ASPCA intake line without separate verification.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 450. City Pet Rescue (CPR)
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'City Pet Rescue (CPR)', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '214-515-9934', 'Verification Needed',
  '2026-08-12', 'Batch 18 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 451. Collin County HS
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Collin County HS', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, 'Collin', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '641-715-3900 Ext:61442', 'Verification Needed',
  '2026-08-12', 'Legacy entry appears to refer to a Collin County humane organization, but the exact current entity was not confidently matched. The baseline conference-call-style phone number should not be treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 452. Dallas Spay-Neuter Clinic (HSUS)
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Dallas Spay-Neuter Clinic (HSUS)', 'Rescue/Support', '{"Dog","Cat"}', 'Spay/Neuter; Veterinary Support', NULL,
  NULL, 'Dallas', 'Dallas', NULL, 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '214-372-9999', 'Verification Needed',
  '2026-08-12', 'Legacy clinic/support entry. Current exact organization/HSUS affiliation and phone were not confidently verified; do not use as an animal intake referral without follow-up.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 453. Denton Humane Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Denton Humane Society', 'Rescue/Support', '{"Dog","Cat"}', 'All Breed; Foster Rescue', NULL,
  'Yes', 'Denton', 'Denton', 'Denton County / North Texas', 'DFW / North Texas', 'No',
  'Limited', NULL, NULL, 'https://www.dentonhumanesociety.org/',
  NULL, NULL, '940-382-PETS / Cathy Wenger 940-382-1027 / Michele Helfrich 940-479-2203', 'Verified – Restricted Intake',
  '2026-08-12', 'Current Denton Humane Society is a foster-based nonprofit serving Denton-area companion animals; intake depends on foster capacity. Legacy individual phone contacts should be rechecked before publication.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 454. Education & Animal Rescue Society (EARS)
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Education & Animal Rescue Society (EARS)', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '214-559-2817 Kimberly Jenkins', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 455. Furever Friends
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Furever Friends', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '817-361-7205', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 456. Homeless Animal Rescue Team of TX
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Homeless Animal Rescue Team of TX', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '915-928-4273 / 877-738-HART (4278)', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 457. Humane Society of Greater Dallas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Humane Society of Greater Dallas', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '214-349-7697', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 458. Humane Society of North Texas (HSNT)
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Humane Society of North Texas (HSNT)', 'Rescue/Support', '{"Dog","Cat","Other"}', 'All Breed; Equine; Cruelty; Community Services', NULL,
  'Yes', 'Fort Worth', 'Tarrant', 'North Texas', 'DFW / North Texas', 'No',
  'Limited', NULL, NULL, 'https://www.hsnt.org/',
  NULL, NULL, '817-332-4768', 'Verified – Restricted Intake',
  '2026-08-12', 'Major North Texas animal-welfare organization with sheltering, adoption, equine/livestock, cruelty response and community programs. Intake and surrender options vary by location/capacity.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 459. The Humane Society of the United States
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'The Humane Society of the United States', 'Rescue/Support', '{"Dog","Cat","Other"}', 'National Support; Advocacy; Disaster Response; Animal Protection', NULL,
  'Yes', NULL, NULL, 'United States', NULL, 'Yes',
  'Restricted Program', NULL, NULL, 'https://www.humanesociety.org/',
  NULL, NULL, '972-488-2964', 'Verified – Restricted Intake',
  '2026-08-12', 'National animal-protection organization, not a local public-intake shelter. Baseline Dallas-area phone number should not be used as a local surrender/intake contact.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 460. Humble/Kingwood Min. Schnauzer and Small Breed Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Humble/Kingwood Min. Schnauzer and Small Breed Rescue', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '281-454-5645', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 461. Island Girl Animal Rescue Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Island Girl Animal Rescue Society', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '817-448-9065', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 462. Metroport Humane Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Metroport Humane Society', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '817-491-9499', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 463. NOAH Animal Rescue Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'NOAH Animal Rescue Inc.', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '918-232-1953', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 464. North Ellis County Animal Awareness Program (NECAAP)
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'North Ellis County Animal Awareness Program (NECAAP)', 'Rescue/Support', '{"Dog","Cat"}', 'Spay/Neuter; Community Services; Pet Support', NULL,
  NULL, 'Waxahachie', 'Ellis', 'Ellis County / North Texas', 'DFW / North Texas', 'No',
  'Restricted Program', NULL, NULL, NULL,
  NULL, NULL, '972-878-6674', 'Verified – Restricted Intake',
  '2026-08-12', 'Community animal-welfare/support program rather than conventional open-intake rescue. Retain as Local Support Partner; verify current program eligibility and contact before referral.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 465. Paws & Claws
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Paws & Claws', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '817-491-SAVE', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 466. The Queenie Foundation, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'The Queenie Foundation, Inc.', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '214-328-3332', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 467. Southwest Oklahoma Animal Network
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Southwest Oklahoma Animal Network', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '580-482-8945', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 468. STARS (Save The Animals Rescue Society)
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'STARS (Save The Animals Rescue Society)', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '972-459-9181', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 469. Texas Tailwaggers Village Rescue (TTVR)
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Texas Tailwaggers Village Rescue (TTVR)', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '214-868-0480', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 470. Treasured Friends
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Treasured Friends', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '972-247-3455', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 471. Vernon Texas Human Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Vernon Texas Human Society', 'Rescue/Support', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '940-552-5373', 'Verification Needed',
  '2026-08-12', 'Batch 19 review: exact current-source verification remains needed; legacy contact information should not be assumed current.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 472. Weatherford/Parker County Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Weatherford/Parker County Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Weatherford', 'Parker', 'Weatherford and Parker County jurisdictions served by the facility', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal intake is jurisdiction-dependent; confirm residency/location and current intake procedures before directing an animal to the shelter.', NULL, 'https://www.parkercountytx.com/96/Animal-Control-Lost-Pets-Notices-of-Estr',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal animal services entry. Keep separate from private rescues because legal intake obligations and jurisdiction rules differ.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 473. Allen Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Allen Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Allen', 'Collin', 'City of Allen', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal animal-control services are jurisdiction-based; confirm the animal/location is within Allen before referral.', NULL, 'https://www.cityofallen.org/947/Animal-Control',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'City of Allen municipal animal-control resource. Keep separate from private rescue organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 474. Collin County Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Collin County Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, NULL, 'Collin', 'Unincorporated Collin County and participating jurisdictions', 'DFW / North Texas', 'No',
  'Accepting', 'Jurisdiction-based municipal intake; confirm service-area eligibility and current surrender/stray procedures.', NULL, 'https://www.collincountytx.gov/animal_services',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'County animal-services resource. Keep separate from private rescues and verify jurisdiction before referral.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 475. Argyle Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Argyle Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Argyle', 'Denton', 'Town of Argyle', 'DFW / North Texas', 'No',
  'Accepting', 'Animal-control services are jurisdiction-based; confirm current contractor/shelter destination and procedures before transport.', NULL, 'https://www.argyletx.com/170/Animal-Control',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Municipal animal-control resource. Historical materials indicate contracted services; current destination/contract should be confirmed for case-specific referrals.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 476. All American Dogs
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'All American Dogs', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Animal Control Contractor', NULL,
  NULL, 'Argyle', 'Denton', 'Contract animal-control services for participating North Texas municipalities', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.dfwanimalservices.com/',
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

-- 477. Arlington Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Arlington Animal Services', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Arlington', 'Tarrant', 'City of Arlington', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.arlingtontx.gov/city_hall/departments/animal_services',
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

-- 478. Aubrey Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Aubrey Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Animal Control', NULL,
  NULL, 'Aubrey', 'Denton', 'City of Aubrey', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.aubreytx.gov/164/Animal-Control',
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

-- 479. Azle Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Azle Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Azle', 'Tarrant', 'City of Azle', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.cityofazle.org/',
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

-- 480. Balch Springs Animal Control
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Balch Springs Animal Control', 'Municipal Shelter / Animal Control', '{"Dog","Cat","Other"}', 'Municipal Shelter / Animal Control', NULL,
  NULL, 'Balch Springs', 'Dallas', 'City of Balch Springs', 'DFW / North Texas', 'No',
  'Accepting', 'Municipal/contract animal-control intake is jurisdiction-dependent. Confirm the incident/animal location and current stray, surrender, after-hours, and transport procedures before referral.', NULL, 'https://www.balchspringsal.gov/',
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


commit;
