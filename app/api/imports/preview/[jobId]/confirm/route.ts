import { NextResponse } from "next/server";

import {
  AuthError,
  requireEffectiveOrg,
} from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";

type StoredPreflight = {
  passed?: boolean;
  selectedCount?: number;
  digest?: string;
  checkedAt?: string;
};

export async function POST(
  request: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    verifySameOrigin(request);

    const { session, orgId } =
      await requireEffectiveOrg();
    const { jobId } = await context.params;

    if (!isUuid(jobId)) {
      return NextResponse.json(
        { error: "Invalid preview reference." },
        { status: 400 }
      );
    }

    await requireCommitPermission(session.id, orgId);

    const jobs = await sql`
      select id, status, summary
      from import_jobs
      where id = ${jobId}::uuid
        and organization_id = ${orgId}::uuid
      limit 1
    `;

    if (!jobs[0]) {
      return NextResponse.json(
        { error: "Saved preview not found." },
        { status: 404 }
      );
    }

    if (String(jobs[0].status) !== "ready") {
      return NextResponse.json(
        { error: "This preview is not ready for approval." },
        { status: 409 }
      );
    }

    const summary = jobs[0].summary as {
      preflight?: StoredPreflight;
    };
    const preflight = summary?.preflight;

    if (
      !preflight?.passed ||
      !preflight.digest ||
      !preflight.selectedCount ||
      !preflight.checkedAt
    ) {
      return NextResponse.json(
        { error: "Run a successful final safety check first." },
        { status: 409 }
      );
    }

    const checkedAt = new Date(preflight.checkedAt);
    if (
      Number.isNaN(checkedAt.getTime()) ||
      Date.now() - checkedAt.getTime() > 15 * 60 * 1000
    ) {
      return NextResponse.json(
        { error: "The safety check expired. Run it again before approving." },
        { status: 409 }
      );
    }

    const rows = await sql`
      select
        id,
        sheet_name,
        row_number,
        proposed_action,
        selected,
        target_entity_id,
        source_payload,
        normalized_payload
      from import_rows
      where job_id = ${jobId}::uuid
      order by sheet_name, row_number
    `;
    const selectedRows = rows.filter((row) => Boolean(row.selected));
    const currentDigest = await createDigest(selectedRows);

    if (
      selectedRows.length !== preflight.selectedCount ||
      currentDigest !== preflight.digest
    ) {
      return NextResponse.json(
        {
          error:
            "The selected rows changed after the safety check. Run it again before approving.",
        },
        { status: 409 }
      );
    }

    const existing = await sql`
      select id, expires_at
      from import_confirmations
      where job_id = ${jobId}::uuid
        and organization_id = ${orgId}::uuid
        and preflight_digest = ${currentDigest}
        and consumed_at is null
        and revoked_at is null
        and expires_at > now()
      limit 1
    `;

    if (existing[0]) {
      return NextResponse.json({ confirmation: existing[0], reused: true });
    }

    await sql`
      update import_confirmations
      set revoked_at = now()
      where job_id = ${jobId}::uuid
        and consumed_at is null
        and revoked_at is null
    `;

    const confirmations = await sql`
      insert into import_confirmations (
        job_id,
        organization_id,
        preflight_digest,
        selected_count,
        confirmed_by,
        expires_at
      )
      values (
        ${jobId}::uuid,
        ${orgId}::uuid,
        ${currentDigest},
        ${selectedRows.length},
        ${session.id}::uuid,
        now() + interval '10 minutes'
      )
      returning id, confirmed_at, expires_at
    `;

    return NextResponse.json(
      { confirmation: confirmations[0], reused: false },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    if (error instanceof RequestSecurityError) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    console.error(
      "POST /api/imports/preview/[jobId]/confirm failed:",
      error
    );
    return NextResponse.json(
      { error: "The import approval could not be recorded." },
      { status: 500 }
    );
  }
}

async function requireCommitPermission(userId: string, orgId: string) {
  const rows = await sql`
    select id
    from user_permissions
    where user_id = ${userId}::uuid
      and permission_key = 'rescue_workbook_commit'
      and revoked_at is null
      and (organization_id is null or organization_id = ${orgId}::uuid)
    limit 1
  `;

  if (!rows[0]) {
    throw new AuthError(
      "Your account can review previews but cannot approve workbook imports.",
      403
    );
  }
}

async function createDigest(rows: unknown[]) {
  const data = new TextEncoder().encode(JSON.stringify(rows));
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
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
