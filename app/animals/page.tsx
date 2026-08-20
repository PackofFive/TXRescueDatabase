"use client";

import { useEffect, useState } from "react";

type Animal = {
  id: string;
  name: string | null;
  temporary_name: string | null;
  species: string;
  breed_or_type: string | null;
  custody: string;
  urgency: string;
  placement: string;
  created_at: string;
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
    fetch("/api/animals", { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json();

        if (!r.ok) {
          throw new Error(
            data.error ?? "Failed to load animals."
          );
        }

        setAnimals(data.animals ?? []);
      })
      .catch((e) => {
        setError(
          e instanceof Error
            ? e.message
            : "Failed to load animals."
        );
      });

    /*
      In Admin Test Mode this returns the organization
      currently being viewed.

      For a normal organization account this may return
      no organization, so the page falls back to
      "Our Animals".
    */
    fetch("/api/admin/test-org", {
      cache: "no-store",
    })
      .then(async (r) => {
        if (!r.ok) return null;

        const data = await r.json();

        return data.organization as TestOrg;
      })
      .then((organization) => {
        if (organization?.name) {
          setOrgName(organization.name);
        }
      })
      .catch(() => {
        // Normal org users do not need admin test-org access.
      });
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
    <div>
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
              letterSpacing: "0.08em",
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
              maxWidth: 680,
            }}
          >
            Animals currently under your organization&apos;s
            care or active responsibility. This can include
            animals in foster care, medical cases, temporary
            placements, and animals your organization has
            formally accepted.
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
        <strong>Not the same as Urgent Shelter Animals.</strong>{" "}
        Animals listed here are already under your organization&apos;s
        care or responsibility. Shelter animals still needing rescue
        placement remain in the Urgent Shelter Animals section until
        your organization formally accepts or transfers them.
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

      {animals?.map((a) => (
        <div
          key={a.id}
          style={{
            border: "1px solid #E7E5E1",
            borderRadius: 8,
            padding: 14,
            marginBottom: 8,
            background: "#fff",
          }}
        >
          <strong
            style={{
              fontSize: 15,
              color: "#17233C",
            }}
          >
            {a.name ||
              a.temporary_name ||
              "(unnamed)"}
          </strong>

          <div
            style={{
              fontSize: 12.5,
              color: "#6B6862",
              marginTop: 5,
              lineHeight: 1.5,
            }}
          >
            {[a.species, a.breed_or_type]
              .filter(Boolean)
              .join(" · ")}

            {(a.species ||
              a.breed_or_type) &&
              " — "}

            custody: {a.custody} · urgency:{" "}
            {a.urgency} · placement:{" "}
            {a.placement}
          </div>
        </div>
      ))}
    </div>
  );
}
