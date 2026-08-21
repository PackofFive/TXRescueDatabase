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

/* =========================================================
   VERIFY ANIMAL ACCESS
========================================================= */

async function requireAnimalAccess(
  animalId: string
) {
  const {
    session,
    orgId,
  } = await requireEffectiveOrg();

  const rows = await sql`
    select
      id,
      current_org_id
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

  return {
    session,
    orgId,
  };
}

/* =========================================================
   GET OFFERS

   Private Rescue Manager route.

   Public users cannot use this route because it requires
   effective organization access.
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
      id: animalId,
    } = await params;

    await requireAnimalAccess(
      animalId
    );

    const animalRows = await sql`
      select
        id,
        name,
        temporary_name,
        species,
        breed_or_type
      from animals
      where id = ${animalId}
      limit 1
    `;

    if (!animalRows[0]) {
      return NextResponse.json(
        {
          error:
            "Animal not found.",
        },
        {
          status: 404,
        }
      );
    }

    const offers = await sql`
      select
        id,
        animal_id,
        offer_type,
        contact_name,
        contact_email,
        contact_phone,
        city,
        postal_code,
        availability,
        household_info,
        message,
        status,
        created_at,
        updated_at

      from animal_help_offers

      where
        animal_id = ${animalId}

      order by
        case status
          when 'new' then 1
          when 'reviewing' then 2
          when 'contacted' then 3
          when 'accepted' then 4
          when 'declined' then 5
          when 'closed' then 6
          else 7
        end,
        created_at desc
    `;

    return NextResponse.json({
      animal:
        animalRows[0],

      offers,
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
      "GET /api/animals/[id]/offers failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load foster/help offers.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH OFFER STATUS

   Body:
   {
     offerId,
     status
   }
========================================================= */

export async function PATCH(
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

    const {
      session,
    } =
      await requireAnimalAccess(
        animalId
      );

    const body =
      await req
        .json()
        .catch(
          () => null
        );

    const offerId =
      body?.offerId;

    const status =
      body?.status;

    if (
      !offerId ||
      typeof offerId !==
        "string"
    ) {
      return NextResponse.json(
        {
          error:
            "offerId is required.",
        },
        {
          status: 400,
        }
      );
    }

    const validStatuses = [
      "new",
      "reviewing",
      "contacted",
      "accepted",
      "declined",
      "closed",
    ];

    if (
      typeof status !==
        "string" ||
      !validStatuses.includes(
        status
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid offer status.",
        },
        {
          status: 400,
        }
      );
    }

    const currentRows =
      await sql`
        select
          id,
          status
        from animal_help_offers
        where
          id = ${offerId}
          and animal_id = ${animalId}
        limit 1
      `;

    if (!currentRows[0]) {
      return NextResponse.json(
        {
          error:
            "Offer not found.",
        },
        {
          status: 404,
        }
      );
    }

    const oldStatus =
      currentRows[0].status;

    const rows = await sql`
      update animal_help_offers

      set
        status = ${status},
        updated_at = now()

      where
        id = ${offerId}
        and animal_id = ${animalId}

      returning
        id,
        status,
        updated_at
    `;

    try {
      await sql`
        insert into audit_log (
          entity_type,
          entity_id,
          changed_by,
          field_name,
          new_value
        )

        values (
          'animal_help_offer',
          ${offerId},
          ${session.id},
          'status',
          ${JSON.stringify({
            animalId,
            oldStatus,
            newStatus:
              status,
          })}
        )
      `;
    } catch (
      auditError
    ) {
      console.error(
        "Help offer audit failed:",
        auditError
      );
    }

    return NextResponse.json({
      offer:
        rows[0],
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
      "PATCH /api/animals/[id]/offers failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't update the offer.",
      },
      {
        status: 500,
      }
    );
  }
}
