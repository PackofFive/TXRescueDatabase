import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  requireAdmin,
  createSession,
  AuthError,
} from "@/lib/auth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// GET — returns the organization currently selected in the admin's JWT session.
export async function GET() {
  try {
    const session = await requireAdmin();

    if (!session.orgId) {
      return NextResponse.json(
        { organization: null },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const rows = await sql`
      select id, name, city, county
      from organizations
      where id = ${session.orgId}
      limit 1
    `;

    return NextResponse.json(
      { organization: rows[0] ?? null },
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

// POST — select a test organization by re-issuing the EXISTING admin session
// with a temporary orgId context. The user remains role=admin.
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json().catch(() => null);
    const orgId = body?.orgId;

    if (!orgId || typeof orgId !== "string") {
      return NextResponse.json(
        { error: "orgId is required." },
        { status: 400 }
      );
    }

    const rows = await sql`
      select id, name, city, county
      from organizations
      where id = ${orgId}
      limit 1
    `;

    if (!rows[0]) {
      return NextResponse.json(
        { error: "Organization not found." },
        { status: 404 }
      );
    }

    await createSession({
      ...session,
      orgId,
    });

    return NextResponse.json(
      { organization: rows[0] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status }
      );
    }

    console.error("POST /api/admin/test-org failed:", err);

    return NextResponse.json(
      { error: "Couldn't start Rescue Manager test mode." },
      { status: 500 }
    );
  }
}

// DELETE — exit test mode by re-issuing the admin session with orgId=null.
// This keeps the admin signed in.
export async function DELETE() {
  try {
    const session = await requireAdmin();

    await createSession({
      ...session,
      orgId: null,
    });

    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status }
      );
    }

    console.error("DELETE /api/admin/test-org failed:", err);

    return NextResponse.json(
      { error: "Couldn't exit test mode." },
      { status: 500 }
    );
  }
}
