import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";
import { isCarePartnerOrganization, isRescueManagerOrganization, isShelterExpressOrganization } from "@/lib/organization-types";
import { carePartnerAccessLevel } from "@/lib/care-partner-access";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function assignmentContext() {
  const { session, orgId } = await requireEffectiveOrg();
  const organizations = await sql`select org_type, care_partner_review_status from organizations where id = ${orgId}::uuid and archived_at is null limit 1`;
  const organization = organizations[0];
  if (!organization) throw new AuthError("Organization access required.", 403);
  const carePartner = isCarePartnerOrganization(organization.org_type);
  const manager = isRescueManagerOrganization(organization.org_type) || isShelterExpressOrganization(organization.org_type);
  if (!carePartner && !manager) throw new AuthError("Animal assignment access is not available for this organization.", 403);
  if (carePartner && organization.care_partner_review_status !== "verified") throw new AuthError("Verified Care Partner access is required.", 403);
  const carePartnerLevel = carePartner ? await carePartnerAccessLevel(session.id, orgId, session.role === "admin") : null;
  if (carePartner && !carePartnerLevel) throw new AuthError("Active Care Partner membership is required.", 403);
  if (manager && session.role !== "admin") {
    const memberships = await sql`select 1 from organization_memberships where user_id = ${session.id}::uuid and org_id = ${orgId}::uuid and status = 'active' and access_level in ('owner', 'administrator') limit 1`;
    if (!memberships[0]) throw new AuthError("Owner or administrator access is required.", 403);
  }
  return { session, orgId, carePartner, manager, carePartnerLevel };
}

