import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdminFresh, AuthError } from "@/lib/auth";

export const runtime = "edge";

// All pending submissions across every org, for the Admin Queue tab.
export async function GET() {
  try {
    await requireAdminFresh();
    const rows = await sql`
      select s.id, s.org_id, o.name as org_name, s.target_table, s.field_name,
             s.field_label, s.old_value, s.new_value, s.created_at
      from submissions s
      join organizations o on o.id = s.org_id
      where s.status = 'pending'
      order by s.created_at asc
    `;
    return NextResponse.json({ submissions: rows });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
