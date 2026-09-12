import {NextResponse} from "next/server";
import {sql} from "@/lib/db";
export const runtime="edge";export const dynamic="force-dynamic";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;const rows=await sql`
 select animal.id,coalesce(nullif(animal.public_name,''),nullif(animal.name,''),nullif(animal.temporary_name,'')) as name,
 coalesce(nullif(animal.public_species,''),nullif(animal.species,'')) as species,
 coalesce(nullif(animal.public_breed_or_type,''),nullif(animal.breed_or_type,'')) as breed_or_type,
 animal.public_birth_date as birth_date,animal.public_sex as sex,animal.public_weight_lbs as weight_lbs,
 animal.public_summary,animal.public_need,animal.external_listing_url,animal.outcome_status,animal.outcome_date,
 animal.public_outcome_message,animal.show_on_success_wall,animal.primary_photo_document_id,
 organization.id as organization_id,organization.name as organization_name,organization.city as organization_city,
 organization.state as organization_state,organization.website as organization_website,
 organization.public_email as organization_email,organization.public_phone as organization_phone,
 (select count(*)::int from animal_help_offers offer where offer.animal_id=animal.id and offer.status in ('new','reviewing','contacted')) as active_help_offer_count
 from animals animal join organizations organization on organization.id=animal.current_org_id
 where animal.id=${id}::uuid and organization.archived_at is null
 and (animal.public_share_enabled is true or (animal.outcome_status='adopted' and animal.show_on_success_wall is true)) limit 1`;
 const row=rows[0];if(!row)return NextResponse.json({error:"This animal's public profile is not currently available."},{status:404});
 return NextResponse.json({animal:{id:row.id,name:row.name,species:row.species,breed_or_type:row.breed_or_type,birth_date:row.birth_date,sex:row.sex,weight_lbs:row.weight_lbs,public_summary:row.public_summary,public_need:row.public_need,external_listing_url:row.external_listing_url,outcome_status:row.outcome_status,outcome_date:row.outcome_date,public_outcome_message:row.public_outcome_message,show_on_success_wall:Boolean(row.show_on_success_wall),active_help_offer_count:Number(row.active_help_offer_count??0),photo:row.primary_photo_document_id?{id:String(row.primary_photo_document_id),url:`/api/public/animals/${encodeURIComponent(id)}/photo`,source:"animal_document",visibility:"public"}:null,organization:{id:row.organization_id,name:row.organization_name,city:row.organization_city,state:row.organization_state,website:row.organization_website,email:row.organization_email,phone:row.organization_phone}}},{headers:{"Cache-Control":"public, max-age=60, stale-while-revalidate=300"}});
 }catch(error){console.error("Public animal profile failed:",error);return NextResponse.json({error:"This public profile could not be loaded."},{status:500});}}
