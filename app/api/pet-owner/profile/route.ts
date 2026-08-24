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
    session.status !==
      "approved"
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

    const profileRows =
      await sql`
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

    const profile =
      profileRows[0] ??
      null;

    if (!profile) {
      return NextResponse.json({
        profile: null,
        pets: [],
        stats: {
          activePets: 0,
          records: 0,
        },
      });
    }

    const petRows =
      await sql`
        select
          id,
          name,
          species,
          breed_or_type,
          birth_date,
          approximate_age_text,
          sex,
          color_markings,
          weight_lbs,
          spay_neuter_status,
          microchip_number,
          microchip_company,
          veterinarian_name,
          veterinarian_phone,
          photo_url,
          notes,
          archived_at,
          created_at,
          updated_at
        from owned_pets
        where owner_profile_id = ${profile.id}
        order by
          case
            when archived_at is null then 0
            else 1
          end,
          created_at desc
      `;

    const recordRows =
      await sql`
        select count(*)::int as count
        from pet_records pr
        join owned_pets p
          on p.id = pr.pet_id
        where p.owner_profile_id = ${profile.id}
      `;

    return NextResponse.json({
      profile,
      pets: petRows,
      stats: {
        activePets:
          petRows.filter(
            (pet) =>
              !pet.archived_at
          ).length,
        records:
          Number(
            recordRows[0]
              ?.count ??
              0
          ),
      },
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
      typeof body?.displayName ===
        "string"
        ? body.displayName.trim()
        : "";

    const phone =
      typeof body?.phone ===
        "string"
        ? body.phone.trim()
        : "";

    const city =
      typeof body?.city ===
        "string"
        ? body.city.trim()
        : "";

    const state =
      typeof body?.state ===
        "string" &&
      body.state.trim()
        ? body.state
            .trim()
            .toUpperCase()
        : "TX";

    const postalCode =
      typeof body?.postalCode ===
        "string"
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
          display_name = excluded.display_name,
          phone = excluded.phone,
          city = excluded.city,
          state = excluded.state,
          postal_code = excluded.postal_code,
          updated_at = now()
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

    return NextResponse.json(
      {
        profile:
          rows[0],
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
            : "Couldn't activate Pet Owner Portal.",
      },
      {
        status: 500,
      }
    );
  }
}
