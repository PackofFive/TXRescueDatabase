import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { email, password } = body ?? {};
  if (!email || !password) {
    return NextResponse.json({ error: "email and password are required." }, { status: 400 });
  }

  const rows = await sql`
    select id, email, password_hash, role, org_id, status
    from users where email = ${email}
  `;
  const user = rows[0] as
    | { id: string; email: string; password_hash: string; role: "org" | "admin"; org_id: string | null; status: string }
    | undefined;

  // Deliberately vague error for both "no such user" and "wrong password" —
  // don't leak which emails have accounts.
  const invalidCreds = () => NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  if (!user) return invalidCreds();
  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return invalidCreds();

  if (user.status !== "approved") {
    return NextResponse.json(
      { error: "Your account is pending admin approval." },
      { status: 403 }
    );
  }

  await createSession({
    id: user.id,
    email: user.email,
    role: user.role,
    orgId: user.org_id,
    status: user.status as "approved",
  });

  return NextResponse.json({ id: user.id, email: user.email, role: user.role, orgId: user.org_id });
}
