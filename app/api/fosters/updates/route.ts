import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

async function requireOrganization() {
  const session = await getSession();

  if (!session || session.status !== "approved" || !session.orgId) {
    return null;
  }

  if (session.role !== "org" && session.role !== "admin") {
    return null;
  }

  return session;
}

export async function GET() {
  try {
    const session = await requireOrganization();

    if (!session) {
      return NextResponse.json(
        { error: "Organization access required." },
        { status: 401 }
      );
    }

    const rows = await sql`
      select
        u.id,
        u.assignment_id,
        u.foster_id,
        u.animal_id,
        u.update_type,
        u.title,
        u.update_text,
        u.status,
        u.submitted_at,
        u.reviewed_at,
        u.review_notes,
        u.incorporated_at,

        fp.full_name as foster_name,
        fp.email as foster_email,

        coalesce(
          nullif(a.name, ''),
          nullif(a.temporary_name, ''),
          'Unnamed Animal'
        ) as animal_name,
        a.species,
        a.breed_or_type

      from foster_animal_updates u

      join foster_profiles fp
        on fp.id = u.foster_id

      join animals a
        on a.id = u.animal_id

      where
        u.organization_id = ${session.orgId}::uuid

      order by
        case u.status
          when 'submitted' then 0
          when 'reviewed' then 1
          when 'incorporated' then 2
          else 3
        end,
        u.submitted_at desc
    `;

    return NextResponse.json({
      updates: rows,
    });
  } catch (err) {
    console.error(
      "GET /api/fosters/updates failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load foster updates.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireOrganization();

    if (!session) {
      return NextResponse.json(
        { error: "Organization access required." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const id =
      typeof body?.id === "string"
        ? body.id.trim()
        : "";

    const action =
      typeof body?.action === "string"
        ? body.action.trim()
        : "";

    const reviewNotes =
      typeof body?.reviewNotes === "string"
        ? body.reviewNotes.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        { error: "Update ID is required." },
        { status: 400 }
      );
    }

    if (!["review", "incorporate", "archive"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid review action." },
        { status: 400 }
      );
    }

    let rows;

    if (action === "review") {
      rows = await sql`
        update foster_animal_updates
        set
          status = 'reviewed',
          reviewed_at = now(),
          reviewed_by = ${session.id}::uuid,
          review_notes = ${reviewNotes || null},
          updated_at = now()
        where
          id = ${id}::uuid
          and organization_id = ${session.orgId}::uuid
        returning *
      `;
    } else if (action === "incorporate") {
      rows = await sql`
        update foster_animal_updates
        set
          status = 'incorporated',
          reviewed_at = coalesce(reviewed_at, now()),
          reviewed_by = coalesce(reviewed_by, ${session.id}::uuid),
          review_notes =
            case
              when ${reviewNotes || null}::text is not null
                then ${reviewNotes || null}
              else review_notes
            end,
          incorporated_at = now(),
          incorporated_by = ${session.id}::uuid,
          updated_at = now()
        where
          id = ${id}::uuid
          and organization_id = ${session.orgId}::uuid
        returning *
      `;
    } else {
      rows = await sql`
        update foster_animal_updates
        set
          status = 'archived',
          reviewed_at = coalesce(reviewed_at, now()),
          reviewed_by = coalesce(reviewed_by, ${session.id}::uuid),
          review_notes =
            case
              when ${reviewNotes || null}::text is not null
                then ${reviewNotes || null}
              else review_notes
            end,
          updated_at = now()
        where
          id = ${id}::uuid
          and organization_id = ${session.orgId}::uuid
        returning *
      `;
    }

    if (!rows[0]) {
      return NextResponse.json(
        { error: "Foster update not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      update: rows[0],
    });
  } catch (err) {
    console.error(
      "PATCH /api/fosters/updates failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't review foster update.",
      },
      { status: 500 }
    );
  }
}
