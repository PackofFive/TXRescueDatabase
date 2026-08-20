import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin, AuthError } from "@/lib/auth";

export const runtime = "edge";

export async function GET() {
  try {
    await requireAdmin();
    const rows = await sql`
      select * from organization_requests
      order by
        case status when 'pending' then 0 when 'approved' then 1 when 'rejected' then 2 else 3 end,
        created_at desc
    `;
    return NextResponse.json({ requests: rows });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Couldn't load organization requests." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json().catch(() => null);
    const { requestId, action } = body ?? {};

    if (!requestId || !["approve","reject"].includes(action)) {
      return NextResponse.json({ error: "requestId and a valid action are required." }, { status: 400 });
    }

    const requestRows = await sql`select * from organization_requests where id = ${requestId} limit 1`;
    const request = requestRows[0];
    if (!request) return NextResponse.json({ error: "Organization request not found." }, { status: 404 });
    if (request.status !== "pending") return NextResponse.json({ error: "This request has already been reviewed." }, { status: 409 });

    if (action === "reject") {
      const rows = await sql`
        update organization_requests
        set status='rejected', reviewed_by=${admin.id}, reviewed_at=now()
        where id=${requestId}
        returning *
      `;
      return NextResponse.json({ request: rows[0] });
    }

    const duplicate = await sql`
      select id, name from organizations
      where lower(name)=lower(${request.organization_name})
        and coalesce(lower(city),'')=coalesce(lower(${request.city}),'')
      limit 1
    `;
    if (duplicate[0]) {
      return NextResponse.json(
        { error: "A matching organization already exists.", existingOrganization: duplicate[0] },
        { status: 409 }
      );
    }

    const orgRows = await sql`
      insert into organizations
        (name, org_type, city, county, state, website, social_media, public_email, public_phone, resource_status)
      values
        (${request.organization_name}, ${request.organization_type || null}, ${request.city || null},
         ${request.county || null}, ${request.state || null}, ${request.website || null},
         ${request.social_url || null}, ${request.contact_email || null}, ${request.contact_phone || null},
         'Verification Needed')
      returning id, name, org_type, city, county, state, website, social_media, public_email, public_phone, resource_status
    `;
    const org = orgRows[0];

    await sql`
      update organization_requests
      set status='approved', reviewed_by=${admin.id}, reviewed_at=now(), created_org_id=${org.id}
      where id=${requestId}
    `;

    try {
      await sql`
        insert into update_log (org_id, changed_by, field_name, old_value, new_value, source)
        values (${org.id}, ${admin.id}, 'organization_created', null, ${org.name}, 'admin_direct')
      `;
    } catch (e) {
      console.error("update_log failed after request approval:", e);
    }

    return NextResponse.json({ organization: org });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    console.error("POST /api/admin/org-requests failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Couldn't review this organization request." },
      { status: 500 }
    );
  }
}
