import { NextResponse } from "next/server";

import { AuthError, requireEffectiveOrg } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    verifySameOrigin(request);
    const { session, orgId } = await requireEffectiveOrg();
    const body = (await request.json()) as { jobId?: string; reason?: string };

    if (!body.jobId || !isUuid(body.jobId)) {
      return NextResponse.json(
        { error: "A valid import reference is required." },
        { status: 400 }
      );
    }

    const reason = body.reason?.trim() ?? "";
    if (reason.length < 10 || reason.length > 500) {
      return NextResponse.json(
        { error: "Enter a rollback reason between 10 and 500 characters." },
        { status: 400 }
      );
    }

    const rows = await sql`
      select pof_rollback_rescue_workbook_import(
        ${body.jobId}::uuid,
        ${session.id}::uuid,
        ${orgId}::uuid,
        ${reason}::text,
        true
      ) as result
    `;

    const result = rows[0]?.result as {
      ok?: boolean;
      revertedCreates?: number;
      revertedUpdates?: number;
      rolledBackAt?: string;
    } | undefined;

    if (!result?.ok) {
      return NextResponse.json(
        { error: "Rollback did not return a successful result." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      result: {
        ok: true,
        revertedCreates: Number(result.revertedCreates ?? 0),
        revertedUpdates: Number(result.revertedUpdates ?? 0),
        rolledBackAt: result.rolledBackAt ?? new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof RequestSecurityError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error("POST import rollback failed; no partial rollback kept:", error);
    return NextResponse.json(
      {
        error:
          "Rollback stopped safely. No partial rollback was kept; a record may have changed after the import or the rollback window may have expired.",
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
