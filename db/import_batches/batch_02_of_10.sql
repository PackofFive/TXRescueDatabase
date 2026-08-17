-- Batch 2 of 10 — organizations 61 to 120
-- Paste this whole file into the Neon SQL Editor and click Run.

begin;

-- 61. Doodle Dandy Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Doodle Dandy Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Doodle dogs',
  'Unable to Verify', 'Garland', NULL, 'Texas', 'Statewide', 'Yes',
  'Unknown', NULL, NULL, 'https://www.doodledandyrescue.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active in 2026 with dogs in foster and adoption activity; mission is to rescue, rehabilitate and rehome Doodles in Texas. 501(c)(3) status not independently verified in this batch. Source: https://www.doodledandyrescue.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 62. Doodle Rock Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Doodle Rock Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Doodle and Poodle mixes',
  'Yes', 'Dallas', 'Dallas', 'Dallas-Fort Worth / Texas', 'DFW / North Texas', 'Unclear',
  'Unknown', NULL, NULL, 'https://doodlerockrescue.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active in 2026 and identifies Doodle Rock Rescue as a Dallas 501(c)(3), EIN 81-5169762. Sources: https://doodlerockrescue.org/ ; https://doodlerockrescue.org/adopt/available-dogs/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 63. Easy Street Animal Shelter
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Easy Street Animal Shelter', 'Rescue/Shelter', '{"Dog"}', 'All Breed', NULL,
  'Unable to Verify', 'Saint Jo', 'Montague', 'North Texas / Texoma', 'DFW / North Texas', 'No',
  'Limited', 'Owner surrenders are based on space availability; $30 drop-off fee.', NULL, 'https://esashelter.org/',
  NULL, NULL, '940-613-6865', 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active in 2026; July 2026 local news confirms current operations. Sources: https://esashelter.org/ ; https://www.newschannel6now.com/2026/07/23/paws-around-texoma-easy-street-animal-shelter/ Phase 2 intake source: https://esashelter.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 64. Emma's Wish Senior Dog Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Emma''s Wish Senior Dog Rescue', 'Rescue', '{"Dog"}', 'Senior; Medical', 'Senior dogs',
  'Unable to Verify', 'Plano', 'Collin', 'North Texas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.EmmasWishSDR.org',
  NULL, 'emmaswishsdr@gmail.com', '972-948-4054', 'Verified',
  '2026-08-12', 'Current Petfinder listing shows adoptable dogs and active contact information; City of Arlington lists the organization as a 2026 rescue partner. Sources: https://www.petfinder.com/member/us/tx/plano/emmas-wish-senior-dog-rescue-tx2349/ ; https://www.arlingtontx.gov/City-Services/Animals-Pets/Pet-Information/Rescue-Partners'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 65. Epic Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Epic Animal Rescue', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  'Yes', 'Southlake', 'Tarrant', NULL, 'DFW / North Texas', NULL,
  'Temporarily Closed', NULL, NULL, 'https://epicanimalrescue.org/',
  'https://www.instagram.com/epicanimalrescue/', NULL, NULL, 'Inactive / Closed',
  '2026-08-12', 'The rescue''s Instagram states it officially closed its doors after eight years and 706 dogs saved. IRS filing data confirms prior 501(c)(3) status. Some third-party directory pages remain online and appear stale. Sources: https://www.instagram.com/epicanimalrescue/ ; https://philanthropy.org/990/report/814220151/epic-animal-rescue'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'No', 'No', 'No' from new_org;

