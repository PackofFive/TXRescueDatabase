import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireUser, AuthError } from "@/lib/auth";

export const runtime = "edge";

// GET — list animals belonging to the signed-in user's org, most recent
// first. Kept intentionally simple for now (no pagination/filtering) —
// this exists to support the intake flow and a basic list view, not as
// the final Rescue Manager animal list experience.
export async function GET() {
  try {
    const session = await requireUser();
    if (session.role !== "org" || !session.orgId) {
      return NextResponse.json({ error: "Only organization accounts can view animal records." }, { status: 403 });
    }
    const rows = await sql`
      select id, name, temporary_name, species, breed_or_type, custody, urgency, placement, created_at
      from animals
      where current_org_id = ${session.orgId}
      order by created_at desc
    `;
    return NextResponse.json({ animals: rows });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error("GET /api/animals failed:", err);
    return NextResponse.json({ error: "Something went wrong loading animals." }, { status: 500 });
  }
}

// POST — Quick Animal Intake (Master Product Plan Section 8.1). Deliberately
// minimal: photo, species, name/temporary name, date, and current
// relationship/custody. Everything else on the animal record can be filled
// in later — that's the whole point of "quick" intake.
//
// Creates two things atomically in sequence: the animal row itself, and
// an opening `animal_custody_events` row (event_type='intake') so the
// Timeline view (Section 8.3) has something to show from day one.
export async function POST(req: NextRequest) {
  try {
    const session = await requireUser();
    if (session.role !== "org" || !session.orgId) {
      return NextResponse.json({ error: "Only organization accounts can record animal intake." }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    const { species, name, temporaryName, custody, intakeDate, photoUrl, notes } = body ?? {};

    if (!species || typeof species !== "string") {
      return NextResponse.json({ error: "Species is required." }, { status: 400 });
    }
    const validCustody = ["shelter", "rescue", "owner", "other"];
    const custodyValue = validCustody.includes(custody) ? custody : "rescue";
    const startedAt = intakeDate ? new Date(intakeDate) : new Date();
    if (isNaN(startedAt.getTime())) {
      return NextResponse.json({ error: "Intake date is invalid." }, { status: 400 });
    }

    const animalRows = await sql`
      insert into animals (name, temporary_name, species, current_org_id, custody, notes, created_by)
      values (${name || null}, ${temporaryName || null}, ${species}, ${session.orgId}, ${custodyValue}, ${notes || null}, ${session.id})
      returning id, name, temporary_name, species, custody, created_at
    `;
    const animal = animalRows[0];

    await sql`
      insert into animal_custody_events (animal_id, event_type, org_id, recorded_by, started_at)
      values (${animal.id}, 'intake', ${session.orgId}, ${session.id}, ${startedAt.toISOString()})
    `;

    if (photoUrl && typeof photoUrl === "string") {
      await sql`
        insert into media (owner_type, owner_id, url, source, visibility, uploaded_by)
        values ('animal', ${animal.id}, ${photoUrl}, 'rescue', 'private', ${session.id})
      `;
    }

    await sql`
      insert into audit_log (entity_type, entity_id, changed_by, field_name, new_value)
      values ('animal', ${animal.id}, ${session.id}, 'intake', ${JSON.stringify({ species, custody: custodyValue })})
    `;

    return NextResponse.json({ animal }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error("POST /api/animals failed:", err);
    return NextResponse.json({ error: "Something went wrong recording intake." }, { status: 500 });
  }
}
