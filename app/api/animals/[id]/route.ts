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
  } =
    await requireEffectiveOrg();

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
   GET ANIMAL RECORD
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

    const animalRows =
      await sql`
        select
          a.id,
          a.name,
          a.temporary_name,
          a.species,
          a.breed_or_type,

          a.birth_date,
          a.sex,
          a.weight_lbs,

          a.source,
          a.custody,
          a.urgency,
          a.placement,
          a.notes,

          a.public_share_enabled,
          a.public_summary,
          a.public_need,
          a.external_listing_url,

          a.created_at,
          a.current_org_id

        from animals a

        where
          a.id = ${animalId}

        limit 1
      `;

    const animal =
      animalRows[0];

    if (!animal) {
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

    /* -----------------------------------------------------
       PHOTO
    ----------------------------------------------------- */

    const mediaRows =
      await sql`
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
          created_at desc
        limit 1
      `;

    /* -----------------------------------------------------
       TIMELINE
    ----------------------------------------------------- */

    const timelineRows =
      await sql`
        select
          id,
          event_type,
          org_id,
          started_at
        from animal_custody_events
        where
          animal_id = ${animalId}
        order by
          started_at desc
      `;

    /* -----------------------------------------------------
       HELP OFFER COUNT
    ----------------------------------------------------- */

    const offerRows =
      await sql`
        select
          count(*)::int as count
        from animal_help_offers
        where
          animal_id = ${animalId}
          and status in (
            'new',
            'reviewing',
            'contacted'
          )
      `;

    return NextResponse.json({
      animal: {
        ...animal,

        photo:
          mediaRows[0] ??
          null,

        timeline:
          timelineRows ??
          [],

        open_help_offers:
          Number(
            offerRows[0]
              ?.count ??
              0
          ),
      },
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
      "GET /api/animals/[id] failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong loading the animal record.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH ANIMAL PROFILE

   Used for:
   - age / sex / weight
   - public profile draft
   - publish
   - unpublish
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

    if (!body) {
      return NextResponse.json(
        {
          error:
            "Request body is required.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      birthDate,
      sex,
      weightLbs,
      publicShareEnabled,
      publicSummary,
      publicNeed,
      externalListingUrl,
    } = body;

    /* -----------------------------------------------------
       NORMALIZE DATE
    ----------------------------------------------------- */

    let cleanBirthDate:
      | string
      | null = null;

    if (
      typeof birthDate ===
        "string" &&
      birthDate.trim()
    ) {
      const parsedDate =
        new Date(
          `${birthDate.trim()}T00:00:00`
        );

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Birth date is invalid.",
          },
          {
            status: 400,
          }
        );
      }

      cleanBirthDate =
        birthDate.trim();
    }

    /* -----------------------------------------------------
       NORMALIZE TEXT
    ----------------------------------------------------- */

    const cleanSex =
      typeof sex ===
        "string" &&
      sex.trim()
        ? sex.trim()
        : null;

    const cleanPublicSummary =
      typeof publicSummary ===
        "string" &&
      publicSummary.trim()
        ? publicSummary.trim()
        : null;

    const cleanPublicNeed =
      typeof publicNeed ===
        "string" &&
      publicNeed.trim()
        ? publicNeed.trim()
        : null;

    const cleanExternalUrl =
      typeof externalListingUrl ===
        "string" &&
      externalListingUrl.trim()
        ? externalListingUrl.trim()
        : null;

    /* -----------------------------------------------------
       VALIDATE URL
    ----------------------------------------------------- */

    if (cleanExternalUrl) {
      try {
        new URL(
          cleanExternalUrl
        );
      } catch {
        return NextResponse.json(
          {
            error:
              "External listing URL must be a complete URL, including https://",
          },
          {
            status: 400,
          }
        );
      }
    }

    /* -----------------------------------------------------
       NORMALIZE WEIGHT
    ----------------------------------------------------- */

    let cleanWeight:
      | number
      | null = null;

    if (
      weightLbs !== "" &&
      weightLbs != null
    ) {
      cleanWeight =
        Number(
          weightLbs
        );

      if (
        Number.isNaN(
          cleanWeight
        ) ||
        cleanWeight < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Weight must be a valid positive number.",
          },
          {
            status: 400,
          }
        );
      }
    }

    const publishValue =
      publicShareEnabled ===
        true;

    /* -----------------------------------------------------
       SAVE
    ----------------------------------------------------- */

    const rows =
      await sql`
        update animals

        set
          birth_date =
            ${cleanBirthDate}::date,

          sex =
            ${cleanSex},

          weight_lbs =
            ${cleanWeight},

          public_share_enabled =
            ${publishValue},

          public_summary =
            ${cleanPublicSummary},

          public_need =
            ${cleanPublicNeed},

          external_listing_url =
            ${cleanExternalUrl},

          updated_at =
            now()

        where
          id = ${animalId}

        returning
          id,
          birth_date,
          sex,
          weight_lbs,
          public_share_enabled,
          public_summary,
          public_need,
          external_listing_url
      `;

    if (!rows[0]) {
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

    /* -----------------------------------------------------
       AUDIT
    ----------------------------------------------------- */

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
          'animal',
          ${animalId},
          ${session.id},
          'profile_settings',
          ${JSON.stringify({
            birthDate:
              cleanBirthDate,

            sex:
              cleanSex,

            weightLbs:
              cleanWeight,

            publicShareEnabled:
              publishValue,
          })}
        )
      `;
    } catch (
      auditError
    ) {
      console.error(
        "Animal profile audit failed:",
        auditError
      );
    }

    return NextResponse.json({
      animal:
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
      "PATCH /api/animals/[id] failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong saving the animal profile.",
      },
      {
        status: 500,
      }
    );
  }
}
