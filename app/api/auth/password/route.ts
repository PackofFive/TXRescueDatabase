import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  destroySession,
  hashPassword,
  requireUser,
  verifyPassword,
  AuthError,
} from "@/lib/auth";
import {
  createPasswordResetToken,
  getClientIp,
  getUserAgent,
  normalizeEmail,
  sha256,
  validateNewPassword,
} from "@/lib/account-security";
import { sendPasswordResetEmail } from "@/lib/email";

export const runtime = "edge";

const GENERIC_RESET_MESSAGE =
  "If that email belongs to a Pack of Five account, a secure reset link has been sent.";

function response(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return response({ error: "Request rejected." }, 403);

  const body = await request.json().catch(() => null);
  const action = body?.action;

  try {
    if (action === "request_reset") return requestReset(request, body);
    if (action === "reset_password") return resetPassword(request, body);
    if (action === "change_password") return changePassword(request, body);

    return response({ error: "Choose a valid password action." }, 400);
  } catch (error) {
    if (error instanceof AuthError) {
      return response({ error: error.message }, error.status);
    }

    console.error("POST /api/auth/password failed:", error);
    return response({ error: "The password request could not be completed." }, 500);
  }
}

async function requestReset(request: NextRequest, body: Record<string, unknown>) {
  const email = normalizeEmail(body?.email);
  if (!email) return response({ message: GENERIC_RESET_MESSAGE });

  const emailHash = await sha256(email);
  const ipHash = await sha256(getClientIp(request));
  const recent = (await sql`
    select
      count(*) filter (where email_hash = ${emailHash})::int as email_count,
      count(*) filter (where ip_hash = ${ipHash})::int as ip_count
    from account_security_events
    where event_type = 'password_reset_requested'
      and created_at > now() - interval '1 hour'
  `)[0] as { email_count?: number; ip_count?: number } | undefined;

  if ((recent?.email_count ?? 0) >= 3 || (recent?.ip_count ?? 0) >= 10) {
    return response({ message: GENERIC_RESET_MESSAGE });
  }

  const user = (await sql`
    select id, email
    from users
    where lower(email) = ${email}
    limit 1
  `)[0] as { id: string; email: string } | undefined;

  await sql`
    insert into account_security_events (
      user_id, email_hash, event_type, ip_hash, user_agent
    ) values (
      ${user?.id ?? null}, ${emailHash}, 'password_reset_requested',
      ${ipHash}, ${getUserAgent(request)}
    )
  `;

  if (!user) return response({ message: GENERIC_RESET_MESSAGE });

  const rawToken = createPasswordResetToken();
  const tokenHash = await sha256(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await sql`
    update password_reset_tokens
    set used_at = now()
    where user_id = ${user.id}
      and used_at is null
  `;

  await sql`
    insert into password_reset_tokens (
      user_id, token_hash, expires_at, requested_ip_hash
    ) values (
      ${user.id}, ${tokenHash}, ${expiresAt.toISOString()}, ${ipHash}
    )
  `;

  const resetUrl = new URL("/reset-password", request.nextUrl.origin);
  resetUrl.searchParams.set("token", rawToken);

  try {
    await sendPasswordResetEmail(user.email, resetUrl.toString(), expiresAt);
  } catch (error) {
    console.error("Password reset delivery failed:", error);
  }

  return response({ message: GENERIC_RESET_MESSAGE });
}

async function resetPassword(request: NextRequest, body: Record<string, unknown>) {
  const token = typeof body?.token === "string" ? body.token.trim() : "";
  const passwordError = validateNewPassword(body?.newPassword);

  if (!token) return response({ error: "This reset link is invalid or expired." }, 400);
  if (passwordError) return response({ error: passwordError }, 400);

  const tokenHash = await sha256(token);
  const passwordHash = await hashPassword(String(body.newPassword));
  const ipHash = await sha256(getClientIp(request));
  const changed = await sql`
    with valid_token as (
      update password_reset_tokens
      set used_at = now()
      where token_hash = ${tokenHash}
        and used_at is null
        and expires_at > now()
      returning user_id
    ), updated_user as (
      update users
      set password_hash = ${passwordHash},
          password_changed_at = now(),
          session_version = session_version + 1
      from valid_token
      where users.id = valid_token.user_id
      returning users.id
    )
    insert into account_security_events (
      user_id, event_type, ip_hash, user_agent
    )
    select id, 'password_reset_completed', ${ipHash}, ${getUserAgent(request)}
    from updated_user
    returning user_id
  `;

  if (!changed[0]) {
    await sql`
      insert into account_security_events (
        event_type, ip_hash, user_agent
      ) values (
        'password_reset_rejected', ${ipHash}, ${getUserAgent(request)}
      )
    `;
    return response({ error: "This reset link is invalid or expired." }, 400);
  }

  await destroySession();
  return response({ message: "Your password has been reset. Sign in with your new password." });
}

async function changePassword(request: NextRequest, body: Record<string, unknown>) {
  const session = await requireUser();
  const currentPassword =
    typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const passwordError = validateNewPassword(body?.newPassword);

  if (!currentPassword) return response({ error: "Enter your current password." }, 400);
  if (passwordError) return response({ error: passwordError }, 400);
  if (currentPassword === body.newPassword) {
    return response({ error: "Choose a password you have not just been using." }, 400);
  }

  const user = (await sql`
    select password_hash
    from users
    where id = ${session.id}
    limit 1
  `)[0] as { password_hash: string } | undefined;

  if (!user || !(await verifyPassword(currentPassword, user.password_hash))) {
    return response({ error: "Your current password is incorrect." }, 401);
  }

  const passwordHash = await hashPassword(String(body.newPassword));
  const ipHash = await sha256(getClientIp(request));

  await sql`
    update users
    set password_hash = ${passwordHash},
        password_changed_at = now(),
        session_version = session_version + 1
    where id = ${session.id}
  `;

  await sql`
    update password_reset_tokens
    set used_at = now()
    where user_id = ${session.id}
      and used_at is null
  `;

  await sql`
    insert into account_security_events (
      user_id, event_type, ip_hash, user_agent
    ) values (
      ${session.id}, 'password_changed', ${ipHash}, ${getUserAgent(request)}
    )
  `;

  await destroySession();
  return response({
    message: "Your password was changed. For security, sign in again on this device.",
  });
}
