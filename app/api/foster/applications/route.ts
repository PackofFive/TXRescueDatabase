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
  const session = await getSession();

  if (!session || session.status !== "approved") {
    return null;
  }

  const email = session.email?.trim().toLowerCase() ?? "";

  const rows = await sql`
    select
      id,
      user_id,
      email
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

  const profile = rows[0] ?? null;

  if (profile && !profile.user_id) {
    await sql`
      update foster_profiles
      set
        user_id = ${session.id}::uuid,
        updated_at = now()
      where
        id = ${String(profile.id)}
        and user_id is null
    `;
  }

  return {
    session,
    fosterId: profile?.id
      ? String(profile.id)
      : null,
  };
}

export async function GET() {
  try {
    const access = await resolveFosterProfile();

    if (!access) {
      return NextResponse.json(
        { error: "Sign in required." },
        { status: 401 }
      );
    }

    if (!access.fosterId) {
      return NextResponse.json({
        offers: [],
      });
    }

    const rows = await sql`
      select
        aho.id,
        aho.animal_id,
        aho.offer_type,
        aho.contact_name,
        aho.contact_email,
        aho.contact_phone,
        aho.city,
        aho.postal_code,
        aho.availability,
        aho.household_info,
        aho.message,
        aho.status,
        aho.created_at,
        aho.updated_at,
        aho.reviewed_at,
        aho.review_notes,
        aho.withdrawn_at,
        aho.organization_id,
        coalesce(
          nullif(a.name, ''),
          nullif(a.temporary_name, ''),
          'Unnamed Animal'
        ) as animal_name,
        a.species,
        a.breed_or_type,
        o.name as organization_name
      from animal_help_offers aho
      join animals a
        on a.id = aho.animal_id
      left join organizations o
        on o.id = aho.organization_id
      where
        aho.foster_id = ${access.fosterId}
      order by
        case
          when aho.status in ('new', 'reviewing', 'contacted') then 0
          when aho.status = 'accepted' then 1
          else 2
        end,
        aho.created_at desc
    `;

    return NextResponse.json({
      offers: rows,
    });
  } catch (err) {
    console.error(
      "GET /api/foster/applications failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load applications and offers.",
      },
      { status: 500 }
    );
  }
}
