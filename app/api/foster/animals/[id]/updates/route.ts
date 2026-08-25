"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

type Animal = {
  assignment_id: string;
  started_at: string;
  assignment_notes: string | null;
  id: string;
  display_name: string;
  name: string | null;
  temporary_name: string | null;
  species: string;
  breed_or_type: string | null;
  sex: string | null;
  age_estimate: string | null;
  size: string | null;
  birth_date: string | null;
  weight_lbs: string | number | null;
  custody: string;
  urgency: string;
  urgency_deadline: string | null;
  placement: string;
  notes: string | null;
  current_org_id: string;
  organization_name: string;
  access_level: string;
  can_submit_updates: boolean;
  can_add_photos: boolean;
  can_add_behavior_notes: boolean;
};

type FosterUpdate = {
  id: string;
  update_type: string;
  title: string | null;
  update_text: string;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
  incorporated_at: string | null;
};

const UPDATE_TYPES = [
  ["general", "General"],
  ["medical", "Medical"],
  ["behavior", "Behavior"],
  ["feeding", "Feeding"],
  ["medication", "Medication"],
  ["weight", "Weight"],
  ["activity", "Activity"],
  ["concern", "Concern"],
  ["milestone", "Milestone"],
  ["other", "Other"],
];

const C = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  peach: "#FBE3DA",
  pink: "#F2D6DC",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
};

