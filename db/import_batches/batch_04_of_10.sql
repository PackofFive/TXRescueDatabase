-- Batch 4 of 10 — organizations 181 to 240
-- Paste this whole file into the Neon SQL Editor and click Run.

begin;

-- 181. Diamonds in the Ruff Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Diamonds in the Ruff Animal Rescue', 'Rescue', '{"Cat"}', 'All Breed', NULL,
  NULL, 'Lockport', NULL, NULL, NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington cat rescue partner; New York-based. Detailed current intake terms not independently resolved.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 182. East Dallas Kitty Club
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'East Dallas Kitty Club', 'Rescue', '{"Cat"}', 'All Breed', NULL,
  NULL, 'Dallas', 'Dallas', NULL, 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington cat rescue partner. Exact official intake details remain to be verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 183. Feral Cat Barn
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Feral Cat Barn', 'Rescue', '{"Cat"}', 'Community Cats', 'Feral/community cats',
  NULL, 'Arlington', 'Tarrant', NULL, 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Listed as a current 2026 City of Arlington cat rescue partner. Name/category indicates community/feral-cat focus; confirm case-specific intake before referral.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 184. Kaley's Place
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Kaley''s Place', 'Rescue', '{"Cat"}', 'All Breed', NULL,
  NULL, 'North Richland Hills', 'Tarrant', NULL, 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.facebook.com/kaleysplace/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington cat rescue partner.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 185. Kool Kats Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Kool Kats Rescue', 'Rescue', '{"Cat"}', 'All Breed', NULL,
  NULL, 'Bedford', 'Tarrant', NULL, 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington cat rescue partner.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 186. Mollie's Cat Place
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Mollie''s Cat Place', 'Rescue', '{"Cat"}', 'All Breed', NULL,
  NULL, 'Weatherford', 'Parker', NULL, 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington cat rescue partner.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 187. New Hope Cat Rescue & Sanctuary
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'New Hope Cat Rescue & Sanctuary', 'Rescue', '{"Cat"}', 'All Breed; Community Cats; Sanctuary', NULL,
  'Yes', 'Arlington', 'Tarrant', 'DFW communities', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://newhopecrs.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active and identifies New Hope Cat Rescue and Sanctuary as a 501(c)(3), providing shelter/care for stray, abused and abandoned cats plus adoption and TNR/community education.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 188. Omalley Alley Cat
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Omalley Alley Cat', 'Rescue', '{"Cat"}', 'All Breed; Community Cats', NULL,
  NULL, 'Nacogdoches', 'Nacogdoches', NULL, 'East Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington cat rescue partner; East Texas based.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 189. Panther City Feral Cat Coalition
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Panther City Feral Cat Coalition', 'Rescue', '{"Cat"}', 'Community Cats; TNR', 'Feral/community cats',
  NULL, 'Fort Worth', 'Tarrant', 'Fort Worth and Tarrant County', 'DFW / North Texas', 'No',
  'Limited', 'Primary mission is TNVR/community-cat assistance rather than conventional shelter intake; some foster/adoption work occurs case-by-case.', NULL, 'https://fortworthferals.org/',
  NULL, 'panthercityferal@gmail.com', NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active in 2026; coalition works with citizens, rescues and government to improve lives of Fort Worth feral/community cats through TNVR. Phase 2 intake source: https://fortworthferals.org/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Limited', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 190. Shadow Cats Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Shadow Cats Rescue', 'Rescue', '{"Cat"}', 'Community Cats; Medical; Sanctuary', NULL,
  NULL, 'Round Rock', 'Williamson', NULL, 'Central Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington cat rescue partner. Central Texas organization; detailed current intake restrictions not resolved in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 191. Smitten Kittens Adoption & Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Smitten Kittens Adoption & Rescue', 'Rescue', '{"Cat"}', 'All Breed', NULL,
  NULL, 'Weatherford', 'Parker', NULL, 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://smittenkittens.mystrikingly.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington cat rescue partner.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 192. Texas CARES - Texas Companion Animal Resource
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Texas CARES - Texas Companion Animal Resource', 'Rescue', '{"Cat"}', 'All Breed', NULL,
  NULL, 'Dallas', 'Dallas', NULL, 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Listed as a current 2026 City of Arlington cat rescue partner. Exact current official intake terms remain to be verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 193. The Feral Foundation
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'The Feral Foundation', 'Rescue', '{"Cat"}', 'Community Cats; TNR', 'Feral/community cats',
  NULL, 'Ballston Spa', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Exact current Texas organization/operating source not confidently resolved in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 194. Animal Allies of Texas, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Animal Allies of Texas, Inc.', 'Rescue', '{"Dog","Cat"}', 'All Breed; Community Services', NULL,
  'Yes', 'Garland', 'Dallas', 'North Texas / underserved communities', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.animalalliesoftexas.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active and identifies Animal Allies of Texas as a 501(c)(3), Tax ID 75-2946355, providing rescue plus low-cost vaccination and spay/neuter services. Phase 2 intake source: https://www.animalalliesoftexas.org/about'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Yes', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Yes' from new_org;

