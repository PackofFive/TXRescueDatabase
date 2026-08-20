import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import {
  requireAdmin,
  AuthError,
  authCookieNames,
} from "@/lib/auth";

export const runtime = "edge";

// GET — tells the UI whether the signed-in admin currently has a test org selected.
export async function GET() {
  try {
    await requireAdmin();
    const cookieStore = await cookies();
    const orgId = cookieStore.get(authCookieNames.adminTestOrg)?.value ?? null;

    if (!orgId) {
      return NextResponse.json({ organization: null });
    }

    const rows = await sql`
      select id, name, city, county
      from organizations
      where id = ${orgId}
      limit 1
    `;

    if (!rows[0]) {
      cookieStore.delete(authCookieNames.adminTestOrg);
      return NextResponse.json({ organization: null });
    }

    return NextResponse.json({ organization: rows[0] });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("GET /api/admin/test-org failed:", err);
    return NextResponse.json({ error: "Couldn't load test organization." }, { status: 500 });
  }
}

// POST — choose which organization the admin is temporarily testing as.
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

    const cookieStore = await cookies();
    cookieStore.set(authCookieNames.adminTestOrg, orgId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return NextResponse.json({ organization: rows[0] });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("POST /api/admin/test-org failed:", err);
    return NextResponse.json({ error: "Couldn't start Rescue Manager test mode." }, { status: 500 });
  }
}

// DELETE — exit test mode without signing the admin out.
export async function DELETE() {
  try {
    await requireAdmin();
    const cookieStore = await cookies();
    cookieStore.delete(authCookieNames.adminTestOrg);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Couldn't exit test mode." }, { status: 500 });
  }
}
