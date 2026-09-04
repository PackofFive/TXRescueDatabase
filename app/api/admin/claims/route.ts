import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdminFresh, AuthError } from "@/lib/auth";

export const runtime = "edge";

// Claims where the org had no email on file to auto-verify against.
export async function GET() {
  try {
    await requireAdminFresh(["platform_owner", "case_administrator"]);
    const rows = await sql`
      select c.id, c.org_id, o.name as org_name, c.requester_email, c.created_at
      from claims c
      join organizations o on o.id = c.org_id
      where c.status = 'manual_review'
      order by c.created_at asc
    `;
    return NextResponse.json({ claims: rows });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    // Any other failure (a bad query, a missing table, a transient DB
    // issue) — log the real error server-side and return a clean
    // message instead of letting a raw error reach the browser.
    console.error("GET /api/admin/claims failed:", err);
    return NextResponse.json({ error: "Something went wrong loading claims." }, { status: 500 });
  }
}
