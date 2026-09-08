import { NextRequest, NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/auth";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    void req;
    void user;
    return NextResponse.json(
      { error: "Organization switching is not available. Each login may manage one organization." },
      { status: 409 }
    );
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "The organization could not be selected." }, { status: 500 });
  }
}
