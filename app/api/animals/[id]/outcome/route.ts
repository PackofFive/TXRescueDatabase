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

type OutcomeType =
  | "adopted"
  | "transferred"
  | "returned_to_owner"
  | "returned_to_shelter"
  | "released"
  | "escaped_missing"
  | "died"
  | "euthanized"
  | "other";

const VALID_OUTCOMES: OutcomeType[] = [
  "adopted",
  "transferred",
  "returned_to_owner",
  "returned_to_shelter",
  "released",
  "escaped_missing",
  "died",
  "euthanized",
  "other",
];

/* =========================================================
   ACCESS
========================================================= */

async function requireAnimalAccess(
  animalId: string
) {
  const {
    session,
    orgId,
  } =
    await requireEffectiveOrg();

  const rows =
    await sql`
      select
        id,
        name,
        temporary_name,
        outcome_status,
        outcome_date

      from animals

      where
        id = ${animalId}

        and
        current_org_id = ${orgId}

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
    animal:
      rows[0],
  };
}

/* =========================================================
   GET OUTCOME
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
    } =
      await params;

    const {
      orgId,
      animal,
    } =
      await requireAnimalAccess(
        animalId
      );

    const outcomeRows =
      await sql`
        select
          ao.id,
          ao.animal_id,
          ao.org_id,
          ao.outcome_type,
          ao.outcome_date,
          ao.destination_name,
          ao.destination_contact,
          ao.destination_org_id,
          ao.reason,
          ao.notes,
          ao.recorded_by,
          ao.created_at,
          ao.updated_at,

          u.email as recorded_by_email,

          destination.name
            as destination_org_name

        from animal_outcomes ao

        left join users u
          on u.id = ao.recorded_by

        left join organizations destination
          on destination.id =
            ao.destination_org_id

        where
          ao.animal_id =
            ${animalId}

          and
          ao.org_id =
            ${orgId}

        limit 1
      `;

    return NextResponse.json({
      outcome:
        outcomeRows[0] ??
        null,

      animal: {
        id:
          animal.id,

        name:
          animal.name,

        temporary_name:
          animal.temporary_name,

        outcome_status:
          animal.outcome_status,

        outcome_date:
          animal.outcome_date,
      },
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
      "GET animal outcome failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load animal outcome.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST / CREATE OR REPLACE OUTCOME
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
    } =
      await params;

    const {
      session,
      orgId,
      animal,
    } =
      await requireAnimalAccess(
        animalId
      );

    const body =
      await req
        .json()
        .catch(
          () => null
        );

    if (!body) {
      return NextResponse.json(
        {
          error:
            "Request body is required.",
        },
        {
          status: 400,
        }
      );
    }

    const outcomeType =
      normalizeOutcomeType(
        body.outcomeType
      );

    if (!outcomeType) {
      return NextResponse.json(
        {
          error:
            "Outcome type is required.",
        },
        {
          status: 400,
        }
      );
    }

    const outcomeDate =
      parseDate(
        body.outcomeDate
      );

    if (!outcomeDate) {
      return NextResponse.json(
        {
          error:
            "Outcome date is required.",
        },
        {
          status: 400,
        }
      );
    }

    const destinationName =
      cleanText(
        body.destinationName
      );

    const destinationContact =
      cleanText(
        body.destinationContact
      );

    const destinationOrgId =
      cleanText(
        body.destinationOrgId
      );

    const reason =
      cleanText(
        body.reason
      );

    const notes =
      cleanText(
        body.notes
      );

    /* =====================================================
       OPTIONAL DESTINATION ORG VALIDATION
    ===================================================== */

    if (
      destinationOrgId
    ) {
      const destinationRows =
        await sql`
          select id

          from organizations

          where
            id =
              ${destinationOrgId}

          limit 1
        `;

      if (
        !destinationRows[0]
      ) {
        return NextResponse.json(
          {
            error:
              "Destination organization could not be found.",
          },
          {
            status: 400,
          }
        );
      }
    }

    /* =====================================================
       UPSERT OUTCOME RECORD
    ===================================================== */

    const rows =
      await sql`
        insert into animal_outcomes (
          animal_id,
          org_id,
          outcome_type,
          outcome_date,
          destination_name,
          destination_contact,
          destination_org_id,
          reason,
          notes,
          recorded_by
        )

        values (
          ${animalId},
          ${orgId},
          ${outcomeType},
          ${outcomeDate}::date,
          ${destinationName},
          ${destinationContact},
          ${destinationOrgId},
          ${reason},
          ${notes},
          ${session.id}
        )

        on conflict (
          animal_id
        )

        do update set
          org_id =
            excluded.org_id,

          outcome_type =
            excluded.outcome_type,

          outcome_date =
            excluded.outcome_date,

          destination_name =
            excluded.destination_name,

          destination_contact =
            excluded.destination_contact,

          destination_org_id =
            excluded.destination_org_id,

          reason =
            excluded.reason,

          notes =
            excluded.notes,

          recorded_by =
            excluded.recorded_by,

          updated_at =
            now()

        returning
          id,
          animal_id,
          org_id,
          outcome_type,
          outcome_date,
          destination_name,
          destination_contact,
          destination_org_id,
          reason,
          notes,
          recorded_by,
          created_at,
          updated_at
      `;

    /* =====================================================
       KEEP ANIMALS TABLE IN SYNC

       Existing dashboard / public-profile code already reads
       animals.outcome_status and animals.outcome_date.
    ===================================================== */

    await sql`
      update animals

      set
        outcome_status =
          ${outcomeType},

        outcome_date =
          ${outcomeDate}::date,

        updated_at =
          now()

      where
        id =
          ${animalId}

        and
        current_org_id =
          ${orgId}
    `;

    /* =====================================================
       TIMELINE EVENT

       Avoid creating duplicate timeline rows every time an
       existing outcome is edited.

       If your timeline table uses a different name/schema,
       this block safely fails without breaking outcome save.
    ===================================================== */

    try {
      const existingTimeline =
        await sql`
          select id

          from animal_timeline

          where
            animal_id =
              ${animalId}

            and
            event_type =
              'outcome'

          limit 1
        `;

      if (
        existingTimeline[0]
      ) {
        await sql`
          update animal_timeline

          set
            started_at =
              ${outcomeDate}::date,

            updated_at =
              now()

          where
            id =
              ${existingTimeline[0].id}
        `;
      } else {
        await sql`
          insert into animal_timeline (
            animal_id,
            org_id,
            event_type,
            started_at
          )

          values (
            ${animalId},
            ${orgId},
            'outcome',
            ${outcomeDate}::date
          )
        `;
      }
    } catch (
      timelineError
    ) {
      console.error(
        "Outcome timeline update skipped:",
        timelineError
      );
    }

    /* =====================================================
       AUDIT
    ===================================================== */

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
          'outcome_recorded',
          ${JSON.stringify({
            outcomeId:
              rows[0].id,

            outcomeType,

            outcomeDate,

            destinationName,

            destinationOrgId,

            previousOutcome:
              animal.outcome_status,
          })}
        )
      `;
    } catch (
      auditError
    ) {
      console.error(
        "Outcome audit failed:",
        auditError
      );
    }

    return NextResponse.json({
      outcome:
        rows[0],
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
      "POST animal outcome failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't save animal outcome.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH OUTCOME

   Uses the same save logic conceptually, but requires an
   existing outcome.
========================================================= */

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
    } =
      await params;

    const {
      session,
      orgId,
    } =
      await requireAnimalAccess(
        animalId
      );

    const currentRows =
      await sql`
        select *

        from animal_outcomes

        where
          animal_id =
            ${animalId}

          and
          org_id =
            ${orgId}

        limit 1
      `;

    const current =
      currentRows[0];

    if (!current) {
      return NextResponse.json(
        {
          error:
            "No outcome has been recorded yet.",
        },
        {
          status: 404,
        }
      );
    }

    const body =
      await req
        .json()
        .catch(
          () => null
        );

    if (!body) {
      return NextResponse.json(
        {
          error:
            "Request body is required.",
        },
        {
          status: 400,
        }
      );
    }

    const outcomeType =
      body.outcomeType ===
      undefined
        ? normalizeOutcomeType(
            current.outcome_type
          )
        : normalizeOutcomeType(
            body.outcomeType
          );

    if (!outcomeType) {
      return NextResponse.json(
        {
          error:
            "Outcome type is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    let outcomeDate =
      String(
        current.outcome_date
      ).slice(
        0,
        10
      );

    if (
      body.outcomeDate !==
      undefined
    ) {
      const parsed =
        parseDate(
          body.outcomeDate
        );

      if (!parsed) {
        return NextResponse.json(
          {
            error:
              "Outcome date is invalid.",
          },
          {
            status: 400,
          }
        );
      }

      outcomeDate =
        parsed;
    }

    const destinationName =
      body.destinationName ===
      undefined
        ? current.destination_name
        : cleanText(
            body.destinationName
          );

    const destinationContact =
      body.destinationContact ===
      undefined
        ? current.destination_contact
        : cleanText(
            body.destinationContact
          );

    const destinationOrgId =
      body.destinationOrgId ===
      undefined
        ? current.destination_org_id
        : cleanText(
            body.destinationOrgId
          );

    const reason =
      body.reason ===
      undefined
        ? current.reason
        : cleanText(
            body.reason
          );

    const notes =
      body.notes ===
      undefined
        ? current.notes
        : cleanText(
            body.notes
          );

    if (
      destinationOrgId
    ) {
      const destinationRows =
        await sql`
          select id

          from organizations

          where
            id =
              ${destinationOrgId}

          limit 1
        `;

      if (
        !destinationRows[0]
      ) {
        return NextResponse.json(
          {
            error:
              "Destination organization could not be found.",
          },
          {
            status: 400,
          }
        );
      }
    }

    const rows =
      await sql`
        update animal_outcomes

        set
          outcome_type =
            ${outcomeType},

          outcome_date =
            ${outcomeDate}::date,

          destination_name =
            ${destinationName},

          destination_contact =
            ${destinationContact},

          destination_org_id =
            ${destinationOrgId},

          reason =
            ${reason},

          notes =
            ${notes},

          recorded_by =
            ${session.id},

          updated_at =
            now()

        where
          animal_id =
            ${animalId}

          and
          org_id =
            ${orgId}

        returning *
      `;

    await sql`
      update animals

      set
        outcome_status =
          ${outcomeType},

        outcome_date =
          ${outcomeDate}::date,

        updated_at =
          now()

      where
        id =
          ${animalId}

        and
        current_org_id =
          ${orgId}
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
          'outcome_updated',
          ${JSON.stringify({
            outcomeId:
              rows[0].id,

            outcomeType,

            outcomeDate,

            destinationName,

            destinationOrgId,
          })}
        )
      `;
    } catch (
      auditError
    ) {
      console.error(
        "Outcome update audit failed:",
        auditError
      );
    }

    return NextResponse.json({
      outcome:
        rows[0],
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
      "PATCH animal outcome failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't update animal outcome.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE / REOPEN ANIMAL

   This removes the closing outcome and returns the animal
   to active status without deleting any historical records.
========================================================= */

export async function DELETE(
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
      session,
      orgId,
    } =
      await requireAnimalAccess(
        animalId
      );

    const rows =
      await sql`
        delete from animal_outcomes

        where
          animal_id =
            ${animalId}

          and
          org_id =
            ${orgId}

        returning
          id,
          outcome_type,
          outcome_date
      `;

    if (!rows[0]) {
      return NextResponse.json(
        {
          error:
            "No outcome record exists.",
        },
        {
          status: 404,
        }
      );
    }

    await sql`
      update animals

      set
        outcome_status =
          null,

        outcome_date =
          null,

        updated_at =
          now()

      where
        id =
          ${animalId}

        and
        current_org_id =
          ${orgId}
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
          'outcome_removed',
          ${JSON.stringify({
            previousOutcomeType:
              rows[0].outcome_type,

            previousOutcomeDate:
              rows[0].outcome_date,
          })}
        )
      `;
    } catch (
      auditError
    ) {
      console.error(
        "Outcome removal audit failed:",
        auditError
      );
    }

    return NextResponse.json({
      reopened: true,
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
      "DELETE animal outcome failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't reopen animal record.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   HELPERS
========================================================= */

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
    String(
      value
    ).trim();

  return text ||
    null;
}

function normalizeOutcomeType(
  value: unknown
):
  | OutcomeType
  | null {
  const text =
    String(
      value ??
        ""
    )
      .trim()
      .toLowerCase() as OutcomeType;

  return VALID_OUTCOMES.includes(
    text
  )
    ? text
    : null;
}

function parseDate(
  value: unknown
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const text =
    String(
      value
    ).trim();

  const date =
    new Date(
      `${text}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return text;
}
