import { NextRequest, NextResponse } from "next/server";
import { createSession, requireUser, AuthError } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => null);
    const orgId = typeof body?.orgId === "string" ? body.orgId : "";
    if (!orgId) return NextResponse.json({ error: "Choose an organization." }, { status: 400 });

    const rows = await sql`
      select organization.id, organization.name
      from organization_memberships membership
      join organizations organization on organization.id = membership.org_id
      where membership.user_id = ${user.id}::uuid
        and membership.org_id = ${orgId}::uuid
        and membership.status = 'active'
        and organization.archived_at is null
      limit 1
    `;
    if (!rows[0]) return NextResponse.json({ error: "You do not have active access to that organization." }, { status: 403 });

    await createSession({ ...user, orgId });
    return NextResponse.json({ message: `${rows[0].name} is now your active organization.` });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "The organization could not be selected." }, { status: 500 });
  }
}
