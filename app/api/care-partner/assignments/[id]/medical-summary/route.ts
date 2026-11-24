import { NextResponse } from "next/server";
import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";
import { isCarePartnerOrganization } from "@/lib/organization-types";
import { carePartnerAccessLevel } from "@/lib/care-partner-access";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!UUID.test(id)) return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
    const { session, orgId } = await requireEffectiveOrg();
    const organizations = await sql`
      select org_type, care_partner_review_status
      from organizations
      where id = ${orgId}::uuid and archived_at is null
      limit 1
    `;
    if (!organizations[0] || !isCarePartnerOrganization(organizations[0].org_type) || organizations[0].care_partner_review_status !== "verified") {
      throw new AuthError("Verified Care Partner access is required.", 403);
    }
    const accessLevel = await carePartnerAccessLevel(session.id, orgId, session.role === "admin");
    if (!accessLevel) throw new AuthError("Active Care Partner membership is required.", 403);

    const assignments = await sql`
      select assignment.id, assignment.animal_id, assignment.purpose, assignment.expires_at,
        coalesce(animal.name, animal.temporary_name, 'Unnamed animal') as animal_name,
        animal.species, animal.breed_or_type,
        partner.name as organization_name
      from care_partner_animal_assignments assignment
      join care_partner_relationships relationship on relationship.id = assignment.relationship_id
      join organizations partner on partner.id = relationship.partner_org_id
      join animals animal on animal.id = assignment.animal_id
      where assignment.id = ${id}::uuid
        and relationship.care_partner_org_id = ${orgId}::uuid
        and relationship.status = 'active'
        and animal.current_org_id = relationship.partner_org_id
        and assignment.status = 'active'
        and assignment.expires_at > now()
        and assignment.can_view_medical_summary = true
      limit 1
    `;
    const assignment = assignments[0];
    if (!assignment) throw new AuthError("This assignment does not include an active medical-summary permission.", 403);

    const [medicalRecords, medications] = await Promise.all([
      sql`
        select record_type, title, occurred_at, due_at, status
        from animal_medical_records
        where animal_id = ${assignment.animal_id}::uuid
        order by coalesce(occurred_at, due_at, created_at::date) desc
        limit 100
      `,
      sql`
        select medication_name, dosage, instructions, frequency,
          start_date, end_date, next_due_at, active
        from animal_medications
        where animal_id = ${assignment.animal_id}::uuid
        order by active desc, created_at desc
        limit 100
      `,
    ]);

    await sql`
      insert into care_partner_animal_assignment_events
        (assignment_id, event_type, note, actor_user_id)
      values
        (${id}::uuid, 'medical_summary_viewed', 'Limited medical summary viewed by assigned Care Partner.', ${session.id}::uuid)
    `;

    return NextResponse.json({
      assignment: {
        id: assignment.id,
        animalName: assignment.animal_name,
        species: assignment.species,
        breedOrType: assignment.breed_or_type,
        organizationName: assignment.organization_name,
        purpose: assignment.purpose,
        expiresAt: assignment.expires_at,
      },
      medicalRecords,
      medications,
      limitations: "This summary excludes private notes, provider contact information, expenses, documents, staff records, and the animal's full organization file.",
    }, { headers: { "Cache-Control": "no-store, private" } });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "The limited medical summary could not be loaded." }, { status: 500 });
  }
}
