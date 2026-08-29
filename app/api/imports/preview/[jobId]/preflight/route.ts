import { NextResponse } from "next/server";

import {
  AuthError,
  requireEffectiveOrg,
} from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";

type PreviewRow = {
  id: string;
  sheet_name: string;
  row_number: number;
  proposed_action: string;
  selected: boolean;
  target_entity_id: string | null;
  source_payload: Record<string, string>;
  normalized_payload: {
    mappedFields?: unknown[];
    deferredFields?: Array<{ source?: string }>;
  };
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

    await requireImportPermission(session.id, orgId);

    const jobs = await sql`
      select id, status
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

    if (!["ready", "blocked"].includes(String(jobs[0].status))) {
      return NextResponse.json(
        { error: "This preview is no longer open for confirmation." },
        { status: 409 }
      );
    }

    const rows = (await sql`
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
    `) as unknown as PreviewRow[];

    const selected = rows.filter((row) => row.selected);
    const issues: string[] = [];

    if (selected.length === 0) {
      issues.push("Select at least one Create or Update row.");
    }

    if (rows.some((row) => row.proposed_action === "error")) {
      issues.push("The preview still contains validation errors.");
    }

    if (rows.some((row) => row.proposed_action === "warning")) {
      issues.push("The preview still contains rows requiring review.");
    }

    for (const row of selected) {
      if (!["create", "update"].includes(row.proposed_action)) {
        issues.push(`${row.sheet_name} row ${row.row_number} is not ready.`);
      }

      const mapped = row.normalized_payload?.mappedFields ?? [];
      const deferred = row.normalized_payload?.deferredFields ?? [];

      if (mapped.length === 0) {
        issues.push(
          `${row.sheet_name} row ${row.row_number} has no approved fields to import.`
        );
      }

      if (deferred.length > 0) {
        const names = deferred
          .map((field) => field.source)
          .filter(Boolean)
          .join(", ");
        issues.push(
          `${row.sheet_name} row ${row.row_number} has deferred fields${
            names ? `: ${names}` : ""
          }.`
        );
      }
    }

    const selectedUpdates = selected.filter(
      (row) => row.proposed_action === "update"
    );
    const missingTargets = await findMissingUpdateTargets(
      selectedUpdates,
      orgId
    );
    issues.push(...missingTargets);

    const keyConflicts = await findNewKeyConflicts(
      selected.filter((row) => row.proposed_action === "create"),
      orgId
    );
    issues.push(...keyConflicts);

    const uniqueIssues = Array.from(new Set(issues));
    const digest = await createDigest(selected);
    const report = {
      passed: uniqueIssues.length === 0,
      selectedCount: selected.length,
      issues: uniqueIssues,
      digest,
      checkedAt: new Date().toISOString(),
      checkedBy: session.id,
    };

    await sql`
      update import_jobs
      set
        summary = summary || ${JSON.stringify({ preflight: report })}::jsonb,
        updated_at = now()
      where id = ${jobId}::uuid
        and organization_id = ${orgId}::uuid
    `;

    return NextResponse.json({ preflight: report });
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
      "POST /api/imports/preview/[jobId]/preflight failed:",
      error
    );
    return NextResponse.json(
      { error: "The final safety check could not be completed." },
      { status: 500 }
    );
  }
}

async function findMissingUpdateTargets(
  rows: PreviewRow[],
  orgId: string
) {
  if (rows.length === 0) return [];

  const targets = rows.map((row) => ({
    sheet_name: row.sheet_name,
    row_number: row.row_number,
    entity_id: row.target_entity_id,
  }));
  const existing = await sql`
    with targets as (
      select *
      from jsonb_to_recordset(${JSON.stringify(targets)}::jsonb)
        as item(sheet_name text, row_number integer, entity_id text)
    )
    select t.sheet_name, t.row_number
    from targets t
    where
      (t.sheet_name = 'Animals' and exists (
        select 1 from animals a
        where a.id::text = t.entity_id
          and a.current_org_id = ${orgId}::uuid
      ))
      or (t.sheet_name = 'Medical' and exists (
        select 1
        from animal_medical_records m
        join animals a on a.id = m.animal_id
        where m.id::text = t.entity_id
          and a.current_org_id = ${orgId}::uuid
      ))
      or (t.sheet_name = 'Tasks' and exists (
        select 1 from animal_reminders r
        where r.id::text = t.entity_id
          and r.org_id = ${orgId}::uuid
      ))
  `;
  const found = new Set(
    existing.map(
      (row) => `${String(row.sheet_name)}:${Number(row.row_number)}`
    )
  );

  return rows
    .filter(
      (row) =>
        !row.target_entity_id ||
        !found.has(`${row.sheet_name}:${row.row_number}`)
    )
    .map(
      (row) =>
        `${row.sheet_name} row ${row.row_number} no longer has an exact organization-scoped update target.`
    );
}

async function findNewKeyConflicts(
  rows: PreviewRow[],
  orgId: string
) {
  const keys = rows
    .map((row) => ({
      sheet_name: row.sheet_name,
      row_number: row.row_number,
      entity_type:
        row.sheet_name === "Animals"
          ? "animal"
          : row.sheet_name === "Medical"
          ? "medical"
          : "task",
      external_id:
        row.sheet_name === "Animals"
          ? row.source_payload.animal_id
          : row.sheet_name === "Medical"
          ? row.source_payload.external_medical_record_id
          : row.source_payload.task_id,
    }))
    .filter((key) => Boolean(key.external_id));

  if (keys.length === 0) return [];

  const conflicts = await sql`
    with requested as (
      select *
      from jsonb_to_recordset(${JSON.stringify(keys)}::jsonb) as item(
        sheet_name text,
        row_number integer,
        entity_type text,
        external_id text
      )
    )
    select r.sheet_name, r.row_number
    from requested r
    join import_entity_keys k
      on k.organization_id = ${orgId}::uuid
     and k.entity_type = r.entity_type
     and k.external_id = r.external_id
  `;

  return conflicts.map(
    (row) =>
      `${String(row.sheet_name)} row ${Number(row.row_number)} now conflicts with an existing stable ID.`
  );
}

async function createDigest(rows: PreviewRow[]) {
  const data = new TextEncoder().encode(JSON.stringify(rows));
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function requireImportPermission(userId: string, orgId: string) {
  const permissions = await sql`
    select id
    from user_permissions
    where user_id = ${userId}::uuid
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
