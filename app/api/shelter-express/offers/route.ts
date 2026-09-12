import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { orgId } = await requireEffectiveOrg();
    const offers = await sql`
      select offer.id, offer.animal_id, offer.offer_type, offer.contact_name,
        offer.contact_email, offer.contact_phone, offer.city, offer.postal_code,
        offer.availability, offer.household_info, offer.message, offer.status,
        offer.created_at, offer.updated_at, offer.internal_notes,
        coalesce(nullif(animal.name, ''), nullif(animal.temporary_name, ''), 'Unnamed animal') as animal_name,
        animal.urgency
      from animal_help_offers offer
      join animals animal on animal.id = offer.animal_id
      where animal.current_org_id = ${orgId}::uuid
      order by case offer.status when 'new' then 0 when 'reviewing' then 1 when 'contacted' then 2 else 3 end,
        offer.created_at desc
    `;
    const activities = offers.length ? await sql`
      select activity.id, activity.offer_id, activity.action, activity.previous_status,
        activity.new_status, activity.note, activity.created_at,
        coalesce(account.email, 'Former staff member') as actor_email
      from shelter_offer_activity activity
      left join users account on account.id = activity.actor_user_id
      where activity.org_id = ${orgId}::uuid
      order by activity.created_at desc
    ` : [];
    return NextResponse.json({ offers, activities });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Offers could not be loaded." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { orgId, session } = await requireEffectiveOrg();
    const body = await request.json().catch(() => null);
    const offerId = typeof body?.offerId === "string" ? body.offerId : "";
    const status = typeof body?.status === "string" ? body.status : "";
    const action = body?.action === "save_note" ? "save_note" : "change_status";
    const note = typeof body?.note === "string" ? body.note.trim() : "";
    if (!offerId) {
      return NextResponse.json({ error: "Choose a valid offer." }, { status: 400 });
    }
    if (action === "save_note" && !note) {
      return NextResponse.json({ error: "Enter a private note before saving." }, { status: 400 });
    }
    if (action === "change_status" && !["new", "reviewing", "contacted", "accepted", "declined", "closed"].includes(status)) {
      return NextResponse.json({ error: "Choose a valid offer and status." }, { status: 400 });
    }
    const currentRows = await sql`
      select offer.id, offer.status
      from animal_help_offers offer
      join animals animal on animal.id = offer.animal_id
      where offer.id = ${offerId}::uuid and animal.current_org_id = ${orgId}::uuid
      limit 1
    `;
    if (!currentRows[0]) return NextResponse.json({ error: "Offer not found." }, { status: 404 });

    if (action === "save_note") {
      const rows = await sql`
        update animal_help_offers set internal_notes = ${note}, updated_at = now()
        where id = ${offerId}::uuid returning id, status, internal_notes, updated_at
      `;
      const activity = await sql`
        insert into shelter_offer_activity (offer_id, org_id, actor_user_id, action, note)
        values (${offerId}::uuid, ${orgId}::uuid, ${session.id}::uuid, 'note_added', ${note})
        returning id, offer_id, action, previous_status, new_status, note, created_at
      `;
      return NextResponse.json({ offer: rows[0], activity: { ...activity[0], actor_email: session.email } });
    }

    const rows = await sql`
      update animal_help_offers set status = ${status}, updated_at = now()
      where id = ${offerId}::uuid returning id, status, internal_notes, updated_at
    `;
    const activity = await sql`
      insert into shelter_offer_activity
        (offer_id, org_id, actor_user_id, action, previous_status, new_status)
      values
        (${offerId}::uuid, ${orgId}::uuid, ${session.id}::uuid, 'status_changed', ${currentRows[0].status}, ${status})
      returning id, offer_id, action, previous_status, new_status, note, created_at
    `;
    return NextResponse.json({ offer: rows[0], activity: { ...activity[0], actor_email: session.email } });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "The offer could not be updated." }, { status: 500 });
  }
}
