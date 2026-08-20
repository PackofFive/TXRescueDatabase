"use client";

import { useEffect, useState } from "react";

export const runtime = "edge";

type OrgRequest = {
  id: string;
  organization_name: string;
  organization_type: string | null;
  city: string | null;
  county: string | null;
  state: string | null;
  website: string | null;
  social_url: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  description: string | null;
  relationship: string;
  status: string;
  created_at: string;
  created_org_id: string | null;
};

export default function AdminOrganizationRequestsPage() {
  const [requests, setRequests] = useState<OrgRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/org-requests", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Couldn't load requests.");
      return;
    }
    setRequests(data.requests ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function review(requestId: string, action: "approve" | "reject") {
    setWorkingId(requestId);
    setError(null);

    const res = await fetch("/api/admin/org-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, action }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Couldn't review request.");
      setWorkingId(null);
      return;
    }

    await load();
    setWorkingId(null);
  }

  if (error && requests === null) return <p style={{ color: "#B23B2E" }}>{error}</p>;
  if (requests === null) return <p>Loading…</p>;

  return (
    <section>
      <h1 style={{ fontSize: 24, color: "#17233C" }}>Organization Requests</h1>
      <p style={{ color: "#6B6862" }}>
        Review requests before they are added to the public directory.
      </p>

      {error && <p role="alert" style={{ color: "#B23B2E" }}>{error}</p>}

      {requests.length === 0 ? (
        <p>No organization requests yet.</p>
      ) : (
        requests.map((r) => (
          <article
            key={r.id}
            style={{
              background: "#fff",
              border: "1px solid #E7E5E1",
              borderRadius: 9,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: "0 0 5px", fontSize: 18 }}>{r.organization_name}</h2>
                <div style={{ fontSize: 13, color: "#6B6862" }}>
                  {[r.organization_type, r.city, r.county, r.state].filter(Boolean).join(" · ")}
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 800 }}>{r.status.toUpperCase()}</span>
            </div>

            <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.6 }}>
              <div><strong>Submitted by:</strong> {r.contact_name || "—"} · {r.contact_email || "—"}</div>
              <div><strong>Relationship:</strong> {r.relationship === "representative" ? "Represents organization" : "Suggestion"}</div>
              {r.website && <div><strong>Website:</strong> <a href={r.website}>{r.website}</a></div>}
              {r.social_url && <div><strong>Social:</strong> <a href={r.social_url}>{r.social_url}</a></div>}
              {r.description && <div style={{ marginTop: 8 }}>{r.description}</div>}
            </div>

            {r.status === "pending" && (
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button disabled={workingId === r.id} onClick={() => review(r.id, "approve")} style={approveButton}>
                  Approve & Create Organization
                </button>
                <button disabled={workingId === r.id} onClick={() => review(r.id, "reject")} style={rejectButton}>
                  Reject
                </button>
              </div>
            )}

            {r.created_org_id && (
              <div style={{ marginTop: 10 }}>
                <a href={`/admin/orgs/${r.created_org_id}`}>Open created organization →</a>
              </div>
            )}
          </article>
        ))
      )}
    </section>
  );
}

const approveButton = { border: "none", borderRadius: 7, padding: "8px 11px", background: "#17233C", color: "#fff", fontWeight: 700, cursor: "pointer" } as const;
const rejectButton = { border: "1px solid #D8D6D2", borderRadius: 7, padding: "8px 11px", background: "#fff", color: "#1C1B19", fontWeight: 700, cursor: "pointer" } as const;
