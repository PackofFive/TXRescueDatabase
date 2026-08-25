"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type PetRecord = {
  id: string;
  pet_id: string;
  pet_name: string;
  record_type: string;
  title: string;
  record_date: string | null;
  provider_name: string | null;
  notes: string | null;
  document_url: string | null;
  created_at: string;
  updated_at: string;
};

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  peach: "#FBE3DA",
  mint: "#DCF0E8",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
  page: "#FFFDFC",
};

const RECORD_TYPES = [
  "all",
  "vaccination",
  "medical",
  "medication",
  "preventive_care",
  "microchip",
  "license",
  "insurance",
  "lab_result",
  "procedure",
  "other",
];

export default function PetOwnerRecordsPage() {
  const [
    records,
    setRecords,
  ] =
    useState<
      PetRecord[]
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

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    typeFilter,
    setTypeFilter,
  ] =
    useState("all");

  useEffect(() => {
    fetch(
      "/api/pet-owner/records",
      {
        cache:
          "no-store",
      }
    )
      .then(async (res) => {
        const data =
          await res.json();

        if (
          res.status ===
          401
        ) {
          window.location.href =
            "/login?portal=pet-owner";
          return;
        }

        if (!res.ok) {
          throw new Error(
            data.error ??
              "Couldn't load pet records."
          );
        }

        setRecords(
          data.records ??
            []
        );
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load pet records."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const visibleRecords =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase();

        return records.filter(
          (
            record
          ) => {
            if (
              typeFilter !==
                "all" &&
              record.record_type !==
                typeFilter
            ) {
              return false;
            }

            if (!term) {
              return true;
            }

            return [
              record.title,
              record.pet_name,
              record.provider_name,
              record.notes,
              record.record_type,
            ]
              .filter(Boolean)
              .some(
                (
                  value
                ) =>
                  String(
                    value
                  )
                    .toLowerCase()
                    .includes(
                      term
                    )
              );
          }
        );
      },
      [
        records,
        search,
        typeFilter,
      ]
    );

  if (loading) {
    return (
      <PageShell>
        <p
          style={{
            color:
              COLORS.muted,
          }}
        >
          Loading…
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          gap:
            14,
          flexWrap:
            "wrap",
        }}
      >
        <div>
          <p
            style={
              eyebrowStyle
            }
          >
            Pet Owner Portal
          </p>

          <h1
            style={
              headingStyle
            }
          >
            Records &amp; Documents
          </h1>

          <p
            style={{
              margin:
                "8px 0 0",
              color:
                COLORS.muted,
              fontSize:
                13.5,
              lineHeight:
                1.5,
              maxWidth:
                640,
            }}
          >
            Review medical,
            vaccination,
            identification,
            insurance, and other
            records across all of
            your pets.
          </p>
        </div>

        <a
          href="/pet-owner"
          style={
            secondaryLink
          }
        >
          My Pets
        </a>
      </div>

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "minmax(220px, 1fr) minmax(180px, 260px)",
          gap:
            10,
          margin:
            "18px 0",
        }}
      >
        <input
          value={
            search
          }
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search records, pets, providers..."
          style={
            inputStyle
          }
        />

        <select
          value={
            typeFilter
          }
          onChange={(e) =>
            setTypeFilter(
              e.target.value
            )
          }
          style={
            inputStyle
          }
        >
          {RECORD_TYPES.map(
            (
              value
            ) => (
              <option
                key={
                  value
                }
                value={
                  value
                }
              >
                {value ===
                "all"
                  ? "All Record Types"
                  : formatValue(
                      value
                    )}
              </option>
            )
          )}
        </select>
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

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(160px, 1fr))",
          gap:
            10,
          marginBottom:
            18,
        }}
      >
        <StatCard
          value={
            records.length
          }
          label="Total Records"
        />

        <StatCard
          value={
            records.filter(
              (
                record
              ) =>
                Boolean(
                  record.document_url
                )
            ).length
          }
          label="Linked Documents"
        />

        <StatCard
          value={
            new Set(
              records.map(
                (
                  record
                ) =>
                  record.pet_id
              )
            ).size
          }
          label="Pets with Records"
        />
      </div>

      {visibleRecords.length ===
      0 ? (
        <div
          style={
            emptyStyle
          }
        >
          {records.length ===
          0
            ? "No pet records have been added yet."
            : "No records match the current filters."}
        </div>
      ) : (
        <div
          style={{
            background:
              COLORS.white,
            border:
              `1px solid ${COLORS.border}`,
          }}
        >
          {visibleRecords.map(
            (
              record
            ) => (
              <RecordRow
                key={
                  record.id
                }
                record={
                  record
                }
              />
            )
          )}
        </div>
      )}
    </PageShell>
  );
}

function RecordRow({
  record,
}: {
  record:
    PetRecord;
}) {
  return (
    <div
      style={{
        padding:
          "13px 15px",
        borderBottom:
          `1px solid ${COLORS.border}`,
        display:
          "grid",
        gridTemplateColumns:
          "minmax(190px, 1fr) minmax(140px, .7fr) minmax(120px, .6fr) auto",
        gap:
          12,
        alignItems:
          "center",
      }}
    >
      <div>
        <strong
          style={{
            display:
              "block",
            color:
              COLORS.navy,
            fontSize:
              13.5,
          }}
        >
          {record.title}
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
          {formatValue(
            record.record_type
          )}
        </span>
      </div>

      <a
        href={`/pet-owner/pets/${encodeURIComponent(
          record.pet_id
        )}`}
        style={{
          color:
            COLORS.navy,
          textDecoration:
            "none",
          fontSize:
            12,
          fontWeight:
            700,
        }}
      >
        {
          record.pet_name
        }
      </a>

      <div
        style={{
          color:
            COLORS.muted,
          fontSize:
            12,
        }}
      >
        {record.record_date
          ? new Date(
              `${record.record_date}T00:00:00`
            ).toLocaleDateString()
          : "No date"}
      </div>

      <div
        style={{
          display:
            "flex",
          gap:
            9,
          justifyContent:
            "flex-end",
          flexWrap:
            "wrap",
        }}
      >
        {record.document_url ? (
          <a
            href={
              record.document_url
            }
            target="_blank"
            rel="noopener noreferrer"
            style={
              actionLink
            }
          >
            Open
          </a>
        ) : null}

        <a
          href={`/pet-owner/records/${encodeURIComponent(
            record.id
          )}/edit`}
          style={
            actionLink
          }
        >
          Edit
        </a>
      </div>
    </div>
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
          COLORS.peach,
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

function PageShell({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          COLORS.page,
        padding:
          "28px 18px 44px",
        boxSizing:
          "border-box",
      }}
    >
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
        {children}
      </section>
    </main>
  );
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

const inputStyle:
  React.CSSProperties =
{
  width:
    "100%",
  boxSizing:
    "border-box",
  border:
    `1px solid ${COLORS.border}`,
  padding:
    "9px 10px",
  background:
    COLORS.white,
  color:
    "#1C1B19",
  fontFamily:
    "inherit",
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
    "8px 12px",
  textDecoration:
    "none",
  fontWeight:
    800,
  fontSize:
    12,
};

const actionLink:
  React.CSSProperties =
{
  color:
    COLORS.coral,
  textDecoration:
    "none",
  fontSize:
    11.5,
  fontWeight:
    800,
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
  color:
    COLORS.muted,
  fontSize:
    13,
};
