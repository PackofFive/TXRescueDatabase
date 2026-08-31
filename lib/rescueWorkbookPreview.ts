import {
  RESCUE_WORKBOOK_MAX_BYTES,
  RESCUE_WORKBOOK_MAX_ROWS,
  RESCUE_WORKBOOK_SCHEMA_VERSION,
  RESCUE_WORKBOOK_TEMPLATE_ID,
  type PhaseOneSheet,
  type PreviewRow,
  type PreviewSeverity,
  type SheetPreview,
  type WorkbookPreview,
} from "@/lib/rescueWorkbookTypes";

export {
  RESCUE_WORKBOOK_MAX_BYTES,
  RESCUE_WORKBOOK_MAX_ROWS,
  RESCUE_WORKBOOK_SCHEMA_VERSION,
  RESCUE_WORKBOOK_TEMPLATE_ID,
};
export type {
  PhaseOneSheet,
  PreviewRow,
  PreviewSeverity,
  SheetPreview,
  WorkbookPreview,
};

type SheetDefinition = {
  sheet: PhaseOneSheet;
  headers: string[];
  fields: string[];
  idField: string;
  labelField: string;
};

const PHASE_ONE_SHEETS: SheetDefinition[] = [
  {
    sheet: "Animals",
    headers: [
      "Animal ID",
      "Name",
      "Species / Type",
      "Breed / Description",
      "Sex",
      "Estimated DOB",
      "Intake Date",
      "Intake Source",
      "Current Location",
      "Status",
      "Coordinator",
      "Microchip",
      "Priority",
      "Next Action",
      "Due Date",
      "Notes",
    ],
    fields: [
      "animal_id",
      "name",
      "species_type",
      "breed_description",
      "sex",
      "estimated_dob",
      "intake_date",
      "intake_source",
      "current_location",
      "status",
      "coordinator",
      "microchip",
      "priority",
      "next_action",
      "due_date",
      "notes",
    ],
    idField: "animal_id",
    labelField: "name",
  },
  {
    sheet: "Medical",
    headers: [
      "Medical Record ID",
      "Animal ID",
      "Animal Name",
      "Date",
      "Provider",
      "Service / Vaccine",
      "Medication / Dose",
      "Result / Lot",
      "Next Due",
      "Cost",
      "Document Link",
      "Notes",
    ],
    fields: [
      "external_medical_record_id",
      "animal_id",
      "animal_name",
      "service_date",
      "provider",
      "service_vaccine",
      "medication_dose",
      "result_lot",
      "next_due",
      "cost",
      "document_link",
      "notes",
    ],
    idField: "external_medical_record_id",
    labelField: "service_vaccine",
  },
  {
    sheet: "Foster Placements",
    headers: [
      "Foster Assignment ID",
      "Animal ID",
      "Animal Name",
      "Foster Name",
      "Foster Email",
      "Foster Phone",
      "Start Date",
      "Review Date",
      "Expected End",
      "Status",
      "Coordinator",
      "Supplies Issued",
      "Next Check-In",
      "Notes",
    ],
    fields: [
      "external_foster_assignment_id",
      "animal_id",
      "animal_name",
      "foster_name",
      "foster_email",
      "foster_phone",
      "start_date",
      "review_date",
      "expected_end",
      "status",
      "coordinator",
      "supplies_issued",
      "next_check_in",
      "notes",
    ],
    idField: "external_foster_assignment_id",
    labelField: "foster_name",
  },
  {
    sheet: "Tasks",
    headers: [
      "Task ID",
      "Area",
      "Animal ID",
      "Task",
      "Owner",
      "Priority",
      "Status",
      "Created Date",
      "Due Date",
      "Completed Date",
      "Overdue?",
      "Notes",
    ],
    fields: [
      "task_id",
      "area",
      "animal_id",
      "task",
      "owner",
      "priority",
      "status",
      "created_date",
      "due_date",
      "completed_date",
      "overdue_display_only",
      "notes",
    ],
    idField: "task_id",
    labelField: "task",
  },
];

const DEFERRED_SHEETS = [
  "Adoption Pipeline",
  "Volunteers",
  "Donations",
];

const DATE_FIELDS = new Set([
  "intake_date",
  "due_date",
  "service_date",
  "next_due",
  "created_date",
  "completed_date",
  "start_date",
  "review_date",
]);

