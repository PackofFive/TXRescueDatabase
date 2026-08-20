import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    const {
      organizationName,
      organizationType,
      city,
      county,
      state,
      website,
      socialUrl,
      contactName,
      contactEmail,
      contactPhone,
      description,
      relationship,
    } = body ?? {};

    if (!organizationName || typeof organizationName !== "string") {
      return NextResponse.json(
        { error: "Organization name is required." },
        { status: 400 }
      );
    }

    if (!contactEmail || typeof contactEmail !== "string") {
      return NextResponse.json(
        { error: "Contact email is required." },
        { status: 400 }
      );
    }

    if (!relationship || !["representative", "suggestion"].includes(relationship)) {
      return NextResponse.json(
        { error: "Please tell us whether you represent the organization or are suggesting it." },
        { status: 400 }
      );
    }

    const rows = await sql`
      insert into organization_requests
        (
          organization_name,
          organization_type,
          city,
          county,
          state,
          website,
          social_url,
          contact_name,
          contact_email,
          contact_phone,
          description,
          relationship,
          status
        )
      values
        (
          ${organizationName.trim()},
          ${organizationType || null},
          ${city || null},
          ${county || null},
          ${state || null},
          ${website || null},
          ${socialUrl || null},
          ${contactName || null},
          ${contactEmail.trim()},
          ${contactPhone || null},
          ${description || null},
          ${relationship},
          'pending'
        )
      returning id, organization_name, status, created_at
    `;

    return NextResponse.json({ request: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("POST /api/org-requests failed:", err);
    return NextResponse.json(
      { error: "Something went wrong submitting the organization request." },
      { status: 500 }
    );
  }
}
