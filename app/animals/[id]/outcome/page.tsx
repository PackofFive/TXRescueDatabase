"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

type OutcomeType =
  | "adopted"
  | "transferred"
  | "returned_to_owner"
  | "returned_to_shelter"
  | "released"
  | "escaped_missing"
  | "died"
  | "euthanized"
  | "other";

type OutcomeRecord = {
  id: string;
  outcome_type: OutcomeType;
  outcome_date: string;
  destination_name: string | null;
  destination_contact: string | null;
  destination_org_id: string | null;
  destination_org_name: string | null;
  reason: string | null;
  notes: string | null;
  recorded_by_email: string | null;
  updated_at: string;
};

type AnimalSummary = {
  id: string;
  name: string | null;
  temporary_name: string | null;
};

type OutcomeDraft = {
  outcomeType: OutcomeType | "";
  outcomeDate: string;
  destinationName: string;
  destinationContact: string;
  destinationOrgId: string;
  reason: string;
  notes: string;
};

const OUTCOMES = [
  ["adopted", "Adopted"],
  ["transferred", "Transferred"],
  ["returned_to_owner", "Returned to Owner"],
  ["returned_to_shelter", "Returned to Shelter"],
  ["released", "Released"],
  ["escaped_missing", "Escaped / Missing"],
  ["died", "Died"],
  ["euthanized", "Euthanized"],
  ["other", "Other"],
] as const;

