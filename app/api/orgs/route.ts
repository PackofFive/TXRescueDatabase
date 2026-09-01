import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  requireAdmin,
  AuthError,
} from "@/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

type LogoBucket = { get: (key: string) => Promise<{ arrayBuffer: () => Promise<ArrayBuffer>; httpMetadata?: { contentType?: string } } | null> };
type Env = { MEDICAL_FILES: LogoBucket };

/* =========================================================
   GET ORGANIZATIONS

   Public directory:
   - Archived organizations are hidden automatically.
   - Each organization includes public_animal_count.

   Admin:
   - Can request archived organizations too with:
     /api/orgs?includeArchived=true
========================================================= */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const logoOrgId = searchParams.get("logo")?.trim();
    if (logoOrgId) {
      const rows = await sql`
        select logo_storage_key, logo_content_type
        from organizations
        where id = ${logoOrgId}::uuid and archived_at is null
        limit 1
      `;
      const storageKey = rows[0]?.logo_storage_key ? String(rows[0].logo_storage_key) : "";
      if (!storageKey) return new NextResponse(null, { status: 404 });
      const env = getRequestContext().env as unknown as Env;
      const object = await env.MEDICAL_FILES?.get(storageKey);
      if (!object) return new NextResponse(null, { status: 404 });
      const contentType = String(rows[0]?.logo_content_type || object.httpMetadata?.contentType || "image/jpeg");
      return new NextResponse(await object.arrayBuffer(), {
        headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400", "X-Content-Type-Options": "nosniff" },
      });
    }

    const q =
      searchParams.get("q")?.trim() || null;

    const region =
      searchParams.get("region") || null;

    const species =
      searchParams.get("species") || null;

    const includeArchived =
      searchParams.get("includeArchived") === "true";

    /*
      Only an approved admin can request archived
      organizations.
    */

    if (includeArchived) {
      await requireAdmin();
    }

    const rows = await sql`
      select
        o.*,
        c.*,

        exists(
          select 1
          from users u
          where
            u.org_id = o.id
            and u.status = 'approved'
            and u.role = 'org'
        )
        or exists(
          select 1
          from organization_memberships membership
          where
            membership.org_id = o.id
            and membership.status = 'active'
            and membership.access_level = 'owner'
        ) as is_claimed,

        (o.logo_storage_key is not null) as has_logo,
        o.logo_updated_at,

        (
          select max(ul.created_at)
          from update_log ul
          where
            ul.org_id = o.id
            and ul.source = 'org_submission'
        ) as last_org_update,

        (
          select count(*)::int
          from animals a
          where
            a.current_org_id = o.id
            and a.public_share_enabled = true
            and coalesce(a.outcome_status, '') <> 'adopted'
        ) as public_animal_count

      from organizations o

      left join capabilities c
        on c.org_id = o.id

      where
        (
          ${includeArchived} = true
          or o.archived_at is null
        )

        and (
          ${q}::text is null
          or o.name ilike '%' || ${q} || '%'
          or o.city ilike '%' || ${q} || '%'
          or o.county ilike '%' || ${q} || '%'
        )

        and (
          ${region}::text is null
          or o.region = ${region}
        )

        and (
          ${species}::text is null
          or ${species} = any(o.species)
        )

      order by
        case
          when o.archived_at is null then 0
          else 1
        end,
        o.name asc
    `;

    const publicRows = rows.map((row) => {
      const { logo_storage_key: _privateLogoKey, logo_content_type: _privateLogoType, ...publicOrganization } = row;
      return publicOrganization;
    });

    return NextResponse.json({
      organizations: publicRows,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        {
          error: err.message,
        },
        {
          status: err.status,
        }
      );
    }

    console.error(
      "GET /api/orgs failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong loading organizations.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST ORGANIZATION

   Admin-only direct organization creation.
========================================================= */

export async function POST(
  req: NextRequest
) {
  try {
    const admin =
      await requireAdmin();

    const body = await req
      .json()
      .catch(() => null);

    const {
      name,
      orgType,
      city,
      county,
      state,
      region,
      species,
      website,
      email,
      phone,
      resourceStatus,
    } = body ?? {};

    /* -----------------------------------------------------
       NAME REQUIRED
    ----------------------------------------------------- */

    if (
      !name ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Organization name is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------------
       DUPLICATE CHECK

       Archived organizations are included deliberately.
    ----------------------------------------------------- */

    const duplicate = await sql`
      select
        id,
        name,
        city,
        archived_at
      from organizations
      where
        lower(name) = lower(${name.trim()})
        and coalesce(lower(city), '') =
            coalesce(lower(${city || null}), '')
      limit 1
    `;

    if (duplicate[0]) {
      return NextResponse.json(
        {
          error:
            duplicate[0].archived_at
              ? "A matching archived organization already exists. Restore or review that organization instead of creating a duplicate."
              : "A matching organization may already exist.",

          existingOrganization:
            duplicate[0],
        },
        {
          status: 409,
        }
      );
    }

    /* -----------------------------------------------------
       SPECIES
    ----------------------------------------------------- */

    const speciesValue =
      Array.isArray(species)
        ? species
            .map((s) =>
              String(s).trim()
            )
            .filter(Boolean)
        : [];

    /* -----------------------------------------------------
       CREATE ORGANIZATION
    ----------------------------------------------------- */

    const rows = await sql`
      insert into organizations (
        name,
        org_type,
        city,
        county,
        state,
        region,
        species,
        website,
        public_email,
        public_phone,
        resource_status
      )

      values (
        ${name.trim()},
        ${orgType || null},
        ${city || null},
        ${county || null},
        ${state || null},
        ${region || null},
        ${speciesValue},
        ${website || null},
        ${email || null},
        ${phone || null},
        ${
          resourceStatus ||
          "Verification Needed"
        }
      )

      returning
        id,
        name,
        org_type,
        city,
        county,
        state,
        region,
        species,
        website,
        public_email,
        public_phone,
        resource_status,
        archived_at
    `;

    const org = rows[0];

    /* -----------------------------------------------------
       UPDATE LOG
    ----------------------------------------------------- */

    try {
      await sql`
        insert into update_log (
          org_id,
          changed_by,
          field_name,
          old_value,
          new_value,
          source
        )

        values (
          ${org.id},
          ${admin.id},
          'organization_created',
          null,
          ${org.name},
          'admin_direct'
        )
      `;
    } catch (logErr) {
      console.error(
        "update_log failed after organization creation:",
        logErr
      );
    }

    return NextResponse.json(
      {
        organization: org,
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        {
          error: err.message,
        },
        {
          status: err.status,
        }
      );
    }

    console.error(
      "POST /api/orgs failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Something went wrong creating the organization.",
      },
      {
        status: 500,
      }
    );
  }
}
