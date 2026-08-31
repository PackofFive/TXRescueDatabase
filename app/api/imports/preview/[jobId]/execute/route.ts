import { NextResponse } from "next/server";

import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function POST(
  request: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    verifySameOrigin(request);
    const { session, orgId } = await requireEffectiveOrg();
    const { jobId } = await context.params;
    const body = (await request.json()) as { confirmationId?: string };

    if (!isUuid(jobId) || !body.confirmationId || !isUuid(body.confirmationId)) {
      return NextResponse.json(
        { error: "A valid import approval is required." },
        { status: 400 }
      );
    }

    const rows = await sql`
      select pof_commit_rescue_workbook_import(
        ${jobId}::uuid,
        ${body.confirmationId}::uuid,
        ${session.id}::uuid,
        ${orgId}::uuid,
        true
      ) as result
    `;

    return NextResponse.json({ result: rows[0].result });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof RequestSecurityError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error("POST import execute failed; transaction rolled back:", error);
    return NextResponse.json(
      {
        error:
          "The import could not be completed. The atomic transaction was rolled back and no partial import was kept.",
      },
      { status: 409 }
    );
  }
}

class RequestSecurityError extends Error {}

function verifySameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    throw new RequestSecurityError("Request origin was not accepted.");
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
