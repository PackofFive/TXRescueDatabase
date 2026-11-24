"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Summary = {
  assignment: { animalName: string; species: string | null; breedOrType: string | null; organizationName: string; purpose: string; expiresAt: string };
  medicalRecords: Array<{ record_type: string; title: string; occurred_at: string | null; due_at: string | null; status: string }>;
  medications: Array<{ medication_name: string; dosage: string | null; instructions: string | null; frequency: string | null; start_date: string | null; end_date: string | null; next_due_at: string | null; active: boolean }>;
  limitations: string;
};

const navy = "#1E3A5F";
const muted = "#4A5D75";
const border = "#DCE4EC";

export default function Page() {
  const params = useParams<{ id: string }>();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`/api/care-partner/assignments/${encodeURIComponent(params.id)}/medical-summary`, { cache: "no-store" })
      .then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error); setSummary(body); })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "The summary could not be loaded."));
  }, [params.id]);

  return <section style={{ maxWidth: 920, margin: "0 auto", padding: "8px 0 44px" }}>
    <a href="/care-partner/assignments" style={{ color: "#E85C56", fontWeight: 800, textDecoration: "none" }}>← Back to assigned work</a>
    {error ? <div style={{ marginTop: 18, padding: 16, color: "#B6382E", background: "#F9E1E5", border: "1px solid #E85C56" }}>{error}</div> : null}
    {!summary && !error ? <p>Loading limited medical summary…</p> : null}
    {summary ? <>
      <p style={{ margin: "24px 0 7px", color: "#E85C56", fontSize: 12, fontWeight: 800, letterSpacing: ".1em" }}>LIMITED MEDICAL SUMMARY</p>
      <h1 style={{ margin: 0, color: navy, fontSize: "clamp(30px, 5vw, 44px)" }}>{summary.assignment.animalName}</h1>
      <p style={{ color: muted }}>{summary.assignment.species || "Animal"}{summary.assignment.breedOrType ? ` · ${summary.assignment.breedOrType}` : ""} · Assigned by {summary.assignment.organizationName}</p>
      <div style={{ padding: 16, background: "#E1F3EC", border: `1px solid ${border}`, color: navy }}><strong>Authorized purpose</strong><p style={{ margin: "6px 0" }}>{summary.assignment.purpose}</p><small>Permission expires {new Date(summary.assignment.expiresAt).toLocaleString()}.</small></div>
      <h2 style={{ color: navy, marginTop: 28 }}>Medical events</h2>
      <div style={{ display: "grid", gap: 9 }}>{summary.medicalRecords.length === 0 ? <p style={{ color: muted }}>No medical events are included in this summary.</p> : summary.medicalRecords.map((record, index) => <article key={`${record.title}-${index}`} style={card}><strong style={{ color: navy }}>{record.title}</strong><p style={detail}>{record.record_type} · {record.status}{record.occurred_at ? ` · ${formatDate(record.occurred_at)}` : ""}{record.due_at ? ` · Due ${formatDate(record.due_at)}` : ""}</p></article>)}</div>
      <h2 style={{ color: navy, marginTop: 28 }}>Medications</h2>
      <div style={{ display: "grid", gap: 9 }}>{summary.medications.length === 0 ? <p style={{ color: muted }}>No medications are included in this summary.</p> : summary.medications.map((medication, index) => <article key={`${medication.medication_name}-${index}`} style={card}><strong style={{ color: navy }}>{medication.medication_name}</strong><p style={detail}>{medication.dosage || "Dosage not listed"}{medication.frequency ? ` · ${medication.frequency}` : ""} · {medication.active ? "Active" : "Inactive"}</p>{medication.instructions ? <p style={detail}>{medication.instructions}</p> : null}{medication.next_due_at ? <p style={detail}>Next due {new Date(medication.next_due_at).toLocaleString()}</p> : null}</article>)}</div>
      <p style={{ marginTop: 28, padding: 14, background: "#F4F7FA", border: `1px solid ${border}`, color: muted, fontSize: 13, lineHeight: 1.55 }}>{summary.limitations}</p>
    </> : null}
  </section>;
}

function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(); }
const card = { padding: 14, background: "white", border: `1px solid ${border}` } as const;
const detail = { margin: "6px 0 0", color: muted, lineHeight: 1.5 } as const;
