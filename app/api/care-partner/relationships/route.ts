import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { isRescueManagerOrganization, isShelterExpressOrganization } from "@/lib/organization-types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

async function requireVerifiedCarePartner() {
  const session = await getSession();
  if (!session || session.status !== "approved" || !session.orgId) return null;
  const rows = await sql`
    select organization.id
    from organization_memberships membership
    join organizations organization on organization.id = membership.org_id
    where membership.user_id = ${session.id}::uuid
      and membership.org_id = ${session.orgId}::uuid
      and membership.status = 'active'
      and organization.archived_at is null
      and organization.org_type = 'Veterinary / Care Partner'
      and organization.care_partner_review_status = 'verified'
    limit 1
  `;
  return rows[0] ? session : null;
}

export async function GET() {
  const session = await requireVerifiedCarePartner();
  if (!session) return NextResponse.json({ error: "Verified Care Partner access required." }, { status: 403 });
  const rows = await sql`
    select relationship.id, relationship.partner_org_id, relationship.status,
      relationship.request_message, relationship.created_at, relationship.updated_at,
      organization.name as partner_name, organization.org_type as partner_type,
      organization.city, organization.county, organization.state
    from care_partner_relationships relationship
    join organizations organization on organization.id = relationship.partner_org_id
    where relationship.care_partner_org_id = ${session.orgId}::uuid
    order by case relationship.status when 'requested' then 0 when 'active' then 1 else 2 end,
      relationship.updated_at desc
  `;
  return NextResponse.json({ relationships: rows }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ error: "Request rejected." }, { status: 403 });
  const session = await requireVerifiedCarePartner();
  if (!session) return NextResponse.json({ error: "Verified Care Partner access required." }, { status: 403 });
  const body = await req.json().catch(() => null);
  const partnerOrgId = typeof body?.partnerOrgId === "string" ? body.partnerOrgId.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 2000) : "";
  if (!partnerOrgId || message.length < 20) return NextResponse.json({ error: "Choose an organization and include a request message of at least 20 characters." }, { status: 400 });
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(partnerOrgId)) return NextResponse.json({ error: "Choose a valid organization." }, { status: 400 });

  const partnerRows = await sql`select id, org_type from organizations where id = ${partnerOrgId}::uuid and archived_at is null limit 1`;
  const partner = partnerRows[0];
  if (!partner || (!isRescueManagerOrganization(partner.org_type) && !isShelterExpressOrganization(partner.org_type))) {
    return NextResponse.json({ error: "Care Partner relationships may currently be requested only with rescues and shelters." }, { status: 400 });
  }
  if (partnerOrgId === session.orgId) return NextResponse.json({ error: "An organization cannot request a relationship with itself." }, { status: 400 });

  const pendingRows = await sql`select count(*)::int as count from care_partner_relationships where care_partner_org_id = ${session.orgId}::uuid and status = 'requested'`;
  if (Number(pendingRows[0]?.count ?? 0) >= 25) return NextResponse.json({ error: "This Care Partner already has 25 pending requests. Wait for organizations to review them before sending more." }, { status: 429 });
  const previousRows = await sql`select status from care_partner_relationships where care_partner_org_id = ${session.orgId}::uuid and partner_org_id = ${partnerOrgId}::uuid limit 1`;
  const previousStatus = previousRows[0]?.status ? String(previousRows[0].status) : null;

  const rows = await sql`
    with relationship as (
      insert into care_partner_relationships (
        care_partner_org_id, partner_org_id, status, request_message, requested_by,
        reviewed_by, reviewed_at, started_at, ended_at, updated_at
      ) values (
        ${session.orgId}::uuid, ${partnerOrgId}::uuid, 'requested', ${message}, ${session.id}::uuid,
        null, null, null, null, now()
      )
      on conflict (care_partner_org_id, partner_org_id) do update
        set status = 'requested', request_message = excluded.request_message,
            requested_by = excluded.requested_by, reviewed_by = null, reviewed_at = null,
            started_at = null, ended_at = null, updated_at = now()
        where care_partner_relationships.status in ('declined', 'ended')
      returning id
    )
    insert into care_partner_relationship_events (
      relationship_id, event_type, old_status, new_status, note, actor_user_id
    )
    select id, 'relationship_requested', ${previousStatus}, 'requested', ${message}, ${session.id}::uuid
    from relationship
    returning relationship_id
  `;

  if (!rows[0]) {
    const existing = await sql`select status from care_partner_relationships where care_partner_org_id = ${session.orgId}::uuid and partner_org_id = ${partnerOrgId}::uuid limit 1`;
    return NextResponse.json({ error: existing[0]?.status === "active" ? "This organization is already an active Care Partner relationship." : "A relationship request with this organization is already pending or suspended." }, { status: 409 });
  }

  return NextResponse.json({ ok: true, relationshipId: rows[0].relationship_id }, { status: 201 });
}
