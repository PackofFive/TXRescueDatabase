import {
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

async function resolveFosterProfile() {
  const session =
    await getSession();

  if (
    !session ||
    session.status !== "approved"
  ) {
    return null;
  }

  const email =
    session.email
      ?.trim()
      .toLowerCase() ??
    "";

  const rows =
    await sql`
      select
        id,
        user_id

      from foster_profiles

      where
        user_id =
          ${session.id}::uuid

        or (
          user_id is null
          and lower(email) =
            ${email}
        )

      order by
        case
          when user_id =
            ${session.id}::uuid
            then 0
          else 1
        end,
        created_at asc

      limit 1
    `;

  const profile =
    rows[0] ?? null;

  if (
    profile &&
    !profile.user_id
  ) {
    await sql`
      update foster_profiles
      set
        user_id =
          ${session.id}::uuid,
        updated_at =
          now()
      where
        id =
          ${String(profile.id)}
        and user_id is null
    `;
  }

  return {
    session,
    fosterId:
      profile?.id
        ? String(profile.id)
        : null,
  };
}

export async function GET() {
  try {
    const access =
      await resolveFosterProfile();

    if (!access) {
      return NextResponse.json(
        {
          error:
            "Sign in required.",
        },
        {
          status: 401,
        }
      );
    }

    if (!access.fosterId) {
      return NextResponse.json({
        animals: [],
      });
    }

    const rows =
      await sql`
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
          a.species,
          a.breed_or_type,
          a.sex,
          a.age_estimate,
          a.size,
          a.weight_lbs,
          a.placement,
          a.urgency,
          a.notes,
          a.current_org_id,

          o.name as organization_name,

          r.access_level,
          r.can_submit_updates,
          r.can_add_photos,
          r.can_add_behavior_notes

        from foster_assignments fa

        join animals a
          on a.id =
            fa.animal_id

        join organizations o
          on o.id =
            a.current_org_id

        join foster_organization_relationships r
          on r.foster_id =
            fa.foster_id
          and r.organization_id =
            a.current_org_id
          and r.status =
            'approved'

        where
          fa.foster_id =
            ${access.fosterId}
          and fa.ended_at
            is null

        order by
          fa.started_at desc,
          display_name asc
      `;

    return NextResponse.json({
      animals:
        rows,
    });
  } catch (err) {
    console.error(
      "GET /api/foster/animals failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load foster animals.",
      },
      {
        status: 500,
      }
    );
  }
}