export default function FosterAnimalFilePage() {
  const params =
    useParams<{
      id: string;
    }>();

  const animalId =
    params.id;

  const [
    animal,
    setAnimal,
  ] =
    useState<
      Animal | null
    >(null);

  const [
    updates,
    setUpdates,
  ] =
    useState<
      FosterUpdate[]
    >([]);

  const [
    form,
    setForm,
  ] =
    useState({
      updateType:
        "general",
      title:
        "",
      updateText:
        "",
    });

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    success,
    setSuccess,
  ] =
    useState<
      string | null
    >(null);

  async function load() {
    if (!animalId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [
        animalRes,
        updatesRes,
      ] =
        await Promise.all([
          fetch(
            `/api/foster/animals/${encodeURIComponent(
              animalId
            )}`,
            {
              cache:
                "no-store",
            }
          ),

          fetch(
            `/api/foster/animals/${encodeURIComponent(
              animalId
            )}/updates`,
            {
              cache:
                "no-store",
            }
          ),
        ]);

      const animalData =
        await animalRes.json();

      const updatesData =
        await updatesRes.json();

      if (!animalRes.ok) {
        throw new Error(
          animalData.error ??
            "Couldn't load foster animal file."
        );
      }

      if (!updatesRes.ok) {
        throw new Error(
          updatesData.error ??
            "Couldn't load foster updates."
        );
      }

      setAnimal(
        animalData.animal ??
          null
      );

      setUpdates(
        updatesData.updates ??
          []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load foster animal file."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [animalId]);

  function updateForm(
    field: string,
    value: string
  ) {
    setForm(
      (
        current
      ) => ({
        ...current,
        [field]:
          value,
      })
    );
  }

  async function submitUpdate(
    event:
      React.FormEvent
  ) {
    event.preventDefault();

    if (
      !form.updateText.trim()
    ) {
      setError(
        "Update details are required."
      );
      return;
    }

    setSubmitting(
      true
    );
    setError(
      null
    );
    setSuccess(
      null
    );

    try {
      const res =
        await fetch(
          `/api/foster/animals/${encodeURIComponent(
            animalId
          )}/updates`,
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify(
                form
              ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't submit foster update."
        );
      }

      setForm({
        updateType:
          "general",
        title:
          "",
        updateText:
          "",
      });

      setSuccess(
        "Update submitted to the managing organization."
      );

      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't submit foster update."
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  if (loading) {
    return (
      <p
        style={{
          color:
            C.muted,
        }}
      >
        Loading…
      </p>
    );
  }

  if (
    error &&
    !animal
  ) {
    return (
      <section
        style={{
          maxWidth:
            900,
        }}
      >
        <a
          href="/foster/animals"
          style={
            backLink
          }
        >
          ← My Foster Animals
        </a>

        <div
          style={
            card
          }
        >
          <strong
            style={{
              color:
                C.navy,
            }}
          >
            Animal unavailable
          </strong>

          <p
            style={
              bodyStyle
            }
          >
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (!animal) {
    return null;
  }

  return (
    <section
      style={{
        width:
          "100%",
        maxWidth:
          1000,
        margin:
          "0 auto",
      }}
    >
      <a
        href="/foster/animals"
        style={
          backLink
        }
      >
        ← My Foster Animals
      </a>

      <p
        style={
          eyebrow
        }
      >
        Foster Portal
      </p>

      <h1
        style={
          heading
        }
      >
        {
          animal.display_name
        }
      </h1>

      <p
        style={
          intro
        }
      >
        Foster file managed by{" "}
        {animal.organization_name}.
        Your access is limited to
        your active assignment and
        the permissions granted by
        this organization.
      </p>

      <div
        style={
          stats
        }
      >
        <Info
          label="Species"
          value={
            animal.species
          }
        />

        <Info
          label="Breed / Type"
          value={
            animal.breed_or_type ??
            "—"
          }
        />

        <Info
          label="Sex"
          value={
            fmt(
              animal.sex
            )
          }
        />

        <Info
          label="Age"
          value={
            animal.age_estimate ??
            "—"
          }
        />

        <Info
          label="Size"
          value={
            fmt(
              animal.size
            )
          }
        />

        <Info
          label="Weight"
          value={
            animal.weight_lbs !==
              null
              ? `${animal.weight_lbs} lbs`
              : "—"
          }
        />
      </div>

      <div
        style={{
          display:
            "grid",
          gap:
            12,
          marginTop:
            14,
        }}
      >
        <article
          style={
            card
          }
        >
          <h2
            style={
              sectionHeading
            }
          >
            Placement Information
          </h2>

          <div
            style={
              stats
            }
          >
            <Info
              label="Organization"
              value={
                animal.organization_name
              }
            />

            <Info
              label="Custody"
              value={
                fmt(
                  animal.custody
                )
              }
            />

            <Info
              label="Placement"
              value={
                fmt(
                  animal.placement
                )
              }
            />

            <Info
              label="Urgency"
              value={
                fmt(
                  animal.urgency
                )
              }
            />

            <Info
              label="Foster Started"
              value={
                new Date(
                  animal.started_at
                ).toLocaleDateString()
              }
            />

            <Info
              label="Urgency Deadline"
              value={
                animal.urgency_deadline
                  ? new Date(
                      animal.urgency_deadline
                    ).toLocaleString()
                  : "—"
              }
            />
          </div>

          {animal.assignment_notes && (
            <div
              style={
                noteBox
              }
            >
              <strong
                style={
                  noteTitle
                }
              >
                Assignment Notes
              </strong>

              <p
                style={
                  bodyStyle
                }
              >
                {
                  animal.assignment_notes
                }
              </p>
            </div>
          )}
        </article>

        <article
          style={
            card
          }
        >
          <h2
            style={
              sectionHeading
            }
          >
            Animal Notes
          </h2>

          <p
            style={
              bodyStyle
            }
          >
            {animal.notes ||
              "No foster-visible animal notes are currently listed."}
          </p>
        </article>

        <article
          style={
            card
          }
        >
          <h2
            style={
              sectionHeading
            }
          >
            Your Foster Access
          </h2>

          <p
            style={{
              ...bodyStyle,
              marginBottom:
                10,
            }}
          >
            Access level:{" "}
            <strong>
              {fmt(
                animal.access_level
              )}
            </strong>
          </p>

          <div
            style={{
              display:
                "grid",
              gap:
                8,
            }}
          >
            <Permission
              enabled={
                animal.can_submit_updates
              }
              label="Submit Animal Updates"
            />

            <Permission
              enabled={
                animal.can_add_photos
              }
              label="Add Photos"
            />

            <Permission
              enabled={
                animal.can_add_behavior_notes
              }
              label="Add Behavior Notes"
            />
          </div>
        </article>

        {animal.can_submit_updates && (
          <article
            style={
              card
            }
          >
            <h2
              style={
                sectionHeading
              }
            >
              Submit an Update
            </h2>

            <p
              style={{
                ...bodyStyle,
                marginBottom:
                  13,
              }}
            >
              Send an update to{" "}
              {
                animal.organization_name
              }.
              Submissions are kept as
              foster updates and do not
              directly overwrite the
              organization&apos;s animal
              record.
            </p>

            <form
              onSubmit={
                submitUpdate
              }
              style={{
                display:
                  "grid",
                gap:
                  12,
              }}
            >
              <label
                style={
                  labelStyle
                }
              >
                Update Type

                <select
                  value={
                    form.updateType
                  }
                  onChange={(e) =>
                    updateForm(
                      "updateType",
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                >
                  {UPDATE_TYPES.map(
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
              </label>

              <label
                style={
                  labelStyle
                }
              >
                Title

                <input
                  value={
                    form.title
                  }
                  onChange={(e) =>
                    updateForm(
                      "title",
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                  placeholder="Optional short summary"
                />
              </label>

              <label
                style={
                  labelStyle
                }
              >
                Update Details *

                <textarea
                  value={
                    form.updateText
                  }
                  onChange={(e) =>
                    updateForm(
                      "updateText",
                      e.target.value
                    )
                  }
                  rows={
                    5
                  }
                  required
                  style={
                    inputStyle
                  }
                  placeholder="Describe the animal's condition, behavior, care, progress, concern, or other update."
                />
              </label>

              <button
                type="submit"
                disabled={
                  submitting
                }
                style={{
                  ...actionButton,
                  width:
                    "fit-content",
                  opacity:
                    submitting
                      ? 0.65
                      : 1,
                }}
              >
                {submitting
                  ? "Submitting…"
                  : "Submit Update"}
              </button>
            </form>
          </article>
        )}

        <article
          style={
            card
          }
        >
          <h2
            style={
              sectionHeading
            }
          >
            Submitted Updates
          </h2>

          {updates.length ===
          0 ? (
            <p
              style={
                bodyStyle
              }
            >
              No foster updates have
              been submitted for this
              active assignment yet.
            </p>
          ) : (
            <div
              style={{
                display:
                  "grid",
                gap:
                  9,
              }}
            >
              {updates.map(
                (
                  update
                ) => (
                  <UpdateCard
                    key={
                      update.id
                    }
                    update={
                      update
                    }
                  />
                )
              )}
            </div>
          )}
        </article>

        {success && (
          <div
            style={{
              background:
                C.mint,
              color:
                C.navy,
              padding:
                11,
              fontSize:
                12.5,
              fontWeight:
                700,
            }}
          >
            {success}
          </div>
        )}

        {error && (
          <p
            role="alert"
            style={{
              margin:
                0,
              color:
                "#B23B2E",
              fontSize:
                12.5,
            }}
          >
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

function UpdateCard({
  update,
}: {
  update:
    FosterUpdate;
}) {
  return (
    <div
      style={{
        border:
          `1px solid ${C.border}`,
        padding:
          12,
        background:
          "#FAFBFC",
      }}
    >
      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          gap:
            10,
          flexWrap:
            "wrap",
        }}
      >
        <div>
          <strong
            style={{
              color:
                C.navy,
              fontSize:
                13,
            }}
          >
            {update.title ||
              fmt(
                update.update_type
              )}
          </strong>

          <div
            style={{
              color:
                C.muted,
              fontSize:
                10.5,
              marginTop:
                3,
            }}
          >
            {fmt(
              update.update_type
            )}
            {" · "}
            {new Date(
              update.submitted_at
            ).toLocaleString()}
          </div>
        </div>

        <span
          style={{
            background:
              update.status ===
              "submitted"
                ? C.peach
                : C.mint,
            color:
              C.navy,
            padding:
              "4px 7px",
            fontSize:
              10,
            fontWeight:
              800,
            textTransform:
              "uppercase",
          }}
        >
          {fmt(
            update.status
          )}
        </span>
      </div>

      <p
        style={
          bodyStyle
        }
      >
        {
          update.update_text
        }
      </p>

      {update.review_notes && (
        <div
          style={{
            marginTop:
              9,
            background:
              C.white,
            border:
              `1px solid ${C.border}`,
            padding:
              9,
          }}
        >
          <strong
            style={{
              color:
                C.navy,
              fontSize:
                10.5,
              textTransform:
                "uppercase",
            }}
          >
            Rescue Review
          </strong>

          <p
            style={
              bodyStyle
            }
          >
            {
              update.review_notes
            }
          </p>
        </div>
      )}
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background:
          "#F8FAFC",
        border:
          `1px solid ${C.border}`,
        padding:
          10,
      }}
    >
      <div
        style={{
          color:
            C.muted,
          fontSize:
            10,
          fontWeight:
            800,
          textTransform:
            "uppercase",
          letterSpacing:
            ".04em",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color:
            C.navy,
          fontSize:
            12.5,
          fontWeight:
            700,
          marginTop:
            4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Permission({
  enabled,
  label,
}: {
  enabled: boolean;
  label: string;
}) {
  return (
    <div
      style={{
        background:
          enabled
            ? C.mint
            : "#F4F6F8",
        color:
          C.navy,
        padding:
          "9px 10px",
        fontSize:
          12,
        fontWeight:
          700,
      }}
    >
      {enabled
        ? "✓ "
        : "— "}
      {label}
    </div>
  );
}

function fmt(
  value:
    | string
    | null
) {
  if (!value) {
    return "—";
  }

  return value
    .replaceAll(
      "_",
      " "
    )
    .replace(
      /\b\w/g,
      (
        letter
      ) =>
        letter.toUpperCase()
    );
}

const backLink:
  React.CSSProperties =
{
  display:
    "inline-block",
  color:
    C.muted,
  textDecoration:
    "none",
  fontSize:
    12,
  fontWeight:
    700,
  marginBottom:
    18,
};

const eyebrow:
  React.CSSProperties =
{
  margin:
    "0 0 6px",
  color:
    C.coral,
  fontSize:
    11.5,
  fontWeight:
    800,
  letterSpacing:
    ".1em",
  textTransform:
    "uppercase",
};

const heading:
  React.CSSProperties =
{
  margin:
    0,
  color:
    C.navy,
  fontSize:
    30,
  lineHeight:
    1.1,
};

const intro:
  React.CSSProperties =
{
  margin:
    "8px 0 0",
  color:
    C.muted,
  fontSize:
    13.5,
  lineHeight:
    1.55,
  maxWidth:
    720,
};

const stats:
  React.CSSProperties =
{
  display:
    "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(145px, 1fr))",
  gap:
    8,
  marginTop:
    14,
};

const card:
  React.CSSProperties =
{
  background:
    C.white,
  border:
    `1px solid ${C.border}`,
  padding:
    17,
};

const sectionHeading:
  React.CSSProperties =
{
  margin:
    "0 0 10px",
  color:
    C.navy,
  fontSize:
    16,
};

const bodyStyle:
  React.CSSProperties =
{
  margin:
    "6px 0 0",
  color:
    C.muted,
  fontSize:
    12.75,
  lineHeight:
    1.55,
  whiteSpace:
    "pre-wrap",
};

const noteBox:
  React.CSSProperties =
{
  marginTop:
    12,
  background:
    C.peach,
  padding:
    11,
};

const noteTitle:
  React.CSSProperties =
{
  color:
    C.navy,
  fontSize:
    11,
  textTransform:
    "uppercase",
  letterSpacing:
    ".04em",
};

const labelStyle:
  React.CSSProperties =
{
  display:
    "grid",
  gap:
    6,
  color:
    C.navy,
  fontSize:
    12.5,
  fontWeight:
    700,
};

const inputStyle:
  React.CSSProperties =
{
  width:
    "100%",
  boxSizing:
    "border-box",
  border:
    `1px solid ${C.border}`,
  padding:
    "9px 10px",
  background:
    C.white,
  color:
    "#1C1B19",
  fontFamily:
    "inherit",
};

const actionButton:
  React.CSSProperties =
{
  border:
    "none",
  background:
    C.navy,
  color:
    "#fff",
  padding:
    "9px 12px",
  fontWeight:
    800,
  fontSize:
    12,
  cursor:
    "pointer",
};
