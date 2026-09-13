import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { AuthError, requireUser } from "@/lib/auth";
import { isShelterExpressOrganization } from "@/lib/organization-types";

export const runtime = "edge";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: animalId } = await params;
    const body = await req.json().catch(() => null);
    const { offerType, organizationName, contactName, contactEmail, contactPhone, city, postalCode, availability, householdInfo, message } = body ?? {};
    const valid = ["rescue_interest","tag_request","foster","transport","medical_support","donation","other"];

    if (!valid.includes(offerType)) return NextResponse.json({ error: "Please choose how you can help." }, { status: 400 });
    if (!contactName?.trim() || !contactEmail?.trim() || !contactPhone?.trim()) {
      return NextResponse.json({ error: "Name, email, and phone are required." }, { status: 400 });
    }
    let verifiedOrganizationName: string | null = null;
    if (offerType === "tag_request") {
      const user = await requireUser();
      if (!user.orgId) throw new AuthError("A Rescue Manager organization is required to request a rescue tag.", 403);
      const organizationRows = await sql`
        select name, org_type
        from organizations
        where id = ${user.orgId}::uuid and archived_at is null
        limit 1
      `;
      const organization = organizationRows[0];
      if (!organization || isShelterExpressOrganization(organization.org_type)) {
        throw new AuthError("Only an approved Rescue Manager organization can request a rescue tag.", 403);
      }
      verifiedOrganizationName = String(organization.name);
    }
    if (offerType === "rescue_interest" && !organizationName?.trim()) {
      return NextResponse.json({ error: "Rescue organization name is required for rescue and tag offers." }, { status: 400 });
    }

    const available = await sql`select id from animals where id=${animalId} and public_share_enabled=true limit 1`;
    if (!available[0]) return NextResponse.json({ error: "Animal profile is not available." }, { status: 404 });

    const rows = await sql`
      insert into animal_help_offers
        (animal_id, offer_type, contact_name, contact_email, contact_phone, city, postal_code, availability, household_info, message)
      values
        (${animalId}, ${offerType}, ${contactName.trim()}, ${contactEmail.trim()}, ${contactPhone.trim()},
         ${city || null}, ${postalCode || null}, ${availability || null},
         ${["rescue_interest", "tag_request"].includes(offerType) ? `Rescue organization: ${verifiedOrganizationName ?? organizationName.trim()}${householdInfo?.trim() ? `\n\n${householdInfo.trim()}` : ""}` : householdInfo || null},
         ${message || null})
      returning id, status, created_at
    `;
    return NextResponse.json({ offer: rows[0] }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("POST animal help offer failed:", err);
    return NextResponse.json({ error: "Couldn't submit your offer to help." }, { status: 500 });
  }
}
