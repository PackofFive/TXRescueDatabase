import { NextResponse } from "next/server";

import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    verifySameOrigin(request);
    const { session, orgId } = await requireEffectiveOrg();
    const body = (await request.json()) as { jobId?: string };

    if (!body.jobId || !isUuid(body.jobId)) {
      return NextResponse.json(
        { error: "A valid import reference is required." },
        { status: 400 }
      );
    }

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
      update import_jobs
      set
        status = 'archived',
        updated_at = now()
      where id = ${body.jobId}::uuid
        and organization_id = ${orgId}::uuid
        and status in ('created', 'ready', 'blocked', 'failed', 'expired')
      returning id
    `;

    if (!jobs[0]) {
      return NextResponse.json(
        {
          error:
            "Only previews that have not been imported can be archived.",
        },
        { status: 409 }
      );
    }

    await sql`
      update import_confirmations
      set revoked_at = now()
      where job_id = ${body.jobId}::uuid
        and consumed_at is null
        and revoked_at is null
    `;

    await sql`
      insert into audit_log (
        entity_type, entity_id, changed_by, field_name, old_value, new_value
      )
      values (
        'import_job', ${body.jobId}::uuid, ${session.id}::uuid,
        'workbook_preview_archived', 'active', 'archived'
      )
    `;

    return NextResponse.json({ archived: true, jobId: body.jobId });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof RequestSecurityError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error("POST import archive failed:", error);
    return NextResponse.json(
      { error: "The import preview could not be archived." },
      { status: 500 }
    );
  }
}

class RequestSecurityError extends Error {}

function verifySameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    throw new RequestSecurityError("Request origin was not accepted.");
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