-- 66. Forgotten To Spoiled Rotten
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Forgotten To Spoiled Rotten', 'Rescue', '{"Dog"}', 'Senior; Hospice; Medical', 'Senior and hospice dogs',
  'Yes', 'Burleson', 'Johnson', 'North Texas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  'https://www.facebook.com/forgotten2spoiledrotten/', NULL, NULL, 'Verified',
  '2026-08-12', 'Current nonprofit filings through 2025 and social activity describe a 501(c)(3) sanctuary for senior and hospice dogs. Sources: https://www.facebook.com/forgotten2spoiledrotten/ ; https://www.causeiq.com/organizations/forgotten-to-spoiled-rotten%2C830765075/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 67. Freedom Collie Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Freedom Collie Rescue, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Collie',
  'Yes', 'Sugar Land', 'Fort Bend', 'Texas, Oklahoma, Louisiana and Mississippi; adoptions limited to Texas, Oklahoma and Louisiana', 'Statewide', 'Yes',
  'Unknown', NULL, NULL, 'https://www.freedomcollierescue.org/',
  NULL, 'freedomcollierescue@yahoo.com', NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site has 2026 activity and identifies FCR as an approved 501(c)(3). Source: https://www.freedomcollierescue.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 68. FW Abandoned Animal Alliance
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'FW Abandoned Animal Alliance', 'Rescue', '{"Dog"}', 'All Breed; Bully breeds', NULL,
  'Unable to Verify', 'Fort Worth', 'Tarrant', 'Fort Worth / North Texas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  'https://www.instagram.com/fw_abandoned_animal_alliance/', NULL, NULL, 'Verified',
  '2026-08-12', 'Current 2026 social activity and active volunteer application confirm ongoing rescue operations. 501(c)(3) status not independently verified in this batch. Sources: https://www.instagram.com/fw_abandoned_animal_alliance/ ; https://form.jotform.com/81397989339177'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 69. German Shepherd Rescue of Central Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'German Shepherd Rescue of Central Texas', 'Rescue', '{"Dog"}', 'Breed Specific', 'German Shepherd Dog and mixes',
  'Yes', 'Round Rock', 'Williamson', 'Austin, San Antonio, Houston and Waco areas', 'Central Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  'https://www.facebook.com/gsdrescuectx/', NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Current social activity and Petfinder listing confirm foster-based operations. Petfinder states adoptions are limited to Austin, San Antonio, Houston and Waco service areas. Sources: https://www.facebook.com/gsdrescuectx/ ; https://www.petfinder.com/member/us/tx/round-rock/german-shepherd-rescue-central-texas-tx280/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 70. German Shepherd Rescue of Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'German Shepherd Rescue of Texas', 'Rescue', '{"Dog"}', 'Breed Specific', 'German Shepherd Dog',
  'Unable to Verify', 'Waxahachie', 'Ellis', 'Texas', 'DFW / North Texas', 'Yes',
  'Unknown', NULL, NULL, 'http://www.GSRTX.org',
  NULL, 'info@gsrtx.org', NULL, 'Verified',
  '2026-08-12', 'Current Petfinder listing shows adoptable dogs and active contact information; City of Arlington lists GSRTX as a 2026 rescue partner. Separate IRS status was not independently verified in this batch. Sources: https://www.petfinder.com/member/us/tx/waxahachie/german-shepherd-rescue-of-texas-tx2451/ ; https://www.arlingtontx.gov/City-Services/Animals-Pets/Pet-Information/Rescue-Partners'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 71. GetALong Dachshund Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'GetALong Dachshund Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Senior; Medical', 'Dachshund',
  'Yes', 'Fort Walton Beach', 'Okaloosa', 'Multi-state foster network headquartered in Florida', NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  'https://www.facebook.com/GetalongDachshundRescue/', NULL, NULL, 'Verified',
  '2026-08-12', 'Current listings identify an all-volunteer 501(c)(3) focused especially on senior and medical-needs Dachshunds. Sources: https://www.petfinder.com/member/us/fl/green-cove-springs/getalong-dachshund-rescue-fl1362/ ; https://www.facebook.com/GetalongDachshundRescue/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 72. Girty's Place Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Girty''s Place Animal Rescue', 'Rescue', '{"Other"}', 'Sanctuary', 'Farm animals',
  'Unable to Verify', 'Farmersville', 'Collin', 'North Texas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Girty''s Place is described as the animal-rescue component of Shutt''er Down Ranch, a 30-acre North Texas sanctuary providing permanent refuge to rescued farm animals. It is not a conventional dog/cat intake rescue. Source: https://www.northtexasgivingday.org/organization/Girtys-Place-Animal-Rescue-And-Sanctuary'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 73. Give A Dog A Home German Shepherd Dog Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Give A Dog A Home German Shepherd Dog Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; All Breed', 'German Shepherd Dogs and other breeds',
  'Yes', 'Sebec', 'Piscataquis', 'Maine / multi-state placements', NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, 'GaDaH@giveadogahome-rescue.org', NULL, 'Verified',
  '2026-08-12', 'Current rescue directory and 2026 activity confirm ongoing operations; organization identifies itself as a 501(c)(3). Sources: https://www.werescue.pet/shelter/24056/give-a-dog-a-home-german-shepherd-dog-rescue/ ; https://www.facebook.com/Shepherdhelp/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 74. Golden Retriever Rescue of North Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Golden Retriever Rescue of North Texas', 'Rescue', '{"Dog"}', 'Breed Specific', 'Golden Retriever',
  'Yes', 'Dallas', 'Dallas', 'North Texas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.goldenretrievers.org/',
  'https://www.facebook.com/grrnt/', NULL, NULL, 'Verified',
  '2026-08-12', 'Official site has 2026 leadership and current activity; nonprofit records show 501(c)(3) and a 2024 filing. Sources: https://www.goldenretrievers.org/ ; https://www.causeiq.com/organizations/golden-retriever-rescue-of-north-texas%2C752721349/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 75. Good Shepherd Rescue of Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Good Shepherd Rescue of Texas', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'German Shepherd Dog',
  'Yes', 'Dallas', 'Dallas', 'Dallas-Fort Worth area', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.goodshepherdrescuetexas.com/',
  'https://www.facebook.com/GoodShepherdRescue/', 'gsdresq@gmail.com', '972-656-9021', 'Verified',
  '2026-08-12', 'Official site states continuous operation since 1999 as a 501(c)(3), foster-based German Shepherd rescue providing extensive medical care. Current 2026 Facebook activity found. Sources: https://www.goodshepherdrescuetexas.com/ ; https://www.petfinder.com/member/us/tx/dallas/good-shepherd-rescue-of-texas-tx274/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 76. Great Dane Rescue of North Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Great Dane Rescue of North Texas', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Great Dane',
  'Yes', 'Carrollton', 'Dallas', 'Dallas-Fort Worth Metroplex', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.danerescue.net/',
  NULL, NULL, '214-888-6590', 'Verified – Restricted Intake',
  '2026-08-12', 'Official site confirms active all-volunteer 501(c)(3), foster-based Great Dane rescue. Adoptions are limited to the DFW area. Sources: https://www.danerescue.net/ ; https://www.danerescue.net/adopt/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 77. Great Dane Rescue of South Florida
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Great Dane Rescue of South Florida', 'Rescue', '{"Dog"}', 'Breed Specific', 'Great Dane',
  NULL, 'Jupiter', NULL, NULL, NULL, 'No',
  'Unknown', NULL, NULL, 'https://www.facebook.com/GreatDaneRescueSouthFlorida/',
  'https://www.facebook.com/GreatDaneRescueSouthFlorida/', NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Florida-based Great Dane rescue with current social presence located; nonprofit status and current intake terms were not independently verified in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 78. Great Plains Mastiff Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Great Plains Mastiff Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'English Mastiff',
  'Yes', 'Edmond', 'Oklahoma', 'Oklahoma, Texas, Arkansas, Missouri and Kansas', NULL, 'Yes',
  'Limited', 'Surrender requests are reviewed for fit and available foster space.', NULL, 'https://www.greatplainsmastiffrescue.org/',
  NULL, 'GPMastiffRescue@gmail.com', NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active in 2026, identifies 501(c)(3), and explicitly covers Texas. Source: https://www.greatplainsmastiffrescue.org/ Phase 2 intake source: https://www.greatplainsmastiffrescue.org/surrender-your-pet/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 79. Greyhound Adoption League of Texas, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Greyhound Adoption League of Texas, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Greyhounds and other sighthounds',
  'Yes', 'Dallas', 'Dallas', 'DFW, Texas and United States; foster presence also in New Mexico', 'DFW / North Texas', 'Yes',
  'Unknown', NULL, NULL, 'https://galtx.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site identifies GALT as an all-volunteer 501(c)(3) operating since 2001; current 2026 events and adoptable dogs listed. Sources: https://greyhoundtexas.org/help/aboutus.shtml ; https://www.greyhoundadoptiontx.org/upcoming-events/ Phase 2 intake source: https://www.galtx.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 80. Greyhound Rescue Society of Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Greyhound Rescue Society of Texas', 'Rescue', '{"Dog"}', 'Breed Specific', 'Greyhound',
  NULL, NULL, NULL, NULL, NULL, 'Unclear',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'A distinct current official operating source was not confirmed in this batch. Keep separate from Greyhound Adoption League of Texas until identity/status is resolved.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 81. Gulf Coast Cocker Spaniel Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Gulf Coast Cocker Spaniel Rescue, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Cocker Spaniel',
  NULL, 'Houston', 'Harris', 'Houston / Gulf Coast', 'Houston / Gulf Coast', 'No',
  'Unknown', NULL, NULL, 'https://www.gulfcoastcockerspanielrescue.com/',
  NULL, 'gulfcoastcsr@hotmail.com', NULL, 'Verified',
  '2026-08-12', 'Official site has an active adoption application and Houston mailing address. 501(c)(3) status was not independently confirmed in this batch. Source: https://www.gulfcoastcockerspanielrescue.com/adoption-application-captcha.php'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 82. Hickory Level Hound Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Hickory Level Hound Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Hounds',
  NULL, 'Carrollton', NULL, NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Current official operating source not confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 83. Homeless Hounds Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Homeless Hounds Animal Rescue', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  NULL, 'Colleyville', 'Tarrant', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Current official operating source not confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 84. Homeward Bound Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Homeward Bound Animal Rescue', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  NULL, 'Burleson', 'Johnson', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '817-792-5122 (voicemail)', 'Verification Needed',
  '2026-08-12', 'Baseline phone retained. A current official source matching the Burleson organization was not confidently resolved in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 85. Hound Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Hound Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Beagles and Beagle mixes',
  'Yes', 'Austin', 'Travis', 'Central Texas; rescues and rehomes across Texas and sometimes beyond', 'Central Texas', 'Yes',
  'Unknown', NULL, NULL, 'https://www.houndrescue.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site identifies Hound Rescue as a Texas 501(c)(3) based in Central Texas and focused on beagles/beagle mixes. Source: https://www.houndrescue.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 86. Houston Area Doberman Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Houston Area Doberman Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Doberman Pinscher',
  NULL, 'Cypress', 'Harris', 'Houston / Gulf Coast', 'Houston / Gulf Coast', NULL,
  'By Application Only', 'Surrender/turn-in requests require the organization''s surrender form.', NULL, 'https://www.hadr.org/',
  NULL, NULL, '832-598-4237', 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active with surrender process and current Cypress mailing address. Source: https://www.hadr.org/contact-us/ Phase 2 intake source: https://www.hadr.org/21-surrender ; https://www.hadr.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Unknown', 'Limited', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 87. Houston Chow Chow Connection
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Houston Chow Chow Connection', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Chow Chow and Chow mixes',
  NULL, 'Houston', 'Harris', 'Houston / Gulf Coast', 'Houston / Gulf Coast', NULL,
  'Limited', NULL, NULL, 'https://hccchou.org/',
  'https://www.instagram.com/hcccrescue/', 'chowmail.hccc@gmail.com', NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Current 2026 rescue/foster activity located, including urgent Houston foster requests. Foster availability affects ability to pull dogs. Sources: official site plus current 2026 rescue activity.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 88. Houston Cocker Spaniel Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Houston Cocker Spaniel Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Cocker Spaniel',
  NULL, 'The Woodlands', 'Montgomery', NULL, 'Houston / Gulf Coast', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Current official source for this exact organization was not confidently resolved; may overlap with another Houston-area Cocker Spaniel rescue. Retain pending identity review.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 89. Houston Collie Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Houston Collie Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Collie',
  NULL, 'Stafford', 'Fort Bend', 'Houston / Gulf Coast', 'Houston / Gulf Coast', NULL,
  'Unknown', NULL, NULL, 'https://houstoncollierescue.org/',
  NULL, 'houcollierescue@yahoo.com', '281-564-6852', 'Verified',
  '2026-08-12', 'Official site provides current rescue contact and volunteer program; 2026 community reports also confirm recent adoptions. Source: https://houstoncollierescue.org/contact-hcr/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 90. I Am Dog Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'I Am Dog Rescue, Inc.', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  NULL, 'Aubrey', 'Denton', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Current official operating source not confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 91. IDOG International Doodle Owners Group, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'IDOG International Doodle Owners Group, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Doodles and Poodle mixes',
  'Yes', 'Bellaire', 'Harris', 'United States / foster network', 'Houston / Gulf Coast', 'Yes',
  'Unknown', NULL, NULL, 'https://www.facebook.com/IDOGRescue/',
  'https://www.facebook.com/IDOGRescue/', NULL, NULL, 'Verified',
  '2026-08-12', 'Long-running national Doodle rescue with current official social presence; baseline organization name retained.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 92. Internet Miniature Pinscher Service (IMPS)
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Internet Miniature Pinscher Service (IMPS)', 'Rescue', '{"Dog"}', 'Breed Specific', 'Miniature Pinscher',
  NULL, 'Pinellas Park', NULL, 'United States foster network', NULL, 'Yes',
  'By Application Only', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Current 2026 adopter discussion confirms IMPS remains active with online application/vet-check process. Official nonprofit status was not independently verified in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 93. iRescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'iRescue', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  NULL, 'Weatherford', 'Parker', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Current official operating source matching the Weatherford rescue was not confidently resolved in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 94. Irish Setter Rescue of North Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Irish Setter Rescue of North Texas', 'Rescue', '{"Dog"}', 'Breed Specific', 'Irish Setter',
  NULL, NULL, NULL, NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Current official operating source not confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 95. Jades Mission, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Jades Mission, Inc.', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Current official operating source and Texas service details were not confidently resolved in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 96. Lacy's Legacy Scottie & Westie Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lacy''s Legacy Scottie & Westie Rescue, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Scottish Terrier; West Highland White Terrier',
  NULL, 'Buffalo', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Current official operating source not confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 97. Legacy Humane Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Legacy Humane Society', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  'Yes', 'McKinney', 'Collin', 'North Texas / DFW', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://legacyhumanesociety.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active; established North Texas foster-based humane society/rescue. Source: https://legacyhumanesociety.org/ Phase 2 intake source: https://legacyhumanesociety.org/owner-surrender-form/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Limited', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 98. Little Wolf Small Dog Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Little Wolf Small Dog Rescue, Inc.', 'Rescue', '{"Dog"}', 'Small Breed', 'Small dogs',
  NULL, 'Essex Junction', 'Chittenden', NULL, NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Vermont-based organization. Current official operating status was not confidently verified in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 99. Lone Star Aussie Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lone Star Aussie Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Australian Shepherd',
  NULL, 'Red Oak', 'Ellis', 'Texas', 'DFW / North Texas', 'Yes',
  'Unknown', NULL, NULL, 'https://www.lonestaraussierescue.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active and dedicated to Australian Shepherd rescue in Texas. 501(c)(3) status was not independently verified in this batch. Source: https://www.lonestaraussierescue.org/ Phase 2 intake source: https://www.lonestaraussierescue.org/contact'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Case-by-case', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 100. Lone Star Bulldog Club, Inc., Bulldog Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lone Star Bulldog Club, Inc., Bulldog Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'English Bulldog',
  NULL, 'Duncanville', 'Dallas', 'Dallas-Fort Worth / Texas', 'DFW / North Texas', 'Yes',
  'Unknown', NULL, NULL, 'https://dfwbulldogrescue.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official DFW Bulldog Rescue site active; baseline name retained for the Lone Star Bulldog Club rescue program. Source: https://dfwbulldogrescue.org/ Phase 2 intake source: https://dfwbulldogrescue.org/bulldogs/successfully-adopted/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Yes', 'Yes', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown' from new_org;