-- 195. Animal Hope
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Animal Hope', 'Rescue', '{"Dog","Cat"}', 'All Breed; Medical; Behavioral', NULL,
  'Yes', 'Fort Worth', 'Tarrant', 'North Texas', 'DFW / North Texas', 'No',
  'Limited', 'Specializes in at-risk animals needing medical rehabilitation or behavioral work; capacity should be confirmed before referral.', NULL, 'https://animalhope.org/',
  NULL, NULL, '817-984-1129', 'Verified – Restricted Intake',
  '2026-08-12', 'Official site identifies Animal Hope as a Fort Worth 501(c)(3), EIN 47-2878808, focused on rescue, rehabilitation and rehoming of at-risk animals. Phase 2 intake source: https://animalhope.org/surrender/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Limited', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 196. Bay Area Humane Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Bay Area Humane Society', 'Rescue', '{}', NULL, NULL,
  NULL, 'Green Bay', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Exact baseline organization/location could not be confidently matched to a current source in this batch; do not assume it is the similarly named organizations in other states.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 197. Coppell Humane Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Coppell Humane Society', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  'Yes', 'Coppell', 'Dallas', 'Dallas-Fort Worth metroplex and surrounding communities', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.coppellhumanesociety.org/',
  NULL, 'moreinfo@coppellhumanesociety.org', '972-462-1121', 'Verified',
  '2026-08-12', 'Official site active; CHS is a foster-home 501(c)(3) rescuing dogs and cats primarily in DFW. No dedicated facility. Phase 2 intake source: https://www.coppellhumanesociety.org/faqs'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'No', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 198. Cowtown Loves Animal Shelter Pets
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Cowtown Loves Animal Shelter Pets', 'Rescue', '{"Dog","Cat"}', 'Shelter Support / Rescue', NULL,
  NULL, 'Fort Worth', 'Tarrant', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, 'https://cowtownpets.org/',
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Current official operating source not confidently resolved in this batch; retain for follow-up.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 199. DFW Humane Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'DFW Humane Society', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  'Yes', 'Irving', 'Dallas', 'Dallas-Fort Worth', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, 'https://www.dfwhumane.com/',
  NULL, 'adopt@dfwhumane.com', '972-721-7788', 'Verified',
  '2026-08-12', 'Official site active in 2026 with 243 adoptions reported year-to-date at verification; registered 501(c)(3), Tax ID 75-1433154. Phase 2 intake source: https://www.dfwhumane.com/resources'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 200. Ellis County SPCA
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Ellis County SPCA', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  NULL, 'Waxahachie', 'Ellis', NULL, 'DFW / North Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '972-935-0756', 'Verification Needed',
  '2026-08-12', 'Exact current operating source/status was not confidently resolved in this batch; retain for targeted follow-up.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 201. Elmbrook Humane Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Elmbrook Humane Society', 'Rescue', '{}', NULL, NULL,
  NULL, 'Brookfield', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 202. Four Paws One Heart, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Four Paws One Heart, Inc.', 'Rescue', '{}', NULL, NULL,
  NULL, 'Roanoke', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 203. Friends of Arlington Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Friends of Arlington Animal Services', 'Support Partner', '{}', NULL, NULL,
  NULL, 'Arlington', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 204. Friends of Homeless Animals
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Friends of Homeless Animals', 'Rescue', '{}', NULL, NULL,
  NULL, 'Hanson', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 205. Friends of Rowlett Animal Services
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Friends of Rowlett Animal Services', 'Support Partner', '{}', NULL, NULL,
  NULL, 'Rowlett', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 206. Frisco Humane Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Frisco Humane Society', 'Rescue', '{}', NULL, NULL,
  NULL, 'Frisco', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, 'https://friscohumanesociety.com/',
  NULL, NULL, '972-498-8980', 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 207. Gracie Lou Rescue & Rehab, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Gracie Lou Rescue & Rehab, Inc.', 'Rescue', '{}', NULL, NULL,
  NULL, 'Arlington', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, 'https://www.facebook.com/GracieLouRR',
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 208. Hearts and Tails of Hope Pet Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Hearts and Tails of Hope Pet Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, 'Midlothian', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, 'https://www.heartsandtailsofhope.org/',
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified. Phase 2 intake source: https://heartsandtailsofhope.org/about/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Yes', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 209. Humane Society of Bradley County
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Humane Society of Bradley County', 'Rescue', '{}', NULL, NULL,
  NULL, 'Warren', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 210. Humane Society of Lewisville
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Humane Society of Lewisville', 'Rescue', '{}', NULL, NULL,
  NULL, 'Lewisville', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, '972-353-4840', 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 211. Humane Society of North Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Humane Society of North Texas', 'Rescue', '{}', NULL, NULL,
  NULL, 'Fort Worth', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified. Phase 2 intake source: https://www.hsnt.org/surrender'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 212. Humane Tomorrow
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Humane Tomorrow', 'Rescue', '{}', NULL, NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 213. Little Orphan Angels Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Little Orphan Angels Animal Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, 'Keller', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 214. Lone Star Kitties and Kanines
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Lone Star Kitties and Kanines', 'Rescue', '{}', NULL, NULL,
  NULL, 'Hurst', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 215. Long Way Home Adoptables
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Long Way Home Adoptables', 'Rescue', '{}', NULL, NULL,
  NULL, 'Bryan', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 216. Mazie's Mission
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Mazie''s Mission', 'Rescue', '{}', NULL, NULL,
  NULL, 'Frisco', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 217. Mountain Pet Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Mountain Pet Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, 'Winter Park', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 218. Olive Branch Humane Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Olive Branch Humane Society', 'Rescue', '{}', NULL, NULL,
  NULL, 'Olive Branch', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 219. Operation Kindness
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Operation Kindness', 'Rescue', '{}', NULL, NULL,
  NULL, 'Carrollton', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, 'https://www.operationkindness.org/',
  NULL, NULL, '972-418-PAWS', 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified. Phase 2 intake source: https://www.operationkindness.org/frequently-asked-questions/ ; https://www.operationkindness.org/dog-surrender/ ; https://www.operationkindness.org/pet-food-pantry/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'No', 'Yes', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'No', 'Yes' from new_org;

