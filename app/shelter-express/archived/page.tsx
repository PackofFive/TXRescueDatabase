"use client";

import { useEffect, useMemo, useState } from "react";

type Animal = {
  id: string;
  name: string | null;
  temporary_name: string | null;
  species: string | null;
  breed_or_type: string | null;
  urgency: string | null;
  outcome_status: string | null;
  outcome_date: string | null;
};

type Partner = {
  id: string;
  name: string;
  org_type: string | null;
  city: string | null;
  county: string | null;
  state: string | null;
  relationship_status: string | null;
  private_notes: string | null;
  archived_at: string | null;
  archived_by_email: string | null;
};

const colors = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  muted: "#4A5D75",
  border: "#DCE4EC",
  mint: "#DCF0E8",
  peach: "#FBE3DA",
};

export default function ShelterExpressArchivedPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"all" | "animals" | "partners">("all");
  const [restoringId, setRestoringId] = useState("");

  async function load() {
    setError("");
    const [animalResponse, partnerResponse] = await Promise.all([
      fetch("/api/animals?caseStatus=closed&sort=newest", { cache: "no-store" }),
      fetch("/api/shelter-express/partners", { cache: "no-store" }),
    ]);
    const [animalData, partnerData] = await Promise.all([
      animalResponse.json(),
      partnerResponse.json(),
    ]);
    if (!animalResponse.ok) throw new Error(animalData.error ?? "Resolved animals could not be loaded.");
    if (!partnerResponse.ok) throw new Error(partnerData.error ?? "Archived partners could not be loaded.");
    setAnimals((animalData.animals ?? []).filter((animal: Animal) => animal.outcome_status));
    setPartners(partnerData.archivedPartners ?? []);
  }

  useEffect(() => {
    void load().catch((reason) => setError(reason instanceof Error ? reason.message : "Archived records could not be loaded.")).finally(() => setLoading(false));
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleAnimals = useMemo(() => animals.filter((animal) => `${animal.name ?? ""} ${animal.temporary_name ?? ""} ${animal.species ?? ""} ${animal.breed_or_type ?? ""} ${animal.outcome_status ?? ""}`.toLowerCase().includes(normalizedQuery)), [animals, normalizedQuery]);
  const visiblePartners = useMemo(() => partners.filter((partner) => `${partner.name} ${partner.org_type ?? ""} ${partner.city ?? ""} ${partner.county ?? ""} ${partner.state ?? ""} ${partner.relationship_status ?? ""} ${partner.private_notes ?? ""}`.toLowerCase().includes(normalizedQuery)), [partners, normalizedQuery]);

  async function restorePartner(partner: Partner) {
    if (!window.confirm(`Restore ${partner.name} to the active Rescue Partners list?`)) return;
    setRestoringId(partner.id);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/shelter-express/partners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rescueOrgId: partner.id, action: "restore" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The partner could not be restored.");
      setMessage(data.message);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The partner could not be restored.");
    } finally {
      setRestoringId("");
    }
  }

  const shownCount = (view === "partners" ? 0 : visibleAnimals.length) + (view === "animals" ? 0 : visiblePartners.length);

  return <div>
    <p style={eyebrow}>Retained history</p>
    <h1 style={title}>Archived Records</h1>
    <p style={intro}>Resolved urgent animals and inactive rescue-partner relationships remain available for review. Restoring a record never erases its prior history.</p>

    <section style={summaryGrid}>
      <Summary value={animals.length} label="Resolved animals" />
      <Summary value={partners.length} label="Archived partners" />
    </section>

    <section style={tools}>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search archived names, IDs, locations, outcomes, or private notes" style={input} />
      <div style={filters}>
        {(["all", "animals", "partners"] as const).map((key) => <button key={key} type="button" onClick={() => setView(key)} style={{ ...filterButton, ...(view === key ? activeFilter : {}) }}>{key === "all" ? "All records" : key === "animals" ? "Resolved animals" : "Archived partners"}</button>)}
      </div>
    </section>

    {error ? <div role="alert" style={{ ...notice, background: colors.peach, color: "#A9362B" }}>{error}</div> : null}
    {message ? <div role="status" style={{ ...notice, background: colors.mint }}>{message}</div> : null}
    {loading ? <div style={notice}>Loading archived records…</div> : null}
    {!loading && !error && shownCount === 0 ? <div style={{ ...notice, background: colors.mint }}><strong>No archived records match this view.</strong></div> : null}

    {!loading && view !== "partners" && visibleAnimals.length > 0 ? <section style={section}>
      <h2 style={sectionTitle}>Resolved urgent animals ({visibleAnimals.length})</h2>
      <div style={list}>{visibleAnimals.map((animal) => <article key={animal.id} style={card}>
        <div><h3 style={cardTitle}>{animal.name || animal.temporary_name || "Unnamed animal"}</h3><p style={meta}>{[animal.species, animal.breed_or_type, label(animal.outcome_status)].filter(Boolean).join(" · ")}</p><p style={meta}>{animal.outcome_date ? `Resolved ${new Date(`${animal.outcome_date.slice(0, 10)}T00:00:00`).toLocaleDateString()}` : "Resolution date not recorded"}</p></div>
        <a href={`/shelter-express/animals/${animal.id}`} style={primary}>View record</a>
      </article>)}</div>
    </section> : null}

    {!loading && view !== "animals" && visiblePartners.length > 0 ? <section style={section}>
      <h2 style={sectionTitle}>Archived rescue partners ({visiblePartners.length})</h2>
      <div style={list}>{visiblePartners.map((partner) => <article key={partner.id} style={card}>
        <div><h3 style={cardTitle}>{partner.name}</h3><p style={meta}>{[partner.org_type, partner.city, partner.county, partner.state].filter(Boolean).join(" · ") || "Organization details pending"}</p><p style={meta}>{label(partner.relationship_status)}{partner.archived_at ? ` · Archived ${new Date(partner.archived_at).toLocaleDateString()}` : ""}{partner.archived_by_email ? ` by ${partner.archived_by_email}` : ""}</p>{partner.private_notes ? <p style={privateNote}><strong>Private notes:</strong> {partner.private_notes}</p> : null}</div>
        <button type="button" disabled={restoringId === partner.id} onClick={() => restorePartner(partner)} style={primary}>{restoringId === partner.id ? "Restoring…" : "Restore partner"}</button>
      </article>)}</div>
    </section> : null}
  </div>;
}

