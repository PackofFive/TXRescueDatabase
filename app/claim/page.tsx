"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Org = { id: string; name: string; city: string; county: string };

function ClaimPageInner() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"search" | "request" | "code_sent" | "manual_review" | "done">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Org[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [claimId, setClaimId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Arriving from a "Claim this listing" link on a Directory card — skip
  // the search step entirely and go straight to the request form.
  useEffect(() => {
    const orgId = searchParams.get("orgId");
    const name = searchParams.get("name");
    if (orgId && name) {
      setSelectedOrg({ id: orgId, name, city: "", county: "" });
      setStep("request");
    }
  }, [searchParams]);

  async function search() {
    setError(null);
    const res = await fetch(`/api/orgs?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults((data.organizations ?? []).slice(0, 10));
  }

  function pickOrg(org: Org) {
    setSelectedOrg(org);
    setStep("request");
  }

  async function submitClaim(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/claims/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId: selectedOrg?.id, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    setMessage(data.message);
    setClaimId(data.claimId);
    setStep(data.status === "manual_review" ? "manual_review" : "code_sent");
  }

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/claims/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimId, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }
    setMessage(data.message);
    setStep("done");
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h1 style={{ fontSize: 20 }}>Claim your organization&apos;s listing</h1>
      <p style={{ color: "#6B6862", fontSize: 13.5, marginBottom: 16 }}>
        If your organization is already in the directory, claim it here to get access to the Org Portal and start submitting your own updates.
      </p>

      {step === "search" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by organization name…"
              style={{ flex: 1, padding: 8, border: "1px solid #E7E5E1", borderRadius: 6 }}
            />
            <button onClick={search} style={{ padding: "8px 16px", background: "#1C1B19", color: "#fff", border: "none", borderRadius: 6 }}>
              Search
            </button>
          </div>
          {results.map((org) => (
            <div
              key={org.id}
              onClick={() => pickOrg(org)}
              style={{ border: "1px solid #E7E5E1", borderRadius: 6, padding: 12, marginBottom: 6, cursor: "pointer" }}
            >
              <strong>{org.name}</strong>
              <div style={{ fontSize: 12.5, color: "#6B6862" }}>{[org.city, org.county].filter(Boolean).join(", ")}</div>
            </div>
          ))}
        </div>
      )}

      {step === "request" && selectedOrg && (
        <form onSubmit={submitClaim}>
          <p style={{ fontSize: 13.5, marginBottom: 12 }}>
            Claiming: <strong>{selectedOrg.name}</strong>{" "}
            <button type="button" onClick={() => setStep("search")} style={{ fontSize: 12, marginLeft: 8, background: "none", border: "none", color: "#C05621", cursor: "pointer" }}>
              change
            </button>
          </p>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Your email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
              style={{ width: "100%", padding: 8, border: "1px solid #E7E5E1", borderRadius: 6 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Choose a password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8}
              style={{ width: "100%", padding: 8, border: "1px solid #E7E5E1", borderRadius: 6 }} />
          </div>
          <p style={{ fontSize: 12, color: "#6B6862", marginBottom: 12 }}>
            We&apos;ll send a verification code to the email address already on file for this organization — not the email you enter above — to confirm you&apos;re affiliated with it.
          </p>
          <button type="submit" style={{ padding: "8px 16px", background: "#1C1B19", color: "#fff", border: "none", borderRadius: 6 }}>
            Request claim
          </button>
          {error && <p style={{ color: "#B23B2E", fontSize: 13, marginTop: 10 }}>{error}</p>}
        </form>
      )}

      {step === "code_sent" && (
        <form onSubmit={submitCode}>
          <p style={{ fontSize: 13.5, marginBottom: 12 }}>{message}</p>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Enter the 6-digit code</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} required maxLength={6}
              style={{ width: "100%", padding: 8, border: "1px solid #E7E5E1", borderRadius: 6, fontSize: 18, letterSpacing: 4 }} />
          </div>
          <button type="submit" style={{ padding: "8px 16px", background: "#1C1B19", color: "#fff", border: "none", borderRadius: 6 }}>
            Verify
          </button>
          {error && <p style={{ color: "#B23B2E", fontSize: 13, marginTop: 10 }}>{error}</p>}
        </form>
      )}

      {step === "manual_review" && (
        <p style={{ fontSize: 13.5, color: "#2B5C8A" }}>{message}</p>
      )}

      {step === "done" && (
        <p style={{ fontSize: 13.5, color: "#2F6F4E" }}>{message}</p>
      )}
    </div>
  );
}

export default function ClaimPage() {
  // useSearchParams requires a Suspense boundary in the app router.
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <ClaimPageInner />
    </Suspense>
  );
}
