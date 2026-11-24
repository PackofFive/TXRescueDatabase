"use client";

import { useEffect, useState } from "react";

type Assignment = {
  id: string; status: string; purpose: string; expires_at: string;
  animal_name: string; species: string | null; breed_or_type: string | null;
  organization_name: string; can_view_medical_summary: boolean;
  can_upload_documents: boolean; can_add_care_notes: boolean;
};

export default function Page() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/care-partner/assignments", { cache: "no-store" })
      .then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error); setAssignments(body.assignments || []); })
      .catch((reason) => setError(reason.message || "Assignments could not be loaded."));
  }, []);
  return <section style={{ maxWidth: 900, margin: "0 auto", padding: "8px 0 44px" }}>
    <p style={{ margin: "0 0 7px", color: "#E85C56", fontSize: 12, fontWeight: 800, letterSpacing: ".1em" }}>CARE PARTNER PORTAL</p>
    <h1 style={{ margin: 0, color: "#1E3A5F", fontSize: "clamp(30px, 5vw, 44px)" }}>Assigned Work</h1>
    <p style={{ color: "#4A5D75", lineHeight: 1.6 }}>Only animals deliberately assigned by an approved organization appear here. Each assignment is limited by purpose, permissions, and expiration.</p>
    {error ? <div style={{ padding: 14, background: "#F9E1E5", color: "#B6382E" }}>{error}</div> : null}
    <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
      {assignments.length === 0 && !error ? <div style={{ padding: 18, background: "#E1F3EC", color: "#1E3A5F" }}>No animals are currently assigned to this Care Partner.</div> : assignments.map((assignment) => {
        const active = assignment.status === "active" && new Date(assignment.expires_at).getTime() > Date.now();
        const open = active && (assignment.can_view_medical_summary || assignment.can_add_care_notes);
        return <article key={assignment.id} style={{ padding: 18, border: "1px solid #DCE4EC", background: "white" }}>
          <h2 style={{ margin: 0, color: "#1E3A5F" }}>{assignment.animal_name}</h2>
          <p style={{ margin: "6px 0", color: "#4A5D75" }}>{assignment.species || "Animal"}{assignment.breed_or_type ? ` · ${assignment.breed_or_type}` : ""} · Assigned by {assignment.organization_name}</p>
          <p style={{ color: "#4A5D75", lineHeight: 1.5 }}>{assignment.purpose}</p>
          <p style={{ color: "#4A5D75", fontSize: 12 }}>Status: {assignment.status} · Expires {new Date(assignment.expires_at).toLocaleString()}</p>
          <ul style={{ color: "#1E3A5F", lineHeight: 1.6 }}>{assignment.can_view_medical_summary ? <li>Limited medical summary</li> : null}{assignment.can_upload_documents ? <li>Document uploads</li> : null}{assignment.can_add_care_notes ? <li>Care notes</li> : null}</ul>
          {open ? <a href={`/care-partner/assignments/${assignment.id}`} style={{ display: "inline-block", marginTop: 8, padding: "10px 13px", background: "#1E3A5F", color: "white", fontWeight: 800, textDecoration: "none" }}>Open assigned work</a> : null}
          {assignment.can_add_care_notes ? <a href={`/care-partner/assignments/${assignment.id}/care-notes`} style={{ display: "inline-block", marginTop: 8, marginLeft: 8, padding: "10px 13px", border: "1px solid #1E3A5F", color: "#1E3A5F", fontWeight: 800, textDecoration: "none" }}>Care note history</a> : null}
          {active && assignment.can_upload_documents ? <a href={`/care-partner/assignments/${assignment.id}/documents`} style={{ display: "inline-block", marginTop: 8, marginLeft: 8, padding: "10px 13px", border: "1px solid #1E3A5F", color: "#1E3A5F", fontWeight: 800, textDecoration: "none" }}>Assignment documents</a> : null}
        </article>;
      })}
    </div>
  </section>;
}
