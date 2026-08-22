import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getRequestContext,
} from "@cloudflare/next-on-pages";

import { sql } from "@/lib/db";

import {
  requireEffectiveOrg,
  AuthError,
} from "@/lib/auth";

export const runtime = "edge";

type Env = {
  MEDICAL_FILES: R2Bucket;
};

const MAX_FILE_SIZE =
  15 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "application/pdf",
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

  const rows = await sql`
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
    const {
      id: animalId,
    } = await params;

    await requireAnimalAccess(
      animalId
    );

    const documents =
      await sql`
        select
          id,
          animal_id,
          title,
          document_type,
          veterinary_provider,
          record_date,
          notes,
          original_filename,
          content_type,
          file_size,
          created_at,
          updated_at

        from animal_medical_documents

        where
          animal_id = ${animalId}

        order by
          record_date desc nulls last,
          created_at desc
      `;

    return NextResponse.json({
      documents,
    });
  } catch (err) {
    if (
      err instanceof AuthError
    ) {
      return NextResponse.json(
        {
          error: err.message,
        },
        {
          status:
            err.status,
        }
      );
    }

    console.error(
      "GET medical documents failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load veterinary records.",
      },
      {
        status: 500,
      }
    );
  }
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

    const formData =
      await req.formData();

    const file =
      formData.get("file");

    if (
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          error:
            "A PDF or image is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_TYPES.has(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Only PDF, JPG, PNG, and WebP files are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            "File must be 15 MB or smaller.",
        },
        {
          status: 400,
        }
      );
    }

    const title =
      cleanText(
        formData.get(
          "title"
        )
      ) ||
      file.name;

    const documentType =
      cleanText(
        formData.get(
          "documentType"
        )
      );

    const veterinaryProvider =
      cleanText(
        formData.get(
          "veterinaryProvider"
        )
      );

    const notes =
      cleanText(
        formData.get(
          "notes"
        )
      );

    const recordDateRaw =
      cleanText(
        formData.get(
          "recordDate"
        )
      );

    let recordDate:
      | string
      | null = null;

    if (recordDateRaw) {
      const parsed =
        new Date(
          `${recordDateRaw}T00:00:00`
        );

      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Record date is invalid.",
          },
          {
            status: 400,
          }
        );
      }

      recordDate =
        recordDateRaw;
    }

    const safeName =
      sanitizeFilename(
        file.name
      );

    const storageKey =
      [
        "medical",
        orgId,
        animalId,
        crypto.randomUUID(),
        safeName,
      ].join("/");

    const context =
      getRequestContext();

    const env =
      context.env as Env;

    if (
      !env.MEDICAL_FILES
    ) {
      return NextResponse.json(
        {
          error:
            "Medical file storage is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const buffer =
      await file.arrayBuffer();

    await env.MEDICAL_FILES.put(
      storageKey,
      buffer,
      {
        httpMetadata: {
          contentType:
            file.type,
        },

        customMetadata: {
          animalId,
          orgId,
          originalFilename:
            file.name,
        },
      }
    );

    try {
      const rows =
        await sql`
          insert into animal_medical_documents (
            animal_id,
            org_id,
            title,
            document_type,
            veterinary_provider,
            record_date,
            notes,
            storage_key,
            original_filename,
            content_type,
            file_size,
            uploaded_by
          )

          values (
            ${animalId},
            ${orgId},
            ${title},
            ${documentType},
            ${veterinaryProvider},
            ${recordDate}::date,
            ${notes},
            ${storageKey},
            ${file.name},
            ${file.type},
            ${file.size},
            ${session.id}
          )

          returning
            id,
            animal_id,
            title,
            document_type,
            veterinary_provider,
            record_date,
            notes,
            original_filename,
            content_type,
            file_size,
            created_at,
            updated_at
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
            'medical_document_uploaded',
            ${file.name}
          )
        `;
      } catch (
        auditError
      ) {
        console.error(
          "Medical document audit failed:",
          auditError
        );
      }

      return NextResponse.json(
        {
          document:
            rows[0],
        },
        {
          status: 201,
        }
      );
    } catch (
      databaseError
    ) {
      await env.MEDICAL_FILES.delete(
        storageKey
      );

      throw databaseError;
    }
  } catch (err) {
    if (
      err instanceof AuthError
    ) {
      return NextResponse.json(
        {
          error: err.message,
        },
        {
          status:
            err.status,
        }
      );
    }

    console.error(
      "POST medical document failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't upload veterinary record.",
      },
      {
        status: 500,
      }
    );
  }
}

function cleanText(
  value:
    | FormDataEntryValue
    | null
) {
  if (
    value === null ||
    value instanceof File
  ) {
    return null;
  }

  const text =
    value.trim();

  return text || null;
}

function sanitizeFilename(
  filename: string
) {
  const cleaned =
    filename
      .replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      )
      .replace(
        /_+/g,
        "_"
      );

  return cleaned ||
    "document";
}
