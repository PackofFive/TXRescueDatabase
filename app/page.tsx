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
  hero: "#FBEFF1",
  org: "#FBD9D6",
  owner: "#FBE3DA",
  foster: "#DCF0E8",
  text: "#1E3A5F",
  muted: "#4A5D75",
  white: "#FFFFFF",
  page: "#FFFDFC",
};

type Stats = {
  organizations: number | null;
  animals: number | null;
};

export default function HomePage() {
  const [stats, setStats] =
    useState<Stats>({
      organizations: null,
      animals: null,
    });

  const [
    successAnimals,
    setSuccessAnimals,
  ] = useState<
    Array<{
      id: string;
      name: string;
      photoUrl: string;
    }>
  >([]);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const [
          organizationsResponse,
          animalsResponse,
        ] = await Promise.all([
          fetch(
            "/api/public/organizations?limit=1",
            {
              cache: "no-store",
            }
          ),
          fetch(
            "/api/public/adoptable?limit=1",
            {
              cache: "no-store",
            }
          ),
        ]);

        if (cancelled) {
          return;
        }

        let organizations:
          | number
          | null = null;

        let animals:
          | number
          | null = null;

        if (
          organizationsResponse.ok
        ) {
          const data =
            await organizationsResponse.json();

          organizations =
            readCount(data);
        }

        if (
          animalsResponse.ok
        ) {
          const data =
            await animalsResponse.json();

          animals =
            readCount(data);
        }

        setStats({
          organizations,
          animals,
        });
      } catch {
        // Stats are optional. The homepage
        // remains complete without them.
      }
    }

    loadStats();

    return () => {
      cancelled = true;
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
          const response =
            await fetch(endpoint, {
              cache: "no-store",
            });

          if (!response.ok) {
            continue;
          }

          const data =
            await response.json();

          const rows =
            readArray(data);

          const animals =
            rows
              .map((row) =>
                normalizeSuccessAnimal(
                  row
                )
              )
              .filter(
                (
                  animal
                ): animal is {
                  id: string;
                  name: string;
                  photoUrl: string;
                } =>
                  Boolean(animal)
              )
              .slice(0, 8);

          if (
            !cancelled &&
            animals.length > 0
          ) {
            setSuccessAnimals(
              animals
            );
          }

          if (
            animals.length > 0
          ) {
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

  const showStats =
    (stats.organizations ?? 0) >
      0 ||
    (stats.animals ?? 0) > 0;

  return (
    <main
      style={{
        background:
          COLORS.page,
        color:
          COLORS.text,
        minHeight:
          "100vh",
      }}
    >
      <PublicHeader />

      <section
        style={{
          background:
            COLORS.hero,
        }}
      >
        <div
          style={{
            maxWidth:
              1180,
            margin:
              "0 auto",
            padding:
              "42px 24px 38px",
            textAlign:
              "center",
          }}
        >
          <p
            style={{
              margin:
                "0 0 16px",
              color:
                COLORS.coral,
              fontSize:
                12,
              fontWeight:
                800,
              letterSpacing:
                ".12em",
              textTransform:
                "uppercase",
            }}
          >
            Rescue · Resources · Responsible Pet Ownership
          </p>

          <h1
            style={{
              margin:
                "0 auto",
              maxWidth:
                880,
              color:
                COLORS.navy,
              fontSize:
                "clamp(36px, 6vw, 58px)",
              lineHeight:
                1.02,
              letterSpacing:
                "-.045em",
            }}
          >
            Helping people help animals.
          </h1>

          <p
            style={{
              maxWidth:
                720,
              margin:
                "14px auto 0",
              color:
                COLORS.muted,
              fontSize:
                16.5,
              lineHeight:
                1.65,
            }}
          >
            Find rescues and shelters,
            discover animals needing
            homes or help, and connect
            with practical resources
            for animal welfare and
            responsible pet ownership.
          </p>


        </div>
      </section>

      <section
        style={{
          maxWidth:
            1180,
          margin:
            "0 auto",
          padding:
            "18px 24px 24px",
        }}
      >
        <p
          style={
            eyebrowStyle
          }
        >
          Find what you need
        </p>

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            marginTop:
              14,
            background:
              COLORS.white,
          }}
        >
          <ActionLink
            title="Directory"
            text="Search rescues, shelters, and animal-welfare organizations."
            href="/organizations"
          />

          <ActionLink
            title="Adoptable Pets"
            text="Browse animals shared publicly by participating organizations."
            href="/adoptable"
          />

          <ActionLink
            title="Resources"
            text="Find practical information for pet owners and animal advocates."
            href="/resources"
          />

          <ActionLink
            title="Request an Organization"
            text="Suggest an organization that should be included in the network."
            href="/request-organization"
          />
        </div>
      </section>

      {showStats ? (
        <section
          style={{
            maxWidth:
              1180,
            margin:
              "-28px auto 0",
            padding:
              "0 24px",
            position:
              "relative",
          }}
        >
          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(190px, 1fr))",
              gap:
                14,
            }}
          >
            {(stats.organizations ??
              0) > 0 ? (
              <StatCard
                value={
                  stats.organizations!
                }
                label="Organizations in the network"
              />
            ) : null}

            {(stats.animals ??
              0) > 0 ? (
              <StatCard
                value={
                  stats.animals!
                }
                label="Animals currently shared"
              />
            ) : null}

            <div
              style={{
                background:
                  COLORS.white,
                padding:
                  "22px 24px",
              }}
            >
              <strong
                style={{
                  display:
                    "block",
                  color:
                    COLORS.navy,
                  fontSize:
                    17,
                  marginBottom:
                    5,
                }}
              >
                Built for action
              </strong>

              <span
                style={{
                  color:
                    COLORS.muted,
                  fontSize:
                    13.5,
                  lineHeight:
                    1.5,
                }}
              >
                One place to find
                information, people,
                and ways to help.
              </span>
            </div>
          </div>
        </section>
      ) : null}

      {successAnimals.length >
      0 ? (
        <section
          style={{
            maxWidth:
              1180,
            margin:
              "0 auto",
            padding:
              "10px 24px 20px",
          }}
        >
          <div
            style={{
              display:
                "flex",
              alignItems:
                "end",
              justifyContent:
                "space-between",
              gap:
                16,
              marginBottom:
                14,
            }}
          >
            <div>
              <p
                style={
                  eyebrowStyle
                }
              >
                Success Stories
              </p>

              <h2
                style={{
                  margin:
                    "7px 0 0",
                  color:
                    COLORS.navy,
                  fontSize:
                    21,
                  letterSpacing:
                    "-.025em",
                }}
              >
                Recently adopted
              </h2>
            </div>

            <span
              style={{
                color:
                  COLORS.muted,
                fontSize:
                  12.5,
              }}
            >
              Select a photo to
              view their story.
            </span>
          </div>

          <div
            style={{
              display:
                "flex",
              gap:
                10,
              overflowX:
                "auto",
              paddingBottom:
                4,
              WebkitOverflowScrolling:
                "touch",
            }}
          >
            {successAnimals.map(
              (animal) => (
                <a
                  key={
                    animal.id
                  }
                  href={`/pet/${encodeURIComponent(
                    animal.id
                  )}`}
                  aria-label={`View ${animal.name}'s public profile`}
                  style={{
                    position:
                      "relative",
                    display:
                      "block",
                    flex:
                      "0 0 132px",
                    height:
                      92,
                    overflow:
                      "hidden",
                    background:
                      COLORS.hero,
                    textDecoration:
                      "none",
                  }}
                >
                  <img
                    src={
                      animal.photoUrl
                    }
                    alt={
                      animal.name
                    }
                    style={{
                      width:
                        "100%",
                      height:
                        "100%",
                      objectFit:
                        "cover",
                      display:
                        "block",
                    }}
                  />

                  <span
                    style={{
                      position:
                        "absolute",
                      left:
                        0,
                      right:
                        0,
                      bottom:
                        0,
                      padding:
                        "18px 10px 8px",
                      background:
                        "linear-gradient(transparent, rgba(30,58,95,.78))",
                      color:
                        "#fff",
                      fontSize:
                        13,
                      fontWeight:
                        800,
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
          maxWidth:
            1180,
          margin:
            "0 auto",
          padding:
            showStats
              ? "38px 24px 20px"
              : "28px 24px 20px",
        }}
      >
        <div
          style={{
            textAlign:
              "center",
            maxWidth:
              720,
            margin:
              "0 auto 18px",
          }}
        >
          <p
            style={
              eyebrowStyle
            }
          >
            Choose your path
          </p>

          <h2
            style={{
              margin:
                "9px 0 10px",
              color:
                COLORS.navy,
              fontSize:
                "clamp(25px, 3.5vw, 34px)",
              letterSpacing:
                "-.03em",
            }}
          >
            Pack of Five is built
            for everyone helping animals.
          </h2>

          <p
            style={{
              margin:
                0,
              color:
                COLORS.muted,
              lineHeight:
                1.65,
              fontSize:
                15.5,
            }}
          >
            Start with the portal or
            public resources that fit
            what you need today.
          </p>
        </div>

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap:
              18,
          }}
        >
          <PortalCard
            background={
              COLORS.org
            }
            symbol="ORG"
            title="Rescue or Shelter"
            text="Manage animals, records, public profiles, foster and help offers, and your organization information."
            primaryHref="/portal"
            primaryText="Organization Portal"
          />

          <PortalCard
            background={
              COLORS.owner
            }
            symbol="PET"
            title="Pet Owner"
            text="Access your Pack of Five pet-owner tools and account."
            primaryHref="/portal"
            primaryText="Pet Owner Portal"
          />

          <PortalCard
            background={
              COLORS.foster
            }
            symbol="FOS"
            title="Foster"
            text="Access approved foster relationships, animals, applications, and foster tools."
            primaryHref="/portal"
            primaryText="Foster Portal"
          />
        </div>
      </section>



      <section
        style={{
          background:
            COLORS.navy,
          color:
            COLORS.white,
        }}
      >
        <div
          style={{
            maxWidth:
              900,
            margin:
              "0 auto",
            padding:
              "54px 24px",
            textAlign:
              "center",
          }}
        >
          <p
            style={{
              margin:
                "0 0 10px",
              color:
                COLORS.pink,
              fontSize:
                12,
              fontWeight:
                800,
              letterSpacing:
                ".1em",
              textTransform:
                "uppercase",
            }}
          >
            Why Pack of Five
          </p>

          <h2
            style={{
              margin:
                "0 0 13px",
              fontSize:
                30,
              letterSpacing:
                "-.025em",
            }}
          >
            Make it easier to know
            what to do, where to go,
            and who can help.
          </h2>

          <p
            style={{
              maxWidth:
                700,
              margin:
                "0 auto",
              color:
                "rgba(255,255,255,.76)",
              fontSize:
                15,
              lineHeight:
                1.7,
            }}
          >
            Pack of Five develops
            accessible digital tools
            that connect people with
            the information, resources,
            organizations, and
            opportunities they need to
            improve animal welfare.
          </p>
        </div>
      </section>

      <footer
        style={{
          maxWidth:
            1180,
          margin:
            "0 auto",
          padding:
            "30px 24px 40px",
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "space-between",
          gap:
            18,
          flexWrap:
            "wrap",
          color:
            COLORS.muted,
          fontSize:
            13,
        }}
      >
        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap:
              18,
            flexWrap:
              "wrap",
          }}
        >
          <strong
            style={{
              color:
                COLORS.navy,
            }}
          >
            PACK OF FIVE
          </strong>

          <a
            href="/support"
            style={{
              color:
                COLORS.navy,
              fontWeight:
                750,
              textDecoration:
                "none",
            }}
          >
            Support Pack of Five
          </a>
        </div>

        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap:
              14,
          }}
        >
          <span>
            Better tools for people
            helping animals.
          </span>

          <a
            href="/admin"
            aria-label="Admin login"
            style={{
              color:
                "#9A9690",
              fontSize:
                10.5,
              textDecoration:
                "none",
            }}
          >
            Admin
          </a>
        </div>
      </footer>
    </main>
  );
}

