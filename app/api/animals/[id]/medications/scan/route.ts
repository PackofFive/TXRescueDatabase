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

/* =========================================================
   TYPES
========================================================= */

type AIResponse = {
  response?: unknown;
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
  confidence: "high" | "medium" | "low";
};

/* =========================================================
   CONFIG
========================================================= */

const MAX_FILE_SIZE =
  8 * 1024 * 1024;

const ALLOWED_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

/* =========================================================
   ACCESS CHECK
========================================================= */

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

/* =========================================================
   SCAN MEDICATION LABEL
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
    } = await params;

    await requireAnimalAccess(
      animalId
    );

    const formData =
      await req.formData();

    const file =
      formData.get("file");

    /* -----------------------------------------------------
       FILE VALIDATION
    ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       WORKERS AI
    ----------------------------------------------------- */

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
                `You are reading a veterinary prescription or medication label.

Your job is to extract visible information into structured fields for HUMAN REVIEW.

Important rules:
- Do not diagnose.
- Do not recommend medication.
- Do not calculate a new prescription.
- Do not invent information.
- If a field is unclear or absent, return an empty string.
- Preserve the prescription directions as written whenever possible.
- Return one JSON object only.
- Do not include Markdown.
- Do not include code fences.
- Do not add commentary before or after the JSON.`,
            },

            {
              role: "user",

              content:
                `Read the medication label in the attached image.

Return this JSON structure:

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

FIELD RULES:

medicationName:
Drug or medication name only.

strength:
Medication strength printed on the bottle or prescription.
Examples:
"100 mg"
"50 mg/mL"

doseGiven:
Amount the directions instruct to administer, when clearly stated.
Examples:
"1 tablet"
"1/2 tablet"
"2 mL"
Do not calculate mg from tablet fractions unless explicitly printed.

frequency:
Normalize only when clearly supported by the directions.
Examples:
"daily"
"every 12 hours"
"every 8 hours"
"as needed"
If unclear, use an empty string.

instructions:
Useful administration instructions besides frequency.
Examples:
"Give by mouth"
"Give with food"
"Use as needed for anxiety"

prescribingVet:
Veterinarian name if visible.

pharmacy:
Pharmacy, veterinary clinic, or dispensing provider if visible.

quantity:
Prescription quantity if visible.

rawDirections:
Copy the prescription directions as closely as possible.

confidence:
Use exactly one:
"high"
"medium"
"low"

Return JSON only.`,
            },
          ],

          image,

          max_tokens: 900,

          temperature: 0,
        }
      );

    /* -----------------------------------------------------
       GET RAW MODEL OUTPUT
    ----------------------------------------------------- */

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

    /*
      Keep this in Cloudflare logs while we are testing.

      It does NOT go back to the browser.

      Once scanning is stable, we can remove it.
    */

    console.log(
      "Medication scan raw AI response:",
      raw
    );

    /* -----------------------------------------------------
       PARSE RESULT
    ----------------------------------------------------- */

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

    /*
      Don't reject a result merely because several fields
      are empty. A partial scan is still useful because the
      human must review it before saving.
    */

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

/* =========================================================
   RESPONSE EXTRACTION

   Cloudflare/model responses may sometimes be:
   - a plain string
   - an object
   - an object containing text
========================================================= */

function extractResponseText(
  value: unknown
): string {
  if (
    typeof value === "string"
  ) {
    return value.trim();
  }

  if (
    value &&
    typeof value === "object"
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
      const candidate of candidates
    ) {
      if (
        typeof candidate ===
        "string"
      ) {
        return candidate.trim();
      }
    }

    /*
      If Workers AI already returned structured JSON,
      stringify it so our normal parser can handle it.
    */

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

/* =========================================================
   MEDICATION RESPONSE PARSER
========================================================= */

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

  /*
    Accept several likely field-name variations.

    This prevents a good scan from failing merely because
    the model returned "medication_name" instead of
    "medicationName", for example.
  */

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

/* =========================================================
   JSON PARSING

   Handles:
   - clean JSON
   - ```json ... ```
   - prose before JSON
   - prose after JSON
========================================================= */

function parseAnyJsonObject(
  raw: string
):
  | Record<string, unknown>
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

  /*
    Attempt #1:
    response is already valid JSON.
  */

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

  /*
    Attempt #2:
    find the first complete-looking JSON object.

    Vision models sometimes produce:

    "Here is the information:
     { ... }"

    We don't want that extra text to kill the scan.
  */

  const firstBrace =
    cleaned.indexOf("{");

  const lastBrace =
    cleaned.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace >
      firstBrace
  ) {
    const objectText =
      cleaned.slice(
        firstBrace,
        lastBrace + 1
      );

    const extracted =
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

  /*
    Attempt #3:
    repair a couple of common model formatting mistakes.
  */

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

    objectText =
      objectText
        /*
          Remove trailing commas before } or ].
        */
        .replace(
          /,\s*([}\]])/g,
          "$1"
        )

        /*
          Replace smart quotes that occasionally appear.
        */
        .replace(
          /[\u201C\u201D]/g,
          '"'
        )
        .replace(
          /[\u2018\u2019]/g,
          "'"
        );

    const repaired =
      safeJsonParse(
        objectText
      );

    if (
      repaired &&
      typeof repaired ===
        "object" &&
      !Array.isArray(
        repaired
      )
    ) {
      return repaired as Record<
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

/* =========================================================
   FIELD HELPERS
========================================================= */

function pickString(
  source:
    Record<string, unknown>,
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

/* =========================================================
   FREQUENCY NORMALIZATION

   We normalize common wording because the dose scheduler
   already understands these values.
========================================================= */

function normalizeFrequency(
  value: string
) {
  if (!value) {
    return "";
  }

  const text =
    value
      .trim()
      .toLowerCase();

  if (
    [
      "once daily",
      "once a day",
      "every day",
      "daily",
      "q24h",
      "every 24 hours",
      "every 24 hrs",
    ].includes(text)
  ) {
    return "daily";
  }

  if (
    [
      "twice daily",
      "twice a day",
      "2 times daily",
      "2x daily",
      "bid",
      "q12h",
      "every 12 hours",
      "every 12 hrs",
    ].includes(text)
  ) {
    return "every 12 hours";
  }

  if (
    [
      "three times daily",
      "three times a day",
      "3 times daily",
      "3x daily",
      "tid",
      "q8h",
      "every 8 hours",
      "every 8 hrs",
    ].includes(text)
  ) {
    return "every 8 hours";
  }

  if (
    [
      "four times daily",
      "four times a day",
      "4 times daily",
      "4x daily",
      "qid",
      "q6h",
      "every 6 hours",
      "every 6 hrs",
    ].includes(text)
  ) {
    return "every 6 hours";
  }

  if (
    text === "prn" ||
    text.includes(
      "as needed"
    )
  ) {
    return "as needed";
  }

  /*
    Keep unknown wording instead of deleting it.

    A human will review the medication before saving.
  */

  return value.trim();
}

/* =========================================================
   BASE64
========================================================= */

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