-- 220. Parker Paws
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Parker Paws', 'Rescue', '{}', NULL, NULL,
  NULL, 'Weatherford', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 221. Paws to Love Me
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Paws to Love Me', 'Rescue', '{}', NULL, NULL,
  NULL, 'Bella Vista', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, 'http://www.pawstoloveme.org/',
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 222. Pawsitive Karma Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Pawsitive Karma Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, 'Round Rock', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 223. Pawsome Village for Animal Friends in Need
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Pawsome Village for Animal Friends in Need', 'Rescue', '{}', NULL, NULL,
  NULL, 'Hillsboro', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 224. Posh Pets Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Posh Pets Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, 'Long Beach', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 225. Recycled Love Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Recycled Love Animal Rescue', 'Rescue', '{}', NULL, NULL,
  NULL, 'Fort Worth', NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Batch 09 review: record retained; unresolved fields require an exact current-source match before being treated as verified.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 226. Second Chance Animal Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Second Chance Animal Rescue', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  NULL, 'Oak Bluffs', NULL, 'Martha''s Vineyard / Massachusetts', NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Massachusetts-based organization; current identity retained. Not a Texas-local intake resource.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 227. Second Chance SPCA
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Second Chance SPCA', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  NULL, 'Plano', 'Collin', 'North Texas / DFW', 'DFW / North Texas', 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Current community references continue to identify Second Chance SPCA as a small Plano rescue/shelter. Verify intake capacity directly before referral.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 228. Shelter 2 Rescue Coalition
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Shelter 2 Rescue Coalition', 'Rescue', '{"Dog","Cat"}', 'All Breed; Shelter Transfer', NULL,
  NULL, 'Arlington', 'Tarrant', 'North Texas / DFW', 'DFW / North Texas', 'No',
  'Limited', 'All-volunteer rescue focused on shelter/rescue partnerships; intake capacity depends on fosters and partner pulls.', NULL, 'https://www.shelter2rescue.org/',
  NULL, 'info@shelter2rescue.org', NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Official site active in 2026; Arlington mailing address and current adoption process confirmed.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 229. SPCA of Texas
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'SPCA of Texas', 'Rescue', '{"Dog","Cat","Other"}', 'All Breed; Cruelty; Medical; Community Services', NULL,
  'Yes', 'Dallas', 'Dallas', 'North Texas / statewide cruelty and animal-welfare services', 'DFW / North Texas', 'Yes',
  'Limited', NULL, NULL, 'https://spca.org/',
  NULL, NULL, NULL, 'Verified – Restricted Intake',
  '2026-08-12', 'Major Texas nonprofit animal-welfare organization with adoption, cruelty investigation, rescue and community services. Intake varies by program and capacity. Phase 2 intake source: https://spca.org/resources/pet-help/ ; https://spca.org/resources/animal-cruelty/'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Limited', 'Yes', 'Limited', 'Yes', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes' from new_org;

