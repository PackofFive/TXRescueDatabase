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
  const [startingOrgId, setStartingOrgId] = useState<string | null>(null);

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

  async function openManager(orgId: string) {
    setError(null);
    setStartingOrgId(orgId);

    try {
      const res = await fetch("/api/admin/test-org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Couldn't start Rescue Manager test mode.");
      }

      window.location.href = "/portal";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't open Rescue Manager.");
      setStartingOrgId(null);
    }
  }

  if (error && orgs === null) {
    return <p style={{ color: "#B23B2E" }}>{error}</p>;
  }

  return (
    <div>
      <h1 style={{ fontSize: 20 }}>Organizations</h1>
      <p style={{ color: "#6B6862", fontSize: 13.5, marginBottom: 16 }}>
        Edit an organization directly, or open its private Rescue Manager in
        admin test mode.
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
          <div
            key={o.id}
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
            }}
          >
            <a
              href={`/admin/orgs/${o.id}`}
              style={{
                flex: 1,
                minWidth: 0,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <strong>{o.name}</strong>
              <div style={{ fontSize: 12.5, color: "#6B6862", marginTop: 3 }}>
                {[o.city, o.county].filter(Boolean).join(", ") || "—"} ·{" "}
                {o.resource_status ?? "Verification Needed"}
              </div>
            </a>

            <button
              onClick={() => openManager(o.id)}
              disabled={startingOrgId === o.id}
              style={{
                border: "none",
                borderRadius: 7,
                padding: "8px 12px",
                background: "#17233C",
                color: "#fff",
                fontWeight: 700,
                cursor: startingOrgId === o.id ? "wait" : "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {startingOrgId === o.id ? "Opening…" : "Test Rescue Manager"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
