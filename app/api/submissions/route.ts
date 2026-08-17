import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireOrgAccess, AuthError } from "@/lib/auth";
import { AUTO_PUBLISH_FIELDS, CAPABILITY_FIELDS } from "@/lib/constants";

export const runtime = "edge";

const CAP_FIELD_KEYS = new Set(CAPABILITY_FIELDS.map((f) => f.key));

// POST body: { orgId, changes: [{ table: 'organizations'|'capabilities', field, label, newValue }] }
//
// This is the one route that decides auto-publish vs. review-queue —
// see lib/constants.ts for the field lists it reads from. An org user
// can only submit changes for their own org (enforced by
// requireOrgAccess, not just checked in the UI).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgId, changes } = body ?? {};
    if (!orgId || !Array.isArray(changes) || changes.length === 0) {
      return NextResponse.json({ error: "orgId and a non-empty changes array are required." }, { status: 400 });
    }

    const user = await requireOrgAccess(orgId);

    const published: string[] = [];
    const queued: string[] = [];

    for (const change of changes) {
      const { table, field, label, newValue } = change;
      if (table === "capabilities") {
        if (!CAP_FIELD_KEYS.has(field)) {
          return NextResponse.json({ error: `Unknown capability field: ${field}` }, { status: 400 });
        }
        const current = await sql`select ${sql(field)} as val from capabilities where org_id = ${orgId}`;
        const oldValue = current[0]?.val ?? "Unknown";
        if (oldValue === newValue) continue;

        // Every capability field is review-required — see lib/constants.ts.
        await sql`
          insert into submissions (org_id, submitted_by, target_table, field_name, field_label, old_value, new_value)
          values (${orgId}, ${user.id}, 'capabilities', ${field}, ${label}, ${oldValue}, ${newValue})
        `;
        queued.push(label);
      } else if (table === "organizations") {
        const current = await sql`select ${sql(field)} as val from organizations where id = ${orgId}`;
        const oldValue = current[0]?.val ?? "";
        if (oldValue === newValue) continue;

        if (AUTO_PUBLISH_FIELDS.includes(field)) {
          await sql`update organizations set ${sql(field)} = ${newValue}, updated_at = now() where id = ${orgId}`;
          await sql`
            insert into update_log (org_id, changed_by, field_name, old_value, new_value, source)
            values (${orgId}, ${user.id}, ${field}, ${oldValue}, ${newValue}, 'org_submission')
          `;
          published.push(label);
        } else {
          await sql`
            insert into submissions (org_id, submitted_by, target_table, field_name, field_label, old_value, new_value)
            values (${orgId}, ${user.id}, 'organizations', ${field}, ${label}, ${oldValue}, ${newValue})
          `;
          queued.push(label);
        }
      } else {
        return NextResponse.json({ error: `Unknown table: ${table}` }, { status: 400 });
      }
    }

    return NextResponse.json({ published, queued });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

// GET ?orgId=... — an org's own pending submissions (for "Your pending
// submissions" in the portal). Also gated by requireOrgAccess.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId");
    if (!orgId) return NextResponse.json({ error: "orgId is required." }, { status: 400 });

    await requireOrgAccess(orgId);

    const rows = await sql`
      select id, field_label, old_value, new_value, status, created_at
      from submissions
      where org_id = ${orgId} and status = 'pending'
      order by created_at desc
    `;
    return NextResponse.json({ submissions: rows });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
