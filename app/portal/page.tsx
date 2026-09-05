"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type CategoryApproval = { category: string; status: string; permissionLevel: string };
type Volunteer = {
  id: string; full_name: string; email: string; phone: string | null;
  status: string; role_title: string | null; skills: string[];
  availability_notes: string | null; background_check_status: string;
  portal_access_level: string; verified_weekly_hours: number | null;
  capacity_status: string; availability_status: string;
  pause_new_assignments: boolean; weekly_hours_capacity: number | null;
  category_approvals: CategoryApproval[];
};
type Draft = {
  status: string; portalAccessLevel: string; capacityStatus: string;
  verifiedWeeklyHours: string; categories: Record<string, CategoryApproval>;
};

const C = { navy: "#1E3A5F", coral: "#E85C56", mint: "#DCF0E8", peach: "#FBE3DA", muted: "#4A5D75", border: "#DCE4EC", white: "#FFFFFF" };
const CATEGORIES = [
  ["foster_care", "Foster Care"], ["transport", "Transport"],
  ["shelter_visits", "Shelter Visits"], ["events_outreach", "Events & Outreach"],
  ["photography_media", "Photography & Media"], ["fundraising_donations", "Fundraising & Donations"],
  ["administrative_help", "Administrative Help"], ["medical_support", "Medical Support"],
  ["volunteer_coordination", "Volunteer Coordination"],
] as const;
const ACCESS_EXPLANATIONS = {
  none: "No Volunteer Portal access. This is the safe default.",
  viewer: "Can view information specifically shared with them.",
  contributor: "Can complete assignments and submit permitted updates.",
  coordinator: "Can coordinate approved volunteer categories. Cannot edit the organization.",
};

