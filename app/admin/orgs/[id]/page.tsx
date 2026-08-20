"use client";

export const runtime = "edge";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CAPABILITY_FIELDS, CAPABILITY_STATUSES, RESOURCE_STATUS_OPTIONS } from "@/lib/constants";

type OrgRecord = Record<string, unknown>;

const ORG_TEXT_FIELDS = [
  { key: "name", label: "Organization name" },
  { key: "org_type", label: "Organization type" },
  { key: "focus", label: "Focus" },
  { key: "specialty", label: "Specialty" },
  { key: "c3_status", label: "501(c)(3) status" },
  { key: "city", label: "City" },
  { key: "county", label: "County" },
  { key: "state", label: "State" },
  { key: "service_area", label: "Service area" },
  { key: "region", label: "Region" },
  { key: "statewide", label: "Statewide (Yes/No/Unclear)" },
  { key: "intake_status", label: "Current intake status" },
  { key: "intake_restrictions", label: "Intake restrictions" },
  { key: "intake_form_url", label: "Intake form URL" },
  { key: "website", label: "Website" },
  { key: "social_media", label: "Social media" },
  { key: "public_email", label: "Public email" },
  { key: "public_phone", label: "Public phone" },
  { key: "last_verified", label: "Last verified", type: "date" },
  { key: "notes", label: "Notes" },
] as const;

const inputStyle: React.CSSProperties = {
  width: "100%", padding: 8, border: "1px solid #E7E5E1",
  borderRadius: 6, fontSize: 13.5, fontFamily: "inherit",
  color: "#1C1B19", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11.5, textTransform: "uppercase",
  letterSpacing: "0.04em", color: "#6B6862", marginBottom: 4,
};

export default function AdminOrgEditPage() {
  const params = useParams();
  const orgId = params?.id as string;

  const [original, setOriginal] = useState<OrgRecord | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!orgId) return;
    fetch(`/api/admin/orgs/${encodeURIComponent(orgId)}`, { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Failed to load organization.");
        const org = data.organization as OrgRecord;
        setOriginal(org);

        const initial: Record<string, string> = {};
        for (const f of ORG_TEXT_FIELDS) {
          const v = org[f.key];
          initial[f.key] =
            f.key === "last_verified" && v ? String(v).slice(0, 10) :
            v != null ? String(v) : "";
        }
        initial.resource_status = org.resource_status != null ? String(org.resource_status) : "Verification Needed";
        initial.species = Array.isArray(org.species) ? (org.species as string[]).join(", ") : "";
        for (const f of CAPABILITY_FIELDS) initial[f.key] = (org[f.key] as string) || "Unknown";
        setForm(initial);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [orgId]);

  function setField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!original) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    const changes: { table: string; field: string; newValue: string }[] = [];

    for (const f of ORG_TEXT_FIELDS) {
      const originalValue = original[f.key] != null ? String(original[f.key]) : "";
      const compareOriginal = f.key === "last_verified" ? originalValue.slice(0, 10) : originalValue;
      if ((form[f.key] ?? "") !== compareOriginal) {
        changes.push({ table: "organizations", field: f.key, newValue: form[f.key] ?? "" });
      }
    }

    const originalResourceStatus = original.resource_status != null ? String(original.resource_status) : "Verification Needed";
    if ((form.resource_status ?? "") !== originalResourceStatus) {
      changes.push({ table: "organizations", field: "resource_status", newValue: form.resource_status ?? "" });
    }

    const originalSpecies = Array.isArray(original.species) ? (original.species as string[]).join(", ") : "";
    if ((form.species ?? "") !== originalSpecies) {
      changes.push({ table: "organizations", field: "species", newValue: form.species ?? "" });
    }

    for (const f of CAPABILITY_FIELDS) {
      const originalValue = (original[f.key] as string) || "Unknown";
      if ((form[f.key] ?? "Unknown") !== originalValue) {
        changes.push({ table: "capabilities", field: f.key, newValue: form[f.key] ?? "Unknown" });
      }
    }

    if (changes.length === 0) {
      setMessage("No changes to save.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/orgs/${encodeURIComponent(orgId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save changes.");

      setMessage(`Saved ${changes.length} field(s).`);
      setOriginal((prev) => {
        if (!prev) return prev;
        const next = { ...prev };
        for (const c of changes) {
          next[c.field] = c.field === "species"
            ? c.newValue.split(",").map((s) => s.trim()).filter(Boolean)
            : c.newValue;
        }
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (error && !original) return <p style={{ color: "#B23B2E" }}>{error}</p>;
  if (!original) return null;

  return (
    <div style={{ maxWidth: 640 }}>
      <a href="/admin/orgs" style={{ fontSize: 12.5, color: "#C05621", textDecoration: "none" }}>
        ← Back to organization list
      </a>
      <h1 style={{ fontSize: 20, marginTop: 8 }}>{String(original.name)}</h1>
      <p style={{ color: "#6B6862", fontSize: 13.5, marginBottom: 20 }}>
        Editing directly as an admin — changes publish immediately, no review queue.
      </p>

      <form onSubmit={handleSubmit}>
        <h3>Profile</h3>

        {ORG_TEXT_FIELDS.map((f) => (
          <div key={f.key} style={{ marginBottom: 12 }}>
            <label style={labelStyle}>{f.label}</label>
            {f.key === "notes" || f.key === "intake_restrictions" ? (
              <textarea rows={3} value={form[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)} style={inputStyle} />
            ) : (
              <input type={f.type ?? "text"} value={form[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)} style={inputStyle} />
            )}
          </div>
        ))}

        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Species (comma-separated, e.g. Dog, Cat)</label>
          <input value={form.species ?? ""} onChange={(e) => setField("species", e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Resource status</label>
          <select value={form.resource_status ?? "Verification Needed"} onChange={(e) => setField("resource_status", e.target.value)} style={inputStyle}>
            {RESOURCE_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <h3>Capabilities</h3>

        {CAPABILITY_FIELDS.map((f) => (
          <div key={f.key} style={{ marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <label style={{ fontSize: 13, flex: 1 }}>{f.label}</label>
            <select value={form[f.key] ?? "Unknown"} onChange={(e) => setField(f.key, e.target.value)} style={{ ...inputStyle, width: 160 }}>
              {CAPABILITY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}

        <div style={{ marginTop: 20 }}>
          <button type="submit" disabled={saving} style={{ padding: "9px 18px", background: "#1C1B19", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600 }}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          {message && <span style={{ marginLeft: 12, fontSize: 13, color: "#2F6F4E" }}>{message}</span>}
          {error && <span style={{ marginLeft: 12, fontSize: 13, color: "#B23B2E" }}>{error}</span>}
        </div>
      </form>
    </div>
  );
}
