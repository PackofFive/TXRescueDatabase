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

async function resolvePortalProfiles() {
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

  const volunteerRows = await sql`
    select id, user_id
    from volunteer_profiles
    where user_id = ${session.id}::uuid
      or (
        user_id is null
        and lower(email) = ${email}
      )
    order by
      case when user_id = ${session.id}::uuid then 0 else 1 end,
      created_at asc
    limit 1
  `;

  const volunteerProfile = volunteerRows[0] ?? null;

  if (volunteerProfile && !volunteerProfile.user_id) {
    await sql`
      update volunteer_profiles
      set user_id = ${session.id}::uuid, updated_at = now()
      where id = ${String(volunteerProfile.id)}::uuid
        and user_id is null
    `;
  }

  return {
    session,
    fosterId: profile?.id ? String(profile.id) : null,
    volunteerId: volunteerProfile?.id ? String(volunteerProfile.id) : null,
  };
}

export async function GET() {
  try {
    const access =
      await resolvePortalProfiles();

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

    if (!access.fosterId && !access.volunteerId) {
      return NextResponse.json(
        {
          relationships: [],
          volunteerRelationships: [],
        }
      );
    }

    const relationships = access.fosterId
      ? await sql`
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
      `
      : [];

    const volunteerRelationships = access.volunteerId
      ? await sql`
        select
          relationship.id,
          relationship.organization_id,
          relationship.status,
          relationship.portal_access_level,
          relationship.capacity_status,
          relationship.verified_weekly_hours,
          relationship.approved_at,
          organization.name as organization_name,
          organization.city as organization_city,
          organization.county as organization_county,
          coalesce(categories.items, '[]'::json) as categories
        from volunteer_organization_relationships relationship
        join organizations organization
          on organization.id = relationship.organization_id
        left join lateral (
          select json_agg(
            json_build_object(
              'category', approval.category,
              'status', approval.status,
              'permissionLevel', approval.permission_level
            )
            order by approval.category
          ) as items
          from volunteer_category_approvals approval
          where approval.relationship_id = relationship.id
            and approval.status = 'approved'
        ) categories on true
        where relationship.volunteer_id = ${access.volunteerId}::uuid
        order by
          case when relationship.status = 'approved' then 0 else 1 end,
          organization.name asc
      `
      : [];

    return NextResponse.json({
      relationships,
      volunteerRelationships,
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
