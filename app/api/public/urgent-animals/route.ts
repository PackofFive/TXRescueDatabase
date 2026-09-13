import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const organizationId = new URL(request.url).searchParams.get("organizationId")?.trim() || null;
    const rows = await sql`
      select
        animal.id,
        coalesce(nullif(animal.public_name, ''), nullif(animal.name, ''), nullif(animal.temporary_name, '')) as name,
        coalesce(nullif(animal.public_species, ''), nullif(animal.species, '')) as species,
        coalesce(nullif(animal.public_breed_or_type, ''), nullif(animal.breed_or_type, '')) as breed_or_type,
        animal.urgency,
        animal.public_summary,
        animal.public_need,
        animal.external_listing_url,
        animal.primary_photo_document_id,
        animal.created_at,
        organization.id as organization_id,
        organization.name as organization_name,
        organization.city as organization_city,
        organization.county as organization_county,
        organization.state as organization_state
      from animals animal
      join organizations organization on organization.id = animal.current_org_id
      where organization.archived_at is null
        and animal.public_share_enabled is true
        and animal.urgency in ('urgent', 'critical')
        and coalesce(animal.outcome_status, '') = ''
        and (
          organization.org_type in ('Shelter', 'Municipal Shelter', 'Private Shelter', 'Animal Control')
          or lower(coalesce(organization.org_type, '')) like '%shelter%'
          or lower(coalesce(organization.org_type, '')) like '%animal control%'
        )
        and (${organizationId}::text is null or organization.id = ${organizationId}::uuid)
      order by case when animal.urgency = 'critical' then 0 else 1 end, animal.created_at desc
    `;

    return NextResponse.json({
      animals: rows.map((row) => ({
        ...row,
        photo_url: row.primary_photo_document_id
          ? `/api/public/animals/${encodeURIComponent(String(row.id))}/photo`
          : null,
      })),
    }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
  } catch (error) {
    console.error("GET public urgent shelter animals failed:", error);
    return NextResponse.json({ error: "Urgent shelter animals could not be loaded." }, { status: 500 });
  }
}
