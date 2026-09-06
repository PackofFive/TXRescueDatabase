"use client";
import { useState } from "react";
import { ORGANIZATION_TYPES, organizationTypeDetails } from "@/lib/organization-types";
export const runtime = "edge";

export default function AdminAddOrganizationPage() {
  const [form, setForm] = useState({
    name: "", orgType: "Animal Rescue", city: "", county: "", state: "TX",
    region: "", species: "", website: "", email: "", phone: "",
    resourceStatus: "Verification Needed",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [createdOrgId, setCreatedOrgId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setStatus(null); setCreatedOrgId(null);
    try {
      const res = await fetch("/api/orgs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          species: form.species.split(",").map(s => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Couldn't create organization.");
      setCreatedOrgId(data.organization.id);
      setStatus(`${data.organization.name} was created successfully.`);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Couldn't create organization.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section style={{ maxWidth: 760 }}>
      <h1 style={{ fontSize: 24, color: "#17233C" }}>Add Organization</h1>
      <p style={{ color: "#6B6862" }}>Create a rescue, shelter, or other organization directly in the Pack of Five directory.</p>

      <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
        <Field label="Organization name *" value={form.name} onChange={v => update("name", v)} required />

        <label style={labelStyle}>
          Organization type
          <select value={form.orgType} onChange={e => update("orgType", e.target.value)} style={inputStyle}>
            {ORGANIZATION_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
          <span style={{fontWeight:400,color:"#6B6862",lineHeight:1.5}}>
            {organizationTypeDetails(form.orgType)?.description}<br/>
            <strong>Best fit:</strong> {organizationTypeDetails(form.orgType)?.portal}. Portal access is still granted separately after approval.
          </span>
        </label>

        <div style={twoCol}>
          <Field label="City" value={form.city} onChange={v => update("city", v)} />
          <Field label="County" value={form.county} onChange={v => update("county", v)} />
        </div>

        <div style={twoCol}>
          <Field label="State" value={form.state} onChange={v => update("state", v)} />
          <Field label="Region" value={form.region} onChange={v => update("region", v)} placeholder="DFW / North Texas" />
        </div>

        <Field label="Species (comma separated)" value={form.species} onChange={v => update("species", v)} placeholder="Dog, Cat, Equine" />
        <Field label="Website" value={form.website} onChange={v => update("website", v)} type="url" />

        <div style={twoCol}>
          <Field label="Public email" value={form.email} onChange={v => update("email", v)} type="email" />
          <Field label="Public phone" value={form.phone} onChange={v => update("phone", v)} />
        </div>

        <label style={labelStyle}>
          Resource status
          <select value={form.resourceStatus} onChange={e => update("resourceStatus", e.target.value)} style={inputStyle}>
            <option>Verification Needed</option>
            <option>Verified</option>
            <option>Needs Review</option>
          </select>
        </label>

        <button type="submit" disabled={saving} style={primaryButton}>
          {saving ? "Creating…" : "Create Organization"}
        </button>
      </form>

      {status && (
        <div style={{ marginTop: 18, padding: 12, border: "1px solid #E7E5E1", borderRadius: 8, background: "#fff" }}>
          {status}
          {createdOrgId && <div style={{ marginTop: 8 }}><a href={`/admin/orgs/${createdOrgId}`}>Open organization editor →</a></div>}
        </div>
      )}
    </section>
  );
}

function Field({ label, value, onChange, type="text", required=false, placeholder }: {
  label: string; value: string; onChange: (value:string)=>void; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <label style={labelStyle}>
      {label}
      <input type={type} value={value} required={required} placeholder={placeholder}
        onChange={e => onChange(e.target.value)} style={inputStyle} />
    </label>
  );
}

const labelStyle = { display:"grid", gap:6, fontSize:13, fontWeight:700 } as const;
const inputStyle = { width:"100%", boxSizing:"border-box", padding:9, border:"1px solid #D8D6D2", borderRadius:7, background:"#fff" } as const;
const twoCol = { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:14 } as const;
const primaryButton = { border:"none", borderRadius:7, padding:"10px 14px", background:"#17233C", color:"#fff", fontWeight:700, cursor:"pointer", width:"fit-content" } as const;
