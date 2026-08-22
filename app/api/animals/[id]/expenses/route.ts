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

type ExpenseStatus =
  | "organization_paid"
  | "reimbursed"
  | "donor_paid"
  | "grant_paid"
  | "pending_reimbursement"
  | "other";

const VALID_PAYMENT_STATUSES: ExpenseStatus[] = [
  "organization_paid",
  "reimbursed",
  "donor_paid",
  "grant_paid",
  "pending_reimbursement",
  "other",
];

/* =========================================================
   ACCESS
========================================================= */

async function requireAnimalAccess(
  animalId: string
) {
  const {
    session,
    orgId,
  } =
    await requireEffectiveOrg();

  const rows = await sql`
    select id
    from animals
    where
      id = ${animalId}
      and current_org_id = ${orgId}
    limit 1
  `;

  if (!rows[0]) {
    throw new AuthError(
      "Animal not found or you do not have access to this record.",
      404
    );
  }

  return {
    session,
    orgId,
  };
}

/* =========================================================
   GET EXPENSES + SUMMARY
========================================================= */

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const {
      id: animalId,
    } = await params;

    const {
      orgId,
    } =
      await requireAnimalAccess(
        animalId
      );

    const rows =
      await sql`
        select
          ae.id,
          ae.animal_id,
          ae.org_id,
          ae.expense_date,
          ae.category,
          ae.description,
          ae.vendor,
          ae.amount,
          ae.payment_status,
          ae.reimbursement_amount,
          ae.notes,
          ae.recorded_by,
          ae.created_at,
          ae.updated_at,

          u.email as recorded_by_email

        from animal_expenses ae

        left join users u
          on u.id = ae.recorded_by

        where
          ae.animal_id = ${animalId}
          and ae.org_id = ${orgId}

        order by
          ae.expense_date desc,
          ae.created_at desc
      `;

    const summaryRows =
      await sql`
        select

          coalesce(
            sum(amount),
            0
          ) as total_expenses,

          coalesce(
            sum(
              case
                when payment_status =
                  'organization_paid'
                then amount
                else 0
              end
            ),
            0
          ) as organization_paid,

          coalesce(
            sum(
              case
                when payment_status =
                  'pending_reimbursement'
                then amount
                else 0
              end
            ),
            0
          ) as pending_reimbursement,

          coalesce(
            sum(
              case
                when payment_status in (
                  'reimbursed',
                  'donor_paid',
                  'grant_paid'
                )
                then amount
                else 0
              end
            ),
            0
          ) as externally_covered,

          coalesce(
            sum(
              case
                when date_trunc(
                  'month',
                  expense_date::timestamp
                ) =
                date_trunc(
                  'month',
                  now()
                )
                then amount
                else 0
              end
            ),
            0
          ) as this_month

        from animal_expenses

        where
          animal_id = ${animalId}
          and org_id = ${orgId}
      `;

    const categoryRows =
      await sql`
        select
          category,

          count(*)::int
            as expense_count,

          coalesce(
            sum(amount),
            0
          ) as total

        from animal_expenses

        where
          animal_id = ${animalId}
          and org_id = ${orgId}

        group by
          category

        order by
          total desc
      `;

    const summary =
      summaryRows[0] ?? {
        total_expenses: 0,
        organization_paid: 0,
        pending_reimbursement: 0,
        externally_covered: 0,
        this_month: 0,
      };

    return NextResponse.json({
      expenses:
        rows ?? [],

      summary: {
        totalExpenses:
          Number(
            summary.total_expenses ??
              0
          ),

        organizationPaid:
          Number(
            summary.organization_paid ??
              0
          ),

        pendingReimbursement:
          Number(
            summary.pending_reimbursement ??
              0
          ),

        externallyCovered:
          Number(
            summary.externally_covered ??
              0
          ),

        thisMonth:
          Number(
            summary.this_month ??
              0
          ),
      },

      categories:
        categoryRows.map(
          (row) => ({
            category:
              row.category,

            expenseCount:
              Number(
                row.expense_count ??
                  0
              ),

            total:
              Number(
                row.total ??
                  0
              ),
          })
        ),
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
      "GET animal expenses failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't load animal expenses.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST EXPENSE
========================================================= */

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const {
      id: animalId,
    } = await params;

    const {
      session,
      orgId,
    } =
      await requireAnimalAccess(
        animalId
      );

    const body =
      await req
        .json()
        .catch(() => null);

    if (!body) {
      return NextResponse.json(
        {
          error:
            "Request body is required.",
        },
        {
          status: 400,
        }
      );
    }

    const category =
      cleanText(
        body.category
      );

    if (!category) {
      return NextResponse.json(
        {
          error:
            "Expense category is required.",
        },
        {
          status: 400,
        }
      );
    }

    const amount =
      parseAmount(
        body.amount
      );

    if (amount === null) {
      return NextResponse.json(
        {
          error:
            "Expense amount must be a valid number of 0 or more.",
        },
        {
          status: 400,
        }
      );
    }

    const expenseDate =
      parseDate(
        body.expenseDate
      );

    if (
      body.expenseDate &&
      !expenseDate
    ) {
      return NextResponse.json(
        {
          error:
            "Expense date is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    const description =
      cleanText(
        body.description
      );

    const vendor =
      cleanText(
        body.vendor
      );

    const notes =
      cleanText(
        body.notes
      );

    const paymentStatus =
      normalizePaymentStatus(
        body.paymentStatus
      );

    if (!paymentStatus) {
      return NextResponse.json(
        {
          error:
            "Payment status is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    let reimbursementAmount:
      | number
      | null =
      null;

    if (
      body.reimbursementAmount !==
        undefined &&
      body.reimbursementAmount !==
        null &&
      body.reimbursementAmount !==
        ""
    ) {
      reimbursementAmount =
        parseAmount(
          body.reimbursementAmount
        );

      if (
        reimbursementAmount ===
        null
      ) {
        return NextResponse.json(
          {
            error:
              "Reimbursement amount must be a valid number of 0 or more.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        reimbursementAmount >
        amount
      ) {
        return NextResponse.json(
          {
            error:
              "Reimbursement amount cannot be greater than the expense amount.",
          },
          {
            status: 400,
          }
        );
      }
    }

    const rows =
      await sql`
        insert into animal_expenses (
          animal_id,
          org_id,
          expense_date,
          category,
          description,
          vendor,
          amount,
          payment_status,
          reimbursement_amount,
          notes,
          recorded_by
        )

        values (
          ${animalId},
          ${orgId},
          ${
            expenseDate ??
            currentDate()
          }::date,
          ${category},
          ${description},
          ${vendor},
          ${amount},
          ${paymentStatus},
          ${reimbursementAmount},
          ${notes},
          ${session.id}
        )

        returning
          id,
          animal_id,
          org_id,
          expense_date,
          category,
          description,
          vendor,
          amount,
          payment_status,
          reimbursement_amount,
          notes,
          recorded_by,
          created_at,
          updated_at
      `;

    try {
      await sql`
        insert into audit_log (
          entity_type,
          entity_id,
          changed_by,
          field_name,
          new_value
        )

        values (
          'animal',
          ${animalId},
          ${session.id},
          'expense_added',
          ${JSON.stringify({
            expenseId:
              rows[0].id,

            category,

            amount,

            paymentStatus,
          })}
        )
      `;
    } catch (
      auditError
    ) {
      console.error(
        "Expense audit failed:",
        auditError
      );
    }

    return NextResponse.json(
      {
        expense:
          rows[0],
      },
      {
        status: 201,
      }
    );
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
      "POST animal expense failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't save animal expense.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH EXPENSE
========================================================= */

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const {
      id: animalId,
    } = await params;

    const {
      session,
      orgId,
    } =
      await requireAnimalAccess(
        animalId
      );

    const body =
      await req
        .json()
        .catch(() => null);

    if (!body) {
      return NextResponse.json(
        {
          error:
            "Request body is required.",
        },
        {
          status: 400,
        }
      );
    }

    const expenseId =
      cleanText(
        body.expenseId
      );

    if (!expenseId) {
      return NextResponse.json(
        {
          error:
            "Expense ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const currentRows =
      await sql`
        select *

        from animal_expenses

        where
          id = ${expenseId}
          and animal_id = ${animalId}
          and org_id = ${orgId}

        limit 1
      `;

    const current =
      currentRows[0];

    if (!current) {
      return NextResponse.json(
        {
          error:
            "Expense not found.",
        },
        {
          status: 404,
        }
      );
    }

    const category =
      body.category ===
      undefined
        ? current.category
        : cleanText(
            body.category
          );

    if (!category) {
      return NextResponse.json(
        {
          error:
            "Expense category is required.",
        },
        {
          status: 400,
        }
      );
    }

    let amount =
      Number(
        current.amount
      );

    if (
      body.amount !==
      undefined
    ) {
      const parsed =
        parseAmount(
          body.amount
        );

      if (
        parsed === null
      ) {
        return NextResponse.json(
          {
            error:
              "Expense amount must be a valid number of 0 or more.",
          },
          {
            status: 400,
          }
        );
      }

      amount =
        parsed;
    }

    let expenseDate =
      String(
        current.expense_date
      ).slice(0, 10);

    if (
      body.expenseDate !==
      undefined
    ) {
      const parsed =
        parseDate(
          body.expenseDate
        );

      if (!parsed) {
        return NextResponse.json(
          {
            error:
              "Expense date is invalid.",
          },
          {
            status: 400,
          }
        );
      }

      expenseDate =
        parsed;
    }

    const description =
      body.description ===
      undefined
        ? current.description
        : cleanText(
            body.description
          );

    const vendor =
      body.vendor ===
      undefined
        ? current.vendor
        : cleanText(
            body.vendor
          );

    const notes =
      body.notes ===
      undefined
        ? current.notes
        : cleanText(
            body.notes
          );

    const paymentStatus =
      body.paymentStatus ===
      undefined
        ? normalizePaymentStatus(
            current.payment_status
          )
        : normalizePaymentStatus(
            body.paymentStatus
          );

    if (!paymentStatus) {
      return NextResponse.json(
        {
          error:
            "Payment status is invalid.",
        },
        {
          status: 400,
        }
      );
    }

    let reimbursementAmount:
      | number
      | null =
      current.reimbursement_amount !=
      null
        ? Number(
            current.reimbursement_amount
          )
        : null;

    if (
      body.reimbursementAmount !==
      undefined
    ) {
      if (
        body.reimbursementAmount ===
          null ||
        body.reimbursementAmount ===
          ""
      ) {
        reimbursementAmount =
          null;
      } else {
        reimbursementAmount =
          parseAmount(
            body.reimbursementAmount
          );

        if (
          reimbursementAmount ===
          null
        ) {
          return NextResponse.json(
            {
              error:
                "Reimbursement amount must be a valid number of 0 or more.",
            },
            {
              status: 400,
            }
          );
        }
      }
    }

    if (
      reimbursementAmount !==
        null &&
      reimbursementAmount >
        amount
    ) {
      return NextResponse.json(
        {
          error:
            "Reimbursement amount cannot be greater than the expense amount.",
        },
        {
          status: 400,
        }
      );
    }

    const rows =
      await sql`
        update animal_expenses

        set
          expense_date =
            ${expenseDate}::date,

          category =
            ${category},

          description =
            ${description},

          vendor =
            ${vendor},

          amount =
            ${amount},

          payment_status =
            ${paymentStatus},

          reimbursement_amount =
            ${reimbursementAmount},

          notes =
            ${notes},

          updated_at =
            now()

        where
          id = ${expenseId}
          and animal_id = ${animalId}
          and org_id = ${orgId}

        returning
          id,
          animal_id,
          org_id,
          expense_date,
          category,
          description,
          vendor,
          amount,
          payment_status,
          reimbursement_amount,
          notes,
          recorded_by,
          created_at,
          updated_at
      `;

    try {
      await sql`
        insert into audit_log (
          entity_type,
          entity_id,
          changed_by,
          field_name,
          new_value
        )

        values (
          'animal',
          ${animalId},
          ${session.id},
          'expense_updated',
          ${JSON.stringify({
            expenseId,
            category,
            amount,
            paymentStatus,
          })}
        )
      `;
    } catch (
      auditError
    ) {
      console.error(
        "Expense update audit failed:",
        auditError
      );
    }

    return NextResponse.json({
      expense:
        rows[0],
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
      "PATCH animal expense failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't update animal expense.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE EXPENSE

   We allow deletion because financial-entry mistakes can
   happen, but every deletion is written to the audit log.
========================================================= */

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const {
      id: animalId,
    } = await params;

    const {
      session,
      orgId,
    } =
      await requireAnimalAccess(
        animalId
      );

    const body =
      await req
        .json()
        .catch(() => null);

    const expenseId =
      cleanText(
        body?.expenseId
      );

    if (!expenseId) {
      return NextResponse.json(
        {
          error:
            "Expense ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const rows =
      await sql`
        delete from animal_expenses

        where
          id = ${expenseId}
          and animal_id = ${animalId}
          and org_id = ${orgId}

        returning
          id,
          category,
          amount,
          expense_date
      `;

    if (!rows[0]) {
      return NextResponse.json(
        {
          error:
            "Expense not found.",
        },
        {
          status: 404,
        }
      );
    }

    try {
      await sql`
        insert into audit_log (
          entity_type,
          entity_id,
          changed_by,
          field_name,
          new_value
        )

        values (
          'animal',
          ${animalId},
          ${session.id},
          'expense_deleted',
          ${JSON.stringify({
            expenseId:
              rows[0].id,

            category:
              rows[0].category,

            amount:
              rows[0].amount,

            expenseDate:
              rows[0].expense_date,
          })}
        )
      `;
    } catch (
      auditError
    ) {
      console.error(
        "Expense deletion audit failed:",
        auditError
      );
    }

    return NextResponse.json({
      deleted: true,
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
      "DELETE animal expense failed:",
      err
    );

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't delete animal expense.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   HELPERS
========================================================= */

function cleanText(
  value: unknown
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const text =
    String(value).trim();

  return text ||
    null;
}

function parseAmount(
  value: unknown
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const amount =
    Number(value);

  if (
    !Number.isFinite(
      amount
    ) ||
    amount < 0
  ) {
    return null;
  }

  return Math.round(
    amount * 100
  ) / 100;
}

function parseDate(
  value: unknown
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const text =
    String(value).trim();

  const date =
    new Date(
      `${text}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return text;
}

function normalizePaymentStatus(
  value: unknown
):
  | ExpenseStatus
  | null {
  const status =
    String(
      value ??
        "organization_paid"
    )
      .trim()
      .toLowerCase() as ExpenseStatus;

  return VALID_PAYMENT_STATUSES.includes(
    status
  )
    ? status
    : null;
}

function currentDate() {
  const now =
    new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(
    2,
    "0"
  )}-${String(
    now.getDate()
  ).padStart(
    2,
    "0"
  )}`;
}
