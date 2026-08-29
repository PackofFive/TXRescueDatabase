export type ImportMapping = {
  mappedFields: Array<{
    source: string;
    destination: string;
    value: string;
  }>;
  deferredFields: Array<{
    source: string;
    value: string;
    reason: string;
  }>;
  warnings: string[];
};

const ANIMAL_DESTINATIONS: Record<string, string> = {
  name: "animals.name",
  species_type: "animals.species",
  breed_description: "animals.breed_or_type",
  sex: "animals.sex",
  estimated_dob: "animals.birth_date",
  intake_date: "animal_custody_events.started_at",
  intake_source: "animals.source",
  notes: "animals.notes",
};

const MEDICAL_DESTINATIONS: Record<string, string> = {
  service_date: "animal_medical_records.occurred_at",
  provider: "animal_medical_records.provider",
  service_vaccine: "animal_medical_records.title",
  next_due: "animal_medical_records.due_at",
  notes: "animal_medical_records.notes",
};

const TASK_DESTINATIONS: Record<string, string> = {
  task: "animal_reminders.title",
  due_date: "animal_reminders.due_at",
  notes: "animal_reminders.notes",
};

const FIELD_LABELS: Record<string, string> = {
  animal_id: "Animal ID",
  external_medical_record_id: "Medical Record ID",
  task_id: "Task ID",
  name: "Name",
  species_type: "Species / Type",
  breed_description: "Breed / Description",
  sex: "Sex",
  estimated_dob: "Estimated DOB",
  intake_date: "Intake Date",
  intake_source: "Intake Source",
  current_location: "Current Location",
  status: "Status",
  coordinator: "Coordinator",
  microchip: "Microchip",
  priority: "Priority",
  next_action: "Next Action",
  due_date: "Due Date",
  notes: "Notes",
  animal_name: "Animal Name",
  service_date: "Date",
  provider: "Provider",
  service_vaccine: "Service / Vaccine",
  medication_dose: "Medication / Dose",
  result_lot: "Result / Lot",
  next_due: "Next Due",
  cost: "Cost",
  document_link: "Document Link",
  area: "Area",
  task: "Task",
  owner: "Owner",
  created_date: "Created Date",
  completed_date: "Completed Date",
  overdue_display_only: "Overdue?",
};

const IDENTIFIER_FIELDS = new Set([
  "animal_id",
  "external_medical_record_id",
  "task_id",
  "animal_name",
]);

const VALID_ANIMAL_URGENCIES = new Set([
  "normal",
  "elevated",
  "urgent",
  "critical",
]);

const VALID_TASK_PRIORITIES = new Set([
  "critical",
  "high",
  "normal",
  "info",
]);

export function mapWorkbookRow(
  sheet: "Animals" | "Medical" | "Tasks",
  values: Record<string, string>
): ImportMapping {
  const mappedFields: ImportMapping["mappedFields"] = [];
  const deferredFields: ImportMapping["deferredFields"] = [];
  const warnings: string[] = [];
  const destinations =
    sheet === "Animals"
      ? ANIMAL_DESTINATIONS
      : sheet === "Medical"
      ? MEDICAL_DESTINATIONS
      : TASK_DESTINATIONS;

  for (const [field, rawValue] of Object.entries(values)) {
    const value = rawValue.trim();
    if (!value || IDENTIFIER_FIELDS.has(field)) continue;

    const destination = destinations[field];
    if (destination) {
      mappedFields.push({
        source: fieldLabel(field),
        destination,
        value,
      });
      continue;
    }

    const normalizedPriority = value.toLowerCase();
    const priorityIsSupported =
      field === "priority" &&
      (sheet === "Animals"
        ? VALID_ANIMAL_URGENCIES.has(normalizedPriority)
        : sheet === "Tasks"
        ? VALID_TASK_PRIORITIES.has(normalizedPriority)
        : false);

    if (priorityIsSupported) {
      mappedFields.push({
        source: fieldLabel(field),
        destination:
          sheet === "Animals"
            ? "animals.urgency"
            : "animal_reminders.priority",
        value: normalizedPriority,
      });
      continue;
    }

    deferredFields.push({
      source: fieldLabel(field),
      value,
      reason: "No approved one-to-one Rescue Manager field yet.",
    });
  }

  if (deferredFields.length > 0) {
    warnings.push(
      `${deferredFields.length} populated field${
        deferredFields.length === 1 ? " is" : "s are"
      } deferred and will not be silently discarded.`
    );
  }

  return { mappedFields, deferredFields, warnings };
}

function fieldLabel(field: string) {
  return (
    FIELD_LABELS[field] ??
    field
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}
