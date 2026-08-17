-- Batch 7 of 10 — organizations 361 to 420
-- Paste this whole file into the Neon SQL Editor and click Run.

begin;

-- 361. The Pom Squad Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'The Pom Squad Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 15 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 362. Wildlife Rescue & Rehab
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Wildlife Rescue & Rehab', 'Rescue', '{"Wildlife","Other"}', 'Wildlife Rehabilitation; Sanctuary', 'Native wildlife and sanctuary animals',
  'Yes', 'Kendalia', 'Kendall', 'Texas wildlife rescue and rehabilitation', 'Central Texas', 'Yes',
  'Accepting', 'Wildlife rescue hotline is voicemail-based. Facility operates daily 7 AM–7 PM, with after-hours assistance by phone. Call for animal rescue needs.', NULL, 'https://www.wildlife-rescue.org/',
  NULL, 'info@wildlife-rescue.org', '830-336-2725', 'Verified',
  '2026-08-12', 'Official site confirms Wildlife Rescue & Rehabilitation, founded in 1977, is a 501(c)(3) that rescues, rehabilitates and releases native wildlife and provides sanctuary care. Phase 2 intake source: https://www.wildlife-rescue.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 363. A Lab For Life Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'A Lab For Life Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 15 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 364. A Little Bit Of Snuggles Dog Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'A Little Bit Of Snuggles Dog Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 15 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 365. All Aboard Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'All Aboard Animal Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 15 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 366. All Fur Animals Rescue Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'All Fur Animals Rescue Inc.', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 15 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 367. Almost Home Herding Dog Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Almost Home Herding Dog Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Shelter Transfer', 'Border Collies, Australian Shepherds, Rough Collies, Corgis and mixes',
  NULL, 'Gum Spring', NULL, 'Virginia and surrounding states', NULL, 'No',
  'Limited', 'Shelter dogs are first priority; owner surrenders may be accepted only when foster space is available. Out-of-state adoption may be possible with an in-person home visit.', NULL, 'https://www.almosthomehdr.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site confirms this is a Virginia-based foster rescue, not a Texas-local intake resource. Phase 2 intake source: https://www.almosthomehdr.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 368. Animal House Project Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Animal House Project Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 15 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 369. Arctic German Shepherd Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Arctic German Shepherd Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 15 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 370. Animal Rescue & K9 Charities
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Animal Rescue & K9 Charities', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 15 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 371. Barking Back Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Barking Back Animal Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 15 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 372. Be Their Voice Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Be Their Voice Rescue', 'Rescue', '{"Dog"}', 'All Breed; Breed Specific; Medical; Behavioral; Shelter Transfer', 'Special focus on bully breeds',
  NULL, 'Dallas', 'Dallas', 'Dallas-Fort Worth / North Texas', 'DFW / North Texas', 'No',
  'Limited', 'Foster-based and focused on neglected, homeless and shelter dogs; capacity depends on public foster availability.', NULL, 'https://btvrescue.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site says the organization relocated from Buffalo, NY to Dallas in 2024 and rescues about 300 dogs annually, with training/rehabilitation before adoption. Phase 2 intake source: https://btvrescue.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 373. Better Together Dog Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Better Together Dog Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 15 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 374. Biggie Smalls House of Chi
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Biggie Smalls House of Chi', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 15 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 375. BNB Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'BNB Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 15 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 376. Boise Bully Breed Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Boise Bully Breed Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Shelter Transfer; Medical; Behavioral', 'Bully breeds',
  'Yes', NULL, NULL, 'Boise / Idaho shelter network', NULL, 'No',
  'Restricted Program', 'Only accepts bully-breed dogs from shelters that are kennel stressed or have run out of time. No owner surrenders and no found-dog intake.', NULL, 'https://www.boisebullybreedrescue.com/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active in 2026 with available dogs. Idaho-based; not a Texas-local intake resource.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'Yes', 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 377. Bounce Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Bounce Animal Rescue', 'Rescue', '{"Dog","Cat","Other"}', 'All Breed; Foster Rescue', NULL,
  'Yes', 'Fort Collins', NULL, 'Colorado', NULL, 'No',
  'Limited', NULL, NULL, 'https://bounceanimalrescue.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active and identifies Bounce as a 501(c)(3) focused on displaced domestic animals. Colorado-based; not a Texas-local resource.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 378. Carolina Boxer Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Carolina Boxer Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 379. Chelsea’s Hope Boxer Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Chelsea’s Hope Boxer Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 380. Chicagoland Lab Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Chicagoland Lab Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Foster Rescue', 'Labrador Retriever and Lab mixes',
  'Yes', 'Highland Park', NULL, 'Chicagoland / Illinois', NULL, 'No',
  'Limited', 'Foster-based; rescue capacity depends on foster availability.', NULL, 'https://www.chicagolandlabrescue.org/',
  NULL, 'clrinfo99@gmail.com', '951-262-3446', 'Verified – Restricted Intake',
  '2026-08-12', 'Official site has an October 2026 fundraising event and current foster recruitment. Illinois-based.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 381. CLAWA Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'CLAWA Animal Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 382. Echo Dogs White Shepherd Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Echo Dogs White Shepherd Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Medical; Behavioral; Shelter Transfer', 'White German Shepherd / White Shepherd',
  'Yes', 'Hoffman Estates', NULL, 'Eastern United States', NULL, 'No',
  'Limited', 'Operates only east of the Mississippi. Focuses mainly on shelter dogs; owner surrenders are considered only occasionally and are not guaranteed.', NULL, 'https://www.echodogs.org/',
  NULL, 'info@echodogs.org', NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active in 2026; foster-based 501(c)(3), EIN 83-0370726. Current 2026 rescue activity confirmed.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 383. Fawn’s Family Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Fawn’s Family Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 384. Find a Home Pet Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Find a Home Pet Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 385. For Blake’s Sake Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'For Blake’s Sake Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 386. For the Love of Dogs
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'For the Love of Dogs', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 387. For the Love of K-9s
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'For the Love of K-9s', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 388. Furry Flights to Freedom
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Furry Flights to Freedom', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 389. Greater Dayton Lab Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Greater Dayton Lab Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 390. Heart of a Border Collie Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Heart of a Border Collie Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 391. Hoardin’ Huskies
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Hoardin’ Huskies', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 392. Hope of Deliverance
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Hope of Deliverance', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 393. Husky Halfway House
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Husky Halfway House', 'Rescue', '{"Dog"}', 'Breed Specific; Sanctuary-style Rescue; Medical; Behavioral', 'Siberian Husky',
  NULL, NULL, NULL, 'Contiguous United States adoption network', NULL, NULL,
  'Unknown', NULL, NULL, 'https://www.huskyhalfwayhouse.org/',
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Official website still presents adoption operations, but July 31, 2026 public reports state the organization announced it was closing and disabled social accounts. Current operating/intake status should be confirmed before referral.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 394. Husky Haven of Florida
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Husky Haven of Florida', 'Rescue', '{"Dog"}', 'Breed Specific; Foster Rescue; Shelter Transfer', 'Siberian Husky',
  NULL, NULL, NULL, 'Florida', NULL, 'No',
  'Limited', 'Foster-based with no facility. Shelter dogs at risk are prioritized. Owner surrenders require an application/assessment and are accepted only if foster space is available.', 'https://www.huskyhavenfl.org/surrender', 'https://www.huskyhavenfl.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active; Florida-only mission. Not a Texas-local intake resource.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 395. K9 Up Project Free
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'K9 Up Project Free', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 396. Kitty Connection Inc
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Kitty Connection Inc', 'Rescue', '{"Cat"}', 'All Breed; Foster Rescue; Community Cats', 'Cats and kittens',
  NULL, 'Medford', NULL, 'Greater Boston / Massachusetts', NULL, 'No',
  'Limited', 'Foster-based and actively seeking kitten-season fosters; space can be constrained.', NULL, 'https://www.kittyconnection.net/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active with July 2026 fundraising and foster recruitment. Massachusetts-based.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Case-by-case', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 397. Lab-adore Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lab-adore Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 398. Labs 4 Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Labs 4 Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 399. Lake Lowell Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lake Lowell Animal Rescue', 'Rescue', '{"Dog","Cat","Other"}', 'All Breed; Foster Rescue; Abandoned Animals', NULL,
  'Yes', NULL, NULL, 'Treasure Valley / Idaho', NULL, 'No',
  'Temporarily Closed', 'Official site states the rescue is at full capacity and unable to accept any animal intakes. It does not accept owner surrenders unless pre-approved by an administrator.', NULL, 'https://www.lakelowellanimalrescue.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Foster-based Idaho 501(c)(3) specializing in abandoned cats, dogs and other small domestic animals around Lake Lowell/Treasure Valley.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'No', 'No', 'No' from new_org;

