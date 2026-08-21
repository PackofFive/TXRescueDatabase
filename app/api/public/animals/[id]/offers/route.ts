import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: animalId } = await params;
    const body = await req.json().catch(() => null);
    const { offerType, contactName, contactEmail, contactPhone, city, postalCode, availability, householdInfo, message } = body ?? {};
    const valid = ["foster","transport","medical_support","donation","other"];

    if (!valid.includes(offerType)) return NextResponse.json({ error: "Please choose how you can help." }, { status: 400 });
    if (!contactName?.trim() || !contactEmail?.trim() || !contactPhone?.trim()) {
      return NextResponse.json({ error: "Name, email, and phone are required." }, { status: 400 });
    }

    const available = await sql`select id from animals where id=${animalId} and public_share_enabled=true limit 1`;
    if (!available[0]) return NextResponse.json({ error: "Animal profile is not available." }, { status: 404 });

    const rows = await sql`
      insert into animal_help_offers
        (animal_id, offer_type, contact_name, contact_email, contact_phone, city, postal_code, availability, household_info, message)
      values
        (${animalId}, ${offerType}, ${contactName.trim()}, ${contactEmail.trim()}, ${contactPhone.trim()},
         ${city || null}, ${postalCode || null}, ${availability || null}, ${householdInfo || null}, ${message || null})
      returning id, status, created_at
    `;
    return NextResponse.json({ offer: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("POST animal help offer failed:", err);
    return NextResponse.json({ error: "Couldn't submit your offer to help." }, { status: 500 });
  }
}
