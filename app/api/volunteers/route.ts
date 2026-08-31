import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const STATUSES = new Set(["pending", "approved", "inactive", "declined"]);
const CHECK_STATUSES = new Set(["not_started", "pending", "cleared", "flagged"]);

async function requireOrganizationSession() {
  const session = await getSession();
  if (!session || session.status !== "approved" || !session.orgId) return null;
  return session;
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function skillsFrom(value: unknown) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(clean).filter(Boolean))].slice(0, 25);
}

export async function GET() {
  try {
    const session = await requireOrganizationSession();
    if (!session) {
      return NextResponse.json({ error: "Organization access required." }, { status: 401 });
    }

    const volunteers = await sql`
      select
        relationship.id,
        relationship.volunteer_id,
        relationship.status,
        relationship.role_title,
        relationship.skills,
        relationship.availability_notes,
        relationship.background_check_status,
        relationship.approved_at,
        relationship.created_at,
        profile.full_name,
        profile.email,
        profile.phone,
        profile.city,
        profile.state
      from volunteer_organization_relationships relationship
      join volunteer_profiles profile on profile.id = relationship.volunteer_id
      where relationship.organization_id = ${session.orgId}
      order by
        case relationship.status
          when 'pending' then 0
          when 'approved' then 1
          when 'inactive' then 2
          else 3
        end,
        profile.full_name asc
    `;

    return NextResponse.json({ volunteers });
  } catch (error) {
    console.error("GET /api/volunteers failed:", error);
    return NextResponse.json({ error: "Couldn't load volunteers." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireOrganizationSession();
    if (!session) {
      return NextResponse.json({ error: "Organization access required." }, { status: 401 });
    }

    const body = await req.json();
    const fullName = clean(body?.fullName);
    const email = clean(body?.email).toLowerCase();
    const phone = clean(body?.phone);
    const roleTitle = clean(body?.roleTitle);
    const availabilityNotes = clean(body?.availabilityNotes);
    const skills = skillsFrom(body?.skills);

    if (!fullName || !email) {
      return NextResponse.json({ error: "Volunteer name and email are required." }, { status: 400 });
    }

    const profileRows = await sql`
      insert into volunteer_profiles (full_name, email, phone)
      values (${fullName}, ${email}, ${phone || null})
      on conflict (lower(email)) where email is not null and btrim(email) <> ''
      do update set
        full_name = excluded.full_name,
        phone = coalesce(nullif(excluded.phone, ''), volunteer_profiles.phone),
        updated_at = now()
      returning id
    `;

    const volunteerId = String(profileRows[0].id);
    const relationships = await sql`
      insert into volunteer_organization_relationships (
        volunteer_id,
        organization_id,
        role_title,
        skills,
        availability_notes
      )
      values (
        ${volunteerId},
        ${session.orgId},
        ${roleTitle || null},
        ${skills},
        ${availabilityNotes || null}
      )
      on conflict (volunteer_id, organization_id) do nothing
      returning id
    `;

    if (!relationships[0]) {
      return NextResponse.json(
        { error: "This person is already listed as a volunteer for your organization." },
        { status: 409 }
      );
    }

    return NextResponse.json({ ok: true, relationshipId: relationships[0].id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/volunteers failed:", error);
    return NextResponse.json({ error: "Couldn't add the volunteer." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireOrganizationSession();
    if (!session) {
      return NextResponse.json({ error: "Organization access required." }, { status: 401 });
    }

    const body = await req.json();
    const relationshipId = clean(body?.relationshipId);
    const status = clean(body?.status);
    const backgroundCheckStatus = clean(body?.backgroundCheckStatus);
    const roleTitle = clean(body?.roleTitle);
    const availabilityNotes = clean(body?.availabilityNotes);
    const skills = skillsFrom(body?.skills);

    if (!relationshipId || !STATUSES.has(status) || !CHECK_STATUSES.has(backgroundCheckStatus)) {
      return NextResponse.json({ error: "Valid volunteer status information is required." }, { status: 400 });
    }

    const rows = await sql`
      update volunteer_organization_relationships
      set
        status = ${status},
        role_title = ${roleTitle || null},
        skills = ${skills},
        availability_notes = ${availabilityNotes || null},
        background_check_status = ${backgroundCheckStatus},
        approved_at = case
          when ${status} = 'approved' then coalesce(approved_at, now())
          else approved_at
        end,
        updated_at = now()
      where id = ${relationshipId}
        and organization_id = ${session.orgId}
      returning id
    `;

    if (!rows[0]) {
      return NextResponse.json({ error: "Volunteer record not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PATCH /api/volunteers failed:", error);
    return NextResponse.json({ error: "Couldn't update the volunteer." }, { status: 500 });
  }
}
