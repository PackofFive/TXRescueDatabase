import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

// Directory read is intentionally open (no requireUser()) — this is an
// internal coordination tool, but the read-only directory view doesn't
// need to gate on login the way editing does. Tighten this to
// requireUser() later if you decide the directory itself should be
// members-only.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const region = searchParams.get("region");
  const species = searchParams.get("species");

  // Base query joins organizations to their capability row, plus two
  // computed fields the Directory uses to show claim/freshness signals:
  //   - is_claimed: does this org have an approved org-role user account?
  //   - last_org_update: most recent change made *by the org itself*
  //     (source = 'org_submission' in update_log), not admin edits or the
  //     original bulk import — this is what tells a visitor "this info
  //     was confirmed by the organization on this date."
  // Using template-literal params throughout (never string-concatenated
  // SQL) so user input can never become part of the query structure.
  const rows = await sql`
    select o.*, c.*,
      exists(
        select 1 from users u
        where u.org_id = o.id and u.status = 'approved' and u.role = 'org'
      ) as is_claimed,
      (
        select max(ul.created_at) from update_log ul
        where ul.org_id = o.id and ul.source = 'org_submission'
      ) as last_org_update
    from organizations o
    left join capabilities c on c.org_id = o.id
    where
      (${q}::text is null or o.name ilike '%' || ${q} || '%' or o.city ilike '%' || ${q} || '%' or o.county ilike '%' || ${q} || '%')
      and (${region}::text is null or o.region = ${region})
      and (${species}::text is null or ${species} = any(o.species))
    order by o.name asc
  `;

  return NextResponse.json({ organizations: rows });
}