-- 230. The Animal Defense League
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'The Animal Defense League', 'Rescue', '{"Dog","Cat"}', 'All Breed; Medical', NULL,
  'Yes', 'San Antonio', 'Bexar', 'San Antonio / South Central Texas', 'South Texas', 'No',
  'Unknown', NULL, NULL, 'https://adltexas.org/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Official site active with 2026 events and adoptable animals; 501(c)(3), EIN 74-6002033.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 231. Wadena County Humane Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Wadena County Humane Society', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  NULL, NULL, NULL, NULL, NULL, NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Minnesota organization; exact current operating/intake details require follow-up. Not a Texas-local resource.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 232. Wayside Waifs Humane Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Wayside Waifs Humane Society', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  NULL, 'Kansas City', NULL, NULL, NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Established Kansas City-area humane organization; not a Texas-local intake resource.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 233. Where the Love Is, Inc.
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Where the Love Is, Inc.', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  NULL, 'Hamden', NULL, NULL, NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Connecticut-based rescue retained in baseline; not a Texas-local resource.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 234. Hooves and Hounds Rescue and Rehab Sanctuary
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Hooves and Hounds Rescue and Rehab Sanctuary', 'Rescue', '{"Dog","Other"}', 'Sanctuary; Medical; Rehabilitation', NULL,
  NULL, 'Sheridan', NULL, 'Texas', 'Central Texas', 'Unclear',
  'Unknown', NULL, NULL, 'https://www.hoovesandhoundsrescue.com/',
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Texas rescue/sanctuary retained; exact current intake limits should be confirmed before referral.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 235. Wisconsin Human Society
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Wisconsin Human Society', 'Rescue', '{"Dog","Cat","Other"}', 'All Breed', NULL,
  NULL, 'Milwaukee', NULL, NULL, NULL, 'No',
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verified',
  '2026-08-12', 'Baseline name appears to refer to Wisconsin Humane Society. Wisconsin-based and not a Texas-local resource; name should be reviewed for normalization.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 236. Haley's Haven
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Haley''s Haven', 'Rescue', '{"Dog","Cat"}', 'All Breed', NULL,
  NULL, 'Odessa', 'Ector', NULL, 'West Texas', NULL,
  'Unknown', NULL, NULL, NULL,
  NULL, NULL, NULL, 'Verification Needed',
  '2026-08-12', 'Odessa-area rescue identity retained; sufficiently specific current official operating/intake source not confirmed in this batch.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 237. Natures Edge Wildlife & Reptile
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Natures Edge Wildlife & Reptile', 'Wildlife Rescue', '{"Wildlife","Reptile","Amphibian"}', 'Wildlife Rehabilitation; Exotic Reptile Rescue', NULL,
  'Yes', 'Fort Worth', 'Tarrant', 'DFW', 'DFW / North Texas', 'No',
  'Accepting', 'Rehabilitates native reptiles, bats, birds of prey and mammals on a limited basis; accepts unwanted pet reptiles/amphibians; can assist with transport to permitted rehabilitators.', NULL, 'https://www.newrr.org/',
  NULL, NULL, '682-463-9453', 'Verified',
  '2026-08-12', 'Official site confirms 501(c)(3), state/federal wildlife rehabilitation permits, DFW education work and current intake instructions.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Yes', 'Unknown', 'Unknown' from new_org;

