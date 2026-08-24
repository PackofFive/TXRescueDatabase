"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type Pet = {
  id: string;
  name: string;
};

type Reminder = {
  id: string;
  pet_id: string;
  pet_name: string;
  reminder_type: string;
  title: string;
  description: string | null;
  due_date: string;
  recurrence: string;
  recurrence_days: number | null;
  status: string;
  completed_at: string | null;
  notes: string | null;
};

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  peach: "#FBE3DA",
  pink: "#F2D6DC",
  mint: "#DCF0E8",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
  page: "#FFFDFC",
};

const REMINDER_TYPES = [
  ["vaccination", "Vaccination"],
  ["medication", "Medication"],
  ["flea_preventative", "Flea Preventative"],
  ["heartworm_preventative", "Heartworm Preventative"],
  ["appointment", "Appointment"],
  ["grooming", "Grooming"],
  ["license", "License"],
  ["insurance", "Insurance"],
  ["microchip", "Microchip"],
  ["preventive_care", "Preventive Care"],
  ["other", "Other"],
];

const RECURRENCE_OPTIONS = [
  ["none", "One Time"],
  ["daily", "Daily"],
  ["weekly", "Weekly"],
  ["monthly", "Monthly"],
  ["every_3_months", "Every 3 Months"],
  ["every_6_months", "Every 6 Months"],
  ["yearly", "Yearly"],
  ["custom", "Custom"],
];

