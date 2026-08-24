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

async function requirePetOwner() {
  const session =
    await getSession();

  if (
    !session ||
    session.status !==
      "approved"
  ) {
    return null;
  }

  const rows =
    await sql`
      select id
      from pet_owner_profiles
      where user_id = ${session.id}::uuid
      limit 1
    `;

  if (!rows[0]?.id) {
    return null;
  }

  return {
    ownerProfileId:
      String(
        rows[0].id
      ),
  };
}

export async function GET() {
  try {
    const access =
      await requirePetOwner();

    if (!access) {
      return NextResponse.json(
        {
          error:
            "Pet Owner access required.",
        },
        {
          status: 401,
        }
      );
    }

    const pets =
      await sql`
        select
          id,
          name

        from owned_pets

        where
          owner_profile_id =
            ${access.ownerProfileId}
          and archived_at is null

        order by name asc
      `;

    const reminders =
      await sql`
        select
          r.id,
          r.pet_id,
          r.reminder_type,
          r.title,
          r.description,
          r.due_date,
          r.recurrence,
          r.recurrence_days,
          r.status,
          r.completed_at,
          r.notes,
          r.created_at,
          r.updated_at,

          p.name as pet_name

        from pet_reminders r

        join owned_pets p
          on p.id =
            r.pet_id

        where
          p.owner_profile_id =
            ${access.ownerProfileId}

        order by
          case
            when r.status = 'active'
              and r.due_date < current_date
              then 0
            when r.status = 'active'
              then 1
            when r.status = 'completed'
              then 2
            else 3
          end,
          r.due_date asc,
          r.created_at desc
      `;

    return NextResponse.json({
      pets,
      reminders,
    });
  } catch (err) {
    console.error(
      "GET /api/pet-owner/reminders failed:",
      err
    );

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

export async function POST(
  req: NextRequest
) {
  try {
    const access =
      await requirePetOwner();

    if (!access) {
      return NextResponse.json(
        {
          error:
            "Pet Owner access required.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await req.json();

    const petId =
      typeof body?.petId ===
        "string"
        ? body.petId.trim()
        : "";

    const reminderType =
      typeof body?.reminderType ===
        "string"
        ? body.reminderType.trim()
        : "";

    const title =
      typeof body?.title ===
        "string"
        ? body.title.trim()
        : "";

    const dueDate =
      typeof body?.dueDate ===
        "string"
        ? body.dueDate.trim()
        : "";

    if (
      !petId ||
      !reminderType ||
      !title ||
      !dueDate
    ) {
      return NextResponse.json(
        {
          error:
            "Pet, reminder type, title, and due date are required.",
        },
        {
          status: 400,
        }
      );
    }

    const petRows =
      await sql`
        select id

        from owned_pets

        where
          id = ${petId}
          and owner_profile_id =
            ${access.ownerProfileId}
          and archived_at is null

        limit 1
      `;

    if (!petRows[0]?.id) {
      return NextResponse.json(
        {
          error:
            "Pet profile not found.",
        },
        {
          status: 404,
        }
      );
    }

    const recurrence =
      typeof body?.recurrence ===
        "string" &&
      body.recurrence.trim()
        ? body.recurrence.trim()
        : "none";

    const recurrenceDaysRaw =
      body?.recurrenceDays;

    const recurrenceDays =
      recurrenceDaysRaw === "" ||
      recurrenceDaysRaw === null ||
      typeof recurrenceDaysRaw ===
        "undefined"
        ? null
        : Number(
            recurrenceDaysRaw
          );

    const rows =
      await sql`
        insert into pet_reminders (
          pet_id,
          reminder_type,
          title,
          description,
          due_date,
          recurrence,
          recurrence_days,
          notes
        )

        values (
          ${petId},
          ${reminderType},
          ${title},
          ${
            typeof body?.description === "string" &&
            body.description.trim()
              ? body.description.trim()
              : null
          },
          ${dueDate},
          ${recurrence},
          ${recurrenceDays},
          ${
            typeof body?.notes === "string" &&
            body.notes.trim()
              ? body.notes.trim()
              : null
          }
        )

        returning
          id,
          pet_id,
          reminder_type,
          title,
          description,
          due_date,
          recurrence,
          recurrence_days,
          status,
          completed_at,
          notes,
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
    console.error(
      "POST /api/pet-owner/reminders failed:",
      err
    );

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

export async function PATCH(
  req: NextRequest
) {
  try {
    const access =
      await requirePetOwner();

    if (!access) {
      return NextResponse.json(
        {
          error:
            "Pet Owner access required.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await req.json();

    const reminderId =
      typeof body?.reminderId ===
        "string"
        ? body.reminderId.trim()
        : "";

    const action =
      typeof body?.action ===
        "string"
        ? body.action.trim()
        : "";

    if (
      !reminderId ||
      ![
        "complete",
        "dismiss",
        "reactivate",
      ].includes(
        action
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Valid reminder action required.",
        },
        {
          status: 400,
        }
      );
    }

    const rows =
      await sql`
        update pet_reminders r

        set
          status =
            case
              when ${action} = 'complete'
                then 'completed'
              when ${action} = 'dismiss'
                then 'dismissed'
              else 'active'
            end,

          completed_at =
            case
              when ${action} = 'complete'
                then now()
              else null
            end,

          updated_at =
            now()

        from owned_pets p

        where
          r.id = ${reminderId}
          and p.id = r.pet_id
          and p.owner_profile_id =
            ${access.ownerProfileId}

        returning
          r.id,
          r.pet_id,
          r.reminder_type,
          r.title,
          r.description,
          r.due_date,
          r.recurrence,
          r.recurrence_days,
          r.status,
          r.completed_at,
          r.notes,
          r.created_at,
          r.updated_at
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
    console.error(
      "PATCH /api/pet-owner/reminders failed:",
      err
    );

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
