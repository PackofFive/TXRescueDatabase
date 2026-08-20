import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  requireEffectiveOrg,
  AuthError,
} from "@/lib/auth";

export const runtime = "edge";

/* =========================================================
   GET ANIMALS FOR CURRENT ORGANIZATION

   These are animals already under the organization's
   care or active responsibility.

   Urgent shelter animals are a separate system.
========================================================= */

export async function GET() {
  try {
    const { orgId } =
      await requireEffectiveOrg();

    const rows = await sql`
      select
        id,
        name,
        temporary_name,
        species,
        breed_or_type,
        source,
        custody,
        urgency,
        placement,
        created_at
      from animals
      where current_org_id = ${orgId}
      order by created_at desc
    `;

    return NextResponse.json({
      animals: rows,
    });
  } catch (err) {
    if (err instanceof AuthError) {
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
      "GET /api/animals failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong loading animals.",
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
    } = await requireEffectiveOrg();

    const body = await req
      .json()
      .catch(() => null);

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
      typeof species !== "string" ||
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

       "shelter" is deliberately excluded here.

       Animals only being considered for rescue belong
       under Urgent Shelter Animals, not this organization's
       own animal records.
    ----------------------------------------------------- */

    const validCustody = [
      "rescue",
      "owner",
      "other",
    ];

    const custodyValue =
      validCustody.includes(custody)
        ? custody
        : "rescue";

    /* -----------------------------------------------------
       DATE
    ----------------------------------------------------- */

    const startedAt =
      intakeDate
        ? new Date(intakeDate)
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
      typeof name === "string" &&
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
      typeof source === "string" &&
      source.trim()
        ? source.trim()
        : null;

    const cleanNotes =
      typeof notes === "string" &&
      notes.trim()
        ? notes.trim()
        : null;

    /* -----------------------------------------------------
       CREATE ANIMAL
    ----------------------------------------------------- */

    const animalRows = await sql`
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
      "POST /api/animals failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong recording intake.",
      },
      {
        status: 500,
      }
    );
  }
}
