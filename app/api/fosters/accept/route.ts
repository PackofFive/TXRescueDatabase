import {
  NextRequest,
  NextResponse,
} from "next/server";

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

async function findInvitation(
  token: string
) {
  const tokenHash =
    await sha256(
      token
    );

  const rows =
    await sql`
      select
        fi.id,
        fi.organization_id,
        fi.foster_id,
        fi.invited_email,
        fi.invited_name,
        fi.status,
        fi.expires_at,
        fi.created_at,

        o.name as organization_name,

        fp.full_name,
        fp.email,
        fp.phone,
        fp.city,
        fp.state

      from foster_invitations fi

      join organizations o
        on o.id =
          fi.organization_id

      left join foster_profiles fp
        on fp.id =
          fi.foster_id

      where
        fi.token_hash =
          ${tokenHash}

      limit 1
    `;

  return rows[0] ?? null;
}

export async function GET(
  req: NextRequest
) {
  try {
    const token =
      req.nextUrl.searchParams.get(
        "token"
      )?.trim();

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Invitation token is missing.",
        },
        {
          status: 400,
        }
      );
    }

    const invitation =
      await findInvitation(
        token
      );

    if (!invitation) {
      return NextResponse.json(
        {
          error:
            "This foster invitation is not valid.",
        },
        {
          status: 404,
        }
      );
    }

    const expired =
      new Date(
        String(
          invitation.expires_at
        )
      ).getTime() <=
      Date.now();

    if (
      invitation.status !==
        "pending"
    ) {
      return NextResponse.json(
        {
          error:
            invitation.status ===
              "accepted"
              ? "This invitation has already been accepted."
              : "This invitation is no longer available.",
        },
        {
          status: 409,
        }
      );
    }

    if (expired) {
      await sql`
        update foster_invitations
        set status =
          'expired'
        where id =
          ${invitation.id}
          and status =
            'pending'
      `;

      return NextResponse.json(
        {
          error:
            "This invitation has expired. Ask the rescue or shelter to send a new invitation.",
        },
        {
          status: 410,
        }
      );
    }

    return NextResponse.json({
      invitation: {
        organizationName:
          invitation.organization_name,

        invitedEmail:
          invitation.invited_email,

        invitedName:
          invitation.invited_name,

        fullName:
          invitation.full_name,

        phone:
          invitation.phone,

        city:
          invitation.city,

        state:
          invitation.state ??
          "TX",

        expiresAt:
          invitation.expires_at,
      },
    });
  } catch (err) {
    console.error(
      "GET /api/fosters/accept failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load foster invitation.",
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
    const body =
      await req.json();

    const token =
      typeof body?.token ===
        "string"
        ? body.token.trim()
        : "";

    const fullName =
      typeof body?.fullName ===
        "string"
        ? body.fullName.trim()
        : "";

    const phone =
      typeof body?.phone ===
        "string"
        ? body.phone.trim()
        : "";

    const city =
      typeof body?.city ===
        "string"
        ? body.city.trim()
        : "";

    const state =
      typeof body?.state ===
        "string" &&
      body.state.trim()
        ? body.state
            .trim()
            .toUpperCase()
        : "TX";

    const availabilityStatus =
      typeof body?.availabilityStatus ===
        "string"
        ? body.availabilityStatus
        : "available";

    const transportAvailable =
      Boolean(
        body?.transportAvailable
      );

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Invitation token is missing.",
        },
        {
          status: 400,
        }
      );
    }

    if (!fullName) {
      return NextResponse.json(
        {
          error:
            "Your name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      ![
        "available",
        "limited",
        "full",
        "unavailable",
      ].includes(
        availabilityStatus
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid availability status.",
        },
        {
          status: 400,
        }
      );
    }

    const invitation =
      await findInvitation(
        token
      );

    if (!invitation) {
      return NextResponse.json(
        {
          error:
            "This foster invitation is not valid.",
        },
        {
          status: 404,
        }
      );
    }

    const expired =
      new Date(
        String(
          invitation.expires_at
        )
      ).getTime() <=
      Date.now();

    if (
      invitation.status !==
        "pending"
    ) {
      return NextResponse.json(
        {
          error:
            invitation.status ===
              "accepted"
              ? "This invitation has already been accepted."
              : "This invitation is no longer available.",
        },
        {
          status: 409,
        }
      );
    }

    if (expired) {
      await sql`
        update foster_invitations
        set status =
          'expired'
        where id =
          ${invitation.id}
      `;

      return NextResponse.json(
        {
          error:
            "This invitation has expired.",
        },
        {
          status: 410,
        }
      );
    }

    let fosterId =
      invitation.foster_id
        ? String(
            invitation.foster_id
          )
        : null;

    if (!fosterId) {
      const fosterRows =
        await sql`
          insert into foster_profiles (
            full_name,
            email,
            phone,
            city,
            state,
            availability_status,
            transport_available
          )

          values (
            ${fullName},
            ${String(
              invitation.invited_email
            ).toLowerCase()},
            ${
              phone ||
              null
            },
            ${
              city ||
              null
            },
            ${state},
            ${availabilityStatus},
            ${transportAvailable}
          )

          returning id
        `;

      fosterId =
        String(
          fosterRows[0].id
        );

      await sql`
        update foster_invitations

        set foster_id =
          ${fosterId}

        where id =
          ${invitation.id}
      `;
    } else {
      await sql`
        update foster_profiles

        set
          full_name =
            ${fullName},

          email =
            ${String(
              invitation.invited_email
            ).toLowerCase()},

          phone =
            ${
              phone ||
              null
            },

          city =
            ${
              city ||
              null
            },

          state =
            ${state},

          availability_status =
            ${availabilityStatus},

          transport_available =
            ${transportAvailable}

        where id =
          ${fosterId}
      `;
    }

    await sql`
      insert into foster_organization_relationships (
        foster_id,
        organization_id,
        status
      )

      values (
        ${fosterId},
        ${invitation.organization_id},
        'pending'
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
              then 'approved'
            else 'pending'
          end,
        updated_at =
          now()
    `;

    await sql`
      update foster_invitations

      set
        status =
          'accepted',
        accepted_at =
          now()

      where id =
        ${invitation.id}
    `;

    return NextResponse.json({
      success: true,

      fosterId,

      organizationName:
        invitation.organization_name,

      relationshipStatus:
        "pending",
    });
  } catch (err) {
    console.error(
      "POST /api/fosters/accept failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't accept foster invitation.",
      },
      {
        status: 500,
      }
    );
  }
}
