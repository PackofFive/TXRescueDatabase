"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useSearchParams,
} from "next/navigation";

type Animal = {
  id: string;
  name: string | null;
  temporary_name: string | null;
  species: string;
  breed_or_type: string | null;
  birth_date: string | null;
  sex: string | null;
  weight_lbs: string | number | null;
  public_summary: string | null;
  public_need: string | null;
  external_listing_url: string | null;
  photo_url: string | null;
};

type Organization = {
  id: string;
  name: string;
  city: string | null;
  county: string | null;
  state: string | null;
  website: string | null;
};

export default function OrganizationAdoptablePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const orgId =
    params?.id as string;

  const returnTo =
    searchParams.get("returnTo") ||
    "/organizations";

  const [
    organization,
    setOrganization,
  ] =
    useState<Organization | null>(
      null
    );

  const [
    animals,
    setAnimals,
  ] =
    useState<Animal[]>([]);

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
    if (!orgId) return;

    fetch(
      `/api/public/organizations/${encodeURIComponent(
        orgId
      )}/adoptable`,
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
              "Couldn't load adoptable animals."
          );
        }

        setOrganization(
          data.organization
        );

        setAnimals(
          data.animals ?? []
        );
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load adoptable animals."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orgId]);

  if (loading) {
    return <p>Loading…</p>;
  }

  if (error) {
    return (
      <section
        style={{
          maxWidth: 900,
          margin: "24px auto",
        }}
      >
        <a
          href={returnTo}
          style={backLink}
        >
          ← Back to Directory
        </a>

        <p
          style={{
            color: "#B23B2E",
            marginTop: 20,
          }}
        >
          {error}
        </p>
      </section>
    );
  }

  if (!organization) {
    return null;
  }

  const location = [
    organization.city,
    organization.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section
      style={{
        maxWidth: 1120,
        margin: "0 auto",
      }}
    >
      <a
        href={returnTo}
        style={backLink}
      >
        ← Back to Directory
      </a>

      <div
        style={{
          marginTop: 20,
          marginBottom: 28,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: ".08em",
            color: "#6B6862",
            textTransform:
              "uppercase",
          }}
        >
          Adoptable Pets
        </p>

        <h1
          style={{
            color: "#17233C",
            fontSize: 30,
            margin: "6px 0 6px",
          }}
        >
          {organization.name}
        </h1>

        {location && (
          <p
            style={{
              color: "#6B6862",
              margin: 0,
              fontSize: 14,
            }}
          >
            {location}
          </p>
        )}

        <p
          style={{
            color: "#6B6862",
            maxWidth: 720,
            lineHeight: 1.6,
            marginTop: 12,
          }}
        >
          These animals have been
          published by{" "}
          {organization.name}.
          Open an animal to view
          its public profile,
          current needs, and ways
          to help.
        </p>
      </div>

      {animals.length === 0 ? (
        <div
          style={{
            background: "#fff",
            border:
              "1px dashed #D8D6D2",
            borderRadius: 10,
            padding: 24,
          }}
        >
          <strong
            style={{
              display: "block",
              color: "#17233C",
              marginBottom: 6,
            }}
          >
            No public adoptable
            pets are currently
            listed.
          </strong>

          <p
            style={{
              margin: 0,
              color: "#6B6862",
              fontSize: 13.5,
              lineHeight: 1.5,
            }}
          >
            Check back later or
            visit the
            organization&apos;s
            website for additional
            information.
          </p>

          {organization.website && (
            <a
              href={withProtocol(
                organization.website
              )}
              target="_blank"
              rel="noreferrer"
              style={{
                display:
                  "inline-block",
                marginTop: 12,
                color: "#C05621",
                textDecoration:
                  "none",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Visit Organization
              Website →
            </a>
          )}
        </div>
      ) : (
        <>
          <div
            style={{
              fontSize: 12.5,
              color: "#6B6862",
              marginBottom: 12,
            }}
          >
            {animals.length} animal
            {animals.length === 1
              ? ""
              : "s"}{" "}
            currently listed
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(245px, 1fr))",
              gap: 16,
            }}
          >
            {animals.map(
              (animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                />
              )
            )}
          </div>
        </>
      )}
    </section>
  );
}

function AnimalCard({
  animal,
}: {
  animal: Animal;
}) {
  const name =
    animal.name ||
    animal.temporary_name ||
    "Animal";

  const age =
    calculateAge(
      animal.birth_date
    );

  const details = [
    age,
    animal.breed_or_type ||
      animal.species,
    animal.sex,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <a
      href={`/pet/${encodeURIComponent(
        animal.id
      )}`}
      style={{
        display: "block",
        background: "#fff",
        border:
          "1px solid #E7E5E1",
        borderRadius: 11,
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {animal.photo_url ? (
        <img
          src={animal.photo_url}
          alt={name}
          style={{
            width: "100%",
            aspectRatio: "4 / 3",
            objectFit: "cover",
            display: "block",
            background: "#F1F1EF",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            aspectRatio: "4 / 3",
            display: "grid",
            placeItems: "center",
            background: "#F1F1EF",
            color: "#8A8782",
            fontSize: 13,
          }}
        >
          No photo yet
        </div>
      )}

      <div
        style={{
          padding: 15,
        }}
      >
        <h2
          style={{
            margin: "0 0 5px",
            color: "#17233C",
            fontSize: 19,
          }}
        >
          {name}
        </h2>

        {details && (
          <p
            style={{
              margin: 0,
              color: "#6B6862",
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            {details}
          </p>
        )}

        {animal.public_need && (
          <div
            style={{
              marginTop: 12,
              padding: 9,
              background: "#FFF8F5",
              border:
                "1px solid #F0D3C9",
              borderRadius: 7,
              color: "#4F4D49",
              fontSize: 12.5,
              lineHeight: 1.45,
            }}
          >
            <strong>
              Current need:
            </strong>{" "}
            {animal.public_need}
          </div>
        )}

        <div
          style={{
            marginTop: 14,
            fontSize: 12.5,
            fontWeight: 700,
            color: "#C05621",
          }}
        >
          View Profile →
        </div>
      </div>
    </a>
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
    (
      now.getMonth() ===
        birth.getMonth() &&
      now.getDate() <
        birth.getDate()
    )
  ) {
    years--;
  }

  if (years >= 1) {
    return `${years} yr${
      years === 1
        ? ""
        : "s"
    }`;
  }

  let months =
    (
      now.getFullYear() -
      birth.getFullYear()
    ) *
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

function withProtocol(
  url: string
) {
  return /^https?:\/\//i.test(
    url
  )
    ? url
    : `https://${url}`;
}

const backLink:
  React.CSSProperties =
{
  color: "#C05621",
  fontSize: 13,
  textDecoration: "none",
  fontWeight: 600,
};
