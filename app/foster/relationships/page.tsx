"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type Relationship = {
  id: string;
  foster_id: string;
  organization_id: string;
  organization_name: string;
  organization_city: string | null;
  organization_county: string | null;
  status: string;
  access_level: string;
  can_submit_updates: boolean;
  can_add_photos: boolean;
  can_add_behavior_notes: boolean;
  approved_at: string | null;
  approved_by: string | null;
  inactive_at: string | null;
  organization_notes: string | null;
  created_at: string;
  updated_at: string;
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

export default function FosterRelationshipsPage() {
  const [
    relationships,
    setRelationships,
  ] =
    useState<
      Relationship[]
    >([]);

  const [
    expanded,
    setExpanded,
  ] =
    useState<
      string | null
    >(null);

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
      "/api/foster/relationships",
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
                "Couldn't load rescue relationships."
            );
          }

          setRelationships(
            data.relationships ??
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
              : "Couldn't load rescue relationships."
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

  const stats =
    useMemo(
      () => ({
        approved:
          relationships.filter(
            (
              item
            ) =>
              item.status ===
              "approved"
          ).length,

        pending:
          relationships.filter(
            (
              item
            ) =>
              item.status ===
              "pending"
          ).length,

        inactive:
          relationships.filter(
            (
              item
            ) =>
              item.status !==
                "approved" &&
              item.status !==
                "pending"
          ).length,
      }),
      [relationships]
    );

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
          920,
        margin:
          "0 auto",
      }}
    >
      <p
        style={
          eyebrowStyle
        }
      >
        Volunteer Portal
      </p>

      <h1
        style={
          headingStyle
        }
      >
        Rescue Relationships
      </h1>

      <p
        style={
          introStyle
        }
      >
        View the rescue and shelter
        organizations connected to
        your Foster Profile. Each
        organization keeps its own
        approval status and foster
        permissions.
      </p>

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
            stats.approved
          }
          label="Approved"
        />

        <StatCard
          value={
            stats.pending
          }
          label="Pending"
        />

        <StatCard
          value={
            stats.inactive
          }
          label="Inactive"
        />
      </div>

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

      {relationships.length ===
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
            No rescue relationships yet.
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
            Approved rescue relationships
            and pending invitations will
            appear here.
          </p>
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
          {relationships.map(
            (
              relationship
            ) => (
              <RelationshipCard
                key={
                  relationship.id
                }
                relationship={
                  relationship
                }
                expanded={
                  expanded ===
                  relationship.id
                }
                onToggle={() =>
                  setExpanded(
                    (
                      current
                    ) =>
                      current ===
                      relationship.id
                        ? null
                        : relationship.id
                  )
                }
              />
            )
          )}
        </div>
      )}
    </section>
  );
}

