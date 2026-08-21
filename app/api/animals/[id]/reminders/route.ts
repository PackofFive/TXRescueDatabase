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

const VALID_PRIORITIES = [
  "critical",
  "high",
  "normal",
  "info",
];

const VALID_STATUSES = [
  "open",
  "completed",
  "cancelled",
];

/* =========================================================
   VERIFY ACCESS
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
   GET REMINDERS
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

    await requireAnimalAccess(
      animalId
    );

    const reminders =
      await sql`
        select
          id,
          animal_id,
          title,
          notes,
          due_at,
          priority,
          status,
          created_at,
          updated_at
        from animal_reminders
        where
          animal_id = ${animalId}
        order by
          case status
            when 'open' then 1
            when 'completed' then 2
            else 3
          end,
          due_at asc nulls last,
          created_at desc
      `;

    return NextResponse.json({
      reminders,
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

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load reminders.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   CREATE REMINDER
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
        .catch(
          () => null
        );

    const title =
      typeof body?.title ===
        "string"
        ? body.title.trim()
        : "";

    const notes =
      typeof body?.notes ===
        "string" &&
      body.notes.trim()
        ? body.notes.trim()
        : null;

    const priority =
      VALID_PRIORITIES.includes(
        body?.priority
      )
        ? body.priority
        : "normal";

    let dueAt:
      | string
      | null = null;

    if (
      typeof body?.dueAt ===
        "string" &&
      body.dueAt.trim()
    ) {
      const parsed =
        new Date(
          body.dueAt
        );

      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Reminder due date is invalid.",
          },
          {
            status: 400,
          }
        );
      }

      dueAt =
        parsed.toISOString();
    }

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Reminder title is required.",
        },
        {
          status: 400,
        }
      );
    }

    const rows =
      await sql`
        insert into animal_reminders (
          animal_id,
          org_id,
          title,
          notes,
          due_at,
          priority,
          status,
          created_by
        )

        values (
          ${animalId},
          ${orgId},
          ${title},
          ${notes},
          ${dueAt},
          ${priority},
          'open',
          ${session.id}
        )

        returning
          id,
          animal_id,
          title,
          notes,
          due_at,
          priority,
          status,
          created_at,
          updated_at
      `;

    return NextResponse.json(
      {
        reminder:
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

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't create reminder.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   UPDATE REMINDER
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

    await requireAnimalAccess(
      animalId
    );

    const body =
      await req
        .json()
        .catch(
          () => null
        );

    const reminderId =
      body?.reminderId;

    if (
      !reminderId ||
      typeof reminderId !==
        "string"
    ) {
      return NextResponse.json(
        {
          error:
            "reminderId is required.",
        },
        {
          status: 400,
        }
      );
    }

    const status =
      body?.status;

    if (
      !VALID_STATUSES.includes(
        status
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid reminder status.",
        },
        {
          status: 400,
        }
      );
    }

    const rows =
      await sql`
        update animal_reminders
        set
          status = ${status},
          updated_at = now()
        where
          id = ${reminderId}
          and animal_id = ${animalId}
        returning
          id,
          status,
          updated_at
      `;

    if (!rows[0]) {
      return NextResponse.json(
        {
          error:
            "Reminder not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      reminder:
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

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't update reminder.",
      },
      {
        status: 500,
      }
    );
  }
}
