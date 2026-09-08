import { sql } from "./db";

export class OrganizationMembershipConflictError extends Error {}

export async function assertCanJoinOrganization(userId: string, orgId: string) {
  const rows = await sql`
    select organization.name
    from organization_memberships membership
    join organizations organization on organization.id = membership.org_id
    where membership.user_id = ${userId}::uuid
      and membership.status = 'active'
      and membership.org_id <> ${orgId}::uuid
    limit 1
  `;

  if (rows[0]) {
    throw new OrganizationMembershipConflictError(
      `This login is already connected to ${String(rows[0].name)}. Each login may manage only one organization. Use a different email for this organization.`
    );
  }
}

export async function findOrganizationForEmail(email: string, orgId: string) {
  const rows = await sql`
    select organization.name
    from users account
    join organization_memberships membership on membership.user_id = account.id
    join organizations organization on organization.id = membership.org_id
    where lower(account.email) = lower(${email})
      and membership.status = 'active'
      and membership.org_id <> ${orgId}::uuid
    limit 1
  `;
  return rows[0]?.name ? String(rows[0].name) : null;
}
