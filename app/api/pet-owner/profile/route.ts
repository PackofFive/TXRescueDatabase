import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

async function requirePetOwner() {
  const session = await getSession();

  if (!session || session.status !== "approved") {
    return null;
  }

  const rows = await sql`
    select
      id,
      display_name,
      phone,
      city,
      state,
      postal_code,
      created_at,
      updated_at
    from pet_owner_profiles
    where user_id = ${session.id}::uuid
    limit 1
  `;

  if (!rows[0]?.id) {
    return null;
  }

  return {
    session,
    profile: rows[0],
  };
}

export async function GET() {
  try {
    const access = await requirePetOwner();

    if (!access) {
      return NextResponse.json(
        { error: "Pet Owner access required." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      profile: access.profile,
      email: access.session.email,
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
            : "Couldn't load profile.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest
) {
  try {
    const access = await requirePetOwner();

    if (!access) {
      return NextResponse.json(
        { error: "Pet Owner access required." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const text = (value: unknown) =>
      typeof value === "string"
        ? value.trim()
        : "";

    const state =
      text(body?.state).toUpperCase() || "TX";

    if (state.length !== 2) {
      return NextResponse.json(
        {
          error:
            "State must use a two-letter abbreviation.",
        },
        { status: 400 }
      );
    }

    const rows = await sql`
      update pet_owner_profiles
      set
        display_name =
          ${text(body?.displayName) || null},
        phone =
          ${text(body?.phone) || null},
        city =
          ${text(body?.city) || null},
        state = ${state},
        postal_code =
          ${text(body?.postalCode) || null},
        updated_at = now()
      where id = ${String(access.profile.id)}
      returning
        id,
        display_name,
        phone,
        city,
        state,
        postal_code,
        created_at,
        updated_at
    `;

    return NextResponse.json({
      profile: rows[0],
      email: access.session.email,
    });
  } catch (err) {
    console.error(
      "PATCH /api/pet-owner/profile failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't update profile.",
      },
      { status: 500 }
    );
  }
}
