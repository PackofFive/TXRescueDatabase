"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

type PaymentStatus =
  | "organization_paid"
  | "reimbursed"
  | "donor_paid"
  | "grant_paid"
  | "pending_reimbursement"
  | "other";

type Expense = {
  id: string;
  animal_id: string;
  org_id: string;

  expense_date: string;

  category: string;

  description:
    | string
    | null;

  vendor:
    | string
    | null;

  amount:
    | number
    | string;

  payment_status:
    PaymentStatus;

  reimbursement_amount:
    | number
    | string
    | null;

  notes:
    | string
    | null;

  recorded_by:
    | string
    | null;

  recorded_by_email:
    | string
    | null;

  created_at: string;
  updated_at: string;
};

type ExpenseSummary = {
  totalExpenses: number;
  organizationPaid: number;
  pendingReimbursement: number;
  externallyCovered: number;
  thisMonth: number;
};

type CategorySummary = {
  category: string;
  expenseCount: number;
  total: number;
};

type ExpenseDraft = {
  expenseDate: string;
  category: string;
  description: string;
  vendor: string;
  amount: string;
  paymentStatus: PaymentStatus;
  reimbursementAmount: string;
  notes: string;
};

const EXPENSE_CATEGORIES = [
  {
    value: "veterinary",
    label: "Veterinary",
  },
  {
    value: "medication",
    label: "Medication",
  },
  {
    value: "food",
    label: "Food",
  },
  {
    value: "supplies",
    label: "Supplies",
  },
  {
    value: "boarding",
    label: "Boarding",
  },
  {
    value: "transport",
    label: "Transport",
  },
  {
    value: "grooming",
    label: "Grooming",
  },
  {
    value: "training_behavior",
    label: "Training / Behavior",
  },
  {
    value: "adoption_event",
    label: "Adoption / Event",
  },
  {
    value: "other",
    label: "Other",
  },
];

const PAYMENT_STATUSES: {
  value: PaymentStatus;
  label: string;
}[] = [
  {
    value: "organization_paid",
    label: "Organization Paid",
  },
  {
    value: "pending_reimbursement",
    label: "Pending Reimbursement",
  },
  {
    value: "reimbursed",
    label: "Reimbursed",
  },
  {
    value: "donor_paid",
    label: "Donor Paid",
  },
  {
    value: "grant_paid",
    label: "Grant Paid",
  },
  {
    value: "other",
    label: "Other",
  },
];

