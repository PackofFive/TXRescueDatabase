"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  previewRescueWorkbook,
  RESCUE_WORKBOOK_MAX_BYTES,
  RESCUE_WORKBOOK_SCHEMA_VERSION,
  RESCUE_WORKBOOK_TEMPLATE_ID,
  type PreviewSeverity,
  type WorkbookPreview,
} from "@/lib/rescueWorkbookPreview";

type PreviewFilter =
  | "all"
  | PreviewSeverity;

type ImportHistoryJob = {
  id: string;
  status: string;
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
  row_count: number;
  selected_count: number;
};

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  peach: "#FBE3DA",
  pink: "#F7E8EC",
  text: "#1E3A5F",
  muted: "#4A5D75",
  border: "#DCE4EC",
  surface: "#FFFFFF",
  background: "#FFFDFC",
  error: "#B23B2E",
  warning: "#8A5A00",
};

export default function DataImportsPage() {
  const [file, setFile] =
    useState<File | null>(null);
  const [preview, setPreview] =
    useState<WorkbookPreview | null>(null);
  const [error, setError] =
    useState<string | null>(null);
  const [loading, setLoading] =
    useState(false);
  const [filter, setFilter] =
    useState<PreviewFilter>("all");
  const [saving, setSaving] =
    useState(false);
  const [savedJobId, setSavedJobId] =
    useState<string | null>(null);
  const [saveError, setSaveError] =
    useState<string | null>(null);
  const [matchCounts, setMatchCounts] =
    useState<{
      creates: number;
      updates: number;
      reviews: number;
      errors: number;
    } | null>(null);
  const [history, setHistory] =
    useState<ImportHistoryJob[]>([]);
  const [historyError, setHistoryError] =
    useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const response = await fetch("/api/imports/preview", {
        cache: "no-store",
      });
      const result = (await response.json()) as {
        jobs?: ImportHistoryJob[];
        error?: string;
      };

      if (!response.ok || !result.jobs) {
        throw new Error(
          result.error || "Import history could not be loaded."
        );
      }

      setHistory(result.jobs);
      setHistoryError(null);
    } catch (err) {
      setHistoryError(
        err instanceof Error
          ? err.message
          : "Import history could not be loaded."
      );
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const visibleRows = useMemo(() => {
    if (!preview) {
      return [];
    }

    return filter === "all"
      ? preview.rows
      : preview.rows.filter(
          (row) => row.severity === filter
        );
  }, [filter, preview]);

  async function inspectWorkbook() {
    if (!file) {
      setError(
        "Choose the official Pack of Five workbook first."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setPreview(null);
    setFilter("all");
    setSavedJobId(null);
    setSaveError(null);
    setMatchCounts(null);

    try {
      const result =
        await previewRescueWorkbook(file);
      setPreview(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The workbook could not be inspected."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveSecurePreview() {
    if (!preview || saving || savedJobId) return;

    setSaving(true);
    setSaveError(null);

    try {
      const response = await fetch(
        "/api/imports/preview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preview,
            idempotencyKey: crypto.randomUUID(),
          }),
        }
      );
      const result = (await response.json()) as {
        jobId?: string;
        error?: string;
        matchCounts?: {
          creates: number;
          updates: number;
          reviews: number;
          errors: number;
        };
      };

      if (!response.ok || !result.jobId) {
        throw new Error(
          result.error ||
            "The secure preview could not be saved."
        );
      }

      setSavedJobId(result.jobId);
      setMatchCounts(result.matchCounts ?? null);
      await loadHistory();
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "The secure preview could not be saved."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section style={pageStyle}>
      <p style={eyebrowStyle}>
        Rescue Manager
      </p>

      <h1 style={headingStyle}>
        Data &amp; Imports
      </h1>

      <p style={introStyle}>
        Upload the official Pack of Five workbook, review what will change,
        and import when everything looks right. Animals, Medical, and Tasks
        are supported in this release.
      </p>

      <div style={stepsStyle} aria-label="Import progress">
        <span style={activeStepStyle}>1 Upload</span>
        <span style={pendingStepStyle}>2 Review</span>
        <span style={pendingStepStyle}>3 Results</span>
      </div>

      <div style={privacyNoticeStyle}>
        <strong>Your workbook stays private.</strong>{" "}
        It is checked in this browser and the file itself is not stored.
        Nothing changes until you review and confirm the import.
      </div>

      <div style={uploadCardStyle}>
        <div>
          <h2 style={cardHeadingStyle}>
            Import Pack of Five Workbook
          </h2>

          <p style={bodyStyle}>
            Required template:{" "}
            <strong>
              {RESCUE_WORKBOOK_TEMPLATE_ID}
            </strong>{" "}
            · Schema {RESCUE_WORKBOOK_SCHEMA_VERSION}
            {" "}· XLSX only · Maximum{" "}
            {Math.round(
              RESCUE_WORKBOOK_MAX_BYTES /
                1024 /
                1024
            )}{" "}
            MB
          </p>
        </div>

        <label style={fileLabelStyle}>
          Select workbook
          <input
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(event) => {
              setFile(
                event.target.files?.[0] ?? null
              );
              setPreview(null);
              setError(null);
              setSavedJobId(null);
              setSaveError(null);
              setMatchCounts(null);
            }}
            style={fileInputStyle}
          />
        </label>

        {file && (
          <p style={selectedFileStyle}>
            Selected: <strong>{file.name}</strong>
            {" · "}
            {formatBytes(file.size)}
          </p>
        )}

        <button
          type="button"
          onClick={inspectWorkbook}
          disabled={!file || loading}
          style={{
            ...primaryButtonStyle,
            opacity: !file || loading ? 0.55 : 1,
          }}
        >
          {loading
            ? "Checking Workbook…"
            : "Check Workbook"}
        </button>

        {error && (
          <p role="alert" style={errorStyle}>
            {error}
          </p>
        )}
      </div>

      {preview && (
        <PreviewResults
          preview={preview}
          filter={filter}
          setFilter={setFilter}
          visibleRows={visibleRows}
          saving={saving}
          savedJobId={savedJobId}
          saveError={saveError}
          saveSecurePreview={saveSecurePreview}
          matchCounts={matchCounts}
        />
      )}

      <ImportHistory
        jobs={history}
        error={historyError}
      />
    </section>
  );
}

function ImportHistory({
  jobs,
  error,
}: {
  jobs: ImportHistoryJob[];
  error: string | null;
}) {
  return (
    <section style={historySectionStyle}>
      <p style={eyebrowStyle}>Audit trail</p>
      <h2 style={previewHeadingStyle}>Import History</h2>
      <p style={bodyStyle}>
        Saved previews for the currently selected organization. Workbook files
        are not stored.
      </p>

      {error && <p role="alert" style={errorStyle}>{error}</p>}

      {!error && jobs.length === 0 && (
        <p style={emptyHistoryStyle}>No saved previews yet.</p>
      )}

      <div style={historyListStyle}>
        {jobs.map((job) => {
          const counts = job.summary.matchCounts;

          return (
            <a
              key={job.id}
              href={`/portal/data-imports/${job.id}`}
              style={historyCardStyle}
            >
              <div>
                <strong>
                  {job.summary.fileName || "Pack of Five workbook"}
                </strong>
                <div style={rowMetaStyle}>
                  {new Date(job.created_at).toLocaleString()} ·{" "}
                  {job.uploaded_by_email}
                </div>
                <div style={historyDetailStyle}>
                  {counts
                    ? `${counts.creates} create · ${counts.updates} update · ${counts.reviews} review · ${counts.errors} error`
                    : `${job.row_count} preview rows`}
                  {` · ${job.selected_count} selected`}
                </div>
              </div>
              <span style={historyStatusStyle}>
                {historyStatusLabel(job.status)}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function historyStatusLabel(status: string) {
  if (status === "blocked") return "Needs correction";
  if (status === "ready") return "Ready for review";
  if (status === "committed") return "Imported";
  if (status === "rolled_back") return "Rolled back";
  if (status === "failed") return "Failed";
  return status.replaceAll("_", " ");
}

function PreviewResults({
  preview,
  filter,
  setFilter,
  visibleRows,
  saving,
  savedJobId,
  saveError,
  saveSecurePreview,
  matchCounts,
}: {
  preview: WorkbookPreview;
  filter: PreviewFilter;
  setFilter: (filter: PreviewFilter) => void;
  visibleRows: WorkbookPreview["rows"];
  saving: boolean;
  savedJobId: string | null;
  saveError: string | null;
  saveSecurePreview: () => void;
  matchCounts: {
    creates: number;
    updates: number;
    reviews: number;
    errors: number;
  } | null;
}) {
  const empty = preview.counts.total === 0;
  const displayedRows = visibleRows.slice(0, 50);

  return (
    <div style={{ marginTop: 24 }}>
      <div style={previewHeaderStyle}>
        <div>
          <p style={eyebrowStyle}>Preview</p>
          <h2 style={previewHeadingStyle}>
            {empty
              ? "Valid empty template"
              : "Workbook is ready to review"}
          </h2>
          <p style={bodyStyle}>
            {preview.fileName} · Template{" "}
            {preview.templateId} · Schema{" "}
            {preview.schemaVersion}
          </p>
        </div>

        <span
          style={{
            ...statusBadgeStyle,
            background:
              preview.counts.errors > 0
                ? COLORS.pink
                : COLORS.mint,
            color:
              preview.counts.errors > 0
                ? COLORS.error
                : COLORS.navy,
          }}
        >
          {preview.counts.errors > 0
            ? "Needs correction"
            : "Preview passed"}
        </span>
      </div>

      <div style={summaryGridStyle}>
        <SummaryCard
          label="Records"
          value={preview.counts.total}
        />
        <SummaryCard
          label="Ready to Create"
          value={preview.counts.ready}
        />
        <SummaryCard
          label="Needs Review"
          value={preview.counts.warnings}
        />
        <SummaryCard
          label="Errors"
          value={preview.counts.errors}
        />
      </div>

      <div style={sheetGridStyle}>
        {preview.sheets.map((sheet) => (
          <div key={sheet.sheet} style={sheetCardStyle}>
            <strong>{sheet.sheet}</strong>
            <span style={sheetCountStyle}>
              {sheet.total} record
              {sheet.total === 1 ? "" : "s"}
            </span>
            <span style={sheetDetailStyle}>
              {sheet.ready} ready · {sheet.warnings}{" "}
              review · {sheet.errors} errors
            </span>
          </div>
        ))}
      </div>

      {preview.deferredSheets.length > 0 && (
        <p style={deferredStyle}>
          Deferred for later rollout:{" "}
          {preview.deferredSheets.join(", ")}.
        </p>
      )}

      {!empty && (
        <>
          <div style={filterBarStyle}>
            {(
              [
                ["all", "All"],
                ["ready", "Ready"],
                ["warning", "Needs Review"],
                ["error", "Errors"],
              ] as const
            ).map(([key, label]) => (
              <button
                type="button"
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  ...filterButtonStyle,
                  background:
                    filter === key
                      ? COLORS.navy
                      : COLORS.surface,
                  color:
                    filter === key
                      ? "#fff"
                      : COLORS.navy,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={rowsStyle}>
            {visibleRows.length === 0 ? (
              <p style={bodyStyle}>
                No records match this filter.
              </p>
            ) : (
              displayedRows.map((row) => (
                <article key={row.id} style={rowCardStyle}>
                  <div style={rowHeaderStyle}>
                    <div>
                      <strong>{row.label}</strong>
                      <div style={rowMetaStyle}>
                        {row.sheet} · Row {row.rowNumber}
                        {row.recordId
                          ? ` · ID ${row.recordId}`
                          : ""}
                      </div>
                    </div>

                    <span
                      style={{
                        ...smallBadgeStyle,
                        ...severityStyle(row.severity),
                      }}
                    >
                      {severityLabel(row.severity)}
                    </span>
                  </div>

                  {row.messages.length > 0 && (
                    <ul style={messageListStyle}>
                      {row.messages.map((message) => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))
            )}
          </div>
          {visibleRows.length > displayedRows.length && (
            <p style={bodyStyle}>
              Showing the first {displayedRows.length} matching records here.
              The full review screen includes search, filters, bulk selection,
              and pages of 50 records.
            </p>
          )}
        </>
      )}

      <div style={commitNoticeStyle}>
        <strong>Nothing has been imported yet.</strong>{" "}
        Continue to match the workbook against your organization and review
        every proposed create, update, warning, or error.
      </div>

      <button
        type="button"
        onClick={saveSecurePreview}
        disabled={saving || Boolean(savedJobId)}
        style={{
          ...primaryButtonStyle,
          opacity: saving || savedJobId ? 0.6 : 1,
        }}
      >
        {savedJobId
          ? "Ready for Review"
          : saving
          ? "Preparing Review…"
          : "Continue to Review"}
      </button>

      {savedJobId && (
        <div style={savedResultStyle}>
          <strong>Your import review is ready.</strong>
          {matchCounts && (
            <span>
              {matchCounts.creates} create · {matchCounts.updates}{" "}
              update · {matchCounts.reviews} review ·{" "}
              {matchCounts.errors} error
            </span>
          )}
          <span>Reference: {savedJobId}</span>
          <a
            href={`/portal/data-imports/${savedJobId}`}
            style={savedPreviewLinkStyle}
          >
            Open Import Review
          </a>
        </div>
      )}

      {saveError && (
        <p role="alert" style={errorStyle}>
          {saveError}
        </p>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div style={summaryCardStyle}>
      <strong style={summaryValueStyle}>{value}</strong>
      <span style={summaryLabelStyle}>{label}</span>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
}

function severityLabel(severity: PreviewSeverity) {
  if (severity === "ready") return "Ready";
  if (severity === "warning") return "Review";
  return "Error";
}

function severityStyle(
  severity: PreviewSeverity
): React.CSSProperties {
  if (severity === "ready") {
    return {
      background: COLORS.mint,
      color: COLORS.navy,
    };
  }

  if (severity === "warning") {
    return {
      background: COLORS.peach,
      color: COLORS.warning,
    };
  }

  return {
    background: COLORS.pink,
    color: COLORS.error,
  };
}

const pageStyle: React.CSSProperties = {
  maxWidth: 1040,
};

const eyebrowStyle: React.CSSProperties = {
  margin: "0 0 7px",
  color: COLORS.coral,
  fontSize: 11.5,
  fontWeight: 800,
  letterSpacing: ".1em",
  textTransform: "uppercase",
};

const headingStyle: React.CSSProperties = {
  margin: 0,
  color: COLORS.navy,
  fontSize: 32,
  lineHeight: 1.12,
};

const introStyle: React.CSSProperties = {
  maxWidth: 760,
  margin: "12px 0 18px",
  color: COLORS.muted,
  fontSize: 15,
  lineHeight: 1.6,
};

const stepsStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 16,
};

const activeStepStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  background: COLORS.navy,
  color: "#fff",
  fontSize: 12,
  fontWeight: 800,
};

const pendingStepStyle: React.CSSProperties = {
  ...activeStepStyle,
  background: "#EEF1F4",
  color: COLORS.muted,
};

const bodyStyle: React.CSSProperties = {
  margin: "7px 0 0",
  color: COLORS.muted,
  fontSize: 13.5,
  lineHeight: 1.55,
};

const privacyNoticeStyle: React.CSSProperties = {
  padding: "12px 14px",
  background: COLORS.mint,
  color: COLORS.navy,
  border: `1px solid ${COLORS.border}`,
  fontSize: 13.5,
  lineHeight: 1.5,
};

const uploadCardStyle: React.CSSProperties = {
  marginTop: 18,
  padding: 20,
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 10,
};

const cardHeadingStyle: React.CSSProperties = {
  margin: 0,
  color: COLORS.navy,
  fontSize: 19,
};

const fileLabelStyle: React.CSSProperties = {
  display: "block",
  marginTop: 18,
  color: COLORS.navy,
  fontSize: 13,
  fontWeight: 750,
};

const fileInputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 7,
  padding: 10,
  boxSizing: "border-box",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 7,
  background: COLORS.background,
  color: COLORS.text,
};

const selectedFileStyle: React.CSSProperties = {
  margin: "10px 0 0",
  color: COLORS.muted,
  fontSize: 12.5,
  overflowWrap: "anywhere",
};

const primaryButtonStyle: React.CSSProperties = {
  marginTop: 14,
  padding: "10px 15px",
  border: 0,
  borderRadius: 7,
  background: COLORS.navy,
  color: "#fff",
  cursor: "pointer",
  fontWeight: 800,
};

const errorStyle: React.CSSProperties = {
  margin: "12px 0 0",
  color: COLORS.error,
  fontSize: 13,
  lineHeight: 1.5,
};

const successStyle: React.CSSProperties = {
  margin: "10px 0 0",
  color: COLORS.navy,
  fontSize: 13,
  fontWeight: 750,
  overflowWrap: "anywhere",
};

const savedResultStyle: React.CSSProperties = {
  ...successStyle,
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: "11px 13px",
  background: COLORS.mint,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 7,
};

const savedPreviewLinkStyle: React.CSSProperties = {
  alignSelf: "flex-start",
  marginTop: 4,
  color: COLORS.navy,
  fontWeight: 800,
};

const historySectionStyle: React.CSSProperties = {
  marginTop: 34,
  paddingTop: 24,
  borderTop: `1px solid ${COLORS.border}`,
};

const historyListStyle: React.CSSProperties = {
  display: "grid",
  gap: 9,
  marginTop: 14,
};

const historyCardStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 14,
  padding: 14,
  color: COLORS.navy,
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 8,
  textDecoration: "none",
};

const historyDetailStyle: React.CSSProperties = {
  marginTop: 6,
  color: COLORS.muted,
  fontSize: 12,
  lineHeight: 1.45,
};

const historyStatusStyle: React.CSSProperties = {
  flex: "0 0 auto",
  padding: "5px 8px",
  color: COLORS.navy,
  background: COLORS.mint,
  borderRadius: 999,
  fontSize: 10.5,
  fontWeight: 800,
  textTransform: "capitalize",
};

const emptyHistoryStyle: React.CSSProperties = {
  marginTop: 14,
  padding: 14,
  color: COLORS.muted,
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 8,
  fontSize: 13,
};

const previewHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
};

const previewHeadingStyle: React.CSSProperties = {
  margin: 0,
  color: COLORS.navy,
  fontSize: 22,
};

const statusBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  padding: "7px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
};

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(145px, 1fr))",
  gap: 10,
  marginTop: 16,
};

const summaryCardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 14,
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 8,
};

const summaryValueStyle: React.CSSProperties = {
  color: COLORS.navy,
  fontSize: 25,
};

const summaryLabelStyle: React.CSSProperties = {
  color: COLORS.muted,
  fontSize: 12,
};

const sheetGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(190px, 1fr))",
  gap: 10,
  marginTop: 16,
};

const sheetCardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 14,
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 8,
  color: COLORS.navy,
};

const sheetCountStyle: React.CSSProperties = {
  color: COLORS.muted,
  fontSize: 13,
};

const sheetDetailStyle: React.CSSProperties = {
  color: COLORS.muted,
  fontSize: 11.5,
};

const deferredStyle: React.CSSProperties = {
  margin: "12px 0 0",
  color: COLORS.muted,
  fontSize: 12.5,
  lineHeight: 1.5,
};

const filterBarStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 18,
};

const filterButtonStyle: React.CSSProperties = {
  padding: "7px 10px",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 999,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 750,
};

const rowsStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  marginTop: 12,
};

const rowCardStyle: React.CSSProperties = {
  padding: 14,
  background: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 8,
  color: COLORS.navy,
};

const rowHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
};

const rowMetaStyle: React.CSSProperties = {
  marginTop: 4,
  color: COLORS.muted,
  fontSize: 11.5,
  overflowWrap: "anywhere",
};

const smallBadgeStyle: React.CSSProperties = {
  flex: "0 0 auto",
  padding: "4px 7px",
  borderRadius: 999,
  fontSize: 10.5,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: ".05em",
};

const messageListStyle: React.CSSProperties = {
  margin: "10px 0 0",
  paddingLeft: 20,
  color: COLORS.muted,
  fontSize: 12.5,
  lineHeight: 1.5,
};

const commitNoticeStyle: React.CSSProperties = {
  marginTop: 18,
  padding: "12px 14px",
  background: COLORS.peach,
  border: `1px solid ${COLORS.border}`,
  color: COLORS.navy,
  fontSize: 13,
  lineHeight: 1.5,
};
