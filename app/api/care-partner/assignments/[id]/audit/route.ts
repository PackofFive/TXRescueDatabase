import { NextResponse } from "next/server";
import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";
import { isCarePartnerOrganization, isRescueManagerOrganization, isShelterExpressOrganization } from "@/lib/organization-types";
import { carePartnerAccessLevel } from "@/lib/care-partner-access";

export const runtime = "edge";
export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!UUID.test(id)) return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
    const { session, orgId } = await requireEffectiveOrg();
    const orgs = await sql`select org_type, care_partner_review_status from organizations where id = ${orgId}::uuid and archived_at is null limit 1`;
    const organization = orgs[0];
    if (!organization) throw new AuthError("Organization access required.", 403);
    const carePartner = isCarePartnerOrganization(organization.org_type);
    const manager = isRescueManagerOrganization(organization.org_type) || isShelterExpressOrganization(organization.org_type);
    if (!carePartner && !manager) throw new AuthError("Assignment audit access is unavailable.", 403);
    if (carePartner && organization.care_partner_review_status !== "verified") throw new AuthError("Verified Care Partner access is required.", 403);
    const carePartnerLevel = carePartner ? await carePartnerAccessLevel(session.id, orgId, session.role === "admin") : null;
    if (carePartner && !carePartnerLevel) throw new AuthError("Active Care Partner membership is required.", 403);
    if (manager && session.role !== "admin") {
      const memberships = await sql`select 1 from organization_memberships where user_id = ${session.id}::uuid and org_id = ${orgId}::uuid and status = 'active' and access_level in ('owner', 'administrator') limit 1`;
      if (!memberships[0]) throw new AuthError("Owner or administrator access is required.", 403);
    }
    const assignments = await sql`
      select assignment.id, assignment.status, assignment.created_at, assignment.expires_at,
        coalesce(animal.name, animal.temporary_name, 'Unnamed animal') as animal_name,
        provider.name as care_partner_name, partner.name as organization_name
      from care_partner_animal_assignments assignment
      join care_partner_relationships relationship on relationship.id = assignment.relationship_id
      join animals animal on animal.id = assignment.animal_id
      join organizations provider on provider.id = relationship.care_partner_org_id
      join organizations partner on partner.id = relationship.partner_org_id
      where assignment.id = ${id}::uuid
        and (${orgId}::uuid = relationship.care_partner_org_id or ${orgId}::uuid = relationship.partner_org_id)
      limit 1
    `;
    if (!assignments[0]) throw new AuthError("Assignment not found.", 404);
    const events = await sql`
      select event.id, event.event_type, event.old_status, event.new_status,
        event.note, event.system_generated, event.created_at,
        actor.email as actor_email
      from care_partner_animal_assignment_events event
      left join users actor on actor.id = event.actor_user_id
      where event.assignment_id = ${id}::uuid
      order by event.created_at desc, event.id desc
    `;
    return NextResponse.json({ assignment: assignments[0], events }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Assignment audit history could not be loaded." }, { status: 500 });
  }
}
