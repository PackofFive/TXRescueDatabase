"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

type Pet = {
  id: string;
  name: string;
  species: string | null;
  breed_or_type: string | null;
  birth_date: string | null;
  approximate_age_text: string | null;
  sex: string | null;
  color_markings: string | null;
  weight_lbs: number | string | null;
  spay_neuter_status: string | null;
  microchip_number: string | null;
  microchip_company: string | null;
  veterinarian_name: string | null;
  veterinarian_phone: string | null;
  photo_url: string | null;
  notes: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

type PetRecord = {
  id: string;
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
  pink: "#F2D6DC",
  mint: "#DCF0E8",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
  page: "#FFFDFC",
};

export default function PetProfilePage() {
  const params =
    useParams<{
      id: string;
    }>();

  const petId =
    params.id;

  const [
    pet,
    setPet,
  ] =
    useState<
      Pet | null
    >(null);

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

  useEffect(() => {
    if (!petId) {
      return;
    }

    void loadPet();
  }, [petId]);

  async function loadPet() {
    setLoading(true);
    setError(null);

    try {
      const res =
        await fetch(
          `/api/pet-owner/pets/${encodeURIComponent(
            petId
          )}`,
          {
            cache:
              "no-store",
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        if (
          res.status ===
          401
        ) {
          window.location.href =
            "/login?portal=pet-owner";

          return;
        }

        throw new Error(
          data.error ??
            "Couldn't load pet profile."
        );
      }

      setPet(
        data.pet ??
          null
      );

      setRecords(
        data.records ??
          []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load pet profile."
      );
    } finally {
      setLoading(false);
    }
  }

  const ageLabel =
    useMemo(
      () =>
        pet
          ? formatAge(
              pet.birth_date,
              pet.approximate_age_text
            )
          : null,
      [pet]
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

  if (
    error ||
    !pet
  ) {
    return (
      <PageShell>
        <a
          href="/pet-owner"
          style={
            backLinkStyle
          }
        >
          ← Back to My Pets
        </a>

        <h1
          style={{
            color:
              COLORS.navy,
            fontSize:
              28,
          }}
        >
          Pet profile unavailable
        </h1>

        <p
          style={{
            color:
              "#B23B2E",
            fontSize:
              13.5,
          }}
        >
          {error ??
            "This pet profile could not be loaded."}
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <a
        href="/pet-owner"
        style={
          backLinkStyle
        }
      >
        ← Back to My Pets
      </a>

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "minmax(220px, 300px) minmax(0, 1fr)",
          gap:
            22,
          alignItems:
            "start",
        }}
      >
        <div>
          <div
            style={{
              minHeight:
                280,
              background:
                pet.photo_url
                  ? `url("${pet.photo_url}") center/cover no-repeat`
                  : COLORS.peach,
              display:
                "grid",
              placeItems:
                "center",
              color:
                COLORS.navy,
              fontSize:
                13,
              fontWeight:
                800,
            }}
          >
            {!pet.photo_url
              ? "Pet Photo"
              : null}
          </div>
        </div>

        <div>
          <p
            style={
              eyebrowStyle
            }
          >
            Pet Owner Portal
          </p>

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "flex-start",
              gap:
                12,
              flexWrap:
                "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  margin:
                    0,
                  color:
                    COLORS.navy,
                  fontSize:
                    34,
                  lineHeight:
                    1.05,
                }}
              >
                {pet.name}
              </h1>

              <p
                style={{
                  margin:
                    "8px 0 0",
                  color:
                    COLORS.muted,
                  fontSize:
                    13.5,
                }}
              >
                {[
                  pet.species,
                  pet.breed_or_type,
                  ageLabel,
                  formatSex(
                    pet.sex
                  ),
                ]
                  .filter(
                    Boolean
                  )
                  .join(
                    " · "
                  )}
              </p>
            </div>

            <a
              href={`/pet-owner/pets/${encodeURIComponent(
                pet.id
              )}/edit`}
              style={
                secondaryLink
              }
            >
              Edit Pet
            </a>
          </div>

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(150px, 1fr))",
              gap:
                10,
              marginTop:
                18,
            }}
          >
            <DetailCard
              label="Weight"
              value={
                pet.weight_lbs !==
                  null &&
                pet.weight_lbs !==
                  undefined
                  ? `${pet.weight_lbs} lbs`
                  : "Not recorded"
              }
            />

            <DetailCard
              label="Spay / Neuter"
              value={
                formatValue(
                  pet.spay_neuter_status
                )
              }
            />

            <DetailCard
              label="Color / Markings"
              value={
                pet.color_markings ??
                "Not recorded"
              }
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(260px, 1fr))",
          gap:
            12,
          marginTop:
            22,
        }}
      >
        <InfoPanel
          title="Identification"
          background={
            COLORS.pink
          }
        >
          <InfoRow
            label="Microchip"
            value={
              pet.microchip_number ??
              "Not recorded"
            }
          />

          <InfoRow
            label="Microchip Company"
            value={
              pet.microchip_company ??
              "Not recorded"
            }
          />
        </InfoPanel>

        <InfoPanel
          title="Veterinarian"
          background={
            COLORS.mint
          }
        >
          <InfoRow
            label="Clinic / Veterinarian"
            value={
              pet.veterinarian_name ??
              "Not recorded"
            }
          />

          <InfoRow
            label="Phone"
            value={
              pet.veterinarian_phone ??
              "Not recorded"
            }
          />
        </InfoPanel>

        <InfoPanel
          title="Notes"
          background={
            COLORS.peach
          }
        >
          <p
            style={{
              margin:
                0,
              color:
                COLORS.muted,
              fontSize:
                12.75,
              lineHeight:
                1.55,
              whiteSpace:
                "pre-wrap",
            }}
          >
            {pet.notes ??
              "No notes added yet."}
          </p>
        </InfoPanel>
      </div>

      <section
        style={{
          marginTop:
            24,
          background:
            COLORS.white,
          border:
            `1px solid ${COLORS.border}`,
        }}
      >
        <div
          style={{
            padding:
              "14px 16px",
            borderBottom:
              `1px solid ${COLORS.border}`,
            display:
              "flex",
            justifyContent:
              "space-between",
            gap:
              12,
            alignItems:
              "center",
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
              Records &amp; Documents
            </h2>

            <p
              style={{
                margin:
                  "4px 0 0",
                color:
                  COLORS.muted,
                fontSize:
                  12.5,
              }}
            >
              Medical, vaccination,
              microchip, license,
              insurance, and other
              records.
            </p>
          </div>

          <a
            href={`/pet-owner/pets/${encodeURIComponent(
              pet.id
            )}/records/new`}
            style={
              primaryLink
            }
          >
            + Add Record
          </a>
        </div>

        {records.length ===
        0 ? (
          <div
            style={{
              padding:
                18,
              color:
                COLORS.muted,
              fontSize:
                13,
            }}
          >
            No records added yet.
          </div>
        ) : (
          <div>
            {records.map(
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
      </section>

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap:
            12,
          marginTop:
            18,
        }}
      >
        <FeatureCard
          title="Care & Reminders"
          text="Medication, vaccine, preventive care, and appointment reminders will live here."
          background={
            COLORS.pink
          }
        />

        <FeatureCard
          title="Responsible Pet Ownership Resources"
          text="Open Pack of Five resources for care, pet retention, lost/found pets, and finding appropriate help."
          background={
            COLORS.mint
          }
          href="/resources"
        />
      </div>
    </PageShell>
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
            980,
          margin:
            "0 auto",
        }}
      >
        {children}
      </section>
    </main>
  );
}

