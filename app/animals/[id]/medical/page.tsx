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

export default function MedicalPage() {
  const params = useParams();
  const animalId = params?.id as string;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [showAddMedication, setShowAddMedication] = useState(false);

  const [editingMedicationId, setEditingMedicationId] =
    useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const [draft, setDraft] = useState<MedicationDraft>(
    emptyMedicationDraft()
  );

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

      const medRes = await fetch(
        `/api/animals/${encodeURIComponent(
          animalId
        )}/medications`,
        {
          cache: "no-store",
        }
      );

      const medData = await medRes.json();

      if (!medRes.ok) {
        throw new Error(
          medData.error ?? "Couldn't load medications."
        );
      }

      setMedications(medData.medications ?? []);
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

    setSaving(true);
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
      setSaving(false);
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

      startedAt: toLocalInputValue(
        medication.started_at
      ),

      endedAt: toLocalInputValue(
        medication.ended_at
      ),

      nextDueAt: toLocalInputValue(
        medication.next_due_at
      ),

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

    setSaving(true);
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
      setSaving(false);
    }
  }

  async function setMedicationActive(
    medication: Medication,
    active: boolean
  ) {
    setSaving(true);
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
      setSaving(false);
    }
  }

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

        <button
          type="button"
          onClick={beginAddMedication}
          style={primaryButton}
        >
          + Add Medication
        </button>
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

      {(showAddMedication ||
        editingMedicationId) && (
        <section
          style={{
            background: "#fff",
            border: "1px solid #E7E5E1",
            borderRadius: 10,
            padding: 18,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#17233C",
                fontSize: 18,
              }}
            >
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
                      medicationName:
                        e.target.value,
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
                      dosage:
                        e.target.value,
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
                      frequency:
                        e.target.value,
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

            <div
              style={{
                marginTop: 12,
              }}
            >
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
                  placeholder="Administration instructions, with food, timing, etc."
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
                  value={draft.notes}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      notes:
                        e.target.value,
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
                      active:
                        e.target.checked,
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
                disabled={saving}
                style={primaryButton}
              >
                {saving
                  ? "Saving…"
                  : editingMedicationId
                  ? "Save Medication"
                  : "Add Medication"}
              </button>

              <button
                type="button"
                disabled={saving}
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

      <section
        style={{
          marginBottom: 26,
        }}
      >
        <div style={sectionHeading}>
          <h2
            style={{
              margin: 0,
              color: "#17233C",
              fontSize: 17,
            }}
          >
            Active Medications
          </h2>

          <span
            style={{
              color: "#6B6862",
              fontSize: 12.5,
            }}
          >
            {activeMedications.length}
          </span>
        </div>

        {activeMedications.length ===
          0 && (
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

      <section
        style={{
          background: "#fff",
          border: "1px solid #E7E5E1",
          borderRadius: 10,
          padding: 18,
          marginBottom: 26,
        }}
      >
        <h2
          style={{
            margin: "0 0 6px",
            color: "#17233C",
            fontSize: 17,
          }}
        >
          Veterinary Records
        </h2>

        <p
          style={{
            margin: 0,
            color: "#6B6862",
            fontSize: 13.5,
            lineHeight: 1.55,
            maxWidth: 700,
          }}
        >
          Vet records, lab reports, discharge paperwork,
          vaccination certificates, and other medical
          documents will be stored here.
        </p>

        <div
          style={{
            marginTop: 12,
            padding: 14,
            border: "1px dashed #D8D6D2",
            borderRadius: 8,
            color: "#6B6862",
            fontSize: 13,
          }}
        >
          PDF and photo upload is the next step.
        </div>
      </section>

      <section>
        <div style={sectionHeading}>
          <h2
            style={{
              margin: 0,
              color: "#17233C",
              fontSize: 17,
            }}
          >
            Medication History
          </h2>

          <span
            style={{
              color: "#6B6862",
              fontSize: 12.5,
            }}
          >
            {medicationHistory.length}
          </span>
        </div>

        {medicationHistory.length ===
          0 && (
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
          {medicationHistory.map(
            (medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
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
      </section>
    </section>
  );
}

function MedicationCard({
  medication,
  onEdit,
  onArchive,
  onReactivate,
}: {
  medication: Medication;
  onEdit: (
    medication: Medication
  ) => void;
  onArchive?: () => void;
  onReactivate?: () => void;
}) {
  const overdue =
    Boolean(
      medication.active &&
        medication.next_due_at &&
        new Date(
          medication.next_due_at
        ).getTime() < Date.now()
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
    </article>
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
  type:
    | "success"
    | "error";
  children:
    React.ReactNode;
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
  children:
    React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border:
          "1px dashed #D8D6D2",
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

const sectionHeading:
  React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  };

const inputStyle:
  React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    border:
      "1px solid #D8D6D2",
    borderRadius: 7,
    padding: 9,
    fontFamily: "inherit",
    fontSize: 13.5,
    color: "#1C1B19",
    background: "#fff",
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
    border:
      "1px solid #D8D6D2",
    borderRadius: 7,
    padding: "8px 11px",
    fontWeight: 700,
    fontSize: 12.5,
    cursor: "pointer",
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
