"use client";

import { useEffect, useMemo, useState } from "react";
import { isRescueManagerOrganization, isShelterExpressOrganization } from "@/lib/organization-types";

type Organization = { id: string; name: string; org_type: string | null; city: string | null; county: string | null; state: string | null };
type Relationship = { id: string; partner_org_id: string; partner_name: string; partner_type: string; status: string; request_message: string; updated_at: string };
const C = { navy: "#1E3A5F", coral: "#E85C56", blue: "#E6EEF7", muted: "#4A5D75", border: "#DCE4EC", white: "#fff", mint: "#DCF0E8" };

export default function CarePartnerRelationshipsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Organization | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [working, setWorking] = useState(false);

  async function loadRelationships() {
    const response = await fetch("/api/care-partner/relationships", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Couldn't load Care Partner relationships.");
    setRelationships(data.relationships ?? []);
  }

  useEffect(() => {
    Promise.all([
      fetch("/api/orgs", { cache: "no-store" }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Couldn't load organizations."); return data.organizations ?? []; }),
      loadRelationships(),
    ]).then(([rows]) => setOrganizations(rows)).catch((error) => setStatus(error instanceof Error ? error.message : "Couldn't load relationship tools."));
  }, []);

  const existingIds = useMemo(() => new Set(relationships.filter((item) => ["requested", "active", "suspended"].includes(item.status)).map((item) => item.partner_org_id)), [relationships]);
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) return [];
    return organizations.filter((organization) => (isRescueManagerOrganization(organization.org_type) || isShelterExpressOrganization(organization.org_type)) && !existingIds.has(organization.id) && `${organization.name} ${organization.city ?? ""} ${organization.county ?? ""} ${organization.state ?? ""}`.toLowerCase().includes(normalized)).slice(0, 20);
  }, [existingIds, organizations, query]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setWorking(true); setStatus("");
    try {
      const response = await fetch("/api/care-partner/relationships", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ partnerOrgId: selected.id, message }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't send relationship request.");
      setStatus(`Relationship request sent to ${selected.name}. No records have been shared.`); setSelected(null); setMessage(""); setQuery(""); await loadRelationships();
    } catch (error) { setStatus(error instanceof Error ? error.message : "Couldn't send relationship request."); }
    finally { setWorking(false); }
  }

  return <section style={{ maxWidth: 940, margin: "0 auto", padding: "8px 0 44px" }}>
    <a href="/care-partner" style={{ color: C.coral, fontSize: 12.5, fontWeight: 800, textDecoration: "none" }}>← Care Partner home</a>
    <h1 style={{ margin: "10px 0 7px", color: C.navy, fontSize: "clamp(28px, 5vw, 42px)" }}>Organization relationships</h1>
    <p style={{ margin: "0 0 18px", color: C.muted, lineHeight: 1.6 }}>Request a private working relationship with a rescue or shelter. The organization must approve it. A relationship request never grants access to animal records.</p>
    {status ? <div role="status" style={{ marginBottom: 16, padding: 13, background: C.mint, color: C.navy }}>{status}</div> : null}

    <div style={{ padding: 16, background: C.blue, border: `1px solid ${C.border}` }}>
      <label style={{ display: "grid", gap: 6, color: C.navy, fontSize: 13, fontWeight: 800 }}>Find a rescue or shelter<input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setSelected(null); }} placeholder="Search by organization, city, or county" style={input}/></label>
      {query.trim().length > 0 && query.trim().length < 2 ? <p style={hint}>Enter at least two characters.</p> : null}
      <div style={{ display: "grid", gap: 8, marginTop: matches.length ? 12 : 0 }}>{matches.map((organization) => <button key={organization.id} type="button" onClick={() => setSelected(organization)} style={{ padding: 12, border: `1px solid ${selected?.id === organization.id ? C.navy : C.border}`, background: C.white, color: C.navy, textAlign: "left", cursor: "pointer" }}><strong>{organization.name}</strong><span style={{ display: "block", marginTop: 3, color: C.muted, fontSize: 12 }}>{[organization.org_type, organization.city, organization.county, organization.state].filter(Boolean).join(" · ")}</span></button>)}</div>
      {selected ? <form onSubmit={submit} style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}><strong style={{ color: C.navy }}>Request a relationship with {selected.name}</strong><label style={{ display: "grid", gap: 6, marginTop: 10, color: C.navy, fontSize: 13, fontWeight: 800 }}>Private introduction<textarea required minLength={20} maxLength={2000} rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Explain your services and why you want to work with this organization." style={input}/></label><button type="submit" disabled={working || message.trim().length < 20} style={primary}>{working ? "Sending…" : "Send Relationship Request"}</button></form> : null}
    </div>

    <h2 style={{ margin: "26px 0 10px", color: C.navy }}>Your relationships ({relationships.length})</h2>
    {relationships.length === 0 ? <div style={{ padding: 16, border: `1px solid ${C.border}`, color: C.muted }}>No relationship requests yet.</div> : <div style={{ display: "grid", gap: 9 }}>{relationships.map((relationship) => <article key={relationship.id} style={{ padding: 15, border: `1px solid ${C.border}`, background: C.white }}><div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}><strong style={{ color: C.navy }}>{relationship.partner_name}</strong><span style={{ color: C.coral, fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>{relationship.status}</span></div><p style={{ margin: "7px 0 0", color: C.muted, fontSize: 12.5, lineHeight: 1.5 }}>{relationship.request_message}</p></article>)}</div>}
  </section>;
}

const input: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "10px 11px", border: `1px solid ${C.border}`, background: C.white, color: C.navy, font: "inherit" };
const hint: React.CSSProperties = { margin: "7px 0 0", color: C.muted, fontSize: 12 };
const primary: React.CSSProperties = { marginTop: 10, padding: "10px 14px", border: 0, background: C.navy, color: C.white, fontWeight: 800, cursor: "pointer" };