function DetailCard({
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
          COLORS.white,
        border:
          `1px solid ${COLORS.border}`,
        padding:
          12,
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
            ".05em",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color:
            COLORS.navy,
          fontSize:
            13,
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

function InfoPanel({
  title,
  background,
  children,
}: {
  title: string;
  background: string;
  children:
    React.ReactNode;
}) {
  return (
    <article
      style={{
        background,
        padding:
          16,
      }}
    >
      <h2
        style={{
          margin:
            "0 0 10px",
          color:
            COLORS.navy,
          fontSize:
            16,
        }}
      >
        {title}
      </h2>

      {children}
    </article>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        marginBottom:
          8,
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
            12.75,
          marginTop:
            2,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function RecordRow({
  record,
}: {
  record: PetRecord;
}) {
  return (
    <div
      style={{
        padding:
          "12px 16px",
        borderBottom:
          `1px solid ${COLORS.border}`,
        display:
          "grid",
        gridTemplateColumns:
          "minmax(180px, 1fr) minmax(120px, .6fr) auto",
        gap:
          12,
        alignItems:
          "center",
      }}
    >
      <div>
        <strong
          style={{
            color:
              COLORS.navy,
            fontSize:
              13.5,
          }}
        >
          {record.title}
        </strong>

        <div
          style={{
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
        </div>
      </div>

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

      {record.document_url ? (
        <a
          href={
            record.document_url
          }
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color:
              COLORS.coral,
            textDecoration:
              "none",
            fontSize:
              11.5,
            fontWeight:
              800,
          }}
        >
          Open
        </a>
      ) : (
        <span />
      )}
    </div>
  );
}

function FeatureCard({
  title,
  text,
  background,
  href,
}: {
  title: string;
  text: string;
  background: string;
  href?: string;
}) {
  const content = (
    <>
      <h2
        style={{
          margin:
            "0 0 6px",
          color:
            COLORS.navy,
          fontSize:
            16,
        }}
      >
        {title}
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
        }}
      >
        {text}
      </p>
    </>
  );

  return href ? (
    <a
      href={
        href
      }
      style={{
        display:
          "block",
        background,
        padding:
          16,
        textDecoration:
          "none",
        color:
          "inherit",
      }}
    >
      {content}
    </a>
  ) : (
    <article
      style={{
        background,
        padding:
          16,
      }}
    >
      {content}
    </article>
  );
}

function formatValue(
  value:
    | string
    | null
) {
  if (!value) {
    return "Not recorded";
  }

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

function formatSex(
  value:
    | string
    | null
) {
  return value
    ? formatValue(
        value
      )
    : null;
}

function formatAge(
  birthDate:
    | string
    | null,
  approximate:
    | string
    | null
) {
  if (
    approximate
  ) {
    return approximate;
  }

  if (!birthDate) {
    return null;
  }

  const birth =
    new Date(
      `${birthDate}T00:00:00`
    );

  const now =
    new Date();

  let years =
    now.getFullYear() -
    birth.getFullYear();

  let months =
    now.getMonth() -
    birth.getMonth();

  if (
    now.getDate() <
    birth.getDate()
  ) {
    months -= 1;
  }

  if (
    months < 0
  ) {
    years -= 1;
    months += 12;
  }

  if (
    years > 0
  ) {
    return `${years} year${
      years === 1
        ? ""
        : "s"
    }`;
  }

  return `${Math.max(
    0,
    months
  )} month${
    months === 1
      ? ""
      : "s"
  }`;
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

const backLinkStyle:
  React.CSSProperties =
{
  display:
    "inline-block",
  marginBottom:
    18,
  color:
    COLORS.muted,
  textDecoration:
    "none",
  fontSize:
    12.5,
  fontWeight:
    700,
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
    "9px 13px",
  textDecoration:
    "none",
  fontSize:
    12,
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
    "8px 12px",
  textDecoration:
    "none",
  fontSize:
    12,
  fontWeight:
    800,
};
