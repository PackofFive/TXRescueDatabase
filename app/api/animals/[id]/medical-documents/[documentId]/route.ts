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

type StoredObject = {
  body: ReadableStream;
};

type MedicalFilesBucket = {
  get: (
    key: string
  ) => Promise<StoredObject | null>;
};

type Env = {
  MEDICAL_FILES: MedicalFilesBucket;
};

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      documentId: string;
    }>;
  }
) {
  try {
    const {
      id: animalId,
      documentId,
    } = await params;

    const {
      orgId,
    } =
      await requireEffectiveOrg();

    /*
      Confirm:
      - the document exists
      - it belongs to this animal
      - it belongs to this organization
      - the animal is still associated with this organization
    */

    const rows = await sql`
      select
        d.storage_key,
        d.original_filename,
        d.content_type

      from animal_medical_documents d

      join animals a
        on a.id = d.animal_id

      where
        d.id = ${documentId}
        and d.animal_id = ${animalId}
        and d.org_id = ${orgId}
        and a.current_org_id = ${orgId}

      limit 1
    `;

    const document =
      rows[0];

    if (!document) {
      return NextResponse.json(
        {
          error:
            "Medical document not found.",
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
            "Medical file storage is not configured.",
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
            "Stored medical file could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    const headers =
      new Headers();

    headers.set(
      "Content-Type",
      document.content_type ||
        "application/octet-stream"
    );

    headers.set(
      "Content-Disposition",
      `inline; filename="${safeHeaderFilename(
        document.original_filename
      )}"`
    );

    /*
      Medical files should not be cached publicly.
    */

    headers.set(
      "Cache-Control",
      "private, no-store"
    );

    return new Response(
      object.body,
      {
        headers,
      }
    );
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
      "GET medical document file failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't open medical document.",
      },
      {
        status: 500,
      }
    );
  }
}

function safeHeaderFilename(
  value: string
) {
  return value.replace(
    /["\r\n]/g,
    "_"
  );
}