function PublicHeader() {
  return (
    <header
      style={{
        background:
          COLORS.white,
      }}
    >
      <div
        style={{
          maxWidth:
            1180,
          minHeight:
            72,
          margin:
            "0 auto",
          padding:
            "0 24px",
          display:
            "flex",
          alignItems:
            "center",
        }}
      >
        <a
          href="/"
          aria-label="Pack of Five home"
          style={{
            display:
              "inline-flex",
            alignItems:
              "center",
            gap:
              10,
            color:
              COLORS.navy,
            textDecoration:
              "none",
          }}
        >
          <PawMark />

          <span
            style={{
              fontFamily:
                '"Space Grotesk", Arial, sans-serif',
              fontWeight:
                700,
              fontSize:
                19,
              letterSpacing:
                ".035em",
            }}
          >
            PACK OF FIVE
          </span>
        </a>
      </div>
    </header>
  );
}

function PawMark() {
  return (
    <span
      aria-hidden="true"
      style={{
        position:
          "relative",
        display:
          "inline-block",
        width:
          32,
        height:
          30,
        flex:
          "0 0 auto",
      }}
    >
      <span
        style={{
          ...toeStyle,
          left:
            1,
          top:
            6,
          background:
            COLORS.coral,
          transform:
            "rotate(-24deg)",
        }}
      />

      <span
        style={{
          ...toeStyle,
          left:
            8,
          top:
            0,
          background:
            COLORS.peach,
          transform:
            "rotate(-8deg)",
        }}
      />

      <span
        style={{
          ...toeStyle,
          right:
            7,
          top:
            0,
          background:
            COLORS.mint,
          transform:
            "rotate(8deg)",
        }}
      />

      <span
        style={{
          ...toeStyle,
          right:
            0,
          top:
            6,
          background:
            COLORS.pink,
          transform:
            "rotate(24deg)",
        }}
      />

      <span
        style={{
          position:
            "absolute",
          left:
            7,
          bottom:
            0,
          width:
            19,
          height:
            17,
          borderRadius:
            "50% 50% 45% 45%",
          background:
            COLORS.navy,
        }}
      />
    </span>
  );
}

