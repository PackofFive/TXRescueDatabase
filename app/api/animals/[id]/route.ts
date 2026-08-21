import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  requireEffectiveOrg,
  AuthError,
} from "@/lib/auth";

export const runtime = "edge";

/*
  Loads one animal only if it belongs to the
  rescue/shelter currently being viewed.

  This protects animal records from being opened
  by another organization simply by knowing the ID.
*/

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { orgId } =
      await requireEffectiveOrg();

    const { id: animalId } =
      await params;

    const animalRows = await sql`
      select
        a.id,
        a.name,
        a.temporary_name,
        a.species,
        a.breed_or_type,
        a.source,
        a.custody,
        a.urgency,
        a.placement,
        a.notes,
        a.created_at,
        a.current_org_id
      from animals a
      where
        a.id = ${animalId}
        and a.current_org_id = ${orgId}
      limit 1
    `;

    const animal =
      animalRows[0];

    if (!animal) {
      return NextResponse.json(
        {
          error:
            "Animal not found or you do not have access to this record.",
        },
        {
          status: 404,
        }
      );
    }

    /*
      Get the primary/most recent photo if one exists.
    */

    const mediaRows = await sql`
      select
        id,
        url,
        source,
        visibility
      from media
      where
        owner_type = 'animal'
        and owner_id = ${animalId}
      order by created_at desc
      limit 1
    `;

    /*
      Opening timeline history.
    */

    const timelineRows = await sql`
      select
        id,
        event_type,
        org_id,
        started_at
      from animal_custody_events
      where animal_id = ${animalId}
      order by started_at desc
    `;

    return NextResponse.json({
      animal: {
        ...animal,
        photo:
          mediaRows[0] ?? null,
        timeline:
          timelineRows ?? [],
      },
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
          status: err.status,
        }
      );
    }

    console.error(
      "GET /api/animals/[id] failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong loading the animal record.",
      },
      {
        status: 500,
      }
    );
  }
}
