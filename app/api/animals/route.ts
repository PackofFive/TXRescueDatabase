import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  requireEffectiveOrg,
  AuthError,
} from "@/lib/auth";

export const runtime = "edge";

/* =========================================================
   GET ANIMALS FOR CURRENT ORGANIZATION

   Dashboard data only:
   - compact animal identity
   - photo
   - age source fields
   - reminders
   - optional card-field data
   - open help/foster offers

   Full animal details stay in /animals/[id].
========================================================= */

export async function GET(
  req: NextRequest
) {
  try {
    const { orgId } =
      await requireEffectiveOrg();

    const {
      searchParams,
    } = new URL(req.url);

    const q =
      searchParams
        .get("q")
        ?.trim() || null;

    const species =
      searchParams.get(
        "species"
      ) || null;

    const placement =
      searchParams.get(
        "placement"
      ) || null;

    const attentionOnly =
      searchParams.get(
        "attention"
      ) === "true";

    const sort =
      searchParams.get(
        "sort"
      ) || "newest";

    const caseStatus =
      searchParams.get(
        "caseStatus"
      ) || "active";

    const rows = await sql`
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
        a.public_share_enabled,
        a.external_listing_url,
        a.outcome_status,
        a.outcome_date,
        a.created_at,

        (
          select
            '/api/animals/' ||
            a.id::text ||
            '/documents?documentId=' ||
            ad.id::text

          from animal_documents ad

          where
            ad.id =
              a.primary_photo_document_id

            and
            ad.animal_id =
              a.id

            and
            ad.org_id =
              a.current_org_id

            and
            ad.content_type like
              'image/%'

          limit 1
        ) as photo_url,

        (
          select min(amr.due_at)
          from animal_medical_records amr
          where
            amr.animal_id = a.id
            and amr.due_at is not null
            and amr.status <> 'completed'
        ) as next_medical_due,

        (
          select min(amed.next_due_at)
          from animal_medications amed
          where
            amed.animal_id = a.id
            and amed.active = true
            and amed.next_due_at is not null
        ) as next_medication_due,

        (
          select count(*)::int
          from animal_help_offers aho
          where
            aho.animal_id = a.id
            and aho.status in (
              'new',
              'reviewing',
              'contacted'
            )
        ) as open_help_offers

      from animals a

      where
        a.current_org_id = ${orgId}

        and (
          ${q}::text is null
          or a.name ilike '%' || ${q} || '%'
          or a.temporary_name ilike '%' || ${q} || '%'
          or a.breed_or_type ilike '%' || ${q} || '%'
        )

        and (
          ${species}::text is null
          or a.species = ${species}
        )

        and (
          ${placement}::text is null
          or a.placement = ${placement}
        )

        and (
          ${caseStatus} = 'all'

          or (
            ${caseStatus} = 'active'
            and a.outcome_status is null
          )

          or (
            ${caseStatus} = 'closed'
            and a.outcome_status is not null
          )
        )

      order by
        case
          when ${sort} = 'name'
          then coalesce(
            a.name,
            a.temporary_name,
            ''
          )
        end asc,

        case
          when ${sort} = 'oldest'
          then a.created_at
        end asc,

        case
          when ${sort} = 'newest'
          then a.created_at
        end desc,

        a.created_at desc
    `;

    const now =
      Date.now();

    const animals =
      rows
        .map((row: any) => {
          const medicalDue =
            row.next_medical_due
              ? new Date(
                  row.next_medical_due
                ).getTime()
              : null;

          const medicationDue =
            row.next_medication_due
              ? new Date(
                  row.next_medication_due
                ).getTime()
              : null;

          const reminders = [];

          if (
            medicalDue !== null
          ) {
            reminders.push({
              kind:
                "medical",

              label:
                medicalDue <
                now
                  ? "Medical care overdue"
                  : "Medical care due",

              dueAt:
                row.next_medical_due,

              overdue:
                medicalDue <
                now,
            });
          }

          if (
            medicationDue !==
            null
          ) {
            reminders.push({
              kind:
                "medication",

              label:
                medicationDue <
                now
                  ? "Medication overdue"
                  : "Medication due",

              dueAt:
                row.next_medication_due,

              overdue:
                medicationDue <
                now,
            });
          }

          /*
            Keep dashboard noise low.

            Full medical detail stays
            in the animal file.
          */

          reminders.sort(
            (a, b) => {
              if (
                a.overdue &&
                !b.overdue
              ) {
                return -1;
              }

              if (
                !a.overdue &&
                b.overdue
              ) {
                return 1;
              }

              return (
                new Date(
                  a.dueAt
                ).getTime() -
                new Date(
                  b.dueAt
                ).getTime()
              );
            }
          );

          return {
            ...row,

            reminders:
              row.outcome_status
                ? []
                : reminders.slice(
                    0,
                    2
                  ),
          };
        })
        .filter(
          (animal: any) =>
            !attentionOnly ||
            animal.reminders
              .length > 0
        );

    const orgRows =
      await sql`
        select
          animal_card_fields
        from organizations
        where id = ${orgId}
        limit 1
      `;

    return NextResponse.json({
      animals,

      cardFields:
        orgRows[0]
          ?.animal_card_fields ??
        [
          "placement",
          "foster_offers",
        ],
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
      "GET /api/animals failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong loading animals.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   QUICK ANIMAL INTAKE

   Minimal by design.

   Creates:
   1. Animal record
   2. Opening custody/timeline event
   3. Optional photo record
   4. Audit record

   Additional medical, foster, behavior, expenses,
   documents and outcome information can be completed
   later in the animal's full record.
========================================================= */

export async function POST(
  req: NextRequest
) {
  try {
    const {
      session,
      orgId,
    } =
      await requireEffectiveOrg();

    const body =
      await req
        .json()
        .catch(
          () => null
        );

    const {
      species,
      name,
      temporaryName,
      source,
      custody,
      intakeDate,
      photoUrl,
      notes,
    } = body ?? {};

    /* -----------------------------------------------------
       SPECIES
    ----------------------------------------------------- */

    if (
      !species ||
      typeof species !==
        "string" ||
      !species.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Species is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------------
       CUSTODY / ACTIVE RESPONSIBILITY

       Shelter animals only being considered for rescue
       remain under Urgent Shelter Animals.
    ----------------------------------------------------- */

    const validCustody = [
      "rescue",
      "owner",
      "other",
    ];

    const custodyValue =
      validCustody.includes(
        custody
      )
        ? custody
        : "rescue";

    /* -----------------------------------------------------
       DATE
    ----------------------------------------------------- */

    const startedAt =
      intakeDate
        ? new Date(
            intakeDate
          )
        : new Date();

    if (
      isNaN(
        startedAt.getTime()
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Intake date is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------------
       CLEAN VALUES
    ----------------------------------------------------- */

    const cleanName =
      typeof name ===
        "string" &&
      name.trim()
        ? name.trim()
        : null;

    const cleanTemporaryName =
      typeof temporaryName ===
        "string" &&
      temporaryName.trim()
        ? temporaryName.trim()
        : null;

    const cleanSource =
      typeof source ===
        "string" &&
      source.trim()
        ? source.trim()
        : null;

    const cleanNotes =
      typeof notes ===
        "string" &&
      notes.trim()
        ? notes.trim()
        : null;

    /* -----------------------------------------------------
       CREATE ANIMAL
    ----------------------------------------------------- */

    const animalRows =
      await sql`
        insert into animals (
          name,
          temporary_name,
          species,
          source,
          current_org_id,
          custody,
          notes,
          created_by
        )

        values (
          ${cleanName},
          ${cleanTemporaryName},
          ${species.trim()},
          ${cleanSource},
          ${orgId},
          ${custodyValue},
          ${cleanNotes},
          ${session.id}
        )

        returning
          id,
          name,
          temporary_name,
          species,
          source,
          custody,
          created_at
      `;

    const animal =
      animalRows[0];

    /* -----------------------------------------------------
       OPENING TIMELINE / CUSTODY EVENT
    ----------------------------------------------------- */

    await sql`
      insert into animal_custody_events (
        animal_id,
        event_type,
        org_id,
        recorded_by,
        started_at
      )

      values (
        ${animal.id},
        'intake',
        ${orgId},
        ${session.id},
        ${startedAt.toISOString()}
      )
    `;

    /* -----------------------------------------------------
       OPTIONAL PHOTO
    ----------------------------------------------------- */

    if (
      photoUrl &&
      typeof photoUrl ===
        "string" &&
      photoUrl.trim()
    ) {
      await sql`
        insert into media (
          owner_type,
          owner_id,
          url,
          source,
          visibility,
          uploaded_by
        )

        values (
          'animal',
          ${animal.id},
          ${photoUrl.trim()},
          'rescue',
          'private',
          ${session.id}
        )
      `;
    }

    /* -----------------------------------------------------
       AUDIT
    ----------------------------------------------------- */

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
        ${animal.id},
        ${session.id},
        'intake',
        ${JSON.stringify({
          species:
            species.trim(),

          source:
            cleanSource,

          custody:
            custodyValue,

          actingOrgId:
            orgId,

          adminTestMode:
            session.role ===
            "admin",
        })}
      )
    `;

    return NextResponse.json(
      {
        animal,
      },
      {
        status: 201,
      }
    );
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
      "POST /api/animals failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong recording intake.",
      },
      {
        status: 500,
      }
    );
  }
}
