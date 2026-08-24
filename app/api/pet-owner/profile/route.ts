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

async function requireUser() {
  const session =
    await getSession();

  if (
    !session ||
    session.status !== "approved"
  ) {
    return null;
  }

  return session;
}

export async function GET() {
  try {
    const session =
      await requireUser();

    if (!session) {
      return NextResponse.json(
        {
          error:
            "Sign in required.",
        },
        {
          status: 401,
        }
      );
    }

    const rows =
      await sql`
        select
          id,
          user_id,
          display_name,
          phone,
          city,
          state,
          postal_code,
          created_at,
          updated_at

        from pet_owner_profiles

        where
          user_id =
            ${session.id}::uuid

        limit 1
      `;

    return NextResponse.json({
      profile:
        rows[0] ?? null,
    });
  } catch (err) {
    console.error(
      "GET /api/pet-owner/profile failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load Pet Owner profile.",
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
    const session =
      await requireUser();

    if (!session) {
      return NextResponse.json(
        {
          error:
            "Sign in required.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await req.json();

    const displayName =
      typeof body?.displayName === "string"
        ? body.displayName.trim()
        : "";

    const phone =
      typeof body?.phone === "string"
        ? body.phone.trim()
        : "";

    const city =
      typeof body?.city === "string"
        ? body.city.trim()
        : "";

    const state =
      typeof body?.state === "string" &&
      body.state.trim()
        ? body.state
            .trim()
            .toUpperCase()
        : "TX";

    const postalCode =
      typeof body?.postalCode === "string"
        ? body.postalCode.trim()
        : "";

    const rows =
      await sql`
        insert into pet_owner_profiles (
          user_id,
          display_name,
          phone,
          city,
          state,
          postal_code
        )

        values (
          ${session.id}::uuid,
          ${displayName || null},
          ${phone || null},
          ${city || null},
          ${state},
          ${postalCode || null}
        )

        on conflict (user_id)
        do update
        set
          display_name =
            excluded.display_name,
          phone =
            excluded.phone,
          city =
            excluded.city,
          state =
            excluded.state,
          postal_code =
            excluded.postal_code,
          updated_at =
            now()

        returning
          id,
          user_id,
          display_name,
          phone,
          city,
          state,
          postal_code,
          created_at,
          updated_at
      `;

    return NextResponse.json(
      {
        profile:
          rows[0],
        availablePortal:
          "pet-owner",
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.error(
      "POST /api/pet-owner/profile failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't create Pet Owner profile.",
      },
      {
        status: 500,
      }
    );
  }
}
