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

type BehaviorSeverity =
  | "low"
  | "moderate"
  | "high"
  | "critical";

type BehaviorStatus =
  | "current"
  | "monitoring"
  | "resolved";

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

/* =========================================================
   GET BEHAVIOR PROFILE + HISTORY
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
      orgId,
    } =
      await requireAnimalAccess(
        animalId
      );

    const profileRows =
      await sql`
        select
          animal_id,
          org_id,
          summary,
          handling_notes,
          training_plan,
          restrictions,
          dog_compatibility,
          cat_compatibility,
          child_compatibility,
          stranger_compatibility,
          home_environment_notes,
          updated_by,
          created_at,
          updated_at

        from animal_behavior_profiles

        where
          animal_id = ${animalId}
          and org_id = ${orgId}

        limit 1
      `;

    const entryRows =
      await sql`
        select
          abe.id,
          abe.animal_id,
          abe.org_id,
          abe.observed_at,
          abe.behavior_type,
          abe.severity,
          abe.trigger,
          abe.observation,
          abe.response_taken,
          abe.outcome,
          abe.status,
          abe.recorded_by,
          abe.created_at,
          abe.updated_at,

          u.email as recorded_by_email

        from animal_behavior_entries abe

        left join users u
          on u.id = abe.recorded_by

        where
          abe.animal_id = ${animalId}
          and abe.org_id = ${orgId}

        order by
          abe.observed_at desc,
          abe.created_at desc
      `;

    return NextResponse.json({
      profile:
        profileRows[0] ??
        null,

      entries:
        entryRows ??
        [],
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
      "GET behavior failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load behavior records.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST NEW BEHAVIOR ENTRY
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
      orgId,
    } =
      await requireAnimalAccess(
        animalId
      );

    const body =
      await req
        .json()
        .catch(() => null);

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

    const observation =
      cleanText(
        body.observation
      );

    if (!observation) {
      return NextResponse.json(
        {
          error:
            "Observation is required.",
        },
        {
          status: 400,
        }
      );
    }

    const behaviorType =
      cleanText(
        body.behaviorType
      );

    const trigger =
      cleanText(
        body.trigger
      );

    const responseTaken =
      cleanText(
        body.responseTaken
      );

    const outcome =
      cleanText(
        body.outcome
      );

    const severity =
      normalizeSeverity(
        body.severity
      );

    const status =
      normalizeStatus(
        body.status
      );

    const observedAt =
      parseDateTime(
        body.observedAt
      );

    if (
      body.observedAt &&
      !observedAt
    ) {
      return NextResponse.json(
        {
          error:
            "Observed date/time is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    const rows =
      await sql`
        insert into animal_behavior_entries (
          animal_id,
          org_id,
          observed_at,
          behavior_type,
          severity,
          trigger,
          observation,
          response_taken,
          outcome,
          status,
          recorded_by
        )

        values (
          ${animalId},
          ${orgId},
          ${
            observedAt ??
            new Date().toISOString()
          },
          ${behaviorType},
          ${severity},
          ${trigger},
          ${observation},
          ${responseTaken},
          ${outcome},
          ${status},
          ${session.id}
        )

        returning
          id,
          animal_id,
          org_id,
          observed_at,
          behavior_type,
          severity,
          trigger,
          observation,
          response_taken,
          outcome,
          status,
          recorded_by,
          created_at,
          updated_at
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
          'behavior_entry_added',
          ${JSON.stringify({
            entryId:
              rows[0].id,
            behaviorType,
            severity,
            status,
          })}
        )
      `;
    } catch (
      auditError
    ) {
      console.error(
        "Behavior entry audit failed:",
        auditError
      );
    }

    return NextResponse.json(
      {
        entry:
          rows[0],
      },
      {
        status: 201,
      }
    );
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
      "POST behavior failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't save behavior observation.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH PROFILE OR ENTRY
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
    } = await params;

    const {
      session,
      orgId,
    } =
      await requireAnimalAccess(
        animalId
      );

    const body =
      await req
        .json()
        .catch(() => null);

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

    /* =====================================================
       UPDATE CURRENT PROFILE
    ===================================================== */

    if (
      body.action ===
      "update_profile"
    ) {
      const summary =
        cleanText(
          body.summary
        );

      const handlingNotes =
        cleanText(
          body.handlingNotes
        );

      const trainingPlan =
        cleanText(
          body.trainingPlan
        );

      const restrictions =
        cleanText(
          body.restrictions
        );

      const dogCompatibility =
        cleanText(
          body.dogCompatibility
        );

      const catCompatibility =
        cleanText(
          body.catCompatibility
        );

      const childCompatibility =
        cleanText(
          body.childCompatibility
        );

      const strangerCompatibility =
        cleanText(
          body.strangerCompatibility
        );

      const homeEnvironmentNotes =
        cleanText(
          body.homeEnvironmentNotes
        );

      const rows =
        await sql`
          insert into animal_behavior_profiles (
            animal_id,
            org_id,
            summary,
            handling_notes,
            training_plan,
            restrictions,
            dog_compatibility,
            cat_compatibility,
            child_compatibility,
            stranger_compatibility,
            home_environment_notes,
            updated_by
          )

          values (
            ${animalId},
            ${orgId},
            ${summary},
            ${handlingNotes},
            ${trainingPlan},
            ${restrictions},
            ${dogCompatibility},
            ${catCompatibility},
            ${childCompatibility},
            ${strangerCompatibility},
            ${homeEnvironmentNotes},
            ${session.id}
          )

          on conflict (animal_id)

          do update set
            org_id =
              excluded.org_id,

            summary =
              excluded.summary,

            handling_notes =
              excluded.handling_notes,

            training_plan =
              excluded.training_plan,

            restrictions =
              excluded.restrictions,

            dog_compatibility =
              excluded.dog_compatibility,

            cat_compatibility =
              excluded.cat_compatibility,

            child_compatibility =
              excluded.child_compatibility,

            stranger_compatibility =
              excluded.stranger_compatibility,

            home_environment_notes =
              excluded.home_environment_notes,

            updated_by =
              excluded.updated_by,

            updated_at =
              now()

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
            'behavior_profile_updated',
            ${JSON.stringify({
              updatedAt:
                new Date().toISOString(),
            })}
          )
        `;
      } catch (
        auditError
      ) {
        console.error(
          "Behavior profile audit failed:",
          auditError
        );
      }

      return NextResponse.json({
        profile:
          rows[0],
      });
    }

    /* =====================================================
       UPDATE EXISTING ENTRY
    ===================================================== */

    if (
      body.action ===
      "update_entry"
    ) {
      const entryId =
        cleanText(
          body.entryId
        );

      if (!entryId) {
        return NextResponse.json(
          {
            error:
              "Behavior entry ID is required.",
          },
          {
            status: 400,
          }
        );
      }

      const currentRows =
        await sql`
          select *
          from animal_behavior_entries

          where
            id = ${entryId}
            and animal_id = ${animalId}
            and org_id = ${orgId}

          limit 1
        `;

      const current =
        currentRows[0];

      if (!current) {
        return NextResponse.json(
          {
            error:
              "Behavior entry not found.",
          },
          {
            status: 404,
          }
        );
      }

      const behaviorType =
        body.behaviorType ===
        undefined
          ? current.behavior_type
          : cleanText(
              body.behaviorType
            );

      const severity =
        body.severity ===
        undefined
          ? current.severity
          : normalizeSeverity(
              body.severity
            );

      const trigger =
        body.trigger ===
        undefined
          ? current.trigger
          : cleanText(
              body.trigger
            );

      const observation =
        body.observation ===
        undefined
          ? current.observation
          : cleanText(
              body.observation
            );

      if (!observation) {
        return NextResponse.json(
          {
            error:
              "Observation is required.",
          },
          {
            status: 400,
          }
        );
      }

      const responseTaken =
        body.responseTaken ===
        undefined
          ? current.response_taken
          : cleanText(
              body.responseTaken
            );

      const outcome =
        body.outcome ===
        undefined
          ? current.outcome
          : cleanText(
              body.outcome
            );

      const status =
        body.status ===
        undefined
          ? current.status
          : normalizeStatus(
              body.status
            );

      let observedAt =
        current.observed_at;

      if (
        body.observedAt !==
        undefined
      ) {
        const parsed =
          parseDateTime(
            body.observedAt
          );

        if (!parsed) {
          return NextResponse.json(
            {
              error:
                "Observed date/time is invalid.",
            },
            {
              status: 400,
            }
          );
        }

        observedAt =
          parsed;
      }

      const rows =
        await sql`
          update animal_behavior_entries

          set
            observed_at =
              ${observedAt},

            behavior_type =
              ${behaviorType},

            severity =
              ${severity},

            trigger =
              ${trigger},

            observation =
              ${observation},

            response_taken =
              ${responseTaken},

            outcome =
              ${outcome},

            status =
              ${status},

            updated_at =
              now()

          where
            id = ${entryId}
            and animal_id = ${animalId}
            and org_id = ${orgId}

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
            'behavior_entry_updated',
            ${JSON.stringify({
              entryId,
              status,
              severity,
            })}
          )
        `;
      } catch (
        auditError
      ) {
        console.error(
          "Behavior entry update audit failed:",
          auditError
        );
      }

      return NextResponse.json({
        entry:
          rows[0],
      });
    }

    return NextResponse.json(
      {
        error:
          "Unknown behavior update action.",
      },
      {
        status: 400,
      }
    );
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
      "PATCH behavior failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't update behavior information.",
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
    String(value).trim();

  return text ||
    null;
}

function normalizeSeverity(
  value: unknown
):
  | BehaviorSeverity
  | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const text =
    String(value)
      .trim()
      .toLowerCase();

  if (
    [
      "low",
      "moderate",
      "high",
      "critical",
    ].includes(text)
  ) {
    return text as BehaviorSeverity;
  }

  return null;
}

function normalizeStatus(
  value: unknown
): BehaviorStatus {
  const text =
    String(
      value ??
      "current"
    )
      .trim()
      .toLowerCase();

  if (
    [
      "current",
      "monitoring",
      "resolved",
    ].includes(text)
  ) {
    return text as BehaviorStatus;
  }

  return "current";
}

function parseDateTime(
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
    return null;
  }

  return date.toISOString();
}
