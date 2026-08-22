"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

type OrganizationOption = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
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

const OUTCOMES: Array<{
  value: OutcomeType;
  label: string;
}> = [
  {
    value: "adopted",
    label: "Adopted",
  },
  {
    value: "transferred",
    label: "Transferred",
  },
  {
    value: "returned_to_owner",
    label: "Returned to Owner",
  },
  {
    value: "returned_to_shelter",
    label: "Returned to Shelter",
  },
  {
    value: "released",
    label: "Released",
  },
  {
    value: "escaped_missing",
    label: "Escaped / Missing",
  },
  {
    value: "died",
    label: "Died",
  },
  {
    value: "euthanized",
    label: "Euthanized",
  },
  {
    value: "other",
    label: "Other",
  },
];

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

  const [
    organizations,
    setOrganizations,
  ] = useState<OrganizationOption[]>([]);

  const [
    orgSearch,
    setOrgSearch,
  ] = useState("");

  const [
    loadingOrganizations,
    setLoadingOrganizations,
  ] = useState(false);

  useEffect(() => {
    if (!animalId) {
      return;
    }

    void loadOutcome();
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

      const loadedOutcome =
        (data.outcome ??
          null) as
          | OutcomeRecord
          | null;

      setAnimal(
        (data.animal ??
          null) as
          | AnimalSummary
          | null
      );

      setOutcome(
        loadedOutcome
      );

      setDraft(
        loadedOutcome
          ? outcomeToDraft(
              loadedOutcome
            )
          : emptyDraft()
      );

      setEditing(
        !loadedOutcome
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

  useEffect(() => {
    if (
      draft.outcomeType !==
      "transferred"
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          void loadOrganizations(
            orgSearch
          );
        },
        250
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    draft.outcomeType,
    orgSearch,
  ]);

  async function loadOrganizations(
    search: string
  ) {
    setLoadingOrganizations(
      true
    );

    try {
      const params =
        new URLSearchParams();

      if (search.trim()) {
        params.set(
          "search",
          search.trim()
        );
      }

      const res =
        await fetch(
          `/api/organizations?${params.toString()}`,
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
            "Couldn't load organizations."
        );
      }

      const rows =
        Array.isArray(
          data.organizations
        )
          ? data.organizations
          : Array.isArray(data)
          ? data
          : [];

      setOrganizations(
        rows.map(
          (row: any) => ({
            id:
              String(
                row.id ?? ""
              ),
            name:
              String(
                row.name ?? ""
              ),
            city:
              row.city ??
              null,
            state:
              row.state ??
              null,
          })
        ).filter(
          (
            row: OrganizationOption
          ) =>
            row.id &&
            row.name
        )
      );
    } catch {
      setOrganizations([]);
    } finally {
      setLoadingOrganizations(
        false
      );
    }
  }

  function updateDraft<
    K extends keyof OutcomeDraft
  >(
    key: K,
    value: OutcomeDraft[K]
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
    return (
      <p>
        Loading…
      </p>
    );
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
        style={headerRow}
      >
        <div>
          <p
            style={eyebrow}
          >
            Private Animal File
          </p>

          <h1
            style={pageTitle}
          >
            Outcome
          </h1>

          <p
            style={
              pageDescription
            }
          >
            Record the final or
            closing disposition
            for {displayName}.
          </p>
        </div>

        {outcome &&
        !editing ? (
          <button
            type="button"
            onClick={() => {
              setDraft(
                outcomeToDraft(
                  outcome
                )
              );

              setEditing(true);

              setError(null);
              setMessage(null);
            }}
            style={
              secondaryButton
            }
          >
            Edit Outcome
          </button>
        ) : null}
      </div>

      {error ? (
        <Notice
          error
        >
          {error}
        </Notice>
      ) : null}

      {message ? (
        <Notice>
          {message}
        </Notice>
      ) : null}

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

                fontSize:
                  13,

                marginBottom:
                  16,
              }}
            >
              {formatDate(
                outcome.outcome_date
              )}
            </div>

            {outcome.destination_org_name ? (
              <InfoRow
                label="Destination organization"
                value={
                  outcome.destination_org_name
                }
              />
            ) : null}

            {outcome.destination_name ? (
              <InfoRow
                label="Destination / person"
                value={
                  outcome.destination_name
                }
              />
            ) : null}

            {outcome.destination_contact ? (
              <InfoRow
                label="Destination contact"
                value={
                  outcome.destination_contact
                }
              />
            ) : null}

            {outcome.reason ? (
              <LongValue
                label="Reason"
                value={
                  outcome.reason
                }
              />
            ) : null}

            {outcome.notes ? (
              <LongValue
                label="Private notes"
                value={
                  outcome.notes
                }
              />
            ) : null}

            {outcome.recorded_by_email ? (
              <div
                style={
                  recordedByStyle
                }
              >
                Recorded by{" "}
                {
                  outcome.recorded_by_email
                }
              </div>
            ) : null}
          </section>

          <section
            style={
              reopenPanelStyle
            }
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
              style={
                reopenHelpStyle
              }
            >
              Use this if the
              outcome was entered
              incorrectly or the
              animal returns to
              active care.
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

                    e.target
                      .value as OutcomeDraft["outcomeType"]
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
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
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
          "transferred" ? (
            <div
              style={{
                marginTop: 16,
                padding: 14,
                border:
                  "1px solid #E7E5E1",
                borderRadius: 9,
                background:
                  "#FAFAF9",
              }}
            >
              <strong
                style={{
                  display: "block",
                  marginBottom: 4,
                  color:
                    "#17233C",
                  fontSize: 13,
                }}
              >
                Transfer Destination
              </strong>

              <p
                style={{
                  margin:
                    "0 0 12px",
                  color:
                    "#6B6862",
                  fontSize: 12,
                  lineHeight: 1.45,
                }}
              >
                Search Pack of Five
                organizations first.
                If the destination
                is not listed, enter
                it manually above.
              </p>

              <Field
                label="Search Organizations"
              >
                <input
                  value={
                    orgSearch
                  }
                  onChange={(e) =>
                    setOrgSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search rescue or shelter name"
                  style={
                    inputStyle
                  }
                />
              </Field>

              <div
                style={{
                  marginTop: 8,
                  display: "grid",
                  gap: 6,
                  maxHeight: 210,
                  overflowY: "auto",
                }}
              >
                {loadingOrganizations ? (
                  <div
                    style={{
                      color:
                        "#77736D",
                      fontSize: 12,
                    }}
                  >
                    Searching…
                  </div>
                ) : organizations.length >
                  0 ? (
                  organizations.map(
                    (org) => {
                      const selected =
                        draft.destinationOrgId ===
                        org.id;

                      return (
                        <button
                          key={
                            org.id
                          }
                          type="button"
                          onClick={() => {
                            updateDraft(
                              "destinationOrgId",
                              org.id
                            );

                            updateDraft(
                              "destinationName",
                              org.name
                            );
                          }}
                          style={{
                            textAlign:
                              "left",
                            padding:
                              "9px 10px",
                            borderRadius:
                              7,
                            border:
                              selected
                                ? "1px solid #17233C"
                                : "1px solid #DDDAD5",
                            background:
                              selected
                                ? "#EEF1F5"
                                : "#fff",
                            cursor:
                              "pointer",
                            fontFamily:
                              "inherit",
                          }}
                        >
                          <div
                            style={{
                              color:
                                "#17233C",
                              fontSize:
                                12.5,
                              fontWeight:
                                700,
                            }}
                          >
                            {
                              org.name
                            }
                          </div>

                          {(org.city ||
                            org.state) && (
                            <div
                              style={{
                                marginTop:
                                  2,
                                color:
                                  "#77736D",
                                fontSize:
                                  11,
                              }}
                            >
                              {[
                                org.city,
                                org.state,
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(
                                  ", "
                                )}
                            </div>
                          )}
                        </button>
                      );
                    }
                  )
                ) : (
                  <div
                    style={{
                      color:
                        "#77736D",
                      fontSize: 12,
                    }}
                  >
                    No matching Pack
                    of Five
                    organizations.
                    You can enter the
                    destination
                    manually above.
                  </div>
                )}
              </div>

              {draft.destinationOrgId ? (
                <button
                  type="button"
                  onClick={() => {
                    updateDraft(
                      "destinationOrgId",
                      ""
                    );
                  }}
                  style={{
                    ...secondaryButton,
                    marginTop: 9,
                    padding:
                      "6px 9px",
                    fontSize: 11.5,
                  }}
                >
                  Clear Organization
                  Selection
                </button>
              ) : null}
            </div>
          ) : null}

          <div
            style={{
              marginTop: 12,
            }}
          >
            <Field
              label="Reason"
            >
              <textarea
                rows={3}
                value={
                  draft.reason
                }
                onChange={(e) =>
                  updateDraft(
                    "reason",
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              />
            </Field>
          </div>

          <div
            style={{
              marginTop: 12,
            }}
          >
            <Field
              label="Private Outcome Notes"
            >
              <textarea
                rows={4}
                value={
                  draft.notes
                }
                onChange={(e) =>
                  updateDraft(
                    "notes",
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              />
            </Field>
          </div>

          <div
            style={
              formActions
            }
          >
            <button
              type="button"
              disabled={
                saving
              }
              onClick={
                saveOutcome
              }
              style={
                primaryButton
              }
            >
              {saving
                ? "Saving…"
                : outcome
                ? "Save Changes"
                : "Record Outcome"}
            </button>

            {outcome ? (
              <button
                type="button"
                disabled={
                  saving
                }
                onClick={() => {
                  setDraft(
                    outcomeToDraft(
                      outcome
                    )
                  );

                  setEditing(
                    false
                  );

                  setError(
                    null
                  );
                }}
                style={
                  secondaryButton
                }
              >
                Cancel
              </button>
            ) : null}
          </div>
        </section>
      )}
    </section>
  );
}

function emptyDraft():
  OutcomeDraft {
  const now =
    new Date();

  const date =
    `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    )}-${String(
      now.getDate()
    ).padStart(
      2,
      "0"
    )}`;

  return {
    outcomeType: "",
    outcomeDate: date,
    destinationName: "",
    destinationContact: "",
    destinationOrgId: "",
    reason: "",
    notes: "",
  };
}

function outcomeToDraft(
  outcome:
    OutcomeRecord
): OutcomeDraft {
  return {
    outcomeType:
      outcome.outcome_type,

    outcomeDate:
      String(
        outcome.outcome_date
      ).slice(
        0,
        10
      ),

    destinationName:
      outcome.destination_name ??
      "",

    destinationContact:
      outcome.destination_contact ??
      "",

    destinationOrgId:
      outcome.destination_org_id ??
      "",

    reason:
      outcome.reason ??
      "",

    notes:
      outcome.notes ??
      "",
  };
}

function outcomeLabel(
  value: string
) {
  return (
    OUTCOMES.find(
      (option) =>
        option.value ===
        value
    )?.label ??
    value
  );
}

function formatDate(
  value: string
) {
  const date =
    new Date(
      `${String(
        value
      ).slice(
        0,
        10
      )}T00:00:00`
    );

  return Number.isNaN(
    date.getTime()
  )
    ? value
    : date.toLocaleDateString();
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
    <label>
      <span
        style={
          fieldLabelStyle
        }
      >
        {label}
      </span>

      {children}
    </label>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div
      style={
        infoRowStyle
      }
    >
      <span
        style={{
          color:
            "#6B6862",

          fontSize:
            12,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color:
            "#1C1B19",

          fontSize:
            13.5,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function LongValue({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div
      style={{
        marginTop: 14,
      }}
    >
      <strong
        style={
          longValueLabelStyle
        }
      >
        {label}
      </strong>

      <div
        style={
          longValueTextStyle
        }
      >
        {value}
      </div>
    </div>
  );
}

function Notice({
  error = false,
  children,
}: {
  error?: boolean;

  children:
    React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: 11,
        marginBottom: 14,
        borderRadius: 8,

        background:
          error
            ? "#FFF4F2"
            : "#EEF4F0",

        border:
          error
            ? "1px solid #F3C7BF"
            : "1px solid #C9DDD1",

        color:
          error
            ? "#B23B2E"
            : "#2F6F4E",

        fontSize: 13,
      }}
    >
      {children}
    </div>
  );
}

const backLink:
  React.CSSProperties =
{
  color: "#52627A",
  fontSize: 13,
  fontWeight: 700,
  textDecoration: "none",
};

const headerRow:
  React.CSSProperties =
{
  display: "flex",
  justifyContent:
    "space-between",
  gap: 16,
  alignItems:
    "flex-start",
  flexWrap: "wrap",
  margin:
    "14px 0 20px",
};

const eyebrow:
  React.CSSProperties =
{
  margin: 0,
  fontSize: 11.5,
  fontWeight: 800,
  letterSpacing:
    ".08em",
  color: "#6B6862",
  textTransform:
    "uppercase",
};

const pageTitle:
  React.CSSProperties =
{
  margin:
    "5px 0 6px",
  fontSize: 28,
  color: "#17233C",
};

const pageDescription:
  React.CSSProperties =
{
  margin: 0,
  color: "#6B6862",
  fontSize: 13.5,
  lineHeight: 1.5,
};

const panelStyle:
  React.CSSProperties =
{
  background: "#fff",
  border:
    "1px solid #E7E5E1",
  borderRadius: 10,
  padding: 18,
  marginBottom: 16,
};

const reopenPanelStyle:
  React.CSSProperties =
{
  ...panelStyle,

  background:
    "#FFFDF8",

  border:
    "1px solid #E7D2B4",
};

const reopenHelpStyle:
  React.CSSProperties =
{
  color: "#6B6862",
  fontSize: 13,
  lineHeight: 1.5,
};

const recordedByStyle:
  React.CSSProperties =
{
  marginTop: 14,
  color: "#8A8782",
  fontSize: 11.5,
};

const formGrid:
  React.CSSProperties =
{
  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",

  gap: 12,
};

const formActions:
  React.CSSProperties =
{
  display: "flex",
  gap: 9,
  flexWrap: "wrap",
  marginTop: 16,
};

const fieldLabelStyle:
  React.CSSProperties =
{
  display: "block",
  marginBottom: 5,
  fontSize: 12,
  fontWeight: 700,
  color: "#4F4D49",
};

const infoRowStyle:
  React.CSSProperties =
{
  display: "grid",
  gridTemplateColumns:
    "170px 1fr",
  gap: 12,
  padding:
    "8px 0",
  borderBottom:
    "1px solid #F0EFED",
};

const longValueLabelStyle:
  React.CSSProperties =
{
  display: "block",
  marginBottom: 4,
  fontSize: 11,
  color: "#77736D",
  textTransform:
    "uppercase",
};

const longValueTextStyle:
  React.CSSProperties =
{
  whiteSpace:
    "pre-wrap",
  fontSize: 13.5,
  lineHeight: 1.55,
};

const inputStyle:
  React.CSSProperties =
{
  width: "100%",
  boxSizing:
    "border-box",
  padding: 9,
  border:
    "1px solid #D8D6D2",
  borderRadius: 7,
  fontSize: 13,
  fontFamily:
    "inherit",
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
  fontSize: 13,
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
  fontSize: 13,
  cursor: "pointer",
};

const reopenButton:
  React.CSSProperties =
{
  ...secondaryButton,

  color:
    "#85571F",

  border:
    "1px solid #C58A42",
};

const outcomeBadge:
  React.CSSProperties =
{
  display:
    "inline-block",
  borderRadius: 20,
  padding:
    "4px 8px",
  fontSize: 11,
  fontWeight: 800,
  background:
    "#EEF4F0",
  color:
    "#2F6F4E",
};
