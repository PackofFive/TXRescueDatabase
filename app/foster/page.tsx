"use client";

import { useEffect, useMemo, useState } from "react";

type AuthUser = { email?: string; availablePortals?: string[] };
type FosterRelationship = { id: string; organization_id: string; organization_name: string; organization_city?: string | null; organization_county?: string | null; status: string; access_level?: string | null };
type VolunteerCategory = { category: string; status: string; permissionLevel?: string | null };
type VolunteerRelationship = { id: string; organization_id: string; organization_name: string; organization_city?: string | null; organization_county?: string | null; status: string; portal_access_level?: string | null; capacity_status?: string | null; verified_weekly_hours?: number | null; categories?: VolunteerCategory[] };
type RescueAccess = { organizationId: string; organizationName: string; location: string; portalLevel: string; capacityStatus: string; categories: string[] };

const COLORS = { navy: "#1E3A5F", coral: "#E85C56", mint: "#DCF0E8", muted: "#4A5D75", border: "#DCE4EC", white: "#FFFFFF", page: "#FFFDFC" };
const CATEGORY_LABELS: Record<string, string> = {
  foster_care: "Foster Care", transport: "Transport", shelter_visits: "Shelter Visits",
  events_outreach: "Events & Outreach", photography_media: "Photography & Media",
  fundraising_donations: "Fundraising & Donations", administrative_help: "Administrative Help",
  medical_support: "Medical Support", volunteer_coordination: "Volunteer Coordination",
};

