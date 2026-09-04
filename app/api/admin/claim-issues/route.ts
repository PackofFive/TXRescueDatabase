import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdminFresh, AuthError } from "@/lib/auth";
import { sendClaimCaseEmail } from "@/lib/email";

export const runtime = "edge";

const REVIEW_STATUSES = new Set(["waiting_documents", "waiting_reporter", "waiting_owner", "ready_decision", "reviewing", "resolved", "rejected"]);
const CHECKPOINTS = new Set(["reporter_evidence", "owner_response", "official_record"]);

export async function GET() {
  try {
    await requireAdminFresh(["platform_owner", "case_administrator"]);
    const rows = await sql`
      select report.id, report.org_id, organization.name as org_name,
        report.reporter_name, report.reporter_email, report.reporter_phone,
        report.relationship_to_org, report.issue_type, report.previous_org_email,
        report.details, report.evidence_url, report.status, report.resolution_notes,
        report.created_at, report.reviewed_at, report.due_at, report.next_action,
        report.last_activity_at, report.reporter_notified_at, report.owner_notified_at,
        report.current_owner_email, report.reporter_evidence_received_at,
        report.owner_response_received_at, report.official_record_checked_at
      from organization_claim_issue_reports report
      join organizations organization on organization.id = report.org_id
      where report.status not in ('resolved', 'rejected')
      order by case when report.due_at < now() then 0 when report.status = 'ready_decision' then 1 else 2 end,
        report.created_at asc
    `;
    const lifecycleReviews = await sql`
      select review.id, review.org_id, organization.name as org_name,
        review.review_type, review.status, review.reason, review.owner_email,
        review.owner_contacted_at, review.owner_response_received_at,
        review.response_due_at, review.created_at
      from organization_lifecycle_reviews review
      join organizations organization on organization.id = review.org_id
      where review.status in ('waiting_owner','ready_decision')
      order by review.response_due_at asc
    `;
    return NextResponse.json({ reports: rows, lifecycleReviews });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("GET /api/admin/claim-issues failed:", error);
    return NextResponse.json({ error: "Claim issue reports could not be loaded." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdminFresh(["platform_owner", "case_administrator"]);
    const body = await req.json().catch(() => null);
    const reportId = typeof body?.reportId === "string" ? body.reportId : "";
    const checkpoint = typeof body?.checkpoint === "string" ? body.checkpoint : "";
    const requestedStatus = typeof body?.status === "string" ? body.status : "";
    const outcome = typeof body?.resolutionNotes === "string" ? body.resolutionNotes.trim().slice(0, 5000) : "";

    if (!reportId || (!CHECKPOINTS.has(checkpoint) && !REVIEW_STATUSES.has(requestedStatus))) {
      return NextResponse.json({ error: "Choose a valid case action." }, { status: 400 });
    }
    if ((requestedStatus === "resolved" || requestedStatus === "rejected") && outcome.length < 10) {
      return NextResponse.json({ error: "Write an outcome of at least 10 characters. It will be emailed to both parties." }, { status: 400 });
    }

    if (checkpoint === "reporter_evidence") {
      await sql`update organization_claim_issue_reports set reporter_evidence_received_at=now(),last_activity_at=now(),updated_at=now(),reviewed_by=${admin.id} where id=${reportId} and status not in ('resolved','rejected')`;
    } else if (checkpoint === "owner_response") {
      await sql`update organization_claim_issue_reports set owner_response_received_at=now(),last_activity_at=now(),updated_at=now(),reviewed_by=${admin.id} where id=${reportId} and status not in ('resolved','rejected')`;
    } else if (checkpoint === "official_record") {
      await sql`update organization_claim_issue_reports set official_record_checked_at=now(),official_record_checked_by=${admin.id},last_activity_at=now(),updated_at=now(),reviewed_by=${admin.id} where id=${reportId} and status not in ('resolved','rejected')`;
    }

    if (checkpoint) {
      const updated = await sql`
        update organization_claim_issue_reports
        set status=case when reporter_evidence_received_at is not null and owner_response_received_at is not null and official_record_checked_at is not null then 'ready_decision' else status end,
          next_action=case when reporter_evidence_received_at is null then 'Waiting for documentation from the reporter.' when owner_response_received_at is null then 'Waiting for a response from the current owner.' when official_record_checked_at is null then 'Check an independent official organization record.' else 'All verification checkpoints are complete. Review the evidence and record a decision.' end,
          reviewed_at=now(),updated_at=now()
        where id=${reportId} and status not in ('resolved','rejected') returning id,status,next_action
      `;
      if (!updated[0]) return NextResponse.json({ error: "This case was not found or was already closed." }, { status: 404 });
      return NextResponse.json({ ok: true, report: updated[0] });
    }

    const rows = await sql`
      update organization_claim_issue_reports
      set status=${requestedStatus},reviewed_by=${admin.id},reviewed_at=now(),resolution_notes=${outcome||null},last_activity_at=now(),updated_at=now(),
        next_action=${requestedStatus==="resolved"||requestedStatus==="rejected"?"Case closed. No further action is scheduled.":"Continue gathering and reviewing verification information."}
      where id=${reportId} and status not in ('resolved','rejected')
      returning id,status,reporter_email,current_owner_email,(select name from organizations where id=organization_claim_issue_reports.org_id) as org_name
    `;
    const report=rows[0] as {id:string;status:string;reporter_email:string;current_owner_email:string|null;org_name:string}|undefined;
    if(!report)return NextResponse.json({error:"This case was not found or was already closed."},{status:404});

    if(requestedStatus==="resolved"||requestedStatus==="rejected"){
      const decision=requestedStatus==="resolved"?"resolved":"closed without changing access";
      const subject=`Outcome of your Pack of Five access case — ${report.org_name}`;
      const message=`The organization access case for ${report.org_name} has been ${decision}.\n\nCase reference: ${report.id}\n\nOutcome:\n${outcome}\n\nNo ownership or access is changed automatically by this notice. Contact Pack of Five support if you believe this outcome was recorded in error.`;
      const recipients=[{audience:"reporter",email:report.reporter_email},{audience:"current_owner",email:report.current_owner_email}].filter(item=>item.email) as {audience:"reporter"|"current_owner";email:string}[];
      for(const recipient of recipients){
        const delivery=await sendClaimCaseEmail(recipient.email,subject,message);
        await sql`insert into organization_claim_case_messages(report_id,actor_user_id,audience,message_type,subject,message_body,delivery_status,recipient_email,provider_message_id,delivery_error) values(${report.id},${admin.id},${recipient.audience},'case_outcome',${subject},${message},${delivery.sent?"sent":"failed"},${recipient.email},${delivery.providerMessageId},${delivery.error})`;
      }
    }
    return NextResponse.json({ok:true,report:{id:report.id,status:report.status}});
  }catch(error){
    if(error instanceof AuthError)return NextResponse.json({error:error.message},{status:error.status});
    console.error("PATCH /api/admin/claim-issues failed:",error);
    return NextResponse.json({error:"The case could not be updated."},{status:500});
  }
}
