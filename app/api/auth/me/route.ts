import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "edge";

// Lets a page check "am I actually signed in right now?" against the
// real session cookie, rather than a page's own temporary state (which
// resets on navigation and falsely looks like being signed out). Never
// throws for an anonymous visitor — just returns { user: null }.
export async function GET() {
  const session = await getSession();
  if (!session || session.status !== "approved") {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user: { email: session.email, role: session.role, orgId: session.orgId } });
}
