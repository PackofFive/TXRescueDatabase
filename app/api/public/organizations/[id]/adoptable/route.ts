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
      id: orgId,
    } = await params;

    const orgRows = await sql`
      select
        id,
        name,
        city,
        state
      from organizations
      where
        id = ${orgId}
        and archived_at is null
      limit 1
    `;

    if (!orgRows[0]) {
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

    const animals = await sql`
      select
        a.id,
        a.name,
        a.temporary_name,
        a.species,
        a.breed_or_type,
        a.birth_date,
        a.sex,
        a.public_need,

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
        and a.public_share_enabled = true
        and coalesce(a.outcome_status, '') <> 'adopted'

      order by
        a.created_at desc
    `;

    return NextResponse.json({
      organization:
        orgRows[0],

      animals,
    });
  } catch (err) {
    console.error(
      "GET public org adoptable animals failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Couldn't load adoptable animals.",
      },
      {
        status: 500,
      }
    );
  }
}
