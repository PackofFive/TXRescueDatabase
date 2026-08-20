import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();

  if (!session || session.status !== "approved") {
    return NextResponse.json(
      { user: null },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    {
      user: {
        id: session.id,
        email: session.email,
        role: session.role,
        orgId: session.orgId,
        status: session.status,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
