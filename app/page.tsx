"use client";

const COLORS = {
  navy: "#17233C",
  coral: "#E8634A",
  text: "#1C1B19",
  muted: "#6B6862",
  border: "#E7E5E1",
  surface: "#FFFFFF",
  soft: "#F7F7F5",
  warm: "#FFF7F2",
};

export default function HomePage() {
  return (
    <main
      style={{
        maxWidth: 1180,
        margin: "0 auto",
        padding: "40px 24px 70px",
      }}
    >
      {/* HERO */}

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 32,
          alignItems: "center",
          padding: "28px 0 48px",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: ".1em",
              color: COLORS.coral,
              textTransform: "uppercase",
            }}
          >
            Animal Welfare · Rescue · Resources
          </p>

          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 62px)",
              lineHeight: 1.05,
              color: COLORS.navy,
              margin: "12px 0 16px",
              maxWidth: 720,
            }}
          >
            Better tools for people helping animals.
          </h1>

          <p
            style={{
              color: COLORS.muted,
              fontSize: 17,
              lineHeight: 1.7,
              maxWidth: 680,
              margin: "0 0 24px",
            }}
          >
            Pack of Five connects people with rescues,
            shelters, animal-welfare resources, adoptable
            pets, and practical ways to help.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <a
              href="/organizations"
              style={primaryLink}
            >
              Find Rescue & Resources
            </a>

            <a
              href="/adoptable"
              style={secondaryLink}
            >
              Find Adoptable Pets
            </a>
          </div>
        </div>

        <div
          style={{
            background: COLORS.warm,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 18,
            padding: 26,
            minHeight: 260,
            display: "grid",
            alignContent: "center",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              color: COLORS.muted,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: ".08em",
            }}
          >
            PACK OF FIVE
          </p>

          <h2
            style={{
              margin: "0 0 12px",
              color: COLORS.navy,
              fontSize: 26,
            }}
          >
            Built around practical action.
          </h2>

          <p
            style={{
              margin: 0,
              color: COLORS.muted,
              fontSize: 14.5,
              lineHeight: 1.65,
            }}
          >
            Search for organizations, find animals,
            connect with rescues, offer foster help,
            and access information designed to make
            animal-welfare support easier to navigate.
          </p>
        </div>
      </section>

      {/* CORE AREAS */}

      <section
        style={{
          marginTop: 10,
        }}
      >
        <SectionEyebrow>
          What Pack of Five is building
        </SectionEyebrow>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginTop: 14,
          }}
        >
          <FeatureCard
            title="Rescue & Resources"
            text="Search rescues, shelters, and animal-welfare resources by location, species, capability, and need."
            href="/organizations"
            linkText="Explore the Rescue Network"
          />

          <FeatureCard
            title="Responsible Pet Ownership"
            text="Practical resources to help people care for, keep, and better support their pets."
            href="/resources"
            linkText="View Resources"
          />

          <FeatureCard
            title="Help Animals"
            text="Discover animals needing homes, foster support, rescue placement, medical assistance, or other help."
            href="/adoptable"
            linkText="Find Animals"
          />
        </div>
      </section>

      {/* FOR RESCUES */}

      <section
        style={{
          marginTop: 46,
          background: COLORS.navy,
          color: "#fff",
          borderRadius: 18,
          padding: 28,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: ".08em",
            opacity: 0.72,
          }}
        >
          FOR RESCUES & SHELTERS
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 2fr) minmax(240px, 1fr)",
            gap: 24,
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 28,
                margin: "0 0 10px",
              }}
            >
              Manage animals and connect with the community.
            </h2>

            <p
              style={{
                margin: 0,
                lineHeight: 1.65,
                color: "rgba(255,255,255,.78)",
                maxWidth: 720,
              }}
            >
              Rescue Manager gives organizations a private
              workspace for animal records, medical tracking,
              public profiles, foster/help offers, and
              organization information.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <a
              href="/portal"
              style={{
                ...lightButton,
                background: "#fff",
                color: COLORS.navy,
              }}
            >
              Rescue Manager
            </a>

            <a
              href="/claim"
              style={{
                ...lightButton,
                background: "transparent",
                color: "#fff",
                border:
                  "1px solid rgba(255,255,255,.45)",
              }}
            >
              Claim Organization
            </a>
          </div>
        </div>
      </section>

      {/* PUBLIC ACTIONS */}

      <section
        style={{
          marginTop: 46,
        }}
      >
        <SectionEyebrow>
          Start here
        </SectionEyebrow>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginTop: 14,
          }}
        >
          <QuickCard
            title="Find an Organization"
            text="Search the Texas rescue and resource database."
            href="/organizations"
          />

          <QuickCard
            title="Request an Organization"
            text="Suggest a rescue, shelter, or resource that should be added."
            href="/request-organization"
          />

          <QuickCard
            title="Find Adoptable Pets"
            text="Browse public animal profiles shared by participating organizations."
            href="/adoptable"
          />

          <QuickCard
            title="Support Pack of Five"
            text="Learn how to support the development of free animal-welfare tools."
            href="/support"
          />
        </div>
      </section>

      {/* FOOTER MESSAGE */}

      <section
        style={{
          marginTop: 54,
          paddingTop: 28,
          borderTop: `1px solid ${COLORS.border}`,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: COLORS.navy,
            fontSize: 24,
            margin: "0 0 8px",
          }}
        >
          Built for the people doing the work.
        </h2>

        <p
          style={{
            color: COLORS.muted,
            maxWidth: 680,
            margin: "0 auto",
            lineHeight: 1.6,
            fontSize: 14,
          }}
        >
          Pack of Five is developing accessible digital tools
          that make animal-welfare information easier to find,
          understand, share, and act on.
        </p>
      </section>
    </main>
  );
}

function FeatureCard({
  title,
  text,
  href,
  linkText,
}: {
  title: string;
  text: string;
  href: string;
  linkText: string;
}) {
  return (
    <article
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: 20,
      }}
    >
      <h2
        style={{
          margin: "0 0 8px",
          fontSize: 20,
          color: COLORS.navy,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: "0 0 16px",
          color: COLORS.muted,
          lineHeight: 1.6,
          fontSize: 14,
        }}
      >
        {text}
      </p>

      <a
        href={href}
        style={{
          color: COLORS.coral,
          fontWeight: 700,
          textDecoration: "none",
          fontSize: 13.5,
        }}
      >
        {linkText} →
      </a>
    </article>
  );
}

function QuickCard({
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
        display: "block",
        textDecoration: "none",
        background: COLORS.soft,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 18,
        color: "inherit",
      }}
    >
      <strong
        style={{
          display: "block",
          color: COLORS.navy,
          fontSize: 15,
          marginBottom: 6,
        }}
      >
        {title}
      </strong>

      <span
        style={{
          color: COLORS.muted,
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        {text}
      </span>
    </a>
  );
}

function SectionEyebrow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: ".08em",
        color: COLORS.muted,
        textTransform: "uppercase",
      }}
    >
      {children}
    </p>
  );
}

const primaryLink: React.CSSProperties = {
  display: "inline-block",
  background: COLORS.navy,
  color: "#fff",
  padding: "11px 17px",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 14,
};

const secondaryLink: React.CSSProperties = {
  display: "inline-block",
  background: "#fff",
  color: COLORS.navy,
  padding: "11px 17px",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 14,
  border: `1px solid ${COLORS.border}`,
};

const lightButton: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 13.5,
};
