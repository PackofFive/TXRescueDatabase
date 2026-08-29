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
  normalized_payload: {
    mappedFields?: Array<{
      source: string;
      destination: string;
      value: string;
    }>;
    deferredFields?: Array<{
      source: string;
      value: string;
      reason: string;
    }>;
  };
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
    committed_at?: string | null;
    rolled_back_at?: string | null;
    rollback_expires_at?: string | null;
  };
  rows: SavedRow[];
  commitEnabled: boolean;
  confirmation?: Confirmation | null;
};

type PreflightReport = {
  passed: boolean;
  selectedCount: number;
  issues: string[];
  digest: string;
  checkedAt: string;
};

type Confirmation = {
  id: string;
  confirmed_at?: string;
  expires_at: string;
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
  const [preflight, setPreflight] = useState<PreflightReport | null>(null);
  const [checking, setChecking] = useState(false);
  const [preflightError, setPreflightError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmationError, setConfirmationError] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<{
    created: number;
    updated: number;
    rollbackExpiresAt: string;
  } | null>(null);
  const [rollingBack, setRollingBack] = useState(false);
  const [rollbackError, setRollbackError] = useState<string | null>(null);
  const [rollbackComplete, setRollbackComplete] = useState(false);

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

        if (active) {
          setData(result);
          setConfirmation(result.confirmation ?? null);
        }
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
    setPreflight(null);
    setConfirmation(null);

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

  async function runPreflight() {
    if (checking) return;
    setChecking(true);
    setPreflightError(null);

    try {
      const response = await fetch(
        `/api/imports/preview/${encodeURIComponent(params.jobId)}/preflight`,
        { method: "POST" }
      );
      const result = (await response.json()) as {
        preflight?: PreflightReport;
        error?: string;
      };

      if (!response.ok || !result.preflight) {
        throw new Error(
          result.error || "The final safety check could not be completed."
        );
      }

      setPreflight(result.preflight);
      setConfirmation(null);
    } catch (err) {
      setPreflightError(
        err instanceof Error
          ? err.message
          : "The final safety check could not be completed."
      );
    } finally {
      setChecking(false);
    }
  }

  async function approveImport() {
    if (!preflight?.passed || confirming) return;
    setConfirming(true);
    setConfirmationError(null);

    try {
      const response = await fetch(
        `/api/imports/preview/${encodeURIComponent(params.jobId)}/confirm`,
        { method: "POST" }
      );
      const result = (await response.json()) as {
        confirmation?: Confirmation;
        error?: string;
      };

      if (!response.ok || !result.confirmation) {
        throw new Error(
          result.error || "The import approval could not be recorded."
        );
      }

      setConfirmation(result.confirmation);
    } catch (err) {
      setConfirmationError(
        err instanceof Error
          ? err.message
          : "The import approval could not be recorded."
      );
    } finally {
      setConfirming(false);
    }
  }

  async function executeImport() {
    if (!confirmation || executing || !data?.commitEnabled) return;
    if (!window.confirm(
      "Run this approved import now? The selected records will be created or updated as one atomic transaction."
    )) return;

    setExecuting(true);
    setExecutionError(null);

    try {
      const response = await fetch(
        `/api/imports/preview/${encodeURIComponent(params.jobId)}/execute`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmationId: confirmation.id }),
        }
      );
      const payload = (await response.json()) as {
        result?: { created: number; updated: number; rollbackExpiresAt: string };
        error?: string;
      };

      if (!response.ok || !payload.result) {
        throw new Error(payload.error || "The import could not be completed.");
      }

      setExecutionResult(payload.result);
      setConfirmation(null);
      setData({
        ...data,
        commitEnabled: false,
        job: {
          ...data.job,
          status: "committed",
          committed_at: new Date().toISOString(),
          rollback_expires_at: payload.result.rollbackExpiresAt,
        },
      });
    } catch (err) {
      setExecutionError(
        err instanceof Error ? err.message : "The import could not be completed."
      );
    } finally {
      setExecuting(false);
    }
  }

  async function rollbackImport() {
    if (!data || rollingBack) return;
    if (!window.confirm(
      "Roll back this entire import? This will reverse all changes only if none of the imported records changed afterward."
    )) return;

    setRollingBack(true);
    setRollbackError(null);

    try {
      const response = await fetch(
        `/api/imports/preview/${encodeURIComponent(params.jobId)}/rollback`,
        { method: "POST" }
      );
      const payload = (await response.json()) as {
        result?: unknown;
        error?: string;
      };

      if (!response.ok || !payload.result) {
        throw new Error(payload.error || "Rollback could not be completed.");
      }

      setRollbackComplete(true);
      setData({
        ...data,
        job: {
          ...data.job,
          status: "rolled_back",
          rolled_back_at: new Date().toISOString(),
        },
      });
    } catch (err) {
      setRollbackError(
        err instanceof Error ? err.message : "Rollback could not be completed."
      );
    } finally {
      setRollingBack(false);
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
              <FieldMapping row={row} />
            </article>
          ))
        )}
      </div>

      {data.job.status === "ready" && (
        <div style={lockedStyle}>
          <strong>Review before importing.</strong>{" "}
          Run the final safety check, record a short-lived approval, then run
          the import. Neon will apply every selected row or keep none of them.
        </div>
      )}
      <button
        type="button"
        onClick={() => void runPreflight()}
        disabled={checking}
        style={{ ...safetyButtonStyle, opacity: checking ? 0.6 : 1 }}
      >
        {checking ? "Running Final Safety Check…" : "Run Final Safety Check"}
      </button>

      {preflightError && (
        <p role="alert" style={errorStyle}>{preflightError}</p>
      )}

      {preflight && (
        <div style={preflight.passed ? passedStyle : failedStyle}>
          <strong>
            {preflight.passed
              ? "Safety check passed"
              : "Safety check needs attention"}
          </strong>
          <span>{preflight.selectedCount} selected row(s) checked.</span>
          {preflight.issues.length > 0 && (
            <ul style={messageListStyle}>
              {preflight.issues.map((issue) => <li key={issue}>{issue}</li>)}
            </ul>
          )}
        </div>
      )}

      {preflight?.passed && !confirmation && (
        <button
          type="button"
          onClick={() => void approveImport()}
          disabled={confirming}
          style={{ ...approvalButtonStyle, opacity: confirming ? 0.6 : 1 }}
        >
          {confirming ? "Recording Approval…" : "Approve Selected Import"}
        </button>
      )}

      {confirmationError && (
        <p role="alert" style={errorStyle}>{confirmationError}</p>
      )}

      {confirmation && (
        <div style={approvalReceiptStyle}>
          <strong>Approval recorded</strong>
          <span>
            This one-time approval expires at{" "}
            {new Date(confirmation.expires_at).toLocaleTimeString()}.
          </span>
          <span>Receipt: {confirmation.id}</span>
        </div>
      )}

      {confirmation && data.commitEnabled && data.job.status === "ready" && (
        <button
          type="button"
          onClick={() => void executeImport()}
          disabled={executing}
          style={{ ...runButtonStyle, opacity: executing ? 0.6 : 1 }}
        >
          {executing ? "Running Atomic Import…" : "Run Approved Import"}
        </button>
      )}

      {executionError && <p role="alert" style={errorStyle}>{executionError}</p>}

      {(executionResult || data.job.status === "committed") && (
        <div style={commitSuccessStyle}>
          <strong>Import committed successfully</strong>
          {executionResult && (
            <span>
              {executionResult.created} created · {executionResult.updated} updated
            </span>
          )}
          {data.job.rollback_expires_at && (
            <span>
              Rollback available until{" "}
              {new Date(data.job.rollback_expires_at).toLocaleString()}.
            </span>
          )}
          <button
            type="button"
            onClick={() => void rollbackImport()}
            disabled={rollingBack}
            style={rollbackButtonStyle}
          >
            {rollingBack ? "Checking & Rolling Back…" : "Roll Back Entire Import"}
          </button>
        </div>
      )}

      {rollbackError && <p role="alert" style={errorStyle}>{rollbackError}</p>}
      {(rollbackComplete || data.job.status === "rolled_back") && (
        <div style={passedStyle}>
          <strong>Import rolled back successfully</strong>
          <span>The audit history was preserved.</span>
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        <Link href="/portal/data-imports" style={linkStyle}>
          Return to Data &amp; Imports
        </Link>
      </div>
    </section>
  );
}

