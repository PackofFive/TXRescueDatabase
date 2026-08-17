-- Batch 1 of 10 — organizations 1 to 60
-- Paste this whole file into the Neon SQL Editor and click Run.

begin;

-- 1. 2 Bullies and A Blonde
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  '2 Bullies and A Blonde', 'Rescue', '{"Dog"}', 'Breed Specific', 'Bully breeds',
  'Yes', 'Princeton', 'Collin', 'Texas; has historically assisted dogs from other southern states', 'DFW / North Texas', 'Unclear',
  'Unknown', NULL, NULL, NULL,
  'https://www.facebook.com/2BulliesAndABlonde501c3/', '2bulliesandablonde@gmail.com', NULL, 'Verified',
  '2026-08-12', 'Small foster/home-based bully breed rescue. Source: https://www.facebook.com/2BulliesAndABlonde501c3/ ; supporting profile: https://petshelters.org/shelter/2_bullies_and_a_blonde_irving_tx'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 2. Abby Road Dachshund Rescue Sanctuary
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Abby Road Dachshund Rescue Sanctuary', 'Rescue', '{"Dog"}', 'Breed Specific; Senior', 'Dachshunds; all-breed seniors',
  'Yes', 'Lavon', 'Collin', 'North Texas; listed counties include Collin, Dallas, Denton, Hunt, Kaufman, Rockwall and Tarrant', 'DFW / North Texas', 'No',
  'Unknown', 'Primarily dachshunds/dachshund mixes and senior dogs; verify case-specific intake before referral.', 'https://forms.gle/sdhG9P7vGNE2Fwh58', 'https://abbyroadrescuesanctuary.org/',
  'https://www.facebook.com/AbbyRoadSanctuary/', 'spindoxie@gmail.com', '214-493-3313', 'Verified',
  '2026-08-12', 'Active rescue/sanctuary with current adoptable animals. Sources: https://www.adoptapet.com/shelter/90784-abby-road-rescue-sanctuary-lavon-texas ; https://www.northtexasgivingday.org/organization/Abbyroadrescue'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 3. Addicus Legacy Dog Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Addicus Legacy Dog Rescue', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  'Yes', 'Vernon Rockville', NULL, 'Texas and New England; dogs are rescued from Texas and Mexico and adopted in Texas and northeastern states', 'Statewide', 'Yes',
  'Unknown', NULL, NULL, 'https://www.addicuslegacy.org/',
  NULL, 'info@addicuslegacy.org', NULL, 'Verified',
  '2026-08-12', 'National foster network; official site active in 2026. Sources: https://www.addicuslegacy.org/ ; https://www.charitynavigator.org/ein/813323375'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 4. A Doberman Adoption Placement Team - ADAPT
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'A Doberman Adoption Placement Team - ADAPT', 'Rescue', '{"Dog"}', 'Breed Specific', 'Doberman Pinscher',
  'Yes', 'Kingwood', 'Harris', 'Texas; occasionally surrounding states', 'Houston / Gulf Coast', 'Yes',
  'Unknown', NULL, NULL, 'https://adaptdobermanrescue.com/',
  'https://www.facebook.com/adaptrescue/', NULL, NULL, 'Verified',
  '2026-08-12', 'All-volunteer Doberman rescue; official site states owner turn-ins and shelter dogs are common intake sources. Sources: https://adaptdobermanrescue.com/ ; https://adaptdobermanrescue.com/about-us/ Phase 2 intake source: https://adaptdobermanrescue.com/about-us/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 5. Adopt a Husky of Dallas, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Adopt a Husky of Dallas, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific; All Breed', 'Siberian Huskies and mixes; also assists other breeds',
  'Yes', 'Plano', 'Collin', 'North Texas with some out-of-state placements', 'DFW / North Texas', 'Unclear',
  'Unknown', NULL, NULL, 'https://adoptahusky.org/',
  NULL, 'huskiesandmutts@gmail.com', '214-603-7211', 'Verified',
  '2026-08-12', 'Current Petfinder listings confirm active adoption activity. Sources: https://www.petfinder.com/member/us/tx/plano/adopt-a-husky-of-dallas-inc-tx85/ ; https://www.floofmatcher.com/organizations/us/texas/plano/adopt-a-husky-of-dallas-inc-6311'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 6. Akita Rescue of Northwestern Pennsylvania
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Akita Rescue of Northwestern Pennsylvania', 'Rescue', '{"Dog"}', 'Breed Specific', 'Akita',
  'Yes', 'Corry', 'Erie', 'Northwestern Pennsylvania; nationwide assistance as feasible', NULL, 'No',
  'Unknown', NULL, NULL, 'https://www.facebook.com/AkitaRescueofNorthwesternPennsylvania/',
  'https://www.facebook.com/AkitaRescueofNorthwesternPennsylvania/', 'akitarescuenwpa@gmail.com', NULL, 'Verified',
  '2026-08-12', 'Active breed-specific rescue; IRS-recognized 501(c)(3). Sources: https://projects.propublica.org/nonprofits/organizations/471385572 ; https://www.werescue.pet/shelter/24674/akita-rescue-of-northwestern-pennsylvania/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 7. All Paws Matter
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'All Paws Matter', 'Rescue', '{"Dog","Cat","Other"}', 'All Breed', NULL,
  'Yes', 'Englewood', 'Arapahoe', NULL, NULL, 'No',
  'Unknown', NULL, NULL, 'https://www.allpawsmatterrescue.org/',
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Conflicting current evidence: an active rescue website exists, while BBB reports the Englewood entity may be out of business. Verify identity/current operations before referral. Sources: https://www.allpawsmatterrescue.org/ ; https://www.bbb.org/us/co/englewood/profile/animal-rescue/all-paws-matter-rescue-1296-90259297 ; https://projects.propublica.org/nonprofits/organizations/822442259'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 8. All Points West German Shorthaired Pointer Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'All Points West German Shorthaired Pointer Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'German Shorthaired Pointer',
  'Yes', 'Elizabeth', 'Elbert', 'Colorado, Wyoming and New Mexico; organization also references neighboring western states', NULL, 'No',
  'Unknown', NULL, NULL, 'https://www.allpointswestgsp.org/',
  NULL, 'allpointswestgsp@gmail.com', NULL, 'Verified',
  '2026-08-12', 'Foster-based breed rescue with active 2026 website. Sources: https://www.allpointswestgsp.org/ ; https://www.charitynavigator.org/ein/813816255 Phase 2 intake source: https://www.allpointswestgsp.org/surrender'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Case-by-case', 'Yes', 'Yes', 'Yes', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 9. All Texas Dachshund Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'All Texas Dachshund Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Dachshund',
  'Yes', 'Pearland', 'Brazoria', 'Texas; Austin, DFW, Houston, San Antonio and surrounding areas', 'Statewide', 'Yes',
  'Unknown', NULL, NULL, 'https://www.atdr.org/',
  NULL, 'info@atdr.org', NULL, 'Verified',
  '2026-08-12', 'Official site active in 2026. Source: https://www.atdr.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 10. American Belgian Malinois Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'American Belgian Malinois Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Belgian Malinois',
  'Yes', 'Amherst Junction', 'Portage', 'Most of the continental United States; excludes several western states', 'Statewide', 'Yes',
  'Unknown', NULL, NULL, 'https://www.malinoisrescue.org/',
  NULL, 'abmr.rescue@gmail.com', NULL, 'Verified',
  '2026-08-12', 'National foster-based breed rescue; Texas is within the stated service area. Sources: https://www.malinoisrescue.org/ ; https://www.werescue.pet/shelter/25464/american-belgian-malinois-rescue-inc/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 11. American Bullmastiff Association Rescue Service
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'American Bullmastiff Association Rescue Service', 'Rescue', '{"Dog"}', 'Breed Specific', 'Bullmastiff',
  'Unable to Verify', 'Templeton', 'Worcester', 'United States through regional rescue volunteers', NULL, 'Unclear',
  'Unknown', NULL, NULL, 'https://bullmastiff.us/rescue/',
  NULL, 'abarescue@gmail.com', NULL, 'Verified',
  '2026-08-12', 'Active rescue program with 2026 calendar/current volunteer listings and surrender forms. Separate 501(c)(3) status for the rescue service was not independently verified. Sources: https://bullmastiff.us/rescue/ ; https://bullmastiff.us/rescue/additional-rescue-forms/ Phase 2 intake source: https://bullmastiff.us/rescue/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Case-by-case', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 12. Angels 2 the Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Angels 2 the Rescue', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  'Yes', 'Marianna', 'Lee', NULL, NULL, 'No',
  'Unknown', NULL, NULL, 'https://www.facebook.com/Angels2therescue',
  'https://www.facebook.com/angelsrescue/', NULL, NULL, 'Verified',
  '2026-08-12', 'Arkansas-based dog rescue with recent 2026 social activity and nonprofit records. Sources: https://www.facebook.com/angelsrescue/ ; https://www.grantwatch.com/organization-profile/1223366/angels-2-the-rescue/2018/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 13. Animal Rescue Foundation of Texas, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Animal Rescue Foundation of Texas, Inc.', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  'Yes', 'Flower Mound', 'Denton', 'Dallas-Fort Worth area', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://arftx.com/',
  NULL, 'info@ARFtx.com', '972-318-9650', 'Verified',
  '2026-08-12', 'Current official site and active nonprofit listing. Sources: https://arftx.com/ ; https://www.northtexasgivingday.org/organization/Animal-Rescue-Foundation-Of-Texas'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 14. Animals First Foundation of Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Animals First Foundation of Texas', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  'Yes', 'Irving', 'Dallas', 'Dallas-Fort Worth area', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.facebook.com/AnimalsFirstFoundationofTexas/',
  'https://www.facebook.com/AnimalsFirstFoundationofTexas/', NULL, NULL, 'Verified',
  '2026-08-12', 'Foster-based 501(c)(3) rescue; Facebook shows current activity. Sources: https://www.facebook.com/AnimalsFirstFoundationofTexas/ ; https://www.adoptapet.com/shelter/84483-animals-first-foundation-of-texas-irving-texas Phase 2 intake source: https://affoftx.rescueme.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 15. A Rottie Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'A Rottie Rescue, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Rottweiler',
  NULL, 'Watauga', 'Tarrant', NULL, 'DFW / North Texas', NULL,
  'Temporarily Closed', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Internal Review',
  '2026-08-12', 'Retained for baseline history. Prior review found 2025 seizure/enforcement concerns and loss of rescue-pull privileges. Do not refer without a fresh re-review.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 16. Austin Boxer Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Austin Boxer Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Boxer',
  'Yes', 'Austin', 'Travis', 'Entire state of Texas, including Austin, Houston and DFW', 'Statewide', 'Yes',
  'Limited', 'Primary focus is shelter Boxers; owner surrenders have stringent guidelines; strays should go through local shelter first.', 'https://austinboxerrescue.com/rehoming/', 'https://austinboxerrescue.com/',
  NULL, 'infoabrtx@gmail.com', '888-333-2368', 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active and states statewide service. Source: https://austinboxerrescue.com/ Phase 2 intake source: https://austinboxerrescue.com/rehoming/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'No', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Yes' from new_org;