-- 101. Lone Star Doberman Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lone Star Doberman Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Doberman Pinscher',
  NULL, 'Fort Worth', 'Tarrant', 'Statewide Texas foster-home network', 'Statewide', 'Yes',
  'Unknown', NULL, NULL, 'https://www.lonestardobermans.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active in 2026 and explicitly describes LSDR as a statewide Texas foster-home-based Doberman rescue. 501(c)(3) not independently confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 102. Lone Star Westie Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lone Star Westie Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'West Highland White Terrier',
  'Yes', 'Carrollton', NULL, 'Texas', 'Statewide', 'Yes',
  'Unknown', NULL, NULL, 'https://lswr.us/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active with 2026 adoptions; identifies LSWR as an all-volunteer 501(c)(3) serving Westies throughout Texas.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 103. Love & Paws Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Love & Paws Rescue, Inc.', 'Rescue', '{"Dog"}', 'All Breed; Medical', NULL,
  'Yes', 'Fort Worth', 'Tarrant', 'Fort Worth / North Texas', 'DFW / North Texas', 'No',
  'Temporarily Closed', 'Official site states intake was closed in January 2024 to focus on animals already in care; current roster remains very small.', NULL, 'https://www.loveandpawsrescue.com/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site identifies a Fort Worth 501(c)(3). Intake closure is explicitly documented; verify before referral.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'No', 'No', 'No' from new_org;

