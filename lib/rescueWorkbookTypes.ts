export const RESCUE_WORKBOOK_TEMPLATE_ID =
  "POF-RESCUE-OPS";
export const RESCUE_WORKBOOK_SCHEMA_VERSION =
  "1.0";
export const RESCUE_WORKBOOK_MAX_BYTES =
  5 * 1024 * 1024;
export const RESCUE_WORKBOOK_MAX_ROWS =
  5000;

export type PreviewSeverity =
  | "ready"
  | "warning"
  | "error";

export type PhaseOneSheet =
  | "Animals"
  | "Medical"
  | "Foster Placements"
  | "Tasks";

export type PreviewRow = {
  id: string;
  sheet: PhaseOneSheet;
  rowNumber: number;
  action: "create" | "review" | "error";
  severity: PreviewSeverity;
  recordId: string;
  label: string;
  messages: string[];
  values: Record<string, string>;
};

export type SheetPreview = {
  sheet: PhaseOneSheet;
  total: number;
  ready: number;
  warnings: number;
  errors: number;
};

export type WorkbookPreview = {
  fileName: string;
  fileSize: number;
  templateId: string;
  schemaVersion: string;
  sheets: SheetPreview[];
  rows: PreviewRow[];
  counts: {
    total: number;
    ready: number;
    warnings: number;
    errors: number;
  };
  deferredSheets: string[];
};
