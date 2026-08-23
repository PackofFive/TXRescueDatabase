"use client";

import { useEffect, useState } from "react";

type AuthUser = {
  id?: string;
  email?: string;
  role?: string;
  status?: string;
  availablePortals?: string[];
};

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
  page: "#FFFDFC",
};

export default function FosterPortalPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setUser(data.user ?? null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <StandaloneShell>
        <p style={{ color: COLORS.muted, margin: 0 }}>
          Loading…
        </p>
      </StandaloneShell>
    );
  }

  if (!user) {
    return (
      <StandaloneShell>
        <PortalIntro />

        <div style={panelStyle}>
          <strong style={panelTitleStyle}>
            Sign in to continue
          </strong>

          <p style={panelTextStyle}>
            Foster accounts will remain independent of any single
            rescue so one foster can work with multiple organizations.
          </p>

          <a href="/login?portal=foster" style={primaryLink}>
            Foster Sign In
          </a>
        </div>
      </StandaloneShell>
    );
  }

  const hasFosterAccess = (user.availablePortals ?? []).includes("foster");

  return (
    <StandaloneShell>
      <PortalIntro />

      {!hasFosterAccess ? (
        <div style={panelStyle}>
          <strong style={panelTitleStyle}>
            Foster access is not enabled for this account yet.
          </strong>

          <p style={panelTextStyle}>
            Foster access will be created when a rescue approves a
            foster relationship or sends an invitation. Public foster
            and help offers can still be submitted without an account first.
          </p>
        </div>
      ) : (
        <FosterDashboard />
      )}
    </StandaloneShell>
  );
}

function FosterDashboard() {
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 10,
          margin: "18px 0",
        }}
      >
        <StatCard value="0" label="Animals in My Care" />
        <StatCard value="0" label="Pending Offers" />
        <StatCard value="0" label="Rescue Relationships" />
        <StatCard value="0" label="Past Fosters" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
        }}
      >
        <Panel
          title="My Foster Animals"
          text="Animals currently assigned to you will appear here with the information the managing organization has approved for foster access."
        />
        <Panel
          title="Applications & Offers"
          text="Pending foster offers, applications, and rescue responses will appear here."
        />
        <Panel
          title="My Rescue Relationships"
          text="A foster can be approved by multiple rescues. Each rescue relationship will keep its own approval and access status."
        />
        <Panel
          title="Foster Profile"
          text="Availability, species or size preferences, housing details, transport availability, and other foster information will live here."
        />
      </div>
    </>
  );
}

function PortalIntro() {
  return (
    <div>
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
        Pack of Five
      </p>

      <h1
        style={{
          margin: 0,
          color: COLORS.navy,
          fontSize: 30,
          lineHeight: 1.1,
          letterSpacing: "-.025em",
        }}
      >
        Foster Portal
      </h1>

      <p
        style={{
          margin: "9px 0 0",
          color: COLORS.muted,
          fontSize: 14,
          lineHeight: 1.55,
          maxWidth: 680,
        }}
      >
        A rescue-independent foster workspace designed to support
        relationships with multiple organizations.
      </p>
    </div>
  );
}

function StandaloneShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: COLORS.page,
        padding: "28px 18px",
        boxSizing: "border-box",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-block",
            color: COLORS.muted,
            textDecoration: "none",
            fontSize: 12.5,
            fontWeight: 650,
            marginBottom: 22,
          }}
        >
          ← Back to Pack of Five
        </a>

        {children}
      </section>
    </main>
  );
}

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        padding: 14,
      }}
    >
      <strong
        style={{
          display: "block",
          color: COLORS.navy,
          fontSize: 23,
        }}
      >
        {value}
      </strong>

      <span
        style={{
          display: "block",
          marginTop: 4,
          color: COLORS.muted,
          fontSize: 12,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Panel({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <article
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        padding: 17,
        minHeight: 130,
      }}
    >
      <h2
        style={{
          margin: "0 0 7px",
          color: COLORS.navy,
          fontSize: 16,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: 0,
          color: COLORS.muted,
          fontSize: 12.75,
          lineHeight: 1.55,
        }}
      >
        {text}
      </p>
    </article>
  );
}

const panelStyle: React.CSSProperties = {
  background: COLORS.white,
  border: `1px solid ${COLORS.border}`,
  padding: 20,
  marginTop: 18,
};

const panelTitleStyle: React.CSSProperties = {
  display: "block",
  color: COLORS.navy,
  marginBottom: 6,
};

const panelTextStyle: React.CSSProperties = {
  margin: "0 0 14px",
  color: COLORS.muted,
  fontSize: 13.5,
  lineHeight: 1.55,
};

const primaryLink: React.CSSProperties = {
  display: "inline-block",
  background: COLORS.navy,
  color: "#fff",
  padding: "10px 14px",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 13,
};
