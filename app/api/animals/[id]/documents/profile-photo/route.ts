import {
  NextRequest,
  NextResponse,
} from "next/server";

import { sql } from "@/lib/db";

import {
  requireEffectiveOrg,
  AuthError,
} from "@/lib/auth";

export const runtime = "edge";

const IMAGE_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

async function requireAnimalAccess(
  animalId: string
) {
  const {
    session,
    orgId,
  } =
    await requireEffectiveOrg();

  const rows =
    await sql`
      select id
      from animals
      where
        id = ${animalId}
        and current_org_id = ${orgId}
      limit 1
    `;

  if (!rows[0]) {
    throw new AuthError(
      "Animal not found or you do not have access to this record.",
      404
    );
  }

  return {
    session,
    orgId,
  };
}

export async function POST(
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
    const {
      id: animalId,
    } = await params;

    const {
      session,
      orgId,
    } =
      await requireAnimalAccess(
        animalId
      );

    const body =
      await req
        .json()
        .catch(() => null);

    const documentId =
      typeof body?.documentId ===
      "string"
        ? body.documentId.trim()
        : "";

    if (!documentId) {
      return NextResponse.json(
        {
          error:
            "Document ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const documentRows =
      await sql`
        select
          id,
          title,
          content_type,
          visibility

        from animal_documents

        where
          id = ${documentId}
          and animal_id = ${animalId}
          and org_id = ${orgId}

        limit 1
      `;

    const document =
      documentRows[0];

    if (!document) {
      return NextResponse.json(
        {
          error:
            "Photo could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      !IMAGE_TYPES.has(
        String(
          document.content_type
        )
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG, and WebP images can be used as the profile photo.",
        },
        {
          status: 400,
        }
      );
    }

    const photoUrl =
      `/api/animals/${encodeURIComponent(
        animalId
      )}/documents?documentId=${encodeURIComponent(
        documentId
      )}`;

    await sql`
      delete from media
      where
        owner_type = 'animal'
        and owner_id = ${animalId}
        and source =
          'animal_document_profile_photo'
    `;

    const mediaRows =
      await sql`
        insert into media (
          owner_type,
          owner_id,
          url,
          source,
          visibility
        )

        values (
          'animal',
          ${animalId},
          ${photoUrl},
          'animal_document_profile_photo',
          ${document.visibility}
        )

        returning
          id,
          url,
          source,
          visibility
      `;

    try {
      await sql`
        insert into audit_log (
          entity_type,
          entity_id,
          changed_by,
          field_name,
          new_value
        )

        values (
          'animal',
          ${animalId},
          ${session.id},
          'profile_photo_changed',
          ${JSON.stringify({
            documentId,
            documentTitle:
              document.title,
          })}
        )
      `;
    } catch (
      auditError
    ) {
      console.error(
        "Profile photo audit failed:",
        auditError
      );
    }

    return NextResponse.json({
      photo:
        mediaRows[0],
    });
  } catch (err) {
    if (
      err instanceof AuthError
    ) {
      return NextResponse.json(
        {
          error:
            err.message,
        },
        {
          status:
            err.status,
        }
      );
    }

    console.error(
      "POST profile photo failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't set profile photo.",
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
    const {
      id: animalId,
    } = await params;

    const {
      session,
    } =
      await requireAnimalAccess(
        animalId
      );

    const rows =
      await sql`
        delete from media

        where
          owner_type = 'animal'
          and owner_id = ${animalId}
          and source =
            'animal_document_profile_photo'

        returning
          id,
          url
      `;

    try {
      await sql`
        insert into audit_log (
          entity_type,
          entity_id,
          changed_by,
          field_name,
          new_value
        )

        values (
          'animal',
          ${animalId},
          ${session.id},
          'profile_photo_removed',
          ${JSON.stringify({
            removed:
              rows.length > 0,
          })}
        )
      `;
    } catch (
      auditError
    ) {
      console.error(
        "Profile photo removal audit failed:",
        auditError
      );
    }

    return NextResponse.json({
      removed:
        rows.length > 0,
    });
  } catch (err) {
    if (
      err instanceof AuthError
    ) {
      return NextResponse.json(
        {
          error:
            err.message,
        },
        {
          status:
            err.status,
        }
      );
    }

    console.error(
      "DELETE profile photo failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't remove profile photo.",
      },
      {
        status: 500,
      }
    );
  }
}
