-- Batch 5 of 10 — organizations 241 to 300
-- Paste this whole file into the Neon SQL Editor and click Run.

begin;

-- 241. Texas Rustlers Guinea Pig Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Texas Rustlers Guinea Pig Rescue', 'Small Animal Rescue', '{"Other"}', 'Small Animal Rescue', 'Guinea pigs and other small animals',
  'Yes', 'Lewisville', 'Denton', 'Greater DFW Metroplex', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://texasrustlers.com/',
  NULL, 'theguineapigrescue@yahoo.com', '972-219-1963', 'Verified',
  '2026-08-12', 'Official site identifies Texas Rustlers Small Animal Rescue as registered 501(c)(3), EIN 14-1865740. IRS-derived record includes 2024 filing.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 242. The Bunny Burrow Rabbit Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'The Bunny Burrow Rabbit Rescue', 'Small Animal Rescue', '{"Other"}', 'Small Animal Rescue', 'Domestic rabbits',
  'Yes', 'Haltom City', 'Tarrant', 'DFW / North Texas', 'DFW / North Texas', 'No',
  'Temporarily Closed', 'Official site explicitly states it is NOT a surrender facility; directs surrender needs to municipal animal shelters. Adoptions are appointment/application only.', NULL, 'https://www.thebunnyburrow.org/',
  NULL, 'thebunnyburrowrr@gmail.com', NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active; all-volunteer nonprofit rabbit rescue. Store/facility address listed as 2513 Weaver St Suite A, Haltom City.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 243. Peace Ridge Sanctuary
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Peace Ridge Sanctuary', 'Sanctuary', '{"Dog","Cat","Other"}', 'Sanctuary; Farm Animals; Equine', NULL,
  NULL, NULL, NULL, NULL, NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Maine-based animal sanctuary; not a Texas-local intake resource.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 244. Second Chance Farm
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Second Chance Farm', 'Rescue', '{"Dog","Other"}', 'Sanctuary; Special Needs; Senior; Medical', NULL,
  NULL, 'Granbury', 'Hood', 'Texas and Oklahoma shelter/rescue network', 'DFW / North Texas', 'Yes',
  'Limited', 'Primarily assists special-needs and senior animals at risk of euthanasia from shelters, plus some owner surrenders.', NULL, 'https://www.secondchancefarmgranbury.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active with current adoptable animals; provides placement and lifetime care for animals with significant needs. Phase 2 intake source: https://www.secondchancefarmgranbury.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 245. Spay Neuter Network
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Spay Neuter Network', 'Local Support Partner', '{"Dog","Cat"}', 'Spay/Neuter; Veterinary Support', NULL,
  'Yes', NULL, NULL, 'North Texas', 'DFW / North Texas', 'No',
  'By Application Only', 'Not a conventional rescue intake organization; provides affordable spay/neuter, vaccination and wellness services with eligibility/appointment restrictions.', NULL, 'https://spayneuternet.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Keep categorized as Local Support Partner rather than rescue. Phase 2 intake source: https://spayneuternet.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 246. Dallas Pets Alive
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Dallas Pets Alive', 'Local Support Partner', '{"Dog","Cat"}', 'Foster Rescue; Pet Support; Rehoming', NULL,
  'Yes', 'Dallas', 'Dallas', 'Dallas / DFW', 'DFW / North Texas', 'No',
  'Limited', 'Foster-based rescue and community-support organization; capacity and program eligibility vary. PASS provides pet-support resources intended to help keep pets with families.', NULL, 'https://dallaspetsalive.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Current 2026 community reports confirm active PASS assistance. Retain as Local Support Partner as well as foster rescue resource. Phase 2 intake source: https://dallaspetsalive.org/pass-program/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Case-by-case', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 247. Texas Coalition for Animal Protection
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Texas Coalition for Animal Protection', 'Local Support Partner', '{"Dog","Cat"}', 'Spay/Neuter; Veterinary Support', NULL,
  'Yes', NULL, NULL, 'North Texas', 'DFW / North Texas', 'No',
  'By Application Only', 'Not a conventional rescue intake organization; low-cost spay/neuter and preventive veterinary services have age, breed, weight and scheduling requirements.', NULL, 'https://texasforthem.org/',
  NULL, NULL, '877-FIX SPOT', 'Verified – Restricted Intake',
  '2026-08-12', 'Retain as Local Support Partner; useful prevention/resource referral rather than animal-placement intake. Phase 2 intake source: https://texasforthem.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 248. Human Animal Support Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Human Animal Support Services', 'National Support Partner', '{"Dog","Cat","Other"}', 'National Support / Animal Services Systems', NULL,
  NULL, NULL, NULL, 'United States / animal welfare organizations', NULL, 'Yes',
  'Unknown', NULL, NULL, 'https://www.humananimalsupportservices.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'National support initiative rather than an animal intake rescue. Provides free/low-cost resources and implementation tools for community-centered animal services, including pet support, reunification, self-rehoming and intake-to-placement. Phase 2 intake source: https://www.humananimalsupportservices.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 249. Maddie’s Fund
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Maddie’s Fund', 'National Support Partner', '{"Dog","Cat"}', 'National Support / Grants / Animal Welfare', NULL,
  'Yes', NULL, NULL, 'United States', NULL, 'Yes',
  'Unknown', NULL, NULL, 'https://www.maddiesfund.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'National animal-welfare foundation/support resource, not a conventional animal intake organization. Retain as National Support Partner. Phase 2 intake source: https://www.maddiesfund.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 250. American Pets Alive
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'American Pets Alive', 'National Support Partner', '{"Dog","Cat"}', 'National Support; Training; Shelter/Rescue Support', NULL,
  NULL, NULL, NULL, 'United States', NULL, 'Yes',
  'Unknown', NULL, NULL, 'https://americanpetsalive.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'National animal-welfare education/support organization rather than a conventional intake rescue. Retain as National Support Partner. Phase 2 intake source: https://americanpetsalive.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 251. Best Friends Animal Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Best Friends Animal Society', 'National Support Partner', '{"Dog","Cat","Other"}', 'National Support; Sanctuary; Shelter/Rescue Support', NULL,
  'Yes', NULL, NULL, 'United States', NULL, 'Yes',
  'Limited', NULL, NULL, 'https://bestfriends.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'National animal-welfare organization and sanctuary/network partner rather than a general Texas intake rescue. Retained as National Support Partner. Current 2026 Texas disaster transport activity confirmed.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Yes' from new_org;