-- 238. Rogers Wildlife
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Rogers Wildlife', 'Wildlife Rescue', '{"Wildlife"}', 'Wildlife Rehabilitation; Sanctuary', 'Federally protected migratory birds',
  'Yes', 'Hutchins', 'Dallas', 'Dallas-Fort Worth Metroplex', 'DFW / North Texas', 'No',
  'Accepting', 'Specializes in injured, sick and orphaned federally protected migratory bird species.', NULL, 'https://www.rogerswildlife.org/',
  NULL, NULL, '972-225-4000', 'Verified',
  '2026-08-12', 'Official site confirms 501(c)(3) wildlife rescue/rehabilitation center and sanctuary; address 1430 E Cleveland Rd, Hutchins.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 239. Texas Ferret Lovers Rescue
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Texas Ferret Lovers Rescue', 'Small Animal Rescue', '{"Other"}', 'Small Animal Rescue', 'Ferrets',
  'Yes', 'Fate', 'Rockwall', 'Texas', 'DFW / North Texas', 'Yes',
  'By Application Only', 'Visits/adoptions require application approval and appointment; confirm surrender capacity directly.', NULL, 'https://txferretrescue.org/',
  NULL, NULL, '972-286-5778', 'Verified – Restricted Intake',
  '2026-08-12', 'Current ferret-community sources identify TFLR as an active legitimate Texas 501(c)(3) and major ferret rescue in the state.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;

-- 240. Texas Metro Wildlife Rehabilitators
with new_org as (
  insert into organizations (
    name, org_type, species, focus, specialty, c3_status, city, county,
    service_area, region, statewide, intake_status, intake_restrictions,
    intake_form_url, website, social_media, public_email, public_phone,
    resource_status, last_verified, notes
  ) values (
  'Texas Metro Wildlife Rehabilitators', 'Wildlife Rescue', '{"Wildlife"}', 'Wildlife Rehabilitation', 'Native mammals',
  'Yes', 'Benbrook', 'Tarrant', 'Tarrant and surrounding counties / DFW', 'DFW / North Texas', 'No',
  'Accepting', 'Wildlife emergencies are routed through the DFW Wildlife Coalition hotline to a qualified permitted rehabilitator.', NULL, 'https://www.txmwr.org/',
  NULL, NULL, '972-234-9453', 'Verified',
  '2026-08-12', 'Official site active in 2026; nonprofit 501(c)(3), state-permitted volunteer wildlife rehabilitators handling native mammals.'
)
  returning id
)
insert into capabilities (
  org_id, owner_surrender, shelter_pull, stray_found, emergency_medical,
  cruelty_neglect, behavioral, senior, special_needs, neonatal, pregnant_nursing,
  breed_specific, wildlife, farm_equine, transport, temporary_foster, pet_retention
)
select id, 'Unknown', 'Unknown', 'Yes', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Yes', 'Unknown', 'Unknown', 'Unknown', 'Unknown' from new_org;


commit;
