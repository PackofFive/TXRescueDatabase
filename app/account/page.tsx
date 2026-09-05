"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [acceptingInvite, setAcceptingInvite] = useState(false);
  const platformAdminInvite = searchParams.get("platformAdminInvite") ?? "";

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setUser(data.user ?? null))
      .finally(() => setLoading(false));
  }, []);

  async function changePassword(event: React.FormEvent) {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword !== confirmation) {
      setPasswordError("The two new passwords do not match.");
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          currentPassword,
          newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The password could not be changed.");
      setPasswordMessage(data.message);
      setPasswordChanged(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
    } catch (reason) {
      setPasswordError(reason instanceof Error ? reason.message : "The password could not be changed.");
    } finally {
      setChangingPassword(false);
    }
  }

  async function acceptPlatformInvitation() {
    setAcceptingInvite(true);
    setInviteError("");
    try {
      const response = await fetch("/api/admin/users/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept_invitation", token: platformAdminInvite }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The invitation could not be accepted.");
      setInviteMessage(data.message);
    } catch (reason) {
      setInviteError(reason instanceof Error ? reason.message : "The invitation could not be accepted.");
    } finally {
      setAcceptingInvite(false);
    }
  }

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
  const hasShelterExpress = portals.includes("shelter");
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

      {platformAdminInvite && !inviteMessage ? (
        <section style={{ ...panelStyle, background: COLORS.mint }}>
          <h2 style={sectionHeadingStyle}>Platform administrator invitation</h2>
          <p style={bodyStyle}>Review and accept this invitation while signed in with the exact email address that received it. Platform access does not grant access to any rescue or shelter workspace.</p>
          <button type="button" onClick={acceptPlatformInvitation} disabled={acceptingInvite} style={passwordButtonStyle}>
            {acceptingInvite ? "Accepting Secure Invitation…" : "Accept Platform Invitation"}
          </button>
          {inviteError ? <div role="alert" style={passwordErrorStyle}>{inviteError}</div> : null}
        </section>
      ) : null}
      {inviteMessage ? <section style={{ ...panelStyle, background: COLORS.mint }}><h2 style={sectionHeadingStyle}>Invitation accepted</h2><p style={bodyStyle}>{inviteMessage}</p><a href="/admin" style={primaryLinkStyle}>Open Administration</a></section> : null}

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

      <section style={securityPanelStyle}>
        <p style={securityEyebrowStyle}>PASSWORD &amp; SECURITY</p>
        <h2 style={sectionHeadingStyle}>Protect your account</h2>
        <p style={bodyStyle}>
          Changing your password ends older sessions across Pack of Five. This
          is especially important for accounts allowed to edit public pages or
          manage organization access.
        </p>

        {!passwordChanged ? (
          <form onSubmit={changePassword} style={passwordFormStyle}>
            <label style={passwordLabelStyle}>
              Current password
              <input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} style={passwordInputStyle} />
            </label>
            <label style={passwordLabelStyle}>
              New password
              <input type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} style={passwordInputStyle} />
            </label>
            <label style={passwordLabelStyle}>
              Confirm new password
              <input type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} style={passwordInputStyle} />
            </label>
            <p style={passwordRequirementsStyle}>Use 12–128 characters with an uppercase letter, lowercase letter, and number.</p>
            <button type="submit" disabled={changingPassword} style={passwordButtonStyle}>{changingPassword ? "Securing Account…" : "Change Password"}</button>
          </form>
        ) : null}

        {passwordMessage ? <div style={passwordSuccessStyle}>{passwordMessage}<a href="/login" style={passwordSignInStyle}>Sign In Again</a></div> : null}
        {passwordError ? <div role="alert" style={passwordErrorStyle}>{passwordError}</div> : null}
        {!passwordChanged ? <a href="/forgot-password" style={forgotLinkStyle}>Forgot your current password?</a> : null}
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
            <>
              <ProfileCard
                title="Rescue Manager"
                description="Open the full private workspace for your approved rescue or shelter organization."
                links={[
                  { href: "/portal", label: "Open Rescue Manager" },
                  { href: "/portal/organization-profile", label: "Organization Profile" },
                ]}
              />
            </>
          )}

          {hasShelterExpress && (
            <ProfileCard
              title="Shelter Express"
              description="Use the simplified workspace to add urgent animals, publish profiles, and coordinate rescue help."
              links={[{ href: "/shelter-express", label: "Open Shelter Express" }]}
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

const securityPanelStyle: React.CSSProperties = { marginTop: 24, padding: 22, border: `1px solid ${COLORS.border}`, background: "#F2D6DC" };
const securityEyebrowStyle: React.CSSProperties = { margin: "0 0 8px", color: COLORS.coral, fontSize: 11.5, fontWeight: 800, letterSpacing: ".1em" };
const passwordFormStyle: React.CSSProperties = { display: "grid", gap: 12, maxWidth: 620, marginTop: 16 };
const passwordLabelStyle: React.CSSProperties = { display: "grid", gap: 6, color: COLORS.navy, fontSize: 13, fontWeight: 800 };
const passwordInputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "10px 11px", border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.navy, font: "inherit" };
const passwordRequirementsStyle: React.CSSProperties = { margin: 0, color: COLORS.muted, fontSize: 12.5, lineHeight: 1.5 };
const passwordButtonStyle: React.CSSProperties = { justifySelf: "start", padding: "10px 14px", border: 0, background: COLORS.navy, color: COLORS.white, fontWeight: 800, cursor: "pointer" };
const passwordSuccessStyle: React.CSSProperties = { display: "grid", gap: 12, marginTop: 16, padding: 14, background: COLORS.mint, color: COLORS.navy, fontSize: 13, lineHeight: 1.5, fontWeight: 700 };
const passwordSignInStyle: React.CSSProperties = { justifySelf: "start", padding: "9px 12px", background: COLORS.navy, color: COLORS.white, textDecoration: "none", fontWeight: 800 };
const passwordErrorStyle: React.CSSProperties = { marginTop: 16, padding: 14, border: "1px solid #E9B9B4", background: "#FCE9E7", color: "#A9362B", fontSize: 13 };
const forgotLinkStyle: React.CSSProperties = { display: "inline-block", marginTop: 14, color: COLORS.navy, fontSize: 12.5, fontWeight: 800 };

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
