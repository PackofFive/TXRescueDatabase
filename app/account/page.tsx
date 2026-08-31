"use client";

import { useEffect, useState } from "react";

type AccountUser = {
  email: string;
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
};

export default function AccountPage() {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setUser(data.user ?? null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ color: COLORS.muted }}>Loading your account…</p>;
  }

  if (!user) {
    return (
      <section style={panelStyle}>
        <h1 style={headingStyle}>Account</h1>
        <p style={bodyStyle}>Sign in to view your Pack of Five account.</p>
        <a href="/login" style={primaryLinkStyle}>Sign In</a>
      </section>
    );
  }

  const portals = user.availablePortals ?? [];
  const hasVolunteerPortal = portals.includes("foster");
  const hasPetOwnerPortal = portals.includes("pet-owner");
  const hasRescueManager = portals.includes("organization");
  const hasAdmin = portals.includes("admin");

  return (
    <div>
      <p style={eyebrowStyle}>PACK OF FIVE ACCOUNT</p>
      <h1 style={headingStyle}>My Account</h1>
      <p style={{ ...bodyStyle, maxWidth: 720 }}>
        Your account signs you into Pack of Five. Volunteer, pet owner,
        rescue, and administrative profiles remain separate so each area
        shows only the information appropriate for that role.
      </p>

      <section style={panelStyle}>
        <h2 style={sectionHeadingStyle}>Account details</h2>
        <div style={detailRowStyle}>
          <span style={labelStyle}>Email</span>
          <strong style={valueStyle}>{user.email}</strong>
        </div>
        <div style={detailRowStyle}>
          <span style={labelStyle}>Account status</span>
          <strong style={approvedBadgeStyle}>
            {user.status === "approved" ? "Active" : user.status ?? "Active"}
          </strong>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={sectionHeadingStyle}>My workspaces and profiles</h2>
        <p style={bodyStyle}>
          Choose the area you want to manage. Changes in one profile do not
          overwrite your information in another profile.
        </p>

        <div style={cardGridStyle}>
          {hasVolunteerPortal && (
            <ProfileCard
              title="Volunteer Portal"
              description="Manage your volunteer and foster profile, rescue relationships, availability, and approved service categories."
              links={[
                { href: "/foster", label: "Open Volunteer Portal" },
                { href: "/foster/profile", label: "Volunteer Profile" },
              ]}
            />
          )}

          {hasPetOwnerPortal && (
            <ProfileCard
              title="Pet Owner"
              description="Manage your personal pet owner profile and private pet records."
              links={[
                { href: "/pet-owner", label: "Open Pet Owner" },
                { href: "/pet-owner/profile", label: "Pet Owner Profile" },
              ]}
            />
          )}

          {hasRescueManager && (
            <ProfileCard
              title="Rescue Manager"
              description="Open the private workspace for your approved rescue or shelter organization."
              links={[{ href: "/portal", label: "Open Rescue Manager" }]}
            />
          )}

          {hasAdmin && (
            <ProfileCard
              title="Platform Administration"
              description="Open Pack of Five platform administration. This is separate from rescue organization access."
              links={[{ href: "/admin", label: "Open Administration" }]}
            />
          )}
        </div>
      </section>

      <section style={privacyPanelStyle}>
        <h2 style={sectionHeadingStyle}>One sign-in, separate roles</h2>
        <p style={{ ...bodyStyle, marginBottom: 0 }}>
          A volunteer can work with multiple rescues, and each rescue approves
          its own categories and access level. Your general account does not
          give a rescue permission to edit another profile or another rescue’s
          relationship with you.
        </p>
      </section>
    </div>
  );
}

function ProfileCard({
  title,
  description,
  links,
}: {
  title: string;
  description: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <article style={cardStyle}>
      <h3 style={{ margin: 0, color: COLORS.navy, fontSize: 19 }}>{title}</h3>
      <p style={{ ...bodyStyle, margin: 0 }}>{description}</p>
      <div style={linkRowStyle}>
        {links.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            style={index === 0 ? primaryLinkStyle : secondaryLinkStyle}
          >
            {link.label}
          </a>
        ))}
      </div>
    </article>
  );
}

const eyebrowStyle: React.CSSProperties = {
  margin: "0 0 8px",
  color: COLORS.coral,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: ".1em",
};

const headingStyle: React.CSSProperties = {
  margin: "0 0 10px",
  color: COLORS.navy,
  fontSize: 36,
  lineHeight: 1.1,
};

const sectionHeadingStyle: React.CSSProperties = {
  margin: "0 0 10px",
  color: COLORS.navy,
  fontSize: 21,
};

const bodyStyle: React.CSSProperties = {
  color: COLORS.muted,
  fontSize: 14,
  lineHeight: 1.6,
};

const panelStyle: React.CSSProperties = {
  marginTop: 24,
  padding: 22,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.white,
};

const detailRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  padding: "13px 0",
  borderTop: `1px solid ${COLORS.border}`,
  flexWrap: "wrap",
};

const labelStyle: React.CSSProperties = {
  color: COLORS.muted,
  fontSize: 13,
  fontWeight: 700,
};

const valueStyle: React.CSSProperties = {
  color: COLORS.navy,
  fontSize: 14,
  overflowWrap: "anywhere",
};

const approvedBadgeStyle: React.CSSProperties = {
  color: COLORS.navy,
  background: COLORS.mint,
  borderRadius: 999,
  padding: "5px 10px",
  fontSize: 12,
};

const cardGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 14,
  marginTop: 16,
};

const cardStyle: React.CSSProperties = {
  display: "grid",
  alignContent: "start",
  gap: 12,
  minHeight: 180,
  padding: 20,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.white,
};

const linkRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  marginTop: "auto",
};

const primaryLinkStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 13px",
  color: COLORS.white,
  background: COLORS.navy,
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 800,
};

const secondaryLinkStyle: React.CSSProperties = {
  color: COLORS.navy,
  fontSize: 13,
  fontWeight: 800,
};

const privacyPanelStyle: React.CSSProperties = {
  marginTop: 24,
  padding: 20,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.mint,
};
