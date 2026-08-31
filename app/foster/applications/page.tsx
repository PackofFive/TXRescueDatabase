"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type Offer = {
  id: string;
  animal_id: string;
  offer_type: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  city: string | null;
  postal_code: string | null;
  availability: string | null;
  household_info: string | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
  withdrawn_at: string | null;
  organization_id: string | null;
  animal_name: string;
  species: string;
  breed_or_type: string | null;
  organization_name: string | null;
};

const C = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  peach: "#FBE3DA",
  pink: "#F2D6DC",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
};

const FILTERS = [
  ["active", "Active"],
  ["accepted", "Accepted"],
  ["closed", "Closed"],
  ["all", "All"],
];

export default function FosterApplicationsPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filter, setFilter] = useState("active");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/foster/applications", {
      cache: "no-store",
    })
      .then(async (res) => {
        const data = await res.json();

        if (res.status === 401) {
          window.location.href =
            "/login?portal=foster";
          return;
        }

        if (!res.ok) {
          throw new Error(
            data.error ??
              "Couldn't load applications and offers."
          );
        }

        setOffers(data.offers ?? []);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load applications and offers."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const counts = useMemo(
    () => ({
      active: offers.filter((offer) =>
        ["new", "reviewing", "contacted"].includes(
          offer.status
        )
      ).length,
      accepted: offers.filter(
        (offer) => offer.status === "accepted"
      ).length,
      closed: offers.filter((offer) =>
        ["declined", "closed"].includes(
          offer.status
        )
      ).length,
    }),
    [offers]
  );

  const visible = useMemo(() => {
    if (filter === "all") {
      return offers;
    }

    if (filter === "active") {
      return offers.filter((offer) =>
        ["new", "reviewing", "contacted"].includes(
          offer.status
        )
      );
    }

    if (filter === "accepted") {
      return offers.filter(
        (offer) => offer.status === "accepted"
      );
    }

    return offers.filter((offer) =>
      ["declined", "closed"].includes(
        offer.status
      )
    );
  }, [filter, offers]);

  if (loading) {
    return (
      <p style={{ color: C.muted }}>
        Loading…
      </p>
    );
  }

  return (
    <section
      style={{
        width: "100%",
        maxWidth: 960,
        margin: "0 auto",
      }}
    >
      <p style={eyebrow}>
        Volunteer Portal
      </p>

      <h1 style={heading}>
        Applications &amp; Offers
      </h1>

      <p style={intro}>
        Track foster and help offers
        connected to your Foster
        Profile.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 10,
          margin: "18px 0 12px",
        }}
      >
        <Stat
          value={counts.active}
          label="Active"
        />
        <Stat
          value={counts.accepted}
          label="Accepted"
        />
        <Stat
          value={counts.closed}
          label="Closed"
        />
        <Stat
          value={offers.length}
          label="Total"
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 7,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        {FILTERS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() =>
              setFilter(value)
            }
            style={{
              ...filterButton,
              background:
                filter === value
                  ? C.navy
                  : C.white,
              color:
                filter === value
                  ? C.white
                  : C.navy,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p
          role="alert"
          style={{
            color: "#B23B2E",
            fontSize: 12.5,
          }}
        >
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <div style={card}>
          <strong
            style={{
              color: C.navy,
            }}
          >
            No offers in this view.
          </strong>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          {visible.map((offer) => {
            const open =
              expanded === offer.id;

            return (
              <article
                key={offer.id}
                style={card}
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpanded(
                      open
                        ? null
                        : offer.id
                    )
                  }
                  style={cardButton}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <strong
                        style={{
                          color: C.navy,
                          fontSize: 15,
                        }}
                      >
                        {offer.animal_name}
                      </strong>

                      <StatusBadge
                        status={offer.status}
                      />
                    </div>

                    <div
                      style={{
                        marginTop: 4,
                        color: C.muted,
                        fontSize: 11.5,
                      }}
                    >
                      {fmt(
                        offer.offer_type
                      )}
                      {" · "}
                      {offer.organization_name ??
                        "Organization"}
                      {" · "}
                      {new Date(
                        offer.created_at
                      ).toLocaleDateString()}
                    </div>
                  </div>

                  <span
                    style={{
                      color: C.muted,
                      fontSize: 14,
                    }}
                  >
                    {open ? "▲" : "▼"}
                  </span>
                </button>

                {open && (
                  <div
                    style={{
                      borderTop:
                        `1px solid ${C.border}`,
                      paddingTop: 13,
                      marginTop: 13,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(160px, 1fr))",
                        gap: 8,
                      }}
                    >
                      <Info
                        label="Animal"
                        value={[
                          offer.animal_name,
                          offer.species,
                          offer.breed_or_type,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      />

                      <Info
                        label="Organization"
                        value={
                          offer.organization_name ??
                          "—"
                        }
                      />

                      <Info
                        label="Status"
                        value={fmt(
                          offer.status
                        )}
                      />

                      <Info
                        label="Offer Type"
                        value={fmt(
                          offer.offer_type
                        )}
                      />
                    </div>

                    {offer.availability && (
                      <Section
                        title="Availability"
                        text={
                          offer.availability
                        }
                      />
                    )}

                    {offer.household_info && (
                      <Section
                        title="Household Information"
                        text={
                          offer.household_info
                        }
                      />
                    )}

                    {offer.message && (
                      <Section
                        title="Message"
                        text={offer.message}
                      />
                    )}

                    {offer.review_notes && (
                      <div
                        style={{
                          background: C.mint,
                          padding: 11,
                          marginTop: 12,
                        }}
                      >
                        <strong
                          style={{
                            color: C.navy,
                            fontSize: 11,
                            textTransform:
                              "uppercase",
                          }}
                        >
                          Rescue Review
                        </strong>

                        <p style={body}>
                          {
                            offer.review_notes
                          }
                        </p>
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginTop: 13,
                      }}
                    >
                      <a
                        href={`/animals/${encodeURIComponent(
                          offer.animal_id
                        )}`}
                        style={secondaryLink}
                      >
                        View Animal
                      </a>

                      {offer.organization_id && (
                        <a
                          href={`/organizations/${encodeURIComponent(
                            offer.organization_id
                          )}`}
                          style={secondaryLink}
                        >
                          View Organization
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Stat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        padding: 13,
      }}
    >
      <strong
        style={{
          display: "block",
          color: C.navy,
          fontSize: 22,
        }}
      >
        {value}
      </strong>

      <span
        style={{
          color: C.muted,
          fontSize: 11.5,
        }}
      >
        {label}
      </span>
    </div>
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
        background: "#F8FAFC",
        border: `1px solid ${C.border}`,
        padding: 10,
      }}
    >
      <div
        style={{
          color: C.muted,
          fontSize: 10,
          fontWeight: 800,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: C.navy,
          fontSize: 12.5,
          fontWeight: 700,
          marginTop: 4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Section({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        marginTop: 12,
      }}
    >
      <strong
        style={{
          color: C.navy,
          fontSize: 11,
          textTransform: "uppercase",
        }}
      >
        {title}
      </strong>

      <p style={body}>
        {text}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const background =
    status === "accepted"
      ? C.mint
      : ["new", "reviewing", "contacted"].includes(
          status
        )
      ? C.peach
      : C.pink;

  return (
    <span
      style={{
        background,
        color: C.navy,
        padding: "4px 7px",
        fontSize: 10,
        fontWeight: 800,
        textTransform: "uppercase",
      }}
    >
      {fmt(status)}
    </span>
  );
}

function fmt(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

const eyebrow:
  React.CSSProperties =
{
  margin: "0 0 6px",
  color: C.coral,
  fontSize: 11.5,
  fontWeight: 800,
  letterSpacing: ".1em",
  textTransform: "uppercase",
};

const heading:
  React.CSSProperties =
{
  margin: 0,
  color: C.navy,
  fontSize: 30,
};

const intro:
  React.CSSProperties =
{
  margin: "8px 0 0",
  color: C.muted,
  fontSize: 13.5,
  lineHeight: 1.55,
  maxWidth: 720,
};

const filterButton:
  React.CSSProperties =
{
  border: `1px solid ${C.border}`,
  padding: "8px 10px",
  fontSize: 11.5,
  fontWeight: 750,
  cursor: "pointer",
};

const card:
  React.CSSProperties =
{
  background: C.white,
  border: `1px solid ${C.border}`,
  padding: 15,
};

const cardButton:
  React.CSSProperties =
{
  width: "100%",
  border: "none",
  background: "transparent",
  padding: 0,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  textAlign: "left",
  cursor: "pointer",
  fontFamily: "inherit",
};

const body:
  React.CSSProperties =
{
  margin: "5px 0 0",
  color: C.muted,
  fontSize: 12.5,
  lineHeight: 1.5,
  whiteSpace: "pre-wrap",
};

const secondaryLink:
  React.CSSProperties =
{
  display: "inline-block",
  border: `1px solid ${C.border}`,
  color: C.navy,
  padding: "7px 10px",
  textDecoration: "none",
  fontSize: 11.5,
  fontWeight: 800,
};
