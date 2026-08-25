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
  const session = await getSession();

  if (
    !session ||
    session.status !== "approved"
  ) {
    return null;
  }

  const rows = await sql`
    select id
    from pet_owner_profiles
    where user_id = ${session.id}::uuid
    limit 1
  `;

  if (!rows[0]?.id) {
    return null;
  }

  return {
    ownerProfileId: String(rows[0].id),
  };
}

async function getOwnedRecord(
  recordId: string,
  ownerProfileId: string
) {
  const rows = await sql`
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
      pr.id = ${recordId}
      and p.owner_profile_id = ${ownerProfileId}
    limit 1
  `;

  return rows[0] ?? null;
}

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const access = await requirePetOwner();

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

    const { id: recordId } = await params;

    const record = await getOwnedRecord(
      recordId,
      access.ownerProfileId
    );

    if (!record) {
      return NextResponse.json(
        {
          error:
            "Record not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      record,
    });
  } catch (err) {
    console.error(
      "GET /api/pet-owner/records/[id] failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load record.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const access = await requirePetOwner();

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

    const { id: recordId } = await params;

    const existing = await getOwnedRecord(
      recordId,
      access.ownerProfileId
    );

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Record not found.",
        },
        {
          status: 404,
        }
      );
    }

    const body = await req.json();

    const text = (
      value: unknown
    ) =>
      typeof value === "string"
        ? value.trim()
        : "";

    const recordType = text(
      body?.recordType
    );

    const title = text(
      body?.title
    );

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
      text(body?.recordDate) || null;

    const rows = await sql`
      update pet_records
      set
        record_type = ${recordType},
        title = ${title},
        record_date = ${recordDate},
        provider_name =
          ${text(body?.providerName) || null},
        notes =
          ${text(body?.notes) || null},
        document_url =
          ${text(body?.documentUrl) || null},
        updated_at = now()
      where
        id = ${recordId}
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

    return NextResponse.json({
      record: rows[0],
    });
  } catch (err) {
    console.error(
      "PATCH /api/pet-owner/records/[id] failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't update record.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const access = await requirePetOwner();

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

    const { id: recordId } = await params;

    const existing = await getOwnedRecord(
      recordId,
      access.ownerProfileId
    );

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Record not found.",
        },
        {
          status: 404,
        }
      );
    }

    await sql`
      delete from pet_records
      where id = ${recordId}
    `;

    return NextResponse.json({
      success: true,
      petId: existing.pet_id,
    });
  } catch (err) {
    console.error(
      "DELETE /api/pet-owner/records/[id] failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't delete record.",
      },
      {
        status: 500,
      }
    );
  }
}
