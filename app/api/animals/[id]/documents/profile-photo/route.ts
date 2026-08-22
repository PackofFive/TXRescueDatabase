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
      await requireEffectiveOrg();

    /*
      Verify animal belongs to
      the effective organization.
    */

    const animalRows =
      await sql`
        select id
        from animals
        where
          id = ${animalId}
          and current_org_id = ${orgId}
        limit 1
      `;

    if (!animalRows[0]) {
      throw new AuthError(
        "Animal not found or you do not have access to this record.",
        404
      );
    }

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

    /*
      Verify the document belongs
      to this animal and organization.
    */

    const documentRows =
      await sql`
        select
          id,
          animal_id,
          org_id,
          title,
          source,
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

    /*
      The existing Documents GET
      endpoint already securely
      serves the stored R2 file.

      We can therefore use that
      authenticated endpoint as
      the media URL rather than
      duplicating the image.
    */

    const photoUrl =
      `/api/animals/${encodeURIComponent(
        animalId
      )}/documents?documentId=${encodeURIComponent(
        documentId
      )}`;

    /*
      Remove the previous primary
      media record.

      The current animal API treats
      the newest media row as the
      primary photo. Keeping one
      profile-photo record makes
      that behavior predictable.

      We only remove records created
      by this Documents feature.
      Other media records are left
      untouched.
    */

    await sql`
      delete from media

      where
        owner_type = 'animal'
        and owner_id = ${animalId}
        and source =
          'animal_document_profile_photo'
    `;

    /*
      Create the new profile photo.
    */

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

    /*
      Audit trail.
    */

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
