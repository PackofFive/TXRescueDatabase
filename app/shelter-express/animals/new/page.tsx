"use client";

import { useState } from "react";

const navy = "#1E3A5F";
const coral = "#E85C56";
const muted = "#4A5D75";
const border = "#DCE4EC";

export default function ShelterExpressNewAnimalPage() {
  const [species, setSpecies] = useState("Dog");
  const [name, setName] = useState("");
  const [shelterId, setShelterId] = useState("");
  const [breed, setBreed] = useState("");
  const [urgency, setUrgency] = useState("urgent");
  const [helpNeeded, setHelpNeeded] = useState("");
  const [deadline, setDeadline] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const publish = submitter?.value !== "draft";
    setSaving(true);
    setError("");
    try {
      const notes = [shelterId ? `Shelter ID: ${shelterId}` : "", deadline ? `Deadline: ${deadline}` : "", helpNeeded].filter(Boolean).join("\n");
      const createResponse = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          species,
          name,
          temporaryName: shelterId,
          source: "Shelter Express",
          custody: "other",
          placement: "other",
          urgency,
          intakeDate: new Date().toISOString().slice(0, 10),
          notes,
        }),
      });
      const created = await createResponse.json();
      if (!createResponse.ok) throw new Error(created.error ?? "The urgent listing could not be created.");
      const animalId = String(created.animal.id);

      const publishResponse = await fetch(`/api/animals/${encodeURIComponent(animalId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          breedOrType: breed,
          publicShareEnabled: publish,
          publicSummary: helpNeeded,
          publicNeed: deadline ? `${helpNeeded}\nDeadline: ${deadline}` : helpNeeded,
          publicSyncFields: ["name", "species", "breed_or_type"],
        }),
      });
      const published = await publishResponse.json();
      if (!publishResponse.ok) throw new Error(published.error ?? "The urgent listing could not be saved.");

      if (photo) {
        const form = new FormData();
        form.set("file", photo);
        form.set("title", `${name || shelterId || "Urgent animal"} photo`);
        form.set("category", "other");
        form.set("source", "Shelter Express");
        form.set("visibility", publish ? "public" : "private");
        const uploadResponse = await fetch(`/api/animals/${encodeURIComponent(animalId)}/documents`, { method: "POST", body: form });
        const uploaded = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploaded.error ?? "The listing was created, but the photo could not be uploaded.");
        if (uploaded.document?.id) {
          await fetch(`/api/animals/${encodeURIComponent(animalId)}/documents/profile-photo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ documentId: uploaded.document.id }),
          });
        }
      }

      window.location.href = "/shelter-express/animals";
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The urgent listing could not be created.");
      setSaving(false);
    }
  }

  return (
    <div>
      <p style={eyebrow}>SHELTER EXPRESS</p>
      <h1 style={heading}>Add an urgent animal</h1>
      <p style={intro}>Share only what rescues need to quickly understand the animal and offer help. This is not a full shelter-management record.</p>
      <form onSubmit={submit} style={formStyle}>
        <div style={twoColumns}>
          <label style={label}>Species<select value={species} onChange={(event) => setSpecies(event.target.value)} style={input}><option>Dog</option><option>Cat</option><option>Other</option></select></label>
          <label style={label}>Urgency<select value={urgency} onChange={(event) => setUrgency(event.target.value)} style={input}><option value="urgent">Urgent</option><option value="critical">Critical</option></select></label>
        </div>
        <div style={twoColumns}>
          <label style={label}>Name or nickname<input value={name} onChange={(event) => setName(event.target.value)} style={input} /></label>
          <label style={label}>Shelter ID<input value={shelterId} onChange={(event) => setShelterId(event.target.value)} style={input} /></label>
        </div>
        <label style={label}>Breed or description<input value={breed} onChange={(event) => setBreed(event.target.value)} style={input} /></label>
        <label style={label}>What help is needed?<textarea required value={helpNeeded} onChange={(event) => setHelpNeeded(event.target.value)} rows={5} style={input} placeholder="Rescue placement, foster, transport, medical support, or other urgent needs" /><span style={hint}>Required to publish; optional when saving a draft.</span></label>
        <label style={label}>Deadline, if known<input type="datetime-local" value={deadline} onChange={(event) => setDeadline(event.target.value)} style={input} /></label>
        <label style={label}>Photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} style={input} /></label>
        <p style={notice}>Save a draft if details still need to be completed. Publishing makes the urgent listing visible to rescues and the community. The shelter keeps custody unless a separate transfer is completed.</p>
        <div style={actions}><button type="submit" name="action" value="publish" disabled={saving} style={button}>{saving ? "Saving…" : "Publish Urgent Listing"}</button><button type="submit" name="action" value="draft" formNoValidate disabled={saving} style={secondaryButton}>{saving ? "Saving…" : "Save Draft"}</button></div>
        {error ? <div role="alert" style={errorStyle}>{error}</div> : null}
      </form>
    </div>
  );
}

const eyebrow: React.CSSProperties = { margin: "0 0 8px", color: coral, fontSize: 12, fontWeight: 800, letterSpacing: ".1em" };
const heading: React.CSSProperties = { margin: 0, color: navy, fontSize: 38, lineHeight: 1.1 };
const intro: React.CSSProperties = { maxWidth: 760, color: muted, fontSize: 16, lineHeight: 1.6 };
const formStyle: React.CSSProperties = { display: "grid", gap: 16, maxWidth: 780, marginTop: 24, padding: 22, border: `1px solid ${border}`, background: "#fff" };
const twoColumns: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 };
const label: React.CSSProperties = { display: "grid", gap: 6, color: navy, fontSize: 13, fontWeight: 800 };
const input: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "10px 11px", border: `1px solid ${border}`, background: "#fff", color: navy, font: "inherit" };
const notice: React.CSSProperties = { margin: 0, padding: 14, background: "#DCF0E8", color: navy, lineHeight: 1.5 };
const button: React.CSSProperties = { justifySelf: "start", padding: "11px 16px", border: 0, background: navy, color: "#fff", fontWeight: 800, cursor: "pointer" };
const secondaryButton:React.CSSProperties={...button,background:"#fff",color:navy,border:`1px solid ${border}`};
const actions:React.CSSProperties={display:"flex",gap:10,flexWrap:"wrap"};
const hint:React.CSSProperties={color:muted,fontSize:12,fontWeight:500};
const errorStyle: React.CSSProperties = { padding: 14, border: "1px solid #E9B9B4", background: "#FCE9E7", color: "#A9362B" };
