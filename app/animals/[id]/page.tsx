"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

type TimelineEvent = {
  id: string;
  event_type: string;
  org_id: string | null;
  started_at: string;
};

type Animal = {
  id: string;

  name: string | null;

  temporary_name:
    | string
    | null;

  species: string;

  breed_or_type:
    | string
    | null;

  source:
    | string
    | null;

  custody: string;

  urgency:
    | string
    | null;

  placement:
    | string
    | null;

  notes:
    | string
    | null;

  created_at: string;

  photo:
    | {
        id: string;
        url: string;
        source:
          | string
          | null;
        visibility:
          | string
          | null;
      }
    | null;

  timeline:
    TimelineEvent[];
};

export default function AnimalRecordPage() {
  const params =
    useParams();

  const animalId =
    params?.id as string;

  const [animal, setAnimal] =
    useState<Animal | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    if (!animalId) return;

    fetch(
      `/api/animals/${encodeURIComponent(
        animalId
      )}`,
      {
        cache: "no-store",
      }
    )
      .then(async (r) => {
        const data =
          await r.json();

        if (!r.ok) {
          throw new Error(
            data.error ??
              "Failed to load animal."
          );
        }

        setAnimal(
          data.animal
        );
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load animal."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [animalId]);

  if (loading) {
    return <p>Loading…</p>;
  }

  if (error) {
    return (
      <div>
        <a
          href="/animals"
          style={{
            fontSize: 13,
            color: "#C05621",
            textDecoration:
              "none",
          }}
        >
          ← Back to Animals
        </a>

        <p
          style={{
            color: "#B23B2E",
          }}
        >
          {error}
        </p>
      </div>
    );
  }

  if (!animal) {
    return null;
  }

  const displayName =
    animal.name ||
    animal.temporary_name ||
    "Unnamed Animal";

  return (
    <section>
      <a
        href="/animals"
        style={{
          fontSize: 12.5,
          color: "#C05621",
          textDecoration:
            "none",
        }}
      >
        ← Back to Animals
      </a>

      {/* ===============================================
          ANIMAL HEADER
      ================================================ */}

      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems:
            "flex-start",
          marginTop: 18,
          marginBottom: 28,
          flexWrap: "wrap",
        }}
      >
        {animal.photo?.url ? (
          <img
            src={
              animal.photo.url
            }
            alt={displayName}
            style={{
              width: 150,
              height: 150,
              borderRadius: 10,
              objectFit: "cover",
              border:
                "1px solid #E7E5E1",
            }}
          />
        ) : (
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: 10,
              background:
                "#F2F2F0",
              border:
                "1px solid #E7E5E1",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              color:
                "#8A8782",
              fontSize: 13,
              textAlign:
                "center",
              padding: 12,
              boxSizing:
                "border-box",
            }}
          >
            No photo yet
          </div>
        )}

        <div
          style={{
            flex: 1,
            minWidth: 250,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing:
                ".08em",
              color:
                "#6B6862",
            }}
          >
            ANIMAL RECORD
          </p>

          <h1
            style={{
              fontSize: 30,
              color:
                "#17233C",
              margin:
                "5px 0 6px",
            }}
          >
            {displayName}
          </h1>

          <p
            style={{
              margin:
                "0 0 12px",
              color:
                "#6B6862",
              fontSize: 14,
            }}
          >
            {[
              animal.species,
              animal.breed_or_type,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap:
                "wrap",
            }}
          >
            <StatusBadge
              label={`Custody: ${animal.custody}`}
            />

            {animal.placement && (
              <StatusBadge
                label={`Placement: ${animal.placement}`}
              />
            )}

            {animal.urgency && (
              <StatusBadge
                label={`Urgency: ${animal.urgency}`}
              />
            )}
          </div>
        </div>
      </div>

      {/* ===============================================
          NEEDS ATTENTION PLACEHOLDER
      ================================================ */}

      <div
        style={{
          border:
            "1px solid #E7E5E1",
          background:
            "#FAFAF9",
          borderRadius: 9,
          padding: 15,
          marginBottom: 22,
        }}
      >
        <strong
          style={{
            color:
              "#17233C",
          }}
        >
          Needs Attention
        </strong>

        <p
          style={{
            margin:
              "5px 0 0",
            color:
              "#6B6862",
            fontSize: 13.5,
            lineHeight: 1.5,
          }}
        >
          As this record is
          completed, important
          missing information,
          overdue care,
          medications,
          foster tasks, and
          other priority items
          will appear here.
        </p>
      </div>

      {/* ===============================================
          RECORD SECTIONS
      ================================================ */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        <RecordCard
          title="Overview"
          text="Identity, source, intake details, current status, and general notes."
          active
        />

        <RecordCard
          title="Medical"
          text="Veterinary history, vaccinations, procedures, conditions, medications, and reminders."
          href={`/animals/${encodeURIComponent(animal.id)}/medical`}
        />

        <RecordCard
          title="Foster"
          text="Current foster placement, assignments, checklists, availability, and foster history."
        />

        <RecordCard
          title="Behavior"
          text="Behavior observations, assessments, training notes, and foster updates."
        />

        <RecordCard
          title="Expenses"
          text="Optional animal-specific expense and support tracking."
        />

        <RecordCard
          title="Documents & Photos"
          text="Photos, veterinary documents, intake paperwork, IDs, and other files."
        />

        <RecordCard
          title="Timeline"
          text="Intake, transfers, custody changes, foster placements, and other important events."
        />

        <RecordCard
          title="Outcome"
          text="Adoption, transfer, return, release, or other final outcome information."
        />
      </div>

      {/* ===============================================
          OVERVIEW
      ================================================ */}

      <div
        style={{
          background:
            "#fff",
          border:
            "1px solid #E7E5E1",
          borderRadius: 10,
          padding: 20,
          marginBottom: 18,
        }}
      >
        <h2
          style={{
            fontSize: 18,
            color:
              "#17233C",
            margin:
              "0 0 16px",
          }}
        >
          Overview
        </h2>

        <InfoRow
          label="Species"
          value={
            animal.species
          }
        />

        <InfoRow
          label="Breed / type"
          value={
            animal.breed_or_type
          }
        />

        <InfoRow
          label="Source"
          value={
            animal.source
          }
        />

        <InfoRow
          label="Current custody"
          value={
            animal.custody
          }
        />

        <InfoRow
          label="Current placement"
          value={
            animal.placement
          }
        />

        <InfoRow
          label="Urgency"
          value={
            animal.urgency
          }
        />

        <InfoRow
          label="Record created"
          value={formatDate(
            animal.created_at
          )}
        />

        <div
          style={{
            marginTop: 16,
          }}
        >
          <div
            style={{
              fontSize: 11.5,
              textTransform:
                "uppercase",
              letterSpacing:
                ".05em",
              color:
                "#6B6862",
              marginBottom: 5,
            }}
          >
            Notes
          </div>

          <div
            style={{
              fontSize: 14,
              color:
                "#3F3D39",
              lineHeight: 1.6,
              whiteSpace:
                "pre-wrap",
            }}
          >
            {animal.notes ||
              "No notes recorded yet."}
          </div>
        </div>
      </div>

      {/* ===============================================
          TIMELINE PREVIEW
      ================================================ */}

      <div
        style={{
          background:
            "#fff",
          border:
            "1px solid #E7E5E1",
          borderRadius: 10,
          padding: 20,
        }}
      >
        <h2
          style={{
            fontSize: 18,
            color:
              "#17233C",
            margin:
              "0 0 14px",
          }}
        >
          Timeline
        </h2>

        {animal.timeline.length ===
          0 && (
          <p
            style={{
              color:
                "#6B6862",
              fontSize: 13.5,
            }}
          >
            No timeline events
            have been recorded.
          </p>
        )}

        {animal.timeline.map(
          (event) => (
            <div
              key={
                event.id
              }
              style={{
                borderLeft:
                  "3px solid #D8D6D2",
                paddingLeft:
                  12,
                marginBottom:
                  14,
              }}
            >
              <strong
                style={{
                  display:
                    "block",
                  fontSize:
                    13.5,
                  color:
                    "#17233C",
                  textTransform:
                    "capitalize",
                }}
              >
                {event.event_type.replace(
                  /_/g,
                  " "
                )}
              </strong>

              <span
                style={{
                  fontSize: 12,
                  color:
                    "#6B6862",
                }}
              >
                {formatDate(
                  event.started_at
                )}
              </span>
            </div>
          )
        )}
      </div>
    </section>
  );
}

