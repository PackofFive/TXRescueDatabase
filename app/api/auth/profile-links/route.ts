import { NextRequest, NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => null);
    const profileId = typeof body?.profileId === "string" ? body.profileId : "";
    const profileType = body?.profileType;
    if (!profileId || !["foster", "volunteer"].includes(profileType)) {
      return NextResponse.json({ error: "Choose a valid profile to connect." }, { status: 400 });
    }

    const rows = profileType === "foster"
      ? await sql`
          update foster_profiles
          set user_id = ${user.id}::uuid, updated_at = now()
          where id = ${profileId}::uuid
            and user_id is null
            and lower(email) = lower(${user.email})
          returning id
        `
      : await sql`
          update volunteer_profiles
          set user_id = ${user.id}::uuid, updated_at = now()
          where id = ${profileId}::uuid
            and user_id is null
            and lower(email) = lower(${user.email})
          returning id
        `;

    if (!rows[0]) {
      return NextResponse.json({ error: "That profile is no longer available to connect." }, { status: 409 });
    }
    return NextResponse.json({ message: "The profile is now connected to your Pack of Five account." });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "The profile could not be connected." }, { status: 500 });
  }
}