function RelationshipCard({
  relationship,
  expanded,
  onToggle,
}: {
  relationship:
    Relationship;
  expanded:
    boolean;
  onToggle:
    () => void;
}) {
  const statusStyle =
    getStatusStyle(
      relationship.status
    );

  const location =
    [
      relationship.organization_city,
      relationship.organization_county
        ? `${relationship.organization_county} County`
        : null,
    ]
      .filter(
        Boolean
      )
      .join(
        " · "
      );

  return (
    <article
      style={{
        background:
          COLORS.white,
        border:
          `1px solid ${COLORS.border}`,
      }}
    >
      <button
        type="button"
        onClick={
          onToggle
        }
        aria-expanded={
          expanded
        }
        style={{
          width:
            "100%",
          border:
            "none",
          background:
            "transparent",
          padding:
            16,
          cursor:
            "pointer",
          display:
            "grid",
          gridTemplateColumns:
            "minmax(0, 1fr) auto",
          gap:
            12,
          alignItems:
            "center",
          textAlign:
            "left",
          fontFamily:
            "inherit",
        }}
      >
        <div>
          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap:
                8,
              flexWrap:
                "wrap",
            }}
          >
            <strong
              style={{
                color:
                  COLORS.navy,
                fontSize:
                  15,
              }}
            >
              {
                relationship.organization_name
              }
            </strong>

            <span
              style={{
                ...statusStyle,
                fontSize:
                  10.5,
                fontWeight:
                  800,
                textTransform:
                  "uppercase",
                letterSpacing:
                  ".05em",
                padding:
                  "4px 7px",
              }}
            >
              {formatValue(
                relationship.status
              )}
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
            {location ||
              "Location not listed"}
          </div>
        </div>

        <span
          aria-hidden="true"
          style={{
            color:
              COLORS.navy,
            fontSize:
              18,
            lineHeight:
              1,
            transform:
              expanded
                ? "rotate(180deg)"
                : "rotate(0deg)",
            transition:
              "transform .15s ease",
          }}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div
          style={{
            borderTop:
              `1px solid ${COLORS.border}`,
            padding:
              16,
            display:
              "grid",
            gap:
              16,
          }}
        >
          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(160px, 1fr))",
              gap:
                10,
            }}
          >
            <InfoBox
              label="Relationship Status"
              value={
                formatValue(
                  relationship.status
                )
              }
            />

            <InfoBox
              label="Access Level"
              value={
                formatValue(
                  relationship.access_level
                )
              }
            />

            <InfoBox
              label="Approved"
              value={
                relationship.approved_at
                  ? new Date(
                      relationship.approved_at
                    ).toLocaleDateString()
                  : "Not yet approved"
              }
            />
          </div>

          <div>
            <h2
              style={{
                margin:
                  "0 0 8px",
                color:
                  COLORS.navy,
                fontSize:
                  14,
              }}
            >
              Foster Permissions
            </h2>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap:
                  8,
              }}
            >
              <Permission
                label="Submit Animal Updates"
                enabled={
                  relationship.can_submit_updates
                }
              />

              <Permission
                label="Add Photos"
                enabled={
                  relationship.can_add_photos
                }
              />

              <Permission
                label="Add Behavior Notes"
                enabled={
                  relationship.can_add_behavior_notes
                }
              />
            </div>
          </div>

          {relationship.organization_notes && (
            <div>
              <h2
                style={{
                  margin:
                    "0 0 6px",
                  color:
                    COLORS.navy,
                  fontSize:
                    14,
                }}
              >
                Organization Notes
              </h2>

              <p
                style={{
                  margin:
                    0,
                  color:
                    COLORS.muted,
                  fontSize:
                    12.5,
                  lineHeight:
                    1.5,
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {
                  relationship.organization_notes
                }
              </p>
            </div>
          )}

          <div
            style={{
              paddingTop:
                4,
              display:
                "flex",
              gap:
                10,
              flexWrap:
                "wrap",
            }}
          >
            <a
              href={`/organizations/${encodeURIComponent(
                relationship.organization_id
              )}`}
              style={
                secondaryLink
              }
            >
              View Public Organization
            </a>
          </div>
        </div>
      )}
    </article>
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
          COLORS.mint,
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

function InfoBox({
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
          11,
      }}
    >
      <div
        style={{
          color:
            COLORS.muted,
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
        {label}
      </div>

      <div
        style={{
          color:
            COLORS.navy,
          fontSize:
            12.5,
          fontWeight:
            700,
          marginTop:
            4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Permission({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
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
          "9px 10px",
        fontSize:
          12,
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

function getStatusStyle(
  status: string
):
  React.CSSProperties {
  if (
    status ===
    "approved"
  ) {
    return {
      background:
        COLORS.mint,
      color:
        COLORS.navy,
    };
  }

  if (
    status ===
    "pending"
  ) {
    return {
      background:
        COLORS.peach,
      color:
        COLORS.navy,
    };
  }

  return {
    background:
      COLORS.pink,
    color:
      COLORS.navy,
  };
}

function formatValue(
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
    700,
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
    "8px 11px",
  textDecoration:
    "none",
  fontSize:
    12,
  fontWeight:
    800,
};

