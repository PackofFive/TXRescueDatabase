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
              "74px 24px 72px",
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
                "clamp(42px, 7vw, 72px)",
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
                "22px auto 0",
              color:
                COLORS.muted,
              fontSize:
                18,
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

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "center",
              gap:
                12,
              flexWrap:
                "wrap",
              marginTop:
                30,
            }}
          >
            <a
              href="/organizations"
              style={
                primaryButton
              }
            >
              Find an Organization
            </a>

            <a
              href="/adoptable"
              style={
                secondaryButton
              }
            >
              Browse Adoptable Pets
            </a>
          </div>
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

      <section
        style={{
          maxWidth:
            1180,
          margin:
            "0 auto",
          padding:
            showStats
              ? "72px 24px 30px"
              : "64px 24px 30px",
        }}
      >
        <div
          style={{
            textAlign:
              "center",
            maxWidth:
              720,
            margin:
              "0 auto 30px",
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
                "clamp(28px, 4vw, 40px)",
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
            secondaryHref="/claim"
            secondaryText="Claim an Organization"
          />

          <PortalCard
            background={
              COLORS.owner
            }
            symbol="PET"
            title="Pet Owner"
            text="Find practical resources, animal-welfare information, and support designed to help people care for and keep their pets."
            primaryHref="/resources"
            primaryText="Pet Owner Resources"
          />

          <PortalCard
            background={
              COLORS.foster
            }
            symbol="FOS"
            title="Foster"
            text="Find animals needing foster support and, as the foster portal grows, manage approved foster relationships in one place."
            primaryHref="/adoptable"
            primaryText="Find Animals to Help"
          />
        </div>
      </section>

      <section
        style={{
          maxWidth:
            1180,
          margin:
            "0 auto",
          padding:
            "42px 24px 64px",
        }}
      >
        <p
          style={
            eyebrowStyle
          }
        >
          Public Rescue Network
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
            "28px 24px 38px",
          display:
            "flex",
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
        <strong
          style={{
            color:
              COLORS.navy,
          }}
        >
          PACK OF FIVE
        </strong>

        <span>
          Better tools for people
          helping animals.
        </span>
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
          justifyContent:
            "space-between",
          gap:
            22,
          flexWrap:
            "wrap",
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

        <nav
          aria-label="Public navigation"
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap:
              20,
            flexWrap:
              "wrap",
          }}
        >
          <NavLink
            href="/organizations"
            label="Directory"
          />

          <NavLink
            href="/adoptable"
            label="Adoptable Pets"
          />

          <NavLink
            href="/resources"
            label="Resources"
          />

          <NavLink
            href="/support"
            label="Support"
          />

          <a
            href="/portal"
            style={{
              ...primaryButton,
              padding:
                "9px 14px",
              fontSize:
                13,
            }}
          >
            Portal Login
          </a>
        </nav>
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

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      style={{
        color:
          COLORS.navy,
        textDecoration:
          "none",
        fontSize:
          13.5,
        fontWeight:
          700,
        whiteSpace:
          "nowrap",
      }}
    >
      {label}
    </a>
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
          26,
        minHeight:
          310,
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
            46,
          height:
            46,
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
            22,
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
            24,
          letterSpacing:
            "-.025em",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin:
            "0 0 24px",
          color:
            COLORS.muted,
          fontSize:
            14.5,
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
          "22px 20px",
        color:
          "inherit",
        textDecoration:
          "none",
      }}
    >
      <strong
        style={{
          display:
            "block",
          color:
            COLORS.navy,
          fontSize:
            16,
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
            13,
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
