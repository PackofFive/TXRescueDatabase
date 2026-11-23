import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

async function getApprovedSession() {
  const session = await getSession();

  if (!session || session.status !== "approved") {
    return null;
  }

  return session;
}

async function requirePetOwner() {
  const session = await getApprovedSession();

  if (!session) return null;

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
    const session = await getApprovedSession();

    if (!session) {
      return NextResponse.json(
        { error: "Sign in to continue." },
        { status: 401 }
      );
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

    return NextResponse.json({
      profile: rows[0] ?? null,
      email: session.email,
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

export async function POST(req: NextRequest) {
  try {
    const session = await getApprovedSession();

    if (!session) {
      return NextResponse.json(
        { error: "Sign in to continue." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const text = (value: unknown) =>
      typeof value === "string" ? value.trim() : "";
    const state = text(body?.state).toUpperCase() || "TX";

    if (state.length !== 2) {
      return NextResponse.json(
        { error: "State must use a two-letter abbreviation." },
        { status: 400 }
      );
    }

    const rows = await sql`
      insert into pet_owner_profiles (
        user_id,
        display_name,
        phone,
        city,
        state,
        postal_code
      )
      select
        ${session.id}::uuid,
        ${text(body?.displayName) || null},
        ${text(body?.phone) || null},
        ${text(body?.city) || null},
        ${state},
        ${text(body?.postalCode) || null}
      where not exists (
        select 1
        from pet_owner_profiles
        where user_id = ${session.id}::uuid
      )
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

    if (!rows[0]) {
      const existing = await sql`
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

      return NextResponse.json({
        profile: existing[0],
        email: session.email,
        alreadyExists: true,
      });
    }

    return NextResponse.json(
      { profile: rows[0], email: session.email },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/pet-owner/profile failed:", err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't create profile.",
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
