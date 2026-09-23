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
    let requestingOrgId: string | null = null;
    let requestingUserId: string | null = null;
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
      requestingOrgId = user.orgId;
      requestingUserId = user.id;
    }
    if (offerType === "rescue_interest" && !organizationName?.trim()) {
      return NextResponse.json({ error: "Rescue organization name is required for rescue and tag offers." }, { status: 400 });
    }

    const available = await sql`
      select animal.id, animal.current_org_id, organization.org_type
      from animals animal
      join organizations organization on organization.id = animal.current_org_id
      where animal.id=${animalId} and animal.public_share_enabled=true
      limit 1
    `;
    if (!available[0]) return NextResponse.json({ error: "Animal profile is not available." }, { status: 404 });
    if (offerType === "tag_request") {
      if (!isShelterExpressOrganization(available[0].org_type)) {
        return NextResponse.json({ error: "Rescue tags can only be requested for Shelter Express animals." }, { status: 400 });
      }
      const approvedTag = await sql`
        select id
        from animal_help_offers
        where animal_id = ${animalId}::uuid
          and offer_type = 'tag_request'
          and status = 'accepted'
          and transfer_completed_at is null
        limit 1
      `;
      if (approvedTag[0]) {
        return NextResponse.json({ error: "This animal already has an approved rescue tag awaiting transfer. You may still offer foster, transport, or other help." }, { status: 409 });
      }
      const existing = await sql`
        select id, status
        from animal_help_offers
        where animal_id = ${animalId}::uuid
          and requesting_org_id = ${requestingOrgId}::uuid
          and offer_type = 'tag_request'
          and status not in ('declined', 'closed')
          and transfer_completed_at is null
        order by created_at desc
        limit 1
      `;
      if (existing[0]) {
        return NextResponse.json({ error: "Your rescue already has an active tag request for this animal. View it under Shelter Tags." }, { status: 409 });
      }
    }

    const rows = await sql`
      insert into animal_help_offers
        (animal_id, offer_type, contact_name, contact_email, contact_phone, city, postal_code, availability, household_info, message, requesting_org_id, requesting_user_id, source_org_id)
      values
        (${animalId}, ${offerType}, ${contactName.trim()}, ${contactEmail.trim()}, ${contactPhone.trim()},
         ${city || null}, ${postalCode || null}, ${availability || null},
         ${["rescue_interest", "tag_request"].includes(offerType) ? `Rescue organization: ${verifiedOrganizationName ?? organizationName.trim()}${householdInfo?.trim() ? `\n\n${householdInfo.trim()}` : ""}` : householdInfo || null},
         ${message || null}, ${requestingOrgId}::uuid, ${requestingUserId}::uuid,
         ${offerType === "tag_request" ? available[0].current_org_id : null}::uuid)
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
