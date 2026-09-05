import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

// POST { claimId, code }
// If the code matches and hasn't expired, creates the org user account
// immediately as 'approved' — code verification against the org's own
// listed email is treated as sufficient proof of affiliation on its own,
// per the site owner's judgment call. (Compare to self-signup with no
// org-ID verification, which still requires admin approval.)
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { claimId, code } = body ?? {};

  if (!claimId || !code) {
    return NextResponse.json({ error: "claimId and code are required." }, { status: 400 });
  }

  const rows = await sql`select * from claims where id = ${claimId}`;
  const claim = rows[0] as
    | {
        id: string;
        org_id: string;
        requester_email: string;
        password_hash: string;
        code: string | null;
        code_expires_at: string | null;
        status: string;
      }
    | undefined;

  if (!claim || claim.status !== "pending") {
    return NextResponse.json({ error: "Claim not found or no longer pending." }, { status: 404 });
  }
  if (!claim.code_expires_at || new Date(claim.code_expires_at) < new Date()) {
    await sql`update claims set status = 'expired' where id = ${claimId}`;
    return NextResponse.json({ error: "This code has expired. Start the claim again to get a new one." }, { status: 410 });
  }
  if (claim.code !== code) {
    return NextResponse.json({ error: "Incorrect code." }, { status: 401 });
  }

  // Re-check no one else claimed this org while this code was pending.
  const existingApproved = await sql`
    select id from users where org_id = ${claim.org_id} and status = 'approved' and role = 'org'
  `;
  if (existingApproved.length > 0) {
    await sql`update claims set status = 'rejected' where id = ${claimId}`;
    return NextResponse.json({ error: "This listing was claimed by someone else in the meantime." }, { status: 409 });
  }

  const createdUsers = await sql`
    insert into users (email, password_hash, role, org_id, status)
    values (${claim.requester_email}, ${claim.password_hash}, 'org', ${claim.org_id}, 'approved')
    returning id
  `;
  const userId = String(createdUsers[0].id);
  await sql`
    insert into organization_memberships (
      user_id, org_id, role, access_level, status, shelter_express_access
    )
    select
      ${userId}::uuid, organization.id, 'owner', 'owner', 'active',
      coalesce(organization.org_type ilike '%shelter%', false)
    from organizations organization
    where organization.id = ${claim.org_id}::uuid
    on conflict (org_id, user_id) do update set
      access_level = 'owner',
      role = 'owner',
      status = 'active',
      shelter_express_access = excluded.shelter_express_access,
      updated_at = now()
  `;
  await sql`
    insert into organization_access_audit (
      org_id, affected_user_id, actor_user_id, action,
      new_access_level, reason
    ) values (
      ${claim.org_id}::uuid, ${userId}::uuid, ${userId}::uuid,
      'membership_created', 'owner',
      'Initial verified organization owner created through email claim verification'
    )
  `;
  await sql`update claims set status = 'verified' where id = ${claimId}`;

  return NextResponse.json({ status: "verified", message: "Your account is ready — you can sign in now." });
}