export async function GET() {
  try {
    const { orgId, carePartner } = await assignmentContext();
    await sql`select expire_care_partner_animal_assignments()`;
    if (carePartner) {
      const assignments = await sql`
        select assignment.id, assignment.status, assignment.purpose,
          assignment.can_view_medical_summary, assignment.can_upload_documents,
          assignment.can_add_care_notes, assignment.expires_at, assignment.created_at,
          animal.id as animal_id, coalesce(animal.name, animal.temporary_name, 'Unnamed animal') as animal_name,
          animal.species, animal.breed_or_type,
          partner.id as organization_id, partner.name as organization_name
        from care_partner_animal_assignments assignment
        join care_partner_relationships relationship on relationship.id = assignment.relationship_id
        join organizations partner on partner.id = relationship.partner_org_id
        join animals animal on animal.id = assignment.animal_id
        where relationship.care_partner_org_id = ${orgId}::uuid
          and relationship.status = 'active'
          and animal.current_org_id = relationship.partner_org_id
        order by case assignment.status when 'active' then 0 else 1 end, assignment.updated_at desc
      `;
      return NextResponse.json({ role: "care_partner", assignments }, { headers: { "Cache-Control": "no-store" } });
    }
    const [relationships, animals, assignments] = await Promise.all([
      sql`select relationship.id, provider.name as care_partner_name from care_partner_relationships relationship join organizations provider on provider.id = relationship.care_partner_org_id where relationship.partner_org_id = ${orgId}::uuid and relationship.status = 'active' and provider.care_partner_review_status = 'verified' order by provider.name`,
      sql`select id, coalesce(name, temporary_name, 'Unnamed animal') as name, species, breed_or_type from animals where current_org_id = ${orgId}::uuid and coalesce(outcome_status, 'active') not in ('adopted', 'transferred', 'deceased', 'returned') order by coalesce(name, temporary_name, 'Unnamed animal')`,
      sql`select assignment.id, assignment.status, assignment.purpose, assignment.can_view_medical_summary, assignment.can_upload_documents, assignment.can_add_care_notes, assignment.expires_at, assignment.created_at, coalesce(animal.name, animal.temporary_name, 'Unnamed animal') as animal_name, provider.name as care_partner_name from care_partner_animal_assignments assignment join care_partner_relationships relationship on relationship.id = assignment.relationship_id join organizations provider on provider.id = relationship.care_partner_org_id join animals animal on animal.id = assignment.animal_id where relationship.partner_org_id = ${orgId}::uuid order by case assignment.status when 'active' then 0 else 1 end, assignment.updated_at desc`
    ]);
    return NextResponse.json({ role: "manager", relationships, animals, assignments }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Care Partner assignments could not be loaded." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin");
    if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ error: "Request rejected." }, { status: 403 });
    const { session, orgId, manager } = await assignmentContext();
    if (!manager) throw new AuthError("Only the animal's organization can create an assignment.", 403);
    await sql`select expire_care_partner_animal_assignments()`;
    const body = await req.json().catch(() => null);
    const relationshipId = typeof body?.relationshipId === "string" ? body.relationshipId.trim() : "";
    const animalId = typeof body?.animalId === "string" ? body.animalId.trim() : "";
    const purpose = typeof body?.purpose === "string" ? body.purpose.trim().slice(0, 2000) : "";
    const expiresAt = typeof body?.expiresAt === "string" ? new Date(body.expiresAt) : new Date(NaN);
    const canViewMedicalSummary = body?.canViewMedicalSummary === true;
    const canUploadDocuments = body?.canUploadDocuments === true;
    const canAddCareNotes = body?.canAddCareNotes === true;
    const maximum = Date.now() + 366 * 24 * 60 * 60 * 1000;
    if (!UUID.test(relationshipId) || !UUID.test(animalId) || purpose.length < 20 || body?.authorizationConfirmed !== true || Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now() || expiresAt.getTime() > maximum) {
      return NextResponse.json({ error: "Choose a partner and animal, explain the purpose in at least 20 characters, confirm authorization, and choose an expiration within one year." }, { status: 400 });
    }
    const rows = await sql`
      with created as (
        insert into care_partner_animal_assignments (relationship_id, animal_id, purpose, can_view_medical_summary, can_upload_documents, can_add_care_notes, authorization_confirmed_at, expires_at, assigned_by)
        select relationship.id, animal.id, ${purpose}, ${canViewMedicalSummary}, ${canUploadDocuments}, ${canAddCareNotes}, now(), ${expiresAt.toISOString()}::timestamptz, ${session.id}::uuid
        from care_partner_relationships relationship
        join organizations provider on provider.id = relationship.care_partner_org_id
        join animals animal on animal.id = ${animalId}::uuid
        where relationship.id = ${relationshipId}::uuid and relationship.partner_org_id = ${orgId}::uuid
          and relationship.status = 'active' and provider.care_partner_review_status = 'verified'
          and animal.current_org_id = ${orgId}::uuid
          and coalesce(animal.outcome_status, 'active') not in ('adopted', 'transferred', 'deceased', 'returned')
        for share of animal
        returning id
      )
      insert into care_partner_animal_assignment_events (assignment_id, event_type, new_status, note, actor_user_id)
      select id, 'assignment_created', 'active', ${purpose}, ${session.id}::uuid from created
      returning assignment_id
    `;
    if (!rows[0]) return NextResponse.json({ error: "The partner relationship or animal is no longer eligible." }, { status: 409 });
    return NextResponse.json({ ok: true, assignmentId: rows[0].assignment_id });
  } catch (error: any) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    if (error?.code === "23505") return NextResponse.json({ error: "This partner already has an active assignment for that animal." }, { status: 409 });
    return NextResponse.json({ error: "The animal assignment could not be created." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const origin = req.headers.get("origin");
    if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ error: "Request rejected." }, { status: 403 });
    const { session, orgId, manager } = await assignmentContext();
    if (!manager) throw new AuthError("Only the animal's organization can end an assignment.", 403);
    const body = await req.json().catch(() => null);
    const assignmentId = typeof body?.assignmentId === "string" ? body.assignmentId.trim() : "";
    const status = body?.status === "completed" || body?.status === "revoked" ? body.status : "";
    const reason = typeof body?.reason === "string" ? body.reason.trim().slice(0, 2000) : "";
    if (!UUID.test(assignmentId) || !status || reason.length < 10) return NextResponse.json({ error: "Choose completed or revoked and include a reason of at least 10 characters." }, { status: 400 });
    const rows = await sql`
      with updated as (
        update care_partner_animal_assignments assignment set status = ${status}, ended_by = ${session.id}::uuid, ended_at = now(), end_reason = ${reason}, updated_at = now()
        from care_partner_relationships relationship
        where assignment.id = ${assignmentId}::uuid and assignment.relationship_id = relationship.id
          and relationship.partner_org_id = ${orgId}::uuid and assignment.status = 'active'
          and assignment.expires_at > clock_timestamp()
        returning assignment.id
      )
      insert into care_partner_animal_assignment_events (assignment_id, event_type, old_status, new_status, note, actor_user_id)
      select id, ${status === "completed" ? "assignment_completed" : "assignment_revoked"}, 'active', ${status}, ${reason}, ${session.id}::uuid from updated
      returning assignment_id
    `;
    if (!rows[0]) return NextResponse.json({ error: "This assignment is no longer active. Refresh to see its current status." }, { status: 409 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "The assignment could not be updated." }, { status: 500 });
  }
}