function titleCase(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function formatCategory(value: string) { return CATEGORY_LABELS[value] ?? titleCase(value); }
function formatLocation(city?: string | null, county?: string | null) { return [city, county].filter(Boolean).join(" · "); }

export default function VolunteerPortalPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [fosterRelationships, setFosterRelationships] = useState<FosterRelationship[]>([]);
  const [volunteerRelationships, setVolunteerRelationships] = useState<VolunteerRelationship[]>([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/auth/me", { cache: "no-store" }), fetch("/api/foster/relationships", { cache: "no-store" })])
      .then(async ([authResponse, relationshipResponse]) => {
        const authData = await authResponse.json();
        setUser(authData.user ?? null);
        if (relationshipResponse.status === 401) return;
        const relationshipData = await relationshipResponse.json();
        if (!relationshipResponse.ok) throw new Error(relationshipData.error ?? "Couldn't load your rescue relationships.");
        setFosterRelationships(relationshipData.relationships ?? []);
        setVolunteerRelationships(relationshipData.volunteerRelationships ?? []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Couldn't load the Volunteer Portal."))
      .finally(() => setLoading(false));
  }, []);

  const rescueAccess = useMemo<RescueAccess[]>(() => {
    const rescues = new Map<string, RescueAccess>();
    for (const relationship of volunteerRelationships) {
      if (relationship.status !== "approved") continue;
      rescues.set(relationship.organization_id, {
        organizationId: relationship.organization_id, organizationName: relationship.organization_name,
        location: formatLocation(relationship.organization_city, relationship.organization_county),
        portalLevel: relationship.portal_access_level ?? "viewer", capacityStatus: relationship.capacity_status ?? "available",
        categories: (relationship.categories ?? []).filter((category) => category.status === "approved").map((category) => formatCategory(category.category)),
      });
    }
    for (const relationship of fosterRelationships) {
      if (relationship.status !== "approved") continue;
      const existing = rescues.get(relationship.organization_id);
      if (existing) {
        if (!existing.categories.includes("Foster Care")) existing.categories.unshift("Foster Care");
      } else {
        rescues.set(relationship.organization_id, {
          organizationId: relationship.organization_id, organizationName: relationship.organization_name,
          location: formatLocation(relationship.organization_city, relationship.organization_county),
          portalLevel: relationship.access_level ?? "viewer", capacityStatus: "available", categories: ["Foster Care"],
        });
      }
    }
    return Array.from(rescues.values()).sort((a, b) => a.organizationName.localeCompare(b.organizationName));
  }, [fosterRelationships, volunteerRelationships]);

  const visibleRescues = selectedOrganizationId === "all" ? rescueAccess : rescueAccess.filter((rescue) => rescue.organizationId === selectedOrganizationId);

  if (loading) return <Page><p style={{ color: COLORS.muted }}>Loading your Volunteer Portal…</p></Page>;
  if (!user) return <Page><Intro /><Panel><h2 style={panelHeading}>Sign in to continue</h2><p style={bodyText}>Use one account for every rescue or shelter you help. Each organization controls only its own relationship, categories, and permissions.</p><a href="/login?portal=foster" style={primaryLink}>Volunteer Sign In</a></Panel></Page>;

  return (
    <Page>
      <Intro />
      {error ? <div style={errorPanel}>{error}</div> : null}
      {rescueAccess.length === 0 ? (
        <Panel><h2 style={panelHeading}>No approved rescue relationships yet</h2><p style={bodyText}>When a rescue approves you for Foster Care, Transport, Shelter Visits, or another volunteer category, it will appear here automatically.</p><a href="/foster/relationships" style={primaryLink}>View Rescue Relationships</a></Panel>
      ) : (
        <>
          <section style={selectorPanel}>
            <label htmlFor="rescue-selector" style={labelStyle}>Working with</label>
            <select id="rescue-selector" value={selectedOrganizationId} onChange={(event) => setSelectedOrganizationId(event.target.value)} style={selectStyle}>
              <option value="all">All My Rescues</option>
              {rescueAccess.map((rescue) => <option key={rescue.organizationId} value={rescue.organizationId}>{rescue.organizationName}</option>)}
            </select>
            <p style={{ ...bodyText, marginBottom: 0 }}>Your access is kept separate for every organization. Selecting a rescue makes it clear whose animals, assignments, and information you are viewing.</p>
          </section>
          <div style={statsGrid}>
            <Stat value={String(rescueAccess.length)} label={rescueAccess.length === 1 ? "Approved Rescue" : "Approved Rescues"} />
            <Stat value={String(new Set(rescueAccess.flatMap((rescue) => rescue.categories)).size)} label="Approved Categories" />
            <Stat value={user.email ?? "Signed in"} label="Volunteer Account" small />
          </div>
          <section>
            <h2 style={{ color: COLORS.navy, margin: "24px 0 12px", fontSize: 21 }}>My Rescue Access</h2>
            <div style={cardGrid}>
              {visibleRescues.map((rescue) => (
                <article key={rescue.organizationId} style={rescueCard}>
                  <div><h3 style={{ margin: 0, color: COLORS.navy, fontSize: 18 }}>{rescue.organizationName}</h3>{rescue.location ? <p style={{ ...bodyText, margin: "5px 0 0" }}>{rescue.location}</p> : null}</div>
                  <div style={badgeRow}><span style={badge}>{titleCase(rescue.portalLevel)} access</span><span style={capacityBadge}>{titleCase(rescue.capacityStatus)}</span></div>
                  <div><strong style={{ color: COLORS.navy, fontSize: 13 }}>Approved to help with</strong><div style={categoryList}>{rescue.categories.length > 0 ? rescue.categories.map((category) => <span key={category} style={categoryBadge}>{category}</span>) : <span style={{ color: COLORS.muted, fontSize: 13 }}>No service categories approved yet.</span>}</div></div>
                </article>
              ))}
            </div>
          </section>
          <Panel><h2 style={panelHeading}>Your capacity stays private and flexible</h2><p style={bodyText}>Each rescue sees only the information needed to make safe assignments. Capacity is guidance—not a one-size-fits-all limit—and rescues should confirm availability before adding responsibilities.</p><a href="/foster/relationships" style={secondaryLink}>Manage Rescue Relationships</a></Panel>
        </>
      )}
    </Page>
  );
}

function Intro() {
  return <header><p style={{ margin: "0 0 7px", color: COLORS.coral, fontSize: 12, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>Pack of Five</p><h1 style={{ margin: 0, color: COLORS.navy, fontSize: 34, lineHeight: 1.1, letterSpacing: "-.025em" }}>Volunteer Portal</h1><p style={{ ...bodyText, margin: "10px 0 0", maxWidth: 760 }}>One simple place for Foster Care, Transport, Shelter Visits, and every other way you help—across all of your approved rescues.</p></header>;
}
function Page({ children }: { children: React.ReactNode }) { return <main style={{ minHeight: "100vh", background: COLORS.page, padding: "30px 20px", boxSizing: "border-box" }}><section style={{ width: "100%", maxWidth: 1050, margin: "0 auto" }}>{children}</section></main>; }
function Panel({ children }: { children: React.ReactNode }) { return <section style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, padding: 20, marginTop: 20 }}>{children}</section>; }
function Stat({ value, label, small = false }: { value: string; label: string; small?: boolean }) { return <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, padding: 16, minWidth: 0 }}><strong style={{ display: "block", color: COLORS.navy, fontSize: small ? 15 : 27, overflowWrap: "anywhere" }}>{value}</strong><span style={{ display: "block", color: COLORS.muted, fontSize: 13, marginTop: 5 }}>{label}</span></div>; }

const bodyText: React.CSSProperties = { color: COLORS.muted, fontSize: 14, lineHeight: 1.55 };
const panelHeading: React.CSSProperties = { margin: "0 0 7px", color: COLORS.navy, fontSize: 18 };
const selectorPanel: React.CSSProperties = { background: COLORS.mint, border: `1px solid ${COLORS.border}`, padding: 18, marginTop: 22 };
const labelStyle: React.CSSProperties = { display: "block", color: COLORS.navy, fontWeight: 800, fontSize: 13, marginBottom: 7 };
const selectStyle: React.CSSProperties = { width: "100%", maxWidth: 430, padding: "11px 12px", border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.navy, fontSize: 14 };
const statsGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 16 };
const cardGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 };
const rescueCard: React.CSSProperties = { background: COLORS.white, border: `1px solid ${COLORS.border}`, padding: 18, display: "grid", gap: 15 };
const badgeRow: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 7 };
const badge: React.CSSProperties = { background: COLORS.navy, color: COLORS.white, borderRadius: 999, padding: "5px 9px", fontSize: 11, fontWeight: 800 };
const capacityBadge: React.CSSProperties = { background: COLORS.mint, color: COLORS.navy, borderRadius: 999, padding: "5px 9px", fontSize: 11, fontWeight: 800 };
const categoryList: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 7, marginTop: 9 };
const categoryBadge: React.CSSProperties = { border: `1px solid ${COLORS.border}`, color: COLORS.navy, padding: "6px 9px", fontSize: 12, fontWeight: 700 };
const primaryLink: React.CSSProperties = { display: "inline-block", background: COLORS.navy, color: COLORS.white, padding: "10px 14px", textDecoration: "none", fontWeight: 800, fontSize: 13 };
const secondaryLink: React.CSSProperties = { display: "inline-block", color: COLORS.navy, fontWeight: 800, fontSize: 13 };
const errorPanel: React.CSSProperties = { background: "#FCE9E7", border: "1px solid #E9B9B4", color: "#A9362B", padding: 14, marginTop: 18 };
