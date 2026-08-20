import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin, AuthError } from "@/lib/auth";

export const runtime = "edge";

// Public directory read.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const region = searchParams.get("region");
  const species = searchParams.get("species");

  const rows = await sql`
    select o.*, c.*,
      exists(
        select 1 from users u
        where u.org_id = o.id and u.status = 'approved' and u.role = 'org'
      ) as is_claimed,
      (
        select max(ul.created_at) from update_log ul
        where ul.org_id = o.id and ul.source = 'org_submission'
      ) as last_org_update
    from organizations o
    left join capabilities c on c.org_id = o.id
    where
      (${q}::text is null or o.name ilike '%' || ${q} || '%' or o.city ilike '%' || ${q} || '%' or o.county ilike '%' || ${q} || '%')
      and (${region}::text is null or o.region = ${region})
      and (${species}::text is null or ${species} = any(o.species))
    order by o.name asc
  `;

  return NextResponse.json({ organizations: rows });
}

// Admin-only organization creation.
// Intentionally uses a small set of fields already known to exist on the
// organizations table from the current directory implementation.
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json().catch(() => null);

    const {
      name,
      city,
      county,
      region,
      species,
      website,
      email,
      phone,
      resourceStatus,
    } = body ?? {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Organization name is required." },
        { status: 400 }
      );
    }

    const duplicate = await sql`
      select id, name
      from organizations
      where lower(name) = lower(${name.trim()})
        and coalesce(lower(city), '') = coalesce(lower(${city || null}), '')
      limit 1
    `;

    if (duplicate[0]) {
      return NextResponse.json(
        {
          error: "A matching organization may already exist.",
          existingOrganization: duplicate[0],
        },
        { status: 409 }
      );
    }

    const speciesValue =
      Array.isArray(species) && species.every((s) => typeof s === "string")
        ? species
        : [];

    const rows = await sql`
      insert into organizations
        (name, city, county, region, species, website, email, phone, resource_status)
      values
        (
          ${name.trim()},
          ${city || null},
          ${county || null},
          ${region || null},
          ${speciesValue},
          ${website || null},
          ${email || null},
          ${phone || null},
          ${resourceStatus || 'Verification Needed'}
        )
      returning id, name, city, county, region, species, website, email, phone, resource_status
    `;

    const org = rows[0];

    try {
      await sql`
        insert into audit_log
          (entity_type, entity_id, changed_by, field_name, new_value)
        values
          ('organization', ${org.id}, ${admin.id}, 'created', ${JSON.stringify({
            source: "admin",
            name: org.name,
          })})
      `;
    } catch (auditErr) {
      console.error("Organization created but audit log failed:", auditErr);
    }

    return NextResponse.json({ organization: org }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    console.error("POST /api/orgs failed:", err);
    return NextResponse.json(
      { error: "Something went wrong creating the organization." },
      { status: 500 }
    );
  }
}
