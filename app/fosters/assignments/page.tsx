"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type Foster = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string;
  availability_status: string;
  max_capacity: number | null;
  species_preferences: string[];
  size_preferences: string[];
  access_level: string;
  can_submit_updates: boolean;
  can_add_photos: boolean;
  can_add_behavior_notes: boolean;
  approved_at: string | null;
};

type Animal = {
  id: string;
  display_name: string;
  species: string;
  breed_or_type: string | null;
  sex: string | null;
  age_estimate: string | null;
  size: string | null;
  urgency: string;
  placement: string;
  assignment_id: string | null;
  assigned_foster_id: string | null;
  assigned_foster_name: string | null;
  started_at: string | null;
  assignment_notes: string | null;
};

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  peach: "#FBE3DA",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
};

export default function FosterAssignmentsPage() {
  const [
    fosters,
    setFosters,
  ] =
    useState<Foster[]>([]);

  const [
    animals,
    setAnimals,
  ] =
    useState<Animal[]>([]);

  const [
    fosterId,
    setFosterId,
  ] =
    useState("");

  const [
    animalId,
    setAnimalId,
  ] =
    useState("");

  const [
    notes,
    setNotes,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
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
    success,
    setSuccess,
  ] =
    useState<string | null>(
      null
    );

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const res =
        await fetch(
          "/api/fosters/assignments",
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
            "Couldn't load foster assignments."
        );
      }

      setFosters(
        data.fosters ??
          []
      );

      setAnimals(
        data.animals ??
          []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load foster assignments."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const availableAnimals =
    useMemo(
      () =>
        animals.filter(
          (
            animal
          ) =>
            !animal.assignment_id
        ),
      [animals]
    );

  const assignedAnimals =
    useMemo(
      () =>
        animals.filter(
          (
            animal
          ) =>
            Boolean(
              animal.assignment_id
            )
        ),
      [animals]
    );

  async function assign(
    event:
      React.FormEvent
  ) {
    event.preventDefault();

    if (
      !fosterId ||
      !animalId
    ) {
      setError(
        "Select both a foster and an animal."
      );
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res =
        await fetch(
          "/api/fosters/assignments",
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                fosterId,
                animalId,
                notes,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't assign foster."
        );
      }

      setFosterId("");
      setAnimalId("");
      setNotes("");
      setSuccess(
        "Foster assignment created."
      );

      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't assign foster."
      );
    } finally {
      setSaving(false);
    }
  }

  async function endAssignment(
    assignmentId: string,
    animalName: string
  ) {
    const confirmed =
      window.confirm(
        `End the active foster assignment for ${animalName}?`
      );

    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res =
        await fetch(
          "/api/fosters/assignments",
          {
            method:
              "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                assignmentId,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't end foster assignment."
        );
      }

      setSuccess(
        "Foster assignment ended."
      );

      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't end foster assignment."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p
        style={{
          color:
            COLORS.muted,
        }}
      >
        Loading…
      </p>
    );
  }

  return (
    <section
      style={{
        maxWidth:
          1000,
      }}
    >
      <p
        style={
          eyebrowStyle
        }
      >
        Rescue Manager
      </p>

      <h1
        style={
          headingStyle
        }
      >
        Foster Animal Access
      </h1>

      <p
        style={
          introStyle
        }
      >
        Assign animals in your
        organization&apos;s care to
        approved fosters. An active
        assignment gives the foster
        access to that specific animal;
        the foster&apos;s relationship
        permissions determine what
        updates they may submit.
      </p>

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(160px, 1fr))",
          gap:
            10,
          margin:
            "18px 0",
        }}
      >
        {fosters.length > 0 && <Stat value={fosters.length} label="Approved Fosters" />}

        {assignedAnimals.length > 0 && <Stat value={assignedAnimals.length} label="Animals with Fosters" />}

        {availableAnimals.length > 0 && <Stat value={availableAnimals.length} label="Available to Assign" />}
      </div>

      {fosters.length === 0 && (
        <div style={{ ...cardStyle, background: COLORS.mint }}>
          <strong style={{ color: COLORS.navy }}>No approved fosters are available</strong>
          <p style={bodyStyle}>Approve or invite a foster before creating an animal assignment.</p>
          <a href="/fosters" style={{ color: COLORS.navy, fontWeight: 800 }}>Manage Fosters</a>
        </div>
      )}

      {fosters.length > 0 && availableAnimals.length === 0 && (
        <div style={{ ...cardStyle, background: COLORS.mint }}>
          <strong style={{ color: COLORS.navy }}>You’re all caught up</strong>
          <p style={bodyStyle}>There are no unassigned animals available for a new foster placement.</p>
        </div>
      )}

      {fosters.length > 0 && availableAnimals.length > 0 && (
      <form
        onSubmit={
          assign
        }
        style={
          cardStyle
        }
      >
        <h2
          style={
            cardHeading
          }
        >
          Assign an Animal
        </h2>

        {fosters.length ===
        0 ? (
          <p
            style={
              bodyStyle
            }
          >
            Your organization does not
            currently have an approved
            foster relationship.
          </p>
        ) : availableAnimals.length ===
          0 ? (
          <p
            style={
              bodyStyle
            }
          >
            There are no unassigned
            animals currently available
            for a new foster assignment.
          </p>
        ) : (
          <>
            <div
              style={
                twoCol
              }
            >
              <label
                style={
                  labelStyle
                }
              >
                Approved Foster

                <select
                  value={
                    fosterId
                  }
                  onChange={(e) =>
                    setFosterId(
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                >
                  <option value="">
                    Select foster
                  </option>

                  {fosters.map(
                    (
                      foster
                    ) => (
                      <option
                        key={
                          foster.id
                        }
                        value={
                          foster.id
                        }
                      >
                        {
                          foster.full_name
                        }
                        {" — "}
                        {
                          formatValue(
                            foster.availability_status
                          )
                        }
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
                Animal

                <select
                  value={
                    animalId
                  }
                  onChange={(e) =>
                    setAnimalId(
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                >
                  <option value="">
                    Select animal
                  </option>

                  {availableAnimals.map(
                    (
                      animal
                    ) => (
                      <option
                        key={
                          animal.id
                        }
                        value={
                          animal.id
                        }
                      >
                        {
                          animal.display_name
                        }
                        {" — "}
                        {
                          animal.species
                        }
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>

            <label
              style={{
                ...labelStyle,
                marginTop:
                  12,
              }}
            >
              Assignment Notes

              <textarea
                value={
                  notes
                }
                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }
                rows={
                  3
                }
                style={
                  inputStyle
                }
                placeholder="Optional private notes about this foster placement."
              />
            </label>

            <button
              type="submit"
              disabled={
                saving
              }
              style={{
                ...primaryButton,
                marginTop:
                  12,
                opacity:
                  saving
                    ? 0.65
                    : 1,
              }}
            >
              {saving
                ? "Saving…"
                : "Assign Foster"}
            </button>
          </>
        )}
      </form>
      )}

      {success && (
        <p
          style={{
            color:
              "#2E6B57",
            fontWeight:
              700,
            fontSize:
              12.5,
          }}
        >
          {success}
        </p>
      )}

      {error && (
        <p
          role="alert"
          style={{
            color:
              "#B23B2E",
            fontSize:
              12.5,
          }}
        >
          {error}
        </p>
      )}

      <div
        style={{
          marginTop:
            14,
        }}
      >
        <h2
          style={{
            margin:
              "0 0 10px",
            color:
              COLORS.navy,
            fontSize:
              18,
          }}
        >
          Active Foster Assignments
        </h2>

        {assignedAnimals.length ===
        0 ? (
          <div
            style={
              cardStyle
            }
          >
            <p
              style={
                bodyStyle
              }
            >
              No animals currently have
              an active foster assignment.
            </p>
          </div>
        ) : (
          <div
            style={{
              display:
                "grid",
              gap:
                10,
            }}
          >
            {assignedAnimals.map(
              (
                animal
              ) => (
                <article
                  key={
                    animal.id
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
                      gap:
                        14,
                      alignItems:
                        "flex-start",
                      flexWrap:
                        "wrap",
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          color:
                            COLORS.navy,
                          fontSize:
                            15,
                        }}
                      >
                        {
                          animal.display_name
                        }
                      </strong>

                      <div
                        style={{
                          color:
                            COLORS.muted,
                          fontSize:
                            12,
                          marginTop:
                            4,
                        }}
                      >
                        {
                          [
                            animal.species,
                            animal.breed_or_type,
                            animal.age_estimate,
                            animal.size,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              " · "
                            )
                        }
                      </div>
                    </div>

                    <span
                      style={{
                        background:
                          COLORS.mint,
                        color:
                          COLORS.navy,
                        padding:
                          "5px 8px",
                        fontSize:
                          10.5,
                        fontWeight:
                          800,
                        textTransform:
                          "uppercase",
                      }}
                    >
                      Active Foster
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop:
                        12,
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                      gap:
                        8,
                    }}
                  >
                    <Info
                      label="Foster"
                      value={
                        animal.assigned_foster_name ??
                        "Unknown"
                      }
                    />

                    <Info
                      label="Started"
                      value={
                        animal.started_at
                          ? new Date(
                              animal.started_at
                            ).toLocaleDateString()
                          : "—"
                      }
                    />

                    <Info
                      label="Placement"
                      value={
                        formatValue(
                          animal.placement
                        )
                      }
                    />
                  </div>

                  {animal.assignment_notes && (
                    <p
                      style={{
                        ...bodyStyle,
                        marginTop:
                          12,
                      }}
                    >
                      {
                        animal.assignment_notes
                      }
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={
                      saving
                    }
                    onClick={() =>
                      endAssignment(
                        animal.assignment_id!,
                        animal.display_name
                      )
                    }
                    style={{
                      ...secondaryButton,
                      marginTop:
                        12,
                    }}
                  >
                    End Assignment
                  </button>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div
      style={{
        background:
          COLORS.mint,
        padding:
          13,
      }}
    >
      <strong
        style={{
          display:
            "block",
          color:
            COLORS.navy,
          fontSize:
            22,
        }}
      >
        {value}
      </strong>

      <span
        style={{
          color:
            COLORS.muted,
          fontSize:
            11.5,
        }}
      >
        {label}
      </span>
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
          `1px solid ${COLORS.border}`,
        padding:
          10,
      }}
    >
      <div
        style={{
          color:
            COLORS.muted,
          fontSize:
            10,
          fontWeight:
            800,
          textTransform:
            "uppercase",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color:
            COLORS.navy,
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

function formatValue(
  value: string
) {
  return (
    value || "—"
  )
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

const eyebrowStyle:
  React.CSSProperties =
{
  margin:
    "0 0 6px",
  color:
    COLORS.coral,
  fontSize:
    11.5,
  fontWeight:
    800,
  letterSpacing:
    ".1em",
  textTransform:
    "uppercase",
};

const headingStyle:
  React.CSSProperties =
{
  margin:
    0,
  color:
    COLORS.navy,
  fontSize:
    30,
  lineHeight:
    1.1,
};

const introStyle:
  React.CSSProperties =
{
  margin:
    "8px 0 0",
  color:
    COLORS.muted,
  fontSize:
    13.5,
  lineHeight:
    1.55,
  maxWidth:
    720,
};

const cardStyle:
  React.CSSProperties =
{
  background:
    COLORS.white,
  border:
    `1px solid ${COLORS.border}`,
  padding:
    17,
};

const cardHeading:
  React.CSSProperties =
{
  margin:
    "0 0 13px",
  color:
    COLORS.navy,
  fontSize:
    16,
};

const bodyStyle:
  React.CSSProperties =
{
  margin:
    0,
  color:
    COLORS.muted,
  fontSize:
    12.75,
  lineHeight:
    1.55,
};

const twoCol:
  React.CSSProperties =
{
  display:
    "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap:
    12,
};

const labelStyle:
  React.CSSProperties =
{
  display:
    "grid",
  gap:
    6,
  color:
    COLORS.navy,
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
    `1px solid ${COLORS.border}`,
  padding:
    "9px 10px",
  background:
    COLORS.white,
  color:
    "#1C1B19",
  fontFamily:
    "inherit",
};

const primaryButton:
  React.CSSProperties =
{
  border:
    "none",
  background:
    COLORS.navy,
  color:
    "#fff",
  padding:
    "10px 14px",
  fontWeight:
    800,
  fontSize:
    13,
  cursor:
    "pointer",
};

const secondaryButton:
  React.CSSProperties =
{
  border:
    `1px solid ${COLORS.border}`,
  background:
    COLORS.white,
  color:
    COLORS.navy,
  padding:
    "8px 11px",
  fontWeight:
    800,
  fontSize:
    12,
  cursor:
    "pointer",
};
