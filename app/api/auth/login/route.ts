import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import { getClientIp, getUserAgent, normalizeEmail, sha256 } from "@/lib/account-security";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { password } = body ?? {};
  const email = normalizeEmail(body?.email);
  if (!email || typeof password !== "string" || !password) {
    return NextResponse.json({ error: "email and password are required." }, { status: 400 });
  }

  const emailHash = await sha256(email);
  const ipHash = await sha256(getClientIp(req));
  const recentFailures = (await sql`
    select count(*)::int as attempts
    from account_security_events
    where event_type = 'login_failed'
      and email_hash = ${emailHash}
      and ip_hash = ${ipHash}
      and created_at > now() - interval '15 minutes'
  `)[0] as { attempts?: number } | undefined;

  if ((recentFailures?.attempts ?? 0) >= 8) {
    return NextResponse.json(
      { error: "Too many sign-in attempts. Wait 15 minutes and try again." },
      { status: 429 }
    );
  }

  const rows = await sql`
    select id, email, password_hash, role, org_id, status, session_version
    from users where lower(email) = ${email}
  `;
  const user = rows[0] as
    | { id: string; email: string; password_hash: string; role: "org" | "admin"; org_id: string | null; status: string; session_version: number }
    | undefined;

  // Deliberately vague error for both "no such user" and "wrong password" —
  // don't leak which emails have accounts.
  const invalidCreds = () => NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  const valid = user ? await verifyPassword(password, user.password_hash) : false;
  if (!user || !valid) {
    await sql`
      insert into account_security_events (
        user_id, email_hash, event_type, ip_hash, user_agent
      ) values (
        ${user?.id ?? null}, ${emailHash}, 'login_failed',
        ${ipHash}, ${getUserAgent(req)}
      )
    `;
    return invalidCreds();
  }

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
    sessionVersion: Number(user.session_version),
  });

  await sql`
    insert into account_security_events (
      user_id, email_hash, event_type, ip_hash, user_agent
    ) values (
      ${user.id}, ${emailHash}, 'login_succeeded',
      ${ipHash}, ${getUserAgent(req)}
    )
  `;

  return NextResponse.json({ id: user.id, email: user.email, role: user.role, orgId: user.org_id });
}
