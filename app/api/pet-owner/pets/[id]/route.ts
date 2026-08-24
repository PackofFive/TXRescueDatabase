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
    session.status !== "approved"
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
    session,
    ownerProfileId:
      String(rows[0].id),
  };
}

/*
  GET
  Load one pet and its records.
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

    const {
      id: petId,
    } = await params;

    const petRows =
      await sql`
        select
          p.id,
          p.name,
          p.species,
          p.breed_or_type,
          p.birth_date,
          p.approximate_age_text,
          p.sex,
          p.color_markings,
          p.weight_lbs,
          p.spay_neuter_status,
          p.microchip_number,
          p.microchip_company,
          p.veterinarian_name,
          p.veterinarian_phone,
          p.photo_url,
          p.notes,
          p.archived_at,
          p.created_at,
          p.updated_at

        from owned_pets p

        where
          p.id = ${petId}
          and p.owner_profile_id =
            ${access.ownerProfileId}

        limit 1
      `;

    const pet =
      petRows[0];

    if (!pet) {
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

    const recordRows =
      await sql`
        select
          id,
          record_type,
          title,
          record_date,
          provider_name,
          notes,
          document_url,
          created_at,
          updated_at

        from pet_records

        where
          pet_id = ${petId}

        order by
          record_date desc nulls last,
          created_at desc
      `;

    return NextResponse.json({
      pet,
      records:
        recordRows,
    });
  } catch (err) {
    console.error(
      "GET /api/pet-owner/pets/[id] failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load pet profile.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
  PATCH
  Update one pet belonging to
  the signed-in Pet Owner.
*/
export async function PATCH(
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

    const {
      id: petId,
    } = await params;

    const body =
      await req.json();

    const text = (
      value: unknown
    ) =>
      typeof value === "string"
        ? value.trim()
        : "";

    const name =
      text(body?.name);

    if (!name) {
      return NextResponse.json(
        {
          error:
            "Pet name is required.",
        },
        {
          status: 400,
        }
      );
    }

    const birthDate =
      text(body?.birthDate) ||
      null;

    const weightText =
      text(body?.weightLbs);

    const weightLbs =
      weightText
        ? Number(weightText)
        : null;

    if (
      weightLbs !== null &&
      (
        !Number.isFinite(
          weightLbs
        ) ||
        weightLbs < 0
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Weight must be a valid positive number.",
        },
        {
          status: 400,
        }
      );
    }

    const spayNeuterStatus =
      text(
        body?.spayNeuterStatus
      ) || null;

    const allowedStatuses = [
      "spayed",
      "neutered",
      "intact",
      "unknown",
      "not_applicable",
    ];

    if (
      spayNeuterStatus &&
      !allowedStatuses.includes(
        spayNeuterStatus
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid spay/neuter status.",
        },
        {
          status: 400,
        }
      );
    }

    const rows =
      await sql`
        update owned_pets

        set
          name = ${name},
          species =
            ${text(body?.species) || null},
          breed_or_type =
            ${text(body?.breedOrType) || null},
          birth_date =
            ${birthDate},
          approximate_age_text =
            ${text(body?.approximateAgeText) || null},
          sex =
            ${text(body?.sex) || null},
          color_markings =
            ${text(body?.colorMarkings) || null},
          weight_lbs =
            ${weightLbs},
          spay_neuter_status =
            ${spayNeuterStatus},
          microchip_number =
            ${text(body?.microchipNumber) || null},
          microchip_company =
            ${text(body?.microchipCompany) || null},
          veterinarian_name =
            ${text(body?.veterinarianName) || null},
          veterinarian_phone =
            ${text(body?.veterinarianPhone) || null},
          photo_url =
            ${text(body?.photoUrl) || null},
          notes =
            ${text(body?.notes) || null},
          updated_at =
            now()

        where
          id = ${petId}
          and owner_profile_id =
            ${access.ownerProfileId}

        returning
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
      `;

    const pet =
      rows[0];

    if (!pet) {
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

    return NextResponse.json({
      pet,
    });
  } catch (err) {
    console.error(
      "PATCH /api/pet-owner/pets/[id] failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't update pet.",
      },
      {
        status: 500,
      }
    );
  }
}
