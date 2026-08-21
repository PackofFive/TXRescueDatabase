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
  temporary_name:
    | string
    | null;
  species: string;
  breed_or_type:
    | string
    | null;
  birth_date:
    | string
    | null;
  sex:
    | string
    | null;
  public_need:
    | string
    | null;
  photo_url:
    | string
    | null;
};

type Organization = {
  id: string;
  name: string;
  city:
    | string
    | null;
  state:
    | string
    | null;
};

export default function OrgAdoptablePage() {
  const params =
    useParams();

  const searchParams =
    useSearchParams();

  const orgId =
    params?.id as string;

  const returnTo =
    searchParams.get(
      "returnTo"
    ) || "/";

  const [
    organization,
    setOrganization,
  ] =
    useState<
      Organization | null
    >(null);

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
    useState<
      string | null
    >(null);

  useEffect(() => {
    fetch(
      `/api/public/organizations/${encodeURIComponent(
        orgId
      )}/adoptable`,
      {
        cache:
          "no-store",
      }
    )
      .then(
        async (r) => {
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
            data.animals ??
              []
          );
        }
      )
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load adoptable animals."
        );
      })
      .finally(() => {
        setLoading(
          false
        );
      });
  }, [orgId]);

  if (loading) {
    return <p>Loading…</p>;
  }

  if (error) {
    return (
      <p
        style={{
          color:
            "#B23B2E",
        }}
      >
        {error}
      </p>
    );
  }

  if (!organization) {
    return null;
  }

  return (
    <section
      style={{
        maxWidth: 1100,
        margin:
          "24px auto",
      }}
    >
      <a
        href={returnTo}
        style={{
          fontSize: 13,
          color:
            "#C05621",
          textDecoration:
            "none",
        }}
      >
        ← Back to Directory
      </a>

      <p
        style={{
          margin:
            "18px 0 0",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing:
            ".08em",
          color:
            "#6B6862",
        }}
      >
        ADOPTABLE PETS
      </p>

      <h1
        style={{
          margin:
            "5px 0 6px",
          fontSize: 30,
          color:
            "#17233C",
        }}
      >
        {
          organization.name
        }
      </h1>

      <p
        style={{
          margin:
            "0 0 24px",
          color:
            "#6B6862",
        }}
      >
        {[
          organization.city,
          organization.state,
        ]
          .filter(Boolean)
          .join(", ")}
      </p>

      {animals.length ===
        0 && (
        <div
          style={{
            border:
              "1px dashed #D8D6D2",
            borderRadius: 10,
            padding: 22,
          }}
        >
          No public adoptable
          pets are currently
          listed by this
          organization.
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {animals.map(
          (animal) => {
            const name =
              animal.name ||
              animal.temporary_name ||
              "Animal";

            return (
              <a
                key={
                  animal.id
                }
                href={`/pet/${encodeURIComponent(
                  animal.id
                )}`}
                style={{
                  textDecoration:
                    "none",
                  color:
                    "inherit",
                  border:
                    "1px solid #E7E5E1",
                  borderRadius: 10,
                  overflow:
                    "hidden",
                  background:
                    "#fff",
                }}
              >
                {animal.photo_url ? (
                  <img
                    src={
                      animal.photo_url
                    }
                    alt={name}
                    style={{
                      width:
                        "100%",
                      aspectRatio:
                        "4 / 3",
                      objectFit:
                        "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width:
                        "100%",
                      aspectRatio:
                        "4 / 3",
                      display:
                        "grid",
                      placeItems:
                        "center",
                      background:
                        "#F1F1EF",
                      color:
                        "#8A8782",
                    }}
                  >
                    No photo
                  </div>
                )}

                <div
                  style={{
                    padding: 14,
                  }}
                >
                  <h2
                    style={{
                      margin:
                        "0 0 5px",
                      fontSize: 18,
                      color:
                        "#17233C",
                    }}
                  >
                    {name}
                  </h2>

                  <p
                    style={{
                      margin: 0,
                      color:
                        "#6B6862",
                      fontSize: 13,
                    }}
                  >
                    {[
                      age(
                        animal.birth_date
                      ),

                      animal.breed_or_type ||
                        animal.species,

                      animal.sex,
                    ]
                      .filter(
                        Boolean
                      )
                      .join(
                        " · "
                      )}
                  </p>

                  {animal.public_need && (
                    <p
                      style={{
                        margin:
                          "10px 0 0",
                        fontSize: 13,
                        lineHeight: 1.45,
                        color:
                          "#4F4D49",
                      }}
                    >
                      <strong>
                        Current
                        need:
                      </strong>{" "}
                      {
                        animal.public_need
                      }
                    </p>
                  )}
                </div>
              </a>
            );
          }
        )}
      </div>
    </section>
  );
}

function age(
  birthDate:
    | string
    | null
) {
  if (!birthDate) {
    return null;
  }

  const birth =
    new Date(
      birthDate
    );

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

  const months =
    Math.max(
      0,
      (
        now.getFullYear() -
        birth.getFullYear()
      ) *
        12 +
        now.getMonth() -
        birth.getMonth()
    );

  return `${months} mo`;
}
