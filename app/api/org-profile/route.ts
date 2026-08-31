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
        id,
        name,
        org_type,
        species,
        focus,
        specialty,
        c3_status,
        city,
        county,
        state,
        service_area,
        region,
        statewide,
        intake_status,
        intake_restrictions,
        intake_form_url,
        website,
        social_media,
        public_email,
        public_phone,
        resource_status,
        last_verified,
        updated_at
      from organizations
      where id = ${orgId}::uuid
      limit 1
    `;

    if (!rows[0]) {
      return NextResponse.json(
        { error: "Organization profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { organization: rows[0] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("GET /api/org-profile failed:", error);

    return NextResponse.json(
      { error: "Couldn't load the organization profile." },
      { status: 500 }
    );
  }
}
