"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type Organization = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
};

type PublicAnimal = {
  id: string;
  name: string | null;
  species: string | null;
  breed_or_type: string | null;
  birth_date: string | null;
  sex: string | null;
  weight_lbs: string | number | null;

  public_summary: string | null;
  public_need: string | null;
  external_listing_url: string | null;

  outcome_status: string | null;
  outcome_date: string | null;
  public_outcome_message: string | null;
  show_on_success_wall: boolean;

  active_help_offer_count: number;

  photo: {
    id: string;
    url: string;
    source: string | null;
    visibility: string | null;
  } | null;

  organization: Organization;
};

export default function PublicAnimalPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const animalId = params?.id as string;
  const returnTo = searchParams.get("returnTo");

  const [animal, setAnimal] = useState<PublicAnimal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!animalId) return;

    async function loadAnimal() {
      try {
        const res = await fetch(
          `/api/public/animals/${encodeURIComponent(animalId)}`,
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error ?? "This profile is not available."
          );
        }

        setAnimal(data.animal);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "This profile is not available."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnimal();
  }, [animalId]);

  if (loading) {
    return <p>Loading…</p>;
  }

  if (error || !animal) {
    return (
      <section
        style={{
          maxWidth: 760,
          margin: "20px auto",
        }}
      >
        <h1
          style={{
            color: "#17233C",
          }}
        >
          Profile unavailable
        </h1>

        <p
          style={{
            color: "#6B6862",
          }}
        >
          {error ??
            "This animal's public profile is not currently available."}
        </p>

        <a
          href="/adoptable"
          style={textLink}
        >
          Browse Adoptable Pets
        </a>
      </section>
    );
  }

  const adopted =
    animal.outcome_status?.toLowerCase() === "adopted";

  const displayName =
    animal.name || "Animal";

  const organizationLocation = [
    animal.organization.city,
    animal.organization.state,
  ]
    .filter(Boolean)
    .join(", ");

  const age =
    calculateAge(animal.birth_date);

  return (
    <section
      style={{
        maxWidth: 980,
        margin: "0 auto",
      }}
    >
      {/* RETURN NAVIGATION */}

      {returnTo ? (
        <a
          href={returnTo}
          style={textLink}
        >
          ← Back
        </a>
      ) : (
        <a
          href={`/organizations/${encodeURIComponent(
            animal.organization.id
          )}/adoptable`}
          style={textLink}
        >
          ← More animals from {animal.organization.name}
        </a>
      )}

      {/* ADOPTED BANNER */}

      {adopted && (
        <div
          style={{
            marginTop: 18,
            background: "#EEF4F0",
            border: "1px solid #C9DDD1",
            borderRadius: 10,
            padding: 16,
            color: "#2F6F4E",
          }}
        >
          <strong
            style={{
              fontSize: 17,
            }}
          >
            Adopted
          </strong>

          {animal.outcome_date && (
            <div
              style={{
                fontSize: 12.5,
                marginTop: 3,
              }}
            >
              Adopted {formatDate(animal.outcome_date)}
            </div>
          )}

          {animal.public_outcome_message && (
            <p
              style={{
                margin: "8px 0 0",
                lineHeight: 1.55,
                color: "#3F684F",
              }}
            >
              {animal.public_outcome_message}
            </p>
          )}
        </div>
      )}

      {/* MAIN PROFILE */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(260px, 380px) minmax(0, 1fr)",
          gap: 28,
          marginTop: 20,
          alignItems: "start",
        }}
      >
        <div>
          {animal.photo?.url ? (
            <img
              src={animal.photo.url}
              alt={displayName}
              style={{
                width: "100%",
                aspectRatio: "4 / 3",
                objectFit: "cover",
                borderRadius: 12,
                border: "1px solid #E7E5E1",
                background: "#F2F2F0",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                aspectRatio: "4 / 3",
                display: "grid",
                placeItems: "center",
                borderRadius: 12,
                border: "1px solid #E7E5E1",
                background: "#F2F2F0",
                color: "#8A8782",
              }}
            >
              No public photo
            </div>
          )}
        </div>

        <div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: ".08em",
              color: "#6B6862",
              textTransform: "uppercase",
            }}
          >
            {adopted
              ? "Success Story"
              : "Public Animal Profile"}
          </p>

          <h1
            style={{
              color: "#17233C",
              fontSize: 36,
              margin: "6px 0 8px",
            }}
          >
            {displayName}
          </h1>

          <p
            style={{
              margin: "0 0 15px",
              color: "#6B6862",
              fontSize: 15,
            }}
          >
            {[
              age,
              animal.breed_or_type || animal.species,
              animal.sex,
              animal.weight_lbs != null
                ? `${animal.weight_lbs} lb`
                : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>

          <a
            href={`/organizations#org-${encodeURIComponent(
              animal.organization.id
            )}`}
            style={{
              color: "#C05621",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 13.5,
            }}
          >
            {animal.organization.name}
          </a>

          {organizationLocation && (
            <span
              style={{
                marginLeft: 6,
                color: "#6B6862",
                fontSize: 13,
              }}
            >
              · {organizationLocation}
            </span>
          )}

          {/* CURRENT NEED */}

          {!adopted && animal.public_need && (
            <div
              style={{
                marginTop: 20,
                background: "#FFF8F5",
                border: "1px solid #F0D3C9",
                borderRadius: 9,
                padding: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: "#A04B35",
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                  marginBottom: 5,
                }}
              >
                Current Need
              </div>

              <div
                style={{
                  color: "#3F3D39",
                  lineHeight: 1.55,
                }}
              >
                {animal.public_need}
              </div>
            </div>
          )}

          {/* PUBLIC SUMMARY */}

          {animal.public_summary && (
            <div
              style={{
                marginTop: 22,
              }}
            >
              <h2
                style={{
                  color: "#17233C",
                  fontSize: 18,
                  margin: "0 0 7px",
                }}
              >
                About {displayName}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#4F4D49",
                  fontSize: 14,
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}
              >
                {animal.public_summary}
              </p>
            </div>
          )}

          {/* ACTIONS */}

          {!adopted && (
            <div
              style={{
                display: "flex",
                gap: 9,
                flexWrap: "wrap",
                marginTop: 24,
              }}
            >
              <a
                href={`/pet/${encodeURIComponent(
                  animal.id
                )}/help`}
                style={primaryButton}
              >
                Offer Foster / Help
              </a>

              {animal.external_listing_url && (
                <a
                  href={animal.external_listing_url}
                  target="_blank"
                  rel="noreferrer"
                  style={secondaryButton}
                >
                  Adoption Listing
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MANAGING ORGANIZATION */}

      <section
        style={{
          marginTop: 34,
          padding: 18,
          background: "#F7F7F5",
          border: "1px solid #E7E5E1",
          borderRadius: 10,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 11.5,
            color: "#6B6862",
            textTransform: "uppercase",
            letterSpacing: ".05em",
            fontWeight: 800,
          }}
        >
          Managing Organization
        </p>

        <h2
          style={{
            margin: "5px 0 5px",
            color: "#17233C",
            fontSize: 18,
          }}
        >
          {animal.organization.name}
        </h2>

        {organizationLocation && (
          <p
            style={{
              margin: "0 0 10px",
              color: "#6B6862",
              fontSize: 13,
            }}
          >
            {organizationLocation}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <a
            href={`/organizations/${encodeURIComponent(
              animal.organization.id
            )}/adoptable`}
            style={textLink}
          >
            View Adoptable Pets
          </a>

          {animal.organization.website && (
            <a
              href={withProtocol(
                animal.organization.website
              )}
              target="_blank"
              rel="noreferrer"
              style={textLink}
            >
              Organization Website
            </a>
          )}
        </div>
      </section>
    </section>
  );
}

function calculateAge(
  birthDate: string | null
) {
  if (!birthDate) {
    return null;
  }

  const birth =
    new Date(birthDate);

  if (
    Number.isNaN(
      birth.getTime()
    )
  ) {
    return null;
  }

  const now =
    new Date();

  let years =
    now.getFullYear() -
    birth.getFullYear();

  if (
    now.getMonth() <
      birth.getMonth() ||
    (now.getMonth() ===
      birth.getMonth() &&
      now.getDate() <
        birth.getDate())
  ) {
    years--;
  }

  if (years >= 1) {
    return `${years} yr${
      years === 1 ? "" : "s"
    }`;
  }

  let months =
    (now.getFullYear() -
      birth.getFullYear()) *
      12 +
    now.getMonth() -
    birth.getMonth();

  if (
    now.getDate() <
    birth.getDate()
  ) {
    months--;
  }

  months =
    Math.max(months, 0);

  return months >= 1
    ? `${months} mo`
    : "Under 1 mo";
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

  return date.toLocaleDateString(
    [],
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}

function withProtocol(
  value: string
) {
  return /^https?:\/\//i.test(
    value
  )
    ? value
    : `https://${value}`;
}

const primaryButton:
  React.CSSProperties = {
    display: "inline-block",
    background: "#17233C",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 15px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 13.5,
  };

const secondaryButton:
  React.CSSProperties = {
    display: "inline-block",
    background: "#fff",
    color: "#17233C",
    border: "1px solid #D8D6D2",
    borderRadius: 8,
    padding: "10px 15px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 13.5,
  };

const textLink:
  React.CSSProperties = {
    color: "#C05621",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 13,
  };
