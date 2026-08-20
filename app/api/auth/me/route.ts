import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();

    if (
      !session ||
      session.status !== "approved"
    ) {
      return NextResponse.json(
        {
          user: null,
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
    }

    /*
      Resolve organization identity from orgId.

      This works for:
      - normal rescue/shelter accounts
      - Admin Test Mode, because the selected test
        organization is stored as orgId in the admin session
    */

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

    return NextResponse.json(
      {
        user: {
          id: session.id,
          email: session.email,
          role: session.role,
          orgId: session.orgId,
          orgName,
          status: session.status,
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
      {
        user: null,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
