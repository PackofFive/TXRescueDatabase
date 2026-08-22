"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Medication = {
  id: string;
  animal_id: string;
  medication_name: string;
  dosage: string | null;
  frequency: string | null;
  instructions: string | null;
  started_at: string | null;
  ended_at: string | null;
  next_due_at: string | null;
  prescribing_vet: string | null;
  pharmacy: string | null;
  notes: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type Administration = {
  id: string;
  medication_id: string;
  animal_id: string;
  administered_at: string;
  dose_given: string | null;
  notes: string | null;
  recorded_by: string | null;
  recorded_by_email: string | null;
  created_at: string;
};

type MedicalDocument = {
  id: string;
  animal_id: string;
  title: string;
  document_type: string | null;
  veterinary_provider: string | null;
  record_date: string | null;
  notes: string | null;
  original_filename: string;
  content_type: string;
  file_size: string | number | null;
  created_at: string;
  updated_at: string;
};

type Animal = {
  id: string;
  name: string | null;
  temporary_name: string | null;
};

type MedicationDraft = {
  medicationName: string;
  dosage: string;
  frequency: string;
  instructions: string;
  startedAt: string;
  endedAt: string;
  nextDueAt: string;
  prescribingVet: string;
  pharmacy: string;
  notes: string;
  active: boolean;
};

type DocumentDraft = {
  title: string;
  documentType: string;
  veterinaryProvider: string;
  recordDate: string;
  notes: string;
};

type DoseDraft = {
  administeredAt: string;
  doseGiven: string;
  notes: string;
};

type ScannedMedication = {
  medicationName: string;
  strength: string;
  doseGiven: string;
  frequency: string;
  instructions: string;
  prescribingVet: string;
  pharmacy: string;
  quantity: string;
  rawDirections: string;
  confidence: "high" | "medium" | "low";
};

