"use client";

import { useEffect, useState } from "react";

type Relationship = { id: string; status: string; request_message: string; created_at: string; care_partner_name: string; care_partner_category: string | null; care_partner_services: string | null; care_partner_review_status: string };
const C = { navy: "#1E3A5F", coral: "#E85C56", muted: "#4A5D75", border: "#DCE4EC", white: "#fff", mint: "#DCF0E8", pink: "#FBEFF1" };

export default function CarePartnerRequestQueue() {
  const [relationships, setRelationships] = useState<Relationship[] | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [working, setWorking] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/care-partner/relationship-requests", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Couldn't load Care Partner requests.");
    setRelationships(data.relationships ?? []);
  }

  useEffect(() => { load().catch((error) => setMessage(error instanceof Error ? error.message : "Couldn't load Care Partner requests.")); }, []);

  async function review(relationshipId: string, action: "approve" | "decline" | "suspend" | "reactivate" | "end") {
    const note = notes[relationshipId]?.trim() ?? "";
    if (note.length < 10) { setMessage("Add a private decision note of at least 10 characters."); return; }
    setWorking(relationshipId); setMessage("");
    try {
      const response = await fetch("/api/care-partner/relationship-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ relationshipId, action, note }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't review this request.");
      const confirmations = { approve: "Care Partner relationship approved. No animal records have been shared.", decline: "Care Partner relationship declined and retained in history.", suspend: "Care Partner relationship suspended. Active animal assignments were revoked and retained in history.", reactivate: "Care Partner relationship restored. Animal access remains closed until a new assignment is created.", end: "Care Partner relationship ended. Active animal assignments were revoked and all records were retained." };
      setMessage(confirmations[action]);
      setNotes((current) => ({ ...current, [relationshipId]: "" })); await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Couldn't review this request."); }
    finally { setWorking(null); }
  }

  if (relationships === null) return <p style={{ color: C.muted }}>Loading Care Partner requests…</p>;
  const pending = relationships.filter((item) => item.status === "requested");
  const history = relationships.filter((item) => item.status !== "requested");

  return <section style={{ maxWidth: 900 }}>
    <p style={{ margin: "0 0 7px", color: C.coral, fontSize: 11.5, fontWeight: 800, letterSpacing: ".1em" }}>PRIVATE ORGANIZATION ACCESS</p>
    <h1 style={{ margin: 0, color: C.navy, fontSize: "clamp(28px, 5vw, 40px)" }}>Care Partner relationships</h1>
    <p style={{ color: C.muted, lineHeight: 1.6 }}>Review requests from verified professional providers. Approving creates an organization-level relationship only. It does not share any animal record, medical information, documents, or contact information.</p>
    {message ? <div role="status" style={{ margin: "14px 0", padding: 13, background: C.mint, color: C.navy }}>{message}</div> : null}
    <h2 style={{ color: C.navy, marginTop: 24 }}>Awaiting review ({pending.length})</h2>
    {pending.length === 0 ? <div style={{ padding: 16, background: C.mint, color: C.navy }}>No Care Partner requests need review.</div> : <div style={{ display: "grid", gap: 12 }}>{pending.map((item) => <article key={item.id} style={{ padding: 16, border: `1px solid ${C.border}`, background: C.white }}><h3 style={{ margin: "0 0 5px", color: C.navy }}>{item.care_partner_name}</h3><p style={details}><strong>{item.care_partner_category ?? "Professional care provider"}</strong><br/>{item.care_partner_services ?? "No service description supplied."}</p><div style={{ padding: 12, background: C.pink, color: C.muted, fontSize: 13, lineHeight: 1.5 }}><strong>Private introduction</strong><br/>{item.request_message}</div><label style={label}>Private decision note<textarea rows={3} value={notes[item.id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [item.id]: event.target.value }))} placeholder="Record verification, contact, reason, or any limitations." style={input}/></label><div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginTop: 10 }}><button type="button" disabled={working === item.id} onClick={() => review(item.id, "approve")} style={primary}>Approve Relationship</button><button type="button" disabled={working === item.id} onClick={() => review(item.id, "decline")} style={secondary}>Decline</button></div></article>)}</div>}
    <details style={{ marginTop: 24 }}><summary style={{ color: C.navy, fontWeight: 800, cursor: "pointer" }}>Relationship history ({history.length})</summary><div style={{ display: "grid", gap: 8, marginTop: 10 }}>{history.map((item) => <article key={item.id} style={{ padding: 13, border: `1px solid ${C.border}`, background: C.white }}><strong style={{ color: C.navy }}>{item.care_partner_name}</strong><span style={{ float: "right", color: C.coral, fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>{item.status}</span><p style={{ ...details, marginBottom: 0 }}>{item.care_partner_category ?? "Professional care provider"}</p>{item.status === "active" || item.status === "suspended" ? <><label style={label}>Private action note<textarea rows={2} value={notes[item.id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [item.id]: event.target.value }))} placeholder="Explain why this relationship is changing." style={input}/></label><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 9 }}>{item.status === "active" ? <button type="button" disabled={working === item.id} onClick={() => review(item.id, "suspend")} style={secondary}>Suspend relationship</button> : <button type="button" disabled={working === item.id} onClick={() => review(item.id, "reactivate")} style={primary}>Restore relationship</button>}<button type="button" disabled={working === item.id} onClick={() => review(item.id, "end")} style={danger}>Permanently end</button></div></> : null}</article>)}</div></details>
  </section>;
}

const details: React.CSSProperties = { margin: "0 0 10px", color: C.muted, fontSize: 13, lineHeight: 1.5 };
const label: React.CSSProperties = { display: "grid", gap: 6, marginTop: 12, color: C.navy, fontSize: 12.5, fontWeight: 800 };
const input: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: 10, border: `1px solid ${C.border}`, color: C.navy, font: "inherit" };
const primary: React.CSSProperties = { padding: "9px 12px", border: 0, background: C.navy, color: C.white, fontWeight: 800, cursor: "pointer" };
const secondary: React.CSSProperties = { padding: "9px 12px", border: `1px solid ${C.navy}`, background: C.white, color: C.navy, fontWeight: 800, cursor: "pointer" };
const danger: React.CSSProperties = { padding: "9px 12px", border: "1px solid #B6382E", background: C.white, color: "#B6382E", fontWeight: 800, cursor: "pointer" };
