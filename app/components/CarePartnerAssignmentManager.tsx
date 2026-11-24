"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Relationship = { id: string; care_partner_name: string };
type Animal = { id: string; name: string; species: string | null; breed_or_type: string | null };
type Assignment = { id: string; status: string; purpose: string; animal_name: string; care_partner_name: string; expires_at: string; can_view_medical_summary: boolean; can_upload_documents: boolean; can_add_care_notes: boolean };
type Data = { relationships: Relationship[]; animals: Animal[]; assignments: Assignment[] };

const COLORS = { navy: "#1E3A5F", coral: "#E85C56", mint: "#E1F3EC", pink: "#F9E1E5", border: "#DCE4EC", muted: "#4A5D75", white: "#FFFFFF" };

export default function CarePartnerAssignmentManager() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [relationshipId, setRelationshipId] = useState("");
  const [animalId, setAnimalId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [medical, setMedical] = useState(false);
  const [documents, setDocuments] = useState(false);
  const [notes, setNotes] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/care-partner/assignments", { cache: "no-store" });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "Assignments could not be loaded.");
    setData(body);
  }, []);

  useEffect(() => { load().catch((e) => setError(e.message)); }, [load]);

  async function create(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/care-partner/assignments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ relationshipId, animalId, purpose, expiresAt, canViewMedicalSummary: medical, canUploadDocuments: documents, canAddCareNotes: notes, authorizationConfirmed: confirmed }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Assignment could not be created.");
      setPurpose(""); setExpiresAt(""); setMedical(false); setDocuments(false); setNotes(false); setConfirmed(false);
      setMessage("The time-limited assignment was created and recorded in the audit history.");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Assignment could not be created."); }
    finally { setBusy(false); }
  }

  async function end(assignment: Assignment, status: "completed" | "revoked") {
    const reason = window.prompt(status === "completed" ? "Why is this assignment complete?" : "Why is this access being revoked?");
    if (!reason) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/care-partner/assignments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assignmentId: assignment.id, status, reason }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Assignment could not be updated.");
      setMessage("The assignment was ended. Its audit history was preserved."); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Assignment could not be updated."); }
    finally { setBusy(false); }
  }

  if (!data && !error) return <p>Loading Care Partner assignments…</p>;
  return <section style={{ maxWidth: 920 }}>
    <p style={{ margin: "0 0 7px", color: COLORS.coral, fontSize: 12, fontWeight: 800, letterSpacing: ".1em" }}>CONTROLLED ANIMAL ACCESS</p>
    <h1 style={{ margin: 0, color: COLORS.navy, fontSize: "clamp(30px, 5vw, 46px)" }}>Care Partner Assignments</h1>
    <p style={{ color: COLORS.muted, lineHeight: 1.6 }}>An approved organization relationship does not reveal any animals. Create a separate, time-limited assignment for one animal and choose only the work this provider may perform.</p>
    {error ? <div style={{ padding: 14, margin: "16px 0", background: COLORS.pink, color: "#B6382E", border: `1px solid ${COLORS.coral}` }}>{error}</div> : null}
    {message ? <div style={{ padding: 14, margin: "16px 0", background: COLORS.mint, color: COLORS.navy, border: `1px solid ${COLORS.border}` }}>{message}</div> : null}
    {data ? <>
      <form onSubmit={create} style={{ display: "grid", gap: 14, padding: 20, background: COLORS.white, border: `1px solid ${COLORS.border}` }}>
        <h2 style={{ margin: 0, color: COLORS.navy }}>Create an assignment</h2>
        {data.relationships.length === 0 ? <p style={{ margin: 0, color: COLORS.muted }}>Approve a verified Care Partner relationship before assigning an animal.</p> : null}
        <label style={labelStyle}>Care Partner<select required value={relationshipId} onChange={(e) => setRelationshipId(e.target.value)} style={inputStyle}><option value="">Select an approved Care Partner</option>{data.relationships.map((r) => <option key={r.id} value={r.id}>{r.care_partner_name}</option>)}</select></label>
        <label style={labelStyle}>Animal<select required value={animalId} onChange={(e) => setAnimalId(e.target.value)} style={inputStyle}><option value="">Select one animal</option>{data.animals.map((a) => <option key={a.id} value={a.id}>{a.name}{a.species ? ` · ${a.species}` : ""}</option>)}</select></label>
        <label style={labelStyle}>Purpose<textarea required minLength={20} maxLength={2000} value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Explain why this provider needs access and what work is authorized." style={{ ...inputStyle, minHeight: 100 }} /></label>
        <label style={labelStyle}>Access expires<input required type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} style={inputStyle} /></label>
        <fieldset style={{ border: `1px solid ${COLORS.border}`, padding: 14 }}><legend style={{ color: COLORS.navy, fontWeight: 800 }}>Exact permissions</legend><Check checked={medical} set={setMedical}>View a limited medical summary</Check><Check checked={documents} set={setDocuments}>Upload documents for this animal</Check><Check checked={notes} set={setNotes}>Add care notes for this animal</Check><p style={{ margin: "8px 0 0", color: COLORS.muted, fontSize: 12 }}>Unchecked information and actions remain unavailable. Full animal records are never shared by this assignment.</p></fieldset>
        <Check checked={confirmed} set={setConfirmed}>I confirm that this organization is authorized to assign this animal and these permissions.</Check>
        <button disabled={busy || data.relationships.length === 0} style={buttonStyle}>{busy ? "Saving…" : "Create time-limited assignment"}</button>
      </form>
      <h2 style={{ margin: "28px 0 12px", color: COLORS.navy }}>Assignment history</h2>
      <div style={{ display: "grid", gap: 10 }}>{data.assignments.length === 0 ? <p style={{ color: COLORS.muted }}>No Care Partner animal assignments yet.</p> : data.assignments.map((a) => <article key={a.id} style={{ padding: 16, background: COLORS.white, border: `1px solid ${COLORS.border}` }}><strong style={{ color: COLORS.navy }}>{a.animal_name} · {a.care_partner_name}</strong><p style={{ color: COLORS.muted, margin: "6px 0" }}>{a.purpose}</p><p style={{ color: COLORS.muted, margin: "6px 0", fontSize: 12 }}>Status: {a.status} · Expires {new Date(a.expires_at).toLocaleString()}</p>{a.status === "active" ? <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><button disabled={busy} onClick={() => end(a, "completed")} style={secondaryButton}>Mark complete</button><button disabled={busy} onClick={() => end(a, "revoked")} style={secondaryButton}>Revoke access</button></div> : null}</article>)}</div>
    </> : null}
  </section>;
}

function Check({ checked, set, children }: { checked: boolean; set: (value: boolean) => void; children: React.ReactNode }) { return <label style={{ display: "flex", gap: 9, alignItems: "flex-start", color: COLORS.navy, margin: "8px 0", lineHeight: 1.4 }}><input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} style={{ marginTop: 3 }} />{children}</label>; }
const labelStyle = { display: "grid", gap: 6, color: COLORS.navy, fontWeight: 800 } as const;
const inputStyle = { width: "100%", boxSizing: "border-box", border: `1px solid ${COLORS.border}`, padding: "12px 13px", color: COLORS.navy, background: COLORS.white, font: "inherit" } as const;
const buttonStyle = { justifySelf: "start", border: 0, padding: "12px 16px", background: COLORS.navy, color: "white", fontWeight: 800, cursor: "pointer" } as const;
const secondaryButton = { border: `1px solid ${COLORS.navy}`, padding: "8px 11px", background: COLORS.white, color: COLORS.navy, fontWeight: 800, cursor: "pointer" } as const;
