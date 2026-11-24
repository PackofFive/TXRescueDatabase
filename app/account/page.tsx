"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type AccountUser = {
  email: string;
  role?: string;
  status?: string;
  availablePortals?: string[];
  activeOrganizationId?: string | null;
  organizationWorkspaces?: Array<{
    id: string;
    name: string;
    org_type: string | null;
    access_level: string;
    shelter_express_access: boolean;
  }>;
  pendingProfileLinks?: Array<{ type: string; id: string; label: string }>;
  passwordChangedAt?: string | null;
  securityActivity?: Array<{ eventType: string; createdAt: string }>;
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
  const [showPasswords, setShowPasswords] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [acceptingInvite, setAcceptingInvite] = useState(false);
  const [linkingProfile, setLinkingProfile] = useState("");
  const [profileLinkMessage, setProfileLinkMessage] = useState("");
  const [profileLinkError, setProfileLinkError] = useState("");
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

  async function connectProfile(profileType: string, profileId: string, profileLabel: string) {
    const confirmed = window.confirm(`Connect this ${profileLabel.toLowerCase()} to ${user?.email ?? "your Pack of Five login"}? Only continue if this profile belongs to you.`);
    if (!confirmed) return;
    setLinkingProfile(profileId);
    setProfileLinkMessage("");
    setProfileLinkError("");
    try {
      const response = await fetch("/api/auth/profile-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileType, profileId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The profile could not be connected.");
      setProfileLinkMessage(data.message);
      const refreshed = await fetch("/api/auth/me", { cache: "no-store" }).then((result) => result.json());
      setUser(refreshed.user ?? null);
    } catch (reason) {
      setProfileLinkError(reason instanceof Error ? reason.message : "The profile could not be connected.");
    } finally {
      setLinkingProfile("");
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
  const hasAdministration = portals.includes("admin");
  const passwordChecks = [
    { label: "12–128 characters", met: newPassword.length >= 12 && newPassword.length <= 128 },
    { label: "One uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "One lowercase letter", met: /[a-z]/.test(newPassword) },
    { label: "One number", met: /\d/.test(newPassword) },
    { label: "Passwords match", met: newPassword.length > 0 && newPassword === confirmation },
  ];
  const canChangePassword = currentPassword.length > 0 && passwordChecks.every((check) => check.met);

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
              <input type={showPasswords ? "text" : "password"} autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} style={passwordInputStyle} />
            </label>
            <label style={passwordLabelStyle}>
              New password
              <input type={showPasswords ? "text" : "password"} autoComplete="new-password" required minLength={12} maxLength={128} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} style={passwordInputStyle} />
            </label>
            <label style={passwordLabelStyle}>
              Confirm new password
              <input type={showPasswords ? "text" : "password"} autoComplete="new-password" required minLength={12} maxLength={128} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} style={passwordInputStyle} />
            </label>
            <label style={showPasswordsStyle}><input type="checkbox" checked={showPasswords} onChange={(event) => setShowPasswords(event.target.checked)} />Show passwords</label>
            <div style={passwordChecklistStyle} aria-live="polite">
              <strong style={passwordChecklistHeadingStyle}>Password requirements</strong>
              {passwordChecks.map((check) => <span key={check.label} style={check.met ? passwordRequirementMetStyle : passwordRequirementStyle}><span aria-hidden="true">{check.met ? "✓" : "○"}</span>{check.label}</span>)}
            </div>
            <button type="submit" disabled={changingPassword || !canChangePassword} style={changingPassword || !canChangePassword ? disabledPasswordButtonStyle : passwordButtonStyle}>{changingPassword ? "Securing Account…" : "Change Password"}</button>
          </form>
        ) : null}

        {passwordMessage ? <div style={passwordSuccessStyle}>{passwordMessage}<a href="/login" style={passwordSignInStyle}>Sign In Again</a></div> : null}
        {passwordError ? <div role="alert" style={passwordErrorStyle}>{passwordError}</div> : null}
        {!passwordChanged ? <a href="/forgot-password" style={forgotLinkStyle}>Forgot your current password?</a> : null}
      </section>

      <section style={panelStyle}>
        <h2 style={sectionHeadingStyle}>Recent security activity</h2>
        <p style={bodyStyle}>Only password-related activity for your own Pack of Five login appears here.</p>
        {(user.securityActivity?.length ?? 0) > 0 ? (
          <div style={securityActivityListStyle}>
            {user.securityActivity?.map((entry, index) => (
              <div key={`${entry.eventType}-${entry.createdAt}-${index}`} style={securityActivityRowStyle}>
                <strong style={valueStyle}>{securityEventLabel(entry.eventType)}</strong>
                <span style={securityActivityDateStyle}>{new Date(entry.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        ) : <p style={bodyStyle}>No recent password-security activity is recorded.</p>}
        {user.passwordChangedAt ? <p style={lastPasswordChangeStyle}>Password last changed {new Date(user.passwordChangedAt).toLocaleString()}.</p> : null}
        <p style={securityHelpStyle}>If you do not recognize an entry, change your password immediately.</p>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={sectionHeadingStyle}>Portals connected to my login</h2>
        <p style={bodyStyle}>
          One email and password can be used across Pack of Five. Only portals
          you have access to appear in your signed-in header. Use that header to
          switch portals. If you use separate test logins, check the signed-in
          email above before testing a portal.
        </p>

        {(user.organizationWorkspaces?.length ?? 0) > 0 ? (
          <section style={organizationConnectionsStyle}>
            <h3 style={organizationConnectionsHeadingStyle}>Connected organization</h3>
            <p style={{ ...bodyStyle, marginTop: 0 }}>Organization access is separate from your personal volunteer and pet-owner profiles.</p>
            <div style={organizationConnectionListStyle}>
              {user.organizationWorkspaces?.map((workspace) => {
                const shelterOrganization = workspace.shelter_express_access || /shelter/i.test(workspace.org_type ?? "");
                return (
                  <article key={workspace.id} style={organizationConnectionCardStyle}>
                    <div>
                      <strong style={organizationNameStyle}>{workspace.name}</strong>
                      <div style={organizationMetaStyle}>{workspace.org_type || "Organization type pending review"} · {formatAccountLabel(workspace.access_level)}</div>
                    </div>
                    <span style={approvedBadgeStyle}>{workspace.org_type === "Veterinary / Care Partner" ? "Care Partner organization" : shelterOrganization && workspace.shelter_express_access ? "Shelter Express" : shelterOrganization ? "Organization listing only" : "Rescue Manager"}</span>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {(user.pendingProfileLinks?.length ?? 0) > 0 && (
          <section style={{ ...panelStyle, background: "#F2D6DC" }}>
            <h3 style={{ ...sectionHeadingStyle, fontSize: 20 }}>Profiles available to connect</h3>
            <p style={bodyStyle}>We found a profile using your signed-in email address. Connect it only if it belongs to you. Your current password remains unchanged.</p>
            <div style={{ display: "grid", gap: 10 }}>
              {user.pendingProfileLinks?.map((profile) => (
                <div key={`${profile.type}-${profile.id}`} style={{ border: `1px solid ${COLORS.border}`, background: COLORS.white, padding: 14, display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                  <div><strong style={{ color: COLORS.navy }}>{profile.label}</strong><div style={{ color: COLORS.muted, fontSize: 13, marginTop: 3 }}>Matches {user.email}</div></div>
                  <button type="button" disabled={linkingProfile === profile.id} onClick={() => connectProfile(profile.type, profile.id, profile.label)} style={passwordButtonStyle}>{linkingProfile === profile.id ? "Connecting…" : "Connect to My Account"}</button>
                </div>
              ))}
            </div>
            {profileLinkMessage ? <p style={{ color: COLORS.navy, fontWeight: 700 }}>{profileLinkMessage}</p> : null}
            {profileLinkError ? <div role="alert" style={passwordErrorStyle}>{profileLinkError}</div> : null}
          </section>
        )}

        <div style={cardGridStyle}>
          <PortalAccessCard title="Rescue Manager" connected={hasRescueManager} description="For approved rescue and animal-welfare organization teams." href={hasRescueManager ? undefined : "/organizations"} action="Claim or request an organization" />
          <PortalAccessCard title="Shelter Express" connected={hasShelterExpress} description="For shelter teams granted access to the simplified urgent-animal workspace." href={hasShelterExpress ? undefined : "/organizations"} action="Claim or request a shelter" />
          <PortalAccessCard title="Volunteer Portal" connected={hasVolunteerPortal} description="Added after a rescue approves your volunteer or foster relationship." />
          <PortalAccessCard title="Pet Owner" connected={hasPetOwnerPortal} description="A private space for your own pets, records, and reminders." href={hasPetOwnerPortal ? undefined : "/pet-owner/setup"} action="Add Pet Owner to My Login" />
          {hasAdministration ? <PortalAccessCard title="Platform Administration" connected description="Private Pack of Five administration access." /> : null}
        </div>
      </section>
    </div>
  );
}

function PortalAccessCard({
  title,
  description,
  connected,
  href,
  action,
}: {
  title: string;
  description: string;
  connected: boolean;
  href?: string;
  action?: string;
}) {
  return (
    <article style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <h3 style={{ margin: 0, color: COLORS.navy, fontSize: 19 }}>{title}</h3>
        <strong style={connected ? approvedBadgeStyle : notConnectedBadgeStyle}>{connected ? "Connected" : "Not connected"}</strong>
      </div>
      <p style={{ ...bodyStyle, margin: 0 }}>{description}</p>
      {href && action ? <div style={linkRowStyle}><a href={href} style={primaryLinkStyle}>{action}</a></div> : null}
    </article>
  );
}

function securityEventLabel(eventType: string) {
  if (eventType === "password_changed") return "Password changed";
  if (eventType === "password_reset_requested") return "Password reset requested";
  if (eventType === "password_reset_completed") return "Password reset completed";
  return eventType.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatAccountLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
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

const showPasswordsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: COLORS.navy,
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const securityActivityListStyle: React.CSSProperties = {
  display: "grid",
  marginTop: 14,
  border: `1px solid ${COLORS.border}`,
};

const securityActivityRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  padding: 12,
  borderBottom: `1px solid ${COLORS.border}`,
};

const securityActivityDateStyle: React.CSSProperties = {
  color: COLORS.muted,
  fontSize: 12.5,
};

const lastPasswordChangeStyle: React.CSSProperties = {
  color: COLORS.navy,
  fontSize: 13,
  fontWeight: 700,
};

const securityHelpStyle: React.CSSProperties = {
  marginBottom: 0,
  color: COLORS.coral,
  fontSize: 12.5,
  fontWeight: 700,
};

const organizationConnectionsStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 18,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.mint,
};

const organizationConnectionsHeadingStyle: React.CSSProperties = {
  margin: "0 0 8px",
  color: COLORS.navy,
  fontSize: 18,
};

const organizationConnectionListStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const organizationConnectionCardStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  padding: 14,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.white,
};

const organizationNameStyle: React.CSSProperties = {
  color: COLORS.navy,
  fontSize: 15,
};

const organizationMetaStyle: React.CSSProperties = {
  marginTop: 4,
  color: COLORS.muted,
  fontSize: 12.5,
};

const passwordChecklistStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  padding: 12,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.white,
};

const passwordChecklistHeadingStyle: React.CSSProperties = {
  color: COLORS.navy,
  fontSize: 13,
};

const passwordRequirementStyle: React.CSSProperties = {
  display: "flex",
  gap: 7,
  color: COLORS.muted,
  fontSize: 12.5,
};

const passwordRequirementMetStyle: React.CSSProperties = {
  ...passwordRequirementStyle,
  color: COLORS.navy,
  fontWeight: 700,
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
const notConnectedBadgeStyle: React.CSSProperties = { ...approvedBadgeStyle, background: "#F1F3F5", color: COLORS.muted };

const securityPanelStyle: React.CSSProperties = { marginTop: 24, padding: 22, border: `1px solid ${COLORS.border}`, background: "#F2D6DC" };
const securityEyebrowStyle: React.CSSProperties = { margin: "0 0 8px", color: COLORS.coral, fontSize: 11.5, fontWeight: 800, letterSpacing: ".1em" };
const passwordFormStyle: React.CSSProperties = { display: "grid", gap: 12, maxWidth: 620, marginTop: 16 };
const passwordLabelStyle: React.CSSProperties = { display: "grid", gap: 6, color: COLORS.navy, fontSize: 13, fontWeight: 800 };
const passwordInputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "10px 11px", border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.navy, font: "inherit" };
const passwordRequirementsStyle: React.CSSProperties = { margin: 0, color: COLORS.muted, fontSize: 12.5, lineHeight: 1.5 };
const passwordButtonStyle: React.CSSProperties = { justifySelf: "start", padding: "10px 14px", border: 0, background: COLORS.navy, color: COLORS.white, fontWeight: 800, cursor: "pointer" };
const disabledPasswordButtonStyle: React.CSSProperties = { ...passwordButtonStyle, opacity: 0.5, cursor: "not-allowed" };
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
