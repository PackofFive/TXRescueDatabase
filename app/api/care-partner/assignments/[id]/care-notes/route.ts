import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";
import { isCarePartnerOrganization, isRescueManagerOrganization, isShelterExpressOrganization } from "@/lib/organization-types";
import { carePartnerAccessLevel, canPerformAssignedCare } from "@/lib/care-partner-access";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NOTE_TYPES = new Set(["observation", "treatment_update", "recommendation"]);

async function noteContext(assignmentId: string, requireActiveWrite = false) {
  if (!UUID.test(assignmentId)) throw new AuthError("Assignment not found.", 404);
  const { session, orgId } = await requireEffectiveOrg();
  const orgs = await sql`select org_type, care_partner_review_status from organizations where id = ${orgId}::uuid and archived_at is null limit 1`;
  const organization = orgs[0];
  if (!organization) throw new AuthError("Organization access required.", 403);
  const carePartner = isCarePartnerOrganization(organization.org_type);
  const manager = isRescueManagerOrganization(organization.org_type) || isShelterExpressOrganization(organization.org_type);
  if (!carePartner && !manager) throw new AuthError("Care-note access is unavailable.", 403);
  if (carePartner && organization.care_partner_review_status !== "verified") throw new AuthError("Verified Care Partner access is required.", 403);
  const accessLevel = carePartner ? await carePartnerAccessLevel(session.id, orgId, session.role === "admin") : null;
  if (carePartner && !accessLevel) throw new AuthError("Active Care Partner membership is required.", 403);

  const assignments = await sql`
    select assignment.id, assignment.animal_id, assignment.status, assignment.expires_at,
      assignment.can_add_care_notes, relationship.care_partner_org_id,
      relationship.partner_org_id, relationship.status as relationship_status,
      coalesce(animal.name, animal.temporary_name, 'Unnamed animal') as animal_name,
      provider.name as care_partner_name, partner.name as organization_name
    from care_partner_animal_assignments assignment
    join care_partner_relationships relationship on relationship.id = assignment.relationship_id
    join organizations provider on provider.id = relationship.care_partner_org_id
    join organizations partner on partner.id = relationship.partner_org_id
    join animals animal on animal.id = assignment.animal_id
    where assignment.id = ${assignmentId}::uuid
      and (${orgId}::uuid = relationship.care_partner_org_id or ${orgId}::uuid = relationship.partner_org_id)
    limit 1
  `;
  const assignment = assignments[0];
  if (!assignment) throw new AuthError("Assignment not found.", 404);
  if (carePartner && (
    assignment.care_partner_org_id !== orgId ||
    assignment.relationship_status !== "active" ||
    assignment.status !== "active" ||
    !(new Date(assignment.expires_at).getTime() > Date.now()) ||
    assignment.can_add_care_notes !== true
  )) {
    throw new AuthError("This assignment no longer grants access to care notes.", 403);
  }
  if (requireActiveWrite) {
    if (!carePartner || !canPerformAssignedCare(accessLevel) || assignment.care_partner_org_id !== orgId || assignment.status !== "active" || assignment.relationship_status !== "active" || new Date(assignment.expires_at).getTime() <= Date.now() || assignment.can_add_care_notes !== true) {
      throw new AuthError("This assignment does not include active permission to add care notes.", 403);
    }
  }
  return { session, orgId, carePartner, manager, assignment, accessLevel };
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { assignment } = await noteContext(id);
    const notes = await sql`
      select note.id, note.note_type, note.note_text, note.observed_at,
        note.addendum_to_note_id, note.created_at,
        creator.email as created_by_email
      from care_partner_care_notes note
      join users creator on creator.id = note.created_by
      where note.assignment_id = ${id}::uuid
      order by note.observed_at desc, note.created_at desc
    `;
    return NextResponse.json({
      assignment: {
        id: assignment.id,
        animalName: assignment.animal_name,
        carePartnerName: assignment.care_partner_name,
        organizationName: assignment.organization_name,
        canAddCareNotes: assignment.can_add_care_notes,
        status: assignment.status,
        expiresAt: assignment.expires_at,
      },
      notes,
    }, { headers: { "Cache-Control": "no-store, private" } });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Care notes could not be loaded." }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "Request rejected." }, { status: 403 });
    const { id } = await params;
    const { session, assignment } = await noteContext(id, true);
    const body = await request.json().catch(() => null);
    const addendumToNoteId = typeof body?.addendumToNoteId === "string" ? body.addendumToNoteId.trim() : "";
    const isAddendum = Boolean(addendumToNoteId);
    const noteType = NOTE_TYPES.has(body?.noteType) ? body.noteType : "observation";
    const noteText = typeof body?.noteText === "string" ? body.noteText.trim() : "";
    const observedAt = typeof body?.observedAt === "string" ? new Date(body.observedAt) : new Date(NaN);
    if (noteText.length < 10 || noteText.length > 5000 || Number.isNaN(observedAt.getTime()) || observedAt.getTime() > Date.now() + 5 * 60 * 1000) {
      return NextResponse.json({ error: "Enter a care note of 10–5,000 characters and a valid observation time that is not in the future." }, { status: 400 });
    }
    if (isAddendum && !UUID.test(addendumToNoteId)) return NextResponse.json({ error: "The original care note could not be found." }, { status: 400 });
    if (isAddendum) {
      const original = await sql`
        select id from care_partner_care_notes
        where id = ${addendumToNoteId}::uuid
          and assignment_id = ${id}::uuid
        limit 1
      `;
      if (!original[0]) return NextResponse.json({ error: "The original care note could not be found in this assignment." }, { status: 404 });
    }
    const rows = await sql`
      with created as (
        insert into care_partner_care_notes
          (assignment_id, animal_id, note_type, note_text, observed_at, addendum_to_note_id, created_by)
        values
          (${id}::uuid, ${assignment.animal_id}::uuid, ${isAddendum ? "addendum" : noteType}, ${noteText}, ${observedAt.toISOString()}::timestamptz, ${isAddendum ? addendumToNoteId : null}::uuid, ${session.id}::uuid)
        returning id
      )
      insert into care_partner_animal_assignment_events
        (assignment_id, event_type, note, actor_user_id)
      select ${id}::uuid, ${isAddendum ? "care_note_addendum_added" : "care_note_added"},
        ${isAddendum ? "Addendum added to care note " + addendumToNoteId + "." : "Care note added under the assignment."} || ' New entry: ' || id::text,
        ${session.id}::uuid
      from created
      returning note
    `;
    if (!rows[0]) return NextResponse.json({ error: "The care note could not be saved." }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "The care note could not be saved." }, { status: 500 });
  }
}
