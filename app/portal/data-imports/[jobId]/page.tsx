"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Action = "create" | "update" | "warning" | "error" | "skip";

type SavedRow = {
  id: string;
  sheet_name: string;
  row_number: number;
  proposed_action: Action;
  selected: boolean;
  target_entity_id: string | null;
  source_payload: Record<string, unknown>;
  messages: string[];
};

type SavedPreview = {
  job: {
    id: string;
    status: string;
    template_id: string;
    schema_version: string;
    summary: {
      fileName?: string;
      matchCounts?: {
        creates: number;
        updates: number;
        reviews: number;
        errors: number;
      };
    };
    created_at: string;
    uploaded_by_email: string;
  };
  rows: SavedRow[];
  commitEnabled: boolean;
};

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  peach: "#FBE3DA",
  pink: "#F7E8EC",
  muted: "#4A5D75",
  border: "#DCE4EC",
  surface: "#FFFFFF",
  error: "#B23B2E",
  warning: "#8A5A00",
};

export default function SavedImportPreviewPage() {
  const params = useParams<{ jobId: string }>();
  const [data, setData] = useState<SavedPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Action>("all");
  const [savingRowId, setSavingRowId] = useState<string | null>(null);
  const [choiceError, setChoiceError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPreview() {
      try {
        const response = await fetch(
          `/api/imports/preview/${encodeURIComponent(params.jobId)}`,
          { cache: "no-store" }
        );
        const result = (await response.json()) as
          | SavedPreview
          | { error?: string };

        if (!response.ok || !("job" in result)) {
          throw new Error(
            "error" in result && result.error
              ? result.error
              : "The saved preview could not be loaded."
          );
        }

        if (active) setData(result);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "The saved preview could not be loaded."
          );
        }
      }
    }

    void loadPreview();
    return () => {
      active = false;
    };
  }, [params.jobId]);

  const visibleRows = useMemo(
    () =>
      data?.rows.filter(
        (row) => filter === "all" || row.proposed_action === filter
      ) ?? [],
    [data, filter]
  );

  async function changeSelection(row: SavedRow, selected: boolean) {
    if (!data || savingRowId) return;

    setSavingRowId(row.id);
    setChoiceError(null);

    try {
      const response = await fetch(
        `/api/imports/preview/${encodeURIComponent(params.jobId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rowId: row.id, selected }),
        }
      );
      const result = (await response.json()) as {
        row?: { id: string; selected: boolean };
        error?: string;
      };

      if (!response.ok || !result.row) {
        throw new Error(
          result.error || "The preview choice could not be saved."
        );
      }

      setData({
        ...data,
        rows: data.rows.map((item) =>
          item.id === result.row?.id
            ? { ...item, selected: Boolean(result.row.selected) }
            : item
        ),
      });
    } catch (err) {
      setChoiceError(
        err instanceof Error
          ? err.message
          : "The preview choice could not be saved."
      );
    } finally {
      setSavingRowId(null);
    }
  }

  if (error) {
    return (
      <section style={pageStyle}>
        <h1 style={headingStyle}>Import Preview</h1>
        <p role="alert" style={errorStyle}>{error}</p>
        <Link href="/portal/data-imports" style={linkStyle}>
          Return to Data &amp; Imports
        </Link>
      </section>
    );
  }

  if (!data) {
    return <p style={bodyStyle}>Loading secure preview…</p>;
  }

  const counts = data.job.summary.matchCounts ?? {
    creates: 0,
    updates: 0,
    reviews: 0,
    errors: 0,
  };
  const selectedCount = data.rows.filter(
    (row) =>
      row.selected &&
      (row.proposed_action === "create" ||
        row.proposed_action === "update")
  ).length;

  return (
    <section style={pageStyle}>
      <p style={eyebrowStyle}>Data &amp; Imports</p>
      <h1 style={headingStyle}>Review Saved Preview</h1>
      <p style={bodyStyle}>
        {data.job.summary.fileName ?? "Pack of Five workbook"} · Saved{" "}
        {new Date(data.job.created_at).toLocaleString()} · By{" "}
        {data.job.uploaded_by_email}
      </p>

      <div style={summaryGridStyle}>
        <Summary label="Create" value={counts.creates} />
        <Summary label="Update" value={counts.updates} />
        <Summary label="Review" value={counts.reviews} />
        <Summary label="Errors" value={counts.errors} />
        <Summary label="Selected" value={selectedCount} />
      </div>

      <p style={selectionHelpStyle}>
        Choose which ready Create and Update rows should be included later.
        Review and Error rows stay excluded until corrected.
      </p>

      {choiceError && (
        <p role="alert" style={errorStyle}>{choiceError}</p>
      )}

      <div style={filterBarStyle}>
        {(["all", "create", "update", "warning", "error"] as const).map(
          (action) => (
            <button
              type="button"
              key={action}
              onClick={() => setFilter(action)}
              style={{
                ...filterButtonStyle,
                background: filter === action ? COLORS.navy : COLORS.surface,
                color: filter === action ? "#fff" : COLORS.navy,
              }}
            >
              {action === "all" ? "All" : actionLabel(action)}
            </button>
          )
        )}
      </div>

      <div style={rowsStyle}>
        {visibleRows.length === 0 ? (
          <p style={bodyStyle}>No rows match this filter.</p>
        ) : (
          visibleRows.map((row) => (
            <article
              key={row.id}
              style={{
                ...rowCardStyle,
                opacity:
                  canSelect(row) && !row.selected ? 0.68 : 1,
              }}
            >
              <div style={rowHeaderStyle}>
                <div style={rowChoiceStyle}>
                  <input
                    type="checkbox"
                    checked={row.selected}
                    disabled={!canSelect(row) || Boolean(savingRowId)}
                    onChange={(event) =>
                      void changeSelection(row, event.target.checked)
                    }
                    aria-label={`Include ${rowLabel(row)}`}
                    style={checkboxStyle}
                  />
                  <div>
                    <strong>{rowLabel(row)}</strong>
                    <div style={rowMetaStyle}>
                      {row.sheet_name} · Row {row.row_number}
                      {row.target_entity_id ? " · Exact match found" : ""}
                      {savingRowId === row.id ? " · Saving choice…" : ""}
                    </div>
                  </div>
                </div>
                <span style={{ ...badgeStyle, ...actionStyle(row.proposed_action) }}>
                  {actionLabel(row.proposed_action)}
                </span>
              </div>
              {row.messages.length > 0 && (
                <ul style={messageListStyle}>
                  {row.messages.map((message, index) => (
                    <li key={`${index}-${message}`}>{message}</li>
                  ))}
                </ul>
              )}
            </article>
          ))
        )}
      </div>

      <div style={lockedStyle}>
        <strong>Confirmation is locked.</strong>{" "}
        This review page is read-only. Commit transactions, audit snapshots,
        and guarded rollback must be completed before confirmation is enabled.
      </div>
      <button type="button" disabled style={disabledButtonStyle}>
        Confirm Import — Not Yet Enabled
      </button>
      <div style={{ marginTop: 16 }}>
        <Link href="/portal/data-imports" style={linkStyle}>
          Return to Data &amp; Imports
        </Link>
      </div>
    </section>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div style={summaryCardStyle}>
      <strong style={{ fontSize: 25 }}>{value}</strong>
      <span style={{ color: COLORS.muted, fontSize: 12 }}>{label}</span>
    </div>
  );
}

function rowLabel(row: SavedRow) {
  const values = row.source_payload;
  return String(
    values.name || values.animal_name || values.task ||
      values.service_vaccine || `${row.sheet_name} row ${row.row_number}`
  );
}

function actionLabel(action: Action) {
  if (action === "warning") return "Review";
  return action.charAt(0).toUpperCase() + action.slice(1);
}

function actionStyle(action: Action): React.CSSProperties {
  if (action === "create") return { background: COLORS.mint, color: COLORS.navy };
  if (action === "update") return { background: "#E5EEF8", color: COLORS.navy };
  if (action === "warning") return { background: COLORS.peach, color: COLORS.warning };
  if (action === "error") return { background: COLORS.pink, color: COLORS.error };
  return { background: "#EEF1F4", color: COLORS.muted };
}

function canSelect(row: SavedRow) {
  return row.proposed_action === "create" || row.proposed_action === "update";
}

const pageStyle: React.CSSProperties = { maxWidth: 1040 };
const eyebrowStyle: React.CSSProperties = { margin: "0 0 7px", color: COLORS.coral, fontSize: 11.5, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" };
const headingStyle: React.CSSProperties = { margin: 0, color: COLORS.navy, fontSize: 30 };
const bodyStyle: React.CSSProperties = { color: COLORS.muted, fontSize: 13.5, lineHeight: 1.55 };
const summaryGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginTop: 18 };
const summaryCardStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4, padding: 14, color: COLORS.navy, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8 };
const filterBarStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 };
const filterButtonStyle: React.CSSProperties = { padding: "7px 10px", border: `1px solid ${COLORS.border}`, borderRadius: 999, cursor: "pointer", fontSize: 12, fontWeight: 750 };
const rowsStyle: React.CSSProperties = { display: "grid", gap: 9, marginTop: 14 };
const rowCardStyle: React.CSSProperties = { padding: 14, color: COLORS.navy, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8 };
const rowHeaderStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 };
const rowMetaStyle: React.CSSProperties = { marginTop: 4, color: COLORS.muted, fontSize: 11.5 };
const badgeStyle: React.CSSProperties = { flex: "0 0 auto", padding: "4px 7px", borderRadius: 999, fontSize: 10.5, fontWeight: 800, textTransform: "uppercase" };
const messageListStyle: React.CSSProperties = { margin: "10px 0 0", paddingLeft: 20, color: COLORS.muted, fontSize: 12.5, lineHeight: 1.5 };
const lockedStyle: React.CSSProperties = { marginTop: 18, padding: "12px 14px", color: COLORS.navy, background: COLORS.peach, border: `1px solid ${COLORS.border}`, lineHeight: 1.5, fontSize: 13 };
const disabledButtonStyle: React.CSSProperties = { marginTop: 12, padding: "10px 15px", border: 0, borderRadius: 7, background: COLORS.navy, color: "#fff", opacity: 0.5, fontWeight: 800 };
const linkStyle: React.CSSProperties = { color: COLORS.navy, fontWeight: 800 };
const errorStyle: React.CSSProperties = { color: COLORS.error, lineHeight: 1.5 };
const selectionHelpStyle: React.CSSProperties = { margin: "14px 0 0", color: COLORS.muted, fontSize: 13, lineHeight: 1.5 };
const rowChoiceStyle: React.CSSProperties = { display: "flex", alignItems: "flex-start", gap: 10 };
const checkboxStyle: React.CSSProperties = { width: 17, height: 17, marginTop: 1, accentColor: COLORS.navy };
