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

    return NextResponse.json(
      {
        user: {
          id: session.id,
          email: session.email,
          role: session.role,
          roles: [session.role],
          orgId: session.orgId,
          orgName,
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