function createDraft(volunteer: Volunteer): Draft {
  return {
    status: volunteer.status,
    portalAccessLevel: volunteer.portal_access_level ?? "none",
    capacityStatus: volunteer.capacity_status ?? "review_required",
    verifiedWeeklyHours: volunteer.verified_weekly_hours == null ? "" : String(volunteer.verified_weekly_hours),
    categories: Object.fromEntries((volunteer.category_approvals ?? []).map((item) => [item.category, item])),
  };
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); const [roleTitle, setRoleTitle] = useState("");
  const [skills, setSkills] = useState(""); const [availability, setAvailability] = useState("");

  async function load() {
    setLoading(true); setError(null);
    try {
      const response = await fetch("/api/volunteers", { cache: "no-store" });
      const data = await response.json();
      if (response.status === 401) { window.location.href = "/login?portal=organization"; return; }
      if (!response.ok) throw new Error(data.error ?? "Couldn't load volunteers.");
      const next: Volunteer[] = data.volunteers ?? [];
      setVolunteers(next);
      setDrafts(Object.fromEntries(next.map((item) => [item.id, createDraft(item)])));
    } catch (err) { setError(err instanceof Error ? err.message : "Couldn't load volunteers."); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  const counts = useMemo(() => ({
    total: volunteers.length,
    pending: volunteers.filter((item) => item.status === "pending").length,
    approved: volunteers.filter((item) => item.status === "approved").length,
    portal: volunteers.filter((item) => item.portal_access_level !== "none").length,
  }), [volunteers]);

  async function addVolunteer(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError(null); setSuccess(null);
    try {
      const response = await fetch("/api/volunteers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, email, phone, roleTitle,
          skills: skills.split(",").map((item) => item.trim()).filter(Boolean), availabilityNotes: availability }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't add the volunteer.");
      setName(""); setEmail(""); setPhone(""); setRoleTitle(""); setSkills(""); setAvailability("");
      setSuccess("Volunteer added as pending with no portal or foster access."); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Couldn't add the volunteer."); }
    finally { setSaving(false); }
  }

  function updateDraft(id: string, change: Partial<Draft>) {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], ...change } }));
  }
  function updateCategory(id: string, category: string, change: Partial<CategoryApproval>) {
    const draft = drafts[id];
    const current = draft.categories[category] ?? { category, status: "pending", permissionLevel: "view" };
    updateDraft(id, { categories: { ...draft.categories, [category]: { ...current, ...change } } });
  }

  async function saveVolunteer(volunteer: Volunteer) {
    const draft = drafts[volunteer.id]; setWorkingId(volunteer.id); setError(null); setSuccess(null);
    try {
      const response = await fetch("/api/volunteers", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relationshipId: volunteer.id, status: draft.status,
          portalAccessLevel: draft.status === "approved" ? draft.portalAccessLevel : "none",
          capacityStatus: draft.capacityStatus, verifiedWeeklyHours: draft.verifiedWeeklyHours,
          categories: Object.values(draft.categories), roleTitle: volunteer.role_title ?? "",
          skills: volunteer.skills ?? [], availabilityNotes: volunteer.availability_notes ?? "",
          backgroundCheckStatus: volunteer.background_check_status,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't update the volunteer.");
      setSuccess("Volunteer approval, capacity, categories, and portal access were saved."); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Couldn't update the volunteer."); }
    finally { setWorkingId(null); }
  }

  const inputStyle = { width: "100%", padding: 12, border: `1px solid ${C.border}`, borderRadius: 8, font: "inherit", background: C.white };
  const buttonStyle = { padding: "11px 16px", border: 0, borderRadius: 8, background: C.navy, color: C.white, fontWeight: 800, cursor: "pointer" };
  const labelStyle = { display: "grid", gap: 6, color: C.navy, fontWeight: 700 };

  return (
    <div style={{ maxWidth: 980 }}>
      <p style={{ color: C.coral, fontSize: 12, fontWeight: 900, letterSpacing: ".08em", margin: "0 0 6px" }}>PEOPLE &amp; PLACEMENT</p>
      <h1 style={{ color: C.navy, fontSize: 30, margin: "0 0 6px" }}>Volunteers</h1>
      <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.5, maxWidth: 760, margin: 0 }}>
        Approve each person, service category, and Volunteer Portal level separately. Foster approval and Volunteer Portal access never grant Rescue Manager access.
      </p>
      {counts.total > 0 && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: 10, margin: "20px 0" }}>
        {[["Total", counts.total], ["Pending", counts.pending], ["Approved", counts.approved], ["Portal Access", counts.portal]].filter(([, value]) => Number(value) > 0).map(([label, value]) => (
          <div key={String(label)} style={{ border: `1px solid ${C.border}`, padding: 14, borderRadius: 9, background: C.white }}>
            <strong style={{ display: "block", color: C.navy, fontSize: 24 }}>{value}</strong><span style={{ color: C.muted, fontSize: 13 }}>{label}</span>
          </div>
        ))}
      </div>}
      {error && <div style={{ background: C.peach, padding: 14, marginBottom: 18, color: "#A53126" }}>{error}</div>}
      {success && <div style={{ background: C.mint, padding: 14, marginBottom: 18, color: C.navy }}>{success}</div>}

      <details style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, margin: "20px 0 24px", background: C.white }}>
        <summary style={{ color: C.navy, cursor: "pointer", fontWeight: 800, fontSize: 16 }}>Add a volunteer</summary>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.5, margin: "10px 0 14px" }}>Add someone to your directory as pending. You can review their categories and portal access afterward.</p>
        <form onSubmit={addVolunteer} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          <label style={labelStyle}>Full name<input required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Phone<input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Volunteer role<input placeholder="Transport, events, fundraising…" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Skills<input placeholder="Comma separated" value={skills} onChange={(e) => setSkills(e.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Availability<input value={availability} onChange={(e) => setAvailability(e.target.value)} style={inputStyle} /></label>
          <div style={{ alignSelf: "end" }}><button disabled={saving} style={buttonStyle}>{saving ? "Adding…" : "Add Pending Volunteer"}</button></div>
        </form>
      </details>

      <section><h2 style={{ color: C.navy, fontSize: 20, margin: "0 0 12px" }}>Volunteer directory</h2>
        {loading ? <p>Loading volunteers…</p> : volunteers.length === 0 ? (
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, background: C.mint }}><strong style={{ color: C.navy }}>No volunteers have been added yet.</strong><p style={{ color: C.muted, fontSize: 13, margin: "5px 0 0" }}>Use “Add a volunteer” when you are ready to begin.</p></div>
        ) : volunteers.map((volunteer) => {
          const draft = drafts[volunteer.id] ?? createDraft(volunteer);
          return <article key={volunteer.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, marginBottom: 12, background: C.white }}>
            <button onClick={() => setExpanded(expanded === volunteer.id ? null : volunteer.id)} style={{ border: 0, background: "transparent", padding: 0, width: "100%", textAlign: "left", cursor: "pointer" }}>
              <strong style={{ color: C.navy, fontSize: 20 }}>{volunteer.full_name}</strong>
              <span style={{ float: "right", background: volunteer.status === "approved" ? C.mint : C.peach, padding: "5px 10px", borderRadius: 20, fontWeight: 800 }}>{volunteer.status}</span>
              <div style={{ color: C.muted, marginTop: 5 }}>{volunteer.role_title || "Role not assigned"} · {volunteer.email} · Portal: {volunteer.portal_access_level}</div>
            </button>
            {expanded === volunteer.id && <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 14, paddingTop: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
                <label style={labelStyle}>Volunteer status<select value={draft.status} onChange={(e) => updateDraft(volunteer.id, { status: e.target.value, portalAccessLevel: e.target.value === "approved" ? draft.portalAccessLevel : "none" })} style={inputStyle}>
                  <option value="pending">Pending</option><option value="approved">Approved</option><option value="inactive">Inactive</option><option value="declined">Declined</option>
                </select></label>
                <label style={labelStyle}>Volunteer Portal level<select disabled={draft.status !== "approved"} value={draft.status === "approved" ? draft.portalAccessLevel : "none"} onChange={(e) => updateDraft(volunteer.id, {
                  portalAccessLevel: e.target.value,
                  categories: e.target.value === "coordinator" ? draft.categories : Object.fromEntries(
                    Object.entries(draft.categories).map(([key, item]) => [key, {
                      ...item,
                      permissionLevel: item.permissionLevel === "coordinate" ? "contribute" : item.permissionLevel,
                    }])
                  ),
                })} style={inputStyle}>
                  <option value="none">No Portal Access</option><option value="viewer">Viewer</option><option value="contributor">Contributor</option><option value="coordinator">Coordinator</option>
                </select></label>
                <label style={labelStyle}>Capacity review<select value={draft.capacityStatus} onChange={(e) => updateDraft(volunteer.id, { capacityStatus: e.target.value })} style={inputStyle}>
                  <option value="review_required">Review required</option><option value="available">Available</option><option value="limited">Limited</option><option value="near_capacity">Near capacity</option><option value="at_capacity">At capacity</option><option value="temporarily_unavailable">Temporarily unavailable</option>
                </select></label>
                <label style={labelStyle}>Verified weekly hours<input type="number" min="0" max="168" value={draft.verifiedWeeklyHours} onChange={(e) => updateDraft(volunteer.id, { verifiedWeeklyHours: e.target.value })} style={inputStyle} /></label>
              </div>
              <div style={{ background: C.mint, padding: 14, margin: "16px 0", color: C.navy }}>
                <strong>{draft.portalAccessLevel === "none" ? "No Portal Access" : draft.portalAccessLevel[0].toUpperCase() + draft.portalAccessLevel.slice(1)}:</strong>{" "}{ACCESS_EXPLANATIONS[draft.portalAccessLevel as keyof typeof ACCESS_EXPLANATIONS]}
              </div>
              <h3 style={{ color: C.navy, marginBottom: 6 }}>Approved service categories</h3>
              <p style={{ color: C.muted, marginTop: 0 }}>Approve only work this rescue has vetted the person to perform. Other rescues make their own decisions.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
                {CATEGORIES.map(([category, label]) => {
                  const approval = draft.categories[category] ?? { category, status: "pending", permissionLevel: "view" };
                  const approved = approval.status === "approved";
                  return <div key={category} style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
                    <label style={{ display: "flex", gap: 9, alignItems: "center", color: C.navy, fontWeight: 800 }}>
                      <input type="checkbox" checked={approved} onChange={(e) => updateCategory(volunteer.id, category, { status: e.target.checked ? "approved" : "declined" })} />{label}
                    </label>
                    {approved && <select value={approval.permissionLevel} onChange={(e) => updateCategory(volunteer.id, category, { permissionLevel: e.target.value })} style={{ ...inputStyle, marginTop: 9 }}>
                      <option value="view">View</option><option value="contribute">Contribute</option>{draft.portalAccessLevel === "coordinator" && <option value="coordinate">Coordinate</option>}
                    </select>}
                  </div>;
                })}
              </div>
              <div style={{ marginTop: 18 }}><button disabled={workingId === volunteer.id} style={buttonStyle} onClick={() => saveVolunteer(volunteer)}>{workingId === volunteer.id ? "Saving…" : "Save Volunteer Access"}</button></div>
            </div>}
          </article>;
        })}
      </section>
    </div>
  );
}
