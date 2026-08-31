import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const STATUSES = new Set(["pending", "approved", "inactive", "declined"]);
const CHECK_STATUSES = new Set(["not_started", "pending", "cleared", "flagged"]);
const ACCESS_LEVELS = new Set(["none", "viewer", "contributor", "coordinator"]);
const CAPACITY_STATUSES = new Set([
  "review_required",
  "available",
  "limited",
  "near_capacity",
  "at_capacity",
  "temporarily_unavailable",
]);
const CATEGORY_NAMES = new Set([
  "foster_care",
  "transport",
  "shelter_visits",
  "events_outreach",
  "photography_media",
  "fundraising_donations",
  "administrative_help",
  "medical_support",
  "volunteer_coordination",
]);
const CATEGORY_PERMISSIONS = new Set(["view", "contribute", "coordinate"]);
const CATEGORY_STATUSES = new Set(["pending", "approved", "suspended", "declined"]);

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

type CategoryInput = {
  category: string;
  status: string;
  permissionLevel: string;
};

function categoriesFrom(value: unknown): CategoryInput[] | null {
  if (!Array.isArray(value)) return [];

  const categories = value.map((item) => ({
    category: clean(item?.category),
    status: clean(item?.status),
    permissionLevel: clean(item?.permissionLevel),
  }));

  if (
    categories.some(
      (item) =>
        !CATEGORY_NAMES.has(item.category) ||
        !CATEGORY_STATUSES.has(item.status) ||
        !CATEGORY_PERMISSIONS.has(item.permissionLevel)
    ) ||
    new Set(categories.map((item) => item.category)).size !== categories.length
  ) {
    return null;
  }

  return categories;
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
        relationship.portal_access_level,
        relationship.verified_weekly_hours,
        relationship.capacity_status,
        relationship.capacity_reviewed_at,
        relationship.approved_at,
        relationship.created_at,
        profile.full_name,
        profile.email,
        profile.phone,
        profile.city,
        profile.state,
        profile.availability_status,
        profile.pause_new_assignments,
        profile.weekly_hours_capacity,
        coalesce(category_approvals.items, '[]'::json) as category_approvals
      from volunteer_organization_relationships relationship
      join volunteer_profiles profile on profile.id = relationship.volunteer_id
      left join lateral (
        select json_agg(
          json_build_object(
            'category', approval.category,
            'status', approval.status,
            'permissionLevel', approval.permission_level,
            'approvedAt', approval.approved_at
          )
          order by approval.category
        ) as items
        from volunteer_category_approvals approval
        where approval.relationship_id = relationship.id
      ) category_approvals on true
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
    const portalAccessLevel = clean(body?.portalAccessLevel);
    const capacityStatus = clean(body?.capacityStatus);
    const categories = categoriesFrom(body?.categories);
    const verifiedWeeklyHoursValue = Number(body?.verifiedWeeklyHours);
    const verifiedWeeklyHours =
      body?.verifiedWeeklyHours === "" || body?.verifiedWeeklyHours == null
        ? null
        : verifiedWeeklyHoursValue;

    if (
      !relationshipId ||
      !STATUSES.has(status) ||
      !CHECK_STATUSES.has(backgroundCheckStatus) ||
      !ACCESS_LEVELS.has(portalAccessLevel) ||
      !CAPACITY_STATUSES.has(capacityStatus) ||
      categories === null ||
      (verifiedWeeklyHours !== null &&
        (!Number.isInteger(verifiedWeeklyHours) || verifiedWeeklyHours < 0 || verifiedWeeklyHours > 168))
    ) {
      return NextResponse.json({ error: "Valid volunteer access and capacity information is required." }, { status: 400 });
    }

    if (status !== "approved" && portalAccessLevel !== "none") {
      return NextResponse.json(
        { error: "Only approved volunteers can receive Volunteer Portal access." },
        { status: 400 }
      );
    }

    if (
      categories.some(
        (item) =>
          item.status === "approved" &&
          item.permissionLevel === "coordinate" &&
          portalAccessLevel !== "coordinator"
      )
    ) {
      return NextResponse.json(
        { error: "Category coordination requires the Coordinator portal level." },
        { status: 400 }
      );
    }

    const rows = await sql`
      update volunteer_organization_relationships
      set
        status = ${status},
        role_title = ${roleTitle || null},
        skills = ${skills},
        availability_notes = ${availabilityNotes || null},
        background_check_status = ${backgroundCheckStatus},
        portal_access_level = ${portalAccessLevel},
        verified_weekly_hours = ${verifiedWeeklyHours},
        capacity_status = ${capacityStatus},
        capacity_reviewed_at = now(),
        capacity_reviewed_by = ${session.id}::uuid,
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

    for (const category of categories) {
      await sql`
        insert into volunteer_category_approvals (
          relationship_id,
          category,
          status,
          permission_level,
          approved_at,
          approved_by
        )
        values (
          ${relationshipId}::uuid,
          ${category.category},
          ${category.status},
          ${category.permissionLevel},
          case when ${category.status} = 'approved' then now() else null end,
          case when ${category.status} = 'approved' then ${session.id}::uuid else null end
        )
        on conflict (relationship_id, category)
        do update set
          status = excluded.status,
          permission_level = excluded.permission_level,
          approved_at = case
            when excluded.status = 'approved'
              then coalesce(volunteer_category_approvals.approved_at, now())
            else volunteer_category_approvals.approved_at
          end,
          approved_by = case
            when excluded.status = 'approved'
              then ${session.id}::uuid
            else volunteer_category_approvals.approved_by
          end,
          updated_at = now()
      `;
    }

    await sql`
      insert into audit_log (
        entity_type,
        entity_id,
        changed_by,
        field_name,
        new_value
      )
      values (
        'volunteer_relationship',
        ${relationshipId}::uuid,
        ${session.id}::uuid,
        'access_and_categories_updated',
        ${JSON.stringify({
          status,
          portalAccessLevel,
          capacityStatus,
          verifiedWeeklyHours,
          categories,
        })}
      )
    `;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PATCH /api/volunteers failed:", error);
    return NextResponse.json({ error: "Couldn't update the volunteer." }, { status: 500 });
  }
}
