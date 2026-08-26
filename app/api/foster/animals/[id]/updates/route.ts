import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getSession,
} from "@/lib/auth";

import {
  sql,
} from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

async function requireFoster() {
  const session =
    await getSession();

  if (
    !session ||
    session.status !== "approved"
  ) {
    return null;
  }

  const rows =
    await sql`
      select id
      from foster_profiles
      where user_id = ${session.id}::uuid
      limit 1
    `;

  if (!rows[0]?.id) {
    return null;
  }

  return {
    session,
    fosterId:
      String(rows[0].id),
  };
}

async function getAssignment(
  fosterId: string,
  animalId: string
) {
  const rows =
    await sql`
      select
        fa.id,
        fa.foster_id,
        fa.animal_id,
        fa.organization_id,
        fa.can_submit_updates

      from foster_assignments fa

      where
        fa.foster_id = ${fosterId}
        and fa.animal_id = ${animalId}::uuid
        and fa.ended_at is null

      limit 1
    `;

  return rows[0] ?? null;
}

/*
  GET
  Return foster updates for this animal's
  active assignment.

  A foster can only see updates tied to
  their own active assignment.
*/
export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params:
      Promise<{
        id: string;
      }>;
  }
) {
  try {
    const access =
      await requireFoster();

    if (!access) {
      return NextResponse.json(
        {
          error:
            "Foster access required.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      id: animalId,
    } = await params;

    const assignment =
      await getAssignment(
        access.fosterId,
        animalId
      );

    if (!assignment) {
      return NextResponse.json(
        {
          error:
            "You do not have an active assignment for this animal.",
        },
        {
          status: 403,
        }
      );
    }

    const rows =
      await sql`
        select
          id,
          update_type,
          title,
          update_text,
          status,
          submitted_at,
          reviewed_at,
          review_notes,
          incorporated_at,
          created_at,
          updated_at

        from foster_animal_updates

        where
          assignment_id =
            ${String(assignment.id)}::uuid
          and foster_id =
            ${access.fosterId}
          and animal_id =
            ${animalId}::uuid

        order by
          submitted_at desc
      `;

    return NextResponse.json({
      updates: rows,
    });
  } catch (err) {
    console.error(
      "GET /api/foster/animals/[id]/updates failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load foster updates.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
  POST
  Submit a new update from the foster
  to the managing organization.
*/
export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params:
      Promise<{
        id: string;
      }>;
  }
) {
  try {
    const access =
      await requireFoster();

    if (!access) {
      return NextResponse.json(
        {
          error:
            "Foster access required.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      id: animalId,
    } = await params;

    const assignment =
      await getAssignment(
        access.fosterId,
        animalId
      );

    if (!assignment) {
      return NextResponse.json(
        {
          error:
            "You do not have an active assignment for this animal.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      assignment.can_submit_updates !== true
    ) {
      return NextResponse.json(
        {
          error:
            "This organization has not enabled foster updates for this assignment.",
        },
        {
          status: 403,
        }
      );
    }

    const body =
      await req.json();

    const text = (
      value: unknown
    ) =>
      typeof value === "string"
        ? value.trim()
        : "";

    const updateType =
      text(body?.updateType) ||
      "general";

    const title =
      text(body?.title) ||
      null;

    const updateText =
      text(body?.updateText);

    const allowedTypes = [
      "general",
      "medical",
      "behavior",
      "feeding",
      "medication",
      "weight",
      "activity",
      "concern",
      "milestone",
      "other",
    ];

    if (
      !allowedTypes.includes(
        updateType
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid update type.",
        },
        {
          status: 400,
        }
      );
    }

    if (!updateText) {
      return NextResponse.json(
        {
          error:
            "Update details are required.",
        },
        {
          status: 400,
        }
      );
    }

    const rows =
      await sql`
        insert into foster_animal_updates (
          assignment_id,
          foster_id,
          animal_id,
          organization_id,
          update_type,
          title,
          update_text,
          status,
          submitted_at,
          created_at,
          updated_at
        )
        values (
          ${String(assignment.id)}::uuid,
          ${access.fosterId},
          ${animalId}::uuid,
          ${String(assignment.organization_id)}::uuid,
          ${updateType},
          ${title},
          ${updateText},
          'submitted',
          now(),
          now(),
          now()
        )
        returning
          id,
          update_type,
          title,
          update_text,
          status,
          submitted_at,
          reviewed_at,
          review_notes,
          incorporated_at,
          created_at,
          updated_at
      `;

    return NextResponse.json(
      {
        update:
          rows[0],
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.error(
      "POST /api/foster/animals/[id]/updates failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't submit foster update.",
      },
      {
        status: 500,
      }
    );
  }
}
