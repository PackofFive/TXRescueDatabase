import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getSession,
} from "@/lib/auth";

import {
  sql,
} from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

async function requireOrganization() {
  const session =
    await getSession();

  if (
    !session ||
    session.status !== "approved" ||
    !session.orgId
  ) {
    return null;
  }

  return {
    session,
    orgId:
      String(session.orgId),
  };
}

export async function GET() {
  try {
    const access =
      await requireOrganization();

    if (!access) {
      return NextResponse.json(
        {
          error:
            "Rescue Manager access required.",
        },
        {
          status: 401,
        }
      );
    }

    const fosterRows =
      await sql`
        select
          fp.id,
          fp.full_name,
          fp.email,
          fp.phone,
          fp.city,
          fp.state,
          fp.availability_status,
          fp.max_capacity,
          fp.species_preferences,
          fp.size_preferences,
          r.access_level,
          r.can_submit_updates,
          r.can_add_photos,
          r.can_add_behavior_notes,
          r.approved_at

        from foster_organization_relationships r

        join foster_profiles fp
          on fp.id =
            r.foster_id

        where
          r.organization_id =
            ${access.orgId}::uuid
          and r.status =
            'approved'

        order by
          fp.full_name asc
      `;

    const animalRows =
      await sql`
        select
          a.id,
          coalesce(
            nullif(a.name, ''),
            nullif(a.temporary_name, ''),
            'Unnamed Animal'
          ) as display_name,
          a.species,
          a.breed_or_type,
          a.sex,
          a.age_estimate,
          a.size,
          a.urgency,
          a.placement,

          fa.id as assignment_id,
          fa.foster_id as assigned_foster_id,
          fa.started_at,
          fa.notes as assignment_notes,

          assigned.full_name
            as assigned_foster_name

        from animals a

        left join foster_assignments fa
          on fa.animal_id =
            a.id
          and fa.ended_at
            is null

        left join foster_profiles assigned
          on assigned.id =
            fa.foster_id

        where
          a.current_org_id =
            ${access.orgId}::uuid

        order by
          case
            when fa.id is not null
              then 0
            else 1
          end,
          display_name asc
      `;

    return NextResponse.json({
      fosters:
        fosterRows,
      animals:
        animalRows,
    });
  } catch (err) {
    console.error(
      "GET /api/fosters/assignments failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load foster assignments.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  req: NextRequest
) {
  try {
    const access =
      await requireOrganization();

    if (!access) {
      return NextResponse.json(
        {
          error:
            "Rescue Manager access required.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await req.json();

    const fosterId =
      typeof body?.fosterId ===
        "string"
        ? body.fosterId.trim()
        : "";

    const animalId =
      typeof body?.animalId ===
        "string"
        ? body.animalId.trim()
        : "";

    const notes =
      typeof body?.notes ===
        "string"
        ? body.notes.trim()
        : "";

    if (
      !fosterId ||
      !animalId
    ) {
      return NextResponse.json(
        {
          error:
            "Foster and animal are required.",
        },
        {
          status: 400,
        }
      );
    }

    const relationship =
      await sql`
        select id
        from foster_organization_relationships
        where
          foster_id =
            ${fosterId}
          and organization_id =
            ${access.orgId}::uuid
          and status =
            'approved'
        limit 1
      `;

    if (!relationship[0]) {
      return NextResponse.json(
        {
          error:
            "This foster does not have an approved relationship with your organization.",
        },
        {
          status: 403,
        }
      );
    }

    const animal =
      await sql`
        select id
        from animals
        where
          id =
            ${animalId}::uuid
          and current_org_id =
            ${access.orgId}::uuid
        limit 1
      `;

    if (!animal[0]) {
      return NextResponse.json(
        {
          error:
            "Animal not found for this organization.",
        },
        {
          status: 404,
        }
      );
    }

    const existing =
      await sql`
        select
          id,
          foster_id
        from foster_assignments
        where
          animal_id =
            ${animalId}::uuid
          and ended_at
            is null
        limit 1
      `;

    if (existing[0]) {
      return NextResponse.json(
        {
          error:
            "This animal already has an active foster assignment. End the current assignment first.",
        },
        {
          status: 409,
        }
      );
    }

    const rows =
      await sql`
        insert into foster_assignments (
          id,
          foster_id,
          animal_id,
          started_at,
          notes
        )
        values (
          gen_random_uuid(),
          ${fosterId},
          ${animalId}::uuid,
          now(),
          ${notes || null}
        )
        returning
          id,
          foster_id,
          animal_id,
          started_at,
          ended_at,
          notes
      `;

    return NextResponse.json(
      {
        assignment:
          rows[0],
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.error(
      "POST /api/fosters/assignments failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't assign foster.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  req: NextRequest
) {
  try {
    const access =
      await requireOrganization();

    if (!access) {
      return NextResponse.json(
        {
          error:
            "Rescue Manager access required.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await req.json();

    const assignmentId =
      typeof body?.assignmentId ===
        "string"
        ? body.assignmentId.trim()
        : "";

    if (!assignmentId) {
      return NextResponse.json(
        {
          error:
            "Assignment is required.",
        },
        {
          status: 400,
        }
      );
    }

    const rows =
      await sql`
        update foster_assignments fa

        set
          ended_at =
            now()

        from animals a

        where
          fa.id =
            ${assignmentId}::uuid
          and fa.animal_id =
            a.id
          and a.current_org_id =
            ${access.orgId}::uuid
          and fa.ended_at
            is null

        returning
          fa.id,
          fa.foster_id,
          fa.animal_id,
          fa.started_at,
          fa.ended_at,
          fa.notes
      `;

    if (!rows[0]) {
      return NextResponse.json(
        {
          error:
            "Active foster assignment not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      assignment:
        rows[0],
    });
  } catch (err) {
    console.error(
      "PATCH /api/fosters/assignments failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't end foster assignment.",
      },
      {
        status: 500,
      }
    );
  }
}
