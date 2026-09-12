import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { orgId }a = await requireEffectiveOrg();
    const offers = await sql`
      select offer.id, offer.animal_id, offer.offer_type, offer.contact_name,
        offer.contact_email, offer.contact_phone, offer.city, offer.postal_code,
        offer.availability, offer.household_info, offer.message, offer.status,
        offer.created_at, offer.updated_at,
        coalesce(nullif(animal.name, ''), nullif(animal.temporary_name, ''), 'Unnamed animal') as animal_name,
        animal.urgency
      from animal_help_offers offer
      join animals animal on animal.id = offer.animal_id
      where animal.current_org_id = ${orgId}::uuid
      order by case offer.status when 'new' then 0 when 'reviewing' then 1 when 'contacted' then 2 else 3 end,
        offer.created_at desc
    `;
    return NextResponse.json({ offers });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Offers could not be loaded." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { orgId } = await requireEffectiveOrg();
    const body = await request.json().catch(() => null);
    const offerId = typeof body?.offerId === "string" ? body.offerId : "";
    const status = typeof body?.status === "string" ? body.status : "";
    if (!offerId || !["new", "reviewing", "contacted", "accepted", "declined", "closed"].includes(status)) {
      return NextResponse.json({ error: "Choose a valid offer and status." }, { status: 400 });
    }
    const rows = await sql`
      update animal_help_offers offer set status = ${status}, updated_at = now()
      from animals animal
      where offer.id = ${offerId}::uuid and animal.id = offer.animal_id
        and animal.current_org_id = ${orgId}::uuid
      returning offer.id, offer.status
    `;
    if (!rows[0]) return NextResponse.json({ error: "Offer not found." }, { status: 404 });
    return NextResponse.json({ offer: rows[0] });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "The offer could not be updated." }, { status: 500 });
  }
}
