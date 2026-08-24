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
