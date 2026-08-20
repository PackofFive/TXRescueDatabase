import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin, AuthError, authCookieNames } from "@/lib/auth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const TEST_COOKIE_MAX_AGE = 60 * 60 * 8;

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const orgId = req.cookies.get(authCookieNames.adminTestOrg)?.value ?? null;

    if (!orgId) {
      return NextResponse.json(
        { organization: null },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const rows = await sql`
      select id, name, city, county
      from organizations
      where id = ${orgId}
      limit 1
    `;

    if (!rows[0]) {
      const response = NextResponse.json(
        { organization: null },
        { headers: { "Cache-Control": "no-store" } }
      );
      response.cookies.delete(authCookieNames.adminTestOrg);
      return response;
    }

    return NextResponse.json(
      { organization: rows[0] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status, headers: { "Cache-Control": "no-store" } }
      );
    }

    console.error("GET /api/admin/test-org failed:", err);
    return NextResponse.json(
      { error: "Couldn't load test organization." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json().catch(() => null);
    const orgId = body?.orgId;

    if (!orgId || typeof orgId !== "string") {
      return NextResponse.json({ error: "orgId is required." }, { status: 400 });
    }

    const rows = await sql`
      select id, name, city, county
      from organizations
      where id = ${orgId}
      limit 1
    `;

    if (!rows[0]) {
      return NextResponse.json({ error: "Organization not found." }, { status: 404 });
    }

    const response = NextResponse.json(
      { organization: rows[0] },
      { headers: { "Cache-Control": "no-store" } }
    );

    response.cookies.set(authCookieNames.adminTestOrg, orgId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: TEST_COOKIE_MAX_AGE,
    });

    return response;
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    console.error("POST /api/admin/test-org failed:", err);
    return NextResponse.json(
      { error: "Couldn't start Rescue Manager test mode." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await requireAdmin();

    const response = NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } }
    );
    response.cookies.delete(authCookieNames.adminTestOrg);
    return response;
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json(
      { error: "Couldn't exit test mode." },
      { status: 500 }
    );
  }
}
