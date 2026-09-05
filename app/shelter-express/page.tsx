"use client";

import { useEffect, useMemo, useState } from "react";

type Animal = {
  id: string;
  name: string | null;
  temporary_name: string | null;
  species: string | null;
  breed_or_type: string | null;
  urgency: string | null;
  placement: string | null;
  public_share_enabled: boolean;
  photo_url: string | null;
  open_help_offers: number;
};

const navy = "#1E3A5F";
const coral = "#E85C56";
const muted = "#4A5D75";
const border = "#DCE4EC";

export default function ShelterExpressPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/animals?caseStatus=active&sort=newest", { cache: "no-store" })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Urgent animals could not be loaded.");
        setAnimals(Array.isArray(data.animals) ? data.animals : []);
      })
      .catch(reason => setError(reason instanceof Error ? reason.message : "Urgent animals could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const urgentAnimals = useMemo(
    () => animals.filter(animal => animal.urgency === "urgent" || animal.urgency === "critical"),
    [animals]
  );

  return (
    <div>
      <p style={{ margin: "0 0 8px", color: coral, fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Shelter Express</p>
      <h1 style={{ margin: 0, color: navy, fontSize: 38, lineHeight: 1.1 }}>Urgent animals, without extra paperwork</h1>
      <p style={{ margin: "12px 0 22px", maxWidth: 760, color: muted, fontSize: 16, lineHeight: 1.6 }}>
        Quickly add an animal, mark what help is needed, and publish a shareable profile for rescues and the community. Use the full Rescue Manager only when your shelter wants the additional tools.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 26 }}>
        <a href="/animals/new" style={primaryLink}>+ Add an urgent animal</a>
        <a href="/portal/organization-profile" style={secondaryLink}>Update shelter profile</a>
      </div>

      {loading ? <div style={notice}>Loading urgent animals…</div> : null}
      {error ? <div role="alert" style={{ ...notice, background: "#FBE3DA", color: "#B93A2E" }}>{error}</div> : null}

      {!loading && !error && urgentAnimals.length === 0 ? (
        <section style={{ ...notice, background: "#DCF0E8" }}>
          <h2 style={{ margin: "0 0 6px", color: navy, fontSize: 21 }}>No urgent animals are currently published.</h2>
          <p style={{ margin: 0, color: muted, lineHeight: 1.55 }}>When an animal needs rescue intervention, add it here or mark an existing animal urgent.</p>
        </section>
      ) : null}

      {urgentAnimals.length > 0 ? (
        <section>
          <h2 style={{ color: navy, fontSize: 24 }}>Urgent animals ({urgentAnimals.length})</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {urgentAnimals.map(animal => (
              <a key={animal.id} href={`/animals/${animal.id}`} style={{ display: "grid", gridTemplateColumns: animal.photo_url ? "84px minmax(0, 1fr)" : "1fr", gap: 16, padding: 16, background: "#fff", border: `1px solid ${border}`, borderLeft: `5px solid ${animal.urgency === "critical" ? "#B93A2E" : coral}`, color: "inherit", textDecoration: "none" }}>
                {animal.photo_url ? <img src={animal.photo_url} alt="" style={{ width: 84, height: 84, objectFit: "cover", borderRadius: 8 }} /> : null}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <strong style={{ color: navy, fontSize: 20 }}>{animal.name || animal.temporary_name || "Unnamed animal"}</strong>
                    <strong style={{ color: animal.urgency === "critical" ? "#B93A2E" : coral, textTransform: "uppercase", fontSize: 12 }}>{animal.urgency}</strong>
                  </div>
                  <p style={{ margin: "7px 0", color: muted }}>{[animal.species, animal.breed_or_type].filter(Boolean).join(" · ") || "Animal details pending"}</p>
                  <p style={{ margin: 0, color: navy, fontSize: 13 }}>{animal.public_share_enabled ? "Public profile active" : "Not public yet"} · {Number(animal.open_help_offers || 0)} open help offers</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

const primaryLink: React.CSSProperties = { display: "inline-block", padding: "11px 16px", background: navy, color: "#fff", textDecoration: "none", fontWeight: 800, borderRadius: 6 };
const secondaryLink: React.CSSProperties = { ...primaryLink, background: "#fff", color: navy, border: `1px solid ${border}` };
const notice: React.CSSProperties = { padding: 20, background: "#fff", border: `1px solid ${border}`, color: muted };