function RecordCard({
  title,
  text,
  active = false,
  href,
}: {
  title: string;
  text: string;
  active?: boolean;
  href?: string;
}) {
  const content = (
    <>
      <strong
        style={{
          display: "block",
          color: "#17233C",
          fontSize: 15,
          marginBottom: 6,
        }}
      >
        {title}
      </strong>

      <p
        style={{
          margin: 0,
          color: "#6B6862",
          fontSize: 12.5,
          lineHeight: 1.5,
        }}
      >
        {text}
      </p>
    </>
  );

  const style = {
    display: "block",
    background: active
      ? "#F6F7F8"
      : "#fff",
    border: active
      ? "1px solid #B9C1CF"
      : "1px solid #E7E5E1",
    borderRadius: 9,
    padding: 15,
    textDecoration: "none",
  } as const;

  return href ? (
    <a href={href} style={style}>
      {content}
    </a>
  ) : (
    <div style={style}>
      {content}
    </div>
  );
}

function StatusBadge({
  label,
}: {
  label: string;
}) {
  return (
    <span
      style={{
        display:
          "inline-block",
        background:
          "#F1F3F5",
        border:
          "1px solid #E0E3E7",
        borderRadius: 20,
        padding:
          "5px 9px",
        color:
          "#4F5661",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value:
    | string
    | null;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "150px minmax(0, 1fr)",
        gap: 12,
        padding:
          "8px 0",
        borderBottom:
          "1px solid #F0EFED",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color:
            "#6B6862",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 13.5,
          color:
            "#1C1B19",
        }}
      >
        {value ||
          "Not recorded"}
      </div>
    </div>
  );
}

function formatDate(
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

  return date.toLocaleDateString();
}
