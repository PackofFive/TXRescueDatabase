"use client";

import { useEffect, useState } from "react";

type Org = {
  id: string;
  name: string;
  org_type: string;
  city: string;
  county: string;
  region: string;
  resource_status: string;
  intake_status: string;
};

export default function DirectoryPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    setLoading(true);
    fetch(`/api/orgs?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setOrgs(data.organizations ?? []))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div>
      <h1 style={{ fontSize: 20 }}>TX Animal Rescue &amp; Resource Database</h1>
      <p style={{ color: "#6B6862", fontSize: 13.5 }}>
        This is a minimal functional starting point — the styled Directory / AI Search / Org Portal /
        Admin Queue UI from the prototype artifact can be ported in here as the real components.
      </p>
      <input
        placeholder="Search by name, city, or county…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ padding: "8px 12px", border: "1px solid #E7E5E1", borderRadius: 6, width: "100%", maxWidth: 400, marginBottom: 16 }}
      />
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div>
          {orgs.map((o) => (
            <div key={o.id} style={{ border: "1px solid #E7E5E1", borderRadius: 6, padding: 14, marginBottom: 8 }}>
              <strong>{o.name}</strong>
              <div style={{ fontSize: 12.5, color: "#6B6862" }}>
                {o.org_type} · {[o.city, o.county].filter(Boolean).join(", ")} · {o.region}
              </div>
              <div style={{ fontSize: 12, marginTop: 4 }}>{o.resource_status}</div>
            </div>
          ))}
          {orgs.length === 0 && <p style={{ color: "#6B6862" }}>No organizations yet — import your Master Directory to get started (see README.md).</p>}
        </div>
      )}
    </div>
  );
}
