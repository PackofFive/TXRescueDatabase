import { NextResponse } from "next/server";

import {
  AuthError,
  requireEffectiveOrg,
} from "@/lib/auth";
import { sql } from "@/lib/db";
import {
  RESCUE_WORKBOOK_MAX_ROWS,
  RESCUE_WORKBOOK_SCHEMA_VERSION,
  RESCUE_WORKBOOK_TEMPLATE_ID,
  type WorkbookPreview,
} from "@/lib/rescueWorkbookPreview";

export const runtime = "edge";

const ALLOWED_SHEETS = new Set([
  "Animals",
  "Medical",
  "Tasks",
]);

type PreviewRequest = {
  preview?: WorkbookPreview;
  idempotencyKey?: string;
};

export async function POST(request: Request) {
  let jobId: string | null = null;

  try {
    const { session, orgId } =
      await requireEffectiveOrg();

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

    const body = (await request.json()) as PreviewRequest;
    const preview = body.preview;
    const idempotencyKey = body.idempotencyKey?.trim();

    validatePreview(preview, idempotencyKey);

    const existing = await sql`
      select id, status
      from import_jobs
      where organization_id = ${orgId}::uuid
        and idempotency_key = ${idempotencyKey}
      limit 1
    `;

    if (existing[0]) {
      return NextResponse.json({
        jobId: String(existing[0].id),
        status: String(existing[0].status),
        reused: true,
      });
    }

    const status =
      preview.counts.errors > 0 ? "blocked" : "ready";
    const selectedSheets = preview.sheets.map(
      (sheet) => sheet.sheet
    );
    const summary = {
      ...preview.counts,
      fileName: preview.fileName,
      fileSize: preview.fileSize,
      sheets: preview.sheets,
      deferredSheets: preview.deferredSheets,
      source: "browser_preview",
      workbookStored: false,
    };

    const jobs = await sql`
      insert into import_jobs (
        organization_id,
        uploaded_by,
        template_id,
        schema_version,
        status,
        selected_sheets,
        summary,
        idempotency_key
      )
      values (
        ${orgId}::uuid,
        ${session.id}::uuid,
        ${preview.templateId},
        ${preview.schemaVersion},
        ${status},
        ${selectedSheets}::text[],
        ${JSON.stringify(summary)}::jsonb,
        ${idempotencyKey}
      )
      returning id
    `;

    jobId = String(jobs[0].id);

    if (preview.rows.length > 0) {
      const rows = preview.rows.map((row) => ({
        sheet_name: row.sheet,
        row_number: row.rowNumber,
        entity_type: row.sheet.toLowerCase(),
        proposed_action:
          row.action === "review" ? "warning" : row.action,
        selected: row.action === "create",
        target_entity_id: row.recordId || null,
        source_payload: row.values,
        normalized_payload: {},
        messages: row.messages,
      }));

      await sql`
        insert into import_rows (
          job_id,
          sheet_name,
          row_number,
          entity_type,
          proposed_action,
          selected,
          target_entity_id,
          source_payload,
          normalized_payload,
          messages
        )
        select
          ${jobId}::uuid,
          item.sheet_name,
          item.row_number,
          item.entity_type,
          item.proposed_action,
          item.selected,
          item.target_entity_id,
          item.source_payload,
          item.normalized_payload,
          item.messages
        from jsonb_to_recordset(${JSON.stringify(rows)}::jsonb) as item(
          sheet_name text,
          row_number integer,
          entity_type text,
          proposed_action text,
          selected boolean,
          target_entity_id text,
          source_payload jsonb,
          normalized_payload jsonb,
          messages jsonb
        )
      `;
    }

    return NextResponse.json(
      { jobId, status, reused: false },
      { status: 201 }
    );
  } catch (error) {
    if (jobId) {
      try {
        await sql`
          update import_jobs
          set
            status = 'failed',
            error_message = 'Preview rows could not be saved.',
            updated_at = now()
          where id = ${jobId}::uuid
            and status in ('created', 'ready', 'blocked')
        `;
      } catch (cleanupError) {
        console.error(
          "Could not mark failed import preview job:",
          cleanupError
        );
      }
    }

    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    if (error instanceof PreviewRequestError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error("POST /api/imports/preview failed:", error);
    return NextResponse.json(
      { error: "The secure preview could not be saved." },
      { status: 500 }
    );
  }
}

class PreviewRequestError extends Error {}

function validatePreview(
  preview: WorkbookPreview | undefined,
  idempotencyKey: string | undefined
): asserts preview is WorkbookPreview {
  if (!preview || typeof preview !== "object") {
    throw new PreviewRequestError("Preview data is required.");
  }

  if (
    preview.templateId !== RESCUE_WORKBOOK_TEMPLATE_ID ||
    preview.schemaVersion !== RESCUE_WORKBOOK_SCHEMA_VERSION
  ) {
    throw new PreviewRequestError(
      "The workbook template or schema version is not supported."
    );
  }

  if (
    !idempotencyKey ||
    idempotencyKey.length > 100 ||
    !/^[A-Za-z0-9_-]+$/.test(idempotencyKey)
  ) {
    throw new PreviewRequestError(
      "A valid preview request identifier is required."
    );
  }

  if (
    !Array.isArray(preview.rows) ||
    preview.rows.length > RESCUE_WORKBOOK_MAX_ROWS * 3
  ) {
    throw new PreviewRequestError(
      "The workbook preview contains too many rows."
    );
  }

  for (const row of preview.rows) {
    if (
      !ALLOWED_SHEETS.has(row.sheet) ||
      !Number.isInteger(row.rowNumber) ||
      row.rowNumber < 4 ||
      !["create", "review", "error"].includes(row.action) ||
      typeof row.values !== "object" ||
      !Array.isArray(row.messages)
    ) {
      throw new PreviewRequestError(
        "The workbook preview contains an invalid row."
      );
    }
  }
}
