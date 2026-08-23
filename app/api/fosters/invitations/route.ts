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

async function sha256(
  value: string
) {
  const bytes =
    new TextEncoder().encode(
      value
    );

  const digest =
    await crypto.subtle.digest(
      "SHA-256",
      bytes
    );

  return Array.from(
    new Uint8Array(
      digest
    )
  )
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, "0")
    )
    .join("");
}

function createToken() {
  const bytes =
    new Uint8Array(32);

  crypto.getRandomValues(
    bytes
  );

  return Array.from(
    bytes
  )
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, "0")
    )
    .join("");
}

async function requireOrganizationSession() {
  const session =
    await getSession();

  if (
    !session ||
    session.status !==
      "approved" ||
    !session.orgId
  ) {
    return null;
  }

  return session;
}

export async function GET() {
  try {
    const session =
      await requireOrganizationSession();

    if (!session) {
      return NextResponse.json(
        {
          error:
            "Organization access required.",
        },
        {
          status: 401,
        }
      );
    }

    const relationships =
      await sql`
        select
          r.id,
          r.status,
          r.access_level,
          r.created_at,
          r.approved_at,

          fp.id as foster_id,
          fp.full_name,
          fp.email,
          fp.phone,
          fp.city,
          fp.state,
          fp.availability_status,
          fp.transport_available,

          latest_invite.id as invitation_id,
          latest_invite.status as invitation_status,
          latest_invite.created_at as invitation_created_at,
          latest_invite.expires_at as invitation_expires_at

        from foster_organization_relationships r

        join foster_profiles fp
          on fp.id = r.foster_id

        left join lateral (
          select
            fi.id,
            fi.status,
            fi.created_at,
            fi.expires_at

          from foster_invitations fi

          where
            fi.organization_id =
              r.organization_id
            and fi.foster_id =
              r.foster_id

          order by
            fi.created_at desc

          limit 1
        ) latest_invite
          on true

        where
          r.organization_id =
            ${session.orgId}

        order by
          case
            when r.status = 'pending'
              then 0
            when r.status = 'invited'
              then 1
            when r.status = 'approved'
              then 2
            else 3
          end,
          r.created_at desc
      `;

    const invitations =
      await sql`
        select
          id,
          invited_email,
          invited_name,
          status,
          expires_at,
          created_at

        from foster_invitations

        where
          organization_id =
            ${session.orgId}

        order by
          created_at desc

        limit 100
      `;

    return NextResponse.json({
      relationships,
      invitations,
    });
  } catch (err) {
    console.error(
      "GET /api/fosters/invitations failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load foster records.",
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
    const session =
      await requireOrganizationSession();

    if (!session) {
      return NextResponse.json(
        {
          error:
            "Organization access required.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await req.json();

    const email =
      typeof body?.email ===
        "string"
        ? body.email
            .trim()
            .toLowerCase()
        : "";

    const name =
      typeof body?.name ===
        "string"
        ? body.name.trim()
        : "";

    if (!email) {
      return NextResponse.json(
        {
          error:
            "Foster email is required.",
        },
        {
          status: 400,
        }
      );
    }

    const existingPending =
      await sql`
        select id

        from foster_invitations

        where
          organization_id =
            ${session.orgId}

          and lower(
            invited_email
          ) = ${email}

          and status =
            'pending'

          and expires_at >
            now()

        limit 1
      `;

    if (
      existingPending[0]
    ) {
      return NextResponse.json(
        {
          error:
            "A current invitation already exists for this email.",
        },
        {
          status: 409,
        }
      );
    }

    let fosterId:
      | string
      | null =
      null;

    const existingFoster =
      await sql`
        select id

        from foster_profiles

        where
          lower(email) =
            ${email}

        limit 1
      `;

    if (
      existingFoster[0]?.id
    ) {
      fosterId =
        String(
          existingFoster[0].id
        );
    } else {
      const newFoster =
        await sql`
          insert into foster_profiles (
            full_name,
            email,
            state
          )

          values (
            ${
              name ||
              email
            },
            ${email},
            'TX'
          )

          returning id
        `;

      fosterId =
        String(
          newFoster[0].id
        );
    }

    await sql`
      insert into foster_organization_relationships (
        foster_id,
        organization_id,
        status
      )

      values (
        ${fosterId},
        ${session.orgId},
        'invited'
      )

      on conflict (
        foster_id,
        organization_id
      )

      do update
      set
        status =
          case
            when foster_organization_relationships.status =
              'approved'
              then foster_organization_relationships.status
            else 'invited'
          end,
        updated_at =
          now()
    `;

    const token =
      createToken();

    const tokenHash =
      await sha256(
        token
      );

    const invitationRows =
      await sql`
        insert into foster_invitations (
          organization_id,
          foster_id,
          invited_email,
          invited_name,
          token_hash,
          expires_at,
          invited_by
        )

        values (
          ${session.orgId},
          ${fosterId},
          ${email},
          ${
            name ||
            null
          },
          ${tokenHash},
          now() +
            interval '14 days',
          ${session.id}
        )

        returning
          id,
          invited_email,
          invited_name,
          status,
          expires_at,
          created_at
      `;

    const origin =
      new URL(
        req.url
      ).origin;

    const inviteUrl =
      `${origin}/foster/accept?token=${encodeURIComponent(
        token
      )}`;

    return NextResponse.json(
      {
        invitation:
          invitationRows[0],
        inviteUrl,
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.error(
      "POST /api/fosters/invitations failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't create foster invitation.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  req: NextRequest
) {
  try {
    const session =
      await requireOrganizationSession();

    if (!session) {
      return NextResponse.json(
        {
          error:
            "Organization access required.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await req.json();

    const relationshipId =
      typeof body?.relationshipId ===
        "string"
        ? body.relationshipId.trim()
        : "";

    if (!relationshipId) {
      return NextResponse.json(
        {
          error:
            "Foster relationship is required.",
        },
        {
          status: 400,
        }
      );
    }

    const relationshipRows =
      await sql`
        select
          r.id,
          r.foster_id,
          fp.email,
          fp.full_name

        from foster_organization_relationships r

        join foster_profiles fp
          on fp.id = r.foster_id

        where
          r.id =
            ${relationshipId}

          and r.organization_id =
            ${session.orgId}

        limit 1
      `;

    const relationship =
      relationshipRows[0];

    if (!relationship) {
      return NextResponse.json(
        {
          error:
            "Foster relationship was not found.",
        },
        {
          status: 404,
        }
      );
    }

    const fosterEmail =
      relationship.email
        ? String(
            relationship.email
          )
            .trim()
            .toLowerCase()
        : "";

    if (!fosterEmail) {
      return NextResponse.json(
        {
          error:
            "This foster does not have an email address.",
        },
        {
          status: 400,
        }
      );
    }

    await sql`
      update foster_invitations

      set
        status =
          'revoked',
        revoked_at =
          now()

      where
        organization_id =
          ${session.orgId}

        and foster_id =
          ${relationship.foster_id}

        and status =
          'pending'
    `;

    const token =
      createToken();

    const tokenHash =
      await sha256(
        token
      );

    const invitationRows =
      await sql`
        insert into foster_invitations (
          organization_id,
          foster_id,
          invited_email,
          invited_name,
          token_hash,
          expires_at,
          invited_by
        )

        values (
          ${session.orgId},
          ${relationship.foster_id},
          ${fosterEmail},
          ${
            relationship.full_name ??
            null
          },
          ${tokenHash},
          now() +
            interval '14 days',
          ${session.id}
        )

        returning
          id,
          status,
          created_at,
          expires_at
      `;

    const origin =
      new URL(
        req.url
      ).origin;

    const inviteUrl =
      `${origin}/foster/accept?token=${encodeURIComponent(
        token
      )}`;

    return NextResponse.json({
      invitation:
        invitationRows[0],
      inviteUrl,
    });
  } catch (err) {
    console.error(
      "PUT /api/fosters/invitations failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't create a new foster invitation link.",
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
    const session =
      await requireOrganizationSession();

    if (!session) {
      return NextResponse.json(
        {
          error:
            "Organization access required.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await req.json();

    const relationshipId =
      typeof body?.relationshipId ===
        "string"
        ? body.relationshipId.trim()
        : "";

    const action =
      typeof body?.action ===
        "string"
        ? body.action.trim()
        : "";

    if (!relationshipId) {
      return NextResponse.json(
        {
          error:
            "Foster relationship is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      action !== "approve" &&
      action !== "decline"
    ) {
      return NextResponse.json(
        {
          error:
            "Action must be approve or decline.",
        },
        {
          status: 400,
        }
      );
    }

    const nextStatus =
      action === "approve"
        ? "approved"
        : "declined";

    const rows =
      await sql`
        update foster_organization_relationships

        set
          status =
            ${nextStatus},

          approved_at =
            case
              when ${nextStatus} =
                'approved'
                then now()
              else null
            end,

          approved_by =
            case
              when ${nextStatus} =
                'approved'
                then ${session.id}::uuid
              else null
            end,

          inactive_at =
            case
              when ${nextStatus} =
                'declined'
                then now()
              else null
            end,

          updated_at =
            now()

        where
          id =
            ${relationshipId}

          and organization_id =
            ${session.orgId}

          and status =
            'pending'

        returning
          id,
          foster_id,
          status,
          approved_at,
          inactive_at,
          updated_at
      `;

    if (!rows[0]) {
      return NextResponse.json(
        {
          error:
            "Pending foster relationship was not found for this organization.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      relationship:
        rows[0],
    });
  } catch (err) {
    console.error(
      "PATCH /api/fosters/invitations failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't update foster relationship.",
      },
      {
        status: 500,
      }
    );
  }
}
