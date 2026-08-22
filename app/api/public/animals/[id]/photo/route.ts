import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getRequestContext,
} from "@cloudflare/next-on-pages";

import { sql } from "@/lib/db";

export const runtime = "edge";

type AnimalFilesBucket = {
  get: (
    key: string
  ) => Promise<{
    arrayBuffer: () => Promise<ArrayBuffer>;
    httpMetadata?: {
      contentType?: string;
    };
  } | null>;
};

type Env = {
  MEDICAL_FILES:
    AnimalFilesBucket;
};

const PUBLIC_IMAGE_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

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

    /*
      This query intentionally requires all of the following:

      - animal public profile is enabled
      - managing organization is active
      - animal has a selected primary photo
      - selected file belongs to the same animal/org
      - selected file is explicitly approved for public use
    */

    const rows =
      await sql`
        select
          ad.storage_key,
          ad.content_type,
          ad.original_filename

        from animals a

        join organizations o
          on o.id =
            a.current_org_id

        join animal_documents ad
          on ad.id =
            a.primary_photo_document_id

        where
          a.id =
            ${animalId}

          and
          a.public_share_enabled =
            true

          and
          o.archived_at
            is null

          and
          ad.animal_id =
            a.id

          and
          ad.org_id =
            a.current_org_id

          and
          ad.visibility =
            'public'

        limit 1
      `;

    const photo =
      rows[0];

    if (!photo) {
      return NextResponse.json(
        {
          error:
            "No public profile photo is available.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      !PUBLIC_IMAGE_TYPES.has(
        String(
          photo.content_type
        )
      )
    ) {
      return NextResponse.json(
        {
          error:
            "The selected public profile file is not a supported image.",
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
        photo.storage_key
      );

    if (!object) {
      return NextResponse.json(
        {
          error:
            "Public profile photo file could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    const buffer =
      await object.arrayBuffer();

    return new NextResponse(
      buffer,
      {
        status: 200,

        headers: {
          "Content-Type":
            photo.content_type ||
            object.httpMetadata
              ?.contentType ||
            "application/octet-stream",

          "Content-Disposition":
            `inline; filename="${safeHeaderFilename(
              photo.original_filename
            )}"`,

          /*
            Public profile images may be cached briefly.
            A short cache keeps profile changes responsive.
          */
          "Cache-Control":
            "public, max-age=300",
        },
      }
    );
  } catch (err) {
    console.error(
      "GET public animal photo failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load public profile photo.",
      },
      {
        status: 500,
      }
    );
  }
}

function safeHeaderFilename(
  filename: string
) {
  return String(
    filename ??
      "animal-photo"
  )
    .replace(
      /["\r\n]/g,
      "_"
    )
    .slice(
      0,
      180
    );
}
