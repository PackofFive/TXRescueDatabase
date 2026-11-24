"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Note = { id: string; note_type: string; note_text: string; observed_at: string; addendum_to_note_id: string | null; created_at: string; created_by_email: string };
type Assignment = { animalName: string; organizationName: string; status: string; expiresAt: string };

export default function Page() {
  const params = useParams<{ id: string }>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [correcting, setCorrecting] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const response = await fetch(`/api/care-partner/assignments/${encodeURIComponent(params.id)}/care-notes`, { cache: "no-store" });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "Care notes could not be loaded.");
    setNotes(body.notes || []); setAssignment(body.assignment);
  }, [params.id]);
  useEffect(() => { load().catch((reason) => setError(reason.message || "Care notes could not be loaded.")); }, [load]);

  async function addendum(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/care-partner/assignments/${encodeURIComponent(params.id)}/care-notes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ addendumToNoteId: correcting, noteText: text, observedAt: new Date().toISOString() }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Addendum could not be saved.");
      setCorrecting(""); setText(""); setMessage("Addendum saved. The original note remains unchanged."); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Addendum could not be saved."); }
    finally { setBusy(false); }
  }

  const active = assignment?.status === "active" && new Date(assignment.expiresAt).getTime() > Date.now();
  const originals = notes.filter((note) => note.note_type !== "addendum");
  return <section style={{ maxWidth: 900, margin: "0 auto", padding: "8px 0 44px" }}>
    <a href={`/care-partner/assignments/${params.id}`} style={{ color: "#E85C56", fontWeight: 800, textDecoration: "none" }}>← Back to assigned work</a>
    <p style={{ margin: "24px 0 7px", color: "#E85C56", fontSize: 12, fontWeight: 800, letterSpacing: ".1em" }}>PERMANENT CARE RECORD</p>
    <h1 style={{ margin: 0, color: "#1E3A5F", fontSize: "clamp(30px, 5vw, 44px)" }}>Care Notes{assignment ? ` · ${assignment.animalName}` : ""}</h1>
    <p style={{ color: "#4A5D75", lineHeight: 1.6 }}>Original notes cannot be overwritten. If something needs clarification or correction, add a linked addendum explaining the change.</p>
    {error ? <Notice error>{error}</Notice> : null}{message ? <Notice>{message}</Notice> : null}
    <div style={{ display: "grid", gap: 12, marginTop: 18 }}>{originals.length === 0 ? <p style={{ color: "#4A5D75" }}>No original care notes have been submitted.</p> : originals.map((note) => {
      const addenda = notes.filter((item) => item.addendum_to_note_id === note.id);
      return <article key={note.id} style={{ padding: 16, border: "1px solid #DCE4EC", background: "white" }}>
        <strong style={{ color: "#1E3A5F" }}>{labelType(note.note_type)}</strong>
        <p style={{ color: "#4A5D75", whiteSpace: "pre-wrap", lineHeight: 1.55 }}>{note.note_text}</p>
        <small style={{ color: "#4A5D75" }}>Observed {new Date(note.observed_at).toLocaleString()} · Added by {note.created_by_email}</small>
        {addenda.map((item) => <div key={item.id} style={{ marginTop: 12, padding: 12, borderLeft: "4px solid #E85C56", background: "#FFF4F2" }}><strong style={{ color: "#1E3A5F" }}>Addendum</strong><p style={{ color: "#4A5D75", whiteSpace: "pre-wrap" }}>{item.note_text}</p><small style={{ color: "#4A5D75" }}>Added {new Date(item.created_at).toLocaleString()} by {item.created_by_email}</small></div>)}
        {active && correcting !== note.id ? <button onClick={() => { setCorrecting(note.id); setText(""); }} style={secondaryButton}>Add correction or clarification</button> : null}
        {correcting === note.id ? <form onSubmit={addendum} style={{ display: "grid", gap: 9, marginTop: 12 }}><label style={{ color: "#1E3A5F", fontWeight: 800 }}>Addendum<textarea required minLength={10} maxLength={5000} value={text} onChange={(event) => setText(event.target.value)} style={{ display: "block", width: "100%", boxSizing: "border-box", minHeight: 100, marginTop: 6, padding: 11, border: "1px solid #DCE4EC", font: "inherit" }} /></label><div style={{ display: "flex", gap: 8 }}><button disabled={busy} style={primaryButton}>{busy ? "Saving…" : "Save addendum"}</button><button type="button" onClick={() => setCorrecting("")} style={secondaryButton}>Cancel</button></div></form> : null}
      </article>;
    })}</div>
  </section>;
}

function Notice({ children, error = false }: { children: React.ReactNode; error?: boolean }) { return <div style={{ marginTop: 14, padding: 13, color: error ? "#B6382E" : "#1E3A5F", background: error ? "#F9E1E5" : "#E1F3EC" }}>{children}</div>; }
function labelType(value: string) { return value.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
const primaryButton = { border: 0, padding: "9px 12px", background: "#1E3A5F", color: "white", fontWeight: 800, cursor: "pointer" } as const;
const secondaryButton = { marginTop: 12, border: "1px solid #1E3A5F", padding: "8px 11px", background: "white", color: "#1E3A5F", fontWeight: 800, cursor: "pointer" } as const;
