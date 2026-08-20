"use client";

import { useState } from "react";

export const runtime = "edge";

export default function RequestOrganizationPage() {
  const [form, setForm] = useState({
    organizationName: "",
    organizationType: "",
    city: "",
    county: "",
    state: "TX",
    website: "",
    socialUrl: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    description: "",
    relationship: "representative",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    const res = await fetch("/api/org-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(data.error ?? "Couldn't submit request.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section style={{ maxWidth: 700, margin: "30px auto" }}>
        <h1 style={{ color: "#17233C" }}>Request received</h1>
        <p style={{ color: "#6B6862", lineHeight: 1.6 }}>
          Pack of Five will review the organization before it is added to the public directory.
        </p>
        <a href="/">Return to Organizations</a>
      </section>
    );
  }

  return (
    <section style={{ maxWidth: 760, margin: "20px auto" }}>
      <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".08em", color: "#6B6862", margin: 0 }}>
        PACK OF FIVE RESCUE NETWORK
      </p>
      <h1 style={{ fontSize: 30, color: "#17233C", margin: "7px 0 10px" }}>Request an Organization</h1>
      <p style={{ color: "#6B6862", lineHeight: 1.6 }}>
        Rescue, shelter, or animal-welfare organization missing from the directory? Submit it for review.
      </p>

      <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
        <Field label="Organization name *" value={form.organizationName} onChange={(v) => update("organizationName", v)} required />
        <Field label="Organization type" value={form.organizationType} onChange={(v) => update("organizationType", v)} placeholder="Rescue, municipal shelter, sanctuary..." />
        <div style={twoCol}>
          <Field label="City" value={form.city} onChange={(v) => update("city", v)} />
          <Field label="County" value={form.county} onChange={(v) => update("county", v)} />
          <Field label="State" value={form.state} onChange={(v) => update("state", v)} />
        </div>
        <Field label="Website" value={form.website} onChange={(v) => update("website", v)} type="url" />
        <Field label="Social media page" value={form.socialUrl} onChange={(v) => update("socialUrl", v)} type="url" />
        <div style={twoCol}>
          <Field label="Your name" value={form.contactName} onChange={(v) => update("contactName", v)} />
          <Field label="Your email *" value={form.contactEmail} onChange={(v) => update("contactEmail", v)} type="email" required />
          <Field label="Your phone" value={form.contactPhone} onChange={(v) => update("contactPhone", v)} />
        </div>

        <label style={labelStyle}>
          Your relationship to this organization *
          <select value={form.relationship} onChange={(e) => update("relationship", e.target.value)} style={inputStyle}>
            <option value="representative">I represent this organization</option>
            <option value="suggestion">I am suggesting this organization</option>
          </select>
        </label>

        <label style={labelStyle}>
          Additional information
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={5}
            style={inputStyle}
          />
        </label>

        <button type="submit" style={primaryButton}>Submit for Review</button>

        {status && <p role="alert" style={{ color: "#B23B2E" }}>{status}</p>}
      </form>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label style={labelStyle}>
      {label}
      <input type={type} value={value} required={required} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </label>
  );
}

const labelStyle = { display: "grid", gap: 6, fontSize: 13, fontWeight: 700 } as const;
const inputStyle = { width: "100%", boxSizing: "border-box", padding: 9, border: "1px solid #D8D6D2", borderRadius: 7, background: "#fff", fontFamily: "inherit" } as const;
const twoCol = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 } as const;
const primaryButton = { border: "none", borderRadius: 7, padding: "10px 14px", background: "#17233C", color: "#fff", fontWeight: 700, cursor: "pointer", width: "fit-content" } as const;
