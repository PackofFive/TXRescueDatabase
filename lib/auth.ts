import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { sql } from "./db";

let cachedSecretKey: Uint8Array | null = null;
let cachedHmacKey: CryptoKey | null = null;

function getSecretKey(): Uint8Array {
  if (cachedSecretKey) return cachedSecretKey;

  const SESSION_SECRET = process.env.SESSION_SECRET;
  if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not set. See README.md for setup steps.");
  }

  cachedSecretKey = new TextEncoder().encode(SESSION_SECRET);
  return cachedSecretKey;
}

const COOKIE_NAME = "txard_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 14;

function encodeBase64Url(value: string | Uint8Array): string {
  const bytes =
    typeof value === "string"
      ? new TextEncoder().encode(value)
      : value;

  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
}

function decodeBase64Url(value: string): Uint8Array {
  const normalized = value
    .replaceAll("-", "+")
    .replaceAll("_", "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "="
  );
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function getHmacKey(): Promise<CryptoKey> {
  if (cachedHmacKey) return cachedHmacKey;

  cachedHmacKey = await crypto.subtle.importKey(
    "raw",
    getSecretKey().slice().buffer as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );

  return cachedHmacKey;
}

async function createSessionToken(user: SessionUser): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = encodeBase64Url(
    JSON.stringify({
      ...user,
      iat: now,
      exp: now + SESSION_DURATION_SECONDS,
    })
  );
  const unsignedToken = `${header}.${payload}`;
  const signature = await crypto.subtle.sign(
    "HMAC",
    await getHmacKey(),
    new TextEncoder().encode(unsignedToken)
  );

  return `${unsignedToken}.${encodeBase64Url(new Uint8Array(signature))}`;
}

async function readSessionToken(token: string): Promise<SessionUser> {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid session token.");

  const [headerPart, payloadPart, signaturePart] = parts;
  const header = JSON.parse(
    new TextDecoder().decode(decodeBase64Url(headerPart))
  ) as { alg?: string };

  if (header.alg !== "HS256") throw new Error("Invalid session algorithm.");

  const valid = await crypto.subtle.verify(
    "HMAC",
    await getHmacKey(),
    decodeBase64Url(signaturePart).slice().buffer as ArrayBuffer,
    new TextEncoder().encode(`${headerPart}.${payloadPart}`)
  );

  if (!valid) throw new Error("Invalid session signature.");

  const payload = JSON.parse(
    new TextDecoder().decode(decodeBase64Url(payloadPart))
  ) as SessionUser & { exp?: number };

  if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error("Session expired.");
  }

  return payload;
}

export type SessionUser = {
  id: string;
  email: string;
  role: "org" | "admin";
  orgId: string | null;
  status: "pending" | "approved" | "rejected";
  sessionVersion?: number;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const token = await createSessionToken(user);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    const session = await readSessionToken(token);
    const rows = await sql`
      select email, role, org_id, status, session_version
      from users
      where id = ${session.id}
      limit 1
    `;
    const current = rows[0] as
      | {
          email: string;
          role: "org" | "admin";
          org_id: string | null;
          status: "pending" | "approved" | "rejected";
          session_version: number;
        }
      | undefined;

    if (!current) return null;
    if ((session.sessionVersion ?? 1) !== Number(current.session_version)) {
      return null;
    }

    return {
      ...session,
      email: current.email,
      role: current.role,
      orgId: current.role === "admin" ? session.orgId : current.org_id,
      status: current.status,
      sessionVersion: Number(current.session_version),
    };
  } catch {
    return null;
  }
}

export class AuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const session = await getSession();

  if (!session) throw new AuthError("Not signed in.", 401);

  if (session.status !== "approved") {
    throw new AuthError("Account pending admin approval.", 403);
  }

  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireUser();
  const rows = await sql`
    select 1
    from platform_administrator_memberships
    where user_id = ${session.id} and status = 'active'
    limit 1
  `;

  if (!rows[0]) {
    throw new AuthError("Admin access required.", 403);
  }

  return session;
}

export async function requireOrgAccess(orgId: string): Promise<SessionUser> {
  const session = await requireUser();

  if (session.role === "admin") return session;

  if (session.role === "org" && session.orgId === orgId) {
    return session;
  }

  throw new AuthError("You don't have access to this organization's data.", 403);
}

// Returns the organization context the current signed-in user is allowed
// to operate under.
//
// Normal org users always use their own orgId.
//
// Admin test mode uses orgId stored INSIDE the already-working signed JWT
// session. This avoids maintaining a second temporary cookie, which proved
// unreliable on the current Cloudflare Edge / next-on-pages deployment.
//
// IMPORTANT: this does not change the admin's database role or user record.
// It is only temporary session context and the real actor remains the admin.
export async function requireEffectiveOrg(): Promise<{
  session: SessionUser;
  orgId: string;
  adminTestMode: boolean;
}> {
  const session = await requireUser();

  if (session.role === "org" && session.orgId) {
    return {
      session,
      orgId: session.orgId,
      adminTestMode: false,
    };
  }

  if (session.role === "admin" && session.orgId) {
    const rows = await sql`
      select id
      from organizations
      where id = ${session.orgId}
      limit 1
    `;

    if (!rows[0]) {
      throw new AuthError(
        "The selected Rescue Manager test organization no longer exists.",
        403
      );
    }

    return {
      session,
      orgId: session.orgId,
      adminTestMode: true,
    };
  }

  if (session.role === "admin") {
    throw new AuthError(
      "Choose an organization from Admin > Organizations before opening Rescue Manager test mode.",
      403
    );
  }

  throw new AuthError("Organization access required.", 403);
}

export type PlatformAdminAccessLevel =
  | "platform_owner"
  | "case_administrator"
  | "directory_moderator";

export type PlatformAdminSession = SessionUser & {
  platformAccessLevel: PlatformAdminAccessLevel;
};

export async function requireAdminFresh(
  allowedLevels: PlatformAdminAccessLevel[] = [
    "platform_owner",
    "case_administrator",
    "directory_moderator",
  ]
): Promise<PlatformAdminSession> {
  const session = await requireAdmin();

  try {
    const rows = await sql`
      select u.role, u.status, membership.access_level, membership.status as membership_status
      from users u
      join platform_administrator_memberships membership on membership.user_id = u.id
      where u.id = ${session.id}
    `;

    const row = rows[0] as
      | { role: string; status: string; access_level: PlatformAdminAccessLevel; membership_status: string }
      | undefined;

    if (
      !row ||
      row.status !== "approved" ||
      row.membership_status !== "active"
    ) {
      throw new AuthError("Admin access required.", 403);
    }

    if (!allowedLevels.includes(row.access_level)) {
      throw new AuthError("Your platform access level does not allow this action.", 403);
    }

    return { ...session, platformAccessLevel: row.access_level };
  } catch (err) {
    if (err instanceof AuthError) throw err;

    console.error(
      "requireAdminFresh: unexpected error verifying admin status:",
      err
    );

    throw new AuthError(
      "Couldn't verify admin access. Please try signing in again.",
      500
    );
  }
}