-- 17. Australian Cattle Dog Rescue MN
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Australian Cattle Dog Rescue MN', 'Rescue', '{"Dog"}', 'Breed Specific', 'Australian Cattle Dog',
  'Unable to Verify', 'Delano', 'Wright', 'Minnesota / North Central region', NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, 'ACDRescueMN@gmail.com', NULL, 'Verification Needed',
  '2026-08-12', 'A current Australian Cattle Dog Rescue Inc. regional-contact page still lists ACD Rescue Minnesota, but ProPublica notes the organization is not in the IRS''s most recent exempt-organization list. Verify current legal/operating status before referral. Sources: https://acdrescueinc.org/regional-contacts/ ; https://projects.propublica.org/nonprofits/organizations/464800992'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 18. Australian Shepherds Furever
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Australian Shepherds Furever', 'Rescue', '{"Dog"}', 'Breed Specific', 'Australian Shepherds and Aussie mixes',
  'Yes', 'Ontario', 'San Bernardino', 'Nationwide foster network', 'Statewide', 'Yes',
  'Unknown', NULL, NULL, 'https://www.australianshepherdsfurever.org/',
  'https://www.facebook.com/AustralianShepherdsFurever/', 'australianshepherdsfurever@gmail.com', NULL, 'Verified',
  '2026-08-12', 'National breed-specific 501(c)(3) with current website and daily-updated pet listings. Sources: https://www.australianshepherdsfurever.org/available-pets ; https://projects.propublica.org/nonprofits/organizations/463163686'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 19. A Voice For All Paws
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'A Voice For All Paws', 'Rescue', '{"Cat"}', 'All Breed', NULL,
  'Yes', 'Dallas', 'Dallas', 'Dallas-Fort Worth metroplex; Dallas, Tarrant and Collin counties', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://avoiceforallpaws.com/',
  'https://www.facebook.com/AVAP2018/', NULL, NULL, 'Verified',
  '2026-08-12', '100% foster-based cat rescue affiliated with Whiskers & Soda Cat Café. Sources: https://avoiceforallpaws.com/ ; https://www.adoptapet.com/shelter/104887-a-voice-for-all-paws-animal-rescue-dallas-texas Phase 2 intake source: https://avoiceforallpaws.com/contact/ ; https://www.northtexasgivingday.org/organization/avoiceforallpaws'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Case-by-case', 'Yes', 'Case-by-case', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 20. Barrington Area Animal Rescue and Kennel
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Barrington Area Animal Rescue and Kennel', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  'Yes', 'Barrington Hills', NULL, 'Chicago area; primary location Barrington Hills with Naperville satellite', NULL, 'No',
  'Unknown', NULL, NULL, 'https://www.baarkdogrescue.org/',
  NULL, 'BAARKDogRescue@gmail.com', '847-852-0895', 'Verified',
  '2026-08-12', 'All-volunteer foster-based rescue. Official site states intake can include shelters, animal control, other rescues, owner surrenders, hoarding and puppy mills. Sources: https://www.baarkdogrescue.org/ ; https://www.baarkdogrescue.org/about.html ; https://www.baarkdogrescue.org/services--activities.html'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 21. Basset Rescue Across Texas, Inc. (bratz)
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Basset Rescue Across Texas, Inc. (bratz)', 'Rescue', '{"Dog"}', 'Breed Specific', 'Basset Hound',
  'Yes', 'Carrollton', NULL, 'Texas', 'Statewide', 'Yes',
  'Unknown', NULL, NULL, 'https://www.bratx.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Active statewide Basset Hound rescue. Source: https://www.bratx.org/ Phase 2 intake source: https://www.bbrtx.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 22. Big Bones Canine Rescue Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Big Bones Canine Rescue Services', 'Rescue', '{"Dog"}', 'Large Breed', 'Large breed dogs',
  'Yes', 'Windsor', 'Weld', 'Colorado', NULL, 'No',
  'Unknown', NULL, NULL, 'https://www.bigbonescaninerescue.com/',
  NULL, 'bigbonesrescue@gmail.com', '970-310-3616', 'Verified',
  '2026-08-12', 'Active 501(c)(3) large-breed rescue with 2024 Form 990 and 2026 Colorado Gives profile. Sources: https://www.causeiq.com/organizations/big-bones-canine-rescue-services%2C462066034/ ; https://www.coloradogives.org/organization/BigBonesCanineRescueServices'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 23. Big Dog Haven
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Big Dog Haven', 'Rescue', '{"Dog"}', 'Large Breed; Medical', 'Large breed dogs',
  'Yes', 'Greeneville', 'Greene', 'Tennessee; may coordinate out-of-area placements', NULL, 'No',
  'Temporarily Closed', 'A current Facebook post located during verification states the rescue is closed for intake due to lack of funds; recheck before referral.', NULL, 'https://bigdoghaveninc.com/',
  'https://www.facebook.com/bigdoghaveninc/', 'rescueme@bigdoghaveninc.com', '615-517-0282', 'Verified – Restricted Intake',
  '2026-08-12', 'Active 501(c)(3) with current website and recent nonprofit filings. Sources: https://bigdoghaveninc.com/ ; https://www.charitynavigator.org/ein/473401049 ; Facebook intake-closure post found during 08/12/2026 verification.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 24. Big Dogs Huge Paws, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Big Dogs Huge Paws, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Giant breed dogs',
  'Yes', 'Aurora', 'Arapahoe', 'Multi-state giant-breed rescue network', NULL, 'No',
  'Unknown', NULL, NULL, 'https://www.bigdogshugepaws.com/',
  'https://www.facebook.com/BigDogsHugePawsRescue/', NULL, NULL, 'Verified',
  '2026-08-12', 'Active 501(c)(3) dedicated to giant-breed dogs. Sources: https://www.bigdogshugepaws.com/ ; https://www.coloradogives.org/organization/Big-Dogs-Huge-Paws-1'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 25. Bimmer's Border Collie Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Bimmer''s Border Collie Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Border Collie',
  'Yes', 'Woodbridge', 'Prince William', 'Northern Virginia and surrounding areas, including DC and Maryland', NULL, 'No',
  'Unknown', NULL, NULL, 'https://www.bimmersbcr.org/',
  'https://www.facebook.com/people/Bimmers-BCR/61569027996273/', 'bimmersbcr@yahoo.com', NULL, 'Verified',
  '2026-08-12', 'Foster-based Border Collie rescue; official site states 501(c)(3) status and preference for placements in northern VA/DC/MD. Sources: https://www.bimmersbcr.org/ ; https://www.petfinder.com/member/us/va/woodbridge/bimmers-border-collie-rescue-va362/ Phase 2 intake source: https://www.bimmersbcr.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'No', 'Unknown' from new_org;

