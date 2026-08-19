"use client";

import { useEffect, useState } from "react";

type Submission = {
  id: string;
  org_name: string;
  field_label: string;
  old_value: string;
  new_value: string;
};

type Claim = {
  id: string;
  org_id: string;
  org_name: string;
  requester_email: string;
  created_at: string;
};

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [claims, setClaims] = useState<Claim[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/submissions")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Failed to load.");
        setSubmissions(data.submissions);
      })
      .catch((e) => setError(e.message));

    fetch("/api/admin/claims")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Failed to load.");
        setClaims(data.claims);
      })
      .catch((e) => setError(e.message));
  }

  useEffect(load, []);

  async function act(id: string, action: "approve" | "reject") {
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    load();
  }

  async function actClaim(id: string, action: "approve" | "reject") {
    await fetch(`/api/admin/claims/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    load();
  }

  if (error) {
    return <p style={{ color: "#B23B2E" }}>{error} — sign in as an approved admin account to view this page.</p>;
  }

  return (
    <div>
      <h1 style={{ fontSize: 20 }}>Admin Queue</h1>
      <a href="/admin/orgs" style={{ fontSize: 13, color: "#C05621", textDecoration: "none", display: "inline-block", marginBottom: 4 }}>
        Edit any organization directly →
      </a>

      <h2 style={{ fontSize: 15, marginTop: 20 }}>Pending submissions</h2>
      {submissions === null && <p>Loading…</p>}
      {submissions?.length === 0 && <p style={{ color: "#6B6862" }}>No pending submissions.</p>}
      {submissions?.map((s) => (
        <div key={s.id} style={{ border: "1px solid #E7E5E1", borderRadius: 6, padding: 14, marginBottom: 8 }}>
          <strong>{s.org_name}</strong> — {s.field_label}
          <div style={{ fontSize: 13, margin: "6px 0" }}>
            <span style={{ color: "#B23B2E", textDecoration: "line-through" }}>{s.old_value}</span>
            {" → "}
            <span style={{ color: "#2B5C8A", fontWeight: 600 }}>{s.new_value}</span>
          </div>
          <button onClick={() => act(s.id, "approve")} style={{ marginRight: 8, padding: "6px 12px", background: "#1C1B19", color: "#fff", border: "none", borderRadius: 6 }}>
            Approve
          </button>
          <button onClick={() => act(s.id, "reject")} style={{ padding: "6px 12px", background: "#fff", border: "1px solid #E7E5E1", borderRadius: 6 }}>
            Reject
          </button>
        </div>
      ))}

      <h2 style={{ fontSize: 15, marginTop: 28 }}>Listing claims needing manual review</h2>
      <p style={{ fontSize: 12.5, color: "#6B6862", marginBottom: 10 }}>
        These orgs had no email on file to auto-verify a claim against. Confirm affiliation by other means (phone, known contact) before approving.
      </p>
      {claims === null && <p>Loading…</p>}
      {claims?.length === 0 && <p style={{ color: "#6B6862" }}>No claims awaiting review.</p>}
      {claims?.map((c) => (
        <div key={c.id} style={{ border: "1px solid #E7E5E1", borderRadius: 6, padding: 14, marginBottom: 8 }}>
          <strong>{c.org_name}</strong>
          <div style={{ fontSize: 13, margin: "6px 0", color: "#6B6862" }}>
            Requested by: {c.requester_email}
          </div>
          <button onClick={() => actClaim(c.id, "approve")} style={{ marginRight: 8, padding: "6px 12px", background: "#1C1B19", color: "#fff", border: "none", borderRadius: 6 }}>
            Approve claim
          </button>
          <button onClick={() => actClaim(c.id, "reject")} style={{ padding: "6px 12px", background: "#fff", border: "1px solid #E7E5E1", borderRadius: 6 }}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
