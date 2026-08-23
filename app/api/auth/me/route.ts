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
      Foster portal access is granted when this Pack of Five
      user account is linked to a foster profile that has at
      least one approved organization relationship.

      A foster identity is rescue-independent, so this does
      not depend on session.orgId.
    */

    let fosterId: string | null = null;

    const fosterRows = await sql`
      select
        fp.id

      from foster_profiles fp

      where
        fp.user_id = ${session.id}

        and exists (
          select 1

          from foster_organization_relationships forr

          where
            forr.foster_id = fp.id
            and forr.status = 'approved'
        )

      limit 1
    `;

    if (fosterRows[0]?.id) {
      fosterId =
        String(
          fosterRows[0].id
        );

      availablePortals.push(
        "foster"
      );
    }

    return NextResponse.json(
      {
        user: {
          id: session.id,
          email: session.email,
          role: session.role,
          roles: [session.role],
          orgId: session.orgId,
          orgName,
          fosterId,
          status: session.status,
          availablePortals,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("GET /api/auth/me failed:", err);

    return NextResponse.json(
      { user: null },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
