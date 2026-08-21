"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

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
};

type OfferStatus =
  | "new"
  | "reviewing"
  | "contacted"
  | "accepted"
  | "declined"
  | "closed";

type Offer = {
  id: string;
  animal_id: string;

  offer_type:
    string;

  contact_name:
    string;

  contact_email:
    string;

  contact_phone:
    string;

  city:
    | string
    | null;

  postal_code:
    | string
    | null;

  availability:
    | string
    | null;

  household_info:
    | string
    | null;

  message:
    | string
    | null;

  status:
    OfferStatus;

  created_at:
    string;

  updated_at:
    string;
};

const STATUS_OPTIONS: {
  value: OfferStatus;
  label: string;
}[] = [
  {
    value: "new",
    label: "New",
  },
  {
    value: "reviewing",
    label: "Reviewing",
  },
  {
    value: "contacted",
    label: "Contacted",
  },
  {
    value: "accepted",
    label: "Accepted",
  },
  {
    value: "declined",
    label: "Declined",
  },
  {
    value: "closed",
    label: "Closed",
  },
];

export default function AnimalOffersPage() {
  const params =
    useParams();

  const animalId =
    params?.id as string;

  const [
    animal,
    setAnimal,
  ] =
    useState<
      Animal | null
    >(null);

  const [
    offers,
    setOffers,
  ] =
    useState<Offer[]>([]);

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

  const [
    filter,
    setFilter,
  ] =
    useState<
      "active" | "all"
    >("active");

  useEffect(() => {
    if (!animalId) {
      return;
    }

    loadOffers();
  }, [animalId]);

  async function loadOffers() {
    setLoading(true);
    setError(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/offers`,
          {
            cache:
              "no-store",
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't load offers."
        );
      }

      setAnimal(
        data.animal
      );

      setOffers(
        data.offers ??
          []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load offers."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    offerId: string,
    status: OfferStatus
  ) {
    setError(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/offers`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                offerId,
                status,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't update offer."
        );
      }

      setOffers(
        (current) =>
          current.map(
            (offer) =>
              offer.id ===
              offerId
                ? {
                    ...offer,
                    status:
                      data.offer
                        .status,
                    updated_at:
                      data.offer
                        .updated_at,
                  }
                : offer
          )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't update offer."
      );
    }
  }

  const visibleOffers =
    useMemo(() => {
      if (
        filter ===
        "all"
      ) {
        return offers;
      }

      return offers.filter(
        (offer) =>
          [
            "new",
            "reviewing",
            "contacted",
          ].includes(
            offer.status
          )
      );
    }, [
      offers,
      filter,
    ]);

  const newCount =
    offers.filter(
      (offer) =>
        offer.status ===
        "new"
    ).length;

  const activeCount =
    offers.filter(
      (offer) =>
        [
          "new",
          "reviewing",
          "contacted",
        ].includes(
          offer.status
        )
    ).length;

  if (loading) {
    return <p>Loading…</p>;
  }

  const displayName =
    animal?.name ||
    animal?.temporary_name ||
    "Animal";

  return (
    <section>
      <a
        href={`/animals/${encodeURIComponent(
          animalId
        )}`}
        style={{
          color:
            "#C05621",
          textDecoration:
            "none",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        ← Back to{" "}
        {displayName}
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
            color:
              "#6B6862",
            letterSpacing:
              ".08em",
          }}
        >
          PRIVATE RESCUE MANAGER
        </p>

        <h1
          style={{
            color:
              "#17233C",
            fontSize: 28,
            margin:
              "6px 0 7px",
          }}
        >
          Foster & Help Offers
        </h1>

        <p
          style={{
            margin: 0,
            color:
              "#6B6862",
            lineHeight: 1.55,
            maxWidth: 700,
          }}
        >
          Offers submitted by
          members of the public
          for {displayName}.
          Contact information
          shown here is private
          to the managing
          organization.
        </p>
      </div>

      {/* COUNTS */}

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <CountCard
          value={newCount}
          label="New"
        />

        <CountCard
          value={activeCount}
          label="Active"
        />

        <CountCard
          value={
            offers.length
          }
          label="Total"
        />
      </div>

      {/* FILTER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 7,
          }}
        >
          <button
            type="button"
            onClick={() =>
              setFilter(
                "active"
              )
            }
            style={
              filter ===
              "active"
                ? activeFilter
                : inactiveFilter
            }
          >
            Active Offers
          </button>

          <button
            type="button"
            onClick={() =>
              setFilter(
                "all"
              )
            }
            style={
              filter ===
              "all"
                ? activeFilter
                : inactiveFilter
            }
          >
            All Offers
          </button>
        </div>

        <span
          style={{
            fontSize: 12.5,
            color:
              "#6B6862",
          }}
        >
          {
            visibleOffers.length
          }{" "}
          shown
        </span>
      </div>

      {error && (
        <div
          style={{
            color:
              "#B23B2E",
            background:
              "#FFF4F2",
            border:
              "1px solid #F3C7BF",
            borderRadius: 8,
            padding: 12,
            marginBottom: 14,
          }}
        >
          {error}
        </div>
      )}

      {visibleOffers.length ===
        0 && (
        <div
          style={{
            background:
              "#fff",
            border:
              "1px dashed #D8D6D2",
            borderRadius: 10,
            padding: 22,
          }}
        >
          <strong
            style={{
              display:
                "block",
              color:
                "#17233C",
              marginBottom: 5,
            }}
          >
            No offers here
          </strong>

          <p
            style={{
              margin: 0,
              color:
                "#6B6862",
              fontSize: 13.5,
            }}
          >
            New public foster or
            help offers will
            appear here
            automatically.
          </p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gap: 14,
        }}
      >
        {visibleOffers.map(
          (offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onStatusChange={
                updateStatus
              }
            />
          )
        )}
      </div>
    </section>
  );
}

function OfferCard({
  offer,
  onStatusChange,
}: {
  offer: Offer;

  onStatusChange: (
    id: string,
    status: OfferStatus
  ) => void;
}) {
  return (
    <article
      style={{
        background: "#fff",
        border:
          offer.status ===
          "new"
            ? "1px solid #B9C1CF"
            : "1px solid #E7E5E1",

        borderRadius: 10,
        padding: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems:
                "center",
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 17,
                color:
                  "#17233C",
              }}
            >
              {offer.contact_name}
            </h2>

            <StatusBadge
              status={
                offer.status
              }
            />

            <span
              style={{
                fontSize: 11.5,
                color:
                  "#6B6862",
                fontWeight: 700,
                textTransform:
                  "uppercase",
              }}
            >
              {formatValue(
                offer.offer_type
              )}
            </span>
          </div>

          <div
            style={{
              marginTop: 5,
              fontSize: 12.5,
              color:
                "#6B6862",
            }}
          >
            Submitted{" "}
            {formatDateTime(
              offer.created_at
            )}
          </div>
        </div>

        <select
          value={offer.status}
          onChange={(e) =>
            onStatusChange(
              offer.id,
              e.target
                .value as OfferStatus
            )
          }
          style={{
            border:
              "1px solid #D8D6D2",
            borderRadius: 6,
            padding:
              "7px 9px",
            fontFamily:
              "inherit",
            background:
              "#fff",
          }}
        >
          {STATUS_OPTIONS.map(
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

      {/* CONTACT */}

      <div
        style={{
          marginTop: 16,
          padding: 14,
          background:
            "#F7F7F5",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color:
              "#6B6862",
            letterSpacing:
              ".06em",
            textTransform:
              "uppercase",
            marginBottom: 9,
          }}
        >
          Private Contact
          Information
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 10,
          }}
        >
          <Info
            label="Email"
            value={
              offer.contact_email
            }
            href={`mailto:${offer.contact_email}`}
          />

          <Info
            label="Phone"
            value={
              offer.contact_phone
            }
            href={`tel:${offer.contact_phone.replace(
              /[^\d+]/g,
              ""
            )}`}
          />

          <Info
            label="Location"
            value={
              [
                offer.city,
                offer.postal_code,
              ]
                .filter(
                  Boolean
                )
                .join(
                  ", "
                ) ||
              null
            }
          />
        </div>
      </div>

      <Detail
        label="Availability"
        value={
          offer.availability
        }
      />

      <Detail
        label="Household / Foster Information"
        value={
          offer.household_info
        }
      />

      <Detail
        label="Message"
        value={
          offer.message
        }
      />
    </article>
  );
}

