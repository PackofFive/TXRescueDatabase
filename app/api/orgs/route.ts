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

  try {
    // Base query joins organizations to their capability row.
    // Using template-literal params throughout (never string-concatenated
    // SQL) so user input can never become part of the query structure.
    const rows = await sql`
      select o.*, c.*
      from organizations o
      left join capabilities c on c.org_id = o.id
      where
        (${q}::text is null or o.name ilike '%' || ${q} || '%' or o.city ilike '%' || ${q} || '%' or o.county ilike '%' || ${q} || '%')
        and (${region}::text is null or o.region = ${region})
        and (${species}::text is null or ${species} = any(o.species))
      order by o.name asc
    `;

    return NextResponse.json({ organizations: rows });
  } catch (err) {
    // TEMPORARY: surface the real error message directly in the response
    // so it's readable in the browser during setup, instead of digging
    // through minified stack traces in the Workers log viewer. Remove
    // this catch block (or stop returning `detail`) once things are
    // working — you don't want internal error detail exposed in production.
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Query failed", detail: message }, { status: 500 });
  }
}
