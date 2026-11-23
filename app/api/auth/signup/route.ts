import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { createPasswordResetToken, getClientIp, normalizeEmail, sha256, validateNewPassword } from "@/lib/account-security";
import { sendPetOwnerSignupVerificationEmail } from "@/lib/email";

export const runtime = "edge";

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !origin || origin === request.nextUrl.origin;
}

// Self-signup: creates a 'pending' user account tied to an existing
// organization record. The account cannot sign in successfully (see
// login/route.ts, which checks status) until an admin approves it
// from the Admin Queue.
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Request rejected." }, { status: 403 });
  const body = await req.json().catch(() => null);
  const { password, orgId } = body ?? {};
  const email = normalizeEmail(body?.email);

  if (body?.accountType === "pet_owner") {
    if (body?.action === "verify") {
      const token = typeof body?.token === "string" ? body.token.trim() : "";
      if (!token) return NextResponse.json({ error: "This verification link is invalid or expired." }, { status: 400 });
      const tokenHash = await sha256(token);
      const rows = await sql`
        with verified as (
          update personal_account_signup_tokens
          set used_at = now()
          where token_hash = ${tokenHash}
            and used_at is null
            and expires_at > now()
          returning email, password_hash
        ), created as (
          insert into users (email, password_hash, role, org_id, status)
          select email, password_hash, 'org', null, 'approved'
          from verified
          on conflict do nothing
          returning id, email, role, org_id, status, session_version
        )
        select * from created
      `;
      const user = rows[0];
      if (!user) return NextResponse.json({ error: "This verification link is invalid, expired, or already used." }, { status: 400 });
      await createSession({ id: String(user.id), email: String(user.email), role: "org", orgId: null, status: "approved", sessionVersion: Number(user.session_version) });
      return NextResponse.json({ message: "Your email is verified and your Pet Owner login is ready." });
    }

    if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    const passwordError = validateNewPassword(password);
    if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });
    const requestIpHash = await sha256(getClientIp(req));
    const recentIpRequests = await sql`
      select count(*)::int as requests
      from personal_account_signup_tokens
      where requested_ip_hash = ${requestIpHash}
        and created_at > now() - interval '1 hour'
    `;
    if (Number(recentIpRequests[0]?.requests ?? 0) >= 10) {
      return NextResponse.json({ error: "Too many registration emails were requested. Wait one hour and try again." }, { status: 429 });
    }
    const existing = await sql`select id from users where lower(email) = ${email} limit 1`;
    if (existing[0]) return NextResponse.json({ error: "A Pack of Five account already uses this email. Sign in instead." }, { status: 409 });
    const recent = await sql`
      select id from personal_account_signup_tokens
      where lower(email) = ${email}
        and used_at is null
        and created_at > now() - interval '60 seconds'
      limit 1
    `;
    if (recent[0]) return NextResponse.json({ error: "A verification email was just sent. Wait one minute before requesting another." }, { status: 429 });

    const passwordHash = await hashPassword(String(password));
    const rawToken = createPasswordResetToken();
    const tokenHash = await sha256(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await sql`update personal_account_signup_tokens set used_at = now() where lower(email) = ${email} and used_at is null`;
    await sql`
      insert into personal_account_signup_tokens (email, password_hash, token_hash, expires_at, requested_ip_hash)
      values (${email}, ${passwordHash}, ${tokenHash}, ${expiresAt.toISOString()}, ${requestIpHash})
    `;
    const verificationUrl = new URL("/register/verify", req.nextUrl.origin);
    verificationUrl.searchParams.set("token", rawToken);
    try {
      await sendPetOwnerSignupVerificationEmail(email, verificationUrl.toString(), expiresAt);
    } catch (error) {
      await sql`update personal_account_signup_tokens set used_at = now() where token_hash = ${tokenHash}`;
      return NextResponse.json({ error: error instanceof Error ? error.message : "The verification email could not be delivered." }, { status: 503 });
    }
    return NextResponse.json({ message: "Check your email for a secure verification link. It expires after one hour." }, { status: 201 });
  }

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
