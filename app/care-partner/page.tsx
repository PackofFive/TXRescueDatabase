import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const COLORS = { navy: "#1E3A5F", coral: "#E85C56", blue: "#E6EEF7", muted: "#4A5D75", border: "#DCE4EC", white: "#FFFFFF" };

export default async function CarePartnerPage() {
  const session = await getSession();
  if (!session?.orgId) redirect("/account");
  const rows = await sql`
    select name, care_partner_category, care_partner_services, care_partner_review_status, care_partner_reviewed_at
    from organizations
    where id = ${session.orgId}::uuid
      and archived_at is null
    limit 1
  `;
  const organization = rows[0];
  if (!organization) redirect("/account");

  return <section style={{ maxWidth: 900, margin: "0 auto", padding: "8px 0 44px" }}>
    <p style={{ margin: "0 0 7px", color: COLORS.coral, fontSize: 11.5, fontWeight: 800, letterSpacing: ".1em" }}>CARE PARTNER PORTAL</p>
    <h1 style={{ margin: 0, color: COLORS.navy, fontSize: "clamp(30px, 5vw, 44px)" }}>{String(organization.name)}</h1>
    <p style={{ maxWidth: 700, color: COLORS.muted, lineHeight: 1.6 }}>A permission-based workspace for professional animal-care collaboration.</p>

    <div style={{ marginTop: 20, padding: 18, background: COLORS.blue, border: `1px solid ${COLORS.border}` }}>
      <strong style={{ color: COLORS.navy }}>Verified Care Partner</strong>
      <p style={{ margin: "7px 0 0", color: COLORS.muted, fontSize: 13.5, lineHeight: 1.55 }}>{String(organization.care_partner_category ?? "Professional care provider")}<br/>{String(organization.care_partner_services ?? "Service information is being reviewed.")}</p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 18 }}>
      <article style={{ padding: 18, background: COLORS.white, border: `1px solid ${COLORS.border}` }}><h2 style={{ margin: "0 0 7px", color: COLORS.navy, fontSize: 18 }}>Organization relationships</h2><p style={{ margin: "0 0 12px", color: COLORS.muted, fontSize: 13, lineHeight: 1.55 }}>No rescue, shelter, or pet-owner records are shared automatically. Each organization must intentionally approve a relationship and its permissions.</p><a href="/care-partner/relationships" style={{ color: COLORS.coral, fontSize: 13, fontWeight: 800, textDecoration: "none" }}>Manage relationships →</a></article>
      <article style={{ padding: 18, background: COLORS.white, border: `1px solid ${COLORS.border}` }}><h2 style={{ margin: "0 0 7px", color: COLORS.navy, fontSize: 18 }}>Assigned work</h2><p style={{ margin: "0 0 12px", color: COLORS.muted, fontSize: 13, lineHeight: 1.55 }}>Animals appear only after an authorized organization creates a time-limited assignment and chooses exact permissions.</p><a href="/care-partner/assignments" style={{ color: COLORS.coral, fontSize: 13, fontWeight: 800, textDecoration: "none" }}>View assigned work →</a></article>
    </div>

    <p style={{ marginTop: 18, color: COLORS.muted, fontSize: 12.5, lineHeight: 1.55 }}>Organization relationships alone reveal no animals. Each animal assignment is separately authorized, scoped, time-limited, and recorded.</p>
  </section>;
}
