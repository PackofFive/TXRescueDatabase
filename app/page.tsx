"use client";

import {
  useEffect,
  useState,
} from "react";

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  peach: "#F2A48D",
  mint: "#A9DCC9",
  pink: "#F2D6DC",
  org: "#FBD9D6",
  owner: "#FBE3DA",
  foster: "#DCF0E8",
  text: "#1E3A5F",
  muted: "#4A5D75",
  white: "#FFFFFF",
  page: "#FFFDFC",
  border: "#E9E5E3",
};

type SuccessAnimal = {
  id: string;
  name: string;
  photoUrl: string;
};

export default function HomePage() {
  const [
    isMobile,
    setIsMobile,
  ] = useState(false);

  const [
    successAnimals,
    setSuccessAnimals,
  ] = useState<SuccessAnimal[]>([]);

  useEffect(() => {
    function syncViewport() {
      setIsMobile(
        window.innerWidth < 700
      );
    }

    syncViewport();

    window.addEventListener(
      "resize",
      syncViewport
    );

    return () => {
      window.removeEventListener(
        "resize",
        syncViewport
      );
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSuccessAnimals() {
      const endpoints = [
        "/api/public/success-wall?limit=8",
        "/api/public/animals?outcome=adopted&successWall=true&limit=8",
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(
            endpoint,
            {
              cache: "no-store",
            }
          );

          if (!response.ok) {
            continue;
          }

          const data =
            await response.json();

          const rows =
            readArray(data);

          const animals = rows
            .map((row) =>
              normalizeSuccessAnimal(
                row
              )
            )
            .filter(
              (animal) =>
                animal !== null
            ) as SuccessAnimal[];

          if (
            !cancelled &&
            animals.length > 0
          ) {
            setSuccessAnimals(
              animals.slice(0, 8)
            );
          }

          if (animals.length > 0) {
            return;
          }
        } catch {
          // Success stories are optional.
        }
      }
    }

    loadSuccessAnimals();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: COLORS.page,
        color: COLORS.text,
      }}
    >
      <PublicHeader />

      <section
        style={{
          background: COLORS.white,
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: isMobile
              ? "20px 18px 18px"
              : "22px 24px 18px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0 0 7px",
              color: COLORS.coral,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: ".11em",
              textTransform: "uppercase",
            }}
          >
            Rescue · Resources · Responsible Pet Ownership
          </p>

          <h1
            style={{
              margin: 0,
              color: COLORS.navy,
              fontSize: isMobile
                ? 34
                : "clamp(34px, 5vw, 48px)",
              lineHeight: 1.02,
              letterSpacing: "-.04em",
            }}
          >
            Helping people help animals.
          </h1>

          <p
            style={{
              maxWidth: 720,
              margin: "9px auto 0",
              color: COLORS.muted,
              fontSize: isMobile
                ? 14
                : 15,
              lineHeight: 1.55,
            }}
          >
            Find rescues and shelters,
            discover animals needing homes
            or help, and access practical
            animal-welfare resources.
          </p>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: isMobile
            ? "8px 18px 10px"
            : "8px 24px 10px",
        }}
      >
        <p style={eyebrowStyle}>
          Public Access
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              isMobile
                ? "1fr 1fr"
                : "repeat(4, minmax(0, 1fr))",
            gap: 8,
            marginTop: 8,
          }}
        >
          <ActionLink
            compact={isMobile}
            title="Directory"
            text="Find rescues, shelters, and animal-welfare organizations."
            href="/organizations"
          />

          <ActionLink
            compact={isMobile}
            title="Adoptable Pets"
            text="Browse public animal profiles shared by participating organizations."
            href="/adoptable"
          />

          <ActionLink
            compact={isMobile}
            title="Resources"
            text="Find practical information for pet owners and animal advocates."
            href="/resources"
          />

          <ActionLink
            compact={isMobile}
            title="Request Organization"
            text="Suggest a rescue, shelter, or resource to add to the network."
            href="/request-organization"
          />
        </div>
      </section>

      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: isMobile
            ? "9px 18px 12px"
            : "9px 24px 14px",
        }}
      >
        <p style={eyebrowStyle}>
          Portal Access
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              isMobile
                ? "1fr"
                : "repeat(3, minmax(0, 1fr))",
            gap: isMobile
              ? 8
              : 10,
            marginTop: 8,
          }}
        >
          <PortalCard
            compact={isMobile}
            background={COLORS.org}
            symbol="ORG"
            title="Organization Portal"
            text="For rescues and shelters managing animals, records, public profiles, and help offers."
            href="/login?portal=organization"
          />

          <PortalCard
            compact={isMobile}
            background={COLORS.owner}
            symbol="PET"
            title="Pet Owner Portal"
            text="For personal pet-owner tools, records, resources, and future account features."
            href="/login?portal=pet-owner"
          />

          <PortalCard
            compact={isMobile}
            background={COLORS.foster}
            symbol="FOS"
            title="Foster Portal"
            text="For approved foster relationships, applications, animals, and foster tools."
            href="/login?portal=foster"
          />
        </div>
      </section>

      {successAnimals.length > 0 ? (
        <section
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: isMobile
              ? "8px 18px 12px"
              : "10px 24px 14px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "end",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <div>
              <p style={eyebrowStyle}>
                Success Stories
              </p>

              <h2
                style={{
                  margin: "4px 0 0",
                  color: COLORS.navy,
                  fontSize: 19,
                }}
              >
                Recently adopted
              </h2>
            </div>

            {!isMobile ? (
              <span
                style={{
                  color: COLORS.muted,
                  fontSize: 11.5,
                }}
              >
                Select a photo to view
                their public profile.
              </span>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 3,
              WebkitOverflowScrolling:
                "touch",
            }}
          >
            {successAnimals.map(
              (animal) => (
                <a
                  key={animal.id}
                  href={`/pet/${encodeURIComponent(
                    animal.id
                  )}`}
                  style={{
                    position: "relative",
                    display: "block",
                    flex: isMobile
                      ? "0 0 106px"
                      : "0 0 125px",
                    height: isMobile
                      ? 78
                      : 88,
                    overflow: "hidden",
                    background:
                      COLORS.white,
                    textDecoration:
                      "none",
                  }}
                >
                  <img
                    src={
                      animal.photoUrl
                    }
                    alt={animal.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      padding:
                        "14px 8px 6px",
                      background:
                        "linear-gradient(transparent, rgba(30,58,95,.78))",
                      color: "#fff",
                      fontSize: 11.5,
                      fontWeight: 800,
                    }}
                  >
                    {animal.name}
                  </span>
                </a>
              )
            )}
          </div>
        </section>
      ) : null}

      <section
        style={{
          background: COLORS.navy,
          color: COLORS.white,
          marginTop: 12,
        }}
      >
        <div
          style={{
            maxWidth: 850,
            margin: "0 auto",
            padding: isMobile
              ? "24px 18px"
              : "28px 24px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: "0 0 7px",
              fontSize: 22,
            }}
          >
            Better tools for people
            helping animals.
          </h2>

          <p
            style={{
              margin: 0,
              color:
                "rgba(255,255,255,.74)",
              fontSize: 13.5,
              lineHeight: 1.55,
            }}
          >
            Pack of Five connects people
            with organizations, resources,
            animals, and practical ways to
            improve animal welfare.
          </p>
        </div>
      </section>

      <footer
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: isMobile
            ? "18px 18px 24px"
            : "20px 24px 26px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: isMobile
            ? "flex-start"
            : "center",
          flexDirection: isMobile
            ? "column"
            : "row",
          gap: 12,
          color: COLORS.muted,
          fontSize: 12.5,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <strong
            style={{
              color: COLORS.navy,
            }}
          >
            PACK OF FIVE
          </strong>

          <a
            href="/support"
            style={{
              color: COLORS.navy,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Support Pack of Five
          </a>
        </div>

        <a
          href="/admin"
          aria-label="Admin login"
          style={{
            color: "#9A9690",
            fontSize: 10.5,
            textDecoration: "none",
          }}
        >
          Admin
        </a>
      </footer>
    </main>
  );
}

