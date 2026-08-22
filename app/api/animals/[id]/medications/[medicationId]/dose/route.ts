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

type ParsedSchedule = {
  intervalHours: number | null;
  scheduleType:
    | "interval"
    | "prn"
    | "complex"
    | "unknown";
};

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
    medication:
      rows[0],
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

    /*
      Interpret the stored frequency.

      IMPORTANT:
      We do NOT rewrite the medication frequency here.

      The rescue can keep the original wording, such as:
      "2x daily"
      "BID"
      "morning and evening"

      We only convert it internally when calculating the
      next reminder.
    */

    const schedule =
      parseMedicationSchedule(
        medication.frequency
      );

    /*
      For a predictable interval schedule, the actual
      administration time becomes the new scheduling anchor.

      Example:
      Twice daily + dose at 8:05 AM
      => next due 8:05 PM.

      PRN/as-needed medications intentionally receive no
      automatically-calculated next dose.

      Complex schedules are preserved for human review rather
      than guessed.
    */

    let nextDueAt:
      | string
      | null;

    if (
      schedule.scheduleType ===
        "interval" &&
      schedule.intervalHours !==
        null
    ) {
      nextDueAt =
        new Date(
          administeredAt.getTime() +
            schedule.intervalHours *
              60 *
              60 *
              1000
        ).toISOString();
    } else if (
      schedule.scheduleType ===
      "prn"
    ) {
      nextDueAt =
        null;
    } else {
      /*
        Unknown or complex schedule:
        preserve the existing manually-entered due date.

        Never invent a schedule.
      */

      nextDueAt =
        medication.next_due_at
          ? new Date(
              medication.next_due_at
            ).toISOString()
          : null;
    }

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
          recorded_by,
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

            frequency:
              medication.frequency,

            interpretedSchedule:
              schedule.scheduleType,

            intervalHours:
              schedule.intervalHours,

            administeredAt:
              administeredAt.toISOString(),

            previousNextDueAt:
              medication.next_due_at,

            nextDueAt,

            automaticNextDue:
              schedule.scheduleType ===
                "interval",
          })}
        )
      `;
    } catch (
      auditError
    ) {
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
        schedule.scheduleType ===
          "interval",

      scheduleType:
        schedule.scheduleType,

      intervalHours:
        schedule.intervalHours,
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

/* =========================================================
   SCHEDULE INTERPRETER
========================================================= */

function parseMedicationSchedule(
  frequency:
    | string
    | null
): ParsedSchedule {
  if (!frequency) {
    return {
      intervalHours: null,
      scheduleType:
        "unknown",
    };
  }

  let value =
    frequency
      .trim()
      .toLowerCase();

  /*
    Normalize punctuation and spacing.

    Examples:
    "B.I.D."
    "2 X Daily"
    "q 12 h"
  */

  value =
    value
      .replace(
        /[.,]/g,
        ""
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  /* -----------------------------------------------------
     PRN / AS NEEDED

     No automatic next dose should be generated.
  ----------------------------------------------------- */

  if (
    value === "prn" ||
    value.includes(
      "as needed"
    ) ||
    value.includes(
      "when needed"
    ) ||
    value.includes(
      "if needed"
    )
  ) {
    return {
      intervalHours: null,
      scheduleType:
        "prn",
    };
  }

  /* -----------------------------------------------------
     DAILY / EVERY 24 HOURS
  ----------------------------------------------------- */

  if (
    [
      "daily",
      "once daily",
      "once a day",
      "1x daily",
      "1x a day",
      "1 x daily",
      "1 x a day",
      "one time daily",
      "one time a day",
      "every day",
      "every 24 hours",
      "every 24 hrs",
      "every 24 hr",
      "q24h",
      "q 24 h",
      "qd",
    ].includes(
      value
    )
  ) {
    return {
      intervalHours: 24,
      scheduleType:
        "interval",
    };
  }

  /* -----------------------------------------------------
     TWICE DAILY / EVERY 12 HOURS
  ----------------------------------------------------- */

  if (
    [
      "twice daily",
      "twice a day",
      "2x daily",
      "2x a day",
      "2 x daily",
      "2 x a day",
      "2 times daily",
      "2 times a day",
      "two times daily",
      "two times a day",
      "morning and evening",
      "morning & evening",
      "am and pm",
      "am & pm",
      "every 12 hours",
      "every 12 hrs",
      "every 12 hr",
      "q12h",
      "q 12 h",
      "bid",
    ].includes(
      value
    )
  ) {
    return {
      intervalHours: 12,
      scheduleType:
        "interval",
    };
  }

  /* -----------------------------------------------------
     THREE TIMES DAILY / EVERY 8 HOURS
  ----------------------------------------------------- */

  if (
    [
      "three times daily",
      "three times a day",
      "3 times daily",
      "3 times a day",
      "3x daily",
      "3x a day",
      "3 x daily",
      "3 x a day",
      "every 8 hours",
      "every 8 hrs",
      "every 8 hr",
      "q8h",
      "q 8 h",
      "tid",
    ].includes(
      value
    )
  ) {
    return {
      intervalHours: 8,
      scheduleType:
        "interval",
    };
  }

  /* -----------------------------------------------------
     FOUR TIMES DAILY / EVERY 6 HOURS
  ----------------------------------------------------- */

  if (
    [
      "four times daily",
      "four times a day",
      "4 times daily",
      "4 times a day",
      "4x daily",
      "4x a day",
      "4 x daily",
      "4 x a day",
      "every 6 hours",
      "every 6 hrs",
      "every 6 hr",
      "q6h",
      "q 6 h",
      "qid",
    ].includes(
      value
    )
  ) {
    return {
      intervalHours: 6,
      scheduleType:
        "interval",
    };
  }

  /* -----------------------------------------------------
     EVERY OTHER DAY
  ----------------------------------------------------- */

  if (
    [
      "every other day",
      "every 2 days",
      "every two days",
      "q48h",
      "q 48 h",
    ].includes(
      value
    )
  ) {
    return {
      intervalHours: 48,
      scheduleType:
        "interval",
    };
  }

  /* -----------------------------------------------------
     WEEKLY
  ----------------------------------------------------- */

  if (
    [
      "weekly",
      "once weekly",
      "once a week",
      "every week",
      "every 7 days",
      "every seven days",
    ].includes(
      value
    )
  ) {
    return {
      intervalHours:
        24 * 7,

      scheduleType:
        "interval",
    };
  }

  /* -----------------------------------------------------
     GENERIC "EVERY X HOURS"

     Examples:
     every 4 hours
     every 10 hrs
     every 36 hr
  ----------------------------------------------------- */

  const everyHours =
    value.match(
      /every\s+(\d+(?:\.\d+)?)\s*(?:hours|hour|hrs|hr)\b/
    );

  if (
    everyHours
  ) {
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
      return {
        intervalHours:
          hours,

        scheduleType:
          "interval",
      };
    }
  }

  /* -----------------------------------------------------
     Q-HOUR ABBREVIATIONS

     Examples:
     q4h
     q 4 h
     q10h
  ----------------------------------------------------- */

  const qHours =
    value.match(
      /^q\s*(\d+(?:\.\d+)?)\s*h$/
    );

  if (
    qHours
  ) {
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
      return {
        intervalHours:
          hours,

        scheduleType:
          "interval",
      };
    }
  }

  /* -----------------------------------------------------
     GENERIC "X TIMES DAILY"

     2 times daily => 12h
     3 times daily => 8h
     4 times daily => 6h

     We only accept whole-number schedules that divide
     cleanly into 24 hours.
  ----------------------------------------------------- */

  const timesDaily =
    value.match(
      /^(\d+)\s*(?:x|times?)\s*(?:daily|a day|per day)$/
    );

  if (
    timesDaily
  ) {
    const times =
      Number(
        timesDaily[1]
      );

    if (
      Number.isInteger(
        times
      ) &&
      times >= 1 &&
      times <= 12 &&
      24 % times ===
        0
    ) {
      return {
        intervalHours:
          24 / times,

        scheduleType:
          "interval",
      };
    }
  }

  /* -----------------------------------------------------
     COMPLEX / TAPERED DIRECTIONS

     Do NOT turn these into one repeating interval.

     Examples:
     twice daily for 5 days then once daily
     every 12 hours for 3 days then every 24 hours
  ----------------------------------------------------- */

  if (
    value.includes(
      " then "
    ) ||
    value.includes(
      "taper"
    ) ||
    value.includes(
      "for 5 days then"
    )
  ) {
    return {
      intervalHours: null,
      scheduleType:
        "complex",
    };
  }

  return {
    intervalHours: null,
    scheduleType:
      "unknown",
  };
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

  return text ||
    null;
}
