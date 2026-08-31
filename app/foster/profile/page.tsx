"use client";

import {
  useEffect,
  useState,
} from "react";

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
  page: "#FFFDFC",
};

const SPECIES_OPTIONS = [
  "Dogs",
  "Cats",
  "Puppies",
  "Kittens",
  "Other",
];

const SIZE_OPTIONS = [
  "Small",
  "Medium",
  "Large",
  "Extra Large",
];

export default function FosterProfilePage() {
  const [
    accountEmail,
    setAccountEmail,
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

  const [
    form,
    setForm,
  ] =
    useState({
      fullName: "",
      phone: "",
      city: "",
      state: "TX",
      postalCode: "",
      availabilityStatus:
        "available",
      unavailableUntil: "",
      maxCapacity: "",
      speciesPreferences:
        [] as string[],
      sizePreferences:
        [] as string[],
      residentPets: "",
      childrenInHome:
        "" as
          | ""
          | "yes"
          | "no",
      hasFencedYard:
        "" as
          | ""
          | "yes"
          | "no",
      fosterExperience: "",
      medicalExperience: "",
      behavioralExperience: "",
      transportAvailable:
        false,
      profileNotes: "",
    });

  useEffect(() => {
    fetch(
      "/api/foster/profile",
      {
        cache:
          "no-store",
      }
    )
      .then(
        async (
          res
        ) => {
          const data =
            await res.json();

          if (
            res.status ===
            401
          ) {
            window.location.href =
              "/login?portal=foster";

            return;
          }

          if (!res.ok) {
            throw new Error(
              data.error ??
                "Couldn't load Foster Profile."
            );
          }

          const profile =
            data.profile;

          setAccountEmail(
            data.accountEmail ??
              profile.email ??
              ""
          );

          setForm({
            fullName:
              profile.full_name ??
              "",
            phone:
              profile.phone ??
              "",
            city:
              profile.city ??
              "",
            state:
              profile.state ??
              "TX",
            postalCode:
              profile.postal_code ??
              "",
            availabilityStatus:
              profile.availability_status ??
              "available",
            unavailableUntil:
              profile.unavailable_until
                ? String(
                    profile.unavailable_until
                  ).slice(
                    0,
                    10
                  )
                : "",
            maxCapacity:
              profile.max_capacity !==
                null &&
              profile.max_capacity !==
                undefined
                ? String(
                    profile.max_capacity
                  )
                : "",
            speciesPreferences:
              Array.isArray(
                profile.species_preferences
              )
                ? profile.species_preferences
                : [],
            sizePreferences:
              Array.isArray(
                profile.size_preferences
              )
                ? profile.size_preferences
                : [],
            residentPets:
              profile.resident_pets ??
              "",
            childrenInHome:
              profile.children_in_home ===
              true
                ? "yes"
                : profile.children_in_home ===
                  false
                ? "no"
                : "",
            hasFencedYard:
              profile.has_fenced_yard ===
              true
                ? "yes"
                : profile.has_fenced_yard ===
                  false
                ? "no"
                : "",
            fosterExperience:
              profile.foster_experience ??
              "",
            medicalExperience:
              profile.medical_experience ??
              "",
            behavioralExperience:
              profile.behavioral_experience ??
              "",
            transportAvailable:
              Boolean(
                profile.transport_available
              ),
            profileNotes:
              profile.profile_notes ??
              "",
          });
        }
      )
      .catch(
        (
          err
        ) => {
          setError(
            err instanceof Error
              ? err.message
              : "Couldn't load Foster Profile."
          );
        }
      )
      .finally(
        () => {
          setLoading(
            false
          );
        }
      );
  }, []);

  function update(
    field: string,
    value:
      | string
      | boolean
      | string[]
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

  function toggleArrayValue(
    field:
      | "speciesPreferences"
      | "sizePreferences",
    value: string
  ) {
    setForm(
      (
        current
      ) => {
        const values =
          current[
            field
          ];

        return {
          ...current,
          [field]:
            values.includes(
              value
            )
              ? values.filter(
                  (
                    item
                  ) =>
                    item !==
                    value
                )
              : [
                  ...values,
                  value,
                ],
        };
      }
    );
  }

  async function save(
    event:
      React.FormEvent
  ) {
    event.preventDefault();

    setSaving(
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
          "/api/foster/profile",
          {
            method:
              "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                ...form,
                childrenInHome:
                  form.childrenInHome ===
                  ""
                    ? null
                    : form.childrenInHome ===
                      "yes",
                hasFencedYard:
                  form.hasFencedYard ===
                  ""
                    ? null
                    : form.hasFencedYard ===
                      "yes",
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't save Foster Profile."
        );
      }

      setSuccess(
        "Foster Profile saved."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't save Foster Profile."
      );
    } finally {
      setSaving(
        false
      );
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
        width:
          "100%",
        maxWidth:
          920,
        margin:
          "0 auto",
      }}
    >
      <p
        style={
          eyebrowStyle
        }
      >
        Volunteer Portal
      </p>

      <h1
        style={
          headingStyle
        }
      >
        Foster Profile
      </h1>

      <p
        style={
          introStyle
        }
      >
        Keep your availability,
        household information,
        foster preferences, and
        experience up to date.
        Rescue-specific approvals
        and permissions remain
        separate under Rescue
        Relationships.
      </p>

      <form
        onSubmit={
          save
        }
        style={{
          display:
            "grid",
          gap:
            14,
          marginTop:
            20,
        }}
      >
        <Card
          title="Contact & Location"
        >
          <div
            style={
              twoCol
            }
          >
            <Field
              label="Full Name"
              value={
                form.fullName
              }
              onChange={(v) =>
                update(
                  "fullName",
                  v
                )
              }
            />

            <label
              style={
                labelStyle
              }
            >
              Account Email

              <input
                value={
                  accountEmail
                }
                disabled
                style={{
                  ...inputStyle,
                  background:
                    "#F4F6F8",
                  color:
                    COLORS.muted,
                }}
              />
            </label>

            <Field
              label="Phone"
              value={
                form.phone
              }
              onChange={(v) =>
                update(
                  "phone",
                  v
                )
              }
              type="tel"
            />

            <Field
              label="City"
              value={
                form.city
              }
              onChange={(v) =>
                update(
                  "city",
                  v
                )
              }
            />

            <Field
              label="State"
              value={
                form.state
              }
              onChange={(v) =>
                update(
                  "state",
                  v
                    .toUpperCase()
                    .slice(
                      0,
                      2
                    )
                )
              }
            />

            <Field
              label="ZIP / Postal Code"
              value={
                form.postalCode
              }
              onChange={(v) =>
                update(
                  "postalCode",
                  v
                )
              }
            />
          </div>
        </Card>

        <Card
          title="Availability"
        >
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
              Current Availability

              <select
                value={
                  form.availabilityStatus
                }
                onChange={(e) =>
                  update(
                    "availabilityStatus",
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              >
                <option value="available">
                  Available
                </option>

                <option value="limited">
                  Limited
                </option>

                <option value="unavailable">
                  Unavailable
                </option>
              </select>
            </label>

            <Field
              label="Unavailable Until"
              value={
                form.unavailableUntil
              }
              onChange={(v) =>
                update(
                  "unavailableUntil",
                  v
                )
              }
              type="date"
            />

            <Field
              label="Maximum Foster Capacity"
              value={
                form.maxCapacity
              }
              onChange={(v) =>
                update(
                  "maxCapacity",
                  v
                )
              }
              type="number"
            />
          </div>
        </Card>

        <Card
          title="Animal Preferences"
        >
          <PreferenceGroup
            label="Species / Life Stage"
            values={
              SPECIES_OPTIONS
            }
            selected={
              form.speciesPreferences
            }
            onToggle={(v) =>
              toggleArrayValue(
                "speciesPreferences",
                v
              )
            }
          />

          <div
            style={{
              height:
                14,
            }}
          />

          <PreferenceGroup
            label="Size Preferences"
            values={
              SIZE_OPTIONS
            }
            selected={
              form.sizePreferences
            }
            onToggle={(v) =>
              toggleArrayValue(
                "sizePreferences",
                v
              )
            }
          />
        </Card>

        <Card
          title="Household"
        >
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
              Children in Home

              <select
                value={
                  form.childrenInHome
                }
                onChange={(e) =>
                  update(
                    "childrenInHome",
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              >
                <option value="">
                  Not Recorded
                </option>

                <option value="yes">
                  Yes
                </option>

                <option value="no">
                  No
                </option>
              </select>
            </label>

            <label
              style={
                labelStyle
              }
            >
              Fenced Yard

              <select
                value={
                  form.hasFencedYard
                }
                onChange={(e) =>
                  update(
                    "hasFencedYard",
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              >
                <option value="">
                  Not Recorded
                </option>

                <option value="yes">
                  Yes
                </option>

                <option value="no">
                  No
                </option>
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
            Resident Pets

            <textarea
              value={
                form.residentPets
              }
              onChange={(e) =>
                update(
                  "residentPets",
                  e.target.value
                )
              }
              rows={
                3
              }
              style={
                inputStyle
              }
              placeholder="Species, size, age, temperament, or other relevant information."
            />
          </label>
        </Card>

        <Card
          title="Experience"
        >
          <label
            style={
              labelStyle
            }
          >
            Foster Experience

            <textarea
              value={
                form.fosterExperience
              }
              onChange={(e) =>
                update(
                  "fosterExperience",
                  e.target.value
                )
              }
              rows={
                4
              }
              style={
                inputStyle
              }
            />
          </label>

          <label
            style={{
              ...labelStyle,
              marginTop:
                12,
            }}
          >
            Medical Experience

            <textarea
              value={
                form.medicalExperience
              }
              onChange={(e) =>
                update(
                  "medicalExperience",
                  e.target.value
                )
              }
              rows={
                4
              }
              style={
                inputStyle
              }
              placeholder="Medications, post-op care, special needs, bottle feeding, etc."
            />
          </label>

          <label
            style={{
              ...labelStyle,
              marginTop:
                12,
            }}
          >
            Behavioral Experience

            <textarea
              value={
                form.behavioralExperience
              }
              onChange={(e) =>
                update(
                  "behavioralExperience",
                  e.target.value
                )
              }
              rows={
                4
              }
              style={
                inputStyle
              }
              placeholder="Fearful animals, decompression, resource guarding, training, etc."
            />
          </label>
        </Card>

        <Card
          title="Other Foster Support"
        >
          <label
            style={
              checkboxRowStyle
            }
          >
            <input
              type="checkbox"
              checked={
                form.transportAvailable
              }
              onChange={(e) =>
                update(
                  "transportAvailable",
                  e.target.checked
                )
              }
            />

            <span>
              I may be available
              to help with animal
              transport.
            </span>
          </label>

          <label
            style={{
              ...labelStyle,
              marginTop:
                14,
            }}
          >
            Private Profile Notes

            <textarea
              value={
                form.profileNotes
              }
              onChange={(e) =>
                update(
                  "profileNotes",
                  e.target.value
                )
              }
              rows={
                4
              }
              style={
                inputStyle
              }
              placeholder="Anything else you want saved with your Foster Profile."
            />
          </label>
        </Card>

        <div
          style={{
            display:
              "flex",
            alignItems:
              "center",
            gap:
              12,
            flexWrap:
              "wrap",
          }}
        >
          <button
            type="submit"
            disabled={
              saving
            }
            style={{
              ...primaryButton,
              opacity:
                saving
                  ? 0.65
                  : 1,
            }}
          >
            {saving
              ? "Saving…"
              : "Save Foster Profile"}
          </button>

          {success && (
            <span
              style={{
                color:
                  "#2E6B57",
                fontSize:
                  12.5,
                fontWeight:
                  700,
              }}
            >
              {success}
            </span>
          )}
        </div>

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
      </form>
    </section>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children:
    React.ReactNode;
}) {
  return (
    <section
      style={{
        background:
          COLORS.white,
        border:
          `1px solid ${COLORS.border}`,
        padding:
          17,
      }}
    >
      <h2
        style={{
          margin:
            "0 0 13px",
          color:
            COLORS.navy,
          fontSize:
            16,
        }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
}) {
  return (
    <label
      style={
        labelStyle
      }
    >
      {label}

      <input
        type={
          type
        }
        value={
          value
        }
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        style={
          inputStyle
        }
      />
    </label>
  );
}

function PreferenceGroup({
  label,
  values,
  selected,
  onToggle,
}: {
  label: string;
  values:
    string[];
  selected:
    string[];
  onToggle: (
    value: string
  ) => void;
}) {
  return (
    <div>
      <div
        style={{
          color:
            COLORS.navy,
          fontSize:
            12.5,
          fontWeight:
            700,
          marginBottom:
            8,
        }}
      >
        {label}
      </div>

      <div
        style={{
          display:
            "flex",
          gap:
            8,
          flexWrap:
            "wrap",
        }}
      >
        {values.map(
          (
            value
          ) => {
            const active =
              selected.includes(
                value
              );

            return (
              <button
                key={
                  value
                }
                type="button"
                onClick={() =>
                  onToggle(
                    value
                  )
                }
                style={{
                  border:
                    `1px solid ${active ? COLORS.navy : COLORS.border}`,
                  background:
                    active
                      ? COLORS.navy
                      : COLORS.white,
                  color:
                    active
                      ? "#fff"
                      : COLORS.navy,
                  padding:
                    "7px 10px",
                  fontSize:
                    12,
                  fontWeight:
                    700,
                  cursor:
                    "pointer",
                }}
              >
                {value}
              </button>
            );
          }
        )}
      </div>
    </div>
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
    700,
};

const twoCol:
  React.CSSProperties =
{
  display:
    "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
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
    "#fff",
  color:
    "#1C1B19",
  fontFamily:
    "inherit",
};

const checkboxRowStyle:
  React.CSSProperties =
{
  display:
    "flex",
  alignItems:
    "flex-start",
  gap:
    9,
  color:
    COLORS.navy,
  fontSize:
    12.5,
  fontWeight:
    700,
  lineHeight:
    1.45,
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
