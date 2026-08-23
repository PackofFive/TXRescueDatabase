const DONATE_URL =
  process.env.NEXT_PUBLIC_DONATE_URL;

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  peach: "#F2A48D",
  mint: "#A9DCC9",
  pink: "#F2D6DC",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
};

export default function SupportPage() {
  return (
    <section
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "8px 0 44px",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          marginBottom: 22,
        }}
      >
        <p
          style={{
            margin: "0 0 7px",
            color: COLORS.coral,
            fontSize: 11.5,
            fontWeight: 800,
            letterSpacing: ".1em",
            textTransform: "uppercase",
          }}
        >
          Support Pack of Five
        </p>

        <h1
          style={{
            margin: 0,
            color: COLORS.navy,
            fontSize: "clamp(28px, 4vw, 36px)",
            lineHeight: 1.08,
            letterSpacing: "-.03em",
          }}
        >
          Help keep animal-welfare tools accessible.
        </h1>

        <p
          style={{
            margin: "10px 0 0",
            color: COLORS.muted,
            fontSize: 14.5,
            lineHeight: 1.6,
          }}
        >
          Pack of Five is being built to make animal-welfare
          information, rescue resources, and practical digital
          tools easier to access. The goal is to keep core tools
          free for rescues, shelters, fosters, pet owners, and
          the public whenever possible.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <SupportCard
          background={COLORS.pink}
          title="Support Development"
          text="Help cover hosting, software, data, and feature-development costs as Pack of Five grows."
        />

        <SupportCard
          background={COLORS.mint}
          title="Partner With Pack of Five"
          text="Future partnerships may support rescue resources, community programs, sponsorships, and shared animal-welfare projects."
        />

        <SupportCard
          background={COLORS.peach}
          title="Help Improve the Network"
          text="Share missing organizations, resource information, corrections, and ideas that make the public network more useful."
        />
      </div>

      <div
        style={{
          background: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          padding: 20,
        }}
      >
        <h2
          style={{
            margin: "0 0 8px",
            color: COLORS.navy,
            fontSize: 18,
          }}
        >
          Optional financial support
        </h2>

        <p
          style={{
            margin: 0,
            color: COLORS.muted,
            fontSize: 13.5,
            lineHeight: 1.6,
            maxWidth: 700,
          }}
        >
          Contributions are optional. Organizations do not need
          to pay to be listed in the public directory, and Pack
          of Five is being designed so that essential rescue and
          shelter tools can remain accessible without requiring
          paid participation.
        </p>

        {DONATE_URL ? (
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: 16,
              padding: "10px 15px",
              background: COLORS.navy,
              color: "#fff",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            Support Pack of Five
          </a>
        ) : (
          <p
            style={{
              fontSize: 12.5,
              color: COLORS.muted,
              margin: "14px 0 0",
              lineHeight: 1.5,
            }}
          >
            Online contributions are not enabled yet.
          </p>
        )}
      </div>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          fontSize: 12.5,
        }}
      >
        <a
          href="/request-organization"
          style={smallLink}
        >
          Request an Organization
        </a>

        <a
          href="/organizations"
          style={smallLink}
        >
          Organization Directory
        </a>

        <a
          href="/"
          style={smallLink}
        >
          Back to Pack of Five
        </a>
      </div>
    </section>
  );
}

function SupportCard({
  background,
  title,
  text,
}: {
  background: string;
  title: string;
  text: string;
}) {
  return (
    <article
      style={{
        background,
        padding: 16,
        minHeight: 132,
      }}
    >
      <h2
        style={{
          margin: "0 0 7px",
          color: COLORS.navy,
          fontSize: 16.5,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: 0,
          color: COLORS.muted,
          fontSize: 12.75,
          lineHeight: 1.5,
        }}
      >
        {text}
      </p>
    </article>
  );
}

const smallLink:
  React.CSSProperties = {
    color: COLORS.navy,
    textDecoration: "none",
    fontWeight: 700,
  };
