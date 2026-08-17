import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdminFresh, AuthError } from "@/lib/auth";

export const runtime = "edge";

// PATCH { action: 'approve' | 'reject' } — the other half of
// self-signup-with-admin-approval: a user who signed up via
// /api/auth/signup sits in status='pending' until an admin approves
// them here. Rejected users can never log in (see login/route.ts).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminFresh();
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const action = body?.action;
    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "action must be 'approve' or 'reject'." }, { status: 400 });
    }
    const newStatus = action === "approve" ? "approved" : "rejected";
    const rows = await sql`
      update users set status = ${newStatus} where id = ${id} and status = 'pending'
      returning id, email, status
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found or already reviewed." }, { status: 404 });
    }
    return NextResponse.json({ user: rows[0] });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

// List all pending user accounts awaiting approval.
export async function GET() {
  try {
    await requireAdminFresh();
    const rows = await sql`
      select u.id, u.email, u.org_id, o.name as org_name, u.created_at
      from users u
      left join organizations o on o.id = u.org_id
      where u.status = 'pending'
      order by u.created_at asc
    `;
    return NextResponse.json({ pendingUsers: rows });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