export async function previewRescueWorkbook(
  file: File
): Promise<WorkbookPreview> {
  validateFile(file);

  const bytes = await file.arrayBuffer();
  const signature = new Uint8Array(bytes.slice(0, 4));

  if (
    signature[0] !== 0x50 ||
    signature[1] !== 0x4b ||
    signature[2] !== 0x03 ||
    signature[3] !== 0x04
  ) {
    throw new Error(
      "This file is not a valid XLSX workbook."
    );
  }

  const workbook = await readOfficialXlsx(file);
  const schemaSheet = workbook.get("Import Schema");

  if (!schemaSheet) {
    throw new Error(
      "The official Import Schema worksheet is missing."
    );
  }

  const templateId =
    schemaSheet.get("B3")?.text ?? "";
  const schemaVersion =
    schemaSheet.get("B5")?.text ?? "";

  if (
    templateId !==
    RESCUE_WORKBOOK_TEMPLATE_ID
  ) {
    throw new Error(
      `Unsupported template. Expected ${RESCUE_WORKBOOK_TEMPLATE_ID}.`
    );
  }

  if (
    schemaVersion !==
    RESCUE_WORKBOOK_SCHEMA_VERSION
  ) {
    throw new Error(
      `Unsupported schema version. Expected ${RESCUE_WORKBOOK_SCHEMA_VERSION}.`
    );
  }

  const rows: PreviewRow[] = [];
  const stableIds = new Map<string, number[]>();

  for (const definition of PHASE_ONE_SHEETS) {
    const worksheet =
      workbook.get(definition.sheet);

    if (!worksheet) {
      throw new Error(
        `Required worksheet “${definition.sheet}” is missing.`
      );
    }

    validateHeaders(worksheet, definition);

    const lastRow = Math.max(
      ...Array.from(worksheet.values()).map(
        (cell) => cell.row
      ),
      3
    );

    if (
      lastRow - 3 >
      RESCUE_WORKBOOK_MAX_ROWS
    ) {
      throw new Error(
        `${definition.sheet} exceeds the ${RESCUE_WORKBOOK_MAX_ROWS.toLocaleString()}-row preview limit.`
      );
    }

    for (
      let rowNumber = 4;
      rowNumber <= lastRow;
      rowNumber += 1
    ) {
      const values: Record<string, string> = {};
      const formulaFields: string[] = [];

      definition.fields.forEach((field, index) => {
        const address =
          `${columnName(index + 1)}${rowNumber}`;
        const cell = worksheet.get(address);
        let text = cell?.text ?? "";

        if (
          text &&
          DATE_FIELDS.has(field) &&
          /^\d+(?:\.\d+)?$/.test(text)
        ) {
          text = excelSerialToIsoDate(Number(text));
        }

        values[field] = text;

        if (
          cell?.hadFormula &&
          field !== "overdue_display_only"
        ) {
          formulaFields.push(
            definition.headers[index]
          );
        }
      });

      if (isBlankRecord(values)) {
        continue;
      }

      const messages: string[] = [];

      if (formulaFields.length > 0) {
        messages.push(
          `Formula detected in ${formulaFields.join(", ")}; only its saved display value was read.`
        );
      }

      for (const field of DATE_FIELDS) {
        if (
          values[field] &&
          !isIsoDate(values[field])
        ) {
          messages.push(
            `${fieldLabel(field)} must use yyyy-mm-dd.`
          );
        }
      }

      validateRequiredValues(
        definition.sheet,
        values,
        messages
      );

      const recordId =
        values[definition.idField] ?? "";

      if (recordId) {
        const stableKey = `${definition.sheet}:${recordId}`;
        const occurrences = stableIds.get(stableKey) ?? [];
        occurrences.push(rowNumber);
        stableIds.set(stableKey, occurrences);
      }

      const hasError = messages.some(
        (message) =>
          message.startsWith("Required:") ||
          message.includes("must use yyyy-mm-dd")
      );
      const needsMatch = Boolean(recordId);
      const severity: PreviewSeverity = hasError
        ? "error"
        : formulaFields.length > 0 || needsMatch
        ? "warning"
        : "ready";

      if (needsMatch && !hasError) {
        messages.push(
          "This stable ID must be matched inside the organization before an update can be approved."
        );
      }

      rows.push({
        id: `${definition.sheet}-${rowNumber}`,
        sheet: definition.sheet,
        rowNumber,
        action: hasError
          ? "error"
          : needsMatch || formulaFields.length > 0
          ? "review"
          : "create",
        severity,
        recordId,
        label:
          values[definition.labelField] ||
          values.animal_name ||
          `${definition.sheet} row ${rowNumber}`,
        messages,
        values,
      });
    }
  }

  for (const [stableKey, rowNumbers] of stableIds) {
    if (rowNumbers.length < 2) continue;
    const separator = stableKey.indexOf(":");
    const sheet = stableKey.slice(0, separator);
    const recordId = stableKey.slice(separator + 1);

    for (const row of rows) {
      if (row.sheet === sheet && row.recordId === recordId) {
        row.severity = "error";
        row.action = "error";
        const message = `Duplicate stable ID appears on rows ${rowNumbers.join(", ")}.`;
        if (!row.messages.includes(message)) row.messages.push(message);
      }
    }
  }

  const workbookAnimalIds = new Set(
    rows
      .filter(
        (row) =>
          row.sheet === "Animals" &&
          Boolean(row.recordId)
      )
      .map((row) => row.recordId)
  );

  for (const row of rows) {
    if (
      row.sheet === "Animals" ||
      !row.values.animal_id ||
      workbookAnimalIds.has(row.values.animal_id)
    ) {
      continue;
    }

    row.severity = "error";
    row.action = "error";
    row.messages.push(
      "Animal ID is not present on the Animals worksheet."
    );
  }

  const sheets = PHASE_ONE_SHEETS.map(
    ({ sheet }) => summarizeSheet(sheet, rows)
  );
  const counts = summarizeRows(rows);

  return {
    fileName: file.name,
    fileSize: file.size,
    templateId,
    schemaVersion,
    sheets,
    rows,
    counts,
    deferredSheets: DEFERRED_SHEETS,
  };
}

