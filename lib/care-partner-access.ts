import { sql } from "@/lib/db";

export type CarePartnerAccessLevel = "owner" | "administrator" | "contributor" | "viewer";

export async function carePartnerAccessLevel(userId: string, orgId: string, platformAdmin = false): Promise<CarePartnerAccessLevel | null> {
  if (platformAdmin) return "owner";
  const rows = await sql`
    select access_level
    from organization_memberships
    where user_id = ${userId}::uuid
      and org_id = ${orgId}::uuid
      and status = 'active'
      and access_level in ('owner', 'administrator', 'contributor', 'viewer')
    limit 1
  `;
  return rows[0]?.access_level as CarePartnerAccessLevel | null;
}

export function canManageCarePartnerRelationships(level: CarePartnerAccessLevel | null) {
  return level === "owner" || level === "administrator";
}

export function canPerformAssignedCare(level: CarePartnerAccessLevel | null) {
  return level === "owner" || level === "administrator" || level === "contributor";
}
