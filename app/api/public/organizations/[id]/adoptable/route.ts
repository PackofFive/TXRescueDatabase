import {
  NextRequest,
  NextResponse,
} from "next/server";

import { sql } from "@/lib/db";

export const runtime = "edge";

/* =========================================================
   PUBLIC ADOPTABLE ANIMALS FOR ONE ORGANIZATION

   No login required.

   IMPORTANT:
   This route only returns explicitly approved public
   animal fields.

   Private Overview fields are never exposed here.
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

       Animals only appear here when:
       - public_share_enabled = true
       - animal has not been adopted

       Only public_* identity fields are returned.
    ----------------------------------------------------- */

    const animals = await sql`
      select
        a.id,

        a.public_name as name,
        a.public_species as species,
        a.public_breed_or_type as breed_or_type,
        a.public_birth_date as birth_date,
        a.public_sex as sex,
        a.public_weight_lbs as weight_lbs,

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
            case
              when m.visibility = 'public'
                then 0
              else 1
            end,
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
