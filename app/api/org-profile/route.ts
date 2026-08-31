import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

async function resolveAccess(
  session: Awaited<ReturnType<typeof requireEffectiveOrg>>["session"],
  orgId: string
) {
  if (session.role === "admin") {
    return {
      level: "platform_admin",
      canEditOrganizationProfile: true,
      canManageOrganizationAccess: true,
    };
  }

  const membershipRows = await sql`
    select access_level
    from organization_memberships
    where org_id = ${orgId}::uuid
      and user_id = ${session.id}::uuid
      and status = 'active'
    limit 1
  `;

  const level = membershipRows[0]?.access_level
    ? String(membershipRows[0].access_level)
    : null;

  return {
    level,
    canEditOrganizationProfile:
      level === "owner" || level === "administrator",
    canManageOrganizationAccess: level === "owner",
  };
}

export async function GET(request: NextRequest) {
  try {
    const { session, orgId } = await requireEffectiveOrg();

    const access = await resolveAccess(session, orgId);

    if (request.nextUrl.searchParams.get("team") === "true") {
      if (!access.canManageOrganizationAccess) {
        throw new AuthError(
          "Organization Owner access is required to manage team access.",
          403
        );
      }

      const members = await sql`
        select
          membership.id,
          membership.user_id,
          membership.access_level,
          membership.status,
          membership.granted_at,
          membership.updated_at,
          membership.suspended_at,
          membership.removed_at,
          account.email
        from organization_memberships membership
        join users account on account.id = membership.user_id
        where membership.org_id = ${orgId}::uuid
        order by
          case membership.status when 'active' then 0 else 1 end,
          case membership.access_level
            when 'owner' then 0
            when 'administrator' then 1
            when 'contributor' then 2
            else 3
          end,
          lower(account.email)
      `;

      const audit = await sql`
        select
          entry.id,
          entry.action,
          entry.previous_access_level,
          entry.new_access_level,
          entry.reason,
          entry.created_at,
          affected.email as affected_email,
          actor.email as actor_email
        from organization_access_audit entry
        left join users affected on affected.id = entry.affected_user_id
        left join users actor on actor.id = entry.actor_user_id
        where entry.org_id = ${orgId}::uuid
        order by entry.created_at desc
        limit 50
      `;

      return NextResponse.json(
        { access, members, audit },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

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
      {
        organization: rows[0],
        access,
      },
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

export async function PATCH(request: NextRequest) {
  try {
    const { session, orgId } = await requireEffectiveOrg();
    const access = await resolveAccess(session, orgId);

    if (!access.canManageOrganizationAccess) {
      throw new AuthError(
        "Organization Owner access is required to manage team access.",
        403
      );
    }

    const body = await request.json().catch(() => null);
    const membershipId = String(body?.membershipId ?? "").trim();
    const action = String(body?.action ?? "").trim();
    const newAccessLevel = body?.newAccessLevel
      ? String(body.newAccessLevel).trim()
      : null;
    const reason = body?.reason ? String(body.reason).trim() : null;

    if (!membershipId) {
      return NextResponse.json(
        { error: "Choose a team member." },
        { status: 400 }
      );
    }

    if (!["change_level", "suspend", "restore", "remove", "transfer_ownership"].includes(action)) {
      return NextResponse.json(
        { error: "Choose a valid access action." },
        { status: 400 }
      );
    }

    if (["suspend", "remove", "transfer_ownership"].includes(action) && !reason) {
      return NextResponse.json(
        { error: "A reason is required for this security-sensitive action." },
        { status: 400 }
      );
    }

    const rows = await sql`
      select pof_manage_organization_access(
        ${orgId}::uuid,
        ${session.id}::uuid,
        ${membershipId}::uuid,
        ${action},
        ${newAccessLevel},
        ${reason}
      ) as result
    `;

    return NextResponse.json({ result: rows[0]?.result ?? { ok: true } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("PATCH /api/org-profile failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Couldn't update organization access.",
      },
      { status: 500 }
    );
  }
}