-- 26. Blue Angel Weimaraner Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Blue Angel Weimaraner Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Weimaraner',
  'Yes', 'Burleson', 'Johnson', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, 'blueangelweims@att.net', '469-844-0425', 'Verified',
  '2026-08-12', 'Current Petfinder/Adopt-a-Pet profiles identify a Burleson 501(c)(3) Weimaraner rescue; no pets listed at verification. Sources: Petfinder and Adopt-a-Pet.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 27. Border Collie Save and Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Border Collie Save and Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Border Collie',
  'Yes', NULL, NULL, 'Central and North Texas', 'Central Texas; DFW / North Texas', 'No',
  'By Application Only', NULL, 'https://bcsave.org/apply/', 'https://bcsave.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site identifies all-volunteer 501(c)(3) and provides owner relinquishment request. Phase 2 intake source: https://bcsave.org/os-apply/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 28. Bosque Animal Rescue Kennels
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Bosque Animal Rescue Kennels', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  'Yes', 'Clifton', 'Bosque', NULL, 'Central Texas', NULL,
  NULL, NULL, NULL, 'https://www.barkrescue.org/',
  'https://www.facebook.com/BosqueAnimalRescueKennels1/', NULL, '254-978-0315', 'Verified',
  '2026-08-12', 'Official contact page active; 501(c)(3) verified via IRS-derived nonprofit record.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 29. Boston Terrier Rescue North Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Boston Terrier Rescue North Texas', 'Rescue', '{"Dog"}', 'Breed Specific', 'Boston Terrier',
  NULL, 'Plano', 'Collin', 'Texas', 'DFW / North Texas', 'Yes',
  'Restricted', NULL, NULL, 'https://www.texasbostons.com/site/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Current 2025 evidence confirms active North Texas Boston Terrier rescue and statewide placements; reported owner-planning intake restrictions warrant direct confirmation before referral. Sources: City of Arlington rescue partner list; current community referral to texasbostons.com.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 30. Braveheart Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Braveheart Animal Rescue', 'Rescue', '{"Dog","Cat"}', 'All Breed; Medical', NULL,
  NULL, 'Arlington', 'Tarrant', NULL, 'DFW / North Texas', NULL,
  NULL, NULL, NULL, 'http://braveheartanimalrescue.org',
  NULL, 'Jokyle@braveheartanimalrescue.org', '817-721-3651', 'Verification Needed',
  '2026-08-12', 'Nonprofit profile lists EIN 47-3723042 and Arlington contact details; current official-site activity should be confirmed before referral.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 31. Bright Starz Neu-Life Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Bright Starz Neu-Life Animal Rescue', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  NULL, 'Haskell', 'Passaic', NULL, NULL, 'No',
  'Unknown', NULL, NULL, 'https://www.facebook.com/brightstarzneulifeanimalrescue',
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Still listed by City of Arlington as a rescue partner, but current operating details were not independently confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 32. Broken Arrow German Shepherd Rescue Ranch
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Broken Arrow German Shepherd Rescue Ranch', 'Rescue', '{"Dog"}', 'Breed Specific', 'German Shepherd',
  'Yes', 'Christoval', 'Tom Green', NULL, 'West Texas', 'Unclear',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'IRS-derived nonprofit record confirms 501(c)(3), EIN 82-1345004; latest filing located was 2022. Current operating activity should be confirmed before referral.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 33. Bull Luvable Paws & Chi Wawas Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Bull Luvable Paws & Chi Wawas Rescue', 'Rescue', '{"Dog"}', 'All Breed; Special Needs', 'Bully breeds; Chihuahuas; other dogs',
  NULL, 'Rockwall', 'Rockwall', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Current rescue-directory listing describes rehabilitation-focused North Texas dog rescue; official/current operating source not confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 34. Bull Terrier Club of America Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Bull Terrier Club of America Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Bull Terrier',
  'Yes', 'Glenwood', NULL, 'United States through coordinated local rescue efforts', NULL, 'Yes',
  'Unknown', NULL, NULL, 'https://bullterrierclubofamericarescue.com/',
  NULL, 'Bullterrierhelp@gmail.com', NULL, 'Verified',
  '2026-08-12', 'BTCA identifies its Rescue and Welfare Trust Fund as 501(c)(3) and coordinates rescue/rehome efforts nationally.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 35. Bulldog Rescue Squad
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Bulldog Rescue Squad', 'Rescue', '{"Dog"}', 'Breed Specific', 'Bulldog; French Bulldog',
  'No', 'Aubrey', 'Denton', NULL, 'DFW / North Texas', NULL,
  'Temporarily Closed', NULL, NULL, 'https://www.bulldogrescuesquad.com/',
  NULL, NULL, NULL, 'Inactive / Closed',
  '2026-08-12', 'Organization filed a final 2024 Form 990 and is reported terminated/absent from current IRS active lists. Retained for baseline history.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'Yes', 'Unknown', 'Unknown', 'No', 'No', 'No' from new_org;

