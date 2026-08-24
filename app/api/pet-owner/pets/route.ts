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
    session,
    ownerProfileId:
      String(
        rows[0].id
      ),
  };
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

    const name =
      typeof body?.name ===
        "string"
        ? body.name.trim()
        : "";

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

    const species =
      typeof body?.species ===
        "string"
        ? body.species.trim()
        : "";

    const breedOrType =
      typeof body?.breedOrType ===
        "string"
        ? body.breedOrType.trim()
        : "";

    const birthDate =
      typeof body?.birthDate ===
        "string" &&
      body.birthDate.trim()
        ? body.birthDate.trim()
        : null;

    const approximateAgeText =
      typeof body?.approximateAgeText ===
        "string"
        ? body.approximateAgeText.trim()
        : "";

    const sex =
      typeof body?.sex ===
        "string"
        ? body.sex.trim()
        : "";

    const colorMarkings =
      typeof body?.colorMarkings ===
        "string"
        ? body.colorMarkings.trim()
        : "";

    const weightRaw =
      body?.weightLbs;

    const weightLbs =
      weightRaw === "" ||
      weightRaw === null ||
      typeof weightRaw ===
        "undefined"
        ? null
        : Number(weightRaw);

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
      typeof body?.spayNeuterStatus ===
        "string" &&
      body.spayNeuterStatus.trim()
        ? body.spayNeuterStatus.trim()
        : null;

    const allowedSpayNeuter =
      [
        "spayed",
        "neutered",
        "intact",
        "unknown",
        "not_applicable",
      ];

    if (
      spayNeuterStatus &&
      !allowedSpayNeuter.includes(
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

    const microchipNumber =
      typeof body?.microchipNumber ===
        "string"
        ? body.microchipNumber.trim()
        : "";

    const microchipCompany =
      typeof body?.microchipCompany ===
        "string"
        ? body.microchipCompany.trim()
        : "";

    const veterinarianName =
      typeof body?.veterinarianName ===
        "string"
        ? body.veterinarianName.trim()
        : "";

    const veterinarianPhone =
      typeof body?.veterinarianPhone ===
        "string"
        ? body.veterinarianPhone.trim()
        : "";

    const photoUrl =
      typeof body?.photoUrl ===
        "string"
        ? body.photoUrl.trim()
        : "";

    const notes =
      typeof body?.notes ===
        "string"
        ? body.notes.trim()
        : "";

    const rows =
      await sql`
        insert into owned_pets (
          owner_profile_id,
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
          notes
        )
        values (
          ${access.ownerProfileId},
          ${name},
          ${species || null},
          ${breedOrType || null},
          ${birthDate},
          ${approximateAgeText || null},
          ${sex || null},
          ${colorMarkings || null},
          ${weightLbs},
          ${spayNeuterStatus},
          ${microchipNumber || null},
          ${microchipCompany || null},
          ${veterinarianName || null},
          ${veterinarianPhone || null},
          ${photoUrl || null},
          ${notes || null}
        )
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
          created_at,
          updated_at
      `;

    return NextResponse.json(
      {
        pet:
          rows[0],
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.error(
      "POST /api/pet-owner/pets failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't add pet.",
      },
      {
        status: 500,
      }
    );
  }
}
