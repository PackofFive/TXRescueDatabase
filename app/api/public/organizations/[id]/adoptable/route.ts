import {
  NextRequest,
  NextResponse,
} from "next/server";

import { sql } from "@/lib/db";

export const runtime = "edge";

/* =========================================================
   PUBLIC ADOPTABLE ANIMALS FOR ONE ORGANIZATION

   No login is required.

   Only animals deliberately published by the managing
   organization are returned.

   Adopted animals are not shown on the active adoptable
   list. Their permanent public profiles can remain
   accessible separately.
========================================================= */

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
      id: orgId,
    } = await params;

    /* -----------------------------------------------------
       ORGANIZATION
    ----------------------------------------------------- */

    const orgRows = await sql`
      select
        id,
        name,
        city,
        county,
        state,
        website
      from organizations
      where
        id = ${orgId}
        and archived_at is null
      limit 1
    `;

    const organization =
      orgRows[0];

    if (!organization) {
      return NextResponse.json(
        {
          error:
            "Organization not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* -----------------------------------------------------
       PUBLIC ANIMALS

       Important:
       public_share_enabled must be TRUE.

       Animals begin private and only appear here after the
       rescue/shelter explicitly publishes them.
    ----------------------------------------------------- */

    const animals = await sql`
      select
        a.id,
        a.name,
        a.temporary_name,
        a.species,
        a.breed_or_type,
        a.birth_date,
        a.sex,
        a.weight_lbs,
        a.public_summary,
        a.public_need,
        a.external_listing_url,
        a.outcome_status,
        a.created_at,

        (
          select m.url
          from media m
          where
            m.owner_type = 'animal'
            and m.owner_id = a.id
          order by
            m.created_at desc
          limit 1
        ) as photo_url

      from animals a

      where
        a.current_org_id = ${orgId}

        and
        a.public_share_enabled = true

        and
        coalesce(
          a.outcome_status,
          ''
        ) <> 'adopted'

      order by
        a.created_at desc
    `;

    return NextResponse.json({
      organization,
      animals,
    });
  } catch (err) {
    console.error(
      "GET /api/public/organizations/[id]/adoptable failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load adoptable animals.",
      },
      {
        status: 500,
      }
    );
  }
}
