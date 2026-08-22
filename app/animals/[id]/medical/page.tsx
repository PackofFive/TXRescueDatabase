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

  const [showDocumentUpload, setShowDocumentUpload] =
    useState(false);

  const [documentDraft, setDocumentDraft] =
    useState<DocumentDraft>(emptyDocumentDraft());

  const [documentFile, setDocumentFile] =
    useState<File | null>(null);

  const [uploadingDocument, setUploadingDocument] =
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
     MEDICATIONS
  ===================================================== */

  function beginAddMedication() {
    setEditingMedicationId(null);
    setDraft(emptyMedicationDraft());
    setShowAddMedication(true);
    setMessage(null);
    setError(null);
  }

  async function createMedication(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!draft.medicationName.trim()) {
      setError("Medication name is required.");
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify(draft),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ?? "Couldn't add medication."
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
    setEditingMedicationId(medication.id);

    setDraft({
      medicationName: medication.medication_name ?? "",
      dosage: medication.dosage ?? "",
      frequency: medication.frequency ?? "",
      instructions: medication.instructions ?? "",
      startedAt: toLocalInputValue(medication.started_at),
      endedAt: toLocalInputValue(medication.ended_at),
      nextDueAt: toLocalInputValue(medication.next_due_at),
      prescribingVet: medication.prescribing_vet ?? "",
      pharmacy: medication.pharmacy ?? "",
      notes: medication.notes ?? "",
      active: medication.active,
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
      setError("Medication name is required.");
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            medicationId: editingMedicationId,
            ...draft,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ?? "Couldn't update medication."
        );
      }

      setMedications((current) =>
        current.map((medication) =>
          medication.id === editingMedicationId
            ? data.medication
            : medication
        )
      );

      setEditingMedicationId(null);
      setDraft(emptyMedicationDraft());

      setMessage("Medication updated.");
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
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            medicationId: medication.id,
            medicationName: medication.medication_name,
            active,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ?? "Couldn't update medication."
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
     VETERINARY DOCUMENTS
  ===================================================== */

  function beginDocumentUpload() {
    setShowDocumentUpload(true);
    setDocumentDraft(emptyDocumentDraft());
    setDocumentFile(null);
    setError(null);
    setMessage(null);
  }

  function cancelDocumentUpload() {
    setShowDocumentUpload(false);
    setDocumentDraft(emptyDocumentDraft());
    setDocumentFile(null);
  }

  async function uploadDocument(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!documentFile) {
      setError("Select a PDF or image to upload.");
      return;
    }

    setUploadingDocument(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();

      formData.append("file", documentFile);
      formData.append("title", documentDraft.title);
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
      formData.append("notes", documentDraft.notes);

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
          data.error ?? "Couldn't upload veterinary record."
        );
      }

      setDocuments((current) => [
        data.document,
        ...current,
      ]);

      setShowDocumentUpload(false);
      setDocumentDraft(emptyDocumentDraft());
      setDocumentFile(null);

      setMessage("Veterinary record uploaded.");
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

  /* =====================================================
     GROUPS
  ===================================================== */

  const activeMedications = useMemo(
    () =>
      medications.filter(
        (medication) => medication.active
      ),
    [medications]
  );

  const medicationHistory = useMemo(
    () =>
      medications.filter(
        (medication) => !medication.active
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          marginTop: 18,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 800,
              color: "#6B6862",
              letterSpacing: ".08em",
            }}
          >
            PRIVATE RESCUE MANAGER
          </p>

          <h1
            style={{
              color: "#17233C",
              fontSize: 28,
              margin: "6px 0 6px",
            }}
          >
            Medical
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6B6862",
              maxWidth: 720,
              lineHeight: 1.55,
            }}
          >
            Medical records, medications, veterinary
            documents, procedures, and care tracking for{" "}
            {animalName}.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
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

      {/* VET RECORD UPLOAD */}

      {showDocumentUpload && (
        <section style={panelStyle}>
          <div style={panelHeaderStyle}>
            <div>
              <h2 style={panelTitleStyle}>
                Upload Veterinary Record
              </h2>

              <p style={panelDescriptionStyle}>
                Upload the original PDF or photo from the
                veterinary provider. These records remain
                private to the managing organization.
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
            <div
              style={{
                marginBottom: 14,
              }}
            >
              <Field label="File *">
                <input
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  onChange={(e) =>
                    setDocumentFile(
                      e.target.files?.[0] ?? null
                    )
                  }
                  style={fileInputStyle}
                />

                <p style={helpTextStyle}>
                  PDF, JPG, PNG, or WebP. Maximum 15 MB.
                </p>
              </Field>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 12,
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
                  placeholder={
                    documentFile?.name ??
                    "Example: Annual Wellness Exam"
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
                      documentType: e.target.value,
                    }))
                  }
                  style={inputStyle}
                >
                  <option value="">
                    Select…
                  </option>

                  <option value="exam">
                    Exam / Visit Record
                  </option>

                  <option value="vaccination">
                    Vaccination Record
                  </option>

                  <option value="lab">
                    Lab / Test Result
                  </option>

                  <option value="surgery">
                    Surgery / Procedure
                  </option>

                  <option value="discharge">
                    Discharge Instructions
                  </option>

                  <option value="prescription">
                    Prescription
                  </option>

                  <option value="invoice">
                    Vet Invoice / Receipt
                  </option>

                  <option value="certificate">
                    Certificate
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
                      veterinaryProvider: e.target.value,
                    }))
                  }
                  placeholder="Clinic or veterinarian"
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
                      recordDate: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </Field>
            </div>

            <div
              style={{
                marginTop: 12,
              }}
            >
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
                  placeholder="Optional internal notes about this record."
                  style={inputStyle}
                />
              </Field>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 16,
              }}
            >
              <button
                type="submit"
                disabled={uploadingDocument}
                style={primaryButton}
              >
                {uploadingDocument
                  ? "Uploading…"
                  : "Upload Record"}
              </button>

              <button
                type="button"
                disabled={uploadingDocument}
                onClick={cancelDocumentUpload}
                style={secondaryButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* MEDICATION FORM */}

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
                setDraft(emptyMedicationDraft());
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(210px, 1fr))",
                gap: 12,
              }}
            >
              <Field label="Medication Name *">
                <input
                  value={draft.medicationName}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      medicationName: e.target.value,
                    }))
                  }
                  style={inputStyle}
                  required
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
                  placeholder="Example: 25 mg"
                  style={inputStyle}
                />
              </Field>

              <Field label="Frequency">
                <input
                  value={draft.frequency}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      frequency: e.target.value,
                    }))
                  }
                  placeholder="Example: Twice daily"
                  style={inputStyle}
                />
              </Field>

              <Field label="Prescribing Vet">
                <input
                  value={draft.prescribingVet}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      prescribingVet: e.target.value,
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
                      pharmacy: e.target.value,
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
                      startedAt: e.target.value,
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
                      endedAt: e.target.value,
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
                      nextDueAt: e.target.value,
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
                      instructions: e.target.value,
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

            {editingMedicationId && (
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginTop: 14,
                  fontSize: 13,
                  color: "#4F4D49",
                }}
              >
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      active: e.target.checked,
                    }))
                  }
                />

                Active medication
              </label>
            )}

            <div
              style={{
                display: "flex",
                gap: 9,
                marginTop: 16,
                flexWrap: "wrap",
              }}
            >
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

              <button
                type="button"
                disabled={savingMedication}
                onClick={() => {
                  setShowAddMedication(false);
                  setEditingMedicationId(null);
                  setDraft(emptyMedicationDraft());
                }}
                style={secondaryButton}
              >
                Cancel
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
          {activeMedications.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onEdit={beginEditMedication}
              onArchive={() =>
                setMedicationActive(medication, false)
              }
            />
          ))}
        </div>
      </section>

      {/* VETERINARY RECORDS */}

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
        <div style={sectionHeading}>
          <h2 style={sectionTitleStyle}>
            Medication History
          </h2>

          <span style={countStyle}>
            {medicationHistory.length}
          </span>
        </div>

        {medicationHistory.length === 0 && (
          <EmptyState>
            No medication history yet.
          </EmptyState>
        )}

        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          {medicationHistory.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onEdit={beginEditMedication}
              onReactivate={() =>
                setMedicationActive(medication, true)
              }
            />
          ))}
        </div>
      </section>
    </section>
  );
}

