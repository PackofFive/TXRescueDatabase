import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";
export const runtime = "edge";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const { orgId } = await requireEffectiveOrg();
    const partners = await sql`select relationship.id as relationship_id, organization.id, organization.name, organization.org_type, organization.city, organization.county, organization.state, organization.species, organization.intake_status, organization.website, organization.public_email, relationship.notes, relationship.created_at from shelter_rescue_partners relationship join organizations organization on organization.id=relationship.rescue_org_id where relationship.shelter_org_id=${orgId}::uuid and organization.archived_at is null order by organization.name`;
    const candidates = await sql`select organization.id, organization.name, organization.org_type, organization.city, organization.county, organization.state, organization.species, organization.intake_status, organization.website, organization.public_email from organizations organization where organization.archived_at is null and organization.id<>${orgId}::uuid and organization.org_type in ('Animal Rescue','Wildlife Rescue','Sanctuary','Farm / Equine') and not exists (select 1 from shelter_rescue_partners relationship where relationship.shelter_org_id=${orgId}::uuid and relationship.rescue_org_id=organization.id) order by organization.name`;
    return NextResponse.json({ partners, candidates });
  } catch (error) { if(error instanceof AuthError)return NextResponse.json({error:error.message},{status:error.status}); return NextResponse.json({error:"Rescue partners could not be loaded."},{status:500}); }
}
export async function POST(request:NextRequest){
  try{const {session,orgId}=await requireEffectiveOrg();const body=await request.json().catch(()=>null);const rescueOrgId=typeof body?.rescueOrgId==="string"?body.rescueOrgId:"";if(!rescueOrgId)return NextResponse.json({error:"Choose a rescue organization."},{status:400});const rows=await sql`insert into shelter_rescue_partners(shelter_org_id,rescue_org_id,added_by) select ${orgId}::uuid,organization.id,${session.id}::uuid from organizations organization where organization.id=${rescueOrgId}::uuid and organization.archived_at is null and organization.org_type in ('Animal Rescue','Wildlife Rescue','Sanctuary','Farm / Equine') on conflict(shelter_org_id,rescue_org_id) do nothing returning id`;if(!rows[0])return NextResponse.json({error:"That rescue could not be added."},{status:409});return NextResponse.json({message:"Rescue partner added."},{status:201});}catch(error){if(error instanceof AuthError)return NextResponse.json({error:error.message},{status:error.status});return NextResponse.json({error:"The rescue partner could not be added."},{status:500});}
}
export async function DELETE(request:NextRequest){
  try{const {orgId}=await requireEffectiveOrg();const body=await request.json().catch(()=>null);const rescueOrgId=typeof body?.rescueOrgId==="string"?body.rescueOrgId:"";if(!rescueOrgId)return NextResponse.json({error:"Choose a rescue partner."},{status:400});const rows=await sql`delete from shelter_rescue_partners where shelter_org_id=${orgId}::uuid and rescue_org_id=${rescueOrgId}::uuid returning id`;if(!rows[0])return NextResponse.json({error:"Rescue partner not found."},{status:404});return NextResponse.json({message:"Rescue partner removed."});}catch(error){if(error instanceof AuthError)return NextResponse.json({error:error.message},{status:error.status});return NextResponse.json({error:"The rescue partner could not be removed."},{status:500});}
}