export default function MedicalPage() {
  const params = useParams();
  const animalId = params?.id as string;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [showAddMedication, setShowAddMedication] = useState(false);
  const [editingMedicationId, setEditingMedicationId] =
    useState<string | null>(null);

  const [savingMedication, setSavingMedication] = useState(false);

  const [draft, setDraft] = useState<MedicationDraft>(
    emptyMedicationDraft()
  );

  const [showMedicationHistory, setShowMedicationHistory] =
    useState(false);

  const [showMedicationScan, setShowMedicationScan] =
    useState(false);

  const [medicationScanFile, setMedicationScanFile] =
    useState<File | null>(null);

  const [scanningMedication, setScanningMedication] =
    useState(false);

  const [scanResult, setScanResult] =
    useState<ScannedMedication | null>(null);

  const [showDocumentUpload, setShowDocumentUpload] =
    useState(false);

  const [documentDraft, setDocumentDraft] =
    useState<DocumentDraft>(emptyDocumentDraft());

  const [documentFile, setDocumentFile] =
    useState<File | null>(null);

  const [uploadingDocument, setUploadingDocument] =
    useState(false);

  const [doseMedication, setDoseMedication] =
    useState<Medication | null>(null);

  const [doseDraft, setDoseDraft] =
    useState<DoseDraft>(emptyDoseDraft());

  const [savingDose, setSavingDose] =
    useState(false);

  useEffect(() => {
    if (!animalId) return;
    loadPage();
  }, [animalId]);

  async function loadPage() {
    setLoading(true);
    setError(null);

    try {
      const animalRes = await fetch(
        `/api/animals/${encodeURIComponent(animalId)}`,
        {
          cache: "no-store",
        }
      );

      const animalData = await animalRes.json();

      if (!animalRes.ok) {
        throw new Error(
          animalData.error ?? "Couldn't load animal."
        );
      }

      setAnimal({
        id: animalData.animal.id,
        name: animalData.animal.name,
        temporary_name: animalData.animal.temporary_name,
      });

      const [medRes, docRes] = await Promise.all([
        fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/medications`,
          {
            cache: "no-store",
          }
        ),

        fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/medical-documents`,
          {
            cache: "no-store",
          }
        ),
      ]);

      const medData = await medRes.json();
      const docData = await docRes.json();

      if (!medRes.ok) {
        throw new Error(
          medData.error ?? "Couldn't load medications."
        );
      }

      if (!docRes.ok) {
        throw new Error(
          docData.error ?? "Couldn't load veterinary records."
        );
      }

      setMedications(medData.medications ?? []);
      setDocuments(docData.documents ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load medical information."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     MEDICATION SCAN
  ===================================================== */

  function beginMedicationScan() {
    setShowMedicationScan(true);
    setMedicationScanFile(null);
    setScanResult(null);
    setError(null);
    setMessage(null);
  }

  function cancelMedicationScan() {
    setShowMedicationScan(false);
    setMedicationScanFile(null);
    setScanResult(null);
  }

  async function scanMedicationLabel(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!medicationScanFile) {
      setError(
        "Select or take a photo of the medication label."
      );
      return;
    }

    setScanningMedication(true);
    setError(null);
    setMessage(null);
    setScanResult(null);

    try {
      const formData = new FormData();

      formData.append(
        "file",
        medicationScanFile
      );

      const res = await fetch(
        `/api/animals/${encodeURIComponent(
          animalId
        )}/medications/scan`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't scan medication label."
        );
      }

      setScanResult(data.extracted);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't scan medication label."
      );
    } finally {
      setScanningMedication(false);
    }
  }

  function useScannedMedication() {
    if (!scanResult) return;

    const dosage =
      scanResult.doseGiven ||
      scanResult.strength ||
      "";

    const instructions =
      scanResult.rawDirections ||
      scanResult.instructions ||
      "";

    const extraNotes: string[] = [];

    if (scanResult.quantity) {
      extraNotes.push(
        `Prescription quantity: ${scanResult.quantity}`
      );
    }

    if (
      scanResult.strength &&
      scanResult.doseGiven &&
      scanResult.strength !== scanResult.doseGiven
    ) {
      extraNotes.push(
        `Label strength: ${scanResult.strength}`
      );
    }

    setDraft({
      medicationName: scanResult.medicationName,
      dosage,
      frequency: scanResult.frequency,
      instructions,
      startedAt: "",
      endedAt: "",
      nextDueAt: "",
      prescribingVet: scanResult.prescribingVet,
      pharmacy: scanResult.pharmacy,
      notes: extraNotes.join("\n"),
      active: true,
    });

    setEditingMedicationId(null);
    setShowAddMedication(true);

    setShowMedicationScan(false);
    setMedicationScanFile(null);
    setScanResult(null);

    setMessage(
      "Medication label scanned. Review the information before saving."
    );
  }

  /* =====================================================
     DOSE
  ===================================================== */

  function beginDose(
    medication: Medication
  ) {
    setDoseMedication(medication);

    setDoseDraft({
      administeredAt: currentLocalDateTime(),
      doseGiven: medication.dosage ?? "",
      notes: "",
    });

    setError(null);
    setMessage(null);
  }

  function cancelDose() {
    setDoseMedication(null);
    setDoseDraft(emptyDoseDraft());
  }

  async function recordDose(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!doseMedication) return;

    setSavingDose(true);
    setError(null);
    setMessage(null);

    try {
      const administeredDate =
        new Date(doseDraft.administeredAt);

      if (
        Number.isNaN(
          administeredDate.getTime()
        )
      ) {
        throw new Error(
          "Dose date or time is invalid."
        );
      }

      const res = await fetch(
        `/api/animals/${encodeURIComponent(
          animalId
        )}/medications/${encodeURIComponent(
          doseMedication.id
        )}/dose`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            administeredAt:
              administeredDate.toISOString(),

            doseGiven:
              doseDraft.doseGiven,

            notes:
              doseDraft.notes,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't record medication dose."
        );
      }

      setMedications((current) =>
        current.map((medication) =>
          medication.id === doseMedication.id
            ? data.medication
            : medication
        )
      );

      if (
        data.nextDueCalculated &&
        data.medication.next_due_at
      ) {
        setMessage(
          `Dose recorded. Next dose is due ${formatDateTime(
            data.medication.next_due_at
          )}.`
        );
      } else {
        setMessage(
          "Dose recorded. Review the next due time if the schedule could not be automatically calculated."
        );
      }

      setDoseMedication(null);
      setDoseDraft(emptyDoseDraft());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't record medication dose."
      );
    } finally {
      setSavingDose(false);
    }
  }

  /* =====================================================
     ADD / EDIT MEDICATION
  ===================================================== */

  function beginAddMedication() {
    setEditingMedicationId(null);
    setDraft(emptyMedicationDraft());
    setShowAddMedication(true);
    setError(null);
    setMessage(null);
  }

  async function createMedication(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!draft.medicationName.trim()) {
      setError(
        "Medication name is required."
      );
      return;
    }

    setSavingMedication(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(
        `/api/animals/${encodeURIComponent(
          animalId
        )}/medications`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(draft),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't add medication."
        );
      }

      setMedications((current) => [
        data.medication,
        ...current,
      ]);

      setDraft(emptyMedicationDraft());
      setShowAddMedication(false);

      setMessage("Medication added.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't add medication."
      );
    } finally {
      setSavingMedication(false);
    }
  }

  function beginEditMedication(
    medication: Medication
  ) {
    setShowAddMedication(false);

    setEditingMedicationId(
      medication.id
    );

    setDraft({
      medicationName:
        medication.medication_name ?? "",

      dosage:
        medication.dosage ?? "",

      frequency:
        medication.frequency ?? "",

      instructions:
        medication.instructions ?? "",

      startedAt:
        toLocalInputValue(
          medication.started_at
        ),

      endedAt:
        toLocalInputValue(
          medication.ended_at
        ),

      nextDueAt:
        toLocalInputValue(
          medication.next_due_at
        ),

      prescribingVet:
        medication.prescribing_vet ?? "",

      pharmacy:
        medication.pharmacy ?? "",

      notes:
        medication.notes ?? "",

      active:
        medication.active,
    });

    setError(null);
    setMessage(null);
  }

  async function saveMedication(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!editingMedicationId) return;

    if (!draft.medicationName.trim()) {
      setError(
        "Medication name is required."
      );
      return;
    }

    setSavingMedication(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(
        `/api/animals/${encodeURIComponent(
          animalId
        )}/medications`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            medicationId:
              editingMedicationId,

            ...draft,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't update medication."
        );
      }

      setMedications((current) =>
        current.map((medication) =>
          medication.id ===
          editingMedicationId
            ? data.medication
            : medication
        )
      );

      setEditingMedicationId(null);
      setDraft(emptyMedicationDraft());
      setShowAddMedication(false);

      setMessage(
        "Medication updated."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't update medication."
      );
    } finally {
      setSavingMedication(false);
    }
  }

  async function setMedicationActive(
    medication: Medication,
    active: boolean
  ) {
    setSavingMedication(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(
        `/api/animals/${encodeURIComponent(
          animalId
        )}/medications`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            medicationId:
              medication.id,

            medicationName:
              medication.medication_name,

            active,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't update medication."
        );
      }

      setMedications((current) =>
        current.map((item) =>
          item.id === medication.id
            ? data.medication
            : item
        )
      );

      setMessage(
        active
          ? "Medication reactivated."
          : "Medication moved to history."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't update medication."
      );
    } finally {
      setSavingMedication(false);
    }
  }

  /* =====================================================
     DOCUMENTS
  ===================================================== */

  function beginDocumentUpload() {
    setShowDocumentUpload(true);
    setDocumentDraft(
      emptyDocumentDraft()
    );
    setDocumentFile(null);
    setError(null);
    setMessage(null);
  }

  function cancelDocumentUpload() {
    setShowDocumentUpload(false);
    setDocumentDraft(
      emptyDocumentDraft()
    );
    setDocumentFile(null);
  }

  async function uploadDocument(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!documentFile) {
      setError(
        "Select a PDF or image to upload."
      );
      return;
    }

    setUploadingDocument(true);
    setError(null);
    setMessage(null);

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        documentFile
      );

      formData.append(
        "title",
        documentDraft.title
      );

      formData.append(
        "documentType",
        documentDraft.documentType
      );

      formData.append(
        "veterinaryProvider",
        documentDraft.veterinaryProvider
      );

      formData.append(
        "recordDate",
        documentDraft.recordDate
      );

      formData.append(
        "notes",
        documentDraft.notes
      );

      const res = await fetch(
        `/api/animals/${encodeURIComponent(
          animalId
        )}/medical-documents`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't upload veterinary record."
        );
      }

      setDocuments((current) => [
        data.document,
        ...current,
      ]);

      setShowDocumentUpload(false);
      setDocumentDraft(
        emptyDocumentDraft()
      );
      setDocumentFile(null);

      setMessage(
        "Veterinary record uploaded."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't upload veterinary record."
      );
    } finally {
      setUploadingDocument(false);
    }
  }

  const activeMedications =
    useMemo(
      () =>
        medications.filter(
          (medication) =>
            medication.active
        ),
      [medications]
    );

  const medicationHistory =
    useMemo(
      () =>
        medications.filter(
          (medication) =>
            !medication.active
        ),
      [medications]
    );

  if (loading) {
    return <p>Loading…</p>;
  }

  const animalName =
    animal?.name ||
    animal?.temporary_name ||
    "Animal";

  return (
    <section>
      <a
        href={`/animals/${encodeURIComponent(
          animalId
        )}`}
        style={backLink}
      >
        ← Back to {animalName}
      </a>

      <div style={pageHeader}>
        <div>
          <p style={eyebrow}>
            PRIVATE RESCUE MANAGER
          </p>

          <h1 style={pageTitle}>
            Medical
          </h1>

          <p style={pageDescription}>
            Medical records, medications, veterinary
            documents, procedures, and care tracking for{" "}
            {animalName}.
          </p>
        </div>

        <div style={headerActions}>
          <button
            type="button"
            onClick={beginMedicationScan}
            style={secondaryButton}
          >
            Scan Medication Label
          </button>

          <button
            type="button"
            onClick={beginDocumentUpload}
            style={secondaryButton}
          >
            Upload Vet Record
          </button>

          <button
            type="button"
            onClick={beginAddMedication}
            style={primaryButton}
          >
            + Add Medication
          </button>
        </div>
      </div>

      {error && (
        <Notice type="error">
          {error}
        </Notice>
      )}

      {message && (
        <Notice type="success">
          {message}
        </Notice>
      )}

      {/* SCAN MEDICATION */}

      {showMedicationScan && (
        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <h2 style={panelTitleStyle}>
                Scan Medication Label
              </h2>

              <p style={panelDescriptionStyle}>
                Upload or photograph a prescription bottle
                or veterinary medication label. Review all
                extracted information before saving.
              </p>
            </div>

            <button
              type="button"
              onClick={cancelMedicationScan}
              style={textButton}
            >
              Close
            </button>
          </div>

          {!scanResult ? (
            <form onSubmit={scanMedicationLabel}>
              <Field label="Medication Label Photo *">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  onChange={(e) =>
                    setMedicationScanFile(
                      e.target.files?.[0] ??
                        null
                    )
                  }
                  style={fileInputStyle}
                />
              </Field>

              <div style={formActions}>
                <button
                  type="submit"
                  disabled={scanningMedication}
                  style={primaryButton}
                >
                  {scanningMedication
                    ? "Reading Label…"
                    : "Scan Label"}
                </button>

                <button
                  type="button"
                  onClick={cancelMedicationScan}
                  style={secondaryButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div style={reviewBox}>
                <strong>
                  Review extracted information
                </strong>

                <p style={reviewText}>
                  Scan confidence:{" "}
                  <strong>
                    {capitalize(
                      scanResult.confidence
                    )}
                  </strong>
                  . Nothing has been saved yet.
                </p>
              </div>

              <ScanValue
                label="Medication"
                value={scanResult.medicationName}
              />

              <ScanValue
                label="Strength"
                value={scanResult.strength}
              />

              <ScanValue
                label="Dose"
                value={scanResult.doseGiven}
              />

              <ScanValue
                label="Frequency"
                value={scanResult.frequency}
              />

              <ScanValue
                label="Directions"
                value={
                  scanResult.rawDirections ||
                  scanResult.instructions
                }
              />

              <ScanValue
                label="Prescribing Vet"
                value={scanResult.prescribingVet}
              />

              <ScanValue
                label="Pharmacy"
                value={scanResult.pharmacy}
              />

              <div style={formActions}>
                <button
                  type="button"
                  onClick={useScannedMedication}
                  style={primaryButton}
                >
                  Review in Medication Form
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setScanResult(null);
                    setMedicationScanFile(null);
                  }}
                  style={secondaryButton}
                >
                  Scan Another
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* DOSE FORM */}

      {doseMedication && (
        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <h2 style={panelTitleStyle}>
                Record Dose Given
              </h2>

              <p style={panelDescriptionStyle}>
                {doseMedication.medication_name}
                {doseMedication.frequency
                  ? ` · ${doseMedication.frequency}`
                  : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={cancelDose}
              style={textButton}
            >
              Close
            </button>
          </div>

          <form onSubmit={recordDose}>
            <div style={formGrid}>
              <Field label="Dose Given">
                <input
                  value={doseDraft.doseGiven}
                  onChange={(e) =>
                    setDoseDraft((current) => ({
                      ...current,
                      doseGiven: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>

              <Field label="Date / Time Given *">
                <input
                  type="datetime-local"
                  required
                  value={doseDraft.administeredAt}
                  onChange={(e) =>
                    setDoseDraft((current) => ({
                      ...current,
                      administeredAt:
                        e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>
            </div>

            <div style={{ marginTop: 12 }}>
              <Field label="Notes">
                <textarea
                  rows={3}
                  value={doseDraft.notes}
                  onChange={(e) =>
                    setDoseDraft((current) => ({
                      ...current,
                      notes: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>
            </div>

            <div style={formActions}>
              <button
                type="submit"
                disabled={savingDose}
                style={doseButton}
              >
                {savingDose
                  ? "Recording…"
                  : "Confirm Dose Given"}
              </button>

              <button
                type="button"
                onClick={cancelDose}
                style={secondaryButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* VET DOCUMENT UPLOAD */}

      {showDocumentUpload && (
        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <h2 style={panelTitleStyle}>
                Upload Veterinary Record
              </h2>

              <p style={panelDescriptionStyle}>
                Upload a PDF or photo from the veterinary
                provider.
              </p>
            </div>

            <button
              type="button"
              onClick={cancelDocumentUpload}
              style={textButton}
            >
              Close
            </button>
          </div>

          <form onSubmit={uploadDocument}>
            <Field label="File *">
              <input
                type="file"
                accept=".pdf,image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  setDocumentFile(
                    e.target.files?.[0] ??
                      null
                  )
                }
                style={fileInputStyle}
              />
            </Field>

            <div
              style={{
                ...formGrid,
                marginTop: 14,
              }}
            >
              <Field label="Record Title">
                <input
                  value={documentDraft.title}
                  onChange={(e) =>
                    setDocumentDraft((current) => ({
                      ...current,
                      title: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>

              <Field label="Document Type">
                <select
                  value={documentDraft.documentType}
                  onChange={(e) =>
                    setDocumentDraft((current) => ({
                      ...current,
                      documentType:
                        e.target.value,
                    }))
                  }
                  style={inputStyle}
                >
                  <option value="">
                    Select…
                  </option>
                  <option value="exam">
                    Exam / Visit
                  </option>
                  <option value="vaccination">
                    Vaccination
                  </option>
                  <option value="lab">
                    Lab / Test
                  </option>
                  <option value="surgery">
                    Surgery / Procedure
                  </option>
                  <option value="discharge">
                    Discharge
                  </option>
                  <option value="prescription">
                    Prescription
                  </option>
                  <option value="invoice">
                    Invoice / Receipt
                  </option>
                  <option value="other">
                    Other
                  </option>
                </select>
              </Field>

              <Field label="Veterinary Provider">
                <input
                  value={
                    documentDraft.veterinaryProvider
                  }
                  onChange={(e) =>
                    setDocumentDraft((current) => ({
                      ...current,
                      veterinaryProvider:
                        e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>

              <Field label="Record Date">
                <input
                  type="date"
                  value={documentDraft.recordDate}
                  onChange={(e) =>
                    setDocumentDraft((current) => ({
                      ...current,
                      recordDate:
                        e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>
            </div>

            <div style={{ marginTop: 12 }}>
              <Field label="Notes">
                <textarea
                  rows={3}
                  value={documentDraft.notes}
                  onChange={(e) =>
                    setDocumentDraft((current) => ({
                      ...current,
                      notes: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>
            </div>

            <div style={formActions}>
              <button
                type="submit"
                disabled={uploadingDocument}
                style={primaryButton}
              >
                {uploadingDocument
                  ? "Uploading…"
                  : "Upload Record"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ADD / EDIT MEDICATION */}

      {(showAddMedication ||
        editingMedicationId) && (
        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <h2 style={panelTitleStyle}>
              {editingMedicationId
                ? "Edit Medication"
                : "Add Medication"}
            </h2>

            <button
              type="button"
              onClick={() => {
                setShowAddMedication(false);
                setEditingMedicationId(null);
                setDraft(
                  emptyMedicationDraft()
                );
              }}
              style={textButton}
            >
              Close
            </button>
          </div>

          <form
            onSubmit={
              editingMedicationId
                ? saveMedication
                : createMedication
            }
          >
            <div style={formGrid}>
              <Field label="Medication Name *">
                <input
                  required
                  value={draft.medicationName}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      medicationName:
                        e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>

              <Field label="Dosage">
                <input
                  value={draft.dosage}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      dosage: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>

              <Field label="Frequency">
                <input
                  value={draft.frequency}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      frequency:
                        e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>

              <Field label="Prescribing Vet">
                <input
                  value={draft.prescribingVet}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      prescribingVet:
                        e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>

              <Field label="Pharmacy">
                <input
                  value={draft.pharmacy}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      pharmacy:
                        e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>

              <Field label="Start Date / Time">
                <input
                  type="datetime-local"
                  value={draft.startedAt}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      startedAt:
                        e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>

              <Field label="End Date / Time">
                <input
                  type="datetime-local"
                  value={draft.endedAt}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      endedAt:
                        e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>

              <Field label="Next Due">
                <input
                  type="datetime-local"
                  value={draft.nextDueAt}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      nextDueAt:
                        e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>
            </div>

            <div style={{ marginTop: 12 }}>
              <Field label="Instructions">
                <textarea
                  rows={3}
                  value={draft.instructions}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      instructions:
                        e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>
            </div>

            <div style={{ marginTop: 12 }}>
              <Field label="Notes">
                <textarea
                  rows={3}
                  value={draft.notes}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      notes: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>
            </div>

            <div style={formActions}>
              <button
                type="submit"
                disabled={savingMedication}
                style={primaryButton}
              >
                {savingMedication
                  ? "Saving…"
                  : editingMedicationId
                  ? "Save Medication"
                  : "Add Medication"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ACTIVE MEDICATIONS */}

      <section style={{ marginBottom: 26 }}>
        <div style={sectionHeading}>
          <h2 style={sectionTitleStyle}>
            Active Medications
          </h2>

          <span style={countStyle}>
            {activeMedications.length}
          </span>
        </div>

        {activeMedications.length === 0 && (
          <EmptyState>
            No active medications recorded.
          </EmptyState>
        )}

        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          {activeMedications.map(
            (medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                animalId={animalId}
                onDose={beginDose}
                onEdit={beginEditMedication}
                onArchive={() =>
                  setMedicationActive(
                    medication,
                    false
                  )
                }
              />
            )
          )}
        </div>
      </section>

      {/* VET RECORDS */}

      <section style={{ marginBottom: 26 }}>
        <div style={sectionHeading}>
          <div>
            <h2 style={sectionTitleStyle}>
              Veterinary Records
            </h2>

            <p style={smallDescriptionStyle}>
              Original veterinary PDFs and images stored
              privately with this animal&apos;s medical file.
            </p>
          </div>

          <span style={countStyle}>
            {documents.length}
          </span>
        </div>

        {documents.length === 0 && (
          <EmptyState>
            No veterinary documents uploaded yet.
          </EmptyState>
        )}

        <div
          style={{
            display: "grid",
            gap: 9,
          }}
        >
          {documents.map((document) => (
            <MedicalDocumentCard
              key={document.id}
              document={document}
              animalId={animalId}
            />
          ))}
        </div>
      </section>

      {/* MEDICATION HISTORY */}

      <section>
        <button
          type="button"
          onClick={() =>
            setShowMedicationHistory(
              (current) => !current
            )
          }
          style={historyToggle}
        >
          <div>
            <strong
              style={{
                display: "block",
                color: "#17233C",
              }}
            >
              Medication History
            </strong>

            <span
              style={{
                color: "#6B6862",
                fontSize: 12,
              }}
            >
              {medicationHistory.length} inactive medication
              {medicationHistory.length === 1
                ? ""
                : "s"}
            </span>
          </div>

          <span>
            {showMedicationHistory
              ? "⌃"
              : "⌄"}
          </span>
        </button>

        {showMedicationHistory && (
          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 10,
            }}
          >
            {medicationHistory.length ===
              0 && (
              <EmptyState>
                No medication history yet.
              </EmptyState>
            )}

            {medicationHistory.map(
              (medication) => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  animalId={animalId}
                  onEdit={beginEditMedication}
                  onReactivate={() =>
                    setMedicationActive(
                      medication,
                      true
                    )
                  }
                />
              )
            )}
          </div>
        )}
      </section>
    </section>
  );
}

/* =========================================================
   MEDICATION CARD
========================================================= */

function MedicationCard({
  medication,
  animalId,
  onDose,
  onEdit,
  onArchive,
  onReactivate,
}: {
  medication: Medication;
  animalId: string;
  onDose?: (
    medication: Medication
  ) => void;
  onEdit: (
    medication: Medication
  ) => void;
  onArchive?: () => void;
  onReactivate?: () => void;
}) {
  const [showDoseHistory, setShowDoseHistory] =
    useState(false);

  const [administrations, setAdministrations] =
    useState<Administration[] | null>(null);

  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [historyError, setHistoryError] =
    useState<string | null>(null);

  const overdue =
    Boolean(
      medication.active &&
        medication.next_due_at &&
        new Date(
          medication.next_due_at
        ).getTime() <
          Date.now()
    );

  async function toggleDoseHistory() {
    const opening =
      !showDoseHistory;

    setShowDoseHistory(
      opening
    );

    if (
      opening &&
      administrations === null
    ) {
      await loadDoseHistory();
    }
  }

  async function loadDoseHistory() {
    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const res = await fetch(
        `/api/animals/${encodeURIComponent(
          animalId
        )}/medications/${encodeURIComponent(
          medication.id
        )}/administrations`,
        {
          cache: "no-store",
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't load dose history."
        );
      }

      setAdministrations(
        data.administrations ?? []
      );
    } catch (err) {
      setHistoryError(
        err instanceof Error
          ? err.message
          : "Couldn't load dose history."
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  return (
    <article
      style={{
        background: "#fff",

        border: overdue
          ? "1px solid #E6C3BD"
          : "1px solid #E7E5E1",

        borderLeft: overdue
          ? "5px solid #B23B2E"
          : "5px solid #2B5C8A",

        borderRadius: 9,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: 15,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: 14,
            alignItems:
              "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 200,
            }}
          >
            <strong
              style={{
                color: "#17233C",
                fontSize: 15,
              }}
            >
              {medication.medication_name}
            </strong>

            <div
              style={{
                color: "#6B6862",
                fontSize: 12.5,
                marginTop: 4,
              }}
            >
              {[
                medication.dosage,
                medication.frequency,
              ]
                .filter(Boolean)
                .join(" · ") ||
                "Dose / frequency not recorded"}
            </div>

            {medication.next_due_at && (
              <div
                style={{
                  marginTop: 7,
                  fontSize: 12.5,
                  color: overdue
                    ? "#B23B2E"
                    : "#4F4D49",
                  fontWeight: overdue
                    ? 700
                    : 500,
                }}
              >
                {overdue
                  ? "Overdue · "
                  : "Next due · "}

                {formatDateTime(
                  medication.next_due_at
                )}
              </div>
            )}

            {medication.instructions && (
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#4F4D49",
                  fontSize: 13,
                }}
              >
                {medication.instructions}
              </p>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: 7,
              flexWrap: "wrap",
            }}
          >
            {onDose && (
              <button
                type="button"
                onClick={() =>
                  onDose(medication)
                }
                style={doseButton}
              >
                Dose Given
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                onEdit(medication)
              }
              style={secondaryButton}
            >
              Open / Edit
            </button>

            {onArchive && (
              <button
                type="button"
                onClick={onArchive}
                style={textButton}
              >
                Move to History
              </button>
            )}

            {onReactivate && (
              <button
                type="button"
                onClick={onReactivate}
                style={textButton}
              >
                Reactivate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DOSE HISTORY */}

      <button
        type="button"
        onClick={toggleDoseHistory}
        style={doseHistoryToggle}
      >
        <span>
          Dose History
          {administrations !== null
            ? ` (${administrations.length})`
            : ""}
        </span>

        <span>
          {showDoseHistory
            ? "⌃"
            : "⌄"}
        </span>
      </button>

      {showDoseHistory && (
        <div style={doseHistoryPanel}>
          {historyLoading && (
            <p style={smallMuted}>
              Loading dose history…
            </p>
          )}

          {historyError && (
            <p
              style={{
                ...smallMuted,
                color: "#B23B2E",
              }}
            >
              {historyError}
            </p>
          )}

          {!historyLoading &&
            administrations?.length ===
              0 && (
              <p style={smallMuted}>
                No doses recorded yet.
              </p>
            )}

          {administrations?.map(
            (administration) => (
              <div
                key={administration.id}
                style={doseHistoryRow}
              >
                <div>
                  <strong
                    style={{
                      display: "block",
                      color: "#17233C",
                      fontSize: 12.5,
                    }}
                  >
                    {formatDateTime(
                      administration.administered_at
                    )}
                  </strong>

                  <div style={smallMuted}>
                    {administration.dose_given ||
                      "Dose not specified"}
                  </div>
                </div>

                <div
                  style={{
                    minWidth: 160,
                  }}
                >
                  {administration.recorded_by_email && (
                    <div style={smallMuted}>
                      Recorded by{" "}
                      {
                        administration.recorded_by_email
                      }
                    </div>
                  )}

                  {administration.notes && (
                    <div
                      style={{
                        marginTop: 3,
                        color: "#4F4D49",
                        fontSize: 12,
                      }}
                    >
                      {administration.notes}
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </article>
  );
}

/* =========================================================
   DOCUMENT CARD
========================================================= */

function MedicalDocumentCard({
  document,
  animalId,
}: {
  document: MedicalDocument;
  animalId: string;
}) {
  return (
    <article style={documentCard}>
      <div>
        <strong
          style={{
            color: "#17233C",
          }}
        >
          {document.title}
        </strong>

        <div style={smallMuted}>
          {[
            document.document_type
              ? formatDocumentType(
                  document.document_type
                )
              : "Veterinary Record",

            document.veterinary_provider,

            document.record_date
              ? formatDate(
                  document.record_date
                )
              : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </div>
      </div>

      <a
        href={`/api/animals/${encodeURIComponent(
          animalId
        )}/medical-documents/${encodeURIComponent(
          document.id
        )}`}
        target="_blank"
        rel="noreferrer"
        style={secondaryLink}
      >
        Open Record
      </a>
    </article>
  );
}

function ScanValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={scanRow}>
      <div style={smallMuted}>
        {label}
      </div>

      <div>
        {value ||
          "Not detected"}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children:
    React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
      </label>

      {children}
    </div>
  );
}

function Notice({
  type,
  children,
}: {
  type:
    | "success"
    | "error";
  children:
    React.ReactNode;
}) {
  return (
    <div
      style={
        type === "success"
          ? successNotice
          : errorNotice
      }
    >
      {children}
    </div>
  );
}

function EmptyState({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div style={emptyState}>
      {children}
    </div>
  );
}

function emptyMedicationDraft(): MedicationDraft {
  return {
    medicationName: "",
    dosage: "",
    frequency: "",
    instructions: "",
    startedAt: "",
    endedAt: "",
    nextDueAt: "",
    prescribingVet: "",
    pharmacy: "",
    notes: "",
    active: true,
  };
}

function emptyDocumentDraft(): DocumentDraft {
  return {
    title: "",
    documentType: "",
    veterinaryProvider: "",
    recordDate: "",
    notes: "",
  };
}

function emptyDoseDraft(): DoseDraft {
  return {
    administeredAt:
      currentLocalDateTime(),
    doseGiven: "",
    notes: "",
  };
}

function currentLocalDateTime() {
  const now =
    new Date();

  return new Date(
    now.getTime() -
      now.getTimezoneOffset() *
        60000
  )
    .toISOString()
    .slice(0, 16);
}

function toLocalInputValue(
  value: string | null
) {
  if (!value) return "";

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return new Date(
    date.getTime() -
      date.getTimezoneOffset() *
        60000
  )
    .toISOString()
    .slice(0, 16);
}

function formatDateTime(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString(
    [],
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

function formatDate(
  value: string
) {
  const date =
    new Date(value);

  return date.toLocaleDateString();
}

function formatDocumentType(
  value: string
) {
  return value
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

function capitalize(
  value: string
) {
  return value
    ? value.charAt(0).toUpperCase() +
        value.slice(1)
    : "";
}

/* =========================================================
   STYLES
========================================================= */

const pageHeader:
  React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginTop: 18,
    marginBottom: 24,
    flexWrap: "wrap",
  };

const eyebrow:
  React.CSSProperties = {
    margin: 0,
    fontSize: 12,
    fontWeight: 800,
    color: "#6B6862",
    letterSpacing: ".08em",
  };

const pageTitle:
  React.CSSProperties = {
    color: "#17233C",
    fontSize: 28,
    margin: "6px 0",
  };

const pageDescription:
  React.CSSProperties = {
    margin: 0,
    color: "#6B6862",
    lineHeight: 1.55,
  };

const headerActions:
  React.CSSProperties = {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  };

const formGrid:
  React.CSSProperties = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 12,
  };

const formActions:
  React.CSSProperties = {
    display: "flex",
    gap: 8,
    marginTop: 16,
    flexWrap: "wrap",
  };

const panelStyle:
  React.CSSProperties = {
    background: "#fff",
    border: "1px solid #E7E5E1",
    borderRadius: 10,
    padding: 18,
    marginBottom: 22,
  };

const panelHeaderStyle:
  React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  };

const panelTitleStyle:
  React.CSSProperties = {
    margin: 0,
    color: "#17233C",
    fontSize: 18,
  };

const panelDescriptionStyle:
  React.CSSProperties = {
    margin: "5px 0 0",
    color: "#6B6862",
    fontSize: 13,
  };

const sectionHeading:
  React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  };

const sectionTitleStyle:
  React.CSSProperties = {
    margin: 0,
    color: "#17233C",
    fontSize: 17,
  };

const countStyle:
  React.CSSProperties = {
    color: "#6B6862",
    fontSize: 12.5,
  };

const smallDescriptionStyle:
  React.CSSProperties = {
    margin: "4px 0 0",
    color: "#6B6862",
    fontSize: 12.5,
  };

const inputStyle:
  React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #D8D6D2",
    borderRadius: 7,
    padding: 9,
    fontFamily: "inherit",
    fontSize: 13.5,
  };

const fileInputStyle:
  React.CSSProperties = {
    ...inputStyle,
    background: "#FAFAF9",
  };

const labelStyle:
  React.CSSProperties = {
    display: "block",
    fontSize: 11.5,
    color: "#6B6862",
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 5,
  };

const primaryButton:
  React.CSSProperties = {
    background: "#17233C",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "9px 14px",
    fontWeight: 700,
    cursor: "pointer",
  };

const doseButton:
  React.CSSProperties = {
    background: "#2F6F4E",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "8px 11px",
    fontWeight: 700,
    cursor: "pointer",
  };

const secondaryButton:
  React.CSSProperties = {
    background: "#fff",
    color: "#17233C",
    border: "1px solid #D8D6D2",
    borderRadius: 7,
    padding: "8px 11px",
    fontWeight: 700,
    cursor: "pointer",
  };

const secondaryLink:
  React.CSSProperties = {
    ...secondaryButton,
    textDecoration: "none",
  };

const textButton:
  React.CSSProperties = {
    background: "transparent",
    color: "#6B6862",
    border: "none",
    padding: 8,
    cursor: "pointer",
  };

const historyToggle:
  React.CSSProperties = {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    border: "1px solid #E7E5E1",
    borderRadius: 9,
    padding: "13px 15px",
    cursor: "pointer",
    textAlign: "left",
  };

const doseHistoryToggle:
  React.CSSProperties = {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "none",
    borderTop: "1px solid #EEECE8",
    background: "#FAFAF9",
    padding: "9px 14px",
    color: "#4F4D49",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  };

const doseHistoryPanel:
  React.CSSProperties = {
    background: "#FAFAF9",
    borderTop: "1px solid #EEECE8",
    padding: "4px 14px 12px",
  };

const doseHistoryRow:
  React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    padding: "10px 0",
    borderBottom: "1px solid #EEECE8",
    flexWrap: "wrap",
  };

const documentCard:
  React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    background: "#fff",
    border: "1px solid #E7E5E1",
    borderRadius: 9,
    padding: 14,
  };

const scanRow:
  React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    gap: 10,
    padding: "8px 0",
    borderBottom: "1px solid #EEECE8",
  };

const reviewBox:
  React.CSSProperties = {
    background: "#EEF4F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  };

const reviewText:
  React.CSSProperties = {
    margin: "4px 0 0",
    color: "#6B6862",
    fontSize: 12.5,
  };

const smallMuted:
  React.CSSProperties = {
    color: "#6B6862",
    fontSize: 12,
    margin: 0,
  };

const emptyState:
  React.CSSProperties = {
    background: "#fff",
    border: "1px dashed #D8D6D2",
    borderRadius: 8,
    padding: 18,
    color: "#6B6862",
    fontSize: 13.5,
  };

const successNotice:
  React.CSSProperties = {
    background: "#EEF4F0",
    border: "1px solid #C9DDD1",
    color: "#2F6F4E",
    borderRadius: 8,
    padding: 11,
    marginBottom: 16,
  };

const errorNotice:
  React.CSSProperties = {
    background: "#FFF4F2",
    border: "1px solid #F3C7BF",
    color: "#B23B2E",
    borderRadius: 8,
    padding: 11,
    marginBottom: 16,
  };

const backLink:
  React.CSSProperties = {
    color: "#C05621",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 600,
  };
