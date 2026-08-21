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

type Priority =
  | "critical"
  | "high"
  | "normal"
  | "info";

type AlertRow = {
  id: string;
  animal_id: string;
  animal_name: string;
  alert_type: string;
  title: string;
  due_at: string | null;
  created_at: string;
  priority: Priority;
};

type Preference = {
  priority: Priority;
  enabled: boolean;
};

const DEFAULT_PREFERENCES: Record<
  string,
  Preference
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

const PRIORITY_RANK: Record<
  Priority,
  number
> = {
  critical: 1,
  high: 2,
  normal: 3,
  info: 4,
};

/* =========================================================
   PRIORITY HELPERS
========================================================= */

function moreUrgent(
  a: Priority,
  b: Priority
): Priority {
  return PRIORITY_RANK[a] <
    PRIORITY_RANK[b]
    ? a
    : b;
}

function daysUntil(
  value: string
) {
  const due =
    new Date(value);

  const now =
    new Date();

  return Math.ceil(
    (
      due.getTime() -
      now.getTime()
    ) /
      (1000 *
        60 *
        60 *
        24)
  );
}

/* =========================================================
   DASHBOARD ALERTS
========================================================= */

export async function GET(
  _req: NextRequest
) {
  try {
    const {
      orgId,
    } =
      await requireEffectiveOrg();

    /* -----------------------------------------------------
       ORGANIZATION ALERT PREFERENCES
    ----------------------------------------------------- */

    const preferenceRows =
      await sql`
        select
          alert_type,
          priority,
          enabled
        from organization_alert_preferences
        where
          org_id = ${orgId}
      `;

    const preferences: Record<
      string,
      Preference
    > = {
      ...DEFAULT_PREFERENCES,
    };

    for (
      const row of preferenceRows
    ) {
      const priority =
        String(
          row.priority
        ) as Priority;

      if (
        [
          "critical",
          "high",
          "normal",
          "info",
        ].includes(
          priority
        )
      ) {
        preferences[
          row.alert_type
        ] = {
          priority,
          enabled:
            Boolean(
              row.enabled
            ),
        };
      }
    }

    const alerts: AlertRow[] =
      [];

    /* -----------------------------------------------------
       MEDICAL RECORD REMINDERS
    ----------------------------------------------------- */

    const medicalPreference =
      preferences.medical;

    if (
      medicalPreference
        ?.enabled
    ) {
      const medicalRows =
        await sql`
          select
            amr.id,
            amr.animal_id,

            coalesce(
              a.name,
              a.temporary_name,
              'Unnamed Animal'
            ) as animal_name,

            amr.due_at,
            amr.created_at

          from animal_medical_records amr

          join animals a
            on a.id = amr.animal_id

          where
            a.current_org_id = ${orgId}

            and
            amr.due_at is not null

            and
            coalesce(
              amr.status,
              ''
            ) <> 'completed'

          order by
            amr.due_at asc
        `;

      for (
        const row of medicalRows
      ) {
        const diffDays =
          daysUntil(
            row.due_at
          );

        let automaticPriority:
          Priority =
          "normal";

        if (
          diffDays < 0
        ) {
          automaticPriority =
            "critical";
        } else if (
          diffDays <= 1
        ) {
          automaticPriority =
            "high";
        }

        alerts.push({
          id:
            `medical-${row.id}`,

          animal_id:
            row.animal_id,

          animal_name:
            row.animal_name,

          alert_type:
            "medical",

          title:
            diffDays < 0
              ? "Medical care overdue"
              : diffDays === 0
              ? "Medical care due today"
              : "Medical care due soon",

          due_at:
            row.due_at,

          created_at:
            row.created_at,

          /*
            Rescue preference establishes
            the baseline.

            Automatic urgency can escalate
            it, but never reduce it.
          */
          priority:
            moreUrgent(
              medicalPreference.priority,
              automaticPriority
            ),
        });
      }
    }

    /* -----------------------------------------------------
       MEDICATION REMINDERS
    ----------------------------------------------------- */

    const medicationPreference =
      preferences.medication;

    if (
      medicationPreference
        ?.enabled
    ) {
      const medicationRows =
        await sql`
          select
            am.id,
            am.animal_id,

            coalesce(
              a.name,
              a.temporary_name,
              'Unnamed Animal'
            ) as animal_name,

            am.next_due_at,
            am.created_at

          from animal_medications am

          join animals a
            on a.id = am.animal_id

          where
            a.current_org_id = ${orgId}

            and
            am.active = true

            and
            am.next_due_at is not null

          order by
            am.next_due_at asc
        `;

      for (
        const row of medicationRows
      ) {
        const diffDays =
          daysUntil(
            row.next_due_at
          );

        let automaticPriority:
          Priority =
          "normal";

        if (
          diffDays < 0
        ) {
          automaticPriority =
            "critical";
        } else if (
          diffDays <= 1
        ) {
          automaticPriority =
            "high";
        }

        alerts.push({
          id:
            `medication-${row.id}`,

          animal_id:
            row.animal_id,

          animal_name:
            row.animal_name,

          alert_type:
            "medication",

          title:
            diffDays < 0
              ? "Medication overdue"
              : diffDays === 0
              ? "Medication due today"
              : "Medication due soon",

          due_at:
            row.next_due_at,

          created_at:
            row.created_at,

          priority:
            moreUrgent(
              medicationPreference.priority,
              automaticPriority
            ),
        });
      }
    }

    /* -----------------------------------------------------
       FOSTER / HELP OFFERS
    ----------------------------------------------------- */

    const offerPreference =
      preferences.foster_offer;

    if (
      offerPreference
        ?.enabled
    ) {
      const offerRows =
        await sql`
          select
            aho.id,
            aho.animal_id,

            coalesce(
              a.name,
              a.temporary_name,
              'Unnamed Animal'
            ) as animal_name,

            aho.status,
            aho.created_at

          from animal_help_offers aho

          join animals a
            on a.id = aho.animal_id

          where
            a.current_org_id = ${orgId}

            and
            aho.status in (
              'new',
              'reviewing',
              'contacted'
            )

          order by
            aho.created_at desc
        `;

      for (
        const row of offerRows
      ) {
        /*
          New foster/help offers can
          automatically escalate to High.

          Reviewing/contacted use the
          organization's chosen priority.
        */

        const automaticPriority:
          Priority =
          row.status === "new"
            ? "high"
            : "info";

        alerts.push({
          id:
            `offer-${row.id}`,

          animal_id:
            row.animal_id,

          animal_name:
            row.animal_name,

          alert_type:
            "foster_offer",

          title:
            row.status === "new"
              ? "New foster/help offer"
              : row.status ===
                "reviewing"
              ? "Foster/help offer under review"
              : "Follow up on foster/help offer",

          due_at: null,

          created_at:
            row.created_at,

          priority:
            moreUrgent(
              offerPreference.priority,
              automaticPriority
            ),
        });
      }
    }

    /* -----------------------------------------------------
       SORT ALERTS
    ----------------------------------------------------- */

    alerts.sort(
      (a, b) => {
        const priorityDiff =
          PRIORITY_RANK[
            a.priority
          ] -
          PRIORITY_RANK[
            b.priority
          ];

        if (
          priorityDiff !== 0
        ) {
          return priorityDiff;
        }

        if (
          a.due_at &&
          b.due_at
        ) {
          return (
            new Date(
              a.due_at
            ).getTime() -
            new Date(
              b.due_at
            ).getTime()
          );
        }

        if (
          a.due_at &&
          !b.due_at
        ) {
          return -1;
        }

        if (
          !a.due_at &&
          b.due_at
        ) {
          return 1;
        }

        return (
          new Date(
            b.created_at
          ).getTime() -
          new Date(
            a.created_at
          ).getTime()
        );
      }
    );

    /* -----------------------------------------------------
       DASHBOARD STATS
    ----------------------------------------------------- */

    const statsRows =
      await sql`
        select

          (
            select count(*)::int
            from animals a
            where
              a.current_org_id = ${orgId}

              and
              coalesce(
                a.outcome_status,
                ''
              ) <> 'adopted'
          ) as animals_in_care,

          (
            select count(*)::int
            from animal_help_offers aho

            join animals a
              on a.id = aho.animal_id

            where
              a.current_org_id = ${orgId}

              and
              aho.status in (
                'new',
                'reviewing',
                'contacted'
              )
          ) as active_help_offers,

          (
            select count(*)::int
            from animals a

            where
              a.current_org_id = ${orgId}

              and
              a.public_share_enabled = true

              and
              coalesce(
                a.outcome_status,
                ''
              ) <> 'adopted'
          ) as published_profiles,

          (
            select count(*)::int
            from animals a

            where
              a.current_org_id = ${orgId}

              and
              a.outcome_status =
                'adopted'
          ) as adopted_animals
      `;

    const stats =
      statsRows[0] ?? {
        animals_in_care: 0,
        active_help_offers: 0,
        published_profiles: 0,
        adopted_animals: 0,
      };

    return NextResponse.json({
      alerts,
      stats,
      preferences,
    });
  } catch (err) {
    if (
      err instanceof
      AuthError
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
      "GET /api/dashboard/alerts failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load dashboard alerts.",
      },
      {
        status: 500,
      }
    );
  }
}
