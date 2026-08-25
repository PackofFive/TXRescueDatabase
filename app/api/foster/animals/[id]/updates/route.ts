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

const ALLOWED_TYPES = [
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

async function resolveFosterAnimalAccess(
  animalId: string
) {
  const session =
    await getSession();

  if (
    !session ||
    session.status !== "approved"
  ) {
    return null;
  }

  const email =
    session.email
      ?.trim()
      .toLowerCase() ??
    "";

  const fosterRows =
    await sql`
      select
        id,
        user_id

      from foster_profiles

      where
        user_id =
          ${session.id}::uuid

        or (
          user_id is null
          and lower(email) =
            ${email}
        )

      order by
        case
          when user_id =
            ${session.id}::uuid
            then 0
          else 1
        end,
        created_at asc

      limit 1
    `;

  const foster =
    fosterRows[0] ??
    null;

  if (!foster?.id) {
    return null;
  }

  if (!foster.user_id) {
    await sql`
      update foster_profiles

      set
        user_id =
          ${session.id}::uuid,
        updated_at =
          now()

      where
        id =
          ${String(foster.id)}
        and user_id is null
    `;
  }

  const accessRows =
    await sql`
      select
        fa.id as assignment_id,
        fa.foster_id,
        fa.animal_id,
        a.current_org_id as organization_id,
        r.can_submit_updates

      from foster_assignments fa

      join animals a
        on a.id =
          fa.animal_id

      join foster_organization_relationships r
        on r.foster_id =
          fa.foster_id
        and r.organization_id =
          a.current_org_id
        and r.status =
          'approved'

      where
        fa.foster_id =
          ${String(foster.id)}
        and fa.animal_id =
          ${animalId}::uuid
        and fa.ended_at
          is null

      limit 1
    `;

  return accessRows[0] ??
    null;
}

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
    const {
      id: animalId,
    } = await params;

    const access =
      await resolveFosterAnimalAccess(
        animalId
      );

    if (!access) {
      return NextResponse.json(
        {
          error:
            "Active foster access to this animal was not found.",
        },
        {
          status: 404,
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
            ${String(access.assignment_id)}::uuid
          and foster_id =
            ${String(access.foster_id)}
          and animal_id =
            ${animalId}::uuid

        order by
          submitted_at desc,
          created_at desc
      `;

    return NextResponse.json({
      updates:
        rows,
      canSubmitUpdates:
        Boolean(
          access.can_submit_updates
        ),
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
    const {
      id: animalId,
    } = await params;

    const access =
      await resolveFosterAnimalAccess(
        animalId
      );

    if (!access) {
      return NextResponse.json(
        {
          error:
            "Active foster access to this animal was not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      !access.can_submit_updates
    ) {
      return NextResponse.json(
        {
          error:
            "This organization has not enabled animal updates for your foster relationship.",
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
      typeof value ===
        "string"
        ? value.trim()
        : "";

    const updateType =
      text(
        body?.updateType
      ) ||
      "general";

    const title =
      text(
        body?.title
      );

    const updateText =
      text(
        body?.updateText
      );

    if (
      !ALLOWED_TYPES.includes(
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
          submitted_at
        )

        values (
          ${String(access.assignment_id)}::uuid,
          ${String(access.foster_id)},
          ${animalId}::uuid,
          ${String(access.organization_id)}::uuid,
          ${updateType},
          ${title || null},
          ${updateText},
          'submitted',
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
