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

type AlertRow = {
  id: string;
  animal_id: string;
  animal_name: string;
  alert_type: string;
  title: string;
  due_at: string | null;
  created_at: string;
  priority: "critical" | "high" | "normal" | "info";
};

/* =========================================================
   DASHBOARD ALERTS

   Current automatic alert sources:
   - overdue / upcoming medical records
   - overdue / upcoming medications
   - new / active foster-help offers

   This route is intentionally focused on actionable work.
========================================================= */

export async function GET(
  _req: NextRequest
) {
  try {
    const {
      orgId,
    } =
      await requireEffectiveOrg();

    const alerts: AlertRow[] = [];

    /* -----------------------------------------------------
       MEDICAL RECORD REMINDERS
    ----------------------------------------------------- */

    const medicalRows = await sql`
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
        and amr.due_at is not null
        and coalesce(amr.status, '') <> 'completed'
      order by
        amr.due_at asc
    `;

    for (const row of medicalRows) {
      const due =
        new Date(
          row.due_at
        );

      const now =
        new Date();

      const diffMs =
        due.getTime() -
        now.getTime();

      const diffDays =
        Math.ceil(
          diffMs /
            (1000 *
              60 *
              60 *
              24)
        );

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

        priority:
          diffDays < 0
            ? "critical"
            : diffDays <= 1
            ? "high"
            : "normal",
      });
    }

    /* -----------------------------------------------------
       MEDICATION REMINDERS
    ----------------------------------------------------- */

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
          and am.active = true
          and am.next_due_at is not null
        order by
          am.next_due_at asc
      `;

    for (const row of medicationRows) {
      const due =
        new Date(
          row.next_due_at
        );

      const now =
        new Date();

      const diffMs =
        due.getTime() -
        now.getTime();

      const diffDays =
        Math.ceil(
          diffMs /
            (1000 *
              60 *
              60 *
              24)
        );

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
          diffDays < 0
            ? "critical"
            : diffDays <= 1
            ? "high"
            : "normal",
      });
    }

    /* -----------------------------------------------------
       FOSTER / HELP OFFERS
    ----------------------------------------------------- */

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
          and aho.status in (
            'new',
            'reviewing',
            'contacted'
          )
        order by
          aho.created_at desc
      `;

    for (const row of offerRows) {
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
            : "Foster/help offer contacted",

        due_at:
          null,

        created_at:
          row.created_at,

        priority:
          row.status === "new"
            ? "high"
            : "normal",
      });
    }

    /* -----------------------------------------------------
       SORT
    ----------------------------------------------------- */

    const priorityRank = {
      critical: 1,
      high: 2,
      normal: 3,
      info: 4,
    };

    alerts.sort(
      (a, b) => {
        const priorityDiff =
          priorityRank[
            a.priority
          ] -
          priorityRank[
            b.priority
          ];

        if (
          priorityDiff !== 0
        ) {
          return priorityDiff;
        }

        const aDate =
          a.due_at
            ? new Date(
                a.due_at
              ).getTime()
            : new Date(
                a.created_at
              ).getTime();

        const bDate =
          b.due_at
            ? new Date(
                b.due_at
              ).getTime()
            : new Date(
                b.created_at
              ).getTime();

        return aDate - bDate;
      }
    );

    /* -----------------------------------------------------
       STATS
    ----------------------------------------------------- */

    const statsRows =
      await sql`
        select
          (
            select count(*)::int
            from animals a
            where
              a.current_org_id = ${orgId}
          ) as animals_in_care,

          (
            select count(*)::int
            from animal_help_offers aho
            join animals a
              on a.id = aho.animal_id
            where
              a.current_org_id = ${orgId}
              and aho.status in (
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
              and a.public_share_enabled = true
              and coalesce(
                a.outcome_status,
                ''
              ) <> 'adopted'
          ) as published_profiles,

          (
            select count(*)::int
            from animals a
            where
              a.current_org_id = ${orgId}
              and a.outcome_status = 'adopted'
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
