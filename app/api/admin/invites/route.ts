import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdminFresh, AuthError } from "@/lib/auth";

export const runtime = "edge";

// Admin-side of "self-signup with admin approval": an admin can either
// (a) pre-invite an org by email so they know to sign up, tracked here
//     for visibility, or
// (b) approve a 'pending' user account after they've self-signed-up
//     (see PATCH below).
//
// NOTE: sending the actual invite email isn't wired up here — that
// needs an email provider (e.g. Resend, Postmark). This route creates
// the invite record; adding the send-email call is a small follow-up
// once you've picked a provider.
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminFresh();
    const body = await req.json().catch(() => null);
    const { email, orgId } = body ?? {};
    if (!email) return NextResponse.json({ error: "email is required." }, { status: 400 });

    const rows = await sql`
      insert into invites (email, org_id, invited_by, status)
      values (${email}, ${orgId ?? null}, ${admin.id}, 'sent')
      returning id, email, status, created_at
    `;
    return NextResponse.json({ invite: rows[0] });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

export async function GET() {
  try {
    await requireAdminFresh();
    const rows = await sql`
      select id, email, org_id, status, created_at from invites order by created_at desc
    `;
    return NextResponse.json({ invites: rows });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
