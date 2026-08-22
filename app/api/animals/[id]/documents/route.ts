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

type AnimalFilesBucket = {
  put: (
    key: string,
    value: ArrayBuffer,
    options?: {
      httpMetadata?: {
        contentType?: string;
      };

      customMetadata?: Record<
        string,
        string
      >;
    }
  ) => Promise<unknown>;

  get: (
    key: string
  ) => Promise<{
    arrayBuffer: () => Promise<ArrayBuffer>;
    httpMetadata?: {
      contentType?: string;
    };
  } | null>;

  delete: (
    key: string
  ) => Promise<void>;
};

type Env = {
  MEDICAL_FILES:
    AnimalFilesBucket;
};

type DocumentVisibility =
  | "private"
  | "approved_foster"
  | "public";

const MAX_FILE_SIZE =
  15 * 1024 * 1024;

const ALLOWED_TYPES =
  new Set([
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

const VALID_VISIBILITIES:
  DocumentVisibility[] = [
    "private",
    "approved_foster",
    "public",
  ];

/* =========================================================
   ACCESS
========================================================= */

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

        and
        current_org_id =
          ${orgId}

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

/* =========================================================
   GET DOCUMENT LIST
========================================================= */

export async function GET(
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
    } =
      await params;

    const {
      orgId,
    } =
      await requireAnimalAccess(
        animalId
      );

    const url =
      new URL(
        req.url
      );

    const documentId =
      cleanText(
        url.searchParams.get(
          "documentId"
        )
      );

    /* =====================================================
       OPEN / DOWNLOAD ONE FILE
    ===================================================== */

    if (documentId) {
      const rows =
        await sql`
          select
            id,
            storage_key,
            original_filename,
            content_type

          from animal_documents

          where
            id = ${documentId}

            and
            animal_id =
              ${animalId}

            and
            org_id =
              ${orgId}

          limit 1
        `;

      const document =
        rows[0];

      if (!document) {
        return NextResponse.json(
          {
            error:
              "Document not found.",
          },
          {
            status: 404,
          }
        );
      }

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
              "Animal file storage is not configured.",
          },
          {
            status: 500,
          }
        );
      }

      const object =
        await env.MEDICAL_FILES.get(
          document.storage_key
        );

      if (!object) {
        return NextResponse.json(
          {
            error:
              "Stored document file could not be found.",
          },
          {
            status: 404,
          }
        );
      }

      const buffer =
        await object.arrayBuffer();

      const download =
        url.searchParams.get(
          "download"
        ) === "true";

      return new NextResponse(
        buffer,
        {
          status: 200,

          headers: {
            "Content-Type":
              document.content_type ||
              object.httpMetadata
                ?.contentType ||
              "application/octet-stream",

            "Content-Disposition":
              `${download
                ? "attachment"
                : "inline"}; filename="${safeHeaderFilename(
                document.original_filename
              )}"`,

            "Cache-Control":
              "private, no-store",
          },
        }
      );
    }

    /* =====================================================
       LIST DOCUMENTS
    ===================================================== */

    const documents =
      await sql`
        select
          ad.id,
          ad.animal_id,
          ad.org_id,
          ad.title,
          ad.category,
          ad.document_date,
          ad.source,
          ad.notes,
          ad.original_filename,
          ad.content_type,
          ad.file_size,
          ad.visibility,
          ad.uploaded_by,
          ad.created_at,
          ad.updated_at,

          u.email as uploaded_by_email

        from animal_documents ad

        left join users u
          on u.id =
            ad.uploaded_by

        where
          ad.animal_id =
            ${animalId}

          and
          ad.org_id =
            ${orgId}

        order by
          ad.document_date desc
            nulls last,

          ad.created_at desc
      `;

    return NextResponse.json({
      documents,
    });
  } catch (err) {
    if (
      err instanceof
      AuthError
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
      "GET animal documents failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load animal documents.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST DOCUMENT
========================================================= */

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
    } =
      await params;

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
      formData.get(
        "file"
      );

    if (
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          error:
            "A document or image is required.",
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

    const category =
      cleanText(
        formData.get(
          "category"
        )
      ) ||
      "other";

    const source =
      cleanText(
        formData.get(
          "source"
        )
      );

    const notes =
      cleanText(
        formData.get(
          "notes"
        )
      );

    const visibility =
      normalizeVisibility(
        formData.get(
          "visibility"
        )
      );

    if (!visibility) {
      return NextResponse.json(
        {
          error:
            "Document visibility is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    const documentDateRaw =
      cleanText(
        formData.get(
          "documentDate"
        )
      );

    let documentDate:
      | string
      | null =
      null;

    if (
      documentDateRaw
    ) {
      const parsed =
        parseDate(
          documentDateRaw
        );

      if (!parsed) {
        return NextResponse.json(
          {
            error:
              "Document date is invalid.",
          },
          {
            status: 400,
          }
        );
      }

      documentDate =
        parsed;
    }

    const safeName =
      sanitizeFilename(
        file.name
      );

    const storageKey =
      [
        "animals",
        orgId,
        animalId,
        "documents",
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
            "Animal file storage is not configured.",
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
          category,
          visibility,
        },
      }
    );

    try {
      const rows =
        await sql`
          insert into animal_documents (
            animal_id,
            org_id,
            title,
            category,
            document_date,
            source,
            notes,
            storage_key,
            original_filename,
            content_type,
            file_size,
            visibility,
            uploaded_by
          )

          values (
            ${animalId},
            ${orgId},
            ${title},
            ${category},
            ${documentDate}::date,
            ${source},
            ${notes},
            ${storageKey},
            ${file.name},
            ${file.type},
            ${file.size},
            ${visibility},
            ${session.id}
          )

          returning
            id,
            animal_id,
            org_id,
            title,
            category,
            document_date,
            source,
            notes,
            original_filename,
            content_type,
            file_size,
            visibility,
            uploaded_by,
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
            'document_uploaded',
            ${JSON.stringify({
              documentId:
                rows[0].id,

              filename:
                file.name,

              category,

              visibility,
            })}
          )
        `;
      } catch (
        auditError
      ) {
        console.error(
          "Animal document audit failed:",
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
      err instanceof
      AuthError
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
      "POST animal document failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't upload animal document.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH DOCUMENT METADATA
========================================================= */

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
    const {
      id: animalId,
    } =
      await params;

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
        .catch(
          () => null
        );

    if (!body) {
      return NextResponse.json(
        {
          error:
            "Request body is required.",
        },
        {
          status: 400,
        }
      );
    }

    const documentId =
      cleanText(
        body.documentId
      );

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

    const currentRows =
      await sql`
        select *

        from animal_documents

        where
          id = ${documentId}

          and
          animal_id =
            ${animalId}

          and
          org_id =
            ${orgId}

        limit 1
      `;

    const current =
      currentRows[0];

    if (!current) {
      return NextResponse.json(
        {
          error:
            "Document not found.",
        },
        {
          status: 404,
        }
      );
    }

    const title =
      body.title ===
      undefined
        ? current.title
        : cleanText(
            body.title
          );

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Document title is required.",
        },
        {
          status: 400,
        }
      );
    }

    const category =
      body.category ===
      undefined
        ? current.category
        : cleanText(
            body.category
          ) ||
          "other";

    const source =
      body.source ===
      undefined
        ? current.source
        : cleanText(
            body.source
          );

    const notes =
      body.notes ===
      undefined
        ? current.notes
        : cleanText(
            body.notes
          );

    let visibility =
      current.visibility as DocumentVisibility;

    if (
      body.visibility !==
      undefined
    ) {
      const parsed =
        normalizeVisibility(
          body.visibility
        );

      if (!parsed) {
        return NextResponse.json(
          {
            error:
              "Document visibility is invalid.",
          },
          {
            status: 400,
          }
        );
      }

      visibility =
        parsed;
    }

    let documentDate =
      current.document_date
        ? String(
            current.document_date
          ).slice(
            0,
            10
          )
        : null;

    if (
      body.documentDate !==
      undefined
    ) {
      if (
        body.documentDate ===
          null ||
        body.documentDate ===
          ""
      ) {
        documentDate =
          null;
      } else {
        const parsed =
          parseDate(
            body.documentDate
          );

        if (!parsed) {
          return NextResponse.json(
            {
              error:
                "Document date is invalid.",
            },
            {
              status: 400,
            }
          );
        }

        documentDate =
          parsed;
      }
    }

    const rows =
      await sql`
        update animal_documents

        set
          title =
            ${title},

          category =
            ${category},

          document_date =
            ${documentDate}::date,

          source =
            ${source},

          notes =
            ${notes},

          visibility =
            ${visibility},

          updated_at =
            now()

        where
          id = ${documentId}

          and
          animal_id =
            ${animalId}

          and
          org_id =
            ${orgId}

        returning
          id,
          animal_id,
          org_id,
          title,
          category,
          document_date,
          source,
          notes,
          original_filename,
          content_type,
          file_size,
          visibility,
          uploaded_by,
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
          'document_updated',
          ${JSON.stringify({
            documentId,
            title,
            category,
            visibility,
          })}
        )
      `;
    } catch (
      auditError
    ) {
      console.error(
        "Animal document update audit failed:",
        auditError
      );
    }

    return NextResponse.json({
      document:
        rows[0],
    });
  } catch (err) {
    if (
      err instanceof
      AuthError
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
      "PATCH animal document failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't update animal document.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE DOCUMENT
========================================================= */

export async function DELETE(
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
    } =
      await params;

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
        .catch(
          () => null
        );

    const documentId =
      cleanText(
        body?.documentId
      );

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

    const rows =
      await sql`
        select
          id,
          storage_key,
          original_filename,
          category

        from animal_documents

        where
          id = ${documentId}

          and
          animal_id =
            ${animalId}

          and
          org_id =
            ${orgId}

        limit 1
      `;

    const document =
      rows[0];

    if (!document) {
      return NextResponse.json(
        {
          error:
            "Document not found.",
        },
        {
          status: 404,
        }
      );
    }

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
            "Animal file storage is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    await env.MEDICAL_FILES.delete(
      document.storage_key
    );

    await sql`
      delete from animal_documents

      where
        id = ${documentId}

        and
        animal_id =
          ${animalId}

        and
        org_id =
          ${orgId}
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
          'document_deleted',
          ${JSON.stringify({
            documentId,
            filename:
              document.original_filename,
            category:
              document.category,
          })}
        )
      `;
    } catch (
      auditError
    ) {
      console.error(
        "Animal document deletion audit failed:",
        auditError
      );
    }

    return NextResponse.json({
      deleted: true,
    });
  } catch (err) {
    if (
      err instanceof
      AuthError
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
      "DELETE animal document failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't delete animal document.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   HELPERS
========================================================= */

function cleanText(
  value:
    | unknown
    | FormDataEntryValue
    | null
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  if (
    value instanceof File
  ) {
    return null;
  }

  const text =
    String(
      value
    ).trim();

  return text ||
    null;
}

function normalizeVisibility(
  value: unknown
):
  | DocumentVisibility
  | null {
  const visibility =
    String(
      value ??
        "private"
    )
      .trim()
      .toLowerCase() as DocumentVisibility;

  return VALID_VISIBILITIES.includes(
    visibility
  )
    ? visibility
    : null;
}

function parseDate(
  value: unknown
) {
  const text =
    String(
      value
    ).trim();

  if (!text) {
    return null;
  }

  const date =
    new Date(
      `${text}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return text;
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

function safeHeaderFilename(
  filename: string
) {
  return filename
    .replace(
      /["\r\n]/g,
      "_"
    )
    .slice(
      0,
      180
    );
}