function validateFile(file: File) {
  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    throw new Error(
      "Choose the official .xlsx workbook."
    );
  }

  if (file.size === 0) {
    throw new Error("The workbook is empty.");
  }

  if (file.size > RESCUE_WORKBOOK_MAX_BYTES) {
    throw new Error(
      "The workbook is larger than the 5 MB preview limit."
    );
  }
}

function validateHeaders(
  worksheet: ParsedWorksheet,
  definition: SheetDefinition
) {
  const actual = definition.headers.map((_, index) =>
    worksheet.get(
      `${columnName(index + 1)}3`
    )?.text ?? ""
  );

  definition.headers.forEach((expected, index) => {
    if (actual[index] !== expected) {
      throw new Error(
        `${definition.sheet} column ${index + 1} must be “${expected}”.`
      );
    }
  });
}

function validateRequiredValues(
  sheet: PhaseOneSheet,
  values: Record<string, string>,
  messages: string[]
) {
  if (
    sheet === "Animals" &&
    !values.animal_id &&
    !values.name
  ) {
    messages.push(
      "Required: provide an Animal ID or Name."
    );
  }

  if (
    sheet === "Medical" &&
    !values.animal_id
  ) {
    messages.push(
      "Required: Medical rows need an Animal ID."
    );
  }

  if (
    sheet === "Medical" &&
    !values.service_date
  ) {
    messages.push(
      "Required: Medical rows need a Date."
    );
  }

  if (
    sheet === "Foster Placements" &&
    !values.animal_id
  ) {
    messages.push(
      "Required: Foster Placement rows need an Animal ID."
    );
  }

  if (
    sheet === "Foster Placements" &&
    !values.foster_email
  ) {
    messages.push(
      "Required: Foster Placement rows need a Foster Email for safe matching."
    );
  }

  if (
    sheet === "Foster Placements" &&
    !values.start_date
  ) {
    messages.push(
      "Required: Foster Placement rows need a Start Date."
    );
  }

  if (
    sheet === "Tasks" &&
    !values.task
  ) {
    messages.push(
      "Required: Task rows need a Task description."
    );
  }
}