export default function ExpensesPage() {
  const params =
    useParams();

  const animalId =
    params?.id as string;

  const [
    expenses,
    setExpenses,
  ] =
    useState<Expense[]>([]);

  const [
    summary,
    setSummary,
  ] =
    useState<ExpenseSummary>({
      totalExpenses: 0,
      organizationPaid: 0,
      pendingReimbursement: 0,
      externallyCovered: 0,
      thisMonth: 0,
    });

  const [
    categorySummary,
    setCategorySummary,
  ] =
    useState<CategorySummary[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const [
    message,
    setMessage,
  ] =
    useState<string | null>(
      null
    );

  const [
    showExpenseForm,
    setShowExpenseForm,
  ] =
    useState(false);

  const [
    editingExpenseId,
    setEditingExpenseId,
  ] =
    useState<string | null>(
      null
    );

  const [
    savingExpense,
    setSavingExpense,
  ] =
    useState(false);

  const [
    deletingExpenseId,
    setDeletingExpenseId,
  ] =
    useState<string | null>(
      null
    );

  const [
    draft,
    setDraft,
  ] =
    useState<ExpenseDraft>(
      emptyExpenseDraft()
    );

  /* =====================================================
     FILTERS
  ===================================================== */

  const [
    categoryFilter,
    setCategoryFilter,
  ] =
    useState("");

  const [
    paymentFilter,
    setPaymentFilter,
  ] =
    useState("");

  const [
    sort,
    setSort,
  ] =
    useState<
      | "newest"
      | "oldest"
      | "highest"
      | "lowest"
    >("newest");

  const [
    showCategoryBreakdown,
    setShowCategoryBreakdown,
  ] =
    useState(false);

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    if (!animalId) {
      return;
    }

    loadExpenses();
  }, [animalId]);

  async function loadExpenses() {
    setLoading(true);
    setError(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/expenses`,
          {
            cache:
              "no-store",

            credentials:
              "same-origin",
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't load animal expenses."
        );
      }

      setExpenses(
        data.expenses ??
          []
      );

      setSummary({
        totalExpenses:
          Number(
            data.summary
              ?.totalExpenses ??
              0
          ),

        organizationPaid:
          Number(
            data.summary
              ?.organizationPaid ??
              0
          ),

        pendingReimbursement:
          Number(
            data.summary
              ?.pendingReimbursement ??
              0
          ),

        externallyCovered:
          Number(
            data.summary
              ?.externallyCovered ??
              0
          ),

        thisMonth:
          Number(
            data.summary
              ?.thisMonth ??
              0
          ),
      });

      setCategorySummary(
        Array.isArray(
          data.categories
        )
          ? data.categories
          : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load animal expenses."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     DISPLAY EXPENSES
  ===================================================== */

  const displayExpenses =
    useMemo(() => {
      let result = [
        ...expenses,
      ];

      if (
        categoryFilter
      ) {
        result =
          result.filter(
            (expense) =>
              expense.category ===
              categoryFilter
          );
      }

      if (
        paymentFilter
      ) {
        result =
          result.filter(
            (expense) =>
              expense.payment_status ===
              paymentFilter
          );
      }

      result.sort(
        (a, b) => {
          if (
            sort ===
            "highest"
          ) {
            return (
              Number(
                b.amount
              ) -
              Number(
                a.amount
              )
            );
          }

          if (
            sort ===
            "lowest"
          ) {
            return (
              Number(
                a.amount
              ) -
              Number(
                b.amount
              )
            );
          }

          const aDate =
            new Date(
              `${String(
                a.expense_date
              ).slice(
                0,
                10
              )}T00:00:00`
            ).getTime();

          const bDate =
            new Date(
              `${String(
                b.expense_date
              ).slice(
                0,
                10
              )}T00:00:00`
            ).getTime();

          return sort ===
            "oldest"
            ? aDate -
                bDate
            : bDate -
                aDate;
        }
      );

      return result;
    }, [
      expenses,
      categoryFilter,
      paymentFilter,
      sort,
    ]);

  /* =====================================================
     FORM
  ===================================================== */

  function beginAddExpense() {
    setEditingExpenseId(
      null
    );

    setDraft(
      emptyExpenseDraft()
    );

    setShowExpenseForm(
      true
    );

    setError(null);
    setMessage(null);
  }

  function beginEditExpense(
    expense: Expense
  ) {
    setEditingExpenseId(
      expense.id
    );

    setDraft({
      expenseDate:
        String(
          expense.expense_date
        ).slice(
          0,
          10
        ),

      category:
        expense.category,

      description:
        expense.description ??
        "",

      vendor:
        expense.vendor ??
        "",

      amount:
        String(
          expense.amount
        ),

      paymentStatus:
        expense.payment_status,

      reimbursementAmount:
        expense.reimbursement_amount !=
        null
          ? String(
              expense.reimbursement_amount
            )
          : "",

      notes:
        expense.notes ??
        "",
    });

    setShowExpenseForm(
      true
    );

    setError(null);
    setMessage(null);
  }

  function cancelExpenseForm() {
    setShowExpenseForm(
      false
    );

    setEditingExpenseId(
      null
    );

    setDraft(
      emptyExpenseDraft()
    );
  }

  function updateDraft(
    field:
      keyof ExpenseDraft,
    value: string
  ) {
    setDraft(
      (current) => ({
        ...current,
        [field]:
          value,
      })
    );
  }

  async function saveExpense(
    event:
      React.FormEvent
  ) {
    event.preventDefault();

    if (
      !draft.category
    ) {
      setError(
        "Expense category is required."
      );

      return;
    }

    if (
      draft.amount.trim() ===
      ""
    ) {
      setError(
        "Expense amount is required."
      );

      return;
    }

    setSavingExpense(
      true
    );

    setError(null);
    setMessage(null);

    try {
      const isEditing =
        Boolean(
          editingExpenseId
        );

      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/expenses`,
          {
            method:
              isEditing
                ? "PATCH"
                : "POST",

            credentials:
              "same-origin",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                ...(isEditing
                  ? {
                      expenseId:
                        editingExpenseId,
                    }
                  : {}),

                expenseDate:
                  draft.expenseDate,

                category:
                  draft.category,

                description:
                  draft.description,

                vendor:
                  draft.vendor,

                amount:
                  draft.amount,

                paymentStatus:
                  draft.paymentStatus,

                reimbursementAmount:
                  draft.reimbursementAmount,

                notes:
                  draft.notes,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't save expense."
        );
      }

      setShowExpenseForm(
        false
      );

      setEditingExpenseId(
        null
      );

      setDraft(
        emptyExpenseDraft()
      );

      setMessage(
        isEditing
          ? "Expense updated."
          : "Expense added."
      );

      await loadExpenses();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't save expense."
      );
    } finally {
      setSavingExpense(
        false
      );
    }
  }

  /* =====================================================
     DELETE
  ===================================================== */

  async function deleteExpense(
    expense: Expense
  ) {
    const confirmed =
      window.confirm(
        `Delete this ${formatCategory(
          expense.category
        )} expense for ${formatCurrency(
          Number(
            expense.amount
          )
        )}?\n\nThis removes the expense from the animal's ledger. The deletion itself will remain in the audit history.`
      );

    if (!confirmed) {
      return;
    }

    setDeletingExpenseId(
      expense.id
    );

    setError(null);
    setMessage(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/expenses`,
          {
            method:
              "DELETE",

            credentials:
              "same-origin",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                expenseId:
                  expense.id,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't delete expense."
        );
      }

      if (
        editingExpenseId ===
        expense.id
      ) {
        cancelExpenseForm();
      }

      setMessage(
        "Expense deleted."
      );

      await loadExpenses();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't delete expense."
      );
    } finally {
      setDeletingExpenseId(
        null
      );
    }
  }

  /* =====================================================
     PAGE
  ===================================================== */

  if (
    loading &&
    expenses.length ===
      0
  ) {
    return (
      <section>
        <p>Loading…</p>
      </section>
    );
  }

  return (
    <section
      style={{
        maxWidth:
          1100,
      }}
    >
      <a
        href={`/animals/${encodeURIComponent(
          animalId
        )}`}
        style={backLink}
      >
        ← Back to Animal
      </a>

      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          gap: 16,
          flexWrap:
            "wrap",
          margin:
            "14px 0 20px",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize:
                11.5,
              fontWeight:
                800,
              letterSpacing:
                ".08em",
              color:
                "#6B6862",
              textTransform:
                "uppercase",
            }}
          >
            Private Animal File
          </p>

          <h1
            style={{
              fontSize:
                28,
              margin:
                "5px 0 6px",
              color:
                "#17233C",
            }}
          >
            Expenses
          </h1>

          <p
            style={{
              margin: 0,
              color:
                "#6B6862",
              fontSize:
                13.5,
              lineHeight:
                1.5,
              maxWidth:
                720,
            }}
          >
            Track animal-specific
            veterinary, medication,
            food, boarding,
            transport, training,
            supply, and other
            expenses.
          </p>
        </div>

        <button
          type="button"
          onClick={
            beginAddExpense
          }
          style={
            primaryButton
          }
        >
          + Add Expense
        </button>
      </div>

      {error && (
        <Notice
          type="error"
        >
          {error}
        </Notice>
      )}

      {message && (
        <Notice
          type="success"
        >
          {message}
        </Notice>
      )}

      {/* ===============================================
          SUMMARY
      ================================================ */}

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(155px, 1fr))",
          gap: 10,
          marginBottom:
            18,
        }}
      >
        <SummaryCard
          label="Lifetime Expenses"
          value={formatCurrency(
            summary.totalExpenses
          )}
        />

        <SummaryCard
          label="This Month"
          value={formatCurrency(
            summary.thisMonth
          )}
        />

        <SummaryCard
          label="Organization Paid"
          value={formatCurrency(
            summary.organizationPaid
          )}
        />

        <SummaryCard
          label="Pending Reimbursement"
          value={formatCurrency(
            summary.pendingReimbursement
          )}
          attention={
            summary.pendingReimbursement >
            0
          }
        />

        <SummaryCard
          label="Externally Covered"
          value={formatCurrency(
            summary.externallyCovered
          )}
        />
      </div>

      {/* ===============================================
          CATEGORY SUMMARY
      ================================================ */}

      {categorySummary.length >
        0 && (
        <section
          style={{
            ...panelStyle,
            padding: 0,
          }}
        >
          <button
            type="button"
            onClick={() =>
              setShowCategoryBreakdown(
                (value) =>
                  !value
              )
            }
            style={
              breakdownToggle
            }
          >
            <div>
              <strong>
                Spending by
                Category
              </strong>

              <div
                style={{
                  fontSize:
                    12,
                  color:
                    "#6B6862",
                  marginTop:
                    2,
                }}
              >
                {
                  categorySummary.length
                }{" "}
                categor
                {categorySummary.length ===
                1
                  ? "y"
                  : "ies"}
              </div>
            </div>

            <span>
              {showCategoryBreakdown
                ? "▲"
                : "▼"}
            </span>
          </button>

          {showCategoryBreakdown && (
            <div
              style={{
                borderTop:
                  "1px solid #EEECE8",
                padding:
                  "6px 16px 12px",
              }}
            >
              {categorySummary.map(
                (
                  category
                ) => (
                  <div
                    key={
                      category.category
                    }
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      gap: 12,
                      padding:
                        "9px 0",
                      borderBottom:
                        "1px solid #F0EFED",
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          display:
                            "block",
                          color:
                            "#17233C",
                          fontSize:
                            13,
                        }}
                      >
                        {formatCategory(
                          category.category
                        )}
                      </strong>

                      <span
                        style={{
                          fontSize:
                            11.5,
                          color:
                            "#6B6862",
                        }}
                      >
                        {
                          category.expenseCount
                        }{" "}
                        expense
                        {category.expenseCount ===
                        1
                          ? ""
                          : "s"}
                      </span>
                    </div>

                    <strong
                      style={{
                        color:
                          "#17233C",
                      }}
                    >
                      {formatCurrency(
                        category.total
                      )}
                    </strong>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      )}

      {/* ===============================================
          ADD / EDIT EXPENSE
      ================================================ */}

      {showExpenseForm && (
        <section
          style={
            panelStyle
          }
        >
          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              gap: 12,
              alignItems:
                "flex-start",
              flexWrap:
                "wrap",
              marginBottom:
                16,
            }}
          >
            <div>
              <h2
                style={
                  sectionTitle
                }
              >
                {editingExpenseId
                  ? "Edit Expense"
                  : "Add Expense"}
              </h2>

              <p
                style={
                  sectionDescription
                }
              >
                Expenses remain
                private to the
                organization.
              </p>
            </div>

            <button
              type="button"
              onClick={
                cancelExpenseForm
              }
              style={
                textButton
              }
            >
              Close
            </button>
          </div>

          <form
            onSubmit={
              saveExpense
            }
          >
            <div
              style={
                formGrid
              }
            >
              <Field
                label="Expense Date *"
              >
                <input
                  type="date"
                  required
                  value={
                    draft.expenseDate
                  }
                  onChange={(e) =>
                    updateDraft(
                      "expenseDate",
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                />
              </Field>

              <Field
                label="Category *"
              >
                <select
                  required
                  value={
                    draft.category
                  }
                  onChange={(e) =>
                    updateDraft(
                      "category",
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                >
                  <option value="">
                    Select…
                  </option>

                  {EXPENSE_CATEGORIES.map(
                    (
                      category
                    ) => (
                      <option
                        key={
                          category.value
                        }
                        value={
                          category.value
                        }
                      >
                        {
                          category.label
                        }
                      </option>
                    )
                  )}
                </select>
              </Field>

              <Field
                label="Amount *"
              >
                <div
                  style={{
                    position:
                      "relative",
                  }}
                >
                  <span
                    style={{
                      position:
                        "absolute",
                      left: 10,
                      top:
                        "50%",
                      transform:
                        "translateY(-50%)",
                      color:
                        "#6B6862",
                      fontSize:
                        13,
                    }}
                  >
                    $
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={
                      draft.amount
                    }
                    onChange={(e) =>
                      updateDraft(
                        "amount",
                        e.target.value
                      )
                    }
                    style={{
                      ...inputStyle,
                      paddingLeft:
                        24,
                    }}
                  />
                </div>
              </Field>

              <Field
                label="Payment / Funding"
              >
                <select
                  value={
                    draft.paymentStatus
                  }
                  onChange={(e) =>
                    updateDraft(
                      "paymentStatus",
                      e.target
                        .value as PaymentStatus
                    )
                  }
                  style={
                    inputStyle
                  }
                >
                  {PAYMENT_STATUSES.map(
                    (
                      status
                    ) => (
                      <option
                        key={
                          status.value
                        }
                        value={
                          status.value
                        }
                      >
                        {
                          status.label
                        }
                      </option>
                    )
                  )}
                </select>
              </Field>

              <Field
                label="Vendor / Provider"
              >
                <input
                  value={
                    draft.vendor
                  }
                  onChange={(e) =>
                    updateDraft(
                      "vendor",
                      e.target.value
                    )
                  }
                  placeholder="Clinic, pharmacy, store, transporter, etc."
                  style={
                    inputStyle
                  }
                />
              </Field>

              <Field
                label="Reimbursement Amount"
              >
                <div
                  style={{
                    position:
                      "relative",
                  }}
                >
                  <span
                    style={{
                      position:
                        "absolute",
                      left: 10,
                      top:
                        "50%",
                      transform:
                        "translateY(-50%)",
                      color:
                        "#6B6862",
                      fontSize:
                        13,
                    }}
                  >
                    $
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      draft.reimbursementAmount
                    }
                    onChange={(e) =>
                      updateDraft(
                        "reimbursementAmount",
                        e.target.value
                      )
                    }
                    style={{
                      ...inputStyle,
                      paddingLeft:
                        24,
                    }}
                  />
                </div>
              </Field>
            </div>

            <div
              style={{
                marginTop:
                  12,
              }}
            >
              <Field
                label="Description"
              >
                <input
                  value={
                    draft.description
                  }
                  onChange={(e) =>
                    updateDraft(
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Example: Annual exam and vaccines"
                  style={
                    inputStyle
                  }
                />
              </Field>
            </div>

            <div
              style={{
                marginTop:
                  12,
              }}
            >
              <Field
                label="Notes"
              >
                <textarea
                  rows={3}
                  value={
                    draft.notes
                  }
                  onChange={(e) =>
                    updateDraft(
                      "notes",
                      e.target.value
                    )
                  }
                  placeholder="Internal notes about the expense, reimbursement, donor coverage, etc."
                  style={
                    inputStyle
                  }
                />
              </Field>
            </div>

            <div
              style={
                formActions
              }
            >
              <button
                type="submit"
                disabled={
                  savingExpense
                }
                style={
                  primaryButton
                }
              >
                {savingExpense
                  ? "Saving…"
                  : editingExpenseId
                  ? "Save Expense"
                  : "Add Expense"}
              </button>

              <button
                type="button"
                disabled={
                  savingExpense
                }
                onClick={
                  cancelExpenseForm
                }
                style={
                  secondaryButton
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ===============================================
          FILTERS
      ================================================ */}

      <section
        style={
          panelStyle
        }
      >
        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 10,
          }}
        >
          <select
            value={
              categoryFilter
            }
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
            style={
              inputStyle
            }
          >
            <option value="">
              All categories
            </option>

            {EXPENSE_CATEGORIES.map(
              (
                category
              ) => (
                <option
                  key={
                    category.value
                  }
                  value={
                    category.value
                  }
                >
                  {
                    category.label
                  }
                </option>
              )
            )}
          </select>

          <select
            value={
              paymentFilter
            }
            onChange={(e) =>
              setPaymentFilter(
                e.target.value
              )
            }
            style={
              inputStyle
            }
          >
            <option value="">
              All funding statuses
            </option>

            {PAYMENT_STATUSES.map(
              (
                status
              ) => (
                <option
                  key={
                    status.value
                  }
                  value={
                    status.value
                  }
                >
                  {
                    status.label
                  }
                </option>
              )
            )}
          </select>

          <select
            value={sort}
            onChange={(e) =>
              setSort(
                e.target
                  .value as
                    | "newest"
                    | "oldest"
                    | "highest"
                    | "lowest"
              )
            }
            style={
              inputStyle
            }
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="highest">
              Highest Amount
            </option>

            <option value="lowest">
              Lowest Amount
            </option>
          </select>
        </div>
      </section>

      {/* ===============================================
          LEDGER
      ================================================ */}

      <section
        style={
          panelStyle
        }
      >
        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            gap: 12,
            flexWrap:
              "wrap",
            alignItems:
              "center",
            marginBottom:
              14,
          }}
        >
          <div>
            <h2
              style={
                sectionTitle
              }
            >
              Expense Ledger
            </h2>

            <p
              style={
                sectionDescription
              }
            >
              {
                displayExpenses.length
              }{" "}
              expense
              {displayExpenses.length ===
              1
                ? ""
                : "s"}
              {" · "}
              {formatCurrency(
                displayExpenses.reduce(
                  (
                    total,
                    expense
                  ) =>
                    total +
                    Number(
                      expense.amount
                    ),
                  0
                )
              )}
              {" "}
              in this view
            </p>
          </div>
        </div>

        {displayExpenses.length ===
        0 ? (
          <div
            style={
              emptyState
            }
          >
            No expenses match
            this view.
          </div>
        ) : (
          <div
            style={{
              display:
                "grid",
              gap: 9,
            }}
          >
            {displayExpenses.map(
              (
                expense
              ) => (
                <ExpenseCard
                  key={
                    expense.id
                  }
                  expense={
                    expense
                  }
                  deleting={
                    deletingExpenseId ===
                    expense.id
                  }
                  onEdit={() =>
                    beginEditExpense(
                      expense
                    )
                  }
                  onDelete={() =>
                    deleteExpense(
                      expense
                    )
                  }
                />
              )
            )}
          </div>
        )}
      </section>
    </section>
  );
}

/* =========================================================
   EXPENSE CARD
========================================================= */

function ExpenseCard({
  expense,
  deleting,
  onEdit,
  onDelete,
}: {
  expense: Expense;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [
    expanded,
    setExpanded,
  ] =
    useState(false);

  const amount =
    Number(
      expense.amount
    );

  return (
    <article
      style={{
        border:
          "1px solid #E7E5E1",
        borderRadius:
          9,
        background:
          "#fff",
        overflow:
          "hidden",
      }}
    >
      <button
        type="button"
        onClick={() =>
          setExpanded(
            (value) =>
              !value
          )
        }
        style={{
          width:
            "100%",
          border:
            "none",
          background:
            "#fff",
          padding:
            13,
          cursor:
            "pointer",
          textAlign:
            "left",
          fontFamily:
            "inherit",
        }}
      >
        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "minmax(150px, 1fr) auto",
            gap: 14,
            alignItems:
              "center",
          }}
        >
          <div
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                display:
                  "flex",
                gap: 6,
                alignItems:
                  "center",
                flexWrap:
                  "wrap",
              }}
            >
              <strong
                style={{
                  color:
                    "#17233C",
                  fontSize:
                    13.5,
                }}
              >
                {expense.description ||
                  formatCategory(
                    expense.category
                  )}
              </strong>

              <PaymentBadge
                status={
                  expense.payment_status
                }
              />
            </div>

            <div
              style={{
                marginTop:
                  4,
                color:
                  "#6B6862",
                fontSize:
                  12,
              }}
            >
              {formatDate(
                expense.expense_date
              )}

              {expense.vendor
                ? ` · ${expense.vendor}`
                : ""}

              {" · "}

              {formatCategory(
                expense.category
              )}
            </div>
          </div>

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: 10,
              flexShrink:
                0,
            }}
          >
            <strong
              style={{
                color:
                  "#17233C",
                fontSize:
                  15,
              }}
            >
              {formatCurrency(
                amount
              )}
            </strong>

            <span
              style={{
                color:
                  "#6B6862",
                fontSize:
                  11,
              }}
            >
              {expanded
                ? "▲"
                : "▼"}
            </span>
          </div>
        </div>
      </button>

      {expanded && (
        <div
          style={{
            borderTop:
              "1px solid #EEECE8",
            padding:
              13,
            background:
              "#FCFCFB",
          }}
        >
          {expense.reimbursement_amount !=
            null && (
            <DetailRow
              label="Reimbursement"
              value={formatCurrency(
                Number(
                  expense.reimbursement_amount
                )
              )}
            />
          )}

          {expense.vendor && (
            <DetailRow
              label="Vendor / Provider"
              value={
                expense.vendor
              }
            />
          )}

          <DetailRow
            label="Funding"
            value={formatPaymentStatus(
              expense.payment_status
            )}
          />

          {expense.notes && (
            <div
              style={{
                marginTop:
                  10,
              }}
            >
              <div
                style={
                  detailLabel
                }
              >
                Notes
              </div>

              <div
                style={{
                  color:
                    "#3F3D39",
                  fontSize:
                    13,
                  lineHeight:
                    1.55,
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {
                  expense.notes
                }
              </div>
            </div>
          )}

          {expense.recorded_by_email && (
            <div
              style={{
                marginTop:
                  10,
                color:
                  "#8A8782",
                fontSize:
                  11.5,
              }}
            >
              Recorded by{" "}
              {
                expense.recorded_by_email
              }
            </div>
          )}

          <div
            style={{
              display:
                "flex",
              gap: 8,
              flexWrap:
                "wrap",
              marginTop:
                14,
            }}
          >
            <button
              type="button"
              onClick={
                onEdit
              }
              style={
                smallButton
              }
            >
              Edit
            </button>

            <button
              type="button"
              disabled={
                deleting
              }
              onClick={
                onDelete
              }
              style={
                deleteButton
              }
            >
              {deleting
                ? "Deleting…"
                : "Delete"}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function SummaryCard({
  label,
  value,
  attention = false,
}: {
  label: string;
  value: string;
  attention?: boolean;
}) {
  return (
    <div
      style={{
        background:
          attention
            ? "#FFF8EA"
            : "#fff",

        border:
          attention
            ? "1px solid #E7D2B4"
            : "1px solid #E7E5E1",

        borderRadius:
          9,

        padding:
          14,
      }}
    >
      <div
        style={{
          color:
            attention
              ? "#85571F"
              : "#17233C",

          fontSize:
            21,

          fontWeight:
            800,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop:
            3,
          color:
            "#6B6862",
          fontSize:
            11.5,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function PaymentBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const special =
    status ===
      "pending_reimbursement";

  return (
    <span
      style={{
        display:
          "inline-block",

        borderRadius:
          20,

        padding:
          "3px 7px",

        background:
          special
            ? "#FFF3D9"
            : status ===
                "organization_paid"
            ? "#EEF1F5"
            : "#EEF4F0",

        color:
          special
            ? "#85571F"
            : status ===
                "organization_paid"
            ? "#52627A"
            : "#2F6F4E",

        fontWeight:
          700,

        fontSize:
          10.5,
      }}
    >
      {formatPaymentStatus(
        status
      )}
    </span>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display:
          "grid",
        gridTemplateColumns:
          "140px minmax(0, 1fr)",
        gap: 10,
        padding:
          "5px 0",
      }}
    >
      <div
        style={
          detailLabel
        }
      >
        {label}
      </div>

      <div
        style={{
          color:
            "#3F3D39",
          fontSize:
            12.5,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children:
    React.ReactNode;
}) {
  return (
    <label>
      <span
        style={{
          display:
            "block",
          fontSize:
            11.5,
          color:
            "#6B6862",
          fontWeight:
            700,
          marginBottom:
            5,
        }}
      >
        {label}
      </span>

      {children}
    </label>
  );
}

function Notice({
  type,
  children,
}: {
  type:
    | "success"
    | "error";
  children:
    React.ReactNode;
}) {
  return (
    <div
      style={{
        padding:
          11,
        marginBottom:
          14,
        borderRadius:
          8,

        background:
          type ===
          "error"
            ? "#FFF4F2"
            : "#EEF4F0",

        border:
          type ===
          "error"
            ? "1px solid #F3C7BF"
            : "1px solid #C9DDD1",

        color:
          type ===
          "error"
            ? "#B23B2E"
            : "#2F6F4E",

        fontSize:
          13,
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function emptyExpenseDraft():
  ExpenseDraft {
  return {
    expenseDate:
      currentLocalDate(),

    category:
      "",

    description:
      "",

    vendor:
      "",

    amount:
      "",

    paymentStatus:
      "organization_paid",

    reimbursementAmount:
      "",

    notes:
      "",
  };
}

function currentLocalDate() {
  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() +
        1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style:
        "currency",
      currency:
        "USD",
    }
  ).format(
    Number.isFinite(
      value
    )
      ? value
      : 0
  );
}

function formatDate(
  value: string
) {
  const text =
    String(
      value
    ).slice(
      0,
      10
    );

  const date =
    new Date(
      `${text}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return text;
  }

  return date.toLocaleDateString(
    [],
    {
      month:
        "short",
      day:
        "numeric",
      year:
        "numeric",
    }
  );
}

