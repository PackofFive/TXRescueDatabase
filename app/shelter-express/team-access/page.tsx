"use client";

import { useEffect, useState } from "react";

type Member = {
  id: string;
  email: string;
  access_level: "owner" | "administrator" | "contributor" | "viewer";
  status: "active" | "suspended" | "removed";
  shelter_express_access: boolean;
};

type Invite = {
  id: string;
  email: string;
  status: "sent" | "accepted" | "cancelled" | "expired";
  shelter_express_access?: boolean;
  expires_at: string;
};

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  pink: "#F7DDE5",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
};

export default function ShelterExpressTeamAccessPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadTeam() {
    setLoading(true);
    try {
      const response = await fetch("/api/org-profile?team=true", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't load shelter staff.");
      setMembers(data.members ?? []);
      setInvites(data.invites ?? []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn't load shelter staff.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadTeam(); }, []);

  async function inviteStaff(event: React.FormEvent) {
    event.preventDefault();
    setWorking("invite"); setError(""); setMessage("");
    try {
      const response = await fetch("/api/org-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, accessLevel: "contributor", shelterExpressAccess: true }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't send the invitation.");
      setMessage(`Invitation sent to ${email.trim().toLowerCase()}.`);
      setEmail("");
      await loadTeam();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn't send the invitation.");
    } finally { setWorking(""); }
  }

  async function setPortalAccess(member: Member, enabled: boolean) {
    setWorking(member.id); setError(""); setMessage("");
    try {
      const response = await fetch("/api/org-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId: member.id, action: "change_shelter_express", enabled }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't update Shelter Express access.");
      setMessage(`${member.email} ${enabled ? "can now use" : "can no longer use"} Shelter Express.`);
      await loadTeam();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn't update Shelter Express access.");
    } finally { setWorking(""); }
  }

  async function manageInvite(invite: Invite, action: "resend_invite" | "cancel_invite") {
    setWorking(invite.id); setError(""); setMessage("");
    try {
      const response = await fetch("/api/org-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId: invite.id, action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't update the invitation.");
      setMessage(action === "resend_invite" ? `Invitation resent to ${invite.email}.` : `Invitation cancelled for ${invite.email}.`);
      await loadTeam();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn't update the invitation.");
    } finally { setWorking(""); }
  }

  return (
    <div>
      <p style={eyebrow}>SHELTER SETTINGS</p>
      <h1 style={heading}>Team &amp; Access</h1>
      <p style={intro}>Invite shelter staff and decide who may enter this Shelter Express workspace. This does not give anyone Rescue Manager access.</p>

      {message ? <div style={success}>{message}</div> : null}
      {error ? <div style={errorBox}>{error}</div> : null}

      <section style={{ ...panel, background: COLORS.pink }}>
        <h2 style={sectionHeading}>Invite shelter staff</h2>
        <p style={copy}>They will receive a secure link that expires after 72 hours. They must use the exact email address entered here.</p>
        <form onSubmit={inviteStaff} style={inviteForm}>
          <label style={label}>Staff email address
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="staff@shelter.org" style={input} />
          </label>
          <button disabled={working === "invite"} style={primaryButton}>{working === "invite" ? "Sending…" : "Send Invitation"}</button>
        </form>
      </section>

      <section style={panel}>
        <h2 style={sectionHeading}>Shelter staff</h2>
        {loading && members.length === 0 ? <p style={copy}>Loading staff…</p> : null}
        <div style={list}>
          {members.map((member) => {
            const owner = member.access_level === "owner" && member.status === "active";
            return <article key={member.id} style={row}>
              <div><strong style={{ color: COLORS.navy }}>{member.email}</strong><div style={meta}>{owner ? "Shelter owner" : member.status === "active" ? "Staff member" : member.status}</div></div>
              <label style={toggleLabel}>
                <input type="checkbox" checked={Boolean(member.shelter_express_access)} disabled={owner || member.status !== "active" || working === member.id} onChange={(event) => void setPortalAccess(member, event.target.checked)} />
                {owner ? "Owner access" : "Shelter Express access"}
              </label>
            </article>;
          })}
        </div>
      </section>

      {invites.length ? <details style={panel}>
        <summary style={summary}>Invitation history ({invites.length})</summary>
        <div style={list}>{invites.map((invite) => <article key={invite.id} style={row}>
          <div><strong style={{ color: COLORS.navy }}>{invite.email}</strong><div style={meta}>{title(invite.status)}{invite.status === "sent" ? ` · expires ${new Date(invite.expires_at).toLocaleString()}` : ""}</div></div>
          {invite.status !== "accepted" ? <div style={buttons}>{invite.status === "sent" ? <button onClick={() => void manageInvite(invite, "cancel_invite")} disabled={working === invite.id} style={secondaryButton}>Cancel</button> : null}<button onClick={() => void manageInvite(invite, "resend_invite")} disabled={working === invite.id} style={secondaryButton}>Resend</button></div> : null}
        </article>)}</div>
      </details> : null}
    </div>
  );
}

function title(value: string) { return value.charAt(0).toUpperCase() + value.slice(1); }

const eyebrow: React.CSSProperties = { margin: "0 0 8px", color: COLORS.coral, fontWeight: 800, letterSpacing: ".1em", fontSize: 13 };
const heading: React.CSSProperties = { margin: "0 0 8px", color: COLORS.navy, fontSize: 38 };
const intro: React.CSSProperties = { margin: 0, maxWidth: 780, color: COLORS.muted, fontSize: 17, lineHeight: 1.55 };
const panel: React.CSSProperties = { marginTop: 24, padding: 22, border: `1px solid ${COLORS.border}`, background: COLORS.white };
const sectionHeading: React.CSSProperties = { margin: "0 0 8px", color: COLORS.navy, fontSize: 23 };
const copy: React.CSSProperties = { margin: 0, color: COLORS.muted, lineHeight: 1.5 };
const inviteForm: React.CSSProperties = { display: "grid", gridTemplateColumns: "minmax(220px, 1fr) auto", gap: 12, alignItems: "end", marginTop: 18 };
const label: React.CSSProperties = { display: "grid", gap: 7, color: COLORS.navy, fontWeight: 800 };
const input: React.CSSProperties = { boxSizing: "border-box", width: "100%", padding: "12px 13px", border: `1px solid ${COLORS.border}`, background: COLORS.white, font: "inherit" };
const primaryButton: React.CSSProperties = { border: 0, padding: "13px 18px", background: COLORS.navy, color: COLORS.white, fontWeight: 800, cursor: "pointer" };
const secondaryButton: React.CSSProperties = { border: `1px solid ${COLORS.border}`, padding: "9px 12px", background: COLORS.white, color: COLORS.navy, fontWeight: 800, cursor: "pointer" };
const list: React.CSSProperties = { display: "grid", gap: 10, marginTop: 16 };
const row: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap", padding: 16, border: `1px solid ${COLORS.border}`, background: COLORS.white };
const meta: React.CSSProperties = { marginTop: 5, color: COLORS.muted, fontSize: 13 };
const toggleLabel: React.CSSProperties = { display: "flex", gap: 8, alignItems: "center", color: COLORS.navy, fontWeight: 800, fontSize: 13 };
const buttons: React.CSSProperties = { display: "flex", gap: 8 };
const summary: React.CSSProperties = { color: COLORS.navy, fontSize: 18, fontWeight: 800, cursor: "pointer" };
const success: React.CSSProperties = { marginTop: 18, padding: 14, background: COLORS.mint, color: COLORS.navy, fontWeight: 700 };
const errorBox: React.CSSProperties = { marginTop: 18, padding: 14, background: "#FCE9E7", color: "#A9362B", border: "1px solid #E9B9B4" };
