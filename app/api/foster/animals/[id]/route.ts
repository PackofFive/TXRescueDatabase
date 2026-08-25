import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

async function resolveAccess(animalId: string) {
  const session = await getSession();

  if (!session || session.status !== "approved") {
    return null;
  }

  const email = session.email?.trim().toLowerCase() ?? "";

  const fosterRows = await sql`
    select id, user_id
    from foster_profiles
    where
      user_id = ${session.id}::uuid
      or (
        user_id is null
        and lower(email) = ${email}
      )
    order by
      case
        when user_id = ${session.id}::uuid then 0
        else 1
      end,
      created_at asc
    limit 1
  `;

  const foster = fosterRows[0];

  if (!foster?.id) {
    return null;
  }

  if (!foster.user_id) {
    await sql`
      update foster_profiles
      set
        user_id = ${session.id}::uuid,
        updated_at = now()
      where
        id = ${String(foster.id)}
        and user_id is null
    `;
  }

  const accessRows = await sql`
    select
      fa.id as assignment_id,
      fa.started_at,
      fa.notes as assignment_notes,

      a.id,
      coalesce(
        nullif(a.name, ''),
        nullif(a.temporary_name, ''),
        'Unnamed Animal'
      ) as display_name,
      a.name,
      a.temporary_name,
      a.species,
      a.breed_or_type,
      a.sex,
      a.age_estimate,
      a.size,
      a.birth_date,
      a.weight_lbs,
      a.custody,
      a.urgency,
      a.urgency_deadline,
      a.placement,
      a.notes,
      a.current_org_id,

      o.name as organization_name,

      r.access_level,
      r.can_submit_updates,
      r.can_add_photos,
      r.can_add_behavior_notes

    from foster_assignments fa

    join animals a
      on a.id = fa.animal_id

    join organizations o
      on o.id = a.current_org_id

    join foster_organization_relationships r
      on r.foster_id = fa.foster_id
      and r.organization_id = a.current_org_id
      and r.status = 'approved'

    where
      fa.foster_id = ${String(foster.id)}
      and fa.animal_id = ${animalId}::uuid
      and fa.ended_at is null

    limit 1
  `;

  return accessRows[0] ?? null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const animal = await resolveAccess(id);

    if (!animal) {
      return NextResponse.json(
        { error: "Active foster access to this animal was not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ animal });
  } catch (err) {
    console.error("GET /api/foster/animals/[id] failed:", err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load foster animal file.",
      },
      { status: 500 }
    );
  }
}
