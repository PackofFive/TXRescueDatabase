"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AuditJob = {
  id: string;
  status: string;
  summary: {
    fileName?: string;
    rollbackReason?: string;
    commitCounts?: { created?: number; updated?: number };
    rollbackCounts?: { revertedCreates?: number; revertedUpdates?: number };
    matchCounts?: { creates?: number; updates?: number; reviews?: number; errors?: number };
  };
  created_at: string;
  updated_at: string;
  committed_at?: string | null;
  rolled_back_at?: string | null;
  rollback_expires_at?: string | null;
  uploaded_by_email: string;
  row_count: number;
  selected_count: number;
  committed_audit_at?: string | null;
  committed_by_email?: string | null;
  rollback_audit_at?: string | null;
  rolled_back_by_email?: string | null;
  archived_at?: string | null;
  archived_by_email?: string | null;
};

type StatusFilter = "all" | "open" | "committed" | "rolled_back" | "archived" | "attention";

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  peach: "#FBE3DA",
  pink: "#F7E8EC",
  muted: "#4A5D75",
  border: "#DCE4EC",
  surface: "#FFFFFF",
  background: "#FFFDFC",
  error: "#B23B2E",
};

export default function ImportAuditPage() {
  const [jobs, setJobs] = useState<AuditJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/imports/audit", { cache: "no-store" });
        const result = (await response.json()) as { jobs?: AuditJob[]; error?: string };
        if (!response.ok || !result.jobs) {
          throw new Error(result.error || "The import audit report could not be loaded.");
        }
        if (active) setJobs(result.jobs);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "The import audit report could not be loaded.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  const visibleJobs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "open" && ["created", "previewing", "ready"].includes(job.status)) ||
        (filter === "attention" && ["blocked", "failed", "expired"].includes(job.status)) ||
        job.status === filter;
      const matchesSearch = !term || [
        job.summary.fileName,
        job.uploaded_by_email,
        job.committed_by_email,
        job.rolled_back_by_email,
        job.archived_by_email,
        job.summary.rollbackReason,
        job.id,
      ].some((value) => value?.toLowerCase().includes(term));
      return matchesFilter && matchesSearch;
    });
  }, [filter, jobs, search]);

  const counts = useMemo(() => ({
    total: jobs.length,
    imported: jobs.filter((job) => job.status === "committed").length,
    rolledBack: jobs.filter((job) => job.status === "rolled_back").length,
    archived: jobs.filter((job) => job.status === "archived").length,
  }), [jobs]);

  function downloadCsv() {
    const headers = ["Reference", "File", "Status", "Uploaded At", "Uploaded By", "Rows", "Selected", "Committed At", "Committed By", "Rolled Back At", "Rolled Back By", "Rollback Reason", "Archived At", "Archived By"];
    const rows = visibleJobs.map((job) => [
      job.id,
      job.summary.fileName ?? "Pack of Five workbook",
      statusLabel(job.status),
      job.created_at,
      job.uploaded_by_email,
      job.row_count,
      job.selected_count,
      job.committed_at ?? "",
      job.committed_by_email ?? "",
      job.rolled_back_at ?? "",
      job.rolled_back_by_email ?? "",
      job.summary.rollbackReason ?? "",
      job.archived_at ?? "",
      job.archived_by_email ?? "",
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `pack-of-five-import-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section style={pageStyle}>
      <p style={eyebrowStyle}>Data &amp; Imports</p>
      <div style={titleRowStyle}>
        <div>
          <h1 style={headingStyle}>Import Audit</h1>
          <p style={introStyle}>Review workbook activity for the current organization, including archived previews, completed imports, and rollback reasons.</p>
        </div>
        <button type="button" onClick={downloadCsv} disabled={visibleJobs.length === 0} style={{ ...exportButtonStyle, opacity: visibleJobs.length === 0 ? 0.55 : 1 }}>Export CSV</button>
      </div>

      <div style={summaryGridStyle}>
        <Summary label="All records" value={counts.total} />
        <Summary label="Currently imported" value={counts.imported} />
        <Summary label="Rolled back" value={counts.rolledBack} />
        <Summary label="Archived previews" value={counts.archived} />
      </div>

      <div style={controlsStyle}>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search file, person, reason, or reference" aria-label="Search audit records" style={searchStyle} />
        <div style={filtersStyle}>
          {([ ["all", "All"], ["open", "Open"], ["committed", "Imported"], ["rolled_back", "Rolled Back"], ["archived", "Archived"], ["attention", "Needs Attention"] ] as const).map(([key, label]) => (
            <button key={key} type="button" onClick={() => setFilter(key)} style={{ ...filterButtonStyle, background: filter === key ? COLORS.navy : COLORS.surface, color: filter === key ? "#fff" : COLORS.navy }}>{label}</button>
          ))}
        </div>
      </div>

      {loading && <p style={messageStyle}>Loading audit records…</p>}
      {error && <p role="alert" style={errorStyle}>{error}</p>}
      {!loading && !error && visibleJobs.length === 0 && <p style={messageStyle}>No audit records match these filters.</p>}

      <div style={listStyle}>
        {visibleJobs.map((job) => (
          <article key={job.id} style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div style={{ minWidth: 0 }}>
                <Link href={`/portal/data-imports/${job.id}`} style={fileLinkStyle}>{job.summary.fileName || "Pack of Five workbook"}</Link>
                <div style={referenceStyle}>Reference: {job.id}</div>
              </div>
              <span style={{ ...badgeStyle, ...statusStyle(job.status) }}>{statusLabel(job.status)}</span>
            </div>

            <div style={detailsGridStyle}>
              <Detail label="Uploaded" value={formatDate(job.created_at)} subvalue={job.uploaded_by_email} />
              <Detail label="Workbook records" value={`${job.row_count} total · ${job.selected_count} selected`} />
              {job.committed_at && <Detail label="Imported" value={formatDate(job.committed_at)} subvalue={job.committed_by_email || undefined} />}
              {job.rolled_back_at && <Detail label="Rolled back" value={formatDate(job.rolled_back_at)} subvalue={job.rolled_back_by_email || undefined} />}
              {job.archived_at && <Detail label="Archived" value={formatDate(job.archived_at)} subvalue={job.archived_by_email || undefined} />}
            </div>

            {job.summary.rollbackReason && (
              <div style={reasonStyle}><strong>Rollback reason:</strong> {job.summary.rollbackReason}</div>
            )}
          </article>
        ))}
      </div>

      <Link href="/portal/data-imports" style={backLinkStyle}>Return to Data &amp; Imports</Link>
    </section>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return <div style={summaryCardStyle}><strong style={summaryValueStyle}>{value}</strong><span>{label}</span></div>;
}

function Detail({ label, value, subvalue }: { label: string; value: string; subvalue?: string }) {
  return <div><strong style={detailLabelStyle}>{label}</strong><div>{value}</div>{subvalue && <div style={subvalueStyle}>{subvalue}</div>}</div>;
}

function statusLabel(status: string) {
  if (status === "ready") return "Ready for review";
  if (status === "committed") return "Imported";
  if (status === "rolled_back") return "Rolled back";
  if (status === "archived") return "Archived";
  if (status === "blocked") return "Needs correction";
  return status.replaceAll("_", " ");
}

function statusStyle(status: string): React.CSSProperties {
  if (status === "committed") return { background: COLORS.mint, color: COLORS.navy };
  if (status === "rolled_back" || status === "archived") return { background: "#EDF0F4", color: COLORS.muted };
  if (["blocked", "failed", "expired"].includes(status)) return { background: COLORS.pink, color: COLORS.error };
  return { background: COLORS.peach, color: COLORS.navy };
}

function formatDate(value: string) { return new Date(value).toLocaleString(); }
function csvCell(value: string | number) { return `"${String(value).replaceAll('"', '""')}"`; }

const pageStyle: React.CSSProperties = { maxWidth: 980, color: COLORS.navy };
const eyebrowStyle: React.CSSProperties = { margin: "0 0 8px", color: COLORS.coral, fontSize: 12, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" };
const titleRowStyle: React.CSSProperties = { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 18, flexWrap: "wrap" };
const headingStyle: React.CSSProperties = { margin: 0, fontSize: 30, lineHeight: 1.1 };
const introStyle: React.CSSProperties = { maxWidth: 760, margin: "8px 0 0", color: COLORS.muted, fontSize: 13.5, lineHeight: 1.55 };
const exportButtonStyle: React.CSSProperties = { padding: "10px 14px", border: 0, borderRadius: 7, background: COLORS.navy, color: "#fff", cursor: "pointer", fontWeight: 800 };
const summaryGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginTop: 24 };
const summaryCardStyle: React.CSSProperties = { display: "grid", gap: 5, padding: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8 };
const summaryValueStyle: React.CSSProperties = { fontSize: 28 };
const controlsStyle: React.CSSProperties = { display: "grid", gap: 12, marginTop: 22 };
const searchStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "11px 12px", border: `1px solid ${COLORS.border}`, borderRadius: 7, color: COLORS.navy, background: COLORS.surface, font: "inherit" };
const filtersStyle: React.CSSProperties = { display: "flex", gap: 8, flexWrap: "wrap" };
const filterButtonStyle: React.CSSProperties = { padding: "7px 11px", border: `1px solid ${COLORS.border}`, borderRadius: 999, cursor: "pointer", fontWeight: 800 };
const listStyle: React.CSSProperties = { display: "grid", gap: 12, marginTop: 18 };
const cardStyle: React.CSSProperties = { padding: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8 };
const cardHeaderStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 };
const fileLinkStyle: React.CSSProperties = { color: COLORS.navy, fontSize: 17, fontWeight: 850, overflowWrap: "anywhere" };
const referenceStyle: React.CSSProperties = { marginTop: 4, color: COLORS.muted, fontSize: 11, overflowWrap: "anywhere" };
const badgeStyle: React.CSSProperties = { flex: "0 0 auto", padding: "5px 8px", borderRadius: 999, fontSize: 10.5, fontWeight: 850, textTransform: "capitalize" };
const detailsGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 15, paddingTop: 14, borderTop: `1px solid ${COLORS.border}`, fontSize: 13 };
const detailLabelStyle: React.CSSProperties = { display: "block", marginBottom: 4, color: COLORS.muted, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase" };
const subvalueStyle: React.CSSProperties = { marginTop: 3, color: COLORS.muted, overflowWrap: "anywhere" };
const reasonStyle: React.CSSProperties = { marginTop: 14, padding: "10px 12px", background: COLORS.peach, borderRadius: 6, lineHeight: 1.45 };
const messageStyle: React.CSSProperties = { marginTop: 18, padding: 14, color: COLORS.muted, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8 };
const errorStyle: React.CSSProperties = { ...messageStyle, color: COLORS.error, background: COLORS.pink };
const backLinkStyle: React.CSSProperties = { display: "inline-block", marginTop: 20, color: COLORS.navy, fontWeight: 800 };
