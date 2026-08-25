import {
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

    const records =
      await sql`
        select
          pr.id,
          pr.pet_id,
          pr.record_type,
          pr.title,
          pr.record_date,
          pr.provider_name,
          pr.notes,
          pr.document_url,
          pr.created_at,
          pr.updated_at,
          p.name as pet_name

        from pet_records pr

        join owned_pets p
          on p.id = pr.pet_id

        where
          p.owner_profile_id =
            ${access.ownerProfileId}

        order by
          pr.record_date desc nulls last,
          pr.created_at desc
      `;

    return NextResponse.json({
      records,
    });
  } catch (err) {
    console.error(
      "GET /api/pet-owner/records failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load pet records.",
      },
      {
        status: 500,
      }
    );
  }
}
