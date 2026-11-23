"use client";

import { useMemo, useState } from "react";

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
    steps: [
      "Search the immediate area and ask nearby neighbors or businesses when the animal was last seen.",
      "Contact nearby shelters, animal services, veterinary clinics, and the animal's microchip company when applicable.",
      "Share a clear photo, general location, date, and safe contact method without publishing sensitive ownership details.",
      "Keep a record of reports, identification numbers, and every organization contacted.",
    ],
  },
  {
    title: "Pet Retention & Owner Support",
    text: "Find help that may allow a pet to remain safely with their family, including food, supplies, temporary assistance, and other support.",
    background: "#DCF0E8",
    steps: [
      "Write down the specific help needed and how soon it is needed.",
      "Search the directory for organizations offering owner support, food, supplies, temporary care, or related services.",
      "Ask providers what documents, eligibility information, or appointments they require before traveling.",
      "Make a short-term safety plan while requests are being reviewed.",
    ],
  },
  {
    title: "Owner Surrender",
    text: "Understand surrender options and find organizations or services that may be able to help before surrendering a pet.",
    background: "#FBE3DA",
    steps: [
      "Contact the organization before arriving; intake availability and requirements can change.",
      "Prepare medical, vaccination, behavior, ownership, and identification records.",
      "Be specific about timing and the circumstances so organizations can evaluate safe options.",
      "Never abandon an animal outside a facility or transfer the animal to an unverified person.",
    ],
  },
  {
    title: "Emergency & Medical Help",
    text: "Resources for urgent veterinary needs, medical assistance, and organizations that may offer financial or community support.",
    background: "#FFFFFF",
    steps: [
      "If the animal may be in immediate danger, contact a veterinary professional or emergency clinic now.",
      "Describe symptoms, timing, medications, known exposures, and the animal's approximate age and weight.",
      "Ask the treating provider about written estimates, payment options, and reputable assistance programs.",
      "Do not delay urgent care while waiting for an online response or financial-support application.",
    ],
  },
  {
    title: "Cruelty, Neglect & Animal Safety",
    text: "Guidance for reporting suspected cruelty, neglect, abandonment, or an animal in immediate danger.",
    background: "#FFFFFF",
    steps: [
      "For immediate danger, contact the appropriate local emergency authority rather than intervening physically.",
      "Record dates, locations, objective observations, and any report or case number provided to you.",
      "Preserve original photos or video when they can be obtained safely and lawfully.",
      "Avoid trespassing, confrontation, or social-media accusations that could endanger people, animals, or an investigation.",
    ],
  },
  {
    title: "Rescue, Foster & Transport",
    text: "Resources for people helping animals through rescue placement, temporary foster care, transport, networking, and other intervention.",
    background: "#FFFFFF",
    steps: [
      "Clarify whether help is needed for placement, foster care, transport, supplies, medical support, or networking.",
      "Confirm who currently has legal custody and who may authorize care or transfer.",
      "Use verified organization contacts and keep commitments, approvals, and handoffs in writing.",
      "Do not transport or transfer an animal until the responsible organizations approve the plan.",
    ],
  },
  {
    title: "Responsible Pet Ownership",
    text: "Practical information for caring for pets, preventing unwanted litters, planning ahead, and keeping animals safe.",
    background: "#FFFFFF",
    steps: [
      "Keep identification, microchip, vaccination, medication, and veterinary contact information current.",
      "Plan in advance for travel, emergencies, evacuation, temporary care, and changes in household circumstances.",
      "Use secure containment, appropriate supervision, and species-specific preventive care.",
      "Store important records where another trusted person can find them during an emergency.",
    ],
  },
  {
    title: "Shelters & Rescue Organizations",
    text: "Use the Texas Organization Directory to find rescues, shelters, animal services, and other animal-welfare organizations.",
    background: "#FFFFFF",
    href: "/organizations",
    action: "Open Directory",
    steps: [],
  },
];

export default function Page() {
  const [query, setQuery] = useState("");
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const visibleResources = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return resources;
    return resources.filter((resource) => `${resource.title} ${resource.text} ${resource.steps.join(" ")}`.toLowerCase().includes(normalized));
  }, [query]);

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

      <div style={{ marginBottom: 16, padding: 16, background: "#FBEFF1", border: `1px solid ${COLORS.border}` }}>
        <strong style={{ display: "block", color: COLORS.navy, fontSize: 14 }}>Is an animal or person in immediate danger?</strong>
        <span style={{ display: "block", marginTop: 4, color: COLORS.muted, fontSize: 12.5, lineHeight: 1.5 }}>Contact the appropriate local emergency authority or veterinary professional now. Do not wait for a directory response or online resource request.</span>
      </div>

      <label style={{ display: "grid", gap: 6, marginBottom: 14, color: COLORS.navy, fontSize: 12.5, fontWeight: 800 }}>
        Search resource topics
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Lost pet, surrender, medical help, foster…" style={{ width: "100%", boxSizing: "border-box", padding: "11px 12px", border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.navy, font: "inherit" }} />
      </label>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(235px, 1fr))",
          gap: 12,
        }}
      >
        {visibleResources.map((resource) => (
          <ResourceCard
            key={resource.title}
            {...resource}
            expanded={openTitle === resource.title}
            onToggle={() => setOpenTitle((current) => current === resource.title ? null : resource.title)}
          />
        ))}
      </div>

      {visibleResources.length === 0 ? <div role="status" style={{ padding: 18, border: `1px solid ${COLORS.border}`, color: COLORS.muted, background: COLORS.white }}>No resource topic matches that search. Try a broader word or search the Organization Directory.</div> : null}

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
        These starting guides provide general information only. They do not
        replace emergency veterinary care, animal control, law enforcement,
        legal advice, or instructions from an organization handling the case.
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
  steps,
  expanded,
  onToggle,
}: {
  title: string;
  text: string;
  background: string;
  href?: string;
  action?: string;
  steps: string[];
  expanded: boolean;
  onToggle: () => void;
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
      ) : steps.length > 0 ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={onToggle}
          style={{
            alignSelf: "flex-start",
            marginTop: 12,
            padding: 0,
            border: 0,
            background: "transparent",
            color: COLORS.coral,
            font: "inherit",
            fontSize: 12.5,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {expanded ? "Hide starting steps" : "View starting steps"} {expanded ? "↑" : "↓"}
        </button>
      ) : null}

      {expanded && steps.length > 0 ? (
        <ol style={{ margin: "13px 0 0", paddingLeft: 20, color: COLORS.muted, fontSize: 12.25, lineHeight: 1.5 }}>
          {steps.map((step) => <li key={step} style={{ marginTop: 7 }}>{step}</li>)}
        </ol>
      ) : null}
    </article>
  );
}
