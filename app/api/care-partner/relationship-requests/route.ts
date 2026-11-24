import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";
import { isRescueManagerOrganization, isShelterExpressOrganization } from "@/lib/organization-types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

async function requireRelationshipReviewer() {
  const { session, orgId } = await requireEffectiveOrg();
  const orgRows = await sql`select org_type from organizations where id = ${orgId}::uuid and archived_at is null limit 1`;
  if (!orgRows[0] || (!isRescueManagerOrganization(orgRows[0].org_type) && !isShelterExpressOrganization(orgRows[0].org_type))) {
    throw new AuthError("Rescue or shelter access required.", 403);
  }
  if (session.role !== "admin") {
    const memberships = await sql`
      select access_level from organization_memberships
      where user_id = ${session.id}::uuid and org_id = ${orgId}::uuid
        and status = 'active' and access_level in ('owner', 'administrator')
      limit 1
    `;
    if (!memberships[0]) throw new AuthError("Owner or administrator access is required to review Care Partner relationships.", 403);
  }
  return { session, orgId };
}

export async function GET() {
  try {
    const { orgId } = await requireRelationshipReviewer();
    const rows = await sql`
      select relationship.id, relationship.status, relationship.request_message,
        relationship.created_at, relationship.updated_at, relationship.reviewed_at,
        provider.id as care_partner_org_id, provider.name as care_partner_name,
        provider.care_partner_category, provider.care_partner_services,
        provider.care_partner_review_status
      from care_partner_relationships relationship
      join organizations provider on provider.id = relationship.care_partner_org_id
      where relationship.partner_org_id = ${orgId}::uuid
      order by case relationship.status when 'requested' then 0 when 'active' then 1 else 2 end,
        relationship.updated_at desc
    `;
    return NextResponse.json({ relationships: rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Care Partner requests could not be loaded." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin");
    if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ error: "Request rejected." }, { status: 403 });
    const { session, orgId } = await requireRelationshipReviewer();
    const body = await req.json().catch(() => null);
    const relationshipId = typeof body?.relationshipId === "string" ? body.relationshipId.trim() : "";
    const allowedActions = new Set(["approve", "decline", "suspend", "reactivate", "end"]);
    const action = typeof body?.action === "string" && allowedActions.has(body.action) ? body.action : "";
    const note = typeof body?.note === "string" ? body.note.trim().slice(0, 2000) : "";
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(relationshipId) || !action || note.length < 10) {
      return NextResponse.json({ error: "Choose a relationship action and include a private decision note of at least 10 characters." }, { status: 400 });
    }
    const currentRows = await sql`select status from care_partner_relationships where id = ${relationshipId}::uuid and partner_org_id = ${orgId}::uuid limit 1`;
    const currentStatus = currentRows[0]?.status ? String(currentRows[0].status) : "";
    const transitions: Record<string, Record<string, string>> = {
      requested: { approve: "active", decline: "declined" },
      active: { suspend: "suspended", end: "ended" },
      suspended: { reactivate: "active", end: "ended" },
    };
    const nextStatus = transitions[currentStatus]?.[action] || "";
    if (!nextStatus) return NextResponse.json({ error: "That relationship action is no longer available for its current status." }, { status: 409 });
    const eventType: Record<string, string> = { approve: "relationship_approved", decline: "relationship_declined", suspend: "relationship_suspended", reactivate: "relationship_reactivated", end: "relationship_ended" };
    const closesAssignments = action === "suspend" || action === "end";
    const rows = await sql`
      with updated as (
        update care_partner_relationships relationship
        set status = ${nextStatus}, reviewed_by = ${session.id}::uuid, reviewed_at = now(),
            started_at = case when ${nextStatus} = 'active' then coalesce(relationship.started_at, now()) else relationship.started_at end,
            ended_at = case when ${nextStatus} in ('declined', 'ended') then now() else relationship.ended_at end,
            updated_at = now()
        from organizations provider
        where relationship.id = ${relationshipId}::uuid
          and relationship.partner_org_id = ${orgId}::uuid
          and relationship.status = ${currentStatus}
          and provider.id = relationship.care_partner_org_id
          and provider.archived_at is null
          and (${nextStatus} <> 'active' or provider.care_partner_review_status = 'verified')
        returning relationship.id
      ), relationship_event as (
        insert into care_partner_relationship_events (
        relationship_id, event_type, old_status, new_status, note, actor_user_id
        )
        select id, ${eventType[action]}, ${currentStatus}, ${nextStatus}, ${note}, ${session.id}::uuid
        from updated
        returning relationship_id
      ), closed_assignments as (
        update care_partner_animal_assignments assignment
        set status = 'revoked', ended_by = ${session.id}::uuid, ended_at = now(),
            end_reason = ${"Relationship " + action + ": " + note}, updated_at = now()
        where assignment.relationship_id in (select relationship_id from relationship_event)
          and assignment.status = 'active'
          and ${closesAssignments} = true
        returning assignment.id
      ), assignment_events as (
        insert into care_partner_animal_assignment_events
          (assignment_id, event_type, old_status, new_status, note, actor_user_id)
        select id, 'assignment_revoked_relationship_closed', 'active', 'revoked',
          ${"Care Partner relationship " + action + ". " + note}, ${session.id}::uuid
        from closed_assignments
        returning assignment_id
      )
      select relationship_id from relationship_event
    `;
    if (!rows[0]) return NextResponse.json({ error: "The relationship changed before this action could be completed, or the Care Partner is no longer verified." }, { status: 409 });
    return NextResponse.json({ ok: true, status: nextStatus });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "The Care Partner request could not be reviewed." }, { status: 500 });
  }
}
