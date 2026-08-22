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

async function requireMedicationAccess(
  animalId: string,
  medicationId: string
) {
  const {
    session,
    orgId,
  } =
    await requireEffectiveOrg();

  const rows = await sql`
    select
      am.id,
      am.medication_name,
      am.frequency,
      am.next_due_at,
      am.active

    from animal_medications am

    join animals a
      on a.id = am.animal_id

    where
      am.id = ${medicationId}
      and am.animal_id = ${animalId}
      and a.current_org_id = ${orgId}

    limit 1
  `;

  if (!rows[0]) {
    throw new AuthError(
      "Medication not found or you do not have access to it.",
      404
    );
  }

  return {
    session,
    orgId,
    medication: rows[0],
  };
}

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      medicationId: string;
    }>;
  }
) {
  try {
    const {
      id: animalId,
      medicationId,
    } = await params;

    const {
      session,
      orgId,
      medication,
    } =
      await requireMedicationAccess(
        animalId,
        medicationId
      );

    const body =
      await req
        .json()
        .catch(() => null);

    const administeredAt =
      body?.administeredAt
        ? new Date(
            body.administeredAt
          )
        : new Date();

    if (
      Number.isNaN(
        administeredAt.getTime()
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Dose time is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    const doseGiven =
      cleanText(
        body?.doseGiven
      );

    const notes =
      cleanText(
        body?.notes
      );

    const intervalHours =
      frequencyToHours(
        medication.frequency
      );

    /*
      If the schedule is recognized, the dose just given
      becomes the new scheduling anchor.

      Any old manually-entered next_due_at is deliberately
      replaced.

      If the frequency cannot be interpreted safely,
      preserve the existing next_due_at instead of clearing it.
    */

    const nextDueAt =
      intervalHours !== null
        ? new Date(
            administeredAt.getTime() +
              intervalHours *
                60 *
                60 *
                1000
          ).toISOString()
        : medication.next_due_at
        ? new Date(
            medication.next_due_at
          ).toISOString()
        : null;

    const administrationRows =
      await sql`
        insert into animal_medication_administrations (
          medication_id,
          animal_id,
          org_id,
          administered_at,
          dose_given,
          notes,
          recorded_by
        )

        values (
          ${medicationId},
          ${animalId},
          ${orgId},
          ${administeredAt.toISOString()},
          ${doseGiven},
          ${notes},
          ${session.id}
        )

        returning
          id,
          medication_id,
          animal_id,
          administered_at,
          dose_given,
          notes,
          created_at
      `;

    const medicationRows =
      await sql`
        update animal_medications

        set
          next_due_at =
            ${nextDueAt},

          updated_at =
            now()

        where
          id =
            ${medicationId}

        returning *
      `;

    try {
      await sql`
        insert into audit_log (
          entity_type,
          entity_id,
          changed_by,
          field_name,
          new_value
        )

        values (
          'animal',
          ${animalId},
          ${session.id},
          'medication_dose_given',
          ${JSON.stringify({
            medicationId,
            medicationName:
              medication.medication_name,
            administeredAt:
              administeredAt.toISOString(),
            previousNextDueAt:
              medication.next_due_at,
            nextDueAt,
            automaticNextDue:
              intervalHours !== null,
          })}
        )
      `;
    } catch (auditError) {
      console.error(
        "Medication administration audit failed:",
        auditError
      );
    }

    return NextResponse.json({
      administration:
        administrationRows[0],

      medication:
        medicationRows[0],

      nextDueCalculated:
        intervalHours !== null,
    });
  } catch (err) {
    if (
      err instanceof AuthError
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
      "POST medication dose failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't record medication dose.",
      },
      {
        status: 500,
      }
    );
  }
}

function cleanText(
  value: unknown
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const text =
    String(value).trim();

  return text || null;
}

function frequencyToHours(
  frequency:
    | string
    | null
) {
  if (!frequency) {
    return null;
  }

  const value =
    frequency
      .trim()
      .toLowerCase();

  if (
    [
      "daily",
      "once daily",
      "once a day",
      "every day",
      "every 24 hours",
      "every 24 hrs",
      "q24h",
    ].includes(value)
  ) {
    return 24;
  }

  if (
    [
      "twice daily",
      "twice a day",
      "2x daily",
      "2x a day",
      "every 12 hours",
      "every 12 hrs",
      "q12h",
    ].includes(value)
  ) {
    return 12;
  }

  if (
    [
      "three times daily",
      "three times a day",
      "3x daily",
      "3x a day",
      "every 8 hours",
      "every 8 hrs",
      "q8h",
    ].includes(value)
  ) {
    return 8;
  }

  if (
    [
      "four times daily",
      "four times a day",
      "4x daily",
      "4x a day",
      "every 6 hours",
      "every 6 hrs",
      "q6h",
    ].includes(value)
  ) {
    return 6;
  }

  const everyHours =
    value.match(
      /every\s+(\d+(?:\.\d+)?)\s*(?:hours|hour|hrs|hr)/
    );

  if (everyHours) {
    const hours =
      Number(
        everyHours[1]
      );

    if (
      Number.isFinite(
        hours
      ) &&
      hours > 0
    ) {
      return hours;
    }
  }

  const qHours =
    value.match(
      /^q(\d+(?:\.\d+)?)h$/
    );

  if (qHours) {
    const hours =
      Number(
        qHours[1]
      );

    if (
      Number.isFinite(
        hours
      ) &&
      hours > 0
    ) {
      return hours;
    }
  }

  return null;
}
