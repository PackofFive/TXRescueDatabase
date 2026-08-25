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

async function resolveFosterProfile() {
  const session =
    await getSession();

  if (
    !session ||
    session.status !==
      "approved"
  ) {
    return null;
  }

  const email =
    session.email
      ?.trim()
      .toLowerCase() ??
    "";

  const rows =
    await sql`
      select
        id,
        user_id,
        full_name,
        email,
        phone,
        city,
        state,
        postal_code,
        availability_status,
        unavailable_until,
        max_capacity,
        species_preferences,
        size_preferences,
        resident_pets,
        children_in_home,
        has_fenced_yard,
        foster_experience,
        medical_experience,
        behavioral_experience,
        transport_available,
        profile_notes,
        created_at,
        updated_at

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

  const profile =
    rows[0] ??
    null;

  if (
    profile &&
    !profile.user_id
  ) {
    await sql`
      update foster_profiles

      set
        user_id =
          ${session.id}::uuid,
        updated_at =
          now()

      where
        id =
          ${String(profile.id)}
        and user_id is null
    `;

    profile.user_id =
      session.id;
  }

  return {
    session,
    profile,
  };
}

export async function GET() {
  try {
    const access =
      await resolveFosterProfile();

    if (!access) {
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

    if (!access.profile) {
      return NextResponse.json(
        {
          error:
            "No Foster Profile is linked to this account.",
          profile:
            null,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      profile:
        access.profile,
      accountEmail:
        access.session.email,
    });
  } catch (err) {
    console.error(
      "GET /api/foster/profile failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load Foster Profile.",
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
      await resolveFosterProfile();

    if (!access) {
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

    if (!access.profile) {
      return NextResponse.json(
        {
          error:
            "No Foster Profile is linked to this account.",
        },
        {
          status: 404,
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

    const state =
      text(
        body?.state
      ).toUpperCase() ||
      "TX";

    if (
      state.length !== 2
    ) {
      return NextResponse.json(
        {
          error:
            "State must use a two-letter abbreviation.",
        },
        {
          status: 400,
        }
      );
    }

    const maxCapacityRaw =
      body?.maxCapacity;

    const maxCapacity =
      maxCapacityRaw === "" ||
      maxCapacityRaw === null ||
      typeof maxCapacityRaw ===
        "undefined"
        ? null
        : Number(
            maxCapacityRaw
          );

    if (
      maxCapacity !== null &&
      (
        !Number.isInteger(
          maxCapacity
        ) ||
        maxCapacity < 0
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Maximum capacity must be a whole number of zero or greater.",
        },
        {
          status: 400,
        }
      );
    }

    const availabilityStatus =
      text(
        body?.availabilityStatus
      ) ||
      "available";

    const allowedAvailability =
      [
        "available",
        "limited",
        "unavailable",
      ];

    if (
      !allowedAvailability.includes(
        availabilityStatus
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid availability status.",
        },
        {
          status: 400,
        }
      );
    }

    const unavailableUntil =
      text(
        body?.unavailableUntil
      ) ||
      null;

    const speciesPreferences =
      Array.isArray(
        body?.speciesPreferences
      )
        ? body.speciesPreferences
            .map(
              (
                value: unknown
              ) =>
                text(
                  value
                )
            )
            .filter(
              Boolean
            )
        : [];

    const sizePreferences =
      Array.isArray(
        body?.sizePreferences
      )
        ? body.sizePreferences
            .map(
              (
                value: unknown
              ) =>
                text(
                  value
                )
            )
            .filter(
              Boolean
            )
        : [];

    const childrenInHome =
      typeof body?.childrenInHome ===
        "boolean"
        ? body.childrenInHome
        : null;

    const hasFencedYard =
      typeof body?.hasFencedYard ===
        "boolean"
        ? body.hasFencedYard
        : null;

    const transportAvailable =
      Boolean(
        body?.transportAvailable
      );

    const rows =
      await sql`
        update foster_profiles

        set
          full_name =
            ${text(body?.fullName) || access.profile.full_name},
          phone =
            ${text(body?.phone) || null},
          city =
            ${text(body?.city) || null},
          state =
            ${state},
          postal_code =
            ${text(body?.postalCode) || null},
          availability_status =
            ${availabilityStatus},
          unavailable_until =
            ${unavailableUntil},
          max_capacity =
            ${maxCapacity},
          species_preferences =
            ${speciesPreferences},
          size_preferences =
            ${sizePreferences},
          resident_pets =
            ${text(body?.residentPets) || null},
          children_in_home =
            ${childrenInHome},
          has_fenced_yard =
            ${hasFencedYard},
          foster_experience =
            ${text(body?.fosterExperience) || null},
          medical_experience =
            ${text(body?.medicalExperience) || null},
          behavioral_experience =
            ${text(body?.behavioralExperience) || null},
          transport_available =
            ${transportAvailable},
          profile_notes =
            ${text(body?.profileNotes) || null},
          updated_at =
            now()

        where
          id =
            ${String(access.profile.id)}

        returning
          id,
          user_id,
          full_name,
          email,
          phone,
          city,
          state,
          postal_code,
          availability_status,
          unavailable_until,
          max_capacity,
          species_preferences,
          size_preferences,
          resident_pets,
          children_in_home,
          has_fenced_yard,
          foster_experience,
          medical_experience,
          behavioral_experience,
          transport_available,
          profile_notes,
          created_at,
          updated_at
      `;

    return NextResponse.json({
      profile:
        rows[0],
      accountEmail:
        access.session.email,
    });
  } catch (err) {
    console.error(
      "PATCH /api/foster/profile failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't update Foster Profile.",
      },
      {
        status: 500,
      }
    );
  }
}
