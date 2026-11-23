import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function CarePartnerLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session || session.status !== "approved") redirect("/login?portal=care-partner");
  if (!session.orgId) redirect("/account");

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

  if (!rows[0]) redirect("/account");
  return children;
}