function PublicHeader() {
  return (
    <header
      style={{
        background: COLORS.white,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          minHeight: 56,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <a
          href="/"
          aria-label="Pack of Five home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            color: COLORS.navy,
            textDecoration: "none",
          }}
        >
          <PawMark />

          <span
            style={{
              fontFamily:
                '"Space Grotesk", Arial, sans-serif',
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: ".035em",
            }}
          >
            PACK OF FIVE
          </span>
        </a>

        <span
          aria-label="Current state: Texas"
          title="Texas — state selection coming later"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 30,
            height: 24,
            padding: "0 7px",
            marginLeft: 9,
            background: COLORS.pink,
            color: COLORS.navy,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: ".08em",
            lineHeight: 1,
            borderRadius: 4,
          }}
        >
          TX
        </span>
      </div>
    </header>
  );
}

function PawMark() {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "relative",
        display: "inline-block",
        width: 30,
        height: 28,
        flex: "0 0 auto",
      }}
    >
      <span
        style={{
          ...toeStyle,
          left: 1,
          top: 6,
          background: COLORS.coral,
          transform: "rotate(-24deg)",
        }}
      />

      <span
        style={{
          ...toeStyle,
          left: 8,
          top: 0,
          background: COLORS.peach,
          transform: "rotate(-8deg)",
        }}
      />

      <span
        style={{
          ...toeStyle,
          right: 7,
          top: 0,
          background: COLORS.mint,
          transform: "rotate(8deg)",
        }}
      />

      <span
        style={{
          ...toeStyle,
          right: 0,
          top: 6,
          background: COLORS.pink,
          transform: "rotate(24deg)",
        }}
      />

      <span
        style={{
          position: "absolute",
          left: 7,
          bottom: 0,
          width: 18,
          height: 16,
          borderRadius:
            "50% 50% 45% 45%",
          background: COLORS.navy,
        }}
      />
    </span>
  );
}

