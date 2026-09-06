import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdminFresh, AuthError } from "@/lib/auth";

export const runtime = "edge";

// Claims where the org had no email on file to auto-verify against.
export async function GET() {
  try {
    await requireAdminFresh(["platform_owner", "case_administrator"]);
    const rows = await sql`
      select c.id, c.org_id, o.name as org_name, c.requester_email, c.created_at
      from claims c
      join organizations o on o.id = c.org_id
      where c.status = 'manual_review'
      order by c.created_at asc
    `;
    return NextResponse.json({ claims: rows });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    // Any other failure (a bad query, a missing table, a transient DB
    // issue) — log the real error server-side and return a clean
    // message instead of letting a raw error reach the browser.
    console.error("GET /api/admin/claims failed:", err);
    return NextResponse.json({ error: "Something went wrong loading claims." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminFresh(["platform_owner", "case_administrator"]);
    const body = await req.json().catch(() => null);
    const claimId = typeof body?.claimId === "string" ? body.claimId : "";
    const action = body?.action;
    if (!claimId || (action !== "approve" && action !== "reject")) {
      return NextResponse.json({ error: "Choose a valid claim action." }, { status: 400 });
    }

    const claims = await sql`
      select id, org_id, requester_email, password_hash
      from claims
      where id = ${claimId}::uuid and status = 'manual_review'
      limit 1
    `;
    const claim = claims[0] as { id:string; org_id:string; requester_email:string; password_hash:string } | undefined;
    if (!claim) return NextResponse.json({ error: "Claim not found or already reviewed." }, { status: 404 });

    if (action === "reject") {
      await sql`update claims set status = 'rejected' where id = ${claimId}::uuid`;
      return NextResponse.json({ message: "The claim was rejected." });
    }

    const owners = await sql`
      select id from organization_memberships
      where org_id = ${claim.org_id}::uuid and status = 'active' and access_level = 'owner'
      limit 1
    `;
    if (owners[0]) return NextResponse.json({ error: "This organization already has an active owner." }, { status: 409 });

    const accounts = await sql`
      select id, status from users where lower(email) = lower(${claim.requester_email}) limit 1
    `;
    if (accounts[0] && accounts[0].status !== "approved") {
      return NextResponse.json({ error: "The existing Pack of Five account is not active." }, { status: 409 });
    }

    let userId = accounts[0] ? String(accounts[0].id) : "";
    if (!userId) {
      const created = await sql`
        insert into users (email, password_hash, role, org_id, status)
        values (${claim.requester_email}, ${claim.password_hash}, 'org', ${claim.org_id}::uuid, 'approved')
        returning id
      `;
      userId = String(created[0].id);
    }

    const memberships = await sql`
      insert into organization_memberships (
        user_id, org_id, role, access_level, status, shelter_express_access, granted_by
      )
      select ${userId}::uuid, organization.id, 'admin', 'owner', 'active',
        coalesce(organization.org_type ilike '%shelter%' or organization.org_type = 'Animal Control', false),
        ${admin.id}::uuid
      from organizations organization where organization.id = ${claim.org_id}::uuid
      on conflict (org_id, user_id) do update set
        role = 'admin', access_level = 'owner', status = 'active',
        shelter_express_access = excluded.shelter_express_access,
        granted_by = excluded.granted_by, updated_at = now()
      returning id
    `;
    if (!memberships[0]) return NextResponse.json({ error: "The organization no longer exists." }, { status: 404 });

    await sql`
      insert into organization_access_audit (
        org_id, membership_id, affected_user_id, actor_user_id, action, new_access_level, reason
      ) values (
        ${claim.org_id}::uuid, ${String(memberships[0].id)}::uuid, ${userId}::uuid, ${admin.id}::uuid,
        'membership_created', 'owner', 'Organization claim approved after private administrator review'
      )
    `;
    await sql`update claims set status = 'verified' where id = ${claimId}::uuid`;

    return NextResponse.json({ message: "The claim was approved and the organization was added to the account." });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error("POST /api/admin/claims failed:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "The claim could not be approved." }, { status: 500 });
  }
}
