"use client";

import { useEffect, useState } from "react";

type Animal = {
  id: string;
  name: string | null;
  temporary_name: string | null;
  species: string;
  breed_or_type: string | null;
  custody: string;
  urgency: string;
  placement: string;
  created_at: string;
};

export default function AnimalsListPage() {
  const [animals, setAnimals] = useState<Animal[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/animals")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Failed to load animals.");
        setAnimals(data.animals);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return <p style={{ color: "#B23B2E" }}>{error}</p>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 20 }}>Animals</h1>
        <a href="/animals/new" style={{ padding: "8px 16px", background: "#1C1B19", color: "#fff", borderRadius: 6, textDecoration: "none", fontSize: 13.5 }}>
          + Quick Intake
        </a>
      </div>

      {animals === null && <p>Loading…</p>}
      {animals?.length === 0 && (
        <p style={{ color: "#6B6862" }}>No animals recorded yet. Use Quick Intake to add the first one.</p>
      )}
      {animals?.map((a) => (
        <div key={a.id} style={{ border: "1px solid #E7E5E1", borderRadius: 6, padding: 12, marginBottom: 8 }}>
          <strong>{a.name || a.temporary_name || "(unnamed)"}</strong>
          <div style={{ fontSize: 12.5, color: "#6B6862", marginTop: 3 }}>
            {[a.species, a.breed_or_type].filter(Boolean).join(" · ")}
            {" — "}
            custody: {a.custody} · urgency: {a.urgency} · placement: {a.placement}
          </div>
        </div>
      ))}
    </div>
  );
}