function Summary({ value, label: text }: { value: number; label: string }) {
  return <div style={summary}><strong style={{ color: colors.navy, fontSize: 30 }}>{value}</strong><span style={{ color: colors.muted }}>{text}</span></div>;
}

function label(value: string | null) {
  return value ? value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "";
}

const eyebrow: React.CSSProperties = { margin: "0 0 8px", color: colors.coral, fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" };
const title: React.CSSProperties = { margin: 0, color: colors.navy, fontSize: 40 };
const intro: React.CSSProperties = { maxWidth: 760, color: colors.muted, lineHeight: 1.6 };
const summaryGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 12, margin: "22px 0" };
const summary: React.CSSProperties = { display: "grid", gap: 3, padding: 16, background: "#fff", border: `1px solid ${colors.border}` };
const tools: React.CSSProperties = { padding: 16, background: "#fff", border: `1px solid ${colors.border}`, marginBottom: 18 };
const input: React.CSSProperties = { boxSizing: "border-box", width: "100%", padding: 12, border: `1px solid ${colors.border}`, font: "inherit", marginBottom: 12 };
const filters: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8 };
const filterButton: React.CSSProperties = { padding: "8px 11px", border: `1px solid ${colors.border}`, background: "#fff", color: colors.navy, fontWeight: 700, cursor: "pointer" };
const activeFilter: React.CSSProperties = { background: colors.navy, color: "#fff" };
const notice: React.CSSProperties = { padding: 18, border: `1px solid ${colors.border}`, color: colors.navy, marginBottom: 16 };
const section: React.CSSProperties = { marginTop: 26 };
const sectionTitle: React.CSSProperties = { color: colors.navy, fontSize: 24 };
const list: React.CSSProperties = { display: "grid", gap: 12 };
const card: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, padding: 16, background: "#fff", border: `1px solid ${colors.border}` };
const cardTitle: React.CSSProperties = { margin: 0, color: colors.navy, fontSize: 19 };
const meta: React.CSSProperties = { margin: "5px 0", color: colors.muted };
const privateNote: React.CSSProperties = { margin: "9px 0 0", maxWidth: 700, color: colors.muted, lineHeight: 1.45 };
const primary: React.CSSProperties = { display: "inline-block", padding: "10px 14px", border: 0, background: colors.navy, color: "#fff", fontWeight: 800, textDecoration: "none", cursor: "pointer" };
