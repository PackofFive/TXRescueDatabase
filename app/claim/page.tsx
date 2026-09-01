"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Org = { id: string; name: string; city: string; county: string; is_claimed: boolean };

function ClaimPageInner() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"search" | "request" | "issue" | "issue_done" | "code_sent" | "manual_review" | "done">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Org[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [claimId, setClaimId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [relationshipToOrg, setRelationshipToOrg] = useState("");
  const [issueType, setIssueType] = useState("");
  const [previousOrgEmail, setPreviousOrgEmail] = useState("");
  const [details, setDetails] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [submittingIssue, setSubmittingIssue] = useState(false);

  // Arriving from a "Claim this listing" link on a Directory card — skip
  // the search step entirely and go straight to the request form.
  useEffect(() => {
    const orgId = searchParams.get("orgId");
    const name = searchParams.get("name");
    if (orgId && name) {
      fetch(`/api/orgs?q=${encodeURIComponent(name)}`)
        .then((response) => response.json())
        .then((data) => {
          const organization = (data.organizations ?? []).find((item: Org) => item.id === orgId);
          const selected = organization ?? { id: orgId, name, city: "", county: "", is_claimed: false };
          setSelectedOrg(selected);
          setStep(selected.is_claimed ? "issue" : "request");
          if (selected.is_claimed) setIssueType("already_claimed");
        })
        .catch(() => {
          setSelectedOrg({ id: orgId, name, city: "", county: "", is_claimed: false });
          setStep("request");
        });
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
    if (org.is_claimed) {
      setIssueType("already_claimed");
      setStep("issue");
    } else {
      setStep("request");
    }
  }

  function reportIssue() {
    setError(null);
    if (selectedOrg?.is_claimed && !issueType) setIssueType("already_claimed");
    setStep("issue");
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

  async function submitIssue(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!selectedOrg || !reporterName.trim() || !email.trim() || !relationshipToOrg || !issueType) {
      setError("Complete your name, email, relationship, and issue type before sending.");
      return;
    }
    if (details.trim().length < 20) {
      setError("Please provide at least 20 characters explaining what happened.");
      return;
    }
    setSubmittingIssue(true);
    try {
      const res = await fetch("/api/claims/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "report_issue",
          orgId: selectedOrg.id,
          reporterName,
          reporterEmail: email,
          reporterPhone,
          relationshipToOrg,
          issueType,
          previousOrgEmail,
          details,
          evidenceUrl,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? `The report could not be submitted (${res.status}).`);
        return;
      }
      setMessage(`${data.message} Reference: ${data.reference}`);
      setStep("issue_done");
    } catch {
      setError("The report could not reach the server. Check your connection and try again.");
    } finally {
      setSubmittingIssue(false);
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h1 style={{ fontSize: 20 }}>Claim your organization&apos;s listing</h1>
      <p style={{ color: "#6B6862", fontSize: 13.5, marginBottom: 16 }}>
        Find your organization to request Rescue Manager access. If it already has an owner or you cannot use its listed email, report the issue for private review.
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
              style={{ border: "1px solid #E7E5E1", borderRadius: 6, padding: 12, marginBottom: 6 }}
            >
              <strong>{org.name}</strong>
              <div style={{ fontSize: 12.5, color: "#6B6862" }}>{[org.city, org.county].filter(Boolean).join(", ")}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 9 }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: org.is_claimed ? "#2F6F4E" : "#6B6862" }}>
                  {org.is_claimed ? "Owner on file" : "Available to claim"}
                </span>
                <button type="button" onClick={() => pickOrg(org)} style={{ padding: "6px 10px", background: "#1E3A5F", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
                  {org.is_claimed ? "Report an issue" : "Continue"}
                </button>
              </div>
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
            <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={12} maxLength={128}
              style={{ width: "100%", padding: 8, border: "1px solid #E7E5E1", borderRadius: 6 }} />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10, color: "#1E3A5F", fontSize: 12.5, fontWeight: 700 }}>
            <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} />
            Show password
          </label>
          <p style={{ padding: 10, background: "#F2D6DC", color: "#1E3A5F", fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>
            Use 12–128 characters with an uppercase letter, lowercase letter, and number.
          </p>
          <p style={{ fontSize: 12, color: "#6B6862", marginBottom: 12 }}>
            We&apos;ll send a verification code to the email address already on file for this organization — not the email you enter above — to confirm you&apos;re affiliated with it.
          </p>
          <button type="submit" style={{ padding: "8px 16px", background: "#1C1B19", color: "#fff", border: "none", borderRadius: 6 }}>
            Request claim
          </button>
          <button type="button" onClick={reportIssue} style={{ padding: "8px 12px", marginLeft: 8, background: "#fff", color: "#1E3A5F", border: "1px solid #1E3A5F", borderRadius: 6 }}>
            Report an issue instead
          </button>
          {error && <p style={{ color: "#B23B2E", fontSize: 13, marginTop: 10 }}>{error}</p>}
        </form>
      )}

      {step === "issue" && selectedOrg && (
        <form onSubmit={submitIssue} noValidate>
          <div style={{ padding: 12, marginBottom: 14, background: "#F2D6DC", color: "#1E3A5F", lineHeight: 1.5 }}>
            <strong>{selectedOrg.is_claimed ? "This organization already has an owner." : "Report a claim or access issue."}</strong>
            <div style={{ fontSize: 12.5, marginTop: 4 }}>
              Reports are reviewed privately. Submitting one does not remove the current owner or grant anyone access automatically.
            </div>
          </div>
          <p style={{ fontSize: 13.5, marginBottom: 12 }}>
            Organization: <strong>{selectedOrg.name}</strong>{" "}
            <button type="button" onClick={() => setStep("search")} style={{ fontSize: 12, marginLeft: 8, background: "none", border: "none", color: "#C05621", cursor: "pointer" }}>
              change
            </button>
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Your full name"><input value={reporterName} onChange={(e) => setReporterName(e.target.value)} required style={inputStyle} /></Field>
            <Field label="Your email"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={inputStyle} /></Field>
            <Field label="Phone (optional)"><input value={reporterPhone} onChange={(e) => setReporterPhone(e.target.value)} type="tel" style={inputStyle} /></Field>
            <Field label="Your relationship to the organization">
              <select value={relationshipToOrg} onChange={(e) => setRelationshipToOrg(e.target.value)} required style={inputStyle}>
                <option value="">Choose one</option><option value="owner">Owner</option><option value="director">Director</option><option value="staff">Staff</option><option value="board_member">Board member</option><option value="authorized_volunteer">Authorized volunteer</option><option value="former_representative">Former representative</option><option value="other">Other</option>
              </select>
            </Field>
          </div>
          <Field label="What is the issue?">
            <select value={issueType} onChange={(e) => setIssueType(e.target.value)} required style={inputStyle}>
              <option value="">Choose one</option><option value="already_claimed">This is my organization, but it is already claimed</option><option value="lost_email_access">I no longer have access to the organization email</option><option value="wrong_owner">The current owner appears to be incorrect</option><option value="organization_details_wrong">The organization information is incorrect</option><option value="other">Something else</option>
            </select>
          </Field>
          <Field label="Previous organization email (if applicable)"><input value={previousOrgEmail} onChange={(e) => setPreviousOrgEmail(e.target.value)} type="email" style={inputStyle} /></Field>
          <Field label="Explain what happened and how you are connected to the organization">
            <textarea value={details} onChange={(e) => setDetails(e.target.value)} required minLength={20} maxLength={5000} rows={5} style={{ ...inputStyle, resize: "vertical" }} />
          </Field>
          <Field label="Evidence link (optional)"><input value={evidenceUrl} onChange={(e) => setEvidenceUrl(e.target.value)} type="url" placeholder="https://…" style={inputStyle} /></Field>
          <button type="submit" disabled={submittingIssue} style={{ padding: "9px 16px", background: "#1E3A5F", color: "#fff", border: "none", borderRadius: 6, opacity: submittingIssue ? 0.65 : 1 }}>
            {submittingIssue ? "Sending report…" : "Send for private review"}
          </button>
          {error && <p role="alert" style={{ color: "#B23B2E", fontSize: 13, marginTop: 10 }}>{error}</p>}
        </form>
      )}

      {step === "issue_done" && (
        <div style={{ padding: 14, background: "#DDF1E8", color: "#1E3A5F", lineHeight: 1.6 }}>
          <strong>Report received.</strong>
          <div style={{ fontSize: 13 }}>{message}</div>
        </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 11 }}>{label}<span style={{ display: "block", marginTop: 4 }}>{children}</span></label>;
}

const inputStyle = { width: "100%", padding: 8, border: "1px solid #D8E1EA", borderRadius: 6, background: "#fff", color: "#17233C" } as const;

export default function ClaimPage() {
  // useSearchParams requires a Suspense boundary in the app router.
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <ClaimPageInner />
    </Suspense>
  );
}
