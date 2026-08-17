import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const runtime = "edge";

// Self-signup: creates a 'pending' user account tied to an existing
// organization record. The account cannot sign in successfully (see
// login/route.ts, which checks status) until an admin approves it
// from the Admin Queue.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { email, password, orgId } = body ?? {};

  if (!email || !password || !orgId) {
    return NextResponse.json({ error: "email, password, and orgId are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const org = await sql`select id from organizations where id = ${orgId}`;
  if (org.length === 0) {
    return NextResponse.json({ error: "Organization not found." }, { status: 404 });
  }

  const existing = await sql`select id from users where email = ${email}`;
  if (existing.length > 0) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const rows = await sql`
    insert into users (email, password_hash, role, org_id, status)
    values (${email}, ${passwordHash}, 'org', ${orgId}, 'pending')
    returning id, email, status
  `;

  return NextResponse.json({
    message: "Account created. An admin will review and approve your access.",
    user: rows[0],
  });
}
