import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function ShelterExpressLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session || session.status !== "approved") {
    redirect("/login?portal=shelter");
  }

  // Platform administrators may enter a selected organization for testing.
  if (session.role === "admin") {
    if (!session.orgId) redirect("/admin/orgs");
    return children;
  }

  if (!session.orgId) {
    redirect("/account");
  }

  const accessRows = await sql`
    select 1
    from organization_memberships
    where user_id = ${session.id}::uuid
      and org_id = ${session.orgId}::uuid
      and status = 'active'
      and shelter_express_access is true
    limit 1
  `;

  if (!accessRows[0]) {
    redirect("/portal");
  }

  return children;
}
