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

          a.public_name,
          a.public_species,
          a.public_breed_or_type,
          a.public_birth_date,
          a.public_sex,
          a.public_weight_lbs,

          a.public_share_enabled,
          a.public_summary,
          a.public_need,
          a.external_listing_url,

          a.outcome_status,
          a.outcome_date,
          a.public_outcome_message,
          a.show_on_success_wall,

          a.created_at,
          a.current_org_id,
          a.primary_photo_document_id

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

       Primary profile photos are linked directly to an
       animal_document record. This makes the selected photo
       deterministic instead of relying on the newest media row.
    ----------------------------------------------------- */

    let photo:
      | {
          id: string;
          document_id: string | null;
          url: string;
          source: string | null;
          visibility: string | null;
        }
      | null = null;

    if (
      animal.primary_photo_document_id
    ) {
      const primaryPhotoRows =
        await sql`
          select
            ad.id,
            ad.source,
            ad.visibility,
            ad.content_type

          from animal_documents ad

          where
            ad.id =
              ${animal.primary_photo_document_id}

            and
            ad.animal_id =
              ${animalId}

          limit 1
        `;

      const primaryPhoto =
        primaryPhotoRows[0];

      if (
        primaryPhoto &&
        String(
          primaryPhoto.content_type
        ).startsWith(
          'image/'
        )
      ) {
        photo = {
          id:
            String(
              primaryPhoto.id
            ),

          document_id:
            String(
              primaryPhoto.id
            ),

          url:
            `/api/animals/${encodeURIComponent(
              animalId
            )}/documents?documentId=${encodeURIComponent(
              String(
                primaryPhoto.id
              )
            )}`,

          source:
            primaryPhoto.source ??
            'animal_document',

          visibility:
            primaryPhoto.visibility ??
            'private',
        };
      }
    }

    /*
      Legacy fallback for any existing media-based animal photo.
    */

    if (!photo) {
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

      if (
        mediaRows[0]
      ) {
        photo = {
          ...mediaRows[0],
          document_id:
            null,
        };
      }
    }

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
       HELP / FOSTER OFFER COUNT
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

    /* -----------------------------------------------------
       OPEN REMINDER COUNT
    ----------------------------------------------------- */

    const reminderRows =
      await sql`
        select
          count(*)::int as count
        from animal_reminders
        where
          animal_id = ${animalId}
          and status = 'open'
      `;

    return NextResponse.json({
      animal: {
        ...animal,

        photo,

        timeline:
          timelineRows ??
          [],

        open_help_offers:
          Number(
            offerRows[0]
              ?.count ??
              0
          ),

        open_reminders:
          Number(
            reminderRows[0]
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
   PATCH ANIMAL

   Supports:
   - editable private Overview
   - selective synchronization to public profile
   - public profile draft
   - publish / unpublish
   - outcome information

   Public data is stored separately from private Overview.
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
        .catch(() => null);

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

    /* =====================================================
       CURRENT RECORD

       PATCH requests do not have to include every field.

       Missing values preserve the existing value.
    ===================================================== */

    const currentRows =
      await sql`
        select *
        from animals
        where id = ${animalId}
        limit 1
      `;

    const current =
      currentRows[0];

    if (!current) {
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

    /* =====================================================
       PRIVATE OVERVIEW
    ===================================================== */

    const cleanText = (
      value: unknown,
      fallback: unknown
    ) => {
      if (
        value === undefined
      ) {
        return fallback ?? null;
      }

      if (
        value === null
      ) {
        return null;
      }

      const text =
        String(value).trim();

      return text ||
        null;
    };

    const cleanName =
      cleanText(
        body.name,
        current.name
      );

    const cleanTemporaryName =
      cleanText(
        body.temporaryName,
        current.temporary_name
      );

    const cleanSpecies =
      cleanText(
        body.species,
        current.species
      );

    const cleanBreed =
      cleanText(
        body.breedOrType,
        current.breed_or_type
      );

    const cleanSource =
      cleanText(
        body.source,
        current.source
      );

    const cleanCustody =
      cleanText(
        body.custody,
        current.custody
      );

    const cleanPlacement =
      cleanText(
        body.placement,
        current.placement
      );

    const cleanUrgency =
      cleanText(
        body.urgency,
        current.urgency
      );

    const cleanNotes =
      cleanText(
        body.notes,
        current.notes
      );

    /* =====================================================
       BIRTH DATE
    ===================================================== */

    let cleanBirthDate =
      current.birth_date
        ? String(
            current.birth_date
          ).slice(0, 10)
        : null;

    if (
      body.birthDate !==
      undefined
    ) {
      cleanBirthDate =
        null;

      if (
        typeof body.birthDate ===
          "string" &&
        body.birthDate.trim()
      ) {
        const parsed =
          new Date(
            `${body.birthDate.trim()}T00:00:00`
          );

        if (
          Number.isNaN(
            parsed.getTime()
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
          body.birthDate.trim();
      }
    }

    /* =====================================================
       SEX
    ===================================================== */

    const cleanSex =
      cleanText(
        body.sex,
        current.sex
      );

    /* =====================================================
       WEIGHT
    ===================================================== */

    let cleanWeight:
      | number
      | null =
      current.weight_lbs != null
        ? Number(
            current.weight_lbs
          )
        : null;

    if (
      body.weightLbs !==
      undefined
    ) {
      if (
        body.weightLbs === "" ||
        body.weightLbs ===
          null
      ) {
        cleanWeight =
          null;
      } else {
        cleanWeight =
          Number(
            body.weightLbs
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
    }

    /* =====================================================
       PUBLIC PROFILE TEXT
    ===================================================== */

    const cleanPublicSummary =
      cleanText(
        body.publicSummary,
        current.public_summary
      );

    const cleanPublicNeed =
      cleanText(
        body.publicNeed,
        current.public_need
      );

    const cleanExternalUrl =
      cleanText(
        body.externalListingUrl,
        current.external_listing_url
      );

    if (
      cleanExternalUrl
    ) {
      try {
        new URL(
          String(
            cleanExternalUrl
          )
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

    /* =====================================================
       PUBLIC VISIBILITY
    ===================================================== */

    const publishValue =
      body.publicShareEnabled ===
      undefined
        ? Boolean(
            current.public_share_enabled
          )
        : body.publicShareEnabled ===
          true;

    /* =====================================================
       SELECTIVE PUBLIC SYNCHRONIZATION

       Example:

       publicSyncFields: [
         "name",
         "breed_or_type",
         "birth_date"
       ]

       Only approved fields are copied.
    ===================================================== */

    const publicSyncFields =
      Array.isArray(
        body.publicSyncFields
      )
        ? body.publicSyncFields.map(
            String
          )
        : [];

    let publicName =
      current.public_name;

    let publicSpecies =
      current.public_species;

    let publicBreed =
      current.public_breed_or_type;

    let publicBirthDate =
      current.public_birth_date
        ? String(
            current.public_birth_date
          ).slice(0, 10)
        : null;

    let publicSex =
      current.public_sex;

    let publicWeight =
      current.public_weight_lbs !=
      null
        ? Number(
            current.public_weight_lbs
          )
        : null;

    if (
      publicSyncFields.includes(
        "name"
      )
    ) {
      publicName =
        cleanName;
    }

    if (
      publicSyncFields.includes(
        "species"
      )
    ) {
      publicSpecies =
        cleanSpecies;
    }

    if (
      publicSyncFields.includes(
        "breed_or_type"
      )
    ) {
      publicBreed =
        cleanBreed;
    }

    if (
      publicSyncFields.includes(
        "birth_date"
      )
    ) {
      publicBirthDate =
        cleanBirthDate;
    }

    if (
      publicSyncFields.includes(
        "sex"
      )
    ) {
      publicSex =
        cleanSex;
    }

    if (
      publicSyncFields.includes(
        "weight_lbs"
      )
    ) {
      publicWeight =
        cleanWeight;
    }

    /* =====================================================
       OUTCOME
    ===================================================== */

    const cleanOutcomeStatus =
      cleanText(
        body.outcomeStatus,
        current.outcome_status
      );

    let cleanOutcomeDate =
      current.outcome_date
        ? String(
            current.outcome_date
          ).slice(0, 10)
        : null;

    if (
      body.outcomeDate !==
      undefined
    ) {
      cleanOutcomeDate =
        null;

      if (
        typeof body.outcomeDate ===
          "string" &&
        body.outcomeDate.trim()
      ) {
        const parsed =
          new Date(
            `${body.outcomeDate.trim()}T00:00:00`
          );

        if (
          Number.isNaN(
            parsed.getTime()
          )
        ) {
          return NextResponse.json(
            {
              error:
                "Outcome date is invalid.",
            },
            {
              status: 400,
            }
          );
        }

        cleanOutcomeDate =
          body.outcomeDate.trim();
      }
    }

    const cleanOutcomeMessage =
      cleanText(
        body.publicOutcomeMessage,
        current.public_outcome_message
      );

    const successWallValue =
      body.showOnSuccessWall ===
      undefined
        ? Boolean(
            current.show_on_success_wall
          )
        : body.showOnSuccessWall ===
          true;

    /* =====================================================
       SAVE
    ===================================================== */

    const rows =
      await sql`
        update animals

        set
          name =
            ${cleanName},

          temporary_name =
            ${cleanTemporaryName},

          species =
            ${cleanSpecies},

          breed_or_type =
            ${cleanBreed},

          source =
            ${cleanSource},

          custody =
            ${cleanCustody},

          placement =
            ${cleanPlacement},

          urgency =
            ${cleanUrgency},

          notes =
            ${cleanNotes},

          birth_date =
            ${cleanBirthDate}::date,

          sex =
            ${cleanSex},

          weight_lbs =
            ${cleanWeight},

          public_name =
            ${publicName},

          public_species =
            ${publicSpecies},

          public_breed_or_type =
            ${publicBreed},

          public_birth_date =
            ${publicBirthDate}::date,

          public_sex =
            ${publicSex},

          public_weight_lbs =
            ${publicWeight},

          public_share_enabled =
            ${publishValue},

          public_summary =
            ${cleanPublicSummary},

          public_need =
            ${cleanPublicNeed},

          external_listing_url =
            ${cleanExternalUrl},

          outcome_status =
            ${cleanOutcomeStatus},

          outcome_date =
            ${cleanOutcomeDate}::date,

          public_outcome_message =
            ${cleanOutcomeMessage},

          show_on_success_wall =
            ${successWallValue},

          updated_at =
            now()

        where
          id = ${animalId}

        returning *
      `;

    /* =====================================================
       AUDIT
    ===================================================== */

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
          'animal_updated',
          ${JSON.stringify({
            publicSyncFields,
            publicShareEnabled:
              publishValue,
          })}
        )
      `;
    } catch (
      auditError
    ) {
      console.error(
        "Animal update audit failed:",
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
            : "Something went wrong saving the animal.",
      },
      {
        status: 500,
      }
    );
  }
}
