-- Batch 3 of 10 — organizations 121 to 180
-- Paste this whole file into the Neon SQL Editor and click Run.

begin;

-- 121. Ninja Paws Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Ninja Paws Rescue', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  NULL, 'Fort Worth', 'Tarrant', 'North Texas / DFW', 'DFW / North Texas', 'No',
  'By Application Only', NULL, NULL, 'https://www.ninjapawsrescue.org/',
  NULL, 'NinjaPaws@yahoo.com', NULL, 'Verified',
  '2026-08-12', 'Official site active with current adoption/foster applications and Fort Worth mailing address.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 122. No Borders Bulldog Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'No Borders Bulldog Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'English Bulldog; Olde English Bulldog; French Bulldog',
  'Yes', 'Dallas', 'Dallas', 'Dallas-Fort Worth / Texas', 'DFW / North Texas', 'Unclear',
  'By Application Only', 'Accepts Bulldogs from owner surrenders, shelters, breeder retirees, strays and neglect/abuse cases; capacity should be confirmed.', NULL, 'https://www.nobordersbulldogrescue.org/',
  NULL, 'info@nobordersbulldogrescue.org', '214-235-6494', 'Verified',
  '2026-08-12', 'Official site identifies 501(c)(3), Tax ID 81-0869820, and current adoption/volunteer activity.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 123. North American Shar-Pei Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'North American Shar-Pei Rescue, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Chinese Shar-Pei',
  'Yes', 'Richmond', 'Fort Bend', 'Texas-based; works with other states', 'Statewide', 'Yes',
  'Limited', 'Owner surrenders are evaluated individually and prioritized based on available space; rescue focuses on last-chance adoptable Shar-Pei.', NULL, 'https://sharpeirescue.com/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active, IRS ID 74-2951388. Texas placements preferred but out-of-state placements may be considered.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 124. North Texas Basset Hound Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'North Texas Basset Hound Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Basset Hound',
  NULL, 'Grapevine', 'Tarrant', 'North Texas / DFW', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.bassetrescuedfw.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Long-running North Texas Basset rescue; current 2026 recommendations and active rescue materials found.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 125. North Texas Boxer Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'North Texas Boxer Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Boxer',
  'Yes', 'Dallas', 'Dallas', 'North Texas; relationships with shelters across Texas', 'DFW / North Texas', 'Yes',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Current nonprofit sources identify NTBR as a 501(c)(3), EIN 81-3245959, founded in 2016 and prioritizing vulnerable Boxers.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 126. North Texas Chow Chow Haven
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'North Texas Chow Chow Haven', 'Rescue', '{"Dog"}', 'Breed Specific', 'Chow Chow',
  NULL, 'Mansfield', 'Tarrant', 'North Texas / DFW', 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, 'https://www.facebook.com/northtexaschowchowhaven.org',
  'https://www.facebook.com/northtexaschowchowhaven.org', NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner; current Facebook presence retained. 501(c)(3) and intake terms not independently confirmed.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 127. North Texas Scottie Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'North Texas Scottie Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Scottish Terrier',
  'Yes', 'Flower Mound', 'Denton', 'Dallas, Fort Worth, Arlington, Mansfield, Plano and surrounding areas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.northtexasscottierescue.com/',
  NULL, 'northtexasscottierescue@gmail.com', '214-534-2460', 'Verified',
  '2026-08-12', 'Official site active and identifies NTSR as a 501(c)(3) based in Flower Mound with volunteers across DFW. Phase 2 intake source: https://www.northtexasscottierescue.com/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 128. Northwest Boxer Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Northwest Boxer Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Boxer',
  NULL, 'Woodinville', NULL, NULL, NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Current City of Arlington rescue-partner listing confirms ongoing rescue relationship; Washington-based breed rescue. Detailed intake terms not independently confirmed.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 129. Papillon Rescue of the North East (PRONE)
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Papillon Rescue of the North East (PRONE)', 'Rescue', '{"Dog"}', 'Breed Specific', 'Papillon; Pomeranian',
  'Yes', 'Sandown', NULL, NULL, NULL, 'No',
  'Unknown', NULL, NULL, 'https://www.pronepups.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active and identifies PRONE as a 501(c)(3), all-volunteer Papillon/Pomeranian rescue founded in 2012.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 130. Passport for Paws
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Passport for Paws', 'Rescue', '{"Dog","Cat"}', 'Transport; Shelter Transfer', NULL,
  'Yes', 'McKinney', 'Collin', 'Texas shelters; transports animals to rescue partners throughout the United States', 'DFW / North Texas', 'Yes',
  'Unknown', NULL, NULL, 'https://www.passportforpaws.org/',
  NULL, 'passport4paws@gmail.com', '817-874-9595', 'Verified – Restricted Intake',
  '2026-08-12', '501(c)(3) volunteer rescue/transport organization focused on moving code-red Texas shelter animals to rescue partners; not primarily an owner-surrender referral. Phase 2 intake source: https://www.passportforpaws.org/rescue-partners.html'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 131. PAWS for Irving Animals
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'PAWS for Irving Animals', 'Rescue', '{"Dog"}', 'Shelter Support; Foster', NULL,
  NULL, 'Irving', 'Dallas', 'Irving / Irving Animal Care Campus', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'http://pawsforirvinganimals.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Volunteer organization supporting dogs at Irving Animal Care Campus through promotion, foster, adoption events and rescue facilitation; not a conventional open-intake rescue.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 132. Pooch Savers Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Pooch Savers Rescue', 'Rescue', '{"Dog"}', 'All Breed; Medical', NULL,
  NULL, 'Dallas', 'Dallas', 'Dallas-Fort Worth / Plano adoption events', 'DFW / North Texas', 'No',
  'Limited', NULL, NULL, 'https://www.poochsavers.com/',
  NULL, 'poochsavers@gmail.com', NULL, 'Verified',
  '2026-08-12', 'Official site active in 2026; all-volunteer nonprofit dog rescue. Current 2026 foster request confirms active intake on a case/foster-capacity basis.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 133. Pug Rescue of Austin
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Pug Rescue of Austin', 'Rescue', '{"Dog"}', 'Breed Specific', 'Pug',
  NULL, 'Austin', 'Travis', NULL, 'Central Texas', 'Unclear',
  'Unknown', NULL, NULL, 'https://austinpugrescue.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Current City of Arlington rescue-partner listing and 2025 Austin adoption coverage confirm ongoing activity. 501(c)(3) not independently confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 134. PugHearts Houston Pug Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'PugHearts Houston Pug Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Pug',
  'Yes', 'Alvin', 'Brazoria', 'Houston / Gulf Coast', 'Houston / Gulf Coast', 'Unclear',
  'Accepting', NULL, NULL, 'https://www.pughearts.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active in August 2026, identifies 501(c)(3), and lists 173 pugs available and current adoption events. Phase 2 intake source: https://www.pughearts.org/ ; https://www.pughearts.com/our_dogs'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 135. Pyrescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Pyrescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Great Pyrenees',
  NULL, 'Peyton', NULL, NULL, NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner. Colorado-based breed rescue; detailed current nonprofit/intake information not independently confirmed.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 136. Ready 2 Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Ready 2 Rescue', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  NULL, 'Mesquite', 'Dallas', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner. Detailed current official intake information not independently confirmed.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 137. Recycled Pomeranians
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Recycled Pomeranians', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Pomeranian; Schipperke; small breeds',
  'Yes', 'Garland', 'Dallas', 'Texas / DFW with statewide shelter pulls', 'DFW / North Texas', 'Yes',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'IRS-derived record shows active 501(c)(3), EIN 80-0385916, with a 2025 Form 990. Current June 2026 community reports confirm active Dallas-area rescue.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 138. Red River Old English Sheepdog Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Red River Old English Sheepdog Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Old English Sheepdog',
  'Yes', 'Yukon', 'Canadian', 'New Mexico, Oklahoma, Texas and Kansas', NULL, 'Yes',
  'Accepting', NULL, NULL, 'https://www.redriveroldenglishsheepdogrescue.org/',
  NULL, 'redriveroesrescue@gmail.com', '405-664-2778', 'Verified',
  '2026-08-12', 'Official site active, identifies 501(c)(3), explicitly includes Texas and states dogs are accepted into foster program.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 139. Rescue Row, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Rescue Row, Inc.', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  NULL, 'Lewisville', 'Denton', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner; detailed current official information not independently confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 140. Rescue without Boundaries
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Rescue without Boundaries', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  NULL, 'Arlington', 'Tarrant', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner; detailed current official information not independently confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 141. Roxy's K9 Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Roxy''s K9 Rescue', 'Rescue', '{"Dog"}', 'All Breed; Street Dogs', NULL,
  'Yes', 'San Antonio', 'Bexar', 'San Antonio', 'San Antonio / Hill Country', 'No',
  'By Application Only', NULL, NULL, 'https://www.roxysk9rescue.org/',
  NULL, 'roxysrescue@yahoo.com', '713-882-2610', 'Verified',
  '2026-08-12', 'Official site active in 2026; home-based 501(c)(3) rescue saving San Antonio street dogs since 2006 and provides an owner surrender form.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 142. Rudy's Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Rudy''s Rescue', 'Rescue', '{"Dog"}', 'All Breed', NULL,
  NULL, 'Weatherford', 'Parker', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner. Detailed current official intake information not independently confirmed.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 143. Russell Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Russell Rescue, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Jack Russell Terrier / Russell Terrier',
  NULL, 'Seguin', 'Guadalupe', NULL, 'San Antonio / Hill Country', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner. Detailed current official information not independently confirmed.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 144. RWTFBTCA
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'RWTFBTCA', 'Rescue', '{"Dog"}', 'Breed Specific', 'Bull Terrier',
  NULL, 'Glenwood', 'Pike', NULL, NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner. Appears to be Bull Terrier Club of America rescue/welfare-related; retain exact baseline name pending fuller identity verification.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 145. Salvaged Souls Pet Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Salvaged Souls Pet Rescue', 'Rescue', '{"Dog","Cat"}', 'All Breed; Medical', NULL,
  'Yes', 'Colleyville', 'Tarrant', 'Dallas-Fort Worth area', 'DFW / North Texas', 'No',
  'Limited', 'Foster-based; foster homes must be in DFW. Adoption requires application and home visit; adopters must be within reasonable driving distance of DFW, though some transport has occurred case-by-case.', NULL, 'https://salvagedsoulspetrescue.org/',
  NULL, 'info@salvagedsoulspetrescue.org', NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site and current listings show active 501(c)(3) rescue with adoptable animals.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 146. Samoyed Rescue of Texas, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Samoyed Rescue of Texas, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Samoyed and strong Samoyed mixes',
  'Yes', 'Dallas', 'Dallas', 'Texas, Louisiana, Arkansas, Oklahoma and New Mexico', 'Statewide', 'Yes',
  'Accepting', NULL, NULL, 'https://samoyedtexas.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site identifies all-volunteer 501(c)(3), accepts shelter dogs, owner surrenders and neglect/abuse cases; placements currently limited to Texas and bordering LA/AR/OK/NM.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 147. Schnauzer Ranch & Friends
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Schnauzer Ranch & Friends', 'Rescue', '{"Dog"}', 'Breed Specific; All Breed', 'Schnauzers and other dogs',
  NULL, 'Sanger', 'Denton', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, 'https://www.facebook.com/sraftxinc/',
  'https://www.facebook.com/sraftxinc/', NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner; current Facebook page retained. 501(c)(3) and intake terms not independently confirmed.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 148. Scottie Kingdon Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Scottie Kingdon Rescue, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific', 'Scottish Terrier',
  NULL, 'Dallas', 'Dallas', '48 contiguous United States', 'DFW / North Texas', 'Yes',
  'Unknown', NULL, NULL, 'http://www.scottiekingdom.com/',
  NULL, 'rescue@scottiekingdom.com', NULL, 'Verified',
  '2026-08-12', 'Baseline appears to contain typo ''Kingdon''; current Adopt-a-Pet profile is Scottie Kingdom Rescue, Inc. with two current adoptable Scotties and nationwide 48-state service.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 149. Shepherds Beyond Borders
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Shepherds Beyond Borders', 'Rescue', '{"Dog"}', 'Breed Specific', 'German Shepherd / shepherd-type dogs',
  NULL, 'West Enfield', 'Penobscot', NULL, NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner; Maine-based rescue. Detailed current official intake/nonprofit information not independently confirmed.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 150. Siberian Husky Assistance & Rescue Program of NY
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Siberian Husky Assistance & Rescue Program of NY', 'Rescue', '{"Dog"}', 'Breed Specific', 'Siberian Husky',
  NULL, 'Rocky Point', 'Suffolk', NULL, NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington rescue partner; New York-based breed rescue. Detailed current official intake/nonprofit information not independently confirmed.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 151. Small Paws Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Small Paws Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, 'Tulsa', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made. Phase 2 intake source: https://smallpawsrescue.org/ ; https://smallpawsrescue.org/site-map/ Phase 2 intake source: https://smallpawsrescue.org/surrender-form ; https://smallpawsrescue.org/what-we-do ; https://smallpawsrescue.org/site-map/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 152. Snow Capped Shepherd Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Snow Capped Shepherd Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, 'Littleton', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 153. South Central Bloodhound Club, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'South Central Bloodhound Club, Inc.', 'Rescue', '{}', NULL, NULL,
  NULL, 'Fayetteville', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 154. SPIN - Saving Pyrs in Need
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'SPIN - Saving Pyrs in Need', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, 'https://www.spinrescue.org/',
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 155. SRGDRR - Save Rocky the Great Dane Rescue & Lab, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'SRGDRR - Save Rocky the Great Dane Rescue & Lab, Inc.', 'Rescue', '{}', NULL, NULL,
  NULL, 'Bullard', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, 'https://www.facebook.com/SaveRockyTheGreatDane',
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 156. TAGG Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'TAGG Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, 'Dallas', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 157. Tend-Mend-Defend Dog Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Tend-Mend-Defend Dog Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, 'Fort Worth', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 158. Texas Cattle Dog Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Texas Cattle Dog Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, 'Northlake', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 159. Texas Collie Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Texas Collie Rescue, Inc.', 'Rescue', '{}', NULL, NULL,
  NULL, 'Magnolia', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 160. Texas Great Pyrenees Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Texas Great Pyrenees Rescue, Inc.', 'Rescue', '{}', NULL, NULL,
  NULL, 'Bastrop', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made. Phase 2 intake source: Current 2026 rescue-case evidence; exact intake remains foster/case dependent.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Yes', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 161. Texas Hearing Service Dogs, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Texas Hearing Service Dogs, Inc.', 'Rescue', '{}', NULL, NULL,
  NULL, 'Dripping Springs', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 162. Texas Husky Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Texas Husky Rescue, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Siberian Husky',
  'Yes', NULL, NULL, 'Texas and beyond', 'Statewide', 'Yes',
  'Limited', 'Foster-based; official site reports 30–35 intake requests per week and cannot meet all requests.', NULL, 'https://texashuskyrescue.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active; founded in 2009 as a volunteer 501(c)(3), with more than 2,600 Huskies rescued. Intake capacity depends heavily on foster availability. Phase 2 intake source: https://texashuskyrescue.org/contact-us/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 163. Texas Italian Greyhound Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Texas Italian Greyhound Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, 'Richardson', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 164. Texas Pawprints
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Texas Pawprints', 'Rescue', '{"Cat"}', 'All Breed; Medical', 'Cats and kittens',
  'Yes', 'Dallas', 'Dallas', 'Dallas / North Texas; cats placed with adopters throughout Texas', 'DFW / North Texas', 'Yes',
  'Unknown', NULL, NULL, 'https://txpaws.wixsite.com/txpp',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site identifies Texas Pawprints as a Dallas 501(c)(3), EIN 20-1146965, providing foster/adoption and spay-neuter services since 2001.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 165. Texas Sporting Breed Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Texas Sporting Breed Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Sporting breeds / retrievers, pointers, setters and related breeds',
  'Yes', 'Denton', 'Denton', 'Texas / North Texas', 'DFW / North Texas', 'Yes',
  'Unknown', NULL, NULL, 'https://www.retrieveafriend.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active in 2026 with current dogs in program; IRS-derived record confirms 501(c)(3), EIN 45-2865649. Phase 2 intake source: https://www.retrieveafriend.org/donate'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 166. The Love Pit Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'The Love Pit Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Medical; Behavioral', 'Bully breeds',
  NULL, 'Dallas', 'Dallas', 'Dallas-Fort Worth / North Texas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.thelovepitrescue.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active with current available dogs and reports more than 1,600 dogs rescued/rehabilitated; bully-breed focused. Phase 2 intake source: https://www.thelovepitrescue.org/ ; https://www.thelovepitrescue.org/contact'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Case-by-case', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 167. The Promised Land Dachshund Sanctuary
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'The Promised Land Dachshund Sanctuary', 'Rescue', '{}', NULL, NULL,
  NULL, 'Gardendale', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 168. The Street Dog Project
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'The Street Dog Project', 'Rescue', '{"Dog"}', 'All Breed; Street Dogs; Medical', NULL,
  'Yes', 'Dallas', 'Dallas', 'Dallas / DFW', 'DFW / North Texas', 'No',
  'Limited', 'Primary focus is dogs rescued directly from Dallas-area streets; small volunteer group, so capacity is limited.', NULL, 'https://www.thestreetdogproject.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Dauntless Rescue Inc., DBA The Street Dog Project, is a 501(c)(3) focused primarily on rescuing dogs directly from Dallas streets.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 169. Tzu Zoo Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Tzu Zoo Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Shih Tzu; Lhasa Apso; small companion breeds',
  'Yes', 'Plano', 'Collin', 'DFW metroplex and surrounding areas', 'DFW / North Texas', 'No',
  'Unknown', NULL, 'https://tzuzoorescue.com/adoption-application/', 'https://tzuzoorescue.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site identifies volunteer 501(c)(3) foster rescue in DFW. Current adoption listings show multiple dogs available. Phase 2 intake source: https://tzuzoorescue.com/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Case-by-case', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 170. Unchained Love, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Unchained Love, Inc.', 'Rescue', '{}', NULL, NULL,
  NULL, 'Kuttawa', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 171. United Yorkie Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'United Yorkie Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made. Phase 2 intake source: https://www.uyr.us/ ; https://uyr.us/?page_id=25 ; https://www.uyr.us/?page_id=29'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Yes', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 172. Urgent Animals of Fort Worth, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Urgent Animals of Fort Worth, Inc.', 'Rescue', '{}', NULL, NULL,
  NULL, 'Haslet', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, 'https://urgentanimalsfw.org/',
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made. Phase 2 intake source: https://www.chewy.com/g/urgent-animals-of-fort-worth-inc_b75366885'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 173. Weimaraner Rescue of North Texas, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Weimaraner Rescue of North Texas, Inc.', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Weimaraner',
  'Yes', 'Dallas', 'Dallas', 'North Texas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.weimrescuetexas.org',
  NULL, NULL, '972-994-3572', 'Verified',
  '2026-08-12', 'IRS-derived record shows active 501(c)(3), EIN 75-2739729, with a 2025 Form 990; mission includes shelter, stray, abandoned, neglected and abused Weimaraners.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Yes', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 174. Western Australian Shepherd Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Western Australian Shepherd Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 07 review: current official operating/intake details require additional source verification; no assumptions made.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 175. Westie Rescue of North Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Westie Rescue of North Texas', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'West Highland White Terrier',
  'Yes', 'Frisco', 'Collin', 'North Texas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://wrnt.org/',
  NULL, 'info@wrnt.org', '877-568-2580', 'Verified',
  '2026-08-12', 'Official site identifies WRNT as a Texas nonprofit and federal 501(c)(3), rescuing abused, abandoned, neglected, homeless and surrendered Westies. Phase 2 intake source: https://www.wrnt.org/ ; https://www.wrnt.org/surrender'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Unknown', 'Unknown', 'Yes', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 176. White Bridle Humane Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'White Bridle Humane Society', 'Rescue', '{}', NULL, NULL,
  NULL, 'Keller', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Exact current operating source not confidently resolved in this batch; retained for follow-up rather than matched to a similarly named organization.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 177. Averting CAT-astrophe
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Averting CAT-astrophe', 'Rescue', '{"Cat"}', 'All Breed', NULL,
  'Yes', 'Mansfield', 'Tarrant', 'DFW area', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://avertingcatastrophe.com/',
  NULL, 'avertingcatastrophe@gmail.com', NULL, 'Verified',
  '2026-08-12', 'Current City of Arlington rescue-partner directory lists the organization in Mansfield. Supporting rescue profile identifies volunteer 501(c)(3) focused primarily on DFW shelter cats.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 178. Buddies Place Cat Rescue of Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Buddies Place Cat Rescue of Texas', 'Rescue', '{"Cat"}', 'All Breed; Community Cats; Medical', NULL,
  'Yes', 'Weatherford', 'Parker', 'Dallas-Fort Worth Metroplex; TNR work in Parker and Tarrant counties', 'DFW / North Texas', 'No',
  'Temporarily Closed', 'Official contact page states the rescue is very full and not accepting new cats or kittens; sanctuary is also full. Previously adopted cats may be returned with notice/space.', NULL, 'https://www.buddiesplacecatrescue.org/',
  NULL, NULL, '682-268-0314', 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active in 2026; founded in 2009 and identifies BPCR as a small 501(c)(3). Phase 2 intake source: https://www.buddiesplacecatrescue.org/contact/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'Unknown', 'No', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 179. Cattailz
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Cattailz', 'Rescue', '{"Cat"}', 'All Breed', NULL,
  NULL, 'Weatherford', 'Parker', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington cat rescue partner. Detailed independent intake/nonprofit information not resolved in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 180. DFW Purebred & Domestic Cat Rescue, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'DFW Purebred & Domestic Cat Rescue, Inc.', 'Rescue', '{"Cat"}', 'All Breed; Breed Specific', 'Purebred and domestic cats',
  NULL, 'Plano', 'Collin', 'Dallas-Fort Worth region', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.dfwpurebredrescue.org/',
  NULL, 'rescue@dfwpurebredrescue.org', NULL, 'Verified',
  '2026-08-12', 'Official site active with foster program and adoption locations in Plano, Arlington/Grand Prairie, Watauga and McKinney. Site describes donations as tax-deductible. Phase 2 intake source: https://www.dfwpurebredrescue.org/ ; https://www.northtexasgivingday.org/organization/Dfw-Purebred-And-Domestic-Cat-Rescue'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;


commit;
