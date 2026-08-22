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
  } =
    await requireEffectiveOrg();

  const rows = await sql`
    select id
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
    } = await params;

    await requireAnimalAccess(
      animalId
    );

    const medications =
      await sql`
        select
          id,
          animal_id,
          medication_name,
          dosage,
          frequency,
          instructions,
          started_at,
          ended_at,
          next_due_at,
          prescribing_vet,
          pharmacy,
          notes,
          active,
          created_at,
          updated_at

        from animal_medications

        where
          animal_id = ${animalId}

        order by
          active desc,
          next_due_at asc nulls last,
          created_at desc
      `;

    return NextResponse.json({
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
      "GET /api/animals/[id]/medications failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load medications.",
      },
      {
        status: 500,
      }
    );
  }
}

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

    const medicationName =
      typeof body?.medicationName ===
        "string"
        ? body.medicationName.trim()
        : "";

    if (!medicationName) {
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

    const startedAt =
      cleanDateTime(
        body?.startedAt
      );

    const endedAt =
      cleanDateTime(
        body?.endedAt
      );

    const nextDueAt =
      cleanDateTime(
        body?.nextDueAt
      );

    const rows =
      await sql`
        insert into animal_medications (
          animal_id,
          medication_name,
          dosage,
          frequency,
          instructions,
          started_at,
          ended_at,
          next_due_at,
          prescribing_vet,
          pharmacy,
          notes,
          active
        )

        values (
          ${animalId},
          ${medicationName},
          ${cleanText(body?.dosage)},
          ${cleanText(body?.frequency)},
          ${cleanText(body?.instructions)},
          ${startedAt},
          ${endedAt},
          ${nextDueAt},
          ${cleanText(body?.prescribingVet)},
          ${cleanText(body?.pharmacy)},
          ${cleanText(body?.notes)},
          ${
            body?.active === false
              ? false
              : true
          }
        )

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
          'medication_added',
          ${medicationName}
        )
      `;
    } catch (
      auditErr
    ) {
      console.error(
        "Medication audit failed:",
        auditErr
      );
    }

    return NextResponse.json(
      {
        medication:
          rows[0],
      },
      {
        status: 201,
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
      "POST /api/animals/[id]/medications failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't add medication.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
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

    const medicationId =
      body?.medicationId;

    if (
      !medicationId ||
      typeof medicationId !==
        "string"
    ) {
      return NextResponse.json(
        {
          error:
            "medicationId is required.",
        },
        {
          status: 400,
        }
      );
    }

    const currentRows =
      await sql`
        select *
        from animal_medications
        where
          id = ${medicationId}
          and animal_id = ${animalId}
        limit 1
      `;

    const current =
      currentRows[0];

    if (!current) {
      return NextResponse.json(
        {
          error:
            "Medication not found.",
        },
        {
          status: 404,
        }
      );
    }

    const medicationName =
      body.medicationName === undefined
        ? current.medication_name
        : cleanText(
            body.medicationName
          );

    if (!medicationName) {
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
        update animal_medications

        set
          medication_name =
            ${medicationName},

          dosage =
            ${
              body.dosage ===
              undefined
                ? current.dosage
                : cleanText(
                    body.dosage
                  )
            },

          frequency =
            ${
              body.frequency ===
              undefined
                ? current.frequency
                : cleanText(
                    body.frequency
                  )
            },

          instructions =
            ${
              body.instructions ===
              undefined
                ? current.instructions
                : cleanText(
                    body.instructions
                  )
            },

          started_at =
            ${
              body.startedAt ===
              undefined
                ? current.started_at
                : cleanDateTime(
                    body.startedAt
                  )
            },

          ended_at =
            ${
              body.endedAt ===
              undefined
                ? current.ended_at
                : cleanDateTime(
                    body.endedAt
                  )
            },

          next_due_at =
            ${
              body.nextDueAt ===
              undefined
                ? current.next_due_at
                : cleanDateTime(
                    body.nextDueAt
                  )
            },

          prescribing_vet =
            ${
              body.prescribingVet ===
              undefined
                ? current.prescribing_vet
                : cleanText(
                    body.prescribingVet
                  )
            },

          pharmacy =
            ${
              body.pharmacy ===
              undefined
                ? current.pharmacy
                : cleanText(
                    body.pharmacy
                  )
            },

          notes =
            ${
              body.notes ===
              undefined
                ? current.notes
                : cleanText(
                    body.notes
                  )
            },

          active =
            ${
              body.active ===
              undefined
                ? current.active
                : body.active === true
            },

          updated_at =
            now()

        where
          id = ${medicationId}
          and animal_id = ${animalId}

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
          'medication_updated',
          ${medicationName}
        )
      `;
    } catch (
      auditErr
    ) {
      console.error(
        "Medication update audit failed:",
        auditErr
      );
    }

    return NextResponse.json({
      medication:
        rows[0],
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
      "PATCH /api/animals/[id]/medications failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't update medication.",
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

function cleanDateTime(
  value: unknown
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const date =
    new Date(
      String(value)
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      "A medication date is invalid."
    );
  }

  return date.toISOString();
}