function MedicalDocumentCard({
  document,
  animalId,
}: {
  document: MedicalDocument;
  animalId: string;
}) {
  const typeLabel =
    document.document_type
      ? formatDocumentType(document.document_type)
      : "Veterinary Record";

  return (
    <article
      style={{
        background: "#fff",
        border: "1px solid #E7E5E1",
        borderRadius: 9,
        padding: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
          alignItems: "flex-start",
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
              display: "block",
              color: "#17233C",
              fontSize: 14.5,
            }}
          >
            {document.title}
          </strong>

          <div
            style={{
              marginTop: 4,
              color: "#6B6862",
              fontSize: 12.5,
            }}
          >
            {[
              typeLabel,
              document.veterinary_provider,
              document.record_date
                ? formatDate(document.record_date)
                : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>

          <div
            style={{
              marginTop: 5,
              color: "#8A8782",
              fontSize: 11.5,
            }}
          >
            {document.original_filename}

            {document.file_size != null
              ? ` · ${formatFileSize(
                  Number(document.file_size)
                )}`
              : ""}
          </div>

          {document.notes && (
            <p
              style={{
                margin: "8px 0 0",
                color: "#4F4D49",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {document.notes}
            </p>
          )}
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
      </div>
    </article>
  );
}

function MedicationCard({
  medication,
  onEdit,
  onArchive,
  onReactivate,
}: {
  medication: Medication;
  onEdit: (medication: Medication) => void;
  onArchive?: () => void;
  onReactivate?: () => void;
}) {
  const overdue = Boolean(
    medication.active &&
      medication.next_due_at &&
      new Date(medication.next_due_at).getTime() <
        Date.now()
  );

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
        padding: 15,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 14,
          alignItems: "flex-start",
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
                fontSize: 12.5,
                marginTop: 7,
                color: overdue
                  ? "#B23B2E"
                  : "#4F4D49",
                fontWeight: overdue ? 700 : 500,
              }}
            >
              {overdue
                ? "Overdue · "
                : "Next due · "}

              {formatDateTime(medication.next_due_at)}
            </div>
          )}

          {medication.instructions && (
            <p
              style={{
                margin: "8px 0 0",
                color: "#4F4D49",
                fontSize: 13,
                lineHeight: 1.5,
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
          <button
            type="button"
            onClick={() => onEdit(medication)}
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
    </article>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 11.5,
          color: "#6B6862",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: ".04em",
          marginBottom: 5,
        }}
      >
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
  type: "success" | "error";
  children: React.ReactNode;
}) {
  const success =
    type === "success";

  return (
    <div
      style={{
        background: success
          ? "#EEF4F0"
          : "#FFF4F2",
        border: success
          ? "1px solid #C9DDD1"
          : "1px solid #F3C7BF",
        color: success
          ? "#2F6F4E"
          : "#B23B2E",
        borderRadius: 8,
        padding: 11,
        marginBottom: 16,
        fontSize: 13,
      }}
    >
      {children}
    </div>
  );
}

function EmptyState({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px dashed #D8D6D2",
        borderRadius: 8,
        padding: 18,
        color: "#6B6862",
        fontSize: 13.5,
      }}
    >
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

  const offset =
    date.getTimezoneOffset();

  const local =
    new Date(
      date.getTime() -
        offset * 60000
    );

  return local
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

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    [],
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function formatFileSize(
  bytes: number
) {
  if (!Number.isFinite(bytes)) {
    return "";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
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

const sectionHeading:
  React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
    alignItems: "flex-start",
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
    lineHeight: 1.5,
    maxWidth: 650,
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
    color: "#1C1B19",
    background: "#fff",
  };

const fileInputStyle:
  React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #D8D6D2",
    borderRadius: 7,
    padding: 10,
    background: "#FAFAF9",
    fontFamily: "inherit",
  };

const helpTextStyle:
  React.CSSProperties = {
    margin: "5px 0 0",
    color: "#8A8782",
    fontSize: 11.5,
  };

const primaryButton:
  React.CSSProperties = {
    background: "#17233C",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    padding: "9px 14px",
    fontWeight: 700,
    fontSize: 13,
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
    fontSize: 12.5,
    cursor: "pointer",
  };

const secondaryLink:
  React.CSSProperties = {
    ...secondaryButton,
    display: "inline-block",
    textDecoration: "none",
  };

const textButton:
  React.CSSProperties = {
    background: "transparent",
    color: "#6B6862",
    border: "none",
    padding: "8px 6px",
    fontWeight: 600,
    fontSize: 12.5,
    cursor: "pointer",
  };

const backLink:
  React.CSSProperties = {
    color: "#C05621",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 600,
  };
