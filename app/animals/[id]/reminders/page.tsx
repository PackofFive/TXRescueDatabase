"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

type Priority =
  | "critical"
  | "high"
  | "normal"
  | "info";

type ReminderStatus =
  | "open"
  | "completed"
  | "cancelled";

type Reminder = {
  id: string;
  animal_id: string;
  title: string;
  notes: string | null;
  due_at: string | null;
  priority: Priority;
  status: ReminderStatus;
  created_at: string;
  updated_at: string;
};

type Animal = {
  id: string;
  name: string | null;
  temporary_name: string | null;
};

const PRIORITY_OPTIONS: {
  value: Priority;
  label: string;
}[] = [
  {
    value: "critical",
    label: "Critical",
  },
  {
    value: "high",
    label: "High",
  },
  {
    value: "normal",
    label: "Normal",
  },
  {
    value: "info",
    label: "Informational",
  },
];

export default function AnimalRemindersPage() {
  const params = useParams();

  const animalId =
    params?.id as string;

  const [
    animal,
    setAnimal,
  ] =
    useState<Animal | null>(
      null
    );

  const [
    reminders,
    setReminders,
  ] =
    useState<Reminder[]>([]);

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
    showCompleted,
    setShowCompleted,
  ] =
    useState(false);

  /* =====================================================
     NEW REMINDER FORM
  ===================================================== */

  const [
    title,
    setTitle,
  ] =
    useState("");

  const [
    notes,
    setNotes,
  ] =
    useState("");

  const [
    dueDate,
    setDueDate,
  ] =
    useState("");

  const [
    dueTime,
    setDueTime,
  ] =
    useState("");

  const [
    priority,
    setPriority,
  ] =
    useState<Priority>(
      "normal"
    );

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    if (!animalId) {
      return;
    }

    loadPage();
  }, [animalId]);

  async function loadPage() {
    setLoading(true);
    setError(null);

    try {
      /*
        Load animal name separately so this page can
        provide clear context.
      */

      const animalRes =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}`,
          {
            cache:
              "no-store",
          }
        );

      const animalData =
        await animalRes.json();

      if (!animalRes.ok) {
        throw new Error(
          animalData.error ??
            "Couldn't load animal."
        );
      }

      setAnimal({
        id:
          animalData.animal.id,

        name:
          animalData.animal.name,

        temporary_name:
          animalData.animal
            .temporary_name,
      });

      /*
        Load reminders.
      */

      const reminderRes =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/reminders`,
          {
            cache:
              "no-store",
          }
        );

      const reminderData =
        await reminderRes.json();

      if (!reminderRes.ok) {
        throw new Error(
          reminderData.error ??
            "Couldn't load reminders."
        );
      }

      setReminders(
        reminderData.reminders ??
          []
      );
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

  /* =====================================================
     CREATE REMINDER
  ===================================================== */

  async function createReminder(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError(null);
    setMessage(null);

    if (!title.trim()) {
      setError(
        "Reminder title is required."
      );

      return;
    }

    setSaving(true);

    try {
      let dueAt:
        | string
        | null = null;

      if (dueDate) {
        /*
          If no time is provided, use 9:00 AM.
          That is more useful for a work task than midnight.
        */

        const time =
          dueTime ||
          "09:00";

        const combined =
          new Date(
            `${dueDate}T${time}:00`
          );

        if (
          Number.isNaN(
            combined.getTime()
          )
        ) {
          throw new Error(
            "Reminder date or time is invalid."
          );
        }

        dueAt =
          combined.toISOString();
      }

      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/reminders`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                title,
                notes,
                dueAt,
                priority,
              }),
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

      setReminders(
        (current) => [
          data.reminder,
          ...current,
        ]
      );

      setTitle("");
      setNotes("");
      setDueDate("");
      setDueTime("");
      setPriority("normal");

      setMessage(
        "Reminder created."
      );
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

  /* =====================================================
     COMPLETE / REOPEN / CANCEL
  ===================================================== */

  async function changeStatus(
    reminderId: string,
    status: ReminderStatus
  ) {
    setError(null);
    setMessage(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/reminders`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                reminderId,
                status,
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

      setReminders(
        (current) =>
          current.map(
            (reminder) =>
              reminder.id ===
              reminderId
                ? {
                    ...reminder,
                    status:
                      data.reminder
                        .status,
                    updated_at:
                      data.reminder
                        .updated_at,
                  }
                : reminder
          )
      );

      if (
        status ===
        "completed"
      ) {
        setMessage(
          "Reminder completed."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't update reminder."
      );
    }
  }

  /* =====================================================
     DISPLAY
  ===================================================== */

  const openReminders =
    useMemo(
      () =>
        reminders.filter(
          (reminder) =>
            reminder.status ===
            "open"
        ),
      [reminders]
    );

  const history =
    useMemo(
      () =>
        reminders.filter(
          (reminder) =>
            reminder.status !==
            "open"
        ),
      [reminders]
    );

  if (loading) {
    return <p>Loading…</p>;
  }

  const animalName =
    animal?.name ||
    animal?.temporary_name ||
    "Animal";

  return (
    <section>
      <a
        href={`/animals/${encodeURIComponent(
          animalId
        )}`}
        style={backLink}
      >
        ← Back to {animalName}
      </a>

      <div
        style={{
          marginTop: 18,
          marginBottom: 24,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing:
              ".08em",
            color: "#6B6862",
          }}
        >
          PRIVATE RESCUE MANAGER
        </p>

        <h1
          style={{
            margin: "6px 0 6px",
            color: "#17233C",
            fontSize: 28,
          }}
        >
          Reminders & Tasks
        </h1>

        <p
          style={{
            margin: 0,
            color: "#6B6862",
            maxWidth: 720,
            lineHeight: 1.55,
          }}
        >
          Create follow-ups,
          appointments, calls,
          care tasks, and other
          reminders for{" "}
          {animalName}. Open
          reminders automatically
          appear on the Rescue
          Manager dashboard.
        </p>
      </div>

      {error && (
        <div
          style={{
            background:
              "#FFF4F2",
            border:
              "1px solid #F3C7BF",
            color: "#B23B2E",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          style={{
            background:
              "#EEF4F0",
            border:
              "1px solid #C9DDD1",
            color: "#2F6F4E",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
        >
          {message}
        </div>
      )}

      {/* ===============================================
          CREATE TASK
      ================================================ */}

      <section
        style={{
          background: "#fff",
          border:
            "1px solid #E7E5E1",
          borderRadius: 10,
          padding: 18,
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            margin: "0 0 5px",
            color: "#17233C",
            fontSize: 18,
          }}
        >
          Add Reminder
        </h2>

        <p
          style={{
            margin:
              "0 0 16px",
            color: "#6B6862",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          Examples: Call adopter,
          recheck incision, schedule
          vaccine, follow up with
          foster, or pick up
          medication.
        </p>

        <form
          onSubmit={
            createReminder
          }
        >
          <div
            style={{
              marginBottom: 13,
            }}
          >
            <FieldLabel>
              Task / Reminder *
            </FieldLabel>

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Example: Recheck incision"
              style={inputStyle}
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
              marginBottom: 13,
            }}
          >
            <div>
              <FieldLabel>
                Due Date
              </FieldLabel>

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            <div>
              <FieldLabel>
                Due Time
              </FieldLabel>

              <input
                type="time"
                value={dueTime}
                onChange={(e) =>
                  setDueTime(
                    e.target.value
                  )
                }
                disabled={
                  !dueDate
                }
                style={inputStyle}
              />
            </div>

            <div>
              <FieldLabel>
                Priority
              </FieldLabel>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target
                      .value as Priority
                  )
                }
                style={inputStyle}
              >
                {PRIORITY_OPTIONS.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div
            style={{
              marginBottom: 16,
            }}
          >
            <FieldLabel>
              Notes
            </FieldLabel>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              placeholder="Optional details or instructions."
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={primaryButton}
          >
            {saving
              ? "Adding…"
              : "Add Reminder"}
          </button>
        </form>
      </section>

      {/* ===============================================
          OPEN TASKS
      ================================================ */}

      <section>
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 17,
              color: "#17233C",
            }}
          >
            Open Reminders
          </h2>

          <span
            style={{
              color: "#6B6862",
              fontSize: 12.5,
            }}
          >
            {openReminders.length}
          </span>
        </div>

        {openReminders.length ===
          0 && (
          <div
            style={{
              background: "#fff",
              border:
                "1px dashed #D8D6D2",
              borderRadius: 9,
              padding: 20,
              color: "#6B6862",
              fontSize: 13.5,
              marginBottom: 18,
            }}
          >
            No open reminders for
            this animal.
          </div>
        )}

        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          {openReminders.map(
            (reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={
                  reminder
                }
                onStatusChange={
                  changeStatus
                }
              />
            )
          )}
        </div>
      </section>

      {/* ===============================================
          COMPLETED / CANCELLED
      ================================================ */}

      {history.length > 0 && (
        <section
          style={{
            marginTop: 26,
          }}
        >
          <button
            type="button"
            onClick={() =>
              setShowCompleted(
                (value) =>
                  !value
              )
            }
            style={secondaryButton}
          >
            {showCompleted
              ? "Hide History"
              : `Show Completed / Cancelled (${history.length})`}
          </button>

          {showCompleted && (
            <div
              style={{
                display: "grid",
                gap: 10,
                marginTop: 12,
              }}
            >
              {history.map(
                (reminder) => (
                  <ReminderCard
                    key={
                      reminder.id
                    }
                    reminder={
                      reminder
                    }
                    onStatusChange={
                      changeStatus
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      )}
    </section>
  );
}

/* =========================================================
   REMINDER CARD
========================================================= */

function ReminderCard({
  reminder,
  onStatusChange,
}: {
  reminder: Reminder;

  onStatusChange: (
    id: string,
    status: ReminderStatus
  ) => void;
}) {
  const dueStatus =
    reminder.due_at
      ? getDueStatus(
          reminder.due_at
        )
      : null;

  const colors =
    priorityColors[
      reminder.priority
    ];

  return (
    <article
      style={{
        background: "#fff",
        border:
          `1px solid ${colors.border}`,
        borderLeft:
          `5px solid ${colors.main}`,
        borderRadius: 9,
        padding: 15,
        opacity:
          reminder.status ===
          "open"
            ? 1
            : 0.7,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 200,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 7,
              alignItems:
                "center",
              flexWrap: "wrap",
            }}
          >
            <strong
              style={{
                color: "#17233C",
                fontSize: 14.5,
              }}
            >
              {reminder.title}
            </strong>

            <span
              style={{
                background:
                  colors.background,
                color:
                  colors.main,
                padding:
                  "3px 7px",
                borderRadius: 20,
                fontSize: 10.5,
                fontWeight: 700,
              }}
            >
              {formatPriority(
                reminder.priority
              )}
            </span>

            {reminder.status !==
              "open" && (
              <span
                style={{
                  background:
                    "#EDEBE8",
                  color:
                    "#6B6862",
                  padding:
                    "3px 7px",
                  borderRadius: 20,
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                {capitalize(
                  reminder.status
                )}
              </span>
            )}
          </div>

          {reminder.due_at && (
            <div
              style={{
                marginTop: 6,
                fontSize: 12.5,
                color:
                  dueStatus
                    ?.overdue
                    ? "#B23B2E"
                    : "#6B6862",
                fontWeight:
                  dueStatus
                    ?.overdue
                    ? 700
                    : 500,
              }}
            >
              {dueStatus?.label}
            </div>
          )}

          {reminder.notes && (
            <p
              style={{
                margin:
                  "8px 0 0",
                color: "#4F4D49",
                fontSize: 13,
                lineHeight: 1.5,
                whiteSpace:
                  "pre-wrap",
              }}
            >
              {reminder.notes}
            </p>
          )}
        </div>

        {reminder.status ===
        "open" ? (
          <div
            style={{
              display: "flex",
              gap: 7,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() =>
                onStatusChange(
                  reminder.id,
                  "completed"
                )
              }
              style={
                completeButton
              }
            >
              Complete
            </button>

            <button
              type="button"
              onClick={() =>
                onStatusChange(
                  reminder.id,
                  "cancelled"
                )
              }
              style={
                secondaryButton
              }
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              onStatusChange(
                reminder.id,
                "open"
              )
            }
            style={
              secondaryButton
            }
          >
            Reopen
          </button>
        )}
      </div>
    </article>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function FieldLabel({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 11.5,
        fontWeight: 700,
        color: "#6B6862",
        marginBottom: 5,
        textTransform:
          "uppercase",
        letterSpacing:
          ".04em",
      }}
    >
      {children}
    </label>
  );
}

function getDueStatus(
  value: string
) {
  const due =
    new Date(value);

  if (
    Number.isNaN(
      due.getTime()
    )
  ) {
    return {
      label: value,
      overdue: false,
    };
  }

  const now =
    new Date();

  const diff =
    due.getTime() -
    now.getTime();

  const hours =
    Math.round(
      Math.abs(diff) /
        3600000
    );

  if (diff < 0) {
    if (hours < 24) {
      return {
        label:
          "Overdue · " +
          formatDateTime(
            value
          ),

        overdue: true,
      };
    }

    const days =
      Math.floor(
        hours / 24
      );

    return {
      label: `${days} day${
        days === 1
          ? ""
          : "s"
      } overdue · ${formatDateTime(
        value
      )}`,

      overdue: true,
    };
  }

  return {
    label:
      "Due " +
      formatDateTime(
        value
      ),

    overdue: false,
  };
}

function formatDateTime(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    [],
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute:
        "2-digit",
    }
  );
}

function formatPriority(
  value: Priority
) {
  if (
    value === "info"
  ) {
    return "Informational";
  }

  return capitalize(value);
}

function capitalize(
  value: string
) {
  return (
    value.charAt(0)
      .toUpperCase() +
    value.slice(1)
  );
}

/* =========================================================
   COLORS
========================================================= */

const priorityColors: Record<
  Priority,
  {
    main: string;
    background: string;
    border: string;
  }
> = {
  critical: {
    main: "#B23B2E",
    background:
      "#FAE7E3",
    border: "#E6C3BD",
  },

  high: {
    main: "#A66A11",
    background:
      "#FBEFD9",
    border: "#E7D2B4",
  },

  normal: {
    main: "#2B5C8A",
    background:
      "#E4ECF3",
    border: "#CCD7E2",
  },

  info: {
    main: "#6B6862",
    background:
      "#EDEBE8",
    border: "#DDDAD6",
  },
};

/* =========================================================
   STYLES
========================================================= */

const inputStyle:
  React.CSSProperties =
{
  width: "100%",
  boxSizing:
    "border-box",
  border:
    "1px solid #D8D6D2",
  borderRadius: 7,
  padding: 9,
  background: "#fff",
  color: "#1C1B19",
  fontFamily: "inherit",
  fontSize: 13.5,
};

const primaryButton:
  React.CSSProperties =
{
  background: "#17233C",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  padding:
    "9px 14px",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};

const secondaryButton:
  React.CSSProperties =
{
  background: "#fff",
  color: "#17233C",
  border:
    "1px solid #D8D6D2",
  borderRadius: 7,
  padding:
    "8px 11px",
  fontWeight: 700,
  fontSize: 12.5,
  cursor: "pointer",
};

const completeButton:
  React.CSSProperties =
{
  ...secondaryButton,
  background: "#EEF4F0",
  color: "#2F6F4E",
  border:
    "1px solid #C9DDD1",
};

const backLink:
  React.CSSProperties =
{
  color: "#C05621",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 600,
};
