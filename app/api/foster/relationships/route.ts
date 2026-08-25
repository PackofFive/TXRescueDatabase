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
      return NextResponse.json(
        {
          relationships: [],
        }
      );
    }

    const relationships =
      await sql`
        select
          r.id,
          r.foster_id,
          r.organization_id,
          r.status,
          r.access_level,
          r.can_submit_updates,
          r.can_add_photos,
          r.can_add_behavior_notes,
          r.approved_at,
          r.approved_by,
          r.inactive_at,
          r.organization_notes,
          r.created_at,
          r.updated_at,

          o.name as organization_name,
          o.city as organization_city,
          o.county as organization_county

        from foster_organization_relationships r

        join organizations o
          on o.id =
            r.organization_id

        where
          r.foster_id =
            ${access.fosterId}

        order by
          case
            when r.status = 'approved'
              then 0
            when r.status = 'pending'
              then 1
            else 2
          end,
          o.name asc
      `;

    return NextResponse.json({
      relationships,
    });
  } catch (err) {
    console.error(
      "GET /api/foster/relationships failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load rescue relationships.",
      },
      {
        status: 500,
      }
    );
  }
}
