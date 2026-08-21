"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";


type MedicalRecord = {
  id: string;
  record_type: string;
  title: string;
  provider: string | null;
  occurred_at: string | null;
  due_at: string | null;
  status: string;
  notes: string | null;
};


type Medication = {
  id: string;
  medication_name: string;
  dosage: string | null;
  instructions: string | null;
  frequency: string | null;
  start_date: string | null;
  end_date: string | null;
  next_due_at: string | null;
  active: boolean;
  notes: string | null;
};


export default function MedicalPage() {
  const params =
    useParams();

  const animalId =
    params?.id as string;

  const [animalName, setAnimalName] =
    useState("");

  const [
    medicalRecords,
    setMedicalRecords,
  ] =
    useState<MedicalRecord[]>(
      []
    );

  const [
    medications,
    setMedications,
  ] =
    useState<Medication[]>(
      []
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const [
    addingRecord,
    setAddingRecord,
  ] =
    useState(false);

  const [
    addingMedication,
    setAddingMedication,
  ] =
    useState(false);


  async function load() {
    setLoading(true);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/medical`,
          {
            cache:
              "no-store",
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't load medical file."
        );
      }

      setAnimalName(
        data.animal.name ||
          data.animal
            .temporary_name ||
          "Unnamed Animal"
      );

      setMedicalRecords(
        data.medicalRecords ??
          []
      );

      setMedications(
        data.medications ??
          []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load medical file."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    if (animalId) {
      load();
    }
  }, [animalId]);


  if (loading) {
    return <p>Loading…</p>;
  }


  if (error) {
    return (
      <p
        style={{
          color:
            "#B23B2E",
        }}
      >
        {error}
      </p>
    );
  }


  return (
    <section>
      <a
        href={`/animals/${encodeURIComponent(
          animalId
        )}`}
        style={{
          color:
            "#C05621",
          fontSize: 13,
          textDecoration:
            "none",
        }}
      >
        ← Back to Animal Record
      </a>

      <p
        style={{
          margin:
            "18px 0 0",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing:
            ".08em",
          color:
            "#6B6862",
        }}
      >
        MEDICAL
      </p>

      <h1
        style={{
          fontSize: 28,
          color:
            "#17233C",
          margin:
            "5px 0 7px",
        }}
      >
        {animalName}
      </h1>

      <p
        style={{
          color:
            "#6B6862",
          margin:
            "0 0 24px",
          lineHeight: 1.5,
        }}
      >
        Veterinary history,
        procedures,
        vaccinations,
        conditions,
        medications and
        upcoming care.
      </p>


      {/* ===============================================
          ACTIONS
      ================================================ */}

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap:
            "wrap",
          marginBottom: 24,
        }}
      >
        <button
          onClick={() =>
            setAddingRecord(
              !addingRecord
            )
          }
          style={
            primaryButton
          }
        >
          + Medical Record
        </button>

        <button
          onClick={() =>
            setAddingMedication(
              !addingMedication
            )
          }
          style={
            secondaryButton
          }
        >
          + Medication
        </button>
      </div>


      {addingRecord && (
        <MedicalRecordForm
          animalId={
            animalId
          }
          onSaved={async () => {
            setAddingRecord(
              false
            );

            await load();
          }}
        />
      )}


      {addingMedication && (
        <MedicationForm
          animalId={
            animalId
          }
          onSaved={async () => {
            setAddingMedication(
              false
            );

            await load();
          }}
        />
      )}


      {/* ===============================================
          MEDICATIONS
      ================================================ */}

      <SectionTitle>
        Active Medications
      </SectionTitle>

      {medications.filter(
        (m) => m.active
      ).length === 0 ? (
        <EmptyState
          text="No active medications recorded."
        />
      ) : (
        medications
          .filter(
            (m) => m.active
          )
          .map((m) => (
            <div
              key={m.id}
              style={
                cardStyle
              }
            >
              <strong>
                {
                  m.medication_name
                }
              </strong>

              <div
                style={
                  mutedStyle
                }
              >
                {[
                  m.dosage,
                  m.frequency,
                ]
                  .filter(
                    Boolean
                  )
                  .join(" · ")}
              </div>

              {m.instructions && (
                <p>
                  {
                    m.instructions
                  }
                </p>
              )}

              {m.next_due_at && (
                <p
                  style={{
                    fontSize:
                      13,
                  }}
                >
                  <strong>
                    Next due:
                  </strong>{" "}
                  {formatDateTime(
                    m.next_due_at
                  )}
                </p>
              )}
            </div>
          ))
      )}


      {/* ===============================================
          MEDICAL HISTORY
      ================================================ */}

      <SectionTitle>
        Medical History
      </SectionTitle>

      {medicalRecords.length ===
      0 ? (
        <EmptyState
          text="No medical records have been added yet."
        />
      ) : (
        medicalRecords.map(
          (record) => (
            <div
              key={
                record.id
              }
              style={
                cardStyle
              }
            >
              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  gap: 12,
                  flexWrap:
                    "wrap",
                }}
              >
                <div>
                  <strong>
                    {
                      record.title
                    }
                  </strong>

                  <div
                    style={
                      mutedStyle
                    }
                  >
                    {
                      record.record_type
                    }

                    {record.provider
                      ? ` · ${record.provider}`
                      : ""}
                  </div>
                </div>

                <Status
                  value={
                    record.status
                  }
                />
              </div>

              {record.occurred_at && (
                <p
                  style={{
                    fontSize:
                      13,
                  }}
                >
                  <strong>
                    Date:
                  </strong>{" "}
                  {formatDate(
                    record.occurred_at
                  )}
                </p>
              )}

              {record.due_at && (
                <p
                  style={{
                    fontSize:
                      13,
                  }}
                >
                  <strong>
                    Next due:
                  </strong>{" "}
                  {formatDate(
                    record.due_at
                  )}
                </p>
              )}

              {record.notes && (
                <p
                  style={{
                    fontSize:
                      13.5,
                    lineHeight:
                      1.5,
                  }}
                >
                  {
                    record.notes
                  }
                </p>
              )}
            </div>
          )
        )
      )}
    </section>
  );
}


/* =========================================================
   MEDICAL RECORD FORM
========================================================= */

function MedicalRecordForm({
  animalId,
  onSaved,
}: {
  animalId: string;
  onSaved: () => void;
}) {
  const [
    recordType,
    setRecordType,
  ] =
    useState(
      "Veterinary Visit"
    );

  const [title, setTitle] =
    useState("");

  const [
    provider,
    setProvider,
  ] =
    useState("");

  const [
    occurredAt,
    setOccurredAt,
  ] =
    useState("");

  const [dueAt, setDueAt] =
    useState("");

  const [status, setStatus] =
    useState("completed");

  const [notes, setNotes] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null
    );


  async function submit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setSaving(true);
    setError(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/medical`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  action:
                    "medical_record",

                  recordType,

                  title,

                  provider,

                  occurredAt,

                  dueAt,

                  status,

                  notes,
                }
              ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't save medical record."
        );
      }

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't save medical record."
      );
    } finally {
      setSaving(false);
    }
  }


  return (
    <form
      onSubmit={submit}
      style={formStyle}
    >
      <h2
        style={{
          margin:
            "0 0 16px",
          fontSize: 17,
        }}
      >
        Add Medical Record
      </h2>

      <FieldLabel>
        Type
      </FieldLabel>

      <select
        value={recordType}
        onChange={(e) =>
          setRecordType(
            e.target.value
          )
        }
        style={inputStyle}
      >
        <option>
          Veterinary Visit
        </option>

        <option>
          Vaccination
        </option>

        <option>
          Procedure
        </option>

        <option>
          Surgery
        </option>

        <option>
          Diagnostic Test
        </option>

        <option>
          Condition
        </option>

        <option>
          Preventative Care
        </option>

        <option>
          Dental
        </option>

        <option>
          Other
        </option>
      </select>


      <FieldLabel>
        Title *
      </FieldLabel>

      <input
        value={title}
        required
        onChange={(e) =>
          setTitle(
            e.target.value
          )
        }
        placeholder="Example: Rabies vaccination"
        style={inputStyle}
      />


      <FieldLabel>
        Vet / Provider
      </FieldLabel>

      <input
        value={provider}
        onChange={(e) =>
          setProvider(
            e.target.value
          )
        }
        style={inputStyle}
      />


      <FieldLabel>
        Date completed
      </FieldLabel>

      <input
        type="date"
        value={occurredAt}
        onChange={(e) =>
          setOccurredAt(
            e.target.value
          )
        }
        style={inputStyle}
      />


      <FieldLabel>
        Next due date
      </FieldLabel>

      <input
        type="date"
        value={dueAt}
        onChange={(e) =>
          setDueAt(
            e.target.value
          )
        }
        style={inputStyle}
      />


      <FieldLabel>
        Status
      </FieldLabel>

      <select
        value={status}
        onChange={(e) =>
          setStatus(
            e.target.value
          )
        }
        style={inputStyle}
      >
        <option value="completed">
          Completed
        </option>

        <option value="scheduled">
          Scheduled
        </option>

        <option value="due">
          Due
        </option>

        <option value="overdue">
          Overdue
        </option>
      </select>


      <FieldLabel>
        Notes
      </FieldLabel>

      <textarea
        rows={4}
        value={notes}
        onChange={(e) =>
          setNotes(
            e.target.value
          )
        }
        style={inputStyle}
      />


      <button
        type="submit"
        disabled={saving}
        style={{
          ...primaryButton,
          marginTop: 14,
        }}
      >
        {saving
          ? "Saving…"
          : "Save Medical Record"}
      </button>

      {error && (
        <p
          style={{
            color:
              "#B23B2E",
          }}
        >
          {error}
        </p>
      )}
    </form>
  );
}


