"use client";

import {
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
        Inspect the official Pack of Five Rescue
        Operations Tracker before any records are
        written. This first release validates and
        previews Animals, Medical, and Tasks only.
      </p>

      <div style={privacyNoticeStyle}>
        <strong>Private preview only.</strong>{" "}
        The workbook is read in this browser and is
        not uploaded or saved. This page cannot
        change your Rescue Manager records.
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
            ? "Inspecting Workbook…"
            : "Validate & Preview"}
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
    </section>
  );
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

  return (
    <div style={{ marginTop: 24 }}>
      <div style={previewHeaderStyle}>
        <div>
          <p style={eyebrowStyle}>Preview</p>
          <h2 style={previewHeadingStyle}>
            {empty
              ? "Valid empty template"
              : "Workbook validation results"}
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
              visibleRows.map((row) => (
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
        </>
      )}

      <div style={commitNoticeStyle}>
        <strong>Animal record changes remain disabled.</strong>
        {" "}Saving this preview records its validation
        results for your organization, but does not upload
        the workbook or create, update, or delete any rescue
        records.
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
          ? "Secure Preview Saved"
          : saving
          ? "Saving Secure Preview…"
          : "Save Secure Preview"}
      </button>

      {savedJobId && (
        <div style={savedResultStyle}>
          <strong>Preview saved and matched safely.</strong>
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
            Review Saved Preview
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
