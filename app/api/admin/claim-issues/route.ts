import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdminFresh, AuthError } from "@/lib/auth";

export const runtime = "edge";

const REVIEW_ACTIONS = new Set(["waiting_documents", "waiting_reporter", "waiting_owner", "ready_decision", "reviewing", "resolved", "rejected"]);

export async function GET() {
  try {
    await requireAdminFresh();
    const rows = await sql`
      select
        report.id,
        report.org_id,
        organization.name as org_name,
        report.reporter_name,
        report.reporter_email,
        report.reporter_phone,
        report.relationship_to_org,
        report.issue_type,
        report.previous_org_email,
        report.details,
        report.evidence_url,
        report.status,
        report.resolution_notes,
        report.created_at,
        report.reviewed_at
        ,report.due_at
        ,report.next_action
        ,report.last_activity_at
        ,report.reporter_notified_at
        ,report.owner_notified_at
        ,report.current_owner_email
        ,report.reporter_evidence_received_at
        ,report.owner_response_received_at
        ,report.official_record_checked_at
      from organization_claim_issue_reports report
      join organizations organization on organization.id = report.org_id
      where report.status not in ('resolved', 'rejected')
      order by
        case when report.due_at < now() then 0 when report.status = 'ready_decision' then 1 else 2 end,
        report.created_at asc
    `;
    return NextResponse.json({ reports: rows });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("GET /api/admin/claim-issues failed:", error);
    return NextResponse.json({ error: "Claim issue reports could not be loaded." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdminFresh();
    const body = await req.json().catch(() => null);
    const reportId = typeof body?.reportId === "string" ? body.reportId : "";
    const status = typeof body?.status === "string" ? body.status : "";
    const resolutionNotes = typeof body?.resolutionNotes === "string"
      ? body.resolutionNotes.trim().slice(0, 5000)
      : "";

    if (!reportId || !REVIEW_ACTIONS.has(status)) {
      return NextResponse.json({ error: "Choose a valid report and review action." }, { status: 400 });
    }
    if ((status === "resolved" || status === "rejected") && resolutionNotes.length < 10) {
      return NextResponse.json({ error: "Add a resolution note of at least 10 characters before closing this report." }, { status: 400 });
    }

    const rows = await sql`
      update organization_claim_issue_reports
      set
        status = ${status},
        reviewed_by = ${admin.id},
        reviewed_at = now(),
        resolution_notes = ${resolutionNotes || null},
        updated_at = now()
      where id = ${reportId}
        and status not in ('resolved', 'rejected')
      returning id, status
    `;
    if (!rows[0]) {
      return NextResponse.json({ error: "This report was not found or was already closed." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, report: rows[0] });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("PATCH /api/admin/claim-issues failed:", error);
    return NextResponse.json({ error: "The report could not be updated." }, { status: 500 });
  }
}