export default function OutcomePage() {
  const params = useParams();

  const animalId =
    params?.id as string;

  const [
    animal,
    setAnimal,
  ] =
    useState<AnimalSummary | null>(
      null
    );

  const [
    outcome,
    setOutcome,
  ] =
    useState<OutcomeRecord | null>(
      null
    );

  const [
    draft,
    setDraft,
  ] =
    useState<OutcomeDraft>(
      emptyDraft()
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    editing,
    setEditing,
  ] =
    useState(false);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    reopening,
    setReopening,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const [
    message,
    setMessage,
  ] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    if (!animalId) {
      return;
    }

    loadOutcome();
  }, [animalId]);

  async function loadOutcome() {
    setLoading(true);
    setError(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/outcome`,
          {
            cache: "no-store",
            credentials:
              "same-origin",
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't load outcome."
        );
      }

      const loaded =
        data.outcome ??
        null;

      setAnimal(
        data.animal ??
          null
      );

      setOutcome(
        loaded
      );

      setDraft(
        loaded
          ? outcomeToDraft(
              loaded
            )
          : emptyDraft()
      );

      setEditing(
        !loaded
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load outcome."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateDraft(
    key: keyof OutcomeDraft,
    value: string
  ) {
    setDraft(
      (current) => ({
        ...current,
        [key]: value,
      })
    );
  }

  async function saveOutcome() {
    if (
      !draft.outcomeType
    ) {
      setError(
        "Outcome type is required."
      );

      return;
    }

    if (
      !draft.outcomeDate
    ) {
      setError(
        "Outcome date is required."
      );

      return;
    }

    const confirmed =
      window.confirm(
        outcome
          ? "Save these outcome changes?"
          : "Record this outcome and close the animal's active case?\n\nThe animal's private history will remain available."
      );

    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/outcome`,
          {
            method:
              outcome
                ? "PATCH"
                : "POST",

            credentials:
              "same-origin",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                draft
              ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't save outcome."
        );
      }

      setMessage(
        outcome
          ? "Outcome updated."
          : "Outcome recorded."
      );

      await loadOutcome();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't save outcome."
      );
    } finally {
      setSaving(false);
    }
  }

  async function reopenAnimal() {
    const confirmed =
      window.confirm(
        "Reopen this animal's case?\n\nThe current outcome will be removed, but the rest of the animal's history will remain."
      );

    if (!confirmed) {
      return;
    }

    setReopening(true);
    setError(null);
    setMessage(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/outcome`,
          {
            method:
              "DELETE",

            credentials:
              "same-origin",
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't reopen animal."
        );
      }

      setOutcome(null);
      setDraft(
        emptyDraft()
      );
      setEditing(true);
      setMessage(
        "Animal reopened."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't reopen animal."
      );
    } finally {
      setReopening(false);
    }
  }

  if (loading) {
    return <p>Loading…</p>;
  }

  const displayName =
    animal?.name ||
    animal?.temporary_name ||
    "Animal";

  return (
    <section
      style={{
        maxWidth: 900,
      }}
    >
      <a
        href={`/animals/${encodeURIComponent(
          animalId
        )}`}
        style={backLink}
      >
        ← Back to Animal
      </a>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          gap: 16,
          alignItems:
            "flex-start",
          flexWrap: "wrap",
          margin:
            "14px 0 20px",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11.5,
              fontWeight: 800,
              letterSpacing:
                ".08em",
              color:
                "#6B6862",
              textTransform:
                "uppercase",
            }}
          >
            Private Animal File
          </p>

          <h1
            style={{
              margin:
                "5px 0 6px",
              fontSize: 28,
              color:
                "#17233C",
            }}
          >
            Outcome
          </h1>

          <p
            style={{
              margin: 0,
              color:
                "#6B6862",
              fontSize: 13.5,
              lineHeight: 1.5,
            }}
          >
            Record the final or closing
            disposition for{" "}
            {displayName}.
          </p>
        </div>

        {outcome &&
          !editing && (
          <button
            type="button"
            onClick={() => {
              setDraft(
                outcomeToDraft(
                  outcome
                )
              );

              setEditing(true);
            }}
            style={
              secondaryButton
            }
          >
            Edit Outcome
          </button>
        )}
      </div>

      {error && (
        <Notice
          error
        >
          {error}
        </Notice>
      )}

      {message && (
        <Notice>
          {message}
        </Notice>
      )}

      {outcome &&
      !editing ? (
        <>
          <section
            style={
              panelStyle
            }
          >
            <span
              style={
                outcomeBadge
              }
            >
              Case Closed
            </span>

            <h2
              style={{
                margin:
                  "10px 0 4px",
                color:
                  "#17233C",
              }}
            >
              {outcomeLabel(
                outcome.outcome_type
              )}
            </h2>

            <div
              style={{
                color:
                  "#6B6862",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {formatDate(
                outcome.outcome_date
              )}
            </div>

            {outcome.destination_org_name && (
              <InfoRow
                label="Destination organization"
                value={
                  outcome.destination_org_name
                }
              />
            )}

            {outcome.destination_name && (
              <InfoRow
                label="Destination / person"
                value={
                  outcome.destination_name
                }
              />
            )}

            {outcome.destination_contact && (
              <InfoRow
                label="Destination contact"
                value={
                  outcome.destination_contact
                }
              />
            )}

            {outcome.reason && (
              <LongValue
                label="Reason"
                value={
                  outcome.reason
                }
              />
            )}

            {outcome.notes && (
              <LongValue
                label="Private notes"
                value={
                  outcome.notes
                }
              />
            )}

            {outcome.recorded_by_email && (
              <div
                style={{
                  marginTop: 14,
                  color:
                    "#8A8782",
                  fontSize: 11.5,
                }}
              >
                Recorded by{" "}
                {
                  outcome.recorded_by_email
                }
              </div>
            )}
          </section>

          <section
            style={{
              ...panelStyle,
              background:
                "#FFFDF8",
              border:
                "1px solid #E7D2B4",
            }}
          >
            <strong
              style={{
                color:
                  "#85571F",
              }}
            >
              Reopen Animal
            </strong>

            <p
              style={{
                color:
                  "#6B6862",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              Use this if the outcome was
              entered incorrectly or the
              animal returns to active care.
            </p>

            <button
              type="button"
              disabled={
                reopening
              }
              onClick={
                reopenAnimal
              }
              style={
                reopenButton
              }
            >
              {reopening
                ? "Reopening…"
                : "Reopen Animal"}
            </button>
          </section>
        </>
      ) : (
        <section
          style={
            panelStyle
          }
        >
          <div
            style={
              formGrid
            }
          >
            <Field
              label="Outcome Type *"
            >
              <select
                value={
                  draft.outcomeType
                }
                onChange={(e) =>
                  updateDraft(
                    "outcomeType",
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              >
                <option value="">
                  Select…
                </option>

                {OUTCOMES.map(
                  ([
                    value,
                    label,
                  ]) => (
                    <option
                      key={
                        value
                      }
                      value={
                        value
                      }
                    >
                      {label}
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field
              label="Outcome Date *"
            >
              <input
                type="date"
                value={
                  draft.outcomeDate
                }
                onChange={(e) =>
                  updateDraft(
                    "outcomeDate",
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              />
            </Field>

            <Field
              label="Destination / Person"
            >
              <input
                value={
                  draft.destinationName
                }
                onChange={(e) =>
                  updateDraft(
                    "destinationName",
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              />
            </Field>

            <Field
              label="Destination Contact"
            >
              <input
                value={
                  draft.destinationContact
                }
                onChange={(e) =>
                  updateDraft(
                    "destinationContact",
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              />
            </Field>
          </div>

          {draft.outcomeType ===
           
