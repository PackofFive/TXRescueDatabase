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
    session,
    orgId,
  } = await requireEffectiveOrg();

  const rows = await sql`
    select
      id,
      name,
      temporary_name
    from animals
    where
      id = ${animalId}
      and current_org_id = ${orgId}
    limit 1
  `;

  if (!rows[0]) {
    throw new AuthError(
      "Animal not found or you do not have access to this record.",
      404
    );
  }

  return {
    session,
    orgId,
    animal: rows[0],
  };
}


/* =========================================================
   GET MEDICAL FILE
========================================================= */

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
    } = await params;

    const {
      animal,
    } =
      await requireAnimalAccess(
        animalId
      );

    const medicalRecords =
      await sql`
        select
          id,
          record_type,
          title,
          provider,
          occurred_at,
          due_at,
          status,
          notes,
          created_at
        from animal_medical_records
        where animal_id = ${animalId}
        order by
          coalesce(
            occurred_at,
            due_at,
            created_at::date
          ) desc
      `;

    const medications =
      await sql`
        select
          id,
          medication_name,
          dosage,
          instructions,
          frequency,
          start_date,
          end_date,
          next_due_at,
          active,
          notes,
          created_at
        from animal_medications
        where animal_id = ${animalId}
        order by
          active desc,
          created_at desc
      `;

    return NextResponse.json({
      animal,
      medicalRecords,
      medications,
    });
  } catch (err) {
    if (
      err instanceof AuthError
    ) {
      return NextResponse.json(
        {
          error: err.message,
        },
        {
          status: err.status,
        }
      );
    }

    console.error(
      "GET animal medical file failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong loading medical records.",
      },
      {
        status: 500,
      }
    );
  }
}


/* =========================================================
   POST

   action:
   - medical_record
   - medication
========================================================= */

export async function POST(
  req: NextRequest,
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
    } = await params;

    const {
      session,
    } =
      await requireAnimalAccess(
        animalId
      );

    const body =
      await req
        .json()
        .catch(() => null);

    const action =
      body?.action;

    /* -----------------------------------------------------
       MEDICAL RECORD
    ----------------------------------------------------- */

    if (
      action ===
      "medical_record"
    ) {
      const {
        recordType,
        title,
        provider,
        occurredAt,
        dueAt,
        status,
        notes,
      } = body ?? {};

      if (
        !recordType ||
        !title
      ) {
        return NextResponse.json(
          {
            error:
              "Record type and title are required.",
          },
          {
            status: 400,
          }
        );
      }

      const validStatuses = [
        "completed",
        "scheduled",
        "due",
        "overdue",
      ];

      const statusValue =
        validStatuses.includes(
          status
        )
          ? status
          : "completed";

      const rows =
        await sql`
          insert into animal_medical_records (
            animal_id,
            record_type,
            title,
            provider,
            occurred_at,
            due_at,
            status,
            notes,
            created_by
          )

          values (
            ${animalId},
            ${recordType},
            ${title},
            ${provider || null},
            ${occurredAt || null},
            ${dueAt || null},
            ${statusValue},
            ${notes || null},
            ${session.id}
          )

          returning *
        `;

      return NextResponse.json(
        {
          medicalRecord:
            rows[0],
        },
        {
          status: 201,
        }
      );
    }

    /* -----------------------------------------------------
       MEDICATION
    ----------------------------------------------------- */

    if (
      action ===
      "medication"
    ) {
      const {
        medicationName,
        dosage,
        instructions,
        frequency,
        startDate,
        endDate,
        nextDueAt,
        notes,
      } = body ?? {};

      if (
        !medicationName ||
        typeof medicationName !==
          "string"
      ) {
        return NextResponse.json(
          {
            error:
              "Medication name is required.",
          },
          {
            status: 400,
          }
        );
      }

      const rows =
        await sql`
          insert into animal_medications (
            animal_id,
            medication_name,
            dosage,
            instructions,
            frequency,
            start_date,
            end_date,
            next_due_at,
            active,
            notes,
            created_by
          )

          values (
            ${animalId},
            ${medicationName.trim()},
            ${dosage || null},
            ${instructions || null},
            ${frequency || null},
            ${startDate || null},
            ${endDate || null},
            ${
              nextDueAt
                ? new Date(
                    nextDueAt
                  ).toISOString()
                : null
            },
            true,
            ${notes || null},
            ${session.id}
          )

          returning *
        `;

      return NextResponse.json(
        {
          medication:
            rows[0],
        },
        {
          status: 201,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Unknown medical action.",
      },
      {
        status: 400,
      }
    );
  } catch (err) {
    if (
      err instanceof AuthError
    ) {
      return NextResponse.json(
        {
          error: err.message,
        },
        {
          status: err.status,
        }
      );
    }

    console.error(
      "POST animal medical file failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong saving medical information.",
      },
      {
        status: 500,
      }
    );
  }
}