function isBlankRecord(
  values: Record<string, string>
) {
  return Object.entries(values).every(
    ([field, value]) =>
      field === "overdue_display_only" ||
      value === ""
  );
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function fieldLabel(field: string) {
  return field
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function summarizeSheet(
  sheet: PhaseOneSheet,
  rows: PreviewRow[]
): SheetPreview {
  const sheetRows = rows.filter(
    (row) => row.sheet === sheet
  );
  const counts = summarizeRows(sheetRows);

  return {
    sheet,
    total: counts.total,
    ready: counts.ready,
    warnings: counts.warnings,
    errors: counts.errors,
  };
}

function summarizeRows(rows: PreviewRow[]) {
  return {
    total: rows.length,
    ready: rows.filter(
      (row) => row.severity === "ready"
    ).length,
    warnings: rows.filter(
      (row) => row.severity === "warning"
    ).length,
    errors: rows.filter(
      (row) => row.severity === "error"
    ).length,
  };
}

type ParsedCell = {
  address: string;
  row: number;
  text: string;
  hadFormula: boolean;
};

type ParsedWorksheet = Map<string, ParsedCell>;

async function readOfficialXlsx(file: File) {
  const { strFromU8, unzipSync } = await import("fflate");

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let totalUncompressed = 0;
    const entries = unzipSync(bytes, {
      filter(entry) {
        if (
          entry.name === "xl/vbaProject.bin" ||
          entry.name.startsWith("xl/externalLinks/")
        ) {
          throw new Error(
            "Macros and external workbook links are not supported."
          );
        }

        totalUncompressed += entry.originalSize;

        if (totalUncompressed > 20 * 1024 * 1024) {
          throw new Error(
            "The workbook expands beyond the safe preview limit."
          );
        }

        if (entry.originalSize > 5 * 1024 * 1024) {
          throw new Error(
            `${entry.name} exceeds the safe worksheet limit.`
          );
        }

        return (
          entry.name === "xl/workbook.xml" ||
          entry.name === "xl/_rels/workbook.xml.rels" ||
          entry.name === "xl/sharedStrings.xml" ||
          entry.name.startsWith("xl/worksheets/")
        );
      },
    });
    const readText = (path: string) => {
      const entry = entries[path];

      if (!entry) {
        throw new Error(
          `The workbook is missing ${path}.`
        );
      }

      return strFromU8(entry);
    };

    const workbookXml = parseXml(
      readText("xl/workbook.xml")
    );
    const relationshipsXml = parseXml(
      readText("xl/_rels/workbook.xml.rels")
    );
    const sharedStrings = entries["xl/sharedStrings.xml"]
      ? parseSharedStrings(
          parseXml(
            readText("xl/sharedStrings.xml")
          )
        )
      : [];

    const relationshipTargets = new Map<string, string>();

    for (const relationship of Array.from(
      relationshipsXml.getElementsByTagNameNS(
        "*",
        "Relationship"
      )
    )) {
      relationshipTargets.set(
        relationship.getAttribute("Id") ?? "",
        relationship.getAttribute("Target") ?? ""
      );
    }

    const worksheets = new Map<
      string,
      ParsedWorksheet
    >();

    for (const sheet of Array.from(
      workbookXml.getElementsByTagNameNS("*", "sheet")
    )) {
      const name = sheet.getAttribute("name") ?? "";
      const relationshipId =
        sheet.getAttributeNS(
          "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
          "id"
        ) ??
        sheet.getAttribute("r:id") ??
        "";
      const target =
        relationshipTargets.get(relationshipId) ?? "";

      if (!name || !target) {
        throw new Error(
          "The workbook contains an invalid worksheet relationship."
        );
      }

      const normalizedTarget = target.startsWith("/")
        ? target.slice(1)
        : target.startsWith("xl/")
        ? target
        : `xl/${target}`;

      worksheets.set(
        name,
        parseWorksheet(
          parseXml(readText(normalizedTarget)),
          sharedStrings
        )
      );
    }

    return worksheets;
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.startsWith("The workbook")
    ) {
      throw err;
    }

    throw new Error(
      err instanceof Error
        ? `The workbook could not be read: ${err.message}`
        : "The workbook could not be read."
    );
  }
}

function parseXml(xml: string) {
  const document = new DOMParser().parseFromString(
    xml,
    "application/xml"
  );

  if (
    document.getElementsByTagName("parsererror").length > 0
  ) {
    throw new Error(
      "The workbook contains malformed XML."
    );
  }

  return document;
}

function parseSharedStrings(document: Document) {
  return Array.from(
    document.getElementsByTagNameNS("*", "si")
  ).map((item) =>
    Array.from(
      item.getElementsByTagNameNS("*", "t")
    )
      .map((text) => text.textContent ?? "")
      .join("")
  );
}

function parseWorksheet(
  document: Document,
  sharedStrings: string[]
): ParsedWorksheet {
  const cells: ParsedWorksheet = new Map();

  for (const cell of Array.from(
    document.getElementsByTagNameNS("*", "c")
  )) {
    const address = cell.getAttribute("r") ?? "";
    const rowMatch = address.match(/\d+$/);

    if (!address || !rowMatch) {
      continue;
    }

    const type = cell.getAttribute("t") ?? "";
    const value =
      cell.getElementsByTagNameNS("*", "v")[0]
        ?.textContent ?? "";
    const inlineText = Array.from(
      cell.getElementsByTagNameNS("*", "t")
    )
      .map((text) => text.textContent ?? "")
      .join("");
    let text = value;

    if (type === "s") {
      text = sharedStrings[Number(value)] ?? "";
    } else if (type === "inlineStr") {
      text = inlineText;
    } else if (type === "b") {
      text = value === "1" ? "TRUE" : "FALSE";
    }

    cells.set(address, {
      address,
      row: Number(rowMatch[0]),
      text: text.trim(),
      hadFormula:
        cell.getElementsByTagNameNS("*", "f").length > 0,
    });
  }

  return cells;
}

function columnName(columnNumber: number) {
  let number = columnNumber;
  let name = "";

  while (number > 0) {
    const remainder = (number - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    number = Math.floor((number - 1) / 26);
  }

  return name;
}

function excelSerialToIsoDate(serial: number) {
  const milliseconds =
    Math.round(serial - 25569) * 86400000;
  const date = new Date(milliseconds);

  return Number.isNaN(date.getTime())
    ? String(serial)
    : date.toISOString().slice(0, 10);
}
