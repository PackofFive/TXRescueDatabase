import { NextResponse } from "next/server";
import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { orgId } = await requireEffectiveOrg();

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
