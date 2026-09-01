"use client";

import { useEffect, useState } from "react";

type Member = {
  id: string;
  user_id: string;
  email: string;
  access_level: "owner" | "administrator" | "contributor" | "viewer";
  status: "invited" | "active" | "suspended" | "removed";
  granted_at?: string | null;
  updated_at?: string | null;
};

type AuditEntry = {
  id: string;
  action: string;
  previous_access_level?: string | null;
  new_access_level?: string | null;
  reason?: string | null;
  created_at: string;
  affected_email?: string | null;
  actor_email?: string | null;
};

type Invite = {
  id: string;
  email: string;
  access_level: "administrator" | "contributor" | "viewer";
  status: "sent" | "accepted" | "cancelled" | "expired";
  expires_at: string;
  created_at: string;
  invited_by_email?: string | null;
};

const COLORS = { navy: "#1E3A5F", coral: "#E85C56", mint: "#DCF0E8", muted: "#4A5D75", border: "#DCE4EC", white: "#FFFFFF" };

const LEVELS = [
  { level: "Owner", description: "Full organization control. Manages team access and transfers ownership." },
  { level: "Administrator", description: "Edits organization settings and public profile information, but cannot manage team access." },
  { level: "Contributor", description: "Works with operational rescue records, but cannot edit organization settings." },
  { level: "Viewer", description: "Read-only Rescue Manager access." },
];