-- 104. Lucy's Lost Love Ones
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lucy''s Lost Love Ones', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  NULL, 'Fort Worth', 'Tarrant', 'North Texas', 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, 'https://www.lucyslostlovedones.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current City of Arlington rescue partner in 2026. Detailed official intake information not located in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 105. Malinois and Dutch Shepherd Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Malinois and Dutch Shepherd Rescue, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Belgian Malinois; Dutch Shepherd',
  'Yes', 'Imlay City', 'Lapeer', 'National foster-based network, including Texas', NULL, 'Yes',
  'By Application Only', NULL, NULL, 'https://www.madrescueinc.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active in 2026; identifies MAD as a 501(c)(3), foster-based rescue and includes dedicated Texas medical/fundraising activity.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 106. Mastino Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Mastino Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Neapolitan Mastiff',
  NULL, 'Ballwin', 'St. Louis', 'Multi-state / national breed rescue', NULL, 'Unclear',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner. Current nonprofit/intake details not independently confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 107. Millie's Mutts
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Millie''s Mutts', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  'Yes', 'Dallas', 'Dallas', 'North Texas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.milliesmutts.com/',
  NULL, 'mmuttsrescue@gmail.com', NULL, 'Verified',
  '2026-08-12', 'Official site identifies Millie''s Mutts as a North Texas 501(c)(3) foster-based rescue pulling animals from North Texas shelters.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 108. Mini Mutts Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Mini Mutts Animal Rescue', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  'Yes', 'Grand Prairie', 'Dallas', 'Dallas-Fort Worth area', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'http://mini-mutts.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Current 2024 IRS filing confirms active 501(c)(3), EIN 81-3489364. Current rescue profiles describe dog and cat rescue/foster/adoption work.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 109. Miniature Schnauzer Rescue of Houston
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Miniature Schnauzer Rescue of Houston', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Miniature Schnauzer',
  'Yes', 'Houston', 'Harris', 'Houston / Gulf Coast', 'Houston / Gulf Coast', 'No',
  'Accepting', 'Foster-based; intake includes owner surrenders, strays and shelter dogs. Capacity depends on foster/boarding availability.', NULL, 'https://www.msrh.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official 2026 site identifies MSRH as a tax-exempt 501(c)(3) and says it takes approximately 10–15 dogs per month.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 110. Miniature Schnauzer Rescue of N. TX
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Miniature Schnauzer Rescue of N. TX', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Miniature Schnauzer',
  'Yes', 'Carrollton', 'Dallas', 'Dallas-Fort Worth metroplex and surrounding areas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://msrnt.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active in 2026; nonprofit established in 2006 and has rescued more than 2,040 dogs.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 111. MO Min Pin Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'MO Min Pin Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Miniature Pinscher',
  NULL, 'Hazelwood', 'St. Louis', NULL, NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner. Detailed current official information not independently resolved in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 112. Montana Pittie Project, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Montana Pittie Project, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Bully breeds',
  'Yes', 'Saint Ignatius', 'Lake', 'Montana; pulls dogs from out-of-state shelters including Texas', NULL, 'No',
  'Limited', 'Foster-based; official site states adoptions are currently limited to Montana.', NULL, 'https://www.montanapittieproject.com/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site identifies registered 501(c)(3), foster-based bully-breed rescue and Montana-only adoptions at verification.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 113. Muttley Farms
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Muttley Farms', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  NULL, 'Valley View', 'Cooke', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner; detailed current official intake information not independently confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 114. Nanook & Nakados Big Paws Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Nanook & Nakados Big Paws Rescue', 'Rescue', '{"Dog"}', 'Large Breed', 'Large / giant breed dogs',
  NULL, 'Brownwood', 'Brown', NULL, 'Central Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner. Detailed current nonprofit/intake information not independently confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 115. National Anatolian Shepherd Rescue Network
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'National Anatolian Shepherd Rescue Network', 'Rescue', '{"Dog"}', 'Breed Specific', 'Anatolian Shepherd',
  NULL, 'Gilbert', 'Maricopa', 'National', NULL, 'Unclear',
  'Unknown', NULL, NULL, 'https://www.instagram.com/anatolianshepherdrescue',
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Still appears in rescue directories/Arlington partner list, but 2026 breed-community information reports the longtime director retired and the organization may have transitioned/rebranded. Verify before referral.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 116. National Brittany Rescue & Adoption Network "NBRAN"
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'National Brittany Rescue & Adoption Network "NBRAN"', 'Rescue', '{"Dog"}', 'Breed Specific', 'Brittany',
  'Yes', 'Carrollton', 'Dallas', 'United States and Canada volunteer network', 'DFW / North Texas', 'Yes',
  'Unknown', NULL, NULL, 'https://www.nbran.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site identifies NBRAN as a 501(c)(3) national volunteer rescue with current available dogs.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 117. National Brussels Griffon Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'National Brussels Griffon Rescue, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Brussels Griffon',
  'Yes', 'Dallas', 'Dallas', 'National; dedicated regional coordinator for TX/OK/LA/NM/CO', 'Statewide', 'Yes',
  'By Application Only', NULL, NULL, 'https://nationalbrusselsgriffonrescue.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official breed-rescue guide lists a Texas-area coordinator; IRS data shows a 2025 filing and active 501(c)(3), EIN 04-3724309.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 118. Nemo Paws
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Nemo Paws', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  NULL, 'Grand Rapids', 'Itasca', NULL, NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner. Current official details were not independently confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 119. New Life Boxer Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'New Life Boxer Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Boxer',
  NULL, 'Westfield', 'Union', NULL, NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner; current official nonprofit/intake details were not independently confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 120. Nicholas Pet Haven
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Nicholas Pet Haven', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  NULL, 'Tyler', 'Smith', 'East Texas', 'East Texas', 'No',
  'By Application Only', 'Adoption House is closed to walk-in public and operates by appointment; adoption application required.', NULL, 'https://www.nicholaspethaven.org/',
  NULL, 'nicholaspethaven@yahoo.com', NULL, 'Verified',
  '2026-08-12', 'Official site active in 2026 with current adoptable dogs/cats and Tyler adoption facility.'
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
