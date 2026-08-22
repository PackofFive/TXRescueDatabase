"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

type TimelineEvent = {
  id: string;
  source:
    | "custody"
    | "audit";
  eventType: string;
  occurredAt: string;
  title: string;
  detail:
    | string
    | null;
  actorEmail:
    | string
    | null;
};

type AnimalSummary = {
  id: string;
  name:
    | string
    | null;
  temporary_name:
    | string
    | null;
};

type FilterGroup =
  | "all"
  | "medical"
  | "behavior"
  | "documents"
  | "expenses"
  | "tasks"
  | "outcome"
  | "profile"
  | "custody";

export default function TimelinePage() {
  const params =
    useParams();

  const animalId =
    params?.id as string;

  const [
    animal,
    setAnimal,
  ] =
    useState<AnimalSummary | null>(
      null
    );

  const [
    events,
    setEvents,
  ] =
    useState<TimelineEvent[]>([]);

  const [
    filter,
    setFilter,
  ] =
    useState<FilterGroup>(
      "all"
    );

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

  useEffect(() => {
    if (!animalId) {
      return;
    }

    void loadPage();
  }, [animalId]);

  async function loadPage() {
    setLoading(true);
    setError(null);

    try {
      const [
        animalRes,
        timelineRes,
      ] =
        await Promise.all([
          fetch(
            `/api/animals/${encodeURIComponent(
              animalId
            )}`,
            {
              cache:
                "no-store",

              credentials:
                "same-origin",
            }
          ),

          fetch(
            `/api/animals/${encodeURIComponent(
              animalId
            )}/timeline`,
            {
              cache:
                "no-store",

              credentials:
                "same-origin",
            }
          ),
        ]);

      const [
        animalData,
        timelineData,
      ] =
        await Promise.all([
          animalRes.json(),
          timelineRes.json(),
        ]);

      if (
        !animalRes.ok
      ) {
        throw new Error(
          animalData.error ??
            "Couldn't load animal."
        );
      }

      if (
        !timelineRes.ok
      ) {
        throw new Error(
          timelineData.error ??
            "Couldn't load timeline."
        );
      }

      setAnimal(
        animalData.animal ??
          null
      );

      setEvents(
        Array.isArray(
          timelineData.events
        )
          ? timelineData.events
          : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load timeline."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredEvents =
    useMemo(
      () =>
        filter ===
        "all"
          ? events
          : events.filter(
              (event) =>
                groupForEvent(
                  event
                ) ===
                filter
            ),
      [
        events,
        filter,
      ]
    );

  if (loading) {
    return (
      <p>
        Loading…
      </p>
    );
  }

  const displayName =
    animal?.name ||
    animal?.temporary_name ||
    "Animal";

  return (
    <section
      style={{
        maxWidth:
          950,
      }}
    >
      <a
        href={`/animals/${encodeURIComponent(
          animalId
        )}`}
        style={
          backLink
        }
      >
        ← Back to Animal
      </a>

      <div
        style={{
          margin:
            "14px 0 20px",
        }}
      >
        <p
          style={
            eyebrow
          }
        >
          Private Animal File
        </p>

        <h1
          style={
            pageTitle
          }
        >
          Timeline
        </h1>

        <p
          style={
            pageDescription
          }
        >
          A chronological activity
          history for {displayName},
          including custody changes,
          medical activity, behavior,
          documents, expenses, tasks,
          profile changes, and outcome
          activity.
        </p>
      </div>

      {error && (
        <div
          style={
            errorBox
          }
        >
          {error}
        </div>
      )}

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

            gap:
              12,

            flexWrap:
              "wrap",

            alignItems:
              "center",
          }}
        >
          <div>
            <h2
              style={
                sectionTitle
              }
            >
              Activity History
            </h2>

            <p
              style={
                sectionDescription
              }
            >
              {events.length} recorded
              event
              {events.length ===
              1
                ? ""
                : "s"}
            </p>
          </div>

          <select
            value={
              filter
            }

            onChange={(e) =>
              setFilter(
                e.target
                  .value as FilterGroup
              )
            }

            style={{
              ...inputStyle,

              width:
                "auto",

              minWidth:
                190,
            }}
          >
            <option value="all">
              All activity
            </option>

            <option value="medical">
              Medical & Medication
            </option>

            <option value="behavior">
              Behavior
            </option>

            <option value="documents">
              Documents & Photos
            </option>

            <option value="expenses">
              Expenses
            </option>

            <option value="tasks">
              Reminders & Help
            </option>

            <option value="profile">
              Animal/Profile Changes
            </option>

            <option value="custody">
              Custody
            </option>

            <option value="outcome">
              Outcome
            </option>
          </select>
        </div>
      </section>

      {filteredEvents.length ===
      0 ? (
        <section
          style={
            panelStyle
          }
        >
          <div
            style={
              emptyState
            }
          >
            No events match this view.
          </div>
        </section>
      ) : (
        <section
          style={
            timelineContainer
          }
        >
          {filteredEvents.map(
            (
              event,
              index
            ) => (
              <TimelineCard
                key={
                  event.id
                }

                event={
                  event
                }

                last={
                  index ===
                  filteredEvents.length -
                    1
                }
              />
            )
          )}
        </section>
      )}
    </section>
  );
}

function TimelineCard({
  event,
  last,
}: {
  event:
    TimelineEvent;

  last:
    boolean;
}) {
  const group =
    groupForEvent(
      event
    );

  return (
    <article
      style={{
        position:
          "relative",

        display:
          "grid",

        gridTemplateColumns:
          "34px minmax(0, 1fr)",

        gap:
          12,
      }}
    >
      <div
        style={{
          position:
            "relative",

          display:
            "flex",

          justifyContent:
            "center",
        }}
      >
        {!last && (
          <div
            style={{
              position:
                "absolute",

              top:
                20,

              bottom:
                -16,

              width:
                2,

              background:
                "#E3E6E8",
            }}
          />
        )}

        <div
          style={{
            position:
              "relative",

            zIndex:
              1,

            width:
              12,

            height:
              12,

            marginTop:
              5,

            borderRadius:
              "50%",

            background:
              "#17233C",

            border:
              "3px solid #fff",

            boxShadow:
              "0 0 0 1px #C9CDD2",
          }}
        />
      </div>

      <div
        style={{
          ...panelStyle,

          marginBottom:
            14,

          padding:
            14,
        }}
      >
        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            gap:
              12,

            flexWrap:
              "wrap",

            alignItems:
              "flex-start",
          }}
        >
          <div>
            <div
              style={{
                display:
                  "flex",

                gap:
                  7,

                flexWrap:
                  "wrap",

                alignItems:
                  "center",
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
                {event.title}
              </strong>

              <span
                style={
                  groupBadge
                }
              >
                {groupLabel(
                  group
                )}
              </span>
            </div>

            <div
              style={{
                marginTop:
                  5,

                color:
                  "#6B6862",

                fontSize:
                  12,
              }}
            >
              {formatDateTime(
                event.occurredAt
              )}
            </div>
          </div>

          {event.actorEmail && (
            <div
              style={{
                color:
                  "#8A8782",

                fontSize:
                  11.5,

                textAlign:
                  "right",
              }}
            >
              {
                event.actorEmail
              }
            </div>
          )}
        </div>

        {event.detail && (
          <div
            style={{
              marginTop:
                10,

              paddingTop:
                10,

              borderTop:
                "1px solid #EEECE8",

              color:
                "#4F4D49",

              fontSize:
                12.5,

              lineHeight:
                1.5,

              overflowWrap:
                "anywhere",
            }}
          >
            {event.detail}
          </div>
        )}
      </div>
    </article>
  );
}

function groupForEvent(
  event:
    TimelineEvent
): FilterGroup {
  if (
    event.source ===
    "custody"
  ) {
    return "custody";
  }

  const value =
    event.eventType
      .toLowerCase();

  if (
    value.includes(
      "medication"
    ) ||
    value.includes(
      "medical"
    ) ||
    value.includes(
      "veterinary"
    )
  ) {
    return "medical";
  }

  if (
    value.includes(
      "behavior"
    )
  ) {
    return "behavior";
  }

  if (
    value.includes(
      "document"
    ) ||
    value.includes(
      "photo"
    )
  ) {
    return "documents";
  }

  if (
    value.includes(
      "expense"
    )
  ) {
    return "expenses";
  }

  if (
    value.includes(
      "reminder"
    ) ||
    value.includes(
      "offer"
    ) ||
    value.includes(
      "foster"
    ) ||
    value.includes(
      "help"
    )
  ) {
    return "tasks";
  }

  if (
    value.includes(
      "outcome"
    )
  ) {
    return "outcome";
  }

  return "profile";
}

function groupLabel(
  group:
    FilterGroup
) {
  const labels:
    Record<
      FilterGroup,
      string
    > = {
    all:
      "All",

    medical:
      "Medical",

    behavior:
      "Behavior",

    documents:
      "Documents",

    expenses:
      "Expenses",

    tasks:
      "Tasks / Help",

    profile:
      "Animal Record",

    custody:
      "Custody",

    outcome:
      "Outcome",
  };

  return labels[
    group
  ];
}

function formatDateTime(
  value:
    string
) {
  const date =
    new Date(
      value
    );

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
      month:
        "short",

      day:
        "numeric",

      year:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit",
    }
  );
}

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

const eyebrow:
  React.CSSProperties =
{
  margin:
    0,

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
};

const pageTitle:
  React.CSSProperties =
{
  margin:
    "5px 0 6px",

  fontSize:
    28,

  color:
    "#17233C",
};

const pageDescription:
  React.CSSProperties =
{
  margin:
    0,

  color:
    "#6B6862",

  fontSize:
    13.5,

  lineHeight:
    1.5,

  maxWidth:
    760,
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
  margin:
    0,

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

const timelineContainer:
  React.CSSProperties =
{
  display:
    "grid",

  gap:
    0,
};

const groupBadge:
  React.CSSProperties =
{
  display:
    "inline-block",

  borderRadius:
    20,

  padding:
    "3px 7px",

  fontSize:
    10.5,

  fontWeight:
    700,

  background:
    "#EEF1F5",

  color:
    "#52627A",
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

const errorBox:
  React.CSSProperties =
{
  padding:
    11,

  marginBottom:
    14,

  borderRadius:
    8,

  background:
    "#FFF4F2",

  border:
    "1px solid #F3C7BF",

  color:
    "#B23B2E",

  fontSize:
    13,
};
