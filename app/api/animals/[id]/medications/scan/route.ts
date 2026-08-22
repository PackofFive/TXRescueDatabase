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
  response?: unknown;
};

type AIBinding = {
  run: (
    model: string,
    input: {
      messages: {
        role:
          | "system"
          | "user";
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

type MedicationScanResult = {
  medicationName: string;
  strength: string;
  doseGiven: string;
  frequency: string;
  instructions: string;
  prescribingVet: string;
  pharmacy: string;
  quantity: string;
  rawDirections: string;
  confidence:
    | "high"
    | "medium"
    | "low";
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
    } =
      await params;

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
              role:
                "system",

              content:
                `You are reading a veterinary prescription or medication label.

Extract only information that is visible.

Do not diagnose.
Do not recommend medication.
Do not invent missing information.
Do not calculate a new prescription.

Return one JSON object only.
Do not use Markdown.
Do not use code fences.
Do not add commentary.`,
            },

            {
              role:
                "user",

              content:
                `Read this veterinary medication label.

Return:

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
  "confidence": "high"
}

Rules:

medicationName:
Medication/drug name.

strength:
Printed medication strength.
Example: "100 mg"

doseGiven:
Amount instructed to administer.
Examples:
"1 tablet"
"1/2 tablet"
"2 mL"

frequency:
Return the frequency indicated by the label.

Recognize common equivalents including:
- once daily
- daily
- 1x daily
- twice daily
- twice a day
- 2x daily
- 2 times a day
- morning and evening
- BID
- three times daily
- 3x daily
- TID
- four times daily
- 4x daily
- QID
- every 4 hours
- every 6 hours
- every 8 hours
- every 12 hours
- every 24 hours
- q4h
- q6h
- q8h
- q12h
- q24h
- every other day
- weekly
- PRN
- as needed

Do not simplify a changing/tapered schedule into a single frequency.

instructions:
Administration details besides the frequency.

prescribingVet:
Veterinarian if visible.

pharmacy:
Clinic/pharmacy/dispensing provider if visible.

quantity:
Prescription quantity if visible.

rawDirections:
Preserve the directions as closely as possible.

confidence:
Exactly:
"high"
"medium"
or
"low"

Return JSON only.`,
            },
          ],

          image,

          max_tokens:
            900,

          temperature:
            0,
        }
      );

    const raw =
      extractResponseText(
        response?.response
      );

    if (!raw) {
      return NextResponse.json(
        {
          error:
            "The medication label could not be read. Try a clearer photo with the full label visible.",
        },
        {
          status: 422,
        }
      );
    }

    console.log(
      "Medication scan raw AI response:",
      raw
    );

    const extracted =
      parseMedicationResponse(
        raw
      );

    if (!extracted) {
      return NextResponse.json(
        {
          error:
            "The label was read, but the response could not be converted into medication fields. Try another photo.",
        },
        {
          status: 422,
        }
      );
    }

    const hasUsefulData =
      Boolean(
        extracted.medicationName ||
          extracted.strength ||
          extracted.doseGiven ||
          extracted.frequency ||
          extracted.rawDirections ||
          extracted.instructions ||
          extracted.prescribingVet ||
          extracted.pharmacy
      );

    if (!hasUsefulData) {
      return NextResponse.json(
        {
          error:
            "The image was processed, but no medication information could be confidently identified. Try a closer photo of the prescription label.",
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

function extractResponseText(
  value: unknown
): string {
  if (
    typeof value ===
    "string"
  ) {
    return value.trim();
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    const record =
      value as Record<
        string,
        unknown
      >;

    const candidates = [
      record.response,
      record.text,
      record.content,
      record.output,
      record.result,
    ];

    for (
      const candidate of
        candidates
    ) {
      if (
        typeof candidate ===
        "string"
      ) {
        return candidate.trim();
      }
    }

    try {
      return JSON.stringify(
        value
      );
    } catch {
      return "";
    }
  }

  return "";
}

function parseMedicationResponse(
  raw: string
): MedicationScanResult | null {
  const parsed =
    parseAnyJsonObject(
      raw
    );

  if (!parsed) {
    return null;
  }

  const medicationName =
    pickString(
      parsed,
      [
        "medicationName",
        "medication_name",
        "medication",
        "drug",
        "drugName",
        "drug_name",
        "name",
      ]
    );

  const strength =
    pickString(
      parsed,
      [
        "strength",
        "medicationStrength",
        "medication_strength",
      ]
    );

  const doseGiven =
    pickString(
      parsed,
      [
        "doseGiven",
        "dose_given",
        "dose",
        "dosage",
        "amount",
      ]
    );

  const frequency =
    normalizeFrequency(
      pickString(
        parsed,
        [
          "frequency",
          "schedule",
          "interval",
        ]
      )
    );

  const instructions =
    pickString(
      parsed,
      [
        "instructions",
        "instruction",
        "administrationInstructions",
        "administration_instructions",
      ]
    );

  const prescribingVet =
    pickString(
      parsed,
      [
        "prescribingVet",
        "prescribing_vet",
        "prescriber",
        "veterinarian",
        "vet",
        "doctor",
      ]
    );

  const pharmacy =
    pickString(
      parsed,
      [
        "pharmacy",
        "clinic",
        "provider",
        "dispensedBy",
        "dispensed_by",
      ]
    );

  const quantity =
    pickString(
      parsed,
      [
        "quantity",
        "qty",
      ]
    );

  const rawDirections =
    pickString(
      parsed,
      [
        "rawDirections",
        "raw_directions",
        "directions",
        "sig",
        "prescriptionDirections",
        "prescription_directions",
      ]
    );

  const confidence =
    normalizeConfidence(
      pickString(
        parsed,
        [
          "confidence",
          "confidenceLevel",
          "confidence_level",
        ]
      )
    );

  return {
    medicationName,
    strength,
    doseGiven,
    frequency,
    instructions,
    prescribingVet,
    pharmacy,
    quantity,
    rawDirections,
    confidence,
  };
}

function normalizeFrequency(
  value: string
) {
  if (!value) {
    return "";
  }

  const original =
    value.trim();

  const text =
    original
      .toLowerCase()
      .replace(
        /[.,]/g,
        ""
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  if (
    text === "prn" ||
    text.includes(
      "as needed"
    )
  ) {
    return "as needed";
  }

  if (
    [
      "daily",
      "once daily",
      "once a day",
      "1x daily",
      "1x a day",
      "qd",
      "q24h",
      "q 24 h",
      "every 24 hours",
    ].includes(
      text
    )
  ) {
    return "daily";
  }

  if (
    [
      "twice daily",
      "twice a day",
      "2x daily",
      "2x a day",
      "2 x daily",
      "2 x a day",
      "2 times daily",
      "2 times a day",
      "two times daily",
      "two times a day",
      "morning and evening",
      "morning & evening",
      "am and pm",
      "am & pm",
      "bid",
      "q12h",
      "q 12 h",
      "every 12 hours",
    ].includes(
      text
    )
  ) {
    return "every 12 hours";
  }

  if (
    [
      "three times daily",
      "three times a day",
      "3x daily",
      "3x a day",
      "3 times daily",
      "3 times a day",
      "tid",
      "q8h",
      "q 8 h",
      "every 8 hours",
    ].includes(
      text
    )
  ) {
    return "every 8 hours";
  }

  if (
    [
      "four times daily",
      "four times a day",
      "4x daily",
      "4x a day",
      "4 times daily",
      "4 times a day",
      "qid",
      "q6h",
      "q 6 h",
      "every 6 hours",
    ].includes(
      text
    )
  ) {
    return "every 6 hours";
  }

  if (
    [
      "every other day",
      "every 2 days",
      "q48h",
      "q 48 h",
    ].includes(
      text
    )
  ) {
    return "every 48 hours";
  }

  if (
    [
      "weekly",
      "once weekly",
      "once a week",
      "every week",
      "every 7 days",
    ].includes(
      text
    )
  ) {
    return "every 7 days";
  }

  const everyHours =
    text.match(
      /every\s+(\d+(?:\.\d+)?)\s*(?:hours|hour|hrs|hr)\b/
    );

  if (
    everyHours
  ) {
    return `every ${everyHours[1]} hours`;
  }

  const qHours =
    text.match(
      /^q\s*(\d+(?:\.\d+)?)\s*h$/
    );

  if (
    qHours
  ) {
    return `every ${qHours[1]} hours`;
  }

  /*
    Complex or unfamiliar instructions remain unchanged.

    Human review is required before saving anyway.
  */

  return original;
}

function parseAnyJsonObject(
  raw: string
):
  | Record<
      string,
      unknown
    >
  | null {
  const cleaned =
    raw
      .trim()
      .replace(
        /```json/gi,
        ""
      )
      .replace(
        /```/g,
        ""
      )
      .trim();

  const direct =
    safeJsonParse(
      cleaned
    );

  if (
    direct &&
    typeof direct ===
      "object" &&
    !Array.isArray(
      direct
    )
  ) {
    return direct as Record<
      string,
      unknown
    >;
  }

  const firstBrace =
    cleaned.indexOf(
      "{"
    );

  const lastBrace =
    cleaned.lastIndexOf(
      "}"
    );

  if (
    firstBrace !== -1 &&
    lastBrace >
      firstBrace
  ) {
    let objectText =
      cleaned.slice(
        firstBrace,
        lastBrace + 1
      );

    let extracted =
      safeJsonParse(
        objectText
      );

    if (
      extracted &&
      typeof extracted ===
        "object" &&
      !Array.isArray(
        extracted
      )
    ) {
      return extracted as Record<
        string,
        unknown
      >;
    }

    objectText =
      objectText
        .replace(
          /,\s*([}\]])/g,
          "$1"
        )
        .replace(
          /[\u201C\u201D]/g,
          '"'
        )
        .replace(
          /[\u2018\u2019]/g,
          "'"
        );

    extracted =
      safeJsonParse(
        objectText
      );

    if (
      extracted &&
      typeof extracted ===
        "object" &&
      !Array.isArray(
        extracted
      )
    ) {
      return extracted as Record<
        string,
        unknown
      >;
    }
  }

  return null;
}

function safeJsonParse(
  value: string
): unknown {
  try {
    return JSON.parse(
      value
    );
  } catch {
    return null;
  }
}

function pickString(
  source:
    Record<
      string,
      unknown
    >,
  keys: string[]
) {
  for (
    const key of keys
  ) {
    const value =
      source[key];

    if (
      typeof value ===
      "string"
    ) {
      const cleaned =
        value.trim();

      if (cleaned) {
        return cleaned;
      }
    }

    if (
      typeof value ===
      "number"
    ) {
      return String(
        value
      );
    }
  }

  return "";
}

function normalizeConfidence(
  value: string
):
  | "high"
  | "medium"
  | "low" {
  const normalized =
    value
      .trim()
      .toLowerCase();

  if (
    normalized.includes(
      "high"
    )
  ) {
    return "high";
  }

  if (
    normalized.includes(
      "medium"
    ) ||
    normalized.includes(
      "moderate"
    )
  ) {
    return "medium";
  }

  return "low";
}

function arrayBufferToBase64(
  buffer: ArrayBuffer
) {
  const bytes =
    new Uint8Array(
      buffer
    );

  let binary =
    "";

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

  return btoa(
    binary
  );
}
