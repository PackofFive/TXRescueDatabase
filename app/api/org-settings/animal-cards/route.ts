import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireEffectiveOrg, AuthError } from "@/lib/auth";

export const runtime = "edge";

const ALLOWED = new Set(["sex","weight","placement","source","intake_date","public_status","foster_offers"]);

export async function GET() {
  try {
    const { orgId } = await requireEffectiveOrg();
    const rows = await sql`select animal_card_fields from organizations where id = ${orgId} limit 1`;
    return NextResponse.json({ fields: rows[0]?.animal_card_fields ?? ["placement","foster_offers"] });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Couldn't load card settings." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { orgId } = await requireEffectiveOrg();
    const body = await req.json().catch(() => null);
    const fields = Array.isArray(body?.fields) ? body.fields : null;

    if (!fields || fields.some((f: unknown) => typeof f !== "string" || !ALLOWED.has(f))) {
      return NextResponse.json({ error: "Invalid card fields." }, { status: 400 });
    }

    const clean = [...new Set(fields)].slice(0, 4);
    await sql`update organizations set animal_card_fields = ${clean}, updated_at = now() where id = ${orgId}`;
    return NextResponse.json({ fields: clean });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Couldn't save card settings." }, { status: 500 });
  }
}
