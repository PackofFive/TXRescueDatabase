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
} from "@/lib/rescueWorkbookTypes";
import { mapWorkbookRow } from "@/lib/rescueWorkbookMapping";

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

export async function GET() {
  try {
    const { session, orgId } =
      await requireEffectiveOrg();

    await requireImportPermission(session.id, orgId);

    const jobs = await sql`
      select
        j.id,
        j.status,
        j.template_id,
        j.schema_version,
        j.summary,
        j.created_at,
        j.updated_at,
        j.committed_at,
        j.rolled_back_at,
        u.email as uploaded_by_email,
        count(r.id)::int as row_count,
        count(r.id) filter (where r.selected)::int as selected_count
      from import_jobs j
      join users u on u.id = j.uploaded_by
      left join import_rows r on r.job_id = j.id
      where j.organization_id = ${orgId}::uuid
        and j.status <> 'archived'
      group by j.id, u.email
      order by j.created_at desc
      limit 50
    `;

    return NextResponse.json({ jobs });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("GET /api/imports/preview failed:", error);
    return NextResponse.json(
      { error: "Import history could not be loaded." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let jobId: string | null = null;

  try {
    const { session, orgId } =
      await requireEffectiveOrg();

    await requireImportPermission(session.id, orgId);

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

    let matchCounts = {
      creates: 0,
      updates: 0,
      reviews: 0,
      errors: 0,
    };

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

      matchCounts = await matchPreviewRows(
        jobId,
        orgId,
        preview
      );

      await sql`
        update import_jobs
        set
          summary = summary || ${JSON.stringify({ matchCounts })}::jsonb,
          updated_at = now()
        where id = ${jobId}::uuid
      `;
    }

    return NextResponse.json(
      {
        jobId,
        status:
          matchCounts.errors > 0 ? "blocked" : status,
        reused: false,
        matchCounts,
      },
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

async function requireImportPermission(
  userId: string,
  orgId: string
) {
  const permissions = await sql`
    select id
    from user_permissions
    where user_id = ${userId}::uuid
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
}

async function matchPreviewRows(
  jobId: string,
  orgId: string,
  preview: WorkbookPreview
) {
  const requestedKeys = preview.rows
    .filter((row) => Boolean(row.recordId))
    .map((row) => ({
      entity_type: entityTypeForSheet(row.sheet),
      external_id: row.recordId,
    }));

  const animalReferences = preview.rows
    .map((row) => row.values.animal_id)
    .filter(Boolean)
    .map((externalId) => ({
      entity_type: "animal",
      external_id: externalId,
    }));

  const requested = uniqueRequestedKeys([
    ...requestedKeys,
    ...animalReferences,
  ]);
  const matches = new Map<string, string>();

  if (requested.length > 0) {
    const keyRows = await sql`
      with requested as (
        select *
        from jsonb_to_recordset(${JSON.stringify(requested)}::jsonb)
          as item(entity_type text, external_id text)
      )
      select
        k.entity_type,
        k.external_id,
        k.entity_id::text as entity_id
      from import_entity_keys k
      join requested r
        on r.entity_type = k.entity_type
       and r.external_id = k.external_id
      where k.organization_id = ${orgId}::uuid

      union all

      select
        'animal' as entity_type,
        a.id::text as external_id,
        a.id::text as entity_id
      from animals a
      join requested r
        on r.entity_type = 'animal'
       and r.external_id = a.id::text
      where a.current_org_id = ${orgId}::uuid
    `;

    for (const row of keyRows) {
      matches.set(
        `${String(row.entity_type)}:${String(row.external_id)}`,
        String(row.entity_id)
      );
    }
  }

  const workbookAnimalIds = new Set(
    preview.rows
      .filter((row) => row.sheet === "Animals")
      .map((row) => row.recordId)
      .filter(Boolean)
  );
  const matchedRows = preview.rows.map((row) => {
    const entityType = entityTypeForSheet(row.sheet);
    const targetEntityId = row.recordId
      ? matches.get(`${entityType}:${row.recordId}`) ?? null
      : null;
    const messages = [...row.messages];
    const mapping = mapWorkbookRow(row.sheet, row.values);
    messages.push(...mapping.warnings);
    let proposedAction: "create" | "update" | "warning" | "error";
    const requiresFormulaReview = row.messages.some(
      (message) => message.startsWith("Formula detected")
    );

    if (row.action === "error") {
      proposedAction = "error";
    } else if (
      row.sheet !== "Animals" &&
      row.values.animal_id &&
      !workbookAnimalIds.has(row.values.animal_id) &&
      !matches.has(`animal:${row.values.animal_id}`)
    ) {
      proposedAction = "error";
      messages.push(
        "Animal ID did not exactly match an animal in this organization or the workbook."
      );
    } else if (requiresFormulaReview) {
      proposedAction = "warning";
    } else if (targetEntityId) {
      proposedAction = "update";
      messages.push(
        "Stable ID exactly matched a record in this organization."
      );
    } else {
      proposedAction = "create";
      if (row.recordId) {
        messages.push(
          "Stable ID is new for this organization and will be reserved for a new record after confirmation."
        );
      }
    }

    return {
      sheet_name: row.sheet,
      row_number: row.rowNumber,
      proposed_action: proposedAction,
      selected:
        proposedAction === "create" ||
        proposedAction === "update",
      target_entity_id: targetEntityId,
      normalized_payload: {
        exactMatch: Boolean(targetEntityId),
        externalId: row.recordId || null,
        mappedFields: mapping.mappedFields,
        deferredFields: mapping.deferredFields,
      },
      messages,
    };
  });

  await sql`
    update import_rows target
    set
      proposed_action = matched.proposed_action,
      selected = matched.selected,
      target_entity_id = matched.target_entity_id,
      normalized_payload = matched.normalized_payload,
      messages = matched.messages,
      updated_at = now()
    from jsonb_to_recordset(${JSON.stringify(matchedRows)}::jsonb) as matched(
      sheet_name text,
      row_number integer,
      proposed_action text,
      selected boolean,
      target_entity_id text,
      normalized_payload jsonb,
      messages jsonb
    )
    where target.job_id = ${jobId}::uuid
      and target.sheet_name = matched.sheet_name
      and target.row_number = matched.row_number
  `;

  const counts = {
    creates: matchedRows.filter(
      (row) => row.proposed_action === "create"
    ).length,
    updates: matchedRows.filter(
      (row) => row.proposed_action === "update"
    ).length,
    reviews: matchedRows.filter(
      (row) => row.proposed_action === "warning"
    ).length,
    errors: matchedRows.filter(
      (row) => row.proposed_action === "error"
    ).length,
  };

  await sql`
    update import_jobs
    set
      status = ${counts.errors > 0 ? "blocked" : "ready"},
      updated_at = now()
    where id = ${jobId}::uuid
  `;

  return counts;
}

function entityTypeForSheet(sheet: string) {
  if (sheet === "Animals") return "animal";
  if (sheet === "Medical") return "medical";
  return "task";
}

function uniqueRequestedKeys(
  keys: Array<{
    entity_type: string;
    external_id: string;
  }>
) {
  const unique = new Map<string, (typeof keys)[number]>();

  for (const key of keys) {
    unique.set(
      `${key.entity_type}:${key.external_id}`,
      key
    );
  }

  return Array.from(unique.values());
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
