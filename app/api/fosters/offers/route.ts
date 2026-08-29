import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const VALID_STATUSES = [
  "new",
  "reviewing",
  "contacted",
  "accepted",
  "declined",
  "closed",
] as const;

async function requireOrganization() {
  const session = await getSession();

  if (
    !session ||
    session.status !== "approved" ||
    !session.orgId
  ) {
    return null;
  }

  return {
    session,
    orgId: String(session.orgId),
  };
}

export async function GET() {
  try {
    const access = await requireOrganization();

    if (!access) {
      return NextResponse.json(
        { error: "Rescue Manager access required." },
        { status: 401 }
      );
    }

    const offers = await sql`
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
        aho.foster_id,
        aho.organization_id,
        aho.reviewed_at,
        aho.reviewed_by,
        aho.review_notes,
        aho.withdrawn_at,

        coalesce(
          nullif(a.name, ''),
          nullif(a.temporary_name, ''),
          'Unnamed Animal'
        ) as animal_name,
        a.species,
        a.breed_or_type,
        a.sex,
        a.age_estimate,
        a.size,
        a.placement,

        fp.full_name as foster_profile_name,
        fp.availability_status as foster_availability_status,

        forr.id as relationship_id,
        forr.status as relationship_status,
        forr.access_level,
        forr.can_submit_updates,
        forr.can_add_photos,
        forr.can_add_behavior_notes,

        fa.id as active_assignment_id,
        fa.foster_id as active_assignment_foster_id,
        assigned.full_name as active_assignment_foster_name

      from animal_help_offers aho

      join animals a
        on a.id = aho.animal_id

      left join foster_profiles fp
        on fp.id = aho.foster_id

      left join foster_organization_relationships forr
        on forr.foster_id = aho.foster_id
        and forr.organization_id = ${access.orgId}::uuid

      left join foster_assignments fa
        on fa.animal_id = aho.animal_id
        and fa.ended_at is null

      left join foster_profiles assigned
        on assigned.id = fa.foster_id

      where
        aho.organization_id = ${access.orgId}::uuid
        and a.current_org_id = ${access.orgId}::uuid

      order by
        case aho.status
          when 'new' then 0
          when 'reviewing' then 1
          when 'contacted' then 2
          when 'accepted' then 3
          when 'declined' then 4
          else 5
        end,
        aho.created_at desc
    `;

    return NextResponse.json({ offers });
  } catch (err) {
    console.error("GET /api/fosters/offers failed:", err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load help offers.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const access = await requireOrganization();

    if (!access) {
      return NextResponse.json(
        { error: "Rescue Manager access required." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const offerId =
      typeof body?.offerId === "string"
        ? body.offerId.trim()
        : "";

    const status =
      typeof body?.status === "string"
        ? body.status.trim()
        : "";

    const reviewNotes =
      typeof body?.reviewNotes === "string"
        ? body.reviewNotes.trim()
        : "";

    if (!offerId) {
      return NextResponse.json(
        { error: "Offer is required." },
        { status: 400 }
      );
    }

    if (
      !VALID_STATUSES.includes(
        status as (typeof VALID_STATUSES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid offer status." },
        { status: 400 }
      );
    }

    const rows = await sql`
      update animal_help_offers aho

      set
        status = ${status},
        review_notes = ${reviewNotes || null},
        reviewed_at = now(),
        reviewed_by = ${access.session.id}::uuid,
        updated_at = now()

      from animals a

      where
        aho.id = ${offerId}::uuid
        and aho.organization_id = ${access.orgId}::uuid
        and aho.animal_id = a.id
        and a.current_org_id = ${access.orgId}::uuid

      returning
        aho.id,
        aho.status,
        aho.review_notes,
        aho.reviewed_at,
        aho.reviewed_by,
        aho.updated_at
    `;

    if (!rows[0]) {
      return NextResponse.json(
        { error: "Help offer not found for this organization." },
        { status: 404 }
      );
    }

    return NextResponse.json({ offer: rows[0] });
  } catch (err) {
    console.error("PATCH /api/fosters/offers failed:", err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't update help offer.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const access = await requireOrganization();

    if (!access) {
      return NextResponse.json(
        { error: "Rescue Manager access required." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const offerId =
      typeof body?.offerId === "string"
        ? body.offerId.trim()
        : "";

    if (!offerId) {
      return NextResponse.json(
        { error: "Offer is required." },
        { status: 400 }
      );
    }

    const offers = await sql`
      select
        aho.id,
        aho.animal_id,
        aho.offer_type,
        aho.status,
        aho.foster_id,
        aho.contact_name,
        aho.organization_id,
        a.current_org_id
      from animal_help_offers aho
      join animals a
        on a.id = aho.animal_id
      where
        aho.id = ${offerId}::uuid
        and aho.organization_id = ${access.orgId}::uuid
        and a.current_org_id = ${access.orgId}::uuid
      limit 1
    `;

    const offer = offers[0];

    if (!offer) {
      return NextResponse.json(
        { error: "Help offer not found for this organization." },
        { status: 404 }
      );
    }

    if (offer.offer_type !== "foster") {
      return NextResponse.json(
        {
          error:
            "Only foster offers can be converted into foster assignments.",
        },
        { status: 400 }
      );
    }

    if (!offer.foster_id) {
      return NextResponse.json(
        {
          error:
            "This offer is not linked to a Pack of Five Foster Profile yet. Link or invite the foster before creating an assignment.",
        },
        { status: 409 }
      );
    }

    if (offer.status !== "accepted") {
      return NextResponse.json(
        {
          error:
            "Accept the foster offer before creating the assignment.",
        },
        { status: 409 }
      );
    }

    const relationships = await sql`
      select
        id,
        status,
        can_submit_updates,
        can_add_photos,
        can_add_behavior_notes
      from foster_organization_relationships
      where
        foster_id = ${String(offer.foster_id)}
        and organization_id = ${access.orgId}::uuid
      limit 1
    `;

    const relationship = relationships[0];

    if (!relationship || relationship.status !== "approved") {
      return NextResponse.json(
        {
          error:
            "This foster must have an approved relationship with your organization before animal access can be granted.",
        },
        { status: 409 }
      );
    }

    const existing = await sql`
      select
        fa.id,
        fa.foster_id,
        fp.full_name as foster_name
      from foster_assignments fa
      left join foster_profiles fp
        on fp.id = fa.foster_id
      where
        fa.animal_id = ${String(offer.animal_id)}::uuid
        and fa.ended_at is null
      limit 1
    `;

    if (existing[0]) {
      if (
        String(existing[0].foster_id) ===
        String(offer.foster_id)
      ) {
        return NextResponse.json(
          {
            error:
              "This animal is already actively assigned to this foster.",
            assignment: existing[0],
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error:
            `This animal already has an active foster assignment${
              existing[0].foster_name
                ? ` with ${existing[0].foster_name}`
                : ""
            }. End that assignment first.`,
        },
        { status: 409 }
      );
    }

    try {
      const assignments = await sql`
        insert into foster_assignments (
          id,
          foster_id,
          animal_id,
          organization_id,
          started_at,
          notes,
          can_submit_updates,
          can_add_photos,
          can_add_behavior_notes,
          access_overrides
        )
        values (
          gen_random_uuid(),
          ${String(offer.foster_id)},
          ${String(offer.animal_id)}::uuid,
          ${access.orgId}::uuid,
          now(),
          ${`Created from accepted Pack of Five foster offer ${offerId}.`},
          ${Boolean(relationship.can_submit_updates)},
          ${Boolean(relationship.can_add_photos)},
          ${Boolean(relationship.can_add_behavior_notes)},
          '{}'::jsonb
        )
        returning
          id,
          foster_id,
          animal_id,
          organization_id,
          started_at,
          ended_at,
          notes,
          can_submit_updates,
          can_add_photos,
          can_add_behavior_notes,
          access_overrides
      `;

      await sql`
        update animal_help_offers
        set
          reviewed_at = coalesce(reviewed_at, now()),
          reviewed_by = coalesce(
            reviewed_by,
            ${access.session.id}::uuid
          ),
          updated_at = now()
        where
          id = ${offerId}::uuid
          and organization_id = ${access.orgId}::uuid
      `;

      return NextResponse.json(
        {
          assignment: assignments[0],
          offerId,
        },
        { status: 201 }
      );
    } catch (insertError) {
      const message =
        insertError instanceof Error
          ? insertError.message
          : "";

      if (
        message.includes(
          "foster_assignments_one_active_per_animal_idx"
        ) ||
        message.includes("duplicate key")
      ) {
        return NextResponse.json(
          {
            error:
              "This animal received another active foster assignment before this request completed. Refresh the page and review the current assignment.",
          },
          { status: 409 }
        );
      }

      throw insertError;
    }
  } catch (err) {
    console.error("POST /api/fosters/offers failed:", err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't create foster assignment.",
      },
      { status: 500 }
    );
  }
}
