import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.status !== "approved") {
      return NextResponse.json(
        { user: null },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    let orgName: string | null = null;

    if (session.orgId) {
      const rows = await sql`
        select name
        from organizations
        where id = ${session.orgId}
        limit 1
      `;

      orgName =
        rows[0]?.name
          ? String(rows[0].name)
          : null;
    }

    /*
      One Pack of Five account can access multiple portals.

      The legacy session.role remains for compatibility with
      existing Rescue Manager/Admin code, while availablePortals
      determines the full set of workspaces available to the user.
    */

    const availablePortals: string[] = [];
    const platformRows = await sql`
      select access_level
      from platform_administrator_memberships
      where user_id = ${session.id} and status = 'active'
      limit 1
    `;
    const platformAccessLevel = platformRows[0]?.access_level
      ? String(platformRows[0].access_level)
      : null;

    if (platformAccessLevel) {
      availablePortals.push("admin");
    }

    if (session.role === "admin") {
      if (session.orgId) {
        availablePortals.push("organization");
      }
    }

    if (
      session.role === "org" &&
      session.status === "approved"
    ) {
      availablePortals.push("organization");
    }

    if (session.orgId) {
      const shelterRows = await sql`
        select shelter_express_access
        from organization_memberships
        where org_id = ${session.orgId}::uuid
          and user_id = ${session.id}::uuid
          and status = 'active'
        limit 1
      `;

      if (Boolean(shelterRows[0]?.shelter_express_access)) {
        availablePortals.push("shelter");
      }
    }

    /*
      FOSTER ACCESS

      Foster profiles may have been created before a Pack of Five
      account was linked to them.

      Resolve by:
      1. user_id
      2. matching email when user_id is still null

      If an email match is found with no user_id, link it to the
      signed-in user account.

      Volunteer Portal access is granted only when the volunteer or foster has at
      least one approved organization relationship.
    */

    let fosterId: string | null = null;

    try {
      if (session.id && session.email) {
        const normalizedEmail =
          session.email.trim().toLowerCase();

        const fosterRows = await sql`
          select
            fp.id,
            fp.user_id,

            exists (
              select 1
              from foster_organization_relationships forr
              where
                forr.foster_id = fp.id
                and forr.status = 'approved'
            ) as has_approved_relationship

          from foster_profiles fp

          where
            fp.user_id = ${session.id}::uuid

            or (
              lower(fp.email) = ${normalizedEmail}
              and (
                fp.user_id is null
                or fp.user_id = ${session.id}::uuid
              )
            )

          order by
            case
              when fp.user_id = ${session.id}::uuid
                then 0
              else 1
            end,
            fp.created_at asc

          limit 1
        `;

        const fosterProfile =
          fosterRows[0] ?? null;

        if (fosterProfile?.id) {
          fosterId = String(
            fosterProfile.id
          );

          if (!fosterProfile.user_id) {
            await sql`
              update foster_profiles
              set
                user_id = ${session.id}::uuid,
                updated_at = now()
              where
                id = ${fosterId}
                and user_id is null
            `;
          }

          if (
            Boolean(
              fosterProfile.has_approved_relationship
            )
          ) {
            availablePortals.push("foster");
          }
        }
      }
    } catch (fosterErr) {
      /*
        Foster access must never prevent existing Rescue Manager
        or Admin access from loading.
      */
      console.error(
        "Volunteer Portal access lookup failed:",
        fosterErr
      );
    }

    /*
      VOLUNTEER ACCESS

      Volunteer profiles and rescue approvals remain separate from
      foster profiles. The existing internal "foster" portal key is
      retained temporarily so established /foster links and sessions
      continue to open the newly named Volunteer Portal.
    */

    let volunteerId: string | null = null;

    try {
      if (session.id && session.email) {
        const normalizedEmail = session.email.trim().toLowerCase();
        const volunteerRows = await sql`
          select
            profile.id,
            profile.user_id,
            exists (
              select 1
              from volunteer_organization_relationships relationship
              where relationship.volunteer_id = profile.id
                and relationship.status = 'approved'
                and relationship.portal_access_level <> 'none'
            ) as has_portal_access
          from volunteer_profiles profile
          where profile.user_id = ${session.id}::uuid
            or (
              lower(profile.email) = ${normalizedEmail}
              and (
                profile.user_id is null
                or profile.user_id = ${session.id}::uuid
              )
            )
          order by
            case when profile.user_id = ${session.id}::uuid then 0 else 1 end,
            profile.created_at asc
          limit 1
        `;

        const volunteerProfile = volunteerRows[0] ?? null;

        if (volunteerProfile?.id) {
          volunteerId = String(volunteerProfile.id);

          if (!volunteerProfile.user_id) {
            await sql`
              update volunteer_profiles
              set user_id = ${session.id}::uuid, updated_at = now()
              where id = ${volunteerId}::uuid and user_id is null
            `;
          }

          if (Boolean(volunteerProfile.has_portal_access)) {
            availablePortals.push("foster");
          }
        }
      }
    } catch (volunteerErr) {
      console.error("Volunteer access lookup failed:", volunteerErr);
    }

    /*
      PET OWNER ACCESS

      Pet Owner access is additive. A user receives the Pet Owner
      Portal only when a pet_owner_profiles record exists for the
      signed-in Pack of Five user.

      We intentionally do NOT create that profile automatically
      here because some Pack of Five users will only use Rescue
      Manager, Foster, or other portals.
    */

    let petOwnerId: string | null = null;

    try {
      if (session.id) {
        const ownerRows = await sql`
          select id
          from pet_owner_profiles
          where user_id = ${session.id}::uuid
          limit 1
        `;

        if (ownerRows[0]?.id) {
          petOwnerId = String(
            ownerRows[0].id
          );

          availablePortals.push(
            "pet-owner"
          );
        }
      }
    } catch (petOwnerErr) {
      /*
        Pet Owner access must never break an existing account.
      */
      console.error(
        "Pet Owner portal access lookup failed:",
        petOwnerErr
      );
    }

    return NextResponse.json(
      {
        user: {
          id: session.id,
          email: session.email,

          /*
            Keep legacy role fields for existing code.
          */
          role: session.role,
          roles: [session.role],

          orgId: session.orgId,
          orgName,

          fosterId,
          volunteerId,
          petOwnerId,

          status: session.status,
          platformAccessLevel,

          availablePortals: Array.from(
            new Set(availablePortals)
          ),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error(
      "GET /api/auth/me failed:",
      err
    );

    return NextResponse.json(
      { user: null },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
