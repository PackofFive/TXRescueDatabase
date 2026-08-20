import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireEffectiveOrg, AuthError } from "@/lib/auth";

export const runtime = "edge";

export async function GET() {
  try {
    const { orgId } = await requireEffectiveOrg();

    const rows = await sql`
      select id, name, temporary_name, species, breed_or_type, custody, urgency, placement, created_at
      from animals
      where current_org_id = ${orgId}
      order by created_at desc
    `;

    return NextResponse.json({ animals: rows });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("GET /api/animals failed:", err);
    return NextResponse.json(
      { error: "Something went wrong loading animals." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { session, orgId } = await requireEffectiveOrg();

    const body = await req.json().catch(() => null);
    const { species, name, temporaryName, custody, intakeDate, photoUrl, notes } =
      body ?? {};

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
      insert into animals
        (name, temporary_name, species, current_org_id, custody, notes, created_by)
      values
        (${name || null}, ${temporaryName || null}, ${species}, ${orgId},
         ${custodyValue}, ${notes || null}, ${session.id})
      returning id, name, temporary_name, species, custody, created_at
    `;

    const animal = animalRows[0];

    await sql`
      insert into animal_custody_events
        (animal_id, event_type, org_id, recorded_by, started_at)
      values
        (${animal.id}, 'intake', ${orgId}, ${session.id}, ${startedAt.toISOString()})
    `;

    if (photoUrl && typeof photoUrl === "string") {
      await sql`
        insert into media
          (owner_type, owner_id, url, source, visibility, uploaded_by)
        values
          ('animal', ${animal.id}, ${photoUrl}, 'rescue', 'private', ${session.id})
      `;
    }

    await sql`
      insert into audit_log
        (entity_type, entity_id, changed_by, field_name, new_value)
      values
        ('animal', ${animal.id}, ${session.id}, 'intake',
         ${JSON.stringify({
           species,
           custody: custodyValue,
           actingOrgId: orgId,
           adminTestMode: session.role === "admin",
         })})
    `;

    return NextResponse.json({ animal }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("POST /api/animals failed:", err);
    return NextResponse.json(
      { error: "Something went wrong recording intake." },
      { status: 500 }
    );
  }
}
