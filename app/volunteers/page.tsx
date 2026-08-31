"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Volunteer = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: string;
  role_title: string | null;
  skills: string[];
  availability_notes: string | null;
  background_check_status: string;
};

const C = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  peach: "#FBE3DA",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
};

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/volunteers", { cache: "no-store" });
      const data = await response.json();
      if (response.status === 401) {
        window.location.href = "/login?portal=organization";
        return;
      }
      if (!response.ok) throw new Error(data.error ?? "Couldn't load volunteers.");
      setVolunteers(data.volunteers ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load volunteers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const counts = useMemo(() => ({
    total: volunteers.length,
    pending: volunteers.filter((item) => item.status === "pending").length,
    approved: volunteers.filter((item) => item.status === "approved").length,
    inactive: volunteers.filter((item) => item.status === "inactive").length,
  }), [volunteers]);

  async function addVolunteer(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          phone,
          roleTitle,
          skills: skills.split(",").map((item) => item.trim()).filter(Boolean),
          availabilityNotes: availability,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't add the volunteer.");
      setName(""); setEmail(""); setPhone(""); setRoleTitle(""); setSkills(""); setAvailability("");
      setSuccess("Volunteer added as pending. No portal or foster access was granted.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add the volunteer.");
    } finally {
      setSaving(false);
    }
  }

  async function updateVolunteer(volunteer: Volunteer, status: string) {
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/volunteers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relationshipId: volunteer.id,
          status,
          roleTitle: volunteer.role_title ?? "",
          skills: volunteer.skills ?? [],
          availabilityNotes: volunteer.availability_notes ?? "",
          backgroundCheckStatus: volunteer.background_check_status,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't update the volunteer.");
      setSuccess(`Volunteer marked ${status}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update the volunteer.");
    }
  }

  const inputStyle = { width: "100%", padding: 12, border: `1px solid ${C.border}`, borderRadius: 8, font: "inherit" };
  const buttonStyle = { padding: "11px 16px", border: 0, borderRadius: 8, background: C.navy, color: C.white, fontWeight: 800, cursor: "pointer" };

  return (
    <div style={{ maxWidth: 1050 }}>
      <p style={{ color: C.coral, fontWeight: 900, letterSpacing: 1.5, marginBottom: 8 }}>PEOPLE &amp; PLACEMENT</p>
      <h1 style={{ color: C.navy, fontSize: 42, margin: "0 0 10px" }}>Volunteers</h1>
      <p style={{ color: C.muted, fontSize: 19, lineHeight: 1.5, maxWidth: 850 }}>
        Track people helping with transport, events, administration, fundraising, and other work. Volunteer approval is separate from foster approval and does not grant portal access.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, margin: "26px 0" }}>
        {[['Total', counts.total], ['Pending', counts.pending], ['Approved', counts.approved], ['Inactive', counts.inactive]].map(([label, value]) => (
          <div key={String(label)} style={{ border: `1px solid ${C.border}`, padding: 18, borderRadius: 10, background: C.white }}>
            <strong style={{ display: "block", color: C.navy, fontSize: 30 }}>{value}</strong>
            <span style={{ color: C.muted }}>{label}</span>
          </div>
        ))}
      </div>

      {error && <div style={{ background: C.peach, padding: 14, marginBottom: 18, color: "#A53126" }}>{error}</div>}
      {success && <div style={{ background: C.mint, padding: 14, marginBottom: 18, color: C.navy }}>{success}</div>}

      <section style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, marginBottom: 28, background: C.white }}>
        <h2 style={{ color: C.navy, marginTop: 0 }}>Add a volunteer</h2>
        <form onSubmit={addVolunteer} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          <label>Full name<input required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} /></label>
          <label>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} /></label>
          <label>Phone<input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} /></label>
          <label>Volunteer role<input placeholder="Transport, events, fundraising…" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} style={inputStyle} /></label>
          <label>Skills<input placeholder="Comma separated" value={skills} onChange={(e) => setSkills(e.target.value)} style={inputStyle} /></label>
          <label>Availability<input value={availability} onChange={(e) => setAvailability(e.target.value)} style={inputStyle} /></label>
          <div style={{ alignSelf: "end" }}><button disabled={saving} style={buttonStyle}>{saving ? "Adding…" : "Add Pending Volunteer"}</button></div>
        </form>
      </section>

      <section>
        <h2 style={{ color: C.navy }}>Volunteer directory</h2>
        {loading ? <p>Loading volunteers…</p> : volunteers.length === 0 ? (
          <div style={{ border: `1px solid ${C.border}`, padding: 24, background: C.white }}>No volunteers have been added yet.</div>
        ) : volunteers.map((volunteer) => (
          <article key={volunteer.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, marginBottom: 12, background: C.white }}>
            <button onClick={() => setExpanded(expanded === volunteer.id ? null : volunteer.id)} style={{ border: 0, background: "transparent", padding: 0, width: "100%", textAlign: "left", cursor: "pointer" }}>
              <strong style={{ color: C.navy, fontSize: 20 }}>{volunteer.full_name}</strong>
              <span style={{ float: "right", background: volunteer.status === "approved" ? C.mint : C.peach, padding: "5px 10px", borderRadius: 20, fontWeight: 800 }}>{volunteer.status}</span>
              <div style={{ color: C.muted, marginTop: 5 }}>{volunteer.role_title || "Role not assigned"} · {volunteer.email}</div>
            </button>
            {expanded === volunteer.id && (
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 14, paddingTop: 14 }}>
                <p><strong>Skills:</strong> {volunteer.skills?.join(", ") || "None recorded"}</p>
                <p><strong>Availability:</strong> {volunteer.availability_notes || "Not recorded"}</p>
                <p><strong>Background check:</strong> {volunteer.background_check_status.replaceAll("_", " ")}</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {volunteer.status !== "approved" && <button style={buttonStyle} onClick={() => updateVolunteer(volunteer, "approved")}>Approve Volunteer</button>}
                  {volunteer.status !== "inactive" && <button style={{ ...buttonStyle, background: C.muted }} onClick={() => updateVolunteer(volunteer, "inactive")}>Mark Inactive</button>}
                </div>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
