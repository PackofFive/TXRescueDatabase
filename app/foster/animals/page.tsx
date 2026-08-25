"use client";

import {
  useEffect,
  useState,
} from "react";

type FosterAnimal = {
  assignment_id: string;
  started_at: string;
  assignment_notes: string | null;

  id: string;
  display_name: string;
  species: string;
  breed_or_type: string | null;
  sex: string | null;
  age_estimate: string | null;
  size: string | null;
  weight_lbs: number | string | null;
  placement: string;
  urgency: string;
  notes: string | null;

  current_org_id: string;
  organization_name: string;

  access_level: string;
  can_submit_updates: boolean;
  can_add_photos: boolean;
  can_add_behavior_notes: boolean;
};

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  peach: "#FBE3DA",
  pink: "#F2D6DC",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
};

export default function FosterAnimalsPage() {
  const [
    animals,
    setAnimals,
  ] =
    useState<
      FosterAnimal[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  useEffect(() => {
    fetch(
      "/api/foster/animals",
      {
        cache:
          "no-store",
      }
    )
      .then(
        async (
          res
        ) => {
          const data =
            await res.json();

          if (
            res.status ===
            401
          ) {
            window.location.href =
              "/login?portal=foster";

            return;
          }

          if (!res.ok) {
            throw new Error(
              data.error ??
                "Couldn't load foster animals."
            );
          }

          setAnimals(
            data.animals ??
              []
          );
        }
      )
      .catch(
        (
          err
        ) => {
          setError(
            err instanceof Error
              ? err.message
              : "Couldn't load foster animals."
          );
        }
      )
      .finally(
        () => {
          setLoading(
            false
          );
        }
      );
  }, []);

  if (loading) {
    return (
      <p
        style={{
          color:
            COLORS.muted,
        }}
      >
        Loading…
      </p>
    );
  }

  return (
    <section
      style={{
        width:
          "100%",
        maxWidth:
          1000,
        margin:
          "0 auto",
      }}
    >
      <p
        style={
          eyebrowStyle
        }
      >
        Foster Portal
      </p>

      <h1
        style={
          headingStyle
        }
      >
        My Foster Animals
      </h1>

      <p
        style={
          introStyle
        }
      >
        Animals currently assigned to
        you by approved rescue or
        shelter organizations will
        appear here. Your available
        actions follow each
        organization&apos;s foster
        permissions.
      </p>

      {error && (
        <p
          role="alert"
          style={{
            color:
              "#B23B2E",
            fontSize:
              12.5,
          }}
        >
          {error}
        </p>
      )}

      {animals.length ===
      0 ? (
        <div
          style={
            emptyStyle
          }
        >
          <strong
            style={{
              display:
                "block",
              color:
                COLORS.navy,
              marginBottom:
                5,
            }}
          >
            No active foster animals.
          </strong>

          <p
            style={{
              margin:
                0,
              color:
                COLORS.muted,
              fontSize:
                13,
              lineHeight:
                1.5,
            }}
          >
            When an approved rescue or
            shelter assigns an animal
            to you, that animal will
            appear here.
          </p>
        </div>
      ) : (
        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap:
              12,
            marginTop:
              18,
          }}
        >
          {animals.map(
            (
              animal
            ) => (
              <AnimalCard
                key={
                  animal.assignment_id
                }
                animal={
                  animal
                }
              />
            )
          )}
        </div>
      )}
    </section>
  );
}

