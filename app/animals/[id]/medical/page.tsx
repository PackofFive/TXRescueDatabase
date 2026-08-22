import {
  NextRequest,
  NextResponse,
} from "next/server";

import { sql } from "@/lib/db";

export const runtime = "edge";

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

    const animalRows = await sql`
      select
        a.id,

        a.public_name,
        a.public_species,
        a.public_breed_or_type,
        a.public_birth_date,
        a.public_sex,
        a.public_weight_lbs,

        a.public_summary,
        a.public_need,
        a.external_listing_url,

        a.outcome_status,
        a.outcome_date,
        a.public_outcome_message,
        a.show_on_success_wall,

        a.current_org_id,

        o.name as organization_name,
        o.city as organization_city,
        o.state as organization_state,
        o.website as organization_website,
        o.public_email as organization_email,
        o.public_phone as organization_phone

      from animals a

      join organizations o
        on o.id = a.current_org_id

      where
        a.id = ${animalId}
        and a.public_share_enabled = true
        and o.archived_at is null

      limit 1
    `;

    const animal =
      animalRows[0];

    if (!animal) {
      return NextResponse.json(
        {
          error:
            "This public animal profile is not available.",
        },
        {
          status: 404,
        }
      );
    }

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

      order by
        case
          when visibility = 'public'
            then 0
          else 1
        end,
        created_at desc

      limit 1
    `;

    const helpRows = await sql`
      select
        count(*)::int as count

      from animal_help_offers

      where
        animal_id = ${animalId}

        and status in (
          'new',
          'reviewing',
          'contacted',
          'accepted'
        )
    `;

    return NextResponse.json({
      animal: {
        id: animal.id,

        name:
          animal.public_name,

        species:
          animal.public_species,

        breed_or_type:
          animal.public_breed_or_type,

        birth_date:
          animal.public_birth_date,

        sex:
          animal.public_sex,

        weight_lbs:
          animal.public_weight_lbs,

        public_summary:
          animal.public_summary,

        public_need:
          animal.public_need,

        external_listing_url:
          animal.external_listing_url,

        outcome_status:
          animal.outcome_status,

        outcome_date:
          animal.outcome_date,

        public_outcome_message:
          animal.public_outcome_message,

        show_on_success_wall:
          animal.show_on_success_wall,

        photo:
          mediaRows[0] ?? null,

        active_help_offer_count:
          Number(
            helpRows[0]?.count ?? 0
          ),

        organization: {
          id:
            animal.current_org_id,

          name:
            animal.organization_name,

          city:
            animal.organization_city,

          state:
            animal.organization_state,

          website:
            animal.organization_website,

          email:
            animal.organization_email,

          phone:
            animal.organization_phone,
        },
      },
    });
  } catch (err) {
    console.error(
      "GET /api/public/animals/[id] failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load this animal profile.",
      },
      {
        status: 500,
      }
    );
  }
}