-- 252. Petco Love Foundation
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Petco Love Foundation', 'National Support Partner', '{"Dog","Cat"}', 'National Support; Grants; Veterinary Access; Lost Pet Support', NULL,
  'Yes', NULL, NULL, 'United States', NULL, 'Yes',
  'Unknown', NULL, NULL, 'https://petcolove.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'National animal-welfare funder/support organization, not a conventional animal intake rescue. Official site has 2026 animal-welfare grant cycles.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 253. Bissell Pet Foundation
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Bissell Pet Foundation', 'National Support Partner', '{"Dog","Cat"}', 'National Support; Grants; Adoption Support; Disaster Response', NULL,
  'Yes', NULL, NULL, 'United States', NULL, 'Yes',
  'Unknown', NULL, NULL, 'https://www.bissellpetfoundation.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'National animal-welfare foundation/support resource rather than conventional intake rescue.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 254. PetSmart Charities
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'PetSmart Charities', 'National Support Partner', '{"Dog","Cat"}', 'National Support; Grants; Adoption; Veterinary Access', NULL,
  'Yes', NULL, NULL, 'United States and Puerto Rico', NULL, 'Yes',
  'Unknown', NULL, NULL, 'https://petsmartcharities.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site identifies PetSmart Charities as a separate 501(c)(3) supporting approximately 2,500 animal-welfare partners, veterinary access and crisis support. Not a direct general-intake rescue.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 255. CUDDLY
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'CUDDLY', 'National Support Partner', '{"Dog","Cat","Other"}', 'National Support; Fundraising Platform', NULL,
  NULL, NULL, NULL, 'United States / verified rescue and shelter partners', NULL, 'Yes',
  'Unknown', NULL, NULL, 'https://cuddly.com/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Fundraising/wish-list platform for verified 501(c)(3) rescues and shelters, not an animal intake organization. Official site reports 4,000 verified shelter/rescue partners.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'No', 'No', 'No', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 256. Amy’s Hospice Kitties
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Amy’s Hospice Kitties', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 11 review: exact current-source verification still needed; record retained without inference.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 257. Animal Advocates of North Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Animal Advocates of North Texas', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 11 review: exact current-source verification still needed; record retained without inference.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 258. Dallas Cat Lady
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Dallas Cat Lady', 'Rescue', '{"Cat"}', 'All Breed; Community Cats', NULL,
  NULL, 'Dallas', 'Dallas', 'Dallas-Fort Worth area', 'DFW / North Texas', 'No',
  'Limited', 'Foster capacity appears constrained during kitten season; confirm space directly before referral.', NULL, NULL,
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Current July 2026 DFW community reports continue to refer people to Dallas Cat Lady; one report indicates limited responsiveness/space during kitten season.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 259. Dallas DogRRR
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Dallas DogRRR', 'Rescue', '{"Dog","Cat"}', 'All Breed; Medical; Behavioral', NULL,
  'Yes', 'Allen', 'Collin', 'Dallas-Fort Worth / North Texas', 'DFW / North Texas', 'No',
  'Limited', NULL, NULL, 'https://www.dallasdog.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active in 2026; foster-based rescue with medical and behavioral rehabilitation. EIN 47-4386830. Intake depends on foster/boarding capacity.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 260. Dalmatian Rescue of North Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Dalmatian Rescue of North Texas', 'Rescue', '{"Dog"}', 'Breed Specific; Medical', 'Dalmatian',
  'Yes', 'Plano', 'Collin', 'North Texas', 'DFW / North Texas', 'No',
  'Limited', 'Foster capacity is small; shelter dogs are prioritized. Privately owned dogs are accepted only when room exists and no shelter dogs need assistance; aggressive or deaf dogs are not accepted.', NULL, 'https://dalpal.com/',
  NULL, 'adoptme@dalpal.com', '972-250-DALS', 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active with multiple available Dalmatians and explicit intake restrictions.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 261. DFW Furgotten Friends
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'DFW Furgotten Friends', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 11 review: exact current-source verification still needed; record retained without inference.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 262. DFW Rat Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'DFW Rat Rescue', 'Rescue', '{"Other"}', 'Small Animal Rescue; Pet Retention Support', 'Domestic rats',
  'Yes', 'Rhome', 'Wise', 'Dallas-Fort Worth; also assists cases from across the country', 'DFW / North Texas', 'Unclear',
  'Waitlist', 'Domestic rats only; surrender waitlist is ongoing. Not licensed/equipped for wild rats. PASS program may help owners retain rats through food, housing, transport, behavior or medical assistance.', 'https://www.dfwratrescue.org/surrender', 'https://www.dfwratrescue.org/',
  NULL, 'DFWRatRescue@gmail.com', NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site identifies 501(c)(3), EIN 82-4791575, based in Rhome with area fosters; site states there is always a surrender waitlist. Phase 2 intake source: https://www.dfwratrescue.org/surrender'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Yes' from new_org;