-- 36. Cane Rosso Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Cane Rosso Rescue', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  'Yes', 'Dallas', 'Dallas', 'Dallas-Fort Worth / Texas dogs', 'DFW / North Texas', 'Unclear',
  'Unknown', NULL, NULL, 'https://www.canerossorescue.org/',
  NULL, 'rescue@canerosso.com', NULL, 'Verified',
  '2026-08-12', 'Official site active; volunteer-based Dallas 501(c)(3) providing foster, transport, veterinary treatment and placement. Phase 2 intake source: https://www.canerossorescue.org/who-we-are ; https://www.canerossorescue.org/home-1'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 37. Cavalier Rescue USA
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Cavalier Rescue USA', 'Rescue', '{"Dog"}', 'Breed Specific', 'Cavalier King Charles Spaniel',
  'Yes', 'Sanibel', NULL, 'Nationwide; active Texas foster/adoption presence', 'Statewide', 'Yes',
  'Unknown', NULL, NULL, 'https://www.cavalierrescueusa.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site had a Houston, TX foster dog update dated June 2026, confirming current Texas activity.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 38. Chihuahua Rescue & Transport, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Chihuahua Rescue & Transport, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Chihuahua and Chihuahua mixes',
  'Yes', NULL, NULL, 'Multi-state foster network including Texas', 'Statewide', 'Yes',
  'Unknown', NULL, NULL, 'https://www.chihuahua-rescue.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site describes long-running foster-based Chihuahua rescue with application, references, vet check and home visit.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 39. Chinese Share Pei Network, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Chinese Share Pei Network, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Chinese Shar-Pei and mixes',
  'Yes', 'Proctor', 'Adair', 'United States; foster need specifically includes Texas, California and Oklahoma', 'Statewide', 'Yes',
  'Unknown', NULL, NULL, 'https://www.chinesesharpeinetwork.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Baseline name appears misspelled (''Share Pei''); official organization is Chinese Shar Pei Network, Inc. Official site active and states 501(c)(3).'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 40. Cocker Spaniel Rescue of East TX
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Cocker Spaniel Rescue of East TX', 'Rescue', '{"Dog"}', 'Breed Specific', 'Cocker Spaniel',
  'Yes', 'Sugar Land', 'Fort Bend', 'Texas / Houston-area foster network', 'Houston / Gulf Coast', 'Unclear',
  'Unknown', NULL, NULL, 'https://www.cockerkids.org/',
  NULL, 'cockerinfo@swbell.net', '713-208-1314', 'Verified',
  '2026-08-12', 'Official site active with 2026 fundraising materials and states IRS-recognized 501(c)(3).'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 41. Code Red Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Code Red Rescue', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  'Yes', 'Fort Worth', 'Tarrant', 'North Texas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.coderedrescue.com/',
  NULL, 'info@coderedrescue.com', NULL, 'Verified',
  '2026-08-12', '501(c)(3) North Texas rescue focused on at-risk shelter dogs; current 2026 rescue references found. Phase 2 intake source: https://www.coderedrescue.com/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 42. Cody's Friends Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Cody''s Friends Rescue', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  'Yes', 'Dallas', 'Dallas', 'Dallas-Fort Worth metroplex', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.codysfriendsrescue.org/',
  NULL, 'cody@codysfriendsrescue.com', NULL, 'Verified',
  '2026-08-12', 'Official 2026 website active; EIN 30-0759470; current adoptable dogs and events listed.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 43. Col. Potter Cairn Rescue Network
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Col. Potter Cairn Rescue Network', 'Rescue', '{"Dog"}', 'Breed Specific', 'Cairn Terrier and related terriers',
  'Yes', 'Mehoopany', NULL, 'United States foster network', NULL, 'Yes',
  'Unknown', NULL, NULL, 'https://www.cairnrescue.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'National breed rescue; City of Arlington continues to list it as a rescue partner.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 44. Companion Pet Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Companion Pet Rescue', 'Rescue', '{"Cat"}', 'All Breed; Community Cats', NULL,
  'Yes', 'Bedford', 'Tarrant', 'North Texas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '817-707-3894', 'Verified',
  '2026-08-12', 'Current directory describes cat-focused TNVR, relocation and adoption work in North Texas. IRS-derived record confirms Companion Pet Rescue CPR Inc. as 501(c)(3).'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 45. Corgis & Critters Northeast Texas Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Corgis & Critters Northeast Texas Rescue, Inc.', 'Rescue', '{"Dog","Other"}', 'Breed Specific; All Breed', 'Corgis and other animals',
  'Yes', 'Kilgore', 'Gregg', 'Northeast Texas', 'East Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Tax-exempt 501(c)(3) record located, but current operating/adoption activity was not independently confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 46. Cowtown Boxer Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Cowtown Boxer Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Boxer',
  'Unable to Verify', 'Fort Worth', 'Tarrant', 'Texas; Dallas-Fort Worth based', 'DFW / North Texas', 'Yes',
  'Unknown', NULL, NULL, 'https://www.cowtownboxerrescue.org',
  NULL, 'info@cowtownboxerrescue.org', NULL, 'Verified',
  '2026-08-12', 'Current Adopt-a-Pet profile lists adoptable dog(s) and statewide Texas service; website domain was reported offline in June 2026, so use current adoption platform/contact if site fails.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 47. Crafts for Paws
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Crafts for Paws', 'Rescue', '{"Other"}', 'Fundraising / Support', NULL,
  'Yes', 'Cedar Hill', 'Dallas', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, 'https://craftsforpaws.com/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Appears to be an animal-welfare fundraising/support organization rather than a conventional intake rescue. Tax-exempt listing found for Cedar Hill; do not use as intake referral without confirmation.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'No', 'No', 'No' from new_org;

