import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdminFresh, AuthError } from "@/lib/auth";

export const runtime = "edge";

// PATCH { action: 'approve' | 'reject' }
// Approving is the only path by which a review-required field actually
// changes — this route both writes the new value AND records it in
// update_log, so the audit trail stays complete.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminFresh(["platform_owner", "directory_moderator"]);
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const action = body?.action;
    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "action must be 'approve' or 'reject'." }, { status: 400 });
    }

    const rows = await sql`select * from submissions where id = ${id} and status = 'pending'`;
    const submission = rows[0] as
      | { id: string; org_id: string; target_table: string; field_name: string; new_value: string; old_value: string }
      | undefined;
    if (!submission) {
      return NextResponse.json({ error: "Submission not found or already reviewed." }, { status: 404 });
    }

    if (action === "reject") {
      await sql`
        update submissions set status = 'rejected', reviewed_by = ${admin.id}, reviewed_at = now()
        where id = ${id}
      `;
      return NextResponse.json({ ok: true, action: "rejected" });
    }

    // action === 'approve' — write the value to its real table, log it,
    // then mark the submission approved. Not wrapped in a DB transaction
    // here because the Neon HTTP driver's default mode issues each
    // statement separately; for stricter atomicity, switch to Neon's
    // pooled TCP connection with a transaction block once you're past
    // the prototype stage.
    if (submission.target_table === "capabilities") {
      await sql`update capabilities set ${sql(submission.field_name)} = ${submission.new_value}, updated_at = now() where org_id = ${submission.org_id}`;
    } else {
      await sql`update organizations set ${sql(submission.field_name)} = ${submission.new_value}, updated_at = now() where id = ${submission.org_id}`;
    }

    await sql`
      insert into update_log (org_id, changed_by, field_name, old_value, new_value, source)
      values (${submission.org_id}, ${admin.id}, ${submission.field_name}, ${submission.old_value}, ${submission.new_value}, 'org_submission')
    `;
    await sql`
      update submissions set status = 'approved', reviewed_by = ${admin.id}, reviewed_at = now()
      where id = ${id}
    `;

    return NextResponse.json({ ok: true, action: "approved" });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    throw err;
  }
}