-- 400. Legends of the Paws
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Legends of the Paws', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 16 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 401. Life Horse at Grand Review Farm
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Life Horse at Grand Review Farm', 'Rescue', '{"Other"}', 'Equine-Assisted Services', 'Horses',
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Restricted Program', 'Equine-assisted learning/riding program; not verified as a general animal rescue intake organization.', NULL, 'https://lifehorseva.org/',
  NULL, NULL, '850-290-2245', 'Verified – Restricted Intake',
  '2026-08-12', 'Current official site focuses on therapeutic/equine-assisted programs. Baseline classification as Rescue should be reviewed.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'No', 'No', 'No' from new_org;

-- 402. Mid Missouri Malamute Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Mid Missouri Malamute Rescue', 'Rescue', '{}', NULL, NULL,
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

-- 403. Mile High Lab Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Mile High Lab Rescue', 'Rescue', '{}', NULL, NULL,
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

-- 404. Minnesota Boxer Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Minnesota Boxer Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Medical; Foster Rescue', 'Boxer',
  'Yes', 'Woodbury', NULL, 'Minnesota and surrounding areas', NULL, 'No',
  'Limited', 'Foster-based; rescues shelter dogs, owner surrenders, and abuse/neglect cases. Capacity depends on foster availability.', NULL, 'https://minnesotaboxerrescue.com/',
  NULL, 'info@minnesotaboxerrescue.com', '763-647-3037', 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active with current dogs and dedicated intake coordinator. 501(c)(3), EIN 20-4758118.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 405. Mission Compassion Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Mission Compassion Rescue', 'Rescue', '{}', NULL, NULL,
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

