import { NextResponse } from "next/server";
import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";
import { isShelterExpressOrganization } from "@/lib/organization-types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { orgId } = await requireEffectiveOrg();
    const organizationRows = await sql`select org_type from organizations where id = ${orgId}::uuid limit 1`;
    if (!organizationRows[0] || isShelterExpressOrganization(organizationRows[0].org_type)) {
      throw new AuthError("Rescue Manager access is required.", 403);
    }
    const requests = await sql`
      select offer.id, offer.animal_id, offer.status, offer.created_at, offer.updated_at, offer.message,
        coalesce(nullif(animal.public_name, ''), nullif(animal.name, ''), nullif(animal.temporary_name, ''), 'Unnamed animal') as animal_name,
        coalesce(nullif(animal.public_species, ''), nullif(animal.species, '')) as species,
        coalesce(nullif(animal.public_breed_or_type, ''), nullif(animal.breed_or_type, '')) as breed_or_type,
        animal.urgency, animal.public_share_enabled, animal.outcome_status,
        shelter.name as shelter_name, shelter.city as shelter_city, shelter.state as shelter_state
      from animal_help_offers offer
      join animals animal on animal.id = offer.animal_id
      join organizations shelter on shelter.id = animal.current_org_id
      where offer.requesting_org_id = ${orgId}::uuid and offer.offer_type = 'tag_request'
      order by offer.created_at desc
    `;
    return NextResponse.json({ requests }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("GET Rescue Manager shelter tags failed:", error);
    return NextResponse.json({ error: "Shelter tag requests could not be loaded." }, { status: 500 });
  }
}
