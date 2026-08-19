import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { sql } from "./db";

// SESSION_SECRET is a long random string you generate once and set as an
// environment variable — see README.md. Never commit a real value.
//
// IMPORTANT: kept lazy (inside a function) rather than evaluated at
// module top-level, for the same reason as lib/db.ts — Next.js imports
// every route file during the build's page-data-collection step, in an
// environment without your Cloudflare environment variables. A
// top-level throw here would fail the build itself.
let cachedSecretKey: Uint8Array | null = null;

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
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 14; // 14 days

export type SessionUser = {
  id: string;
  email: string;
  role: "org" | "admin";
  orgId: string | null;
  status: "pending" | "approved" | "rejected";
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

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

// Reads and verifies the session cookie. Returns null if there is no
// session or anything about reading/verifying it goes wrong — callers
// must treat null as "not logged in." The whole function body is inside
// one try/catch (not just the token verification) so a malformed cookie
// or any other unexpected failure here always resolves to "not signed
// in" instead of leaking a raw error message to the caller.
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionUser;
  } catch {
    return null; // missing, expired, tampered, or otherwise unreadable
  }
}

// ── Permission helpers — call these at the top of every API route that
// touches org or admin data. They are the actual enforcement layer;
// nothing in the frontend can substitute for these checks.

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

// Throws unless there's a valid, approved session. Returns the session user.
export async function requireUser(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new AuthError("Not signed in.", 401);
  if (session.status !== "approved") throw new AuthError("Account pending admin approval.", 403);
  return session;
}

// Throws unless the session belongs to an approved admin.
export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireUser();
  if (session.role !== "admin") throw new AuthError("Admin access required.", 403);
  return session;
}

// Throws unless the session is an approved org user tied to exactly
// this orgId, OR an admin (admins can act on behalf of any org, e.g.
// while helping onboard one over the phone).
export async function requireOrgAccess(orgId: string): Promise<SessionUser> {
  const session = await requireUser();
  if (session.role === "admin") return session;
  if (session.role === "org" && session.orgId === orgId) return session;
  throw new AuthError("You don't have access to this organization's data.", 403);
}

// Convenience for API routes: re-fetches the live user status from the
// database rather than trusting the JWT alone, for the small number of
// operations (e.g. admin approving a submission) where a just-revoked
// admin shouldn't still be able to act until they log in again.
//
// The database call is wrapped separately from requireAdmin() above so
// that any *unexpected* failure here (a bad session.id shape, a
// transient DB hiccup, etc.) also resolves to a clean AuthError instead
// of leaking a raw error message to the caller — same reasoning as
// getSession(). The real error is still logged server-side (visible in
// Cloudflare's Observability tab) so it's not silently swallowed.
export async function requireAdminFresh(): Promise<SessionUser> {
  const session = await requireAdmin();
  try {
    const rows = await sql`select role, status from users where id = ${session.id}`;
    const row = rows[0] as { role: string; status: string } | undefined;
    if (!row || row.role !== "admin" || row.status !== "approved") {
      throw new AuthError("Admin access required.", 403);
    }
    return session;
  } catch (err) {
    if (err instanceof AuthError) throw err;
    console.error("requireAdminFresh: unexpected error verifying admin status:", err);
    throw new AuthError("Couldn't verify admin access. Please try signing in again.", 500);
  }
}