function PortalCard({
  background,
  symbol,
  title,
  text,
  primaryHref,
  primaryText,
  secondaryHref,
  secondaryText,
}: {
  background: string;
  symbol: string;
  title: string;
  text: string;
  primaryHref: string;
  primaryText: string;
  secondaryHref?: string;
  secondaryText?: string;
}) {
  return (
    <article
      style={{
        background,
        padding:
          20,
        minHeight:
          230,
        display:
          "flex",
        flexDirection:
          "column",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display:
            "inline-flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          width:
            38,
          height:
            38,
          background:
            "rgba(255,255,255,.62)",
          color:
            COLORS.navy,
          fontSize:
            10,
          fontWeight:
            900,
          letterSpacing:
            ".08em",
          marginBottom:
            14,
        }}
      >
        {symbol}
      </span>

      <h3
        style={{
          margin:
            "0 0 10px",
          color:
            COLORS.navy,
          fontSize:
            20,
          letterSpacing:
            "-.025em",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin:
            "0 0 15px",
          color:
            COLORS.muted,
          fontSize:
            13.5,
          lineHeight:
            1.65,
          flex:
            1,
        }}
      >
        {text}
      </p>

      <a
        href={
          primaryHref
        }
        style={{
          color:
            COLORS.navy,
          fontWeight:
            800,
          textDecoration:
            "none",
          fontSize:
            14,
        }}
      >
        {primaryText} →
      </a>

      {secondaryHref &&
      secondaryText ? (
        <a
          href={
            secondaryHref
          }
          style={{
            color:
              COLORS.muted,
            fontWeight:
              700,
            textDecoration:
              "none",
            fontSize:
              12.5,
            marginTop:
              10,
          }}
        >
          {secondaryText}
        </a>
      ) : null}
    </article>
  );
}

