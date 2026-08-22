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

type AIResponse = {
  response?: string;
};

type AIBinding = {
  run: (
    model: string,
    input: {
      messages: {
        role: "system" | "user";
        content: string;
      }[];
      image: string;
      max_tokens?: number;
      temperature?: number;
    }
  ) => Promise<AIResponse>;
};

type Env = {
  AI: AIBinding;
};

const MAX_FILE_SIZE =
  8 * 1024 * 1024;

const ALLOWED_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

async function requireAnimalAccess(
  animalId: string
) {
  const {
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
            "Select a medication label image.",
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
            "Medication scanning supports JPG, PNG, and WebP images.",
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
            "Medication label image must be 8 MB or smaller.",
        },
        {
          status: 400,
        }
      );
    }

    const context =
      getRequestContext();

    const env =
      context.env as Env;

    if (!env.AI) {
      return NextResponse.json(
        {
          error:
            "Medication label scanning is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const arrayBuffer =
      await file.arrayBuffer();

    const base64 =
      arrayBufferToBase64(
        arrayBuffer
      );

    const image =
      `data:${file.type};base64,${base64}`;

    const response =
      await env.AI.run(
        "@cf/meta/llama-3.2-11b-vision-instruct",
        {
          messages: [
            {
              role: "system",
              content:
                "You extract medication information from veterinary prescription labels. Do not invent information that is not visible. Return JSON only.",
            },
            {
              role: "user",
              content:
                `Read this veterinary medication label.

Return ONLY valid JSON using this exact structure:

{
  "medicationName": "",
  "strength": "",
  "doseGiven": "",
  "frequency": "",
  "instructions": "",
  "prescribingVet": "",
  "pharmacy": "",
  "quantity": "",
  "rawDirections": "",
  "confidence": "high|medium|low"
}

Rules:
- Never guess missing information.
- Use empty strings for fields you cannot clearly determine.
- medicationName should contain the drug name.
- strength is the labeled medication strength, such as "100 mg".
- doseGiven should reflect the actual instructed amount when clearly stated, such as "50 mg" or "1/2 tablet".
- frequency should be normalized when possible, such as "daily", "every 12 hours", or "every 8 hours".
- instructions should preserve useful administration instructions such as "give with food".
- rawDirections should capture the prescription directions as closely as possible.
- This is a draft for human review and must not be treated as verified medical data.`,
            },
          ],

          image,
          max_tokens: 600,
          temperature: 0,
        }
      );

    const raw =
      response?.response;

    if (!raw) {
      return NextResponse.json(
        {
          error:
            "The medication label could not be read.",
        },
        {
          status: 422,
        }
      );
    }

    const extracted =
      parseJsonResponse(
        raw
      );

    if (!extracted) {
      return NextResponse.json(
        {
          error:
            "The label was read, but the extracted information could not be interpreted safely. Try a clearer photo.",
        },
        {
          status: 422,
        }
      );
    }

    return NextResponse.json({
      extracted,
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
      "POST medication scan failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't scan medication label.",
      },
      {
        status: 500,
      }
    );
  }
}

function parseJsonResponse(
  value: string
) {
  try {
    const cleaned =
      value
        .trim()
        .replace(
          /^```json\s*/i,
          ""
        )
        .replace(
          /^```\s*/,
          ""
        )
        .replace(
          /\s*```$/,
          ""
        );

    const parsed =
      JSON.parse(cleaned);

    return {
      medicationName:
        cleanString(
          parsed.medicationName
        ),

      strength:
        cleanString(
          parsed.strength
        ),

      doseGiven:
        cleanString(
          parsed.doseGiven
        ),

      frequency:
        cleanString(
          parsed.frequency
        ),

      instructions:
        cleanString(
          parsed.instructions
        ),

      prescribingVet:
        cleanString(
          parsed.prescribingVet
        ),

      pharmacy:
        cleanString(
          parsed.pharmacy
        ),

      quantity:
        cleanString(
          parsed.quantity
        ),

      rawDirections:
        cleanString(
          parsed.rawDirections
        ),

      confidence:
        [
          "high",
          "medium",
          "low",
        ].includes(
          String(
            parsed.confidence
          ).toLowerCase()
        )
          ? String(
              parsed.confidence
            ).toLowerCase()
          : "low",
    };
  } catch {
    return null;
  }
}

function cleanString(
  value: unknown
) {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function arrayBufferToBase64(
  buffer: ArrayBuffer
) {
  const bytes =
    new Uint8Array(
      buffer
    );

  let binary = "";

  const chunkSize =
    0x8000;

  for (
    let i = 0;
    i < bytes.length;
    i += chunkSize
  ) {
    const chunk =
      bytes.subarray(
        i,
        Math.min(
          i +
            chunkSize,
          bytes.length
        )
      );

    binary +=
      String.fromCharCode(
        ...chunk
      );
  }

  return btoa(binary);
}
