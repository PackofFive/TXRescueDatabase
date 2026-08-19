import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdminFresh, AuthError } from "@/lib/auth";
import { CAPABILITY_FIELDS } from "@/lib/constants";

export const runtime = "edge";

// Every organizations column an admin is allowed to edit directly here —
// an explicit allow-list, not just "whatever field name shows up in the
// request," since this route writes straight to the table with no review
// step in between.
const ORG_EDITABLE_FIELDS = [
  "name", "org_type", "species", "focus", "specialty", "c3_status",
  "city", "county", "service_area", "region", "statewide",
  "intake_status", "intake_restrictions", "intake_form_url",
  "website", "social_media", "public_email", "public_phone",
  "resource_status", "last_verified", "notes",
];

const CAP_FIELD_KEYS = new Set(CAPABILITY_FIELDS.map((f) => f.key));

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminFresh();
    const { id } = await params;
    const rows = await sql`
      select o.*, c.*
      from organizations o
      left join capabilities c on c.org_id = o.id
      where o.id = ${id}
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Organization not found." }, { status: 404 });
    }
    return NextResponse.json({ organization: rows[0] });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}

// PATCH { changes: [{ table: 'organizations' | 'capabilities', field, newValue }] }
// Writes directly — no review queue, since the admin editing this *is*
// the reviewer. Every change still gets logged to update_log with
// source='admin_direct' for the audit trail.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminFresh();
    const { id: orgId } = await params;
    const body = await req.json().catch(() => null);
    const changes = body?.changes;
    if (!Array.isArray(changes) || changes.length === 0) {
      return NextResponse.json({ error: "A non-empty changes array is required." }, { status: 400 });
    }

    const applied: string[] = [];

    for (const change of changes) {
      const { table, field, newValue } = change ?? {};

      if (table === "organizations") {
        if (!ORG_EDITABLE_FIELDS.includes(field)) {
          return NextResponse.json({ error: `Unknown organization field: ${field}` }, { status: 400 });
        }
        const current = await sql`select ${sql(field)} as val from organizations where id = ${orgId}`;
        const oldValue = current[0]?.val ?? null;

        // species is a text[] column; the form sends it as a comma-separated
        // string, so it needs converting before it hits the database.
        const valueToWrite =
          field === "species"
            ? String(newValue).split(",").map((s) => s.trim()).filter(Boolean)
            : newValue;

        await sql`update organizations set ${sql(field)} = ${valueToWrite}, updated_at = now() where id = ${orgId}`;
        await sql`
          insert into update_log (org_id, changed_by, field_name, old_value, new_value, source)
          values (${orgId}, ${admin.id}, ${field}, ${String(oldValue)}, ${String(newValue)}, 'admin_direct')
        `;
        applied.push(field);
      } else if (table === "capabilities") {
        if (!CAP_FIELD_KEYS.has(field)) {
          return NextResponse.json({ error: `Unknown capability field: ${field}` }, { status: 400 });
        }
        const current = await sql`select ${sql(field)} as val from capabilities where org_id = ${orgId}`;
        const oldValue = current[0]?.val ?? "Unknown";

        await sql`update capabilities set ${sql(field)} = ${newValue}, updated_at = now() where org_id = ${orgId}`;
        await sql`
          insert into update_log (org_id, changed_by, field_name, old_value, new_value, source)
          values (${orgId}, ${admin.id}, ${field}, ${oldValue}, ${newValue}, 'admin_direct')
        `;
        applied.push(field);
      } else {
        return NextResponse.json({ error: `Unknown table: ${table}` }, { status: 400 });
      }
    }

    return NextResponse.json({ ok: true, applied });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
