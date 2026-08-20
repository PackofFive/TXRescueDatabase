import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin, AuthError } from "@/lib/auth";

export const runtime = "edge";

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

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json().catch(() => null);
    const { name, orgType, city, county, state, region, species, website, email, phone, resourceStatus } = body ?? {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Organization name is required." }, { status: 400 });
    }

    const duplicate = await sql`
      select id, name from organizations
      where lower(name) = lower(${name.trim()})
        and coalesce(lower(city), '') = coalesce(lower(${city || null}), '')
      limit 1
    `;
    if (duplicate[0]) {
      return NextResponse.json(
        { error: "A matching organization may already exist.", existingOrganization: duplicate[0] },
        { status: 409 }
      );
    }

    const speciesValue = Array.isArray(species) ? species : [];

    const rows = await sql`
      insert into organizations
        (name, org_type, city, county, state, region, species, website, public_email, public_phone, resource_status)
      values
        (${name.trim()}, ${orgType || null}, ${city || null}, ${county || null}, ${state || null},
         ${region || null}, ${speciesValue}, ${website || null}, ${email || null}, ${phone || null},
         ${resourceStatus || 'Verification Needed'})
      returning id, name, org_type, city, county, state, region, species, website, public_email, public_phone, resource_status
    `;

    const org = rows[0];

    try {
      await sql`
        insert into update_log (org_id, changed_by, field_name, old_value, new_value, source)
        values (${org.id}, ${admin.id}, 'organization_created', null, ${org.name}, 'admin_direct')
      `;
    } catch (e) {
      console.error("update_log failed after org creation:", e);
    }

    return NextResponse.json({ organization: org }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("POST /api/orgs failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong creating the organization." },
      { status: 500 }
    );
  }
}
