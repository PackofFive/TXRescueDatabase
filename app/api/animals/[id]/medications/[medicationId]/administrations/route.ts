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

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      medicationId: string;
    }>;
  }
) {
  try {
    const {
      id: animalId,
      medicationId,
    } = await params;

    const {
      orgId,
    } =
      await requireEffectiveOrg();

    const medicationRows =
      await sql`
        select
          am.id

        from animal_medications am

        join animals a
          on a.id = am.animal_id

        where
          am.id = ${medicationId}
          and am.animal_id = ${animalId}
          and a.current_org_id = ${orgId}

        limit 1
      `;

    if (!medicationRows[0]) {
      return NextResponse.json(
        {
          error:
            "Medication not found or you do not have access to it.",
        },
        {
          status: 404,
        }
      );
    }

    const rows =
      await sql`
        select
          maa.id,
          maa.medication_id,
          maa.animal_id,
          maa.administered_at,
          maa.dose_given,
          maa.notes,
          maa.recorded_by,
          maa.created_at,

          u.email as recorded_by_email

        from animal_medication_administrations maa

        left join users u
          on u.id = maa.recorded_by

        where
          maa.medication_id = ${medicationId}
          and maa.animal_id = ${animalId}
          and maa.org_id = ${orgId}

        order by
          maa.administered_at desc,
          maa.created_at desc
      `;

    return NextResponse.json({
      administrations: rows,
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
      "GET medication administrations failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load dose history.",
      },
      {
        status: 500,
      }
    );
  }
}
