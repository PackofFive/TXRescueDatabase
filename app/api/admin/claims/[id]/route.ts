import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdminFresh, AuthError } from "@/lib/auth";

export const runtime = "edge";

// PATCH { action: 'approve' | 'reject' }
// Approving a manual-review claim is the admin vouching for the
// affiliation by whatever means they used outside the app (a phone call,
// a known contact, etc.) — this creates the account the same way an
// auto-verified claim would.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminFresh(["platform_owner", "case_administrator"]);
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const action = body?.action;
    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "action must be 'approve' or 'reject'." }, { status: 400 });
    }

    const rows = await sql`select * from claims where id = ${id} and status = 'manual_review'`;
    const claim = rows[0] as
      | { id: string; org_id: string; requester_email: string; password_hash: string }
      | undefined;
    if (!claim) {
      return NextResponse.json({ error: "Claim not found or already reviewed." }, { status: 404 });
    }

    if (action === "reject") {
      await sql`update claims set status = 'rejected' where id = ${id}`;
      return NextResponse.json({ ok: true, action: "rejected" });
    }

    const existingApproved = await sql`
      select id from users where org_id = ${claim.org_id} and status = 'approved' and role = 'org'
    `;
    if (existingApproved.length > 0) {
      await sql`update claims set status = 'rejected' where id = ${id}`;
      return NextResponse.json({ error: "This listing was already claimed by someone else." }, { status: 409 });
    }

    const existingAccount = await sql`
      select id
      from users
      where lower(email) = lower(${claim.requester_email})
      limit 1
    `;
    if (existingAccount[0]) {
      return NextResponse.json(
        {
          error:
            "This email already belongs to a Pack of Five account. Reject this test claim and submit a new claim with a different email address. Multiple-organization account switching is not active yet.",
        },
        { status: 409 }
      );
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
        coalesce(
          organization.org_type ilike '%shelter%'
          or organization.org_type = 'Animal Control',
          false
        )
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
        'Initial verified organization owner created through manual claim approval'
      )
    `;
    await sql`update claims set status = 'verified' where id = ${id}`;

    return NextResponse.json({ ok: true, action: "approved" });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