-- 263. DFW Wildlife Coalition
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'DFW Wildlife Coalition', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 11 review: exact current-source verification still needed; record retained without inference. Phase 2 intake source: https://www.dfwwildlife.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 264. Duck Team 6
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Duck Team 6', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 11 review: exact current-source verification still needed; record retained without inference. Phase 2 intake source: https://duckteam6.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Yes', 'Case-by-case', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 265. EARS
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'EARS', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 11 review: exact current-source verification still needed; record retained without inference.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 266. East Dallas Pet Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'East Dallas Pet Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 11 review: exact current-source verification still needed; record retained without inference.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 267. Friends United in Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Friends United in Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 11 review: exact current-source verification still needed; record retained without inference.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 268. Hearts and Bones Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Hearts and Bones Rescue', 'Rescue', '{"Dog"}', 'All Breed; Shelter Transfer', NULL,
  NULL, NULL, NULL, 'Texas and northeastern U.S. placement network', 'Statewide', 'Yes',
  'Limited', NULL, NULL, 'https://heartsandbonesrescue.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site updated July 2, 2026. Texas-to-New York animal imports are temporarily paused due to New York''s New World Screwworm restriction; Texas imports to non-restricted states continue.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Limited', 'Unknown', 'Unknown' from new_org;

-- 269. Highway Hounds Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Highway Hounds Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 11 review: exact current-source verification still needed; record retained without inference.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 270. Home Rescue DFW
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Home Rescue DFW', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 11 review: exact current-source verification still needed; record retained without inference.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 271. Humane Society of Dallas County
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Humane Society of Dallas County', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  NULL, 'Dallas', 'Dallas', 'Dallas County / DFW', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://dognkittycity.org/',
  NULL, 'info@hsdallascounty.org', '214-350-7387', 'Verified',
  '2026-08-12', 'Dog & Kitty City shelter is currently open daily noon–5 PM at 2719 Manor Way, Dallas. Phase 2 intake source: https://dognkittycity.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Limited', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 272. IF Dogs
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'IF Dogs', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 11 review: exact current-source verification still needed; record retained without inference.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 273. Izzy Wildlife Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Izzy Wildlife Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 11 review: exact current-source verification still needed; record retained without inference.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 274. JB’s Pet Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'JB’s Pet Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 11 review: exact current-source verification still needed; record retained without inference.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 275. Kitty Kradle
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Kitty Kradle', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 11 review: exact current-source verification still needed; record retained without inference.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 276. Kitty Save
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Kitty Save', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 12 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 277. League of Animal Protectors
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'League of Animal Protectors', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  NULL, 'Dallas', 'Dallas', 'Dallas-Fort Worth / North Texas', 'DFW / North Texas', 'No',
  'Limited', 'Foster-based; official site states foster homes are the most pressing need and there are not enough fosters for all animals the group wants to help.', NULL, 'https://www.laprescue.org/',
  NULL, 'laprescue@gmail.com', NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active and recruiting fosters/volunteers. Dallas mailing address: PO Box 823293, Dallas, TX 75382.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 278. Leo’s Friends Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Leo’s Friends Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 12 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 279. Lone Star Akita Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lone Star Akita Rescue', 'Rescue', '{"Dog"}', 'Breed Specific', 'Akita',
  NULL, 'Greenville', 'Hunt', 'Texas / North Texas', 'DFW / North Texas', 'Yes',
  'Limited', 'Current 2026 rescue activity indicates pulls may depend on an experienced foster being available.', NULL, NULL,
  'https://www.facebook.com/LoneStarAkitaRescue/', NULL, '903-450-7707', 'Verified – Restricted Intake',
  '2026-08-12', 'Current January 2026 breed-community rescue activity confirms LSAR remains active. Rescue directory lists Greenville, TX and contact Valerie Fox.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 280. Lost Paws of Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lost Paws of Texas', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 12 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 281. Marleigh’s Friends
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Marleigh’s Friends', 'Rescue', '{"Dog","Cat"}', 'All Breed; Medical', NULL,
  'Yes', 'Carrollton', 'Dallas', 'Dallas-Fort Worth / North Texas', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.marleighsfriends.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official 2026 site identifies Marleigh''s Friends as a 501(c)(3), EIN 83-2827538, formed in 2018/2019 to rescue unwanted dogs and cats.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 282. Mutts and Mayhem
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Mutts and Mayhem', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 12 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 283. Myranda’s Mended Souls
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Myranda’s Mended Souls', 'Rescue', '{"Dog"}', 'All Breed; Medical', NULL,
  NULL, NULL, NULL, 'Texas shelter/rescue network', 'Statewide', 'Yes',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current City of San Antonio ACS rescue partner. Exact official intake/contact details require follow-up.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 284. Nava Dog Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Nava Dog Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 12 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 285. New Life Cat Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'New Life Cat Rescue', 'Rescue', '{"Cat"}', 'All Breed', NULL,
  NULL, NULL, 'Ellis', 'Ellis County / DFW', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, 'Help@newlifecatrescue.org', NULL, 'Verified',
  '2026-08-12', 'Current North Texas community referral evidence identifies New Life Cat Rescue in Ellis County and its help email. Additional official-source verification is still desirable.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 286. North Texas Wildlife Center
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'North Texas Wildlife Center', 'Rescue', '{"Wildlife"}', 'Wildlife Rehabilitation', 'Native Texas wildlife',
  'Yes', 'Richardson', 'Dallas', 'North Texas / DFW', 'DFW / North Texas', 'No',
  'Accepting', 'For wildlife emergencies call/text; email inbox is not monitored for emergencies. Handles native wildlife including bats, mammals, raptors, songbirds, reptiles and waterfowl.', NULL, 'https://www.ntxwildlife.org/',
  NULL, 'info@ntxwildlife.org', '469-901-9453', 'Verified',
  '2026-08-12', 'Official site active in 2026; 501(c)(3), EIN 61-1725985. Provides rescue, rehabilitation and release of injured/orphaned native Texas wildlife. Phase 2 intake source: https://www.ntxwildlife.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 287. North Texas Aussie Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'North Texas Aussie Rescue', 'Rescue', '{"Dog"}', 'Breed Specific; All Breed; Medical; Behavioral', 'Australian Shepherd and mixes; also assists other dogs',
  'Yes', NULL, NULL, 'DFW and surrounding areas', 'DFW / North Texas', 'No',
  'Limited', 'Foster-based. Official site reports an average of about 33 dogs per month entering rescue during 2024–2026, so capacity depends on foster availability.', NULL, 'https://www.ntxaussierescue.org/',
  NULL, 'ntxaussierescue@gmail.com', '945-259-6482', 'Verified – Restricted Intake',
  '2026-08-12', 'Official 2026 site identifies NTASR as independent 501(c)(3), EIN 85-4230034, established in 2020. Phase 2 intake source: https://www.ntxaussierescue.org/surrenderform'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 288. Oak Hill Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Oak Hill Animal Rescue', 'Rescue', '{"Dog","Cat"}', 'All Breed; Shelter Transfer', NULL,
  NULL, 'Dallas', 'Dallas', 'Dallas-Fort Worth / North Texas', 'DFW / North Texas', 'No',
  'Limited', 'Works closely with Metroplex animal shelters and focuses on rescuing adoptable dogs and cats at risk when shelters run out of room; capacity should be confirmed.', NULL, 'https://www.ohar.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active; nonprofit animal welfare organization founded in 2006 near Dallas.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 289. One by One Pet Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'One by One Pet Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 12 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 290. Paws in the City
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Paws in the City', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 12 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 291. Paws of Love Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Paws of Love Animal Rescue', 'Rescue', '{"Dog","Cat"}', 'All Breed; Medical; Shelter Transfer', NULL,
  'Yes', 'Dallas', 'Dallas', 'Dallas-Fort Worth / North Texas', 'DFW / North Texas', 'No',
  'Limited', 'Foster-based; primarily pulls from DFW shelters and also facilitates transport to rescue partners outside Texas. Capacity depends on foster availability.', NULL, 'https://www.pawsofloverescue.com/',
  NULL, 'pawsofloveanimalrescue@yahoo.com', NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Current Petfinder profile lists adoptable pets. North Texas Giving Day identifies POLAR as a 501(c)(3) since 2015 and reports 500+ animals rescued/rehomed in 2023.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 292. Pottsboro Animal Welfare Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Pottsboro Animal Welfare Society', 'Rescue', '{"Dog","Cat"}', 'All Breed; Medical; Shelter Transfer', NULL,
  'Yes', 'Pottsboro', 'Grayson', 'DFW / North Texas with local and transport adoption programs', 'DFW / North Texas', 'No',
  'Limited', 'Focuses on urgent medical cases, orphaned animals and animals facing euthanasia; foster and rescue capacity applies.', NULL, 'https://www.pathwayanimalwelfare.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Now operates publicly as Pathway Animal Welfare Society (PAWS), a DBA of Pottsboro Animal Welfare Society. 501(c)(3), EIN 99-2613494; tax-exempt since May 2024.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 293. Rahr to the Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Rahr to the Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 12 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 294. Richardson Humane Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Richardson Humane Society', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  'Yes', 'Richardson', 'Dallas', 'Richardson / North Texas', 'DFW / North Texas', 'No',
  'Limited', 'All-volunteer foster network; approximately 120 animals are placed per year, so intake depends on foster capacity.', NULL, 'https://www.richardsonhumanesociety.org/',
  NULL, NULL, '972-234-5117', 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active in 2026; chartered as a Texas 501(c)(3) in 2000 with more than 100 volunteers and 3,000+ pets rescued/re-homed through 2024.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 295. Rockwall Pets
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Rockwall Pets', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 12 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 296. Ruff Road Revival
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Ruff Road Revival', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 12 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 297. Sandy Paws Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Sandy Paws Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 12 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 298. Saving Hope
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Saving Hope', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 12 review: exact current-source verification remains needed; no facts inferred from similarly named organizations. Phase 2 intake source: https://www.savinghoperescue.org/owner-surrender-form ; https://www.savinghoperescue.org/contact-us ; https://www.savinghoperescue.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Case-by-case', 'Unknown', 'Yes', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 299. Special Treasures Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Special Treasures Animal Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 12 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 300. Saint Clouds Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Saint Clouds Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 12 review: exact current-source verification remains needed; no facts inferred from similarly named organizations.'
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
