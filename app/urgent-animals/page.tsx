"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Animal = {
  id: string; name: string | null; species: string | null; breed_or_type: string | null;
  urgency: "urgent" | "critical"; public_summary: string | null; public_need: string | null;
  photo_url: string | null; organization_id: string; organization_name: string;
  organization_city: string | null; organization_county: string | null; organization_state: string | null;
};

const C = { navy: "#1E3A5F", coral: "#E85C56", red: "#B9362B", mint: "#DCF0E8", muted: "#4A5D75", border: "#DCE4EC", white: "#FFF" };

export default function UrgentShelterAnimalsPage() {
  const searchParams = useSearchParams();
  const organizationId = searchParams.get("organizationId") || "";
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<"all" | "critical" | "urgent">("all");

  useEffect(() => {
    const suffix = organizationId ? `?organizationId=${encodeURIComponent(organizationId)}` : "";
    fetch(`/api/public/urgent-animals${suffix}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Urgent shelter animals could not be loaded.");
        setAnimals(Array.isArray(data.animals) ? data.animals : []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Urgent shelter animals could not be loaded."))
      .finally(() => setLoading(false));
  }, [organizationId]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return animals.filter((animal) => (priority === "all" || animal.urgency === priority) && (!needle || [animal.name, animal.species, animal.breed_or_type, animal.organization_name, animal.organization_city, animal.organization_county, animal.organization_state].filter(Boolean).some((value) => String(value).toLowerCase().includes(needle))));
  }, [animals, priority, query]);
  const shelterName = organizationId ? animals[0]?.organization_name : null;

  return <section style={{ maxWidth: 1120, margin: "0 auto" }}>
    <p style={eyebrow}>SHELTER EXPRESS · PUBLIC LISTINGS</p>
    <h1 style={heading}>{shelterName ? `${shelterName} Urgent Animals` : "Urgent Shelter Animals"}</h1>
    <p style={intro}>Animals published by shelters because they need rescue placement or another time-sensitive intervention. The shelter keeps custody until a formal transfer is completed.</p>
    {organizationId ? <a href="/urgent-animals" style={textLink}>View urgent animals from all shelters</a> : null}
    <div style={notice}><strong>Can your rescue help?</strong> Open the animal’s public profile to review the shelter’s request and send an offer. An offer or tag request does not transfer custody.</div>
    <div style={tools}>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search animal, breed, shelter, or location" aria-label="Search urgent shelter animals" style={input}/>
      <div style={filters}>
        {(["all", "critical", "urgent"] as const).map((value) => <button key={value} type="button" onClick={() => setPriority(value)} style={{ ...filterButton, background: priority === value ? C.navy : C.white, color: priority === value ? C.white : C.navy }}>{value === "all" ? "All" : value[0].toUpperCase() + value.slice(1)}</button>)}
      </div>
    </div>
    {loading ? <div style={empty}>Loading urgent shelter animals…</div> : null}
    {error ? <div role="alert" style={errorBox}>{error}</div> : null}
    {!loading && !error ? <p style={count}>Showing {visible.length} of {animals.length} urgent shelter animals</p> : null}
    {!loading && !error && visible.length === 0 ? <div style={empty}>No published urgent shelter animals match this view right now.</div> : null}
    <div style={grid}>{visible.map((animal) => <article key={animal.id} style={{ ...card, borderTopColor: animal.urgency === "critical" ? C.red : C.coral }}>
      {animal.photo_url ? <img src={animal.photo_url} alt="" style={photo}/> : <div style={{ ...photo, display: "grid", placeItems: "center", background: "#F3F6F8", fontSize: 36 }}>🐾</div>}
      <div style={cardBody}><div style={cardHead}><h2 style={cardTitle}>{animal.name || "Unnamed animal"}</h2><span style={{ ...badge, color: animal.urgency === "critical" ? C.red : "#A7472E" }}>{animal.urgency.toUpperCase()}</span></div>
      <p style={meta}>{[animal.species, animal.breed_or_type].filter(Boolean).join(" · ") || "Animal details pending"}</p>
      <p style={shelter}>{animal.organization_name}</p><p style={meta}>{[animal.organization_city, animal.organization_county, animal.organization_state].filter(Boolean).join(" · ")}</p>
      {animal.public_need ? <p style={need}>{animal.public_need}</p> : animal.public_summary ? <p style={need}>{animal.public_summary}</p> : null}
      <a href={`/pet/${encodeURIComponent(animal.id)}?returnTo=${encodeURIComponent(`/urgent-animals${organizationId ? `?organizationId=${organizationId}` : ""}`)}`} style={primary}>View Animal &amp; Ways to Help</a></div>
    </article>)}</div>
  </section>;
}

const eyebrow: React.CSSProperties = { margin: "0 0 7px", color: C.coral, fontWeight: 900, fontSize: 12, letterSpacing: ".09em" };
const heading: React.CSSProperties = { margin: "0 0 8px", color: C.navy, fontSize: "clamp(32px, 5vw, 52px)" };
const intro: React.CSSProperties = { margin: "0 0 10px", color: C.muted, fontSize: 17, lineHeight: 1.55, maxWidth: 850 };
const textLink: React.CSSProperties = { color: C.navy, fontWeight: 800 };
const notice: React.CSSProperties = { marginTop: 22, padding: 18, background: C.mint, color: C.navy, border: `1px solid ${C.border}`, lineHeight: 1.55 };
const tools: React.CSSProperties = { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", margin: "22px 0 10px" };
const input: React.CSSProperties = { flex: "1 1 330px", minWidth: 0, padding: "12px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 15 };
const filters: React.CSSProperties = { display: "flex", gap: 7, flexWrap: "wrap" };
const filterButton: React.CSSProperties = { padding: "9px 13px", border: `1px solid ${C.border}`, borderRadius: 999, fontWeight: 800, cursor: "pointer" };
const count: React.CSSProperties = { color: C.muted, fontSize: 13 };
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 310px), 1fr))", gap: 16, marginTop: 14 };
const card: React.CSSProperties = { background: C.white, border: `1px solid ${C.border}`, borderTop: "5px solid", borderRadius: 10, overflow: "hidden" };
const photo: React.CSSProperties = { width: "100%", height: 210, objectFit: "cover" };
const cardBody: React.CSSProperties = { padding: 17 };
const cardHead: React.CSSProperties = { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" };
const cardTitle: React.CSSProperties = { margin: 0, color: C.navy, fontSize: 22 };
const badge: React.CSSProperties = { background: "#FFE7DE", borderRadius: 999, padding: "5px 8px", fontSize: 10, fontWeight: 900, letterSpacing: ".05em" };
const meta: React.CSSProperties = { margin: "5px 0", color: C.muted, fontSize: 13 };
const shelter: React.CSSProperties = { margin: "14px 0 0", color: C.navy, fontWeight: 850 };
const need: React.CSSProperties = { color: C.muted, lineHeight: 1.5, whiteSpace: "pre-line", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" };
const primary: React.CSSProperties = { display: "inline-block", marginTop: 8, padding: "10px 13px", background: C.navy, color: C.white, textDecoration: "none", fontWeight: 850, borderRadius: 7 };
const empty: React.CSSProperties = { padding: 22, marginTop: 15, background: C.mint, border: `1px solid ${C.border}`, color: C.navy };
const errorBox: React.CSSProperties = { padding: 18, marginTop: 15, background: "#FFF0ED", border: "1px solid #E7B6AF", color: C.red };