export default function TeamAccessPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLevel, setInviteLevel] = useState("viewer");
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function loadTeam() {
    setLoading(true);
    fetch("/api/org-profile?team=true", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Couldn't load team access.");
        setMembers(data.members ?? []);
        setAudit(data.audit ?? []);
        setInvites(data.invites ?? []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Couldn't load team access."))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadTeam(); }, []);

  async function updateAccess(member: Member, action: string, newAccessLevel?: string) {
    const reason = reasons[member.id]?.trim() ?? "";
    const sensitive = ["suspend", "remove", "transfer_ownership"].includes(action);
    if (sensitive && !reason) {
      setError("Enter a reason before completing this security-sensitive action.");
      return;
    }

    const actionLabel = action === "transfer_ownership" ? "transfer organization ownership" : action.replaceAll("_", " ");
    if (sensitive && !window.confirm(`Are you sure you want to ${actionLabel} for ${member.email}?`)) return;

    setWorkingId(member.id);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/org-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId: member.id, action, newAccessLevel, reason }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't update team access.");
      setMessage(`Access updated for ${member.email}.`);
      setReasons((current) => ({ ...current, [member.id]: "" }));
      loadTeam();
    } catch (reasonValue) {
      setError(reasonValue instanceof Error ? reasonValue.message : "Couldn't update team access.");
    } finally {
      setWorkingId("");
    }
  }

  async function sendInvite(event: React.FormEvent) {
    event.preventDefault();
    setWorkingId("invite-new");
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/org-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, accessLevel: inviteLevel }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't send the invitation.");
      setMessage(`Secure invitation sent to ${inviteEmail.trim().toLowerCase()}.`);
      setInviteEmail("");
      setInviteLevel("viewer");
      loadTeam();
    } catch (reasonValue) {
      setError(reasonValue instanceof Error ? reasonValue.message : "Couldn't send the invitation.");
    } finally {
      setWorkingId("");
    }
  }

  async function manageInvite(invite: Invite, action: "cancel_invite" | "resend_invite") {
    const label = action === "cancel_invite" ? "cancel" : "resend";
    if (!window.confirm(`Are you sure you want to ${label} the invitation for ${invite.email}?`)) return;
    setWorkingId(invite.id);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/org-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId: invite.id, action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? `Couldn't ${label} the invitation.`);
      setMessage(`Invitation ${action === "cancel_invite" ? "cancelled" : "resent"} for ${invite.email}.`);
      loadTeam();
    } catch (reasonValue) {
      setError(reasonValue instanceof Error ? reasonValue.message : `Couldn't ${label} the invitation.`);
    } finally {
      setWorkingId("");
    }
  }

  if (loading && members.length === 0) return <p style={{ color: COLORS.muted }}>Loading Team & Access…</p>;

  return (
    <div>
      <p style={eyebrowStyle}>ORGANIZATION SECURITY</p>
      <h1 style={headingStyle}>Team & Access</h1>
      <p style={introStyle}>Only the Organization Owner can change team access. Volunteer Portal permissions remain completely separate.</p>

      <div style={levelGridStyle}>
        {LEVELS.map((item) => <article key={item.level} style={levelCardStyle}><strong style={{ color: COLORS.navy }}>{item.level}</strong><span style={descriptionStyle}>{item.description}</span></article>)}
      </div>

      {message ? <div style={successStyle}>{message}</div> : null}
      {error ? <div style={errorStyle}>{error}</div> : null}

      <section style={inviteSectionStyle}>
        <h2 style={sectionHeadingStyle}>Invite a team member</h2>
        <p style={descriptionStyle}>The invitation expires after 72 hours and must be accepted using the same email address. Owner access cannot be granted by invitation.</p>
        <form onSubmit={sendInvite} style={inviteFormStyle}>
          <label style={labelStyle}>Email address<input type="email" required value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="person@example.org" style={inputStyle} /></label>
          <label style={labelStyle}>Starting access<select value={inviteLevel} onChange={(event) => setInviteLevel(event.target.value)} style={inputStyle}><option value="viewer">Viewer</option><option value="contributor">Contributor</option><option value="administrator">Administrator</option></select></label>
          <button type="submit" disabled={workingId === "invite-new"} style={ownerButtonStyle}>{workingId === "invite-new" ? "Sending…" : "Send Secure Invitation"}</button>
        </form>
      </section>

      {invites.length > 0 ? (
        <section style={{ marginTop: 24 }}>
          <h2 style={sectionHeadingStyle}>Team invitations</h2>
          <div style={memberListStyle}>
            {invites.map((invite) => (
              <article key={invite.id} style={inviteCardStyle}>
                <div><strong style={emailStyle}>{invite.email}</strong><div style={badgeRowStyle}><span style={levelBadgeStyle}>{format(invite.access_level)}</span><span style={invite.status === "sent" ? activeBadgeStyle : inactiveBadgeStyle}>{format(invite.status)}</span></div><p style={descriptionStyle}>{invite.status === "sent" ? `Expires ${new Date(invite.expires_at).toLocaleString()}` : `Created ${new Date(invite.created_at).toLocaleString()}`}</p></div>
                <div style={buttonRowStyle}>{invite.status === "sent" ? <button type="button" disabled={workingId === invite.id} onClick={() => manageInvite(invite, "cancel_invite")} style={dangerButtonStyle}>Cancel Invitation</button> : null}{invite.status !== "accepted" ? <button type="button" disabled={workingId === invite.id} onClick={() => manageInvite(invite, "resend_invite")} style={secondaryButtonStyle}>Resend Invitation</button> : null}</div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section style={{ marginTop: 24 }}>
        <h2 style={sectionHeadingStyle}>Organization team</h2>
        <div style={memberListStyle}>
          {members.map((member) => {
            const isOwner = member.access_level === "owner" && member.status === "active";
            const busy = workingId === member.id;
            return (
              <article key={member.id} style={memberCardStyle}>
                <div style={memberHeaderStyle}>
                  <div><strong style={emailStyle}>{member.email}</strong><div style={badgeRowStyle}><span style={levelBadgeStyle}>{format(member.access_level)}</span><span style={member.status === "active" ? activeBadgeStyle : inactiveBadgeStyle}>{format(member.status)}</span></div></div>
                  {isOwner ? <strong style={{ color: COLORS.coral, fontSize: 12 }}>CURRENT OWNER</strong> : null}
                </div>

                {!isOwner ? (
                  <div style={controlsStyle}>
                    {member.status === "active" ? (
                      <>
                        <label style={labelStyle}>Access level<select value={member.access_level} disabled={busy} onChange={(event) => updateAccess(member, "change_level", event.target.value)} style={inputStyle}><option value="administrator">Administrator</option><option value="contributor">Contributor</option><option value="viewer">Viewer</option></select></label>
                        <label style={labelStyle}>Reason for sensitive action<input value={reasons[member.id] ?? ""} onChange={(event) => setReasons((current) => ({ ...current, [member.id]: event.target.value }))} placeholder="Required for suspend, remove, or transfer" style={inputStyle} /></label>
                        <div style={buttonRowStyle}><button type="button" disabled={busy} onClick={() => updateAccess(member, "suspend")} style={secondaryButtonStyle}>Suspend</button><button type="button" disabled={busy} onClick={() => updateAccess(member, "remove")} style={dangerButtonStyle}>Remove</button><button type="button" disabled={busy} onClick={() => updateAccess(member, "transfer_ownership")} style={ownerButtonStyle}>Transfer Ownership</button></div>
                      </>
                    ) : (
                      <><label style={labelStyle}>Reason or note<input value={reasons[member.id] ?? ""} onChange={(event) => setReasons((current) => ({ ...current, [member.id]: event.target.value }))} style={inputStyle} /></label><button type="button" disabled={busy} onClick={() => updateAccess(member, "restore")} style={secondaryButtonStyle}>Restore Access</button></>
                    )}
                  </div>
                ) : <p style={ownerNoticeStyle}>Ownership must be transferred to another active member before this account can be suspended or removed.</p>}
              </article>
            );
          })}
        </div>
      </section>

      <section style={auditSectionStyle}>
        <h2 style={sectionHeadingStyle}>Access history</h2>
        {audit.length === 0 ? <p style={descriptionStyle}>No team access changes have been recorded yet.</p> : <div>{audit.map((entry) => <div key={entry.id} style={auditRowStyle}><strong style={{ color: COLORS.navy }}>{format(entry.action)}</strong><span style={descriptionStyle}>{entry.affected_email ?? "Unknown member"} · by {entry.actor_email ?? "System"} · {new Date(entry.created_at).toLocaleString()}</span>{entry.reason ? <span style={reasonStyle}>Reason: {entry.reason}</span> : null}</div>)}</div>}
      </section>
    </div>
  );
}

function format(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }

const eyebrowStyle: React.CSSProperties = { margin: "0 0 8px", color: COLORS.coral, fontSize: 12, fontWeight: 800, letterSpacing: ".1em" };
const headingStyle: React.CSSProperties = { margin: "0 0 10px", color: COLORS.navy, fontSize: 36 };
const introStyle: React.CSSProperties = { margin: 0, maxWidth: 760, color: COLORS.muted, fontSize: 14, lineHeight: 1.6 };
const levelGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10, marginTop: 20 };
const levelCardStyle: React.CSSProperties = { display: "grid", gap: 7, padding: 15, border: `1px solid ${COLORS.border}`, background: COLORS.white };
const descriptionStyle: React.CSSProperties = { color: COLORS.muted, fontSize: 12.5, lineHeight: 1.5 };
const successStyle: React.CSSProperties = { marginTop: 16, padding: 14, color: COLORS.navy, border: `1px solid ${COLORS.border}`, background: COLORS.mint, fontWeight: 700 };
const errorStyle: React.CSSProperties = { marginTop: 16, padding: 14, color: "#A9362B", border: "1px solid #E9B9B4", background: "#FCE9E7" };
const sectionHeadingStyle: React.CSSProperties = { margin: "0 0 12px", color: COLORS.navy, fontSize: 21 };
const memberListStyle: React.CSSProperties = { display: "grid", gap: 12 };
const memberCardStyle: React.CSSProperties = { padding: 18, border: `1px solid ${COLORS.border}`, background: COLORS.white };
const memberHeaderStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", flexWrap: "wrap" };
const emailStyle: React.CSSProperties = { color: COLORS.navy, fontSize: 15, overflowWrap: "anywhere" };
const badgeRowStyle: React.CSSProperties = { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 };
const levelBadgeStyle: React.CSSProperties = { padding: "4px 8px", borderRadius: 999, background: COLORS.navy, color: COLORS.white, fontSize: 10, fontWeight: 800 };
const activeBadgeStyle: React.CSSProperties = { padding: "4px 8px", borderRadius: 999, background: COLORS.mint, color: COLORS.navy, fontSize: 10, fontWeight: 800 };
const inactiveBadgeStyle: React.CSSProperties = { padding: "4px 8px", borderRadius: 999, background: "#F5E4E1", color: "#A9362B", fontSize: 10, fontWeight: 800 };
const controlsStyle: React.CSSProperties = { display: "grid", gap: 12, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${COLORS.border}` };
const labelStyle: React.CSSProperties = { display: "grid", gap: 6, color: COLORS.navy, fontSize: 12, fontWeight: 800 };
const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "9px 10px", border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.navy, font: "inherit" };
const buttonRowStyle: React.CSSProperties = { display: "flex", gap: 8, flexWrap: "wrap" };
const secondaryButtonStyle: React.CSSProperties = { padding: "9px 12px", border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.navy, fontWeight: 800, cursor: "pointer" };
const dangerButtonStyle: React.CSSProperties = { padding: "9px 12px", border: "1px solid #C44335", background: COLORS.white, color: "#A9362B", fontWeight: 800, cursor: "pointer" };
const ownerButtonStyle: React.CSSProperties = { padding: "9px 12px", border: 0, background: COLORS.navy, color: COLORS.white, fontWeight: 800, cursor: "pointer" };
const ownerNoticeStyle: React.CSSProperties = { margin: "14px 0 0", padding: 12, background: COLORS.mint, color: COLORS.navy, fontSize: 12.5, lineHeight: 1.5 };
const auditSectionStyle: React.CSSProperties = { marginTop: 26, padding: 18, border: `1px solid ${COLORS.border}`, background: COLORS.white };
const auditRowStyle: React.CSSProperties = { display: "grid", gap: 4, padding: "11px 0", borderTop: `1px solid ${COLORS.border}` };
const reasonStyle: React.CSSProperties = { color: COLORS.navy, fontSize: 12.5 };
const inviteSectionStyle: React.CSSProperties = { marginTop: 24, padding: 18, border: `1px solid ${COLORS.border}`, background: COLORS.mint };
const inviteFormStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", alignItems: "end", gap: 12, marginTop: 15 };
const inviteCardStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", flexWrap: "wrap", padding: 16, border: `1px solid ${COLORS.border}`, background: COLORS.white };
