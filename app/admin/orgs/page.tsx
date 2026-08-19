"use client";

import { useEffect, useState } from "react";

type Org = { id: string; name: string; city: string | null; county: string | null; resource_status: string | null };

export default function AdminOrgListPage() {
  const [orgs, setOrgs] = useState<Org[] | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orgs")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Failed to load organizations.");
        setOrgs(data.organizations ?? []);
      })
      .catch((e) => setError(e.message));
  }, []);

  const filtered = orgs?.filter((o) => o.name.toLowerCase().includes(query.trim().toLowerCase())) ?? [];

  if (error) return <p style={{ color: "#B23B2E" }}>{error}</p>;

  return (
    <div>
      <h1 style={{ fontSize: 20 }}>Edit an organization</h1>
      <p style={{ color: "#6B6862", fontSize: 13.5, marginBottom: 16 }}>
        Full direct editor — changes here publish immediately, no review queue, since you&apos;re the reviewer.
      </p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by organization name…"
        style={{ width: "100%", maxWidth: 400, padding: 8, border: "1px solid #E7E5E1", borderRadius: 6, marginBottom: 16 }}
      />
      {orgs === null ? (
        <p>Loading…</p>
      ) : (
        filtered.map((o) => (
          <a
            key={o.id}
            href={`/admin/orgs/${o.id}`}
            style={{ display: "block", border: "1px solid #E7E5E1", borderRadius: 6, padding: 12, marginBottom: 6, textDecoration: "none", color: "inherit" }}
          >
            <strong>{o.name}</strong>
            <div style={{ fontSize: 12.5, color: "#6B6862" }}>
              {[o.city, o.county].filter(Boolean).join(", ") || "—"} · {o.resource_status ?? "Verification Needed"}
            </div>
          </a>
        ))
      )}
    </div>
  );
}
