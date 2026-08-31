"use client";

import { useEffect, useState } from "react";

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

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
};

export default function OrganizationProfilePage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/org-profile", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Couldn't load the organization profile.");
        setOrganization(data.organization ?? null);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Couldn't load the organization profile."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: COLORS.muted }}>Loading organization profile…</p>;
  if (error || !organization) return <div style={errorStyle}>{error || "Organization profile not found."}</div>;

  const location = [organization.city, organization.county, organization.state].filter(Boolean).join(" · ");

  return (
    <div>
      <p style={eyebrowStyle}>ORGANIZATION</p>
      <h1 style={headingStyle}>{organization.name}</h1>
      <p style={introStyle}>
        This is the rescue or shelter’s organization profile. It is separate
        from every staff member’s personal account and from volunteer and pet
        owner profiles.
      </p>

      <section style={noticeStyle}>
        <strong style={{ color: COLORS.navy }}>Profile editing is protected.</strong>
        <span style={{ color: COLORS.muted }}>
          Editing will be enabled only for the Organization Owner and other
          explicitly authorized high-level administrators.
        </span>
      </section>

      <div style={gridStyle}>
        <ProfileSection title="Organization identity">
          <Field label="Organization name" value={organization.name} />
          <Field label="Organization type" value={organization.org_type} />
          <Field label="501(c)(3) status" value={organization.c3_status} />
          <Field label="Resource status" value={organization.resource_status} />
        </ProfileSection>

        <ProfileSection title="Location and service area">
          <Field label="Location" value={location} />
          <Field label="Region" value={organization.region} />
          <Field label="Service area" value={organization.service_area} />
          <Field label="Statewide" value={organization.statewide} />
        </ProfileSection>

        <ProfileSection title="Animals and services">
          <Field label="Species" value={organization.species?.join(", ")} />
          <Field label="Focus" value={organization.focus} />
          <Field label="Specialty" value={organization.specialty} />
        </ProfileSection>

        <ProfileSection title="Intake information">
          <Field label="Intake status" value={organization.intake_status} />
          <Field label="Intake restrictions" value={organization.intake_restrictions} />
          <LinkField label="Intake form" value={organization.intake_form_url} />
        </ProfileSection>

        <ProfileSection title="Public contact information">
          <Field label="Public email" value={organization.public_email} />
          <Field label="Public phone" value={organization.public_phone} />
          <LinkField label="Website" value={organization.website} />
          <LinkField label="Social media" value={organization.social_media} />
        </ProfileSection>

        <ProfileSection title="Verification">
          <Field label="Last verified" value={formatDate(organization.last_verified)} />
          <Field label="Profile last updated" value={formatDate(organization.updated_at)} />
        </ProfileSection>
      </div>
    </div>
  );
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section style={sectionStyle}><h2 style={sectionHeadingStyle}>{title}</h2>{children}</section>;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return <div style={fieldStyle}><span style={labelStyle}>{label}</span><strong style={valueStyle}>{value?.trim() || "Not provided"}</strong></div>;
}

function LinkField({ label, value }: { label: string; value?: string | null }) {
  const href = safeUrl(value);
  return <div style={fieldStyle}><span style={labelStyle}>{label}</span>{href ? <a href={href} target="_blank" rel="noreferrer" style={linkStyle}>{value}</a> : <strong style={valueStyle}>Not provided</strong>}</div>;
}

function safeUrl(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

const eyebrowStyle: React.CSSProperties = { margin: "0 0 8px", color: COLORS.coral, fontSize: 12, fontWeight: 800, letterSpacing: ".1em" };
const headingStyle: React.CSSProperties = { margin: "0 0 10px", color: COLORS.navy, fontSize: 36, lineHeight: 1.1 };
const introStyle: React.CSSProperties = { margin: 0, maxWidth: 760, color: COLORS.muted, fontSize: 15, lineHeight: 1.6 };
const noticeStyle: React.CSSProperties = { display: "grid", gap: 5, marginTop: 22, padding: 17, border: `1px solid ${COLORS.border}`, background: COLORS.mint, fontSize: 13, lineHeight: 1.5 };
const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14, marginTop: 18 };
const sectionStyle: React.CSSProperties = { padding: 20, border: `1px solid ${COLORS.border}`, background: COLORS.white };
const sectionHeadingStyle: React.CSSProperties = { margin: "0 0 10px", color: COLORS.navy, fontSize: 19 };
const fieldStyle: React.CSSProperties = { display: "grid", gap: 4, padding: "11px 0", borderTop: `1px solid ${COLORS.border}` };
const labelStyle: React.CSSProperties = { color: COLORS.muted, fontSize: 12, fontWeight: 700 };
const valueStyle: React.CSSProperties = { color: COLORS.navy, fontSize: 14, overflowWrap: "anywhere" };
const linkStyle: React.CSSProperties = { color: COLORS.navy, fontSize: 14, fontWeight: 800, overflowWrap: "anywhere" };
const errorStyle: React.CSSProperties = { padding: 16, color: "#A9362B", border: "1px solid #E9B9B4", background: "#FCE9E7" };