-- 48. Dachshund Lovers of TX
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Dachshund Lovers of TX', 'Rescue', '{"Dog"}', 'Breed Specific; Senior; Medical', 'Dachshund',
  'Yes', 'Dallas', 'Dallas', 'DFW / North Texas; adoptions limited to Texas', 'DFW / North Texas', 'No',
  'Limited', 'Small foster-based rescue; primarily rescues from North Texas shelters. Adoption limited to Texas.', NULL, 'https://www.dltrescue.org/',
  NULL, 'info@dltrescue.org', NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site updated May 16, 2026; 17 dogs listed. Site identifies 501(c)(3), foster-based Dachshund rescue. Phase 2 intake source: https://www.dltrescue.org/info/ ; https://www.dltrescue.org/info/donate'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 49. Dallas Street Dog Advocates
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Dallas Street Dog Advocates', 'Rescue', '{"Dog"}', 'All Breed; Street Dogs; Medical', NULL,
  'Yes', 'Richardson', 'Dallas', 'Dallas, Dallas County and surrounding rural areas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://dsda.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active with August/September 2026 events and June 2026 blog; IRS-derived record shows 2025 Form 990. Phase 2 intake source: https://dsda.org/ ; https://dsda.org/team/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 50. Dashing Dog Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Dashing Dog Rescue', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  'Yes', 'Lewisville', 'Denton', 'Carrollton, Flower Mound, Highland Village, Lantana and Lewisville / DFW', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.dashingdogrescue.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active; foster-only all-breed 501(c)(3) rescuing dogs from local shelters. Phase 2 intake source: https://www.dashingdogrescue.com/about.php'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 51. DFW Beagle Buddies
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'DFW Beagle Buddies', 'Rescue', '{"Dog"}', 'Breed Specific', 'Beagle and Beagle mixes',
  'Yes', 'Mansfield', 'Tarrant', 'Dallas-Fort Worth Metroplex', 'DFW / North Texas', 'No',
  'Temporarily Closed', NULL, NULL, 'https://dfwbeaglebuddies.org/',
  'https://www.facebook.com/DFWBeagleBuddies/', NULL, NULL, 'Inactive / Closed',
  '2026-08-12', 'Official website says the organization is seeking someone to take over the rescue; Facebook states it is officially winding down after 15 years. Sources: https://dfwbeaglebuddies.org/ ; https://www.facebook.com/DFWBeagleBuddies/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'Yes', 'Unknown', 'Unknown', 'No', 'No', 'No' from new_org;

