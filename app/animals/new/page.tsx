"use client";

import { useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  border: "1px solid #E7E5E1",
  borderRadius: 6,
  fontSize: 13.5,
  fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  marginBottom: 4,
};

// Quick Animal Intake — Master Product Plan Section 8.1. Deliberately
// minimal by design: photo, species, name/temporary name, date, and
// current relationship/custody. Everything else (medical, behavior,
// foster placement, full identity/ID history) gets filled in later on
// the animal's own record — that's the whole point of "quick."
export default function QuickIntakePage() {
  const [species, setSpecies] = useState("");
  const [name, setName] = useState("");
  const [temporaryName, setTemporaryName] = useState("");
  const [custody, setCustody] = useState("rescue");
  const [intakeDate, setIntakeDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [photoUrl, setPhotoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ species, name, temporaryName, custody, intakeDate, photoUrl, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setSavedId(data.animal.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (savedId) {
    return (
      <div style={{ maxWidth: 480 }}>
        <h1 style={{ fontSize: 20 }}>Intake recorded</h1>
        <p style={{ fontSize: 13.5, color: "#2F6F4E", marginBottom: 16 }}>
          The animal has been added. You can fill in the rest of the record (medical, behavior, photos, identity details) at any time.
        </p>
        <a href="/animals" style={{ color: "#C05621", fontSize: 13.5 }}>← Back to Animals</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <a href="/animals" style={{ fontSize: 12.5, color: "#C05621", textDecoration: "none" }}>← Back to Animals</a>
      <h1 style={{ fontSize: 20, marginTop: 8 }}>Quick Animal Intake</h1>
      <p style={{ color: "#6B6862", fontSize: 13.5, marginBottom: 20 }}>
        Just enough to get this animal into the system — you can complete the full record later.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Species *</label>
          <select value={species} onChange={(e) => setSpecies(e.target.value)} required style={inputStyle}>
            <option value="">Select…</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Name (if known)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Temporary name (if no name yet)</label>
          <input value={temporaryName} onChange={(e) => setTemporaryName(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Current relationship / custody *</label>
          <select value={custody} onChange={(e) => setCustody(e.target.value)} style={inputStyle}>
            <option value="rescue">In rescue custody</option>
            <option value="shelter">Still with shelter (helping/networking)</option>
            <option value="owner">With current owner (assistance case)</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Intake date *</label>
          <input type="date" value={intakeDate} onChange={(e) => setIntakeDate(e.target.value)} required style={inputStyle} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Photo URL (optional — direct file upload is coming later)</label>
          <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://…" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Notes (optional)</label>
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} style={inputStyle} />
        </div>

        <button type="submit" disabled={saving} style={{ padding: "9px 18px", background: "#1C1B19", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600, cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : "Record intake"}
        </button>
        {error && <p style={{ color: "#B23B2E", fontSize: 13, marginTop: 10 }}>{error}</p>}
      </form>
    </div>
  );
}