function formatCategory(
  value: string
) {
  const known =
    EXPENSE_CATEGORIES.find(
      (category) =>
        category.value ===
        value
    );

  if (known) {
    return known.label;
  }

  return formatValue(
    value
  );
}

function formatPaymentStatus(
  value: string
) {
  const known =
    PAYMENT_STATUSES.find(
      (status) =>
        status.value ===
        value
    );

  if (known) {
    return known.label;
  }

  return formatValue(
    value
  );
}

function formatValue(
  value: string
) {
  return value
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

/* =========================================================
   STYLES
========================================================= */

const backLink:
  React.CSSProperties =
{
  color:
    "#52627A",
  fontSize:
    13,
  fontWeight:
    700,
  textDecoration:
    "none",
};

const panelStyle:
  React.CSSProperties =
{
  background:
    "#fff",
  border:
    "1px solid #E7E5E1",
  borderRadius:
    10,
  padding:
    18,
  marginBottom:
    16,
};

const sectionTitle:
  React.CSSProperties =
{
  margin: 0,
  color:
    "#17233C",
  fontSize:
    17,
};

const sectionDescription:
  React.CSSProperties =
{
  margin:
    "4px 0 0",
  color:
    "#6B6862",
  fontSize:
    12.5,
  lineHeight:
    1.5,
};

const formGrid:
  React.CSSProperties =
{
  display:
    "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(210px, 1fr))",
  gap: 12,
};

const formActions:
  React.CSSProperties =
{
  display:
    "flex",
  gap: 8,
  flexWrap:
    "wrap",
  marginTop:
    16,
};

const inputStyle:
  React.CSSProperties =
{
  width:
    "100%",
  boxSizing:
    "border-box",
  border:
    "1px solid #D8D6D2",
  borderRadius:
    7,
  padding:
    9,
  background:
    "#fff",
  color:
    "#1C1B19",
  fontFamily:
    "inherit",
  fontSize:
    13,
};

const primaryButton:
  React.CSSProperties =
{
  background:
    "#17233C",
  color:
    "#fff",
  border:
    "none",
  borderRadius:
    7,
  padding:
    "9px 14px",
  fontWeight:
    700,
  fontSize:
    13,
  cursor:
    "pointer",
};

const secondaryButton:
  React.CSSProperties =
{
  background:
    "#fff",
  color:
    "#17233C",
  border:
    "1px solid #D8D6D2",
  borderRadius:
    7,
  padding:
    "9px 14px",
  fontWeight:
    700,
  fontSize:
    13,
  cursor:
    "pointer",
};

const textButton:
  React.CSSProperties =
{
  background:
    "transparent",
  color:
    "#6B6862",
  border:
    "none",
  padding:
    8,
  cursor:
    "pointer",
  fontSize:
    13,
};

const smallButton:
  React.CSSProperties =
{
  background:
    "#fff",
  color:
    "#17233C",
  border:
    "1px solid #D8D6D2",
  borderRadius:
    6,
  padding:
    "6px 9px",
  fontSize:
    11.5,
  fontWeight:
    700,
  cursor:
    "pointer",
};

const deleteButton:
  React.CSSProperties =
{
  background:
    "#fff",
  color:
    "#B23B2E",
  border:
    "1px solid #E2B8B1",
  borderRadius:
    6,
  padding:
    "6px 9px",
  fontSize:
    11.5,
  fontWeight:
    700,
  cursor:
    "pointer",
};

const breakdownToggle:
  React.CSSProperties =
{
  width:
    "100%",
  border:
    "none",
  background:
    "#fff",
  padding:
    16,
  display:
    "flex",
  justifyContent:
    "space-between",
  alignItems:
    "center",
  gap:
    10,
  textAlign:
    "left",
  color:
    "#17233C",
  fontFamily:
    "inherit",
  cursor:
    "pointer",
};

const detailLabel:
  React.CSSProperties =
{
  color:
    "#77736D",
  fontSize:
    11,
  fontWeight:
    800,
  textTransform:
    "uppercase",
  letterSpacing:
    ".04em",
};

const emptyState:
  React.CSSProperties =
{
  border:
    "1px dashed #D8D6D2",
  borderRadius:
    8,
  padding:
    18,
  color:
    "#6B6862",
  background:
    "#FCFCFB",
  fontSize:
    13,
};
