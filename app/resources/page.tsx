export const runtime = "edge";

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  peach: "#F2A48D",
  mint: "#A9DCC9",
  pink: "#F2D6DC",
  text: "#1E3A5F",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
};

const resources = [
  {
    title: "Lost or Found Animal",
    text: "Steps and local resources for lost pets, found animals, stray animals, microchips, and reunification.",
    background: "#FBEFF1",
  },
  {
    title: "Pet Retention & Owner Support",
    text: "Find help that may allow a pet to remain safely with their family, including food, supplies, temporary assistance, and other support.",
    background: "#DCF0E8",
  },
  {
    title: "Owner Surrender",
    text: "Understand surrender options and find organizations or services that may be able to help before surrendering a pet.",
    background: "#FBE3DA",
  },
  {
    title: "Emergency & Medical Help",
    text: "Resources for urgent veterinary needs, medical assistance, and organizations that may offer financial or community support.",
    background: "#FFFFFF",
  },
  {
    title: "Cruelty, Neglect & Animal Safety",
    text: "Guidance for reporting suspected cruelty, neglect, abandonment, or an animal in immediate danger.",
    background: "#FFFFFF",
  },
  {
    title: "Rescue, Foster & Transport",
    text: "Resources for people helping animals through rescue placement, temporary foster care, transport, networking, and other intervention.",
    background: "#FFFFFF",
  },
  {
    title: "Responsible Pet Ownership",
    text: "Practical information for caring for pets, preventing unwanted litters, planning ahead, and keeping animals safe.",
    background: "#FFFFFF",
  },
  {
    title: "Shelters & Rescue Organizations",
    text: "Use the Texas Organization Directory to find rescues, shelters, animal services, and other animal-welfare organizations.",
    background: "#FFFFFF",
    href: "/organizations",
    action: "Open Directory",
  },
];

export default function Page() {
  return (
    <section
      style={{
        maxWidth: 1040,
        margin: "0 auto",
        padding: "8px 0 44px",
      }}
    >
      <div
        style={{
          marginBottom: 22,
          maxWidth: 760,
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
          Public Access · Texas
        </p>

        <h1
          style={{
            margin: 0,
            color: COLORS.navy,
            fontSize: "clamp(28px, 4vw, 38px)",
            lineHeight: 1.08,
            letterSpacing: "-.03em",
          }}
        >
          Find Help &amp; Resources
        </h1>

        <p
          style={{
            margin: "10px 0 0",
            color: COLORS.muted,
            fontSize: 14.5,
            lineHeight: 1.6,
            maxWidth: 720,
          }}
        >
          Start with what you need help with. Pack of Five is
          building a practical Texas resource hub for animal
          welfare, rescue support, and responsible pet ownership.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(235px, 1fr))",
          gap: 12,
        }}
      >
        {resources.map((resource) => (
          <ResourceCard
            key={resource.title}
            {...resource}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          padding: "16px 18px",
          background: COLORS.navy,
          color: COLORS.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            Looking for a specific organization?
          </p>

          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12.5,
              lineHeight: 1.5,
              opacity: 0.84,
            }}
          >
            Search Texas rescues, shelters, and animal-welfare
            organizations by location and services.
          </p>
        </div>

        <a
          href="/organizations"
          style={{
            display: "inline-block",
            padding: "9px 13px",
            background: COLORS.white,
            color: COLORS.navy,
            textDecoration: "none",
            fontSize: 12.5,
            fontWeight: 800,
            whiteSpace: "nowrap",
          }}
        >
          Organization Directory
        </a>
      </div>

      <p
        style={{
          margin: "16px 0 0",
          color: COLORS.muted,
          fontSize: 11.5,
          lineHeight: 1.5,
        }}
      >
        Resource guides and searchable assistance options are
        being added as Pack of Five develops. This page does not
        replace emergency veterinary care, animal control, law
        enforcement, or other appropriate local authorities.
      </p>
    </section>
  );
}

function ResourceCard({
  title,
  text,
  background,
  href,
  action,
}: {
  title: string;
  text: string;
  background: string;
  href?: string;
  action?: string;
}) {
  return (
    <article
      style={{
        background,
        border:
          background === COLORS.white
            ? `1px solid ${COLORS.border}`
            : "1px solid transparent",
        padding: 16,
        minHeight: 145,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          margin: "0 0 7px",
          color: COLORS.navy,
          fontSize: 16,
          lineHeight: 1.25,
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
          flex: 1,
        }}
      >
        {text}
      </p>

      {href && action ? (
        <a
          href={href}
          style={{
            marginTop: 12,
            color: COLORS.coral,
            textDecoration: "none",
            fontSize: 12.5,
            fontWeight: 800,
          }}
        >
          {action} →
        </a>
      ) : (
        <span
          style={{
            marginTop: 12,
            color: COLORS.muted,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".04em",
            textTransform: "uppercase",
          }}
        >
          Resource guide coming soon
        </span>
      )}
    </article>
  );
}
