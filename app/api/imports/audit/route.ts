import { NextResponse } from "next/server";

import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function GET() {
  try {
    const { session, orgId } = await requireEffectiveOrg();

    const permissions = await sql`
      select id
      from user_permissions
      where user_id = ${session.id}::uuid
        and permission_key = 'rescue_workbook_import'
        and revoked_at is null
        and (organization_id is null or organization_id = ${orgId}::uuid)
      limit 1
    `;

    if (!permissions[0]) {
      throw new AuthError(
        "Your account does not have workbook import permission for this organization.",
        403
      );
    }

    const jobs = await sql`
      select
        j.id,
        j.status,
        j.summary,
        j.created_at,
        j.updated_at,
        j.committed_at,
        j.rolled_back_at,
        j.rollback_expires_at,
        uploader.email as uploaded_by_email,
        count(r.id)::int as row_count,
        count(r.id) filter (where r.selected)::int as selected_count,
        commit_event.created_at as committed_audit_at,
        commit_event.actor_email as committed_by_email,
        rollback_event.created_at as rollback_audit_at,
        rollback_event.actor_email as rolled_back_by_email,
        archive_event.created_at as archived_at,
        archive_event.actor_email as archived_by_email
      from import_jobs j
      join users uploader on uploader.id = j.uploaded_by
      left join import_rows r on r.job_id = j.id
      left join lateral (
        select al.created_at, actor.email as actor_email
        from audit_log al
        left join users actor on actor.id = al.changed_by
        where al.entity_type = 'import_job'
          and al.entity_id = j.id
          and al.field_name = 'workbook_import_committed'
        order by al.created_at desc
        limit 1
      ) commit_event on true
      left join lateral (
        select al.created_at, actor.email as actor_email
        from audit_log al
        left join users actor on actor.id = al.changed_by
        where al.entity_type = 'import_job'
          and al.entity_id = j.id
          and al.field_name = 'workbook_import_rolled_back'
        order by al.created_at desc
        limit 1
      ) rollback_event on true
      left join lateral (
        select al.created_at, actor.email as actor_email
        from audit_log al
        left join users actor on actor.id = al.changed_by
        where al.entity_type = 'import_job'
          and al.entity_id = j.id
          and al.field_name = 'workbook_preview_archived'
        order by al.created_at desc
        limit 1
      ) archive_event on true
      where j.organization_id = ${orgId}::uuid
      group by
        j.id,
        uploader.email,
        commit_event.created_at,
        commit_event.actor_email,
        rollback_event.created_at,
        rollback_event.actor_email,
        archive_event.created_at,
        archive_event.actor_email
      order by j.created_at desc
      limit 500
    `;

    return NextResponse.json({ jobs });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("GET /api/imports/audit failed:", error);
    return NextResponse.json(
      { error: "The import audit report could not be loaded." },
      { status: 500 }
    );
  }
}