function ActionLink({
  compact,
  title,
  text,
  href,
}: {
  compact: boolean;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <a
      href={href}
      style={{
        display: "block",
        padding: compact
          ? "10px 10px"
          : "11px 13px",
        background: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        color: "inherit",
        textDecoration: "none",
      }}
    >
      <strong
        style={{
          display: "block",
          color: COLORS.navy,
          fontSize: compact
            ? 13
            : 14,
          marginBottom: 3,
        }}
      >
        {title}
      </strong>

      <span
        style={{
          color: COLORS.muted,
          fontSize: compact
            ? 11.5
            : 12.5,
          lineHeight: 1.4,
        }}
      >
        {text}
      </span>
    </a>
  );
}

function PortalCard({
  compact,
  background,
  symbol,
  title,
  text,
  href,
}: {
  compact: boolean;
  background: string;
  symbol: string;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <a
      href={href}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: compact
          ? 0
          : 150,
        padding: compact
          ? 13
          : 15,
        background,
        color: "inherit",
        textDecoration: "none",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 30,
          height: 30,
          background:
            "rgba(255,255,255,.62)",
          color: COLORS.navy,
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: ".08em",
          marginBottom: 7,
        }}
      >
        {symbol}
      </span>

      <h3
        style={{
          margin: "0 0 5px",
          color: COLORS.navy,
          fontSize: compact
            ? 17
            : 18,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: "0 0 8px",
          color: COLORS.muted,
          fontSize: compact
            ? 12.5
            : 13,
          lineHeight: 1.45,
          flex: 1,
        }}
      >
        {text}
      </p>

      <strong
        style={{
          color: COLORS.navy,
          fontSize: 12.5,
        }}
      >
        Login →
      </strong>
    </a>
  );
}

function readArray(
  data: unknown
): Array<Record<string, unknown>> {
  if (
    !data ||
    typeof data !== "object"
  ) {
    return [];
  }

  if (Array.isArray(data)) {
    return data.filter(
      (item) =>
        Boolean(item) &&
        typeof item === "object"
    ) as Array<Record<string, unknown>>;
  }

  const record = data as Record<
    string,
    unknown
  >;

  for (const key of [
    "animals",
    "results",
    "items",
    "data",
  ]) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value.filter(
        (item) =>
          Boolean(item) &&
          typeof item === "object"
      ) as Array<
        Record<string, unknown>
      >;
    }
  }

  return [];
}

function normalizeSuccessAnimal(
  row: Record<string, unknown>
): SuccessAnimal | null {
  const id = stringValue(
    row.id
  );

  const name =
    stringValue(row.name) ||
    stringValue(row.public_name) ||
    "Adopted";

  const directPhoto =
    stringValue(row.photo_url) ||
    stringValue(row.photoUrl) ||
    stringValue(
      row.profile_photo_url
    );

  const photo =
    row.photo &&
    typeof row.photo === "object"
      ? stringValue(
          (
            row.photo as Record<
              string,
              unknown
            >
          ).url
        )
      : null;

  const photoUrl =
    directPhoto || photo;

  if (!id || !photoUrl) {
    return null;
  }

  return {
    id,
    name,
    photoUrl,
  };
}

function stringValue(
  value: unknown
): string | null {
  return typeof value === "string" &&
    value.trim()
    ? value.trim()
    : null;
}

const toeStyle: React.CSSProperties = {
  position: "absolute",
  width: 8,
  height: 10,
  borderRadius: "50%",
};

const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  color: COLORS.coral,
  fontSize: 10.5,
  fontWeight: 800,
  letterSpacing: ".1em",
  textTransform: "uppercase",
};
