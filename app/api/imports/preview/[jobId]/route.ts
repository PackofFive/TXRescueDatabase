import { NextResponse } from "next/server";

import {
  AuthError,
  requireEffectiveOrg,
} from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function GET(
  _request: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { session, orgId } =
      await requireEffectiveOrg();
    const { jobId } = await context.params;

    if (!isUuid(jobId)) {
      return NextResponse.json(
        { error: "Invalid preview reference." },
        { status: 400 }
      );
    }

    const permissions = await sql`
      select id
      from user_permissions
      where user_id = ${session.id}::uuid
        and permission_key = 'rescue_workbook_import'
        and revoked_at is null
        and (
          organization_id is null
          or organization_id = ${orgId}::uuid
        )
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
        j.template_id,
        j.schema_version,
        j.selected_sheets,
        j.summary,
        j.created_at,
        j.updated_at,
        u.email as uploaded_by_email
      from import_jobs j
      join users u on u.id = j.uploaded_by
      where j.id = ${jobId}::uuid
        and j.organization_id = ${orgId}::uuid
      limit 1
    `;

    if (!jobs[0]) {
      return NextResponse.json(
        { error: "Saved preview not found." },
        { status: 404 }
      );
    }

    const rows = await sql`
      select
        id,
        sheet_name,
        row_number,
        entity_type,
        proposed_action,
        selected,
        target_entity_id,
        source_payload,
        normalized_payload,
        messages
      from import_rows
      where job_id = ${jobId}::uuid
      order by
        case sheet_name
          when 'Animals' then 1
          when 'Medical' then 2
          when 'Tasks' then 3
          else 4
        end,
        row_number
    `;

    return NextResponse.json({
      job: jobs[0],
      rows,
      commitEnabled: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error(
      "GET /api/imports/preview/[jobId] failed:",
      error
    );
    return NextResponse.json(
      { error: "The saved preview could not be loaded." },
      { status: 500 }
    );
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}
