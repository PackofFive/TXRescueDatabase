import { NextResponse } from "next/server";
import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { session, orgId } = await requireEffectiveOrg();

    const accessRows = session.role === "admin" ? [{ access_level: "owner", shelter_express_access: true }] : await sql`
      select access_level, shelter_express_access
      from organization_memberships
      where org_id = ${orgId}::uuid
        and user_id = ${session.id}::uuid
        and status = 'active'
      limit 1
    `;
    const access = accessRows[0];

    if (!access || access.shelter_express_access !== true) {
      throw new AuthError("Shelter Express access is required.", 403);
    }

    const rows = await sql`
      select
        (
          select count(*)::int
          from animals animal
          where animal.current_org_id = ${orgId}::uuid
            and animal.outcome_status is null
            and animal.urgency in ('urgent', 'critical')
        ) as urgent_animals,
        (
          select count(*)::int
          from animal_help_offers offer
          join animals animal on animal.id = offer.animal_id
          where animal.current_org_id = ${orgId}::uuid
            and offer.status in ('new', 'reviewing', 'contacted')
        ) as actionable_offers,
        (
          select count(*)::int
          from foster_animal_updates report
          where report.organization_id = ${orgId}::uuid
            and report.status = 'submitted'
        ) as reports_needing_review
    `;

    return NextResponse.json({
      permissions: {
        can_manage_team: access.access_level === "owner",
      },
      counts: rows[0] ?? {
        urgent_animals: 0,
        actionable_offers: 0,
        reports_needing_review: 0,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Shelter Express counts could not be loaded." }, { status: 500 });
  }
}
