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
      String(rows[0].id),
  };
}

export async function POST(
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

    const petRows =
      await sql`
        select id
        from owned_pets
        where
          id = ${petId}
          and owner_profile_id =
            ${access.ownerProfileId}
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

    const body =
      await req.json();

    const recordType =
      typeof body?.recordType ===
        "string"
        ? body.recordType.trim()
        : "";

    const title =
      typeof body?.title ===
        "string"
        ? body.title.trim()
        : "";

    if (!recordType) {
      return NextResponse.json(
        {
          error:
            "Record type is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Record title is required.",
        },
        {
          status: 400,
        }
      );
    }

    const recordDate =
      typeof body?.recordDate ===
        "string" &&
      body.recordDate.trim()
        ? body.recordDate.trim()
        : null;

    const providerName =
      typeof body?.providerName ===
        "string"
        ? body.providerName.trim()
        : "";

    const notes =
      typeof body?.notes ===
        "string"
        ? body.notes.trim()
        : "";

    const documentUrl =
      typeof body?.documentUrl ===
        "string"
        ? body.documentUrl.trim()
        : "";

    const rows =
      await sql`
        insert into pet_records (
          pet_id,
          record_type,
          title,
          record_date,
          provider_name,
          notes,
          document_url
        )
        values (
          ${petId},
          ${recordType},
          ${title},
          ${recordDate},
          ${providerName || null},
          ${notes || null},
          ${documentUrl || null}
        )
        returning
          id,
          pet_id,
          record_type,
          title,
          record_date,
          provider_name,
          notes,
          document_url,
          created_at,
          updated_at
      `;

    return NextResponse.json(
      {
        record:
          rows[0],
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.error(
      "POST /api/pet-owner/pets/[id]/records failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't add record.",
      },
      {
        status: 500,
      }
    );
  }
}