export default function PetOwnerRemindersPage() {
  const [
    pets,
    setPets,
  ] =
    useState<
      Pet[]
    >([]);

  const [
    reminders,
    setReminders,
  ] =
    useState<
      Reminder[]
    >([]);

  const [
    form,
    setForm,
  ] =
    useState({
      petId: "",
      reminderType:
        "vaccination",
      title: "",
      description: "",
      dueDate: "",
      recurrence:
        "none",
      recurrenceDays: "",
      notes: "",
    });

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    workingId,
    setWorkingId,
  ] =
    useState<
      string | null
    >(null);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const res =
        await fetch(
          "/api/pet-owner/reminders",
          {
            cache:
              "no-store",
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        if (
          res.status ===
          401
        ) {
          window.location.href =
            "/login?portal=pet-owner";

          return;
        }

        throw new Error(
          data.error ??
            "Couldn't load reminders."
        );
      }

      setPets(
        data.pets ??
          []
      );

      setReminders(
        data.reminders ??
          []
      );

      if (
        !form.petId &&
        data.pets?.[0]?.id
      ) {
        setForm(
          (
            current
          ) => ({
            ...current,
            petId:
              data.pets[0].id,
          })
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load reminders."
      );
    } finally {
      setLoading(false);
    }
  }

  function update(
    field: string,
    value: string
  ) {
    setForm(
      (
        current
      ) => ({
        ...current,
        [field]:
          value,
      })
    );
  }

  async function createReminder(
    e:
      React.FormEvent
  ) {
    e.preventDefault();

    setSaving(true);
    setError(null);

    try {
      const res =
        await fetch(
          "/api/pet-owner/reminders",
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify(
                form
              ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't create reminder."
        );
      }

      setForm(
        (
          current
        ) => ({
          ...current,
          title: "",
          description: "",
          dueDate: "",
          recurrence:
            "none",
          recurrenceDays: "",
          notes: "",
        })
      );

      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't create reminder."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateReminder(
    reminderId: string,
    action:
      | "complete"
      | "dismiss"
      | "reactivate"
  ) {
    setWorkingId(
      reminderId
    );

    setError(null);

    try {
      const res =
        await fetch(
          "/api/pet-owner/reminders",
          {
            method:
              "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                reminderId,
                action,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't update reminder."
        );
      }

      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't update reminder."
      );
    } finally {
      setWorkingId(
        null
      );
    }
  }

  const active =
    useMemo(
      () =>
        reminders.filter(
          (
            reminder
          ) =>
            reminder.status ===
            "active"
        ),
      [reminders]
    );

  const completed =
    useMemo(
      () =>
        reminders.filter(
          (
            reminder
          ) =>
            reminder.status ===
            "completed"
        ),
      [reminders]
    );

  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const overdue =
    active.filter(
      (
        reminder
      ) =>
        new Date(
          `${reminder.due_date}T00:00:00`
        ) < today
    );

  const upcoming =
    active.filter(
      (
        reminder
      ) =>
        new Date(
          `${reminder.due_date}T00:00:00`
        ) >= today
    );

  if (loading) {
    return (
      <PageShell>
        <p
          style={{
            color:
              COLORS.muted,
          }}
        >
          Loading…
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          gap:
            14,
          flexWrap:
            "wrap",
        }}
      >
        <div>
          <p style={eyebrowStyle}>
            Pet Owner Portal
          </p>

          <h1 style={headingStyle}>
            Care &amp; Reminders
          </h1>

          <p
            style={{
              margin:
                "8px 0 0",
              color:
                COLORS.muted,
              fontSize:
                13.5,
              lineHeight:
                1.5,
            }}
          >
            Track recurring care,
            appointments,
            preventatives,
            medications, and due
            dates for your pets.
          </p>
        </div>

        <a
          href="/pet-owner"
          style={secondaryLink}
        >
          My Pets
        </a>
      </div>

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(150px, 1fr))",
          gap:
            10,
          margin:
            "18px 0",
        }}
      >
        <StatCard
          value={
            overdue.length
          }
          label="Overdue"
        />

        <StatCard
          value={
            upcoming.length
          }
          label="Upcoming"
        />

        <StatCard
          value={
            completed.length
          }
          label="Completed"
        />
      </div>

      {error && (
        <p
          role="alert"
          style={{
            background:
              "#FFF3F1",
            color:
              "#B23B2E",
            padding:
              11,
            fontSize:
              12.5,
          }}
        >
          {error}
        </p>
      )}

      {pets.length ===
      0 ? (
        <div style={emptyStyle}>
          <strong
            style={{
              color:
                COLORS.navy,
            }}
          >
            Add a pet before creating reminders.
          </strong>

          <a
            href="/pet-owner/pets/new"
            style={{
              ...primaryLink,
              marginTop:
                12,
            }}
          >
            Add Pet
          </a>
        </div>
      ) : (
        <form
          onSubmit={
            createReminder
          }
          style={{
            background:
              COLORS.peach,
            padding:
              16,
            display:
              "grid",
            gap:
              12,
            marginBottom:
              20,
          }}
        >
          <strong
            style={{
              color:
                COLORS.navy,
              fontSize:
                16,
            }}
          >
            Add Reminder
          </strong>

          <div style={twoCol}>
            <label style={labelStyle}>
              Pet *
              <select
                value={
                  form.petId
                }
                required
                onChange={(e) =>
                  update(
                    "petId",
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                {pets.map(
                  (
                    pet
                  ) => (
                    <option
                      key={
                        pet.id
                      }
                      value={
                        pet.id
                      }
                    >
                      {pet.name}
                    </option>
                  )
                )}
              </select>
            </label>

            <label style={labelStyle}>
              Reminder Type *
              <select
                value={
                  form.reminderType
                }
                onChange={(e) =>
                  update(
                    "reminderType",
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                {REMINDER_TYPES.map(
                  (
                    [
                      value,
                      label,
                    ]
                  ) => (
                    <option
                      key={
                        value
                      }
                      value={
                        value
                      }
                    >
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <Field
              label="Title *"
              value={
                form.title
              }
              onChange={(v) =>
                update(
                  "title",
                  v
                )
              }
              required
              placeholder="Example: Heartworm preventative"
            />

            <Field
              label="Due Date *"
              value={
                form.dueDate
              }
              onChange={(v) =>
                update(
                  "dueDate",
                  v
                )
              }
              type="date"
              required
            />

            <label style={labelStyle}>
              Repeat
              <select
                value={
                  form.recurrence
                }
                onChange={(e) =>
                  update(
                    "recurrence",
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                {RECURRENCE_OPTIONS.map(
                  (
                    [
                      value,
                      label,
                    ]
                  ) => (
                    <option
                      key={
                        value
                      }
                      value={
                        value
                      }
                    >
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            {form.recurrence ===
              "custom" && (
              <Field
                label="Repeat Every (Days)"
                value={
                  form.recurrenceDays
                }
                onChange={(v) =>
                  update(
                    "recurrenceDays",
                    v
                  )
                }
                type="number"
              />
            )}
          </div>

          <Field
            label="Description"
            value={
              form.description
            }
            onChange={(v) =>
              update(
                "description",
                v
              )
            }
          />

          <label style={labelStyle}>
            Notes
            <textarea
              value={
                form.notes
              }
              onChange={(e) =>
                update(
                  "notes",
                  e.target.value
                )
              }
              rows={3}
              style={inputStyle}
            />
          </label>

          <button
            type="submit"
            disabled={
              saving
            }
            style={{
              ...primaryButton,
              opacity:
                saving
                  ? 0.65
                  : 1,
            }}
          >
            {saving
              ? "Saving…"
              : "Add Reminder"}
          </button>
        </form>
      )}

      <ReminderSection
        title="Overdue"
        reminders={
          overdue
        }
        emptyText="Nothing overdue."
        background="#FFF3F1"
        workingId={
          workingId
        }
        onAction={
          updateReminder
        }
      />

      <ReminderSection
        title="Upcoming"
        reminders={
          upcoming
        }
        emptyText="No upcoming reminders."
        background={
          COLORS.mint
        }
        workingId={
          workingId
        }
        onAction={
          updateReminder
        }
      />

      <ReminderSection
        title="Completed"
        reminders={
          completed
        }
        emptyText="No completed reminders yet."
        background={
          COLORS.white
        }
        workingId={
          workingId
        }
        onAction={
          updateReminder
        }
        completed
      />
    </PageShell>
  );
}

function ReminderSection({
  title,
  reminders,
  emptyText,
  background,
  workingId,
  onAction,
  completed = false,
}: {
  title: string;
  reminders:
    Reminder[];
  emptyText: string;
  background: string;
  workingId:
    string | null;
  onAction: (
    id: string,
    action:
      | "complete"
      | "dismiss"
      | "reactivate"
  ) => void;
  completed?: boolean;
}) {
  return (
    <section
      style={{
        marginTop:
          18,
      }}
    >
      <h2
        style={{
          margin:
            "0 0 10px",
          color:
            COLORS.navy,
          fontSize:
            18,
        }}
      >
        {title}
      </h2>

      {reminders.length ===
      0 ? (
        <div style={emptyStyle}>
          {emptyText}
        </div>
      ) : (
        <div
          style={{
            display:
              "grid",
            gap:
              10,
          }}
        >
          {reminders.map(
            (
              reminder
            ) => (
              <article
                key={
                  reminder.id
                }
                style={{
                  background,
                  border:
                    `1px solid ${COLORS.border}`,
                  padding:
                    14,
                  display:
                    "grid",
                  gridTemplateColumns:
                    "minmax(0, 1fr) auto",
                  gap:
                    12,
                  alignItems:
                    "center",
                }}
              >
                <div>
                  <div
                    style={{
                      display:
                        "flex",
                      gap:
                        8,
                      alignItems:
                        "center",
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <strong
                      style={{
                        color:
                          COLORS.navy,
                        fontSize:
                          14,
                      }}
                    >
                      {reminder.title}
                    </strong>

                    <span
                      style={{
                        color:
                          COLORS.muted,
                        fontSize:
                          11,
                      }}
                    >
                      {reminder.pet_name}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop:
                        5,
                      color:
                        COLORS.muted,
                      fontSize:
                        12,
                    }}
                  >
                    {formatType(
                      reminder.reminder_type
                    )}{" "}
                    ·{" "}
                    {new Date(
                      `${reminder.due_date}T00:00:00`
                    ).toLocaleDateString()}
                    {reminder.recurrence !==
                      "none"
                      ? ` · ${formatType(
                          reminder.recurrence
                        )}`
                      : ""}
                  </div>

                  {reminder.description && (
                    <p
                      style={{
                        margin:
                          "6px 0 0",
                        color:
                          COLORS.muted,
                        fontSize:
                          12.25,
                        lineHeight:
                          1.45,
                      }}
                    >
                      {reminder.description}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    gap:
                      7,
                    flexWrap:
                      "wrap",
                    justifyContent:
                      "flex-end",
                  }}
                >
                  {completed ? (
                    <button
                      type="button"
                      disabled={
                        workingId ===
                        reminder.id
                      }
                      onClick={() =>
                        onAction(
                          reminder.id,
                          "reactivate"
                        )
                      }
                      style={
                        secondaryButton
                      }
                    >
                      Reactivate
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={
                          workingId ===
                          reminder.id
                        }
                        onClick={() =>
                          onAction(
                            reminder.id,
                            "complete"
                          )
                        }
                        style={
                          primarySmallButton
                        }
                      >
                        Complete
                      </button>

                      <button
                        type="button"
                        disabled={
                          workingId ===
                          reminder.id
                        }
                        onClick={() =>
                          onAction(
                            reminder.id,
                            "dismiss"
                          )
                        }
                        style={
                          secondaryButton
                        }
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
}

function PageShell({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          COLORS.page,
        padding:
          "28px 18px 44px",
        boxSizing:
          "border-box",
      }}
    >
      <section
        style={{
          width:
            "100%",
          maxWidth:
            980,
          margin:
            "0 auto",
        }}
      >
        {children}
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label style={labelStyle}>
      {label}
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        style={inputStyle}
      />
    </label>
  );
}

function StatCard({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div
      style={{
        background:
          COLORS.white,
        border:
          `1px solid ${COLORS.border}`,
        padding:
          13,
      }}
    >
      <strong
        style={{
          display:
            "block",
          color:
            COLORS.navy,
          fontSize:
            22,
        }}
      >
        {value}
      </strong>

      <span
        style={{
          display:
            "block",
          marginTop:
            3,
          color:
            COLORS.muted,
          fontSize:
            11.5,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function formatType(
  value: string
) {
  return value
    .replaceAll(
      "_",
      " "
    )
    .replace(
      /\b\w/g,
      (
        letter
      ) =>
        letter.toUpperCase()
    );
}

const eyebrowStyle:
  React.CSSProperties =
{
  margin:
    "0 0 6px",
  color:
    COLORS.coral,
  fontSize:
    11.5,
  fontWeight:
    800,
  letterSpacing:
    ".1em",
  textTransform:
    "uppercase",
};

const headingStyle:
  React.CSSProperties =
{
  margin:
    0,
  color:
    COLORS.navy,
  fontSize:
    30,
  lineHeight:
    1.1,
};

const twoCol:
  React.CSSProperties =
{
  display:
    "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap:
    12,
};

const labelStyle:
  React.CSSProperties =
{
  display:
    "grid",
  gap:
    6,
  color:
    COLORS.navy,
  fontSize:
    12.5,
  fontWeight:
    700,
};

const inputStyle:
  React.CSSProperties =
{
  width:
    "100%",
  boxSizing:
    "border-box",
  border:
    `1px solid ${COLORS.border}`,
  padding:
    "9px 10px",
  background:
    "#fff",
  color:
    "#1C1B19",
  fontFamily:
    "inherit",
};

const primaryButton:
  React.CSSProperties =
{
  border:
    "none",
  background:
    COLORS.navy,
  color:
    "#fff",
  padding:
    "10px 14px",
  fontWeight:
    800,
  fontSize:
    13,
  cursor:
    "pointer",
  width:
    "fit-content",
};

const primarySmallButton:
  React.CSSProperties =
{
  border:
    "none",
  background:
    COLORS.navy,
  color:
    "#fff",
  padding:
    "7px 9px",
  fontWeight:
    800,
  fontSize:
    11.5,
  cursor:
    "pointer",
};

const secondaryButton:
  React.CSSProperties =
{
  border:
    `1px solid ${COLORS.border}`,
  background:
    COLORS.white,
  color:
    COLORS.navy,
  padding:
    "6px 9px",
  fontWeight:
    800,
  fontSize:
    11.5,
  cursor:
    "pointer",
};

const primaryLink:
  React.CSSProperties =
{
  display:
    "inline-block",
  background:
    COLORS.navy,
  color:
    "#fff",
  padding:
    "9px 13px",
  textDecoration:
    "none",
  fontWeight:
    800,
  fontSize:
    12.5,
};

const secondaryLink:
  React.CSSProperties =
{
  display:
    "inline-block",
  border:
    `1px solid ${COLORS.border}`,
  background:
    COLORS.white,
  color:
    COLORS.navy,
  padding:
    "8px 12px",
  textDecoration:
    "none",
  fontWeight:
    800,
  fontSize:
    12,
};

const emptyStyle:
  React.CSSProperties =
{
  background:
    COLORS.white,
  border:
    `1px solid ${COLORS.border}`,
  padding:
    16,
  color:
    COLORS.muted,
  fontSize:
    13,
};
