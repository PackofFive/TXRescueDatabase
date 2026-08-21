import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await sql`
      select
        a.id, a.name, a.temporary_name, a.species, a.breed_or_type,
        a.birth_date, a.sex, a.public_summary, a.public_need,
        a.external_listing_url,
        o.name as organization_name, o.city as organization_city, o.state as organization_state,
        (select m.url from media m
          where m.owner_type='animal' and m.owner_id=a.id
          order by m.created_at desc limit 1) as photo_url
      from animals a
      join organizations o on o.id = a.current_org_id
      where a.id = ${id}
        and a.public_share_enabled = true
        and o.archived_at is null
      limit 1
    `;
    if (!rows[0]) return NextResponse.json({ error: "Public animal profile not found." }, { status: 404 });
    return NextResponse.json({ animal: rows[0] });
  } catch (err) {
    console.error("GET public animal failed:", err);
    return NextResponse.json({ error: "Couldn't load public animal profile." }, { status: 500 });
  }
}
