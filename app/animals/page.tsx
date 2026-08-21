"use client";

import { useEffect, useState } from "react";

type Animal = {
  id: string;
  name: string | null;
  temporary_name: string | null;
  species: string;
  breed_or_type: string | null;
  custody: string;
  urgency: string | null;
  placement: string | null;
  created_at: string;
};

type AuthUser = {
  id: string;
  email: string;
  role: "org" | "admin";
  orgId: string | null;
  orgName: string | null;
  status: "pending" | "approved" | "rejected";
};

type TestOrg = {
  id: string;
  name: string;
} | null;

export default function AnimalsListPage() {
  const [animals, setAnimals] = useState<Animal[] | null>(null);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPage() {
      try {
        const authRes = await fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "same-origin",
        });

        const authData = await authRes.json();
        const user = authData.user as AuthUser | null;

        if (user?.orgName) {
          setOrgName(user.orgName);
        }

        /*
          Admin Test Mode uses the selected test organization,
          which is intentionally separate from the admin's own
          session organization identity.
        */
        if (user?.role === "admin") {
          try {
            const testRes = await fetch("/api/admin/test-org", {
              cache: "no-store",
              credentials: "same-origin",
            });

            const testData = await testRes.json();
            const testOrg = testData.organization as TestOrg;

            if (testRes.ok && testOrg?.name) {
              setOrgName(testOrg.name);
            }
          } catch {
            // AppShell handles missing admin test-org selection.
          }
        }

        const animalRes = await fetch("/api/animals", {
          cache: "no-store",
          credentials: "same-origin",
        });

        const animalData = await animalRes.json();

        if (!animalRes.ok) {
          throw new Error(
            animalData.error ?? "Failed to load animals."
          );
        }

        setAnimals(animalData.animals ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load animals."
        );
      }
    }

    loadPage();
  }, []);

  const pageTitle = orgName
    ? `${orgName} Animals`
    : "Our Animals";

  if (error) {
    return (
      <p style={{ color: "#B23B2E" }}>
        {error}
      </p>
    );
  }

  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 22,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11.5,
              fontWeight: 800,
              letterSpacing: ".08em",
              color: "#6B6862",
              textTransform: "uppercase",
            }}
          >
            Rescue Manager
          </p>

          <h1
            style={{
              fontSize: 26,
              margin: "5px 0 6px",
              color: "#17233C",
            }}
          >
            {pageTitle}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6B6862",
              fontSize: 13.5,
              lineHeight: 1.5,
              maxWidth: 700,
            }}
          >
            Animals currently under your organization&apos;s
            care or active responsibility. Open an animal to
            view its full file, medical history, foster
            information, behavior notes, timeline, expenses,
            documents, and outcome.
          </p>
        </div>

        <a
          href="/animals/new"
          style={{
            padding: "9px 16px",
            background: "#17233C",
            color: "#fff",
            borderRadius: 7,
            textDecoration: "none",
            fontSize: 13.5,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          + Quick Intake
        </a>
      </div>

      <div
        style={{
          background: "#F6F7F8",
          border: "1px solid #E7E5E1",
          borderRadius: 8,
          padding: 12,
          marginBottom: 18,
          fontSize: 13,
          color: "#4F4D49",
          lineHeight: 1.5,
        }}
      >
        <strong>
          This list contains animals already under your
          organization&apos;s care or responsibility.
        </strong>{" "}
        Shelter animals that still need rescue placement remain
        under Urgent Shelter Animals until your organization
        formally accepts responsibility for them.
      </div>

      {animals === null && (
        <p>Loading…</p>
      )}

      {animals?.length === 0 && (
        <div
          style={{
            border: "1px dashed #D8D6D2",
            borderRadius: 8,
            padding: 22,
            background: "#fff",
          }}
        >
          <strong
            style={{
              display: "block",
              marginBottom: 5,
              color: "#17233C",
            }}
          >
            No animals currently recorded
          </strong>

          <p
            style={{
              margin: 0,
              color: "#6B6862",
              fontSize: 13.5,
              lineHeight: 1.5,
            }}
          >
            Use Quick Intake when your organization accepts
            responsibility for an animal or needs to begin
            tracking its care.
          </p>
        </div>
      )}

      {animals?.map((animal) => {
        const displayName =
          animal.name ||
          animal.temporary_name ||
          "Unnamed Animal";

        const details = [
          animal.species,
          animal.breed_or_type,
        ]
          .filter(Boolean)
          .join(" · ");

        return (
          <a
            key={animal.id}
            href={`/animals/${encodeURIComponent(animal.id)}`}
            style={{
              display: "block",
              border: "1px solid #E7E5E1",
              borderRadius: 9,
              padding: 16,
              marginBottom: 9,
              background: "#fff",
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <strong
                  style={{
                    display: "block",
                    fontSize: 16,
                    color: "#17233C",
                    marginBottom: 5,
                  }}
                >
                  {displayName}
                </strong>

                {details && (
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#6B6862",
                      marginBottom: 6,
                    }}
                  >
                    {details}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: 7,
                    flexWrap: "wrap",
                  }}
                >
                  <AnimalBadge
                    label={`Custody: ${formatValue(
                      animal.custody
                    )}`}
                  />

                  {animal.placement && (
                    <AnimalBadge
                      label={`Placement: ${formatValue(
                        animal.placement
                      )}`}
                    />
                  )}

                  {animal.urgency && (
                    <AnimalBadge
                      label={`Urgency: ${formatValue(
                        animal.urgency
                      )}`}
                    />
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  color: "#6B6862",
                  fontSize: 12.5,
                  flexShrink: 0,
                }}
              >
                <span>Open record</span>

                <span
                  aria-hidden="true"
                  style={{
                    fontSize: 22,
                    lineHeight: 1,
                    color: "#17233C",
                  }}
                >
                  ›
                </span>
              </div>
            </div>
          </a>
        );
      })}
    </section>
  );
}

function AnimalBadge({
  label,
}: {
  label: string;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        background: "#F1F3F5",
        border: "1px solid #E0E3E7",
        borderRadius: 20,
        padding: "4px 8px",
        color: "#4F5661",
        fontSize: 11.5,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}

function formatValue(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
