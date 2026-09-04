"use client";

import { useEffect, useState } from "react";

type Org = {
  id: string;
  name: string;
  city: string | null;
  county: string | null;
  resource_status: string | null;
};

export default function AdminOrgListPage() {
  const [orgs, setOrgs] = useState<Org[] | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orgs?includeArchived=true")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Failed to load organizations.");
        setOrgs(data.organizations ?? []);
      })
      .catch((e) => setError(e.message));
  }, []);

  const filtered =
    orgs?.filter((o) =>
      o.name.toLowerCase().includes(query.trim().toLowerCase())
    ) ?? [];

  if (error && orgs === null) {
    return <p style={{ color: "#B23B2E" }}>{error}</p>;
  }

  return (
    <div>
      <h1 style={{ fontSize: 20 }}>Organizations</h1>
      <p style={{ color: "#6B6862", fontSize: 13.5, marginBottom: 16 }}>
        Search the public directory and open an organization to review its
        listing or handle an approved support request.
      </p>

      {error && (
        <p
          role="alert"
          style={{
            color: "#B23B2E",
            background: "#FFF4F2",
            border: "1px solid #F3C7BF",
            borderRadius: 6,
            padding: 10,
          }}
        >
          {error}
        </p>
      )}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by organization name…"
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 8,
          border: "1px solid #E7E5E1",
          borderRadius: 6,
          marginBottom: 16,
        }}
      />

      {orgs === null ? (
        <p>Loading…</p>
      ) : (
        filtered.map((o) => (
          <a
            key={o.id}
            href={`/admin/orgs/${o.id}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              border: "1px solid #E7E5E1",
              borderRadius: 8,
              padding: 12,
              marginBottom: 8,
              background: "#fff",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <strong>{o.name}</strong>
              <div style={{ fontSize: 12.5, color: "#6B6862", marginTop: 3 }}>
                {[o.city, o.county].filter(Boolean).join(", ") || "—"} ·{" "}
                {o.resource_status ?? "Verification Needed"}
              </div>
            </div>
            <span aria-hidden="true" style={{ color: "#4A5D75", fontWeight: 800 }}>›</span>
          </a>
        ))
      )}
    </div>
  );
}