-- 52. DFW Cocker Spaniel Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'DFW Cocker Spaniel Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Cocker Spaniel',
  'Yes', 'Plano', 'Collin', 'North Texas', 'DFW / North Texas', 'No',
  'Limited', 'Owner releases accepted when foster space is available; owner release form required.', NULL, 'https://dfwcockerrescue.org/',
  NULL, 'dfwcsr@gmail.com', '972-994-1133', 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active in 2026 with available dogs. Sources: https://dfwcockerrescue.org/ ; https://dfwcockerrescue.org/contact-us/ Phase 2 intake source: https://dfwcockerrescue.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 53. DFW Dachshund Rescue Foundation
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'DFW Dachshund Rescue Foundation', 'Rescue', '{"Dog"}', 'Breed Specific', 'Dachshund',
  'Yes', 'Colleyville', 'Tarrant', 'Immediate Dallas-Fort Worth area', 'DFW / North Texas', 'No',
  'Unknown', 'Adopters must live in the immediate Dallas/Fort Worth area.', NULL, 'https://www.dfwdachshund.com/rescue',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official DFW Dachshund Club rescue page identifies the Foundation as a 501(c)(3). Sources: https://www.dfwdachshund.com/rescue ; https://www.petfinder.com/member/us/tx/colleyville/dallas-fort-worth-dachshund-rescue-foundation-tx686/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 54. DFW German Shepherd Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'DFW German Shepherd Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'German Shepherd Dog',
  'Yes', 'Weatherford', 'Parker', 'North Texas', 'DFW / North Texas', 'No',
  'Temporarily Closed', 'All intake is currently on hold while the rescue relocates/builds new facilities.', NULL, NULL,
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Current Petfinder profile states all intake is closed during relocation. IRS-derived filing source confirms 501(c)(3). Sources: https://www.petfinder.com/member/us/tx/weatherford/dfw-german-shepherd-rescue-tx1667/ ; https://philanthropy.org/990/report/455098493/dfw-german-shepherd-rescue'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'Yes', 'Unknown', 'Unknown', 'No', 'No', 'No' from new_org;

