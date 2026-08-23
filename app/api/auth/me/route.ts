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
        { headers: { "Cache-Control": "no-store" } }
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

      orgName = rows[0]?.name
        ? String(rows[0].name)
        : null;
    }

    /*
      One Pack of Five account can have access to multiple portals.

      The existing session.role remains in place for backward
      compatibility, but portal access is resolved independently.
    */

    const availablePortals: string[] = [];

    if (session.role === "admin") {
      availablePortals.push("admin");

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

    /*
      FOSTER ACCESS

      Foster profiles may have been created before a Pack of Five
      account was linked to them. Because the invitation workflow
      is email-based, we resolve the foster identity in this order:

      1. foster_profiles.user_id matches the signed-in user
      2. otherwise foster_profiles.email matches the signed-in email

      If the email-matched profile has no user_id yet, we safely
      attach it to this Pack of Five user account.

      Foster Portal access is granted only when that foster profile
      has at least one APPROVED organization relationship.
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
          fosterId =
            String(fosterProfile.id);

          /*
            Link an invitation-created foster profile to the
            signed-in Pack of Five account the first time the
            matching user signs in.
          */
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
        Foster access must never prevent an existing rescue/admin
        account from loading.
      */
      console.error(
        "Foster portal access lookup failed:",
        fosterErr
      );
    }

    /*
      PET OWNER ACCESS

      Not enabled yet. When the Pet Owner data model is added,
      this same endpoint should append "pet-owner" without
      replacing any existing portal access.
    */

    return NextResponse.json(
      {
        user: {
          id: session.id,
          email: session.email,

          /*
            Keep role/status for existing code until the rest of
            the app is migrated away from single-role checks.
          */
          role: session.role,
          roles: [session.role],

          orgId: session.orgId,
          orgName,

          fosterId,

          status: session.status,

          /*
            Examples:
            ["organization"]
            ["foster"]
            ["organization", "foster"]
            ["admin", "organization", "foster"]

            Pet Owner can be added later without changing identity.
          */
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