function ActionLink({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href: string;
}) {
  return (
    <a
      href={href}
      style={{
        display:
          "block",
        padding:
          "15px 16px",
        color:
          "inherit",
        textDecoration:
          "none",
        background:
          title === "Directory"
            ? COLORS.org
            : title === "Adoptable Pets"
            ? COLORS.foster
            : title === "Resources"
            ? COLORS.owner
            : COLORS.hero,
      }}
    >
      <strong
        style={{
          display:
            "block",
          color:
            COLORS.navy,
          fontSize:
            14.5,
          marginBottom:
            7,
        }}
      >
        {title}
      </strong>

      <span
        style={{
          color:
            COLORS.muted,
          fontSize:
            13.5,
          lineHeight:
            1.55,
        }}
      >
        {text}
      </span>

      <span
        style={{
          display:
            "block",
          color:
            COLORS.coral,
          fontWeight:
            800,
          marginTop:
            8,
          fontSize:
            13,
        }}
      >
        Explore →
      </span>
    </a>
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
          COLORS.white,
        padding:
          "22px 24px",
      }}
    >
      <strong
        style={{
          display:
            "block",
          color:
            COLORS.navy,
          fontSize:
            30,
          lineHeight:
            1,
          marginBottom:
            7,
        }}
      >
        {value.toLocaleString()}
      </strong>

      <span
        style={{
          color:
            COLORS.muted,
          fontSize:
            13.5,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function readArray(
  data: unknown
): Array<
  Record<string, unknown>
> {
  if (
    !data ||
    typeof data !==
      "object"
  ) {
    return [];
  }

  if (Array.isArray(data)) {
    return data.filter(
      (item): item is Record<
        string,
        unknown
      > =>
        Boolean(item) &&
        typeof item ===
          "object"
    );
  }

  const record =
    data as Record<
      string,
      unknown
    >;

  for (const key of [
    "animals",
    "results",
    "items",
    "data",
  ]) {
    const value =
      record[key];

    if (
      Array.isArray(value)
    ) {
      return value.filter(
        (item): item is Record<
          string,
          unknown
        > =>
          Boolean(item) &&
          typeof item ===
            "object"
      );
    }
  }

  return [];
}

function normalizeSuccessAnimal(
  row: Record<
    string,
    unknown
  >
) {
  const id =
    stringValue(
      row.id
    );

  const name =
    stringValue(
      row.name
    ) ||
    stringValue(
      row.public_name
    ) ||
    "Adopted";

  const directPhoto =
    stringValue(
      row.photo_url
    ) ||
    stringValue(
      row.photoUrl
    ) ||
    stringValue(
      row.profile_photo_url
    );

  const photo =
    row.photo &&
    typeof row.photo ===
      "object"
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
    directPhoto ||
    photo;

  if (
    !id ||
    !photoUrl
  ) {
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
  return typeof value ===
      "string" &&
    value.trim()
    ? value.trim()
    : null;
}

function readCount(
  data: unknown
): number | null {
  if (
    !data ||
    typeof data !==
      "object"
  ) {
    return null;
  }

  const record =
    data as Record<
      string,
      unknown
    >;

  const directKeys = [
    "count",
    "total",
    "totalCount",
  ];

  for (
    const key of directKeys
  ) {
    const value =
      record[key];

    if (
      typeof value ===
        "number" &&
      Number.isFinite(
        value
      )
    ) {
      return value;
    }
  }

  return null;
}

const toeStyle: React.CSSProperties = {
  position:
    "absolute",
  width:
    8,
  height:
    11,
  borderRadius:
    "50%",
};

const eyebrowStyle: React.CSSProperties = {
  margin:
    0,
  color:
    COLORS.coral,
  fontSize:
    11.5,
  fontWeight:
    800,
  letterSpacing:
    ".11em",
  textTransform:
    "uppercase",
};

const primaryButton: React.CSSProperties = {
  display:
    "inline-block",
  background:
    COLORS.navy,
  color:
    "#fff",
  padding:
    "11px 17px",
  textDecoration:
    "none",
  fontWeight:
    800,
  fontSize:
    14,
};

const secondaryButton: React.CSSProperties = {
  display:
    "inline-block",
  background:
    COLORS.white,
  color:
    COLORS.navy,
  padding:
    "11px 17px",
  textDecoration:
    "none",
  fontWeight:
    800,
  fontSize:
    14,
};
