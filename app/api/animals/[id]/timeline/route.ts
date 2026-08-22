import {
  NextRequest,
  NextResponse,
} from "next/server";

import { sql } from "@/lib/db";

import {
  requireEffectiveOrg,
  AuthError,
} from "@/lib/auth";

export const runtime = "edge";

async function requireAnimalAccess(
  animalId: string
) {
  const {
    orgId,
  } =
    await requireEffectiveOrg();

  const rows =
    await sql`
      select
        id

      from animals

      where
        id = ${animalId}

        and
        current_org_id =
          ${orgId}

      limit 1
    `;

  if (!rows[0]) {
    throw new AuthError(
      "Animal not found or you do not have access to this record.",
      404
    );
  }

  return {
    orgId,
  };
}

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const {
      id: animalId,
    } =
      await params;

    const {
      orgId,
    } =
      await requireAnimalAccess(
        animalId
      );

    const custodyRows =
      await sql`
        select
          ace.id,
          ace.event_type,
          ace.started_at,
          ace.org_id

        from animal_custody_events ace

        where
          ace.animal_id =
            ${animalId}

        order by
          ace.started_at desc
      `;

    const auditRows =
      await sql`
        select
          al.id,
          al.field_name,
          al.new_value,
          al.created_at,
          al.changed_by,

          u.email as changed_by_email

        from audit_log al

        left join users u
          on u.id =
            al.changed_by

        where
          al.entity_type =
            'animal'

          and
          al.entity_id =
            ${animalId}

        order by
          al.created_at desc
      `;

    const events = [
      ...custodyRows.map(
        (row) => ({
          id:
            `custody:${row.id}`,

          source:
            "custody",

          eventType:
            String(
              row.event_type
            ),

          occurredAt:
            row.started_at,

          title:
            formatEventTitle(
              String(
                row.event_type
              )
            ),

          detail:
            null,

          actorEmail:
            null,

          rawValue:
            null,
        })
      ),

      ...auditRows.map(
        (row) => ({
          id:
            `audit:${row.id}`,

          source:
            "audit",

          eventType:
            String(
              row.field_name
            ),

          occurredAt:
            row.created_at,

          title:
            formatEventTitle(
              String(
                row.field_name
              )
            ),

          detail:
            summarizeAuditValue(
              row.new_value
            ),

          actorEmail:
            row.changed_by_email ??
            null,

          rawValue:
            row.new_value ??
            null,
        })
      ),
    ].sort(
      (a, b) =>
        new Date(
          b.occurredAt
        ).getTime() -
        new Date(
          a.occurredAt
        ).getTime()
    );

    return NextResponse.json({
      animalId,
      orgId,
      events,
    });
  } catch (err) {
    if (
      err instanceof
      AuthError
    ) {
      return NextResponse.json(
        {
          error:
            err.message,
        },
        {
          status:
            err.status,
        }
      );
    }

    console.error(
      "GET animal timeline failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load animal timeline.",
      },
      {
        status: 500,
      }
    );
  }
}

function formatEventTitle(
  value: string
) {
  const labels:
    Record<
      string,
      string
    > = {
    animal_updated:
      "Animal record updated",

    medical_document_uploaded:
      "Veterinary record uploaded",

    medication_dose_given:
      "Medication dose recorded",

    medication_added:
      "Medication added",

    medication_updated:
      "Medication updated",

    medication_deleted:
      "Medication removed",

    behavior_profile_updated:
      "Behavior profile updated",

    behavior_observation_added:
      "Behavior observation added",

    behavior_observation_updated:
      "Behavior observation updated",

    document_uploaded:
      "Document uploaded",

    document_updated:
      "Document updated",

    document_deleted:
      "Document deleted",

    profile_photo_changed:
      "Profile photo changed",

    profile_photo_removed:
      "Profile photo removed",

    expense_added:
      "Expense added",

    expense_updated:
      "Expense updated",

    expense_deleted:
      "Expense deleted",

    reminder_created:
      "Reminder created",

    reminder_updated:
      "Reminder updated",

    reminder_completed:
      "Reminder completed",

    outcome_recorded:
      "Outcome recorded",

    outcome_updated:
      "Outcome updated",

    outcome_removed:
      "Outcome removed",

    foster_offer_updated:
      "Foster/help offer updated",
  };

  if (
    labels[value]
  ) {
    return labels[value];
  }

  return value
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

function summarizeAuditValue(
  value: unknown
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  if (
    typeof value ===
    "object"
  ) {
    return summarizeObject(
      value as Record<
        string,
        unknown
      >
    );
  }

  const text =
    String(
      value
    ).trim();

  if (!text) {
    return null;
  }

  try {
    const parsed =
      JSON.parse(
        text
      );

    if (
      parsed &&
      typeof parsed ===
        "object" &&
      !Array.isArray(
        parsed
      )
    ) {
      return summarizeObject(
        parsed as Record<
          string,
          unknown
        >
      );
    }
  } catch {
    // Plain text.
  }

  return text.length >
    220
    ? `${text.slice(
        0,
        217
      )}...`
    : text;
}

function summarizeObject(
  value:
    Record<
      string,
      unknown
    >
) {
  const preferredKeys = [
    "medicationName",
    "filename",
    "documentTitle",
    "title",
    "outcomeType",
    "outcomeDate",
    "nextDueAt",
    "administeredAt",
    "category",
    "visibility",
    "status",
    "amount",
    "vendor",
    "reason",
  ];

  const parts:
    string[] =
    [];

  for (
    const key of
    preferredKeys
  ) {
    const item =
      value[key];

    if (
      item ===
        null ||
      item ===
        undefined ||
      item ===
        ""
    ) {
      continue;
    }

    parts.push(
      `${formatKey(
        key
      )}: ${String(
        item
      )}`
    );

    if (
      parts.length >=
      3
    ) {
      break;
    }
  }

  if (
    parts.length >
    0
  ) {
    return parts.join(
      " · "
    );
  }

  const entries =
    Object.entries(
      value
    )
      .filter(
        ([, item]) =>
          item !==
            null &&
          item !==
            undefined &&
          item !==
            ""
      )
      .slice(
        0,
        3
      );

  if (
    entries.length ===
    0
  ) {
    return null;
  }

  return entries
    .map(
      ([
        key,
        item,
      ]) =>
        `${formatKey(
          key
        )}: ${String(
          item
        )}`
    )
    .join(
      " · "
    );
}

function formatKey(
  value: string
) {
  return value
    .replace(
      /([a-z])([A-Z])/g,
      "$1 $2"
    )
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}