/* =========================================================
   MEDICATION FORM
========================================================= */

function MedicationForm({
  animalId,
  onSaved,
}: {
  animalId: string;
  onSaved: () => void;
}) {
  const [name, setName] =
    useState("");

  const [dosage, setDosage] =
    useState("");

  const [
    frequency,
    setFrequency,
  ] =
    useState("");

  const [
    instructions,
    setInstructions,
  ] =
    useState("");

  const [
    startDate,
    setStartDate,
  ] =
    useState("");

  const [
    endDate,
    setEndDate,
  ] =
    useState("");

  const [
    nextDueAt,
    setNextDueAt,
  ] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null
    );


  async function submit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setSaving(true);
    setError(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/medical`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  action:
                    "medication",

                  medicationName:
                    name,

                  dosage,

                  frequency,

                  instructions,

                  startDate,

                  endDate,

                  nextDueAt,

                  notes,
                }
              ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't save medication."
        );
      }

      onSaved();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't save medication."
      );
    } finally {
      setSaving(false);
    }
  }


  return (
    <form
      onSubmit={submit}
      style={formStyle}
    >
      <h2
        style={{
          margin:
            "0 0 16px",
          fontSize: 17,
        }}
      >
        Add Medication
      </h2>


      <FieldLabel>
        Medication *
      </FieldLabel>

      <input
        value={name}
        required
        onChange={(e) =>
          setName(
            e.target.value
          )
        }
        style={inputStyle}
      />


      <FieldLabel>
        Dosage
      </FieldLabel>

      <input
        value={dosage}
        onChange={(e) =>
          setDosage(
            e.target.value
          )
        }
        placeholder="Example: 100 mg"
        style={inputStyle}
      />


      <FieldLabel>
        Frequency
      </FieldLabel>

      <input
        value={frequency}
        onChange={(e) =>
          setFrequency(
            e.target.value
          )
        }
        placeholder="Example: Twice daily"
        style={inputStyle}
      />


      <FieldLabel>
        Instructions
      </FieldLabel>

      <textarea
        rows={3}
        value={instructions}
        onChange={(e) =>
          setInstructions(
            e.target.value
          )
        }
        style={inputStyle}
      />


      <FieldLabel>
        Start date
      </FieldLabel>

      <input
        type="date"
        value={startDate}
        onChange={(e) =>
          setStartDate(
            e.target.value
          )
        }
        style={inputStyle}
      />


      <FieldLabel>
        End date
      </FieldLabel>

      <input
        type="date"
        value={endDate}
        onChange={(e) =>
          setEndDate(
            e.target.value
          )
        }
        style={inputStyle}
      />


      <FieldLabel>
        Next dose / reminder
      </FieldLabel>

      <input
        type="datetime-local"
        value={nextDueAt}
        onChange={(e) =>
          setNextDueAt(
            e.target.value
          )
        }
        style={inputStyle}
      />


      <FieldLabel>
        Notes
      </FieldLabel>

      <textarea
        rows={3}
        value={notes}
        onChange={(e) =>
          setNotes(
            e.target.value
          )
        }
        style={inputStyle}
      />


      <button
        type="submit"
        disabled={saving}
        style={{
          ...primaryButton,
          marginTop: 14,
        }}
      >
        {saving
          ? "Saving…"
          : "Save Medication"}
      </button>

      {error && (
        <p
          style={{
            color:
              "#B23B2E",
          }}
        >
          {error}
        </p>
      )}
    </form>
  );
}


/* =========================================================
   COMPONENTS
========================================================= */

function SectionTitle({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <h2
      style={{
        fontSize: 17,
        color:
          "#17233C",
        margin:
          "28px 0 12px",
      }}
    >
      {children}
    </h2>
  );
}


function FieldLabel({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <label
      style={{
        display:
          "block",
        fontSize: 12,
        fontWeight: 700,
        margin:
          "12px 0 5px",
      }}
    >
      {children}
    </label>
  );
}


function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div
      style={{
        border:
          "1px dashed #D8D6D2",
        borderRadius: 8,
        padding: 18,
        color:
          "#6B6862",
        fontSize: 13.5,
      }}
    >
      {text}
    </div>
  );
}


function Status({
  value,
}: {
  value: string;
}) {
  return (
    <span
      style={{
        fontSize: 11.5,
        padding:
          "4px 8px",
        borderRadius: 20,
        background:
          "#F1F3F5",
        color:
          "#4F5661",
        fontWeight: 700,
        textTransform:
          "capitalize",
      }}
    >
      {value}
    </span>
  );
}


function formatDate(
  value: string
) {
  return new Date(
    value
  ).toLocaleDateString();
}


function formatDateTime(
  value: string
) {
  return new Date(
    value
  ).toLocaleString();
}


const inputStyle:
  React.CSSProperties =
{
  width: "100%",
  boxSizing:
    "border-box",
  padding: 9,
  border:
    "1px solid #D8D6D2",
  borderRadius: 6,
  fontFamily:
    "inherit",
  fontSize: 13.5,
};


const formStyle:
  React.CSSProperties =
{
  background: "#fff",
  border:
    "1px solid #E7E5E1",
  borderRadius: 10,
  padding: 18,
  marginBottom: 20,
  maxWidth: 620,
};


const cardStyle:
  React.CSSProperties =
{
  background: "#fff",
  border:
    "1px solid #E7E5E1",
  borderRadius: 9,
  padding: 15,
  marginBottom: 9,
};


const mutedStyle:
  React.CSSProperties =
{
  color: "#6B6862",
  fontSize: 12.5,
  marginTop: 4,
};


const primaryButton:
  React.CSSProperties =
{
  background: "#17233C",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  padding:
    "9px 14px",
  fontWeight: 700,
  cursor: "pointer",
};


const secondaryButton:
  React.CSSProperties =
{
  background: "#fff",
  color: "#17233C",
  border:
    "1px solid #D8D6D2",
  borderRadius: 7,
  padding:
    "9px 14px",
  fontWeight: 700,
  cursor: "pointer",
};
