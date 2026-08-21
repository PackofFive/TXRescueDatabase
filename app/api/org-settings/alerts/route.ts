import {
  NextRequest,
  NextResponse,
} from "next/server";

import { sql } from "@/lib/db";

import {
  requireEffectiveOrg,
  AuthError,
} from "@/lib/auth";

export const runtime = "edge";

/* =========================================================
   ALERT TYPES

   These are the alert categories currently supported by
   the dashboard.

   More can be added later without redesigning the system.
========================================================= */

const ALERT_TYPES = [
  "medical",
  "medication",
  "foster_offer",
];

const PRIORITIES = [
  "critical",
  "high",
  "normal",
  "info",
];

const DEFAULTS: Record<
  string,
  {
    priority: string;
    enabled: boolean;
  }
> = {
  medical: {
    priority: "high",
    enabled: true,
  },

  medication: {
    priority: "critical",
    enabled: true,
  },

  foster_offer: {
    priority: "high",
    enabled: true,
  },
};

/* =========================================================
   GET ALERT PREFERENCES
========================================================= */

export async function GET() {
  try {
    const {
      orgId,
    } =
      await requireEffectiveOrg();

    const rows = await sql`
      select
        alert_type,
        priority,
        enabled
      from organization_alert_preferences
      where
        org_id = ${orgId}
    `;

    const stored =
      new Map<
        string,
        {
          priority: string;
          enabled: boolean;
        }
      >();

    for (const row of rows) {
      stored.set(
        row.alert_type,
        {
          priority:
            row.priority,

          enabled:
            row.enabled,
        }
      );
    }

    const preferences =
      ALERT_TYPES.map(
        (alertType) => {
          const saved =
            stored.get(
              alertType
            );

          return {
            alertType,

            priority:
              saved?.priority ??
              DEFAULTS[
                alertType
              ].priority,

            enabled:
              saved?.enabled ??
              DEFAULTS[
                alertType
              ].enabled,
          };
        }
      );

    return NextResponse.json({
      preferences,
    });
  } catch (err) {
    if (
      err instanceof AuthError
    ) {
      return NextResponse.json(
        {
          error:
            err.message,
        },
        {
          status:
            err.status,
        }
      );
    }

    console.error(
      "GET /api/org-settings/alerts failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load alert preferences.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH ALERT PREFERENCES

   Body:

   {
     preferences: [
       {
         alertType: "foster_offer",
         priority: "critical",
         enabled: true
       }
     ]
   }
========================================================= */

export async function PATCH(
  req: NextRequest
) {
  try {
    const {
      orgId,
    } =
      await requireEffectiveOrg();

    const body =
      await req
        .json()
        .catch(
          () => null
        );

    const preferences =
      body?.preferences;

    if (
      !Array.isArray(
        preferences
      )
    ) {
      return NextResponse.json(
        {
          error:
            "preferences must be an array.",
        },
        {
          status: 400,
        }
      );
    }

    for (
      const preference of
        preferences
    ) {
      const alertType =
        preference?.alertType;

      const priority =
        preference?.priority;

      const enabled =
        preference?.enabled;

      if (
        !ALERT_TYPES.includes(
          alertType
        )
      ) {
        return NextResponse.json(
          {
            error:
              `Unknown alert type: ${alertType}`,
          },
          {
            status: 400,
          }
        );
      }

      if (
        !PRIORITIES.includes(
          priority
        )
      ) {
        return NextResponse.json(
          {
            error:
              `Invalid priority for ${alertType}.`,
          },
          {
            status: 400,
          }
        );
      }

      if (
        typeof enabled !==
        "boolean"
      ) {
        return NextResponse.json(
          {
            error:
              `enabled must be true or false for ${alertType}.`,
          },
          {
            status: 400,
          }
        );
      }

      await sql`
        insert into organization_alert_preferences (
          org_id,
          alert_type,
          priority,
          enabled
        )

        values (
          ${orgId},
          ${alertType},
          ${priority},
          ${enabled}
        )

        on conflict (
          org_id,
          alert_type
        )

        do update set
          priority =
            excluded.priority,

          enabled =
            excluded.enabled,

          updated_at =
            now()
      `;
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (err) {
    if (
      err instanceof AuthError
    ) {
      return NextResponse.json(
        {
          error:
            err.message,
        },
        {
          status:
            err.status,
        }
      );
    }

    console.error(
      "PATCH /api/org-settings/alerts failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't save alert preferences.",
      },
      {
        status: 500,
      }
    );
  }
}