function FieldMapping({ row }: { row: SavedRow }) {
  const mapped = row.normalized_payload.mappedFields ?? [];
  const deferred = row.normalized_payload.deferredFields ?? [];

  if (mapped.length === 0 && deferred.length === 0) return null;

  return (
    <details style={mappingDetailsStyle}>
      <summary style={mappingSummaryStyle}>
        View field mapping ({mapped.length} mapped, {deferred.length} deferred)
      </summary>

      {mapped.length > 0 && (
        <div style={mappingGroupStyle}>
          <strong>Mapped exactly</strong>
          {mapped.map((field, index) => (
            <div key={`${field.destination}-${index}`} style={mappingLineStyle}>
              <span>{field.source}: {field.value}</span>
              <span style={destinationStyle}>→ {field.destination}</span>
            </div>
          ))}
        </div>
      )}

      {deferred.length > 0 && (
        <div style={mappingGroupStyle}>
          <strong style={{ color: COLORS.warning }}>Deferred</strong>
          {deferred.map((field, index) => (
            <div key={`${field.source}-${index}`} style={mappingLineStyle}>
              <span>{field.source}: {field.value}</span>
              <span style={deferredStyle}>Not imported yet</span>
            </div>
          ))}
        </div>
      )}
    </details>
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
const mappingDetailsStyle: React.CSSProperties = { marginTop: 12, paddingTop: 10, borderTop: `1px solid ${COLORS.border}` };
const mappingSummaryStyle: React.CSSProperties = { color: COLORS.navy, cursor: "pointer", fontSize: 12, fontWeight: 800 };
const mappingGroupStyle: React.CSSProperties = { display: "grid", gap: 6, marginTop: 10, color: COLORS.navy, fontSize: 12 };
const mappingLineStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", gap: 14, padding: "6px 8px", background: "#F8FAFC", borderRadius: 5, overflowWrap: "anywhere" };
const destinationStyle: React.CSSProperties = { color: COLORS.muted, textAlign: "right" };
const deferredStyle: React.CSSProperties = { color: COLORS.warning, textAlign: "right", fontWeight: 750 };
const safetyButtonStyle: React.CSSProperties = { marginTop: 12, padding: "10px 15px", border: 0, borderRadius: 7, background: COLORS.coral, color: "#fff", cursor: "pointer", fontWeight: 800 };
const passedStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 5, marginTop: 10, padding: "12px 14px", color: COLORS.navy, background: COLORS.mint, border: `1px solid ${COLORS.border}`, borderRadius: 7, fontSize: 13 };
const failedStyle: React.CSSProperties = { ...passedStyle, color: COLORS.error, background: COLORS.pink };
const approvalButtonStyle: React.CSSProperties = { marginTop: 12, padding: "10px 15px", border: 0, borderRadius: 7, background: COLORS.navy, color: "#fff", cursor: "pointer", fontWeight: 800 };
const approvalReceiptStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 5, marginTop: 10, padding: "12px 14px", color: COLORS.navy, background: COLORS.mint, border: `1px solid ${COLORS.border}`, borderRadius: 7, fontSize: 13, overflowWrap: "anywhere" };
const runButtonStyle: React.CSSProperties = { marginTop: 12, padding: "11px 16px", border: 0, borderRadius: 7, background: "#16705A", color: "#fff", cursor: "pointer", fontWeight: 850 };
const commitSuccessStyle: React.CSSProperties = { ...passedStyle, marginTop: 14 };
const rollbackButtonStyle: React.CSSProperties = { alignSelf: "flex-start", marginTop: 6, padding: "8px 11px", border: `1px solid ${COLORS.error}`, borderRadius: 6, background: COLORS.surface, color: COLORS.error, cursor: "pointer", fontWeight: 800 };
