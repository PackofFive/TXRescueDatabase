"use client";

import { useEffect, useState } from "react";

type AuditEvent = { id: string; event_type: string; old_status: string | null; new_status: string | null; note: string | null; system_generated: boolean; created_at: string; actor_email: string | null };

export default function CarePartnerAssignmentAudit({ assignmentId }: { assignmentId: string }) {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`/api/care-partner/assignments/${encodeURIComponent(assignmentId)}/audit`, { cache: "no-store" })
      .then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error); setEvents(body.events || []); })
      .catch((reason) => setError(reason.message || "Audit history could not be loaded."));
  }, [assignmentId]);
  if (error) return <div style={{ padding: 13, background: "#F9E1E5", color: "#B6382E" }}>{error}</div>;
  return <div style={{ display: "grid", gap: 9 }}>
    {events.length === 0 ? <p style={{ color: "#4A5D75" }}>No audit events were found.</p> : events.map((event) => <article key={event.id} style={{ padding: 13, border: "1px solid #DCE4EC", background: "white" }}>
      <strong style={{ color: "#1E3A5F" }}>{eventLabel(event.event_type)}</strong>
      <p style={{ margin: "5px 0", color: "#4A5D75", fontSize: 13 }}>{new Date(event.created_at).toLocaleString()} · {event.system_generated ? "Pack of Five system" : event.actor_email || "Authorized user"}</p>
      {event.old_status || event.new_status ? <p style={{ margin: "5px 0", color: "#4A5D75", fontSize: 13 }}>{event.old_status || "—"} → {event.new_status || "—"}</p> : null}
      {event.note ? <p style={{ margin: "7px 0 0", color: "#4A5D75", whiteSpace: "pre-wrap", lineHeight: 1.45 }}>{event.note}</p> : null}
    </article>)}
  </div>;
}

function eventLabel(value: string) { const labels: Record<string, string> = { assignment_created: "Assignment created", medical_summary_viewed: "Limited medical summary viewed", care_note_added: "Care note added", care_note_addendum_added: "Care-note addendum added", document_uploaded: "Private document uploaded", assignment_completed: "Assignment completed", assignment_revoked: "Access revoked", assignment_expired: "Assignment automatically expired" }; return labels[value] || value.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "); }
