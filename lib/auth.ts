import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { sql } from "./db";

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
const ADMIN_TEST_ORG_COOKIE = "txard_admin_test_org";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 14;

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
  cookieStore.delete(ADMIN_TEST_ORG_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionUser;
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
  if (session.role !== "admin") {
    throw new AuthError("Admin access required.", 403);
  }
  return session;
}

export async function requireOrgAccess(orgId: string): Promise<SessionUser> {
  const session = await requireUser();
  if (session.role === "admin") return session;
  if (session.role === "org" && session.orgId === orgId) return session;
  throw new AuthError("You don't have access to this organization's data.", 403);
}

// Returns the org the current session is allowed to operate as.
// Normal org users always use their own orgId.
// Admins may use an explicitly selected temporary test organization stored
// in an httpOnly cookie. Admin test mode never changes the admin's real role.
export async function requireEffectiveOrg(): Promise<{
  session: SessionUser;
  orgId: string;
  adminTestMode: boolean;
}> {
  const session = await requireUser();

  if (session.role === "org" && session.orgId) {
    return { session, orgId: session.orgId, adminTestMode: false };
  }

  if (session.role === "admin") {
    const cookieStore = await cookies();
    const orgId = cookieStore.get(ADMIN_TEST_ORG_COOKIE)?.value;

    if (!orgId) {
      throw new AuthError(
        "Choose an organization from Admin > Organizations before opening Rescue Manager test mode.",
        403
      );
    }

    // Verify that the selected org actually exists before using it.
    const rows = await sql`select id from organizations where id = ${orgId} limit 1`;
    if (!rows[0]) {
      cookieStore.delete(ADMIN_TEST_ORG_COOKIE);
      throw new AuthError("The selected test organization no longer exists.", 403);
    }

    return { session, orgId, adminTestMode: true };
  }

  throw new AuthError("Organization access required.", 403);
}

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

export const authCookieNames = {
  adminTestOrg: ADMIN_TEST_ORG_COOKIE,
};