-- 406. Minnesota Pit Bull Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Minnesota Pit Bull Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Foster Rescue', 'Pit bull-type dogs',
  NULL, NULL, NULL, 'Minnesota', NULL, 'No',
  'Limited', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Current organization retained as Minnesota-based breed rescue; not a Texas-local resource. Capacity should be confirmed directly.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 407. Next Stop Home Chicago
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Next Stop Home Chicago', 'Rescue', '{}', NULL, NULL,
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

-- 408. North Star Pet Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'North Star Pet Rescue', 'Rescue', '{}', NULL, NULL,
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

-- 409. Puppies Are Worth Saving Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Puppies Are Worth Saving Rescue', 'Rescue', '{}', NULL, NULL,
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

-- 410. Paws Up Pet Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Paws Up Pet Rescue', 'Rescue', '{}', NULL, NULL,
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

-- 411. Pawsitive Tails Inc
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Pawsitive Tails Inc', 'Rescue', '{"Dog"}', 'All Breed; Foster Rescue', NULL,
  NULL, NULL, NULL, 'Kansas City area', NULL, 'No',
  'Limited', 'Foster-based; capacity depends on available foster homes.', NULL, NULL,
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Current 2026 reporting confirms active Kansas City-area foster/adoption operations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 412. Perfect Pooches
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Perfect Pooches', 'Rescue', '{}', NULL, NULL,
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

-- 413. Pibbles and More Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Pibbles and More Animal Rescue', 'Rescue', '{"Dog"}', 'All Breed; Breed Specific; Medical; Foster Rescue', 'Pit bull-type dogs and other dogs',
  'Yes', 'Binghamton', NULL, 'New York / Northeast foster network', NULL, 'No',
  'Limited', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'IRS-derived record confirms active 501(c)(3), EIN 45-0707292, with 2024 filing. Current rescue activity documented in Northeast cases; not Texas-local.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 414. Pit Squad Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Pit Squad Rescue', 'Rescue', '{}', NULL, NULL,
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

-- 415. Project Hope Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Project Hope Animal Rescue', 'Rescue', '{}', NULL, NULL,
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

-- 416. Rescue Coop
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Rescue Coop', 'Rescue', '{}', NULL, NULL,
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

-- 417. Rescue Dogs Rock
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Rescue Dogs Rock', 'Rescue', '{"Dog"}', 'All Breed; Medical; Neglect; Foster Rescue', NULL,
  NULL, NULL, NULL, 'New York / Northeast; pulls dogs from southern states', NULL, 'No',
  'Limited', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Current rescue/foster activity confirmed; organization focuses heavily on critically injured and neglected dogs and uses a Northeast foster network.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 418. Rescue Theory
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Rescue Theory', 'Rescue', '{}', NULL, NULL,
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

-- 419. Road to Home Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Road to Home Rescue', 'Rescue', '{}', NULL, NULL,
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

-- 420. Safe Tails Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Safe Tails Animal Rescue', 'Rescue', '{}', NULL, NULL,
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


commit;
