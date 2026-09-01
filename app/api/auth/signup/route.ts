import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { normalizeEmail, validateNewPassword } from "@/lib/account-security";

export const runtime = "edge";

// Self-signup: creates a 'pending' user account tied to an existing
// organization record. The account cannot sign in successfully (see
// login/route.ts, which checks status) until an admin approves it
// from the Admin Queue.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { password, orgId } = body ?? {};
  const email = normalizeEmail(body?.email);

  if (!email || !password || !orgId) {
    return NextResponse.json({ error: "email, password, and orgId are required." }, { status: 400 });
  }
  const passwordError = validateNewPassword(password);
  if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

  const org = await sql`select id from organizations where id = ${orgId}`;
  if (org.length === 0) {
    return NextResponse.json({ error: "Organization not found." }, { status: 404 });
  }

  const existing = await sql`select id from users where lower(email) = ${email}`;
  if (existing.length > 0) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(String(password));
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