-- 55. DFW Lab. Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'DFW Lab. Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Labrador Retriever',
  'Yes', 'Southlake', 'Tarrant', 'Dallas-Fort Worth Metroplex', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.dfwlabrescue.org/',
  NULL, 'Incoming@dfwlabrescue.org', NULL, 'Verified',
  '2026-08-12', 'Official site active in 2026 with approximately 30 Labs typically in program; foster-based. Sources: https://www.dfwlabrescue.org/ ; https://www.dfwlabrescue.org/faqs/ ; https://www.dfwlabrescue.org/contact/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 56. DFW Pug Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'DFW Pug Rescue, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Pug',
  'Yes', 'Grapevine', 'Tarrant', 'Dallas-Fort Worth; adopts to the lower 48 states', 'DFW / North Texas', 'Yes',
  'Temporarily Closed', NULL, NULL, 'https://www.dfwpugs.com/',
  'https://www.facebook.com/DFWPugRescueCorporation/', NULL, '817-481-2004', 'Verified – Restricted Intake',
  '2026-08-12', 'Current site is active with 2026 events and available pugs. A July 13, 2026 WFAA report states intake was paused due to surging surrenders and veterinary costs. Sources: https://www.dfwpugs.com/ ; https://www.wfaa.com/article/life/pets/dfw-pug-rescue-pauses-intake-bills-double-surrenders-surge/287-881aa53e-3c41-44dd-b715-17d8a3fd967c'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 57. DFW Pup Patrol Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'DFW Pup Patrol Rescue', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  'Yes', 'Wylie', 'Collin', 'Dallas-Fort Worth area', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.dfwpuppatrol.com/',
  NULL, 'info@dfwpuppatrol.com', '214-912-8191', 'Verified',
  '2026-08-12', 'Official site is active; Petfinder lists visits by appointment and no current pets. ProPublica lists tax-exempt status since 2017. Sources: https://www.dfwpuppatrol.com/ ; https://www.petfinder.com/member/us/tx/wylie/dfw-pup-patrol-rescue-tx1407/ ; https://projects.propublica.org/nonprofits/organizations/272097184'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 58. DFW Rescue Me
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'DFW Rescue Me', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  'Yes', 'Denton', 'Denton', 'Dallas-Fort Worth / North Texas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.dfwrescueme.org/',
  'https://www.instagram.com/dfwrescueme/', NULL, NULL, 'Verified',
  '2026-08-12', 'Official site identifies DFW Rescue Me as an all-volunteer, foster-based 501(c)(3). Current 2026 fundraiser/event activity found. Sources: https://www.dfwrescueme.org/ ; https://www.dfwrescueme.org/bark-at-fair-park.html'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 59. Doberman Rescue of North Texas, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Doberman Rescue of North Texas, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Doberman Pinscher',
  'Unable to Verify', 'Grand Prairie', 'Dallas', 'Texas, Oklahoma, Arkansas and portions of Louisiana/New Mexico', 'DFW / North Texas', 'Yes',
  'Unknown', NULL, NULL, 'https://www.dobermanrescue.org/',
  'https://www.facebook.com/DobermanRescueOfNorthTexas/', 'application@dobermanrescue.org', '972-606-1510', 'Verified',
  '2026-08-12', 'Official site active with adoption/resources and current contact information. Separate IRS 501(c)(3) status was not independently confirmed in this batch. Source: https://www.dobermanrescue.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 60. Dog Ranch Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Dog Ranch Rescue, Inc.', 'Rescue', '{"Dog"}', 'All Breed; Medical', NULL,
  'Yes', 'Anna', 'Collin', 'North Texas; dogs sourced from puppy mills, shelters and strays', 'DFW / North Texas', 'Unclear',
  'Unknown', NULL, NULL, 'https://dogranchrescue.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active in 2026 and states Dog Ranch Rescue was founded as a 501(c)(3) in 2014. Sources: https://dogranchrescue.com/ ; https://dogranchrescue.com/about-us/ Phase 2 intake source: https://dogranchrescue.com/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;


commit;