function AnimalCard({
  animal,
}: {
  animal:
    FosterAnimal;
}) {
  return (
    <article
      style={{
        background:
          COLORS.white,
        border:
          `1px solid ${COLORS.border}`,
        padding:
          16,
      }}
    >
      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          gap:
            10,
          alignItems:
            "flex-start",
          flexWrap:
            "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin:
                0,
              color:
                COLORS.navy,
              fontSize:
                18,
            }}
          >
            {
              animal.display_name
            }
          </h2>

          <p
            style={{
              margin:
                "5px 0 0",
              color:
                COLORS.muted,
              fontSize:
                12.5,
            }}
          >
            {
              [
                animal.species,
                animal.breed_or_type,
                animal.age_estimate,
                animal.size,
              ]
                .filter(
                  Boolean
                )
                .join(
                  " · "
                )
            }
          </p>
        </div>

        <span
          style={{
            background:
              COLORS.mint,
            color:
              COLORS.navy,
            padding:
              "5px 8px",
            fontSize:
              10.5,
            fontWeight:
              800,
            textTransform:
              "uppercase",
          }}
        >
          Assigned
        </span>
      </div>

      <div
        style={{
          marginTop:
            12,
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(130px, 1fr))",
          gap:
            8,
        }}
      >
        <Info
          label="Organization"
          value={
            animal.organization_name
          }
        />

        <Info
          label="Started"
          value={
            animal.started_at
              ? new Date(
                  animal.started_at
                ).toLocaleDateString()
              : "—"
          }
        />

        <Info
          label="Placement"
          value={
            formatValue(
              animal.placement
            )
          }
        />

        <Info
          label="Urgency"
          value={
            formatValue(
              animal.urgency
            )
          }
        />
      </div>

      {animal.assignment_notes && (
        <div
          style={{
            marginTop:
              12,
            background:
              COLORS.peach,
            padding:
              10,
          }}
        >
          <div
            style={{
              color:
                COLORS.navy,
              fontSize:
                10.5,
              fontWeight:
                800,
              textTransform:
                "uppercase",
              letterSpacing:
                ".04em",
            }}
          >
            Assignment Notes
          </div>

          <p
            style={{
              margin:
                "4px 0 0",
              color:
                COLORS.muted,
              fontSize:
                12.25,
              lineHeight:
                1.45,
              whiteSpace:
                "pre-wrap",
            }}
          >
            {
              animal.assignment_notes
            }
          </p>
        </div>
      )}

      <div
        style={{
          marginTop:
            14,
        }}
      >
        <h3
          style={{
            margin:
              "0 0 8px",
            color:
              COLORS.navy,
            fontSize:
              13,
          }}
        >
          Your Foster Access
        </h3>

        <div
          style={{
            display:
              "grid",
            gap:
              7,
          }}
        >
          <Permission
            enabled={
              animal.can_submit_updates
            }
            label="Submit Animal Updates"
          />

          <Permission
            enabled={
              animal.can_add_photos
            }
            label="Add Photos"
          />

          <Permission
            enabled={
              animal.can_add_behavior_notes
            }
            label="Add Behavior Notes"
          />
        </div>
      </div>

      <div
        style={{
          marginTop:
            14,
          display:
            "flex",
          gap:
            8,
          flexWrap:
            "wrap",
        }}
      >
        <a
          href={`/foster/animals/${encodeURIComponent(
            animal.id
          )}`}
          style={
            primaryLink
          }
        >
          Open Foster File
        </a>

        <a
          href={`/organizations/${encodeURIComponent(
            animal.current_org_id
          )}`}
          style={
            secondaryLink
          }
        >
          Organization
        </a>
      </div>
    </article>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background:
          "#F8FAFC",
        border:
          `1px solid ${COLORS.border}`,
        padding:
          9,
      }}
    >
      <div
        style={{
          color:
            COLORS.muted,
          fontSize:
            9.5,
          fontWeight:
            800,
          textTransform:
            "uppercase",
          letterSpacing:
            ".04em",
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop:
            3,
          color:
            COLORS.navy,
          fontSize:
            12,
          fontWeight:
            700,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Permission({
  enabled,
  label,
}: {
  enabled: boolean;
  label: string;
}) {
  return (
    <div
      style={{
        background:
          enabled
            ? COLORS.mint
            : "#F4F6F8",
        color:
          COLORS.navy,
        padding:
          "8px 9px",
        fontSize:
          11.5,
        fontWeight:
          700,
      }}
    >
      {enabled
        ? "✓ "
        : "— "}
      {label}
    </div>
  );
}

function formatValue(
  value: string
) {
  return (
    value || "—"
  )
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

const introStyle:
  React.CSSProperties =
{
  margin:
    "8px 0 0",
  color:
    COLORS.muted,
  fontSize:
    13.5,
  lineHeight:
    1.55,
  maxWidth:
    720,
};

const emptyStyle:
  React.CSSProperties =
{
  background:
    COLORS.white,
  border:
    `1px solid ${COLORS.border}`,
  padding:
    18,
  marginTop:
    18,
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
    "8px 11px",
  textDecoration:
    "none",
  fontSize:
    11.5,
  fontWeight:
    800,
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
    "7px 10px",
  textDecoration:
    "none",
  fontSize:
    11.5,
  fontWeight:
    800,
};