function StatusBadge({
  status,
}: {
  status: OfferStatus;
}) {
  const styles:
    Record<
      OfferStatus,
      React.CSSProperties
    > = {
    new: {
      background:
        "#E4ECF3",
      color:
        "#2B5C8A",
    },

    reviewing: {
      background:
        "#FBEFD9",
      color:
        "#85571F",
    },

    contacted: {
      background:
        "#EEEAF6",
      color:
        "#66528A",
    },

    accepted: {
      background:
        "#E6F1E9",
      color:
        "#2F6F4E",
    },

    declined: {
      background:
        "#FAE7E3",
      color:
        "#B23B2E",
    },

    closed: {
      background:
        "#EDEBE8",
      color:
        "#6B6862",
    },
  };

  return (
    <span
      style={{
        ...styles[
          status
        ],
        padding:
          "4px 8px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {formatValue(
        status
      )}
    </span>
  );
}

function CountCard({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border:
          "1px solid #E7E5E1",
        borderRadius: 8,
        padding:
          "10px 15px",
        minWidth: 85,
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color:
            "#17233C",
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: 11.5,
          color:
            "#6B6862",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  href,
}: {
  label: string;

  value:
    | string
    | null;

  href?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color:
            "#6B6862",
          marginBottom: 3,
        }}
      >
        {label}
      </div>

      {value ? (
        href ? (
          <a
            href={href}
            style={{
              color:
                "#17233C",
              fontSize: 13,
              fontWeight: 600,
              textDecoration:
                "none",
              overflowWrap:
                "anywhere",
            }}
          >
            {value}
          </a>
        ) : (
          <div
            style={{
              color:
                "#1C1B19",
              fontSize: 13,
            }}
          >
            {value}
          </div>
        )
      ) : (
        <div
          style={{
            color:
              "#9A9690",
            fontSize: 13,
          }}
        >
          Not provided
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;

  value:
    | string
    | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: 14,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color:
            "#6B6862",
          textTransform:
            "uppercase",
          letterSpacing:
            ".05em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 13.5,
          color:
            "#3F3D39",
          lineHeight: 1.55,
          whiteSpace:
            "pre-wrap",
        }}
      >
        {value}
      </div>
    </div>
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

const activeFilter:
  React.CSSProperties =
{
  background: "#17233C",
  color: "#fff",
  border:
    "1px solid #17233C",
  borderRadius: 7,
  padding:
    "7px 11px",
  fontWeight: 700,
  cursor: "pointer",
};

const inactiveFilter:
  React.CSSProperties =
{
  background: "#fff",
  color: "#17233C",
  border:
    "1px solid #D8D6D2",
  borderRadius: 7,
  padding:
    "7px 11px",
  fontWeight: 600,
  cursor: "pointer",
};
