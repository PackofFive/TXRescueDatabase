"use client";

import { useEffect, useMemo, useState } from "react";

type Organization = {
  id: string;
  name: string;
  org_type?: string | null;
  species?: string[] | null;
  focus?: string | null;
  specialty?: string | null;
  c3_status?: string | null;
  city?: string | null;
  county?: string | null;
  state?: string | null;
  service_area?: string | null;
  region?: string | null;
  statewide?: string | null;
  intake_status?: string | null;
  intake_restrictions?: string | null;
  intake_form_url?: string | null;
  website?: string | null;
  social_media?: string | null;
  public_email?: string | null;
  public_phone?: string | null;
  resource_status?: string | null;
  last_verified?: string | null;
  updated_at?: string | null;
};

type Access = {
  level: string | null;
  canEditOrganizationProfile: boolean;
  canManageOrganizationAccess: boolean;
};

type EditableKey =
  | "name" | "org_type" | "focus" | "specialty" | "c3_status"
  | "city" | "county" | "state" | "service_area" | "region"
  | "statewide" | "intake_status" | "intake_restrictions"
  | "intake_form_url" | "website" | "social_media"
  | "public_email" | "public_phone";

type FieldDefinition = {
  key: EditableKey;
  label: string;
  section: string;
  multiline?: boolean;
  reviewRequired?: boolean;
};

const FIELDS: FieldDefinition[] = [
  { key: "name", label: "Organization name", section: "Organization identity" },
  { key: "org_type", label: "Organization type", section: "Organization identity" },
  { key: "c3_status", label: "501(c)(3) status", section: "Organization identity", reviewRequired: true },
  { key: "city", label: "City", section: "Location and service area" },
  { key: "county", label: "County", section: "Location and service area" },
  { key: "state", label: "State", section: "Location and service area" },
  { key: "region", label: "Region", section: "Location and service area" },
  { key: "service_area", label: "Service area", section: "Location and service area", multiline: true },
  { key: "statewide", label: "Statewide", section: "Location and service area" },
  { key: "focus", label: "Focus", section: "Animals and services", multiline: true },
  { key: "specialty", label: "Specialty", section: "Animals and services", multiline: true },
  { key: "intake_status", label: "Intake status", section: "Intake information", reviewRequired: true },
  { key: "intake_restrictions", label: "Intake restrictions", section: "Intake information", multiline: true, reviewRequired: true },
  { key: "intake_form_url", label: "Intake form", section: "Intake information", reviewRequired: true },
  { key: "public_email", label: "Public email", section: "Public contact information" },
  { key: "public_phone", label: "Public phone", section: "Public contact information" },
  { key: "website", label: "Website", section: "Public contact information" },
  { key: "social_media", label: "Social media", section: "Public contact information" },
];

const COLORS = { navy: "#1E3A5F", coral: "#E85C56", mint: "#DCF0E8", muted: "#4A5D75", border: "#DCE4EC", white: "#FFFFFF" };

function emptyForm(): Record<EditableKey, string> {
  return Object.fromEntries(FIELDS.map((field) => [field.key, ""])) as Record<EditableKey, string>;
}

export default function OrganizationProfilePage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [access, setAccess] = useState<Access | null>(null);
  const [form, setForm] = useState<Record<EditableKey, string>>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function loadProfile() {
    setLoading(true);
    fetch("/api/org-profile", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Couldn't load the organization profile.");
        const nextOrganization = data.organization as Organization;
        setOrganization(nextOrganization);
        setAccess(data.access ?? null);
        setForm(Object.fromEntries(FIELDS.map((field) => [field.key, String(nextOrganization[field.key] ?? "")])) as Record<EditableKey, string>);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Couldn't load the organization profile."))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadProfile(); }, []);

  const changes = useMemo(() => {
    if (!organization) return [];
    return FIELDS.filter((field) => form[field.key].trim() !== String(organization[field.key] ?? "").trim())
      .map((field) => ({ table: "organizations", field: field.key, label: field.label, newValue: form[field.key].trim() }));
  }, [form, organization]);

  async function saveProfile() {
    if (!organization || changes.length === 0) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId: organization.id, changes }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't save the organization profile.");
      const published = data.published ?? [];
      const queued = data.queued ?? [];
      const parts = [];
      if (published.length) parts.push(`${published.length} change${published.length === 1 ? " was" : "s were"} published.`);
      if (queued.length) parts.push(`${queued.length} sensitive change${queued.length === 1 ? " was" : "s were"} sent for review.`);
      setMessage(parts.join(" ") || "No changes were needed.");
      setEditing(false);
      loadProfile();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn't save the organization profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading && !organization) return <p style={{ color: COLORS.muted }}>Loading organization profile…</p>;
  if (error && !organization) return <div style={errorStyle}>{error}</div>;
  if (!organization) return <div style={errorStyle}>Organization profile not found.</div>;

  const sections = Array.from(new Set(FIELDS.map((field) => field.section)));
  const accessLabel = formatAccess(access?.level);

  return (
    <div>
      <p style={eyebrowStyle}>ORGANIZATION</p>
      <div style={headingRowStyle}>
        <div><h1 style={headingStyle}>{organization.name}</h1><p style={introStyle}>This rescue or shelter profile is separate from every staff member’s personal account.</p></div>
        {access?.canEditOrganizationProfile && !editing ? <button type="button" onClick={() => { setEditing(true); setMessage(""); }} style={primaryButtonStyle}>Edit Organization Profile</button> : null}
      </div>

      <section style={noticeStyle}>
        <strong style={{ color: COLORS.navy }}>Your access: {accessLabel}</strong>
        <span style={{ color: COLORS.muted }}>
          {access?.canEditOrganizationProfile
            ? "You may update this profile. Sensitive intake and verification information is sent for review before publication."
            : "This profile is read-only for your access level. Only the Organization Owner or an Administrator may edit it."}
        </span>
      </section>

      {message ? <div style={successStyle}>{message}</div> : null}
      {error ? <div style={errorStyle}>{error}</div> : null}

      {editing ? (
        <section style={editPanelStyle}>
          <h2 style={sectionHeadingStyle}>Edit organization profile</h2>
          <p style={introStyle}>Review every change before saving. Fields marked “Review required” will not change publicly until approved.</p>
          {sections.map((section) => (
            <fieldset key={section} style={fieldsetStyle}>
              <legend style={legendStyle}>{section}</legend>
              <div style={formGridStyle}>
                {FIELDS.filter((field) => field.section === section).map((field) => (
                  <label key={field.key} style={inputLabelStyle}>
                    <span>{field.label}{field.reviewRequired ? <em style={reviewTagStyle}>Review required</em> : null}</span>
                    {field.multiline ? (
                      <textarea value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} rows={3} style={inputStyle} />
                    ) : (
                      <input value={form[field.key]} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))} style={inputStyle} />
                    )}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <div style={buttonRowStyle}>
            <button type="button" onClick={saveProfile} disabled={saving || changes.length === 0} style={{ ...primaryButtonStyle, opacity: saving || changes.length === 0 ? 0.55 : 1 }}>{saving ? "Saving…" : `Save ${changes.length} Change${changes.length === 1 ? "" : "s"}`}</button>
            <button type="button" onClick={() => { setEditing(false); setError(""); setForm(Object.fromEntries(FIELDS.map((field) => [field.key, String(organization[field.key] ?? "")])) as Record<EditableKey, string>); }} disabled={saving} style={secondaryButtonStyle}>Cancel</button>
          </div>
        </section>
      ) : (
        <div style={gridStyle}>
          <ProfileSection title="Organization identity"><Field label="Organization name" value={organization.name} /><Field label="Organization type" value={organization.org_type} /><Field label="501(c)(3) status" value={organization.c3_status} /><Field label="Resource status" value={organization.resource_status} /></ProfileSection>
          <ProfileSection title="Location and service area"><Field label="Location" value={[organization.city, organization.county, organization.state].filter(Boolean).join(" · ")} /><Field label="Region" value={organization.region} /><Field label="Service area" value={organization.service_area} /><Field label="Statewide" value={organization.statewide} /></ProfileSection>
          <ProfileSection title="Animals and services"><Field label="Species" value={organization.species?.join(", ")} /><Field label="Focus" value={organization.focus} /><Field label="Specialty" value={organization.specialty} /></ProfileSection>
          <ProfileSection title="Intake information"><Field label="Intake status" value={organization.intake_status} /><Field label="Intake restrictions" value={organization.intake_restrictions} /><LinkField label="Intake form" value={organization.intake_form_url} /></ProfileSection>
          <ProfileSection title="Public contact information"><Field label="Public email" value={organization.public_email} /><Field label="Public phone" value={organization.public_phone} /><LinkField label="Website" value={organization.website} /><LinkField label="Social media" value={organization.social_media} /></ProfileSection>
          <ProfileSection title="Verification"><Field label="Last verified" value={formatDate(organization.last_verified)} /><Field label="Profile last updated" value={formatDate(organization.updated_at)} /></ProfileSection>
        </div>
      )}
    </div>
  );
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) { return <section style={sectionStyle}><h2 style={sectionHeadingStyle}>{title}</h2>{children}</section>; }
function Field({ label, value }: { label: string; value?: string | null }) { return <div style={fieldStyle}><span style={fieldLabelStyle}>{label}</span><strong style={valueStyle}>{value?.trim() || "Not provided"}</strong></div>; }
function LinkField({ label, value }: { label: string; value?: string | null }) { const href = safeUrl(value); return <div style={fieldStyle}><span style={fieldLabelStyle}>{label}</span>{href ? <a href={href} target="_blank" rel="noreferrer" style={linkStyle}>{value}</a> : <strong style={valueStyle}>Not provided</strong>}</div>; }
function safeUrl(value?: string | null) { if (!value?.trim()) return null; return /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`; }
function formatDate(value?: string | null) { if (!value) return null; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(); }
function formatAccess(value?: string | null) { if (!value) return "No active organization membership"; if (value === "platform_admin") return "Platform Administrator"; return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }

const eyebrowStyle: React.CSSProperties = { margin: "0 0 8px", color: COLORS.coral, fontSize: 12, fontWeight: 800, letterSpacing: ".1em" };
const headingRowStyle: React.CSSProperties = { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 18, flexWrap: "wrap" };
const headingStyle: React.CSSProperties = { margin: "0 0 10px", color: COLORS.navy, fontSize: 36, lineHeight: 1.1 };
const introStyle: React.CSSProperties = { margin: 0, maxWidth: 760, color: COLORS.muted, fontSize: 14, lineHeight: 1.6 };
const noticeStyle: React.CSSProperties = { display: "grid", gap: 5, marginTop: 22, padding: 17, border: `1px solid ${COLORS.border}`, background: COLORS.mint, fontSize: 13, lineHeight: 1.5 };
const successStyle: React.CSSProperties = { marginTop: 16, padding: 14, color: COLORS.navy, border: `1px solid ${COLORS.border}`, background: COLORS.mint, fontWeight: 700 };
const errorStyle: React.CSSProperties = { marginTop: 16, padding: 14, color: "#A9362B", border: "1px solid #E9B9B4", background: "#FCE9E7" };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14, marginTop: 18 };
const sectionStyle: React.CSSProperties = { padding: 20, border: `1px solid ${COLORS.border}`, background: COLORS.white };
const sectionHeadingStyle: React.CSSProperties = { margin: "0 0 10px", color: COLORS.navy, fontSize: 19 };
const fieldStyle: React.CSSProperties = { display: "grid", gap: 4, padding: "11px 0", borderTop: `1px solid ${COLORS.border}` };
const fieldLabelStyle: React.CSSProperties = { color: COLORS.muted, fontSize: 12, fontWeight: 700 };
const valueStyle: React.CSSProperties = { color: COLORS.navy, fontSize: 14, overflowWrap: "anywhere" };
const linkStyle: React.CSSProperties = { color: COLORS.navy, fontSize: 14, fontWeight: 800, overflowWrap: "anywhere" };
const primaryButtonStyle: React.CSSProperties = { border: 0, background: COLORS.navy, color: COLORS.white, padding: "11px 15px", fontWeight: 800, fontSize: 13, cursor: "pointer" };
const secondaryButtonStyle: React.CSSProperties = { border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.navy, padding: "10px 15px", fontWeight: 800, fontSize: 13, cursor: "pointer" };
const editPanelStyle: React.CSSProperties = { marginTop: 18, padding: 20, border: `1px solid ${COLORS.border}`, background: COLORS.white };
const fieldsetStyle: React.CSSProperties = { margin: "20px 0 0", padding: 0, border: 0 };
const legendStyle: React.CSSProperties = { width: "100%", paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}`, color: COLORS.navy, fontSize: 16, fontWeight: 800 };
const formGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginTop: 14 };
const inputLabelStyle: React.CSSProperties = { display: "grid", alignContent: "start", gap: 7, color: COLORS.navy, fontSize: 13, fontWeight: 750 };
const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", border: `1px solid ${COLORS.border}`, padding: "10px 11px", color: COLORS.navy, background: COLORS.white, font: "inherit" };
const reviewTagStyle: React.CSSProperties = { display: "inline-block", marginLeft: 7, color: "#A45C00", fontSize: 10, fontStyle: "normal", fontWeight: 800 };
const buttonRowStyle: React.CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 };
