"use client";

import {
  useState,
} from "react";

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  peach: "#FBE3DA",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
  page: "#FFFDFC",
};

export default function NewPetPage() {
  const [
    form,
    setForm,
  ] =
    useState({
      name: "",
      species: "",
      breedOrType: "",
      birthDate: "",
      approximateAgeText: "",
      sex: "",
      colorMarkings: "",
      weightLbs: "",
      spayNeuterStatus:
        "unknown",
      microchipNumber: "",
      microchipCompany: "",
      veterinarianName: "",
      veterinarianPhone: "",
      photoUrl: "",
      notes: "",
    });

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

  function update(
    field: string,
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]:
          value,
      })
    );
  }

  async function submit(
    e:
      React.FormEvent
  ) {
    e.preventDefault();

    setSaving(true);
    setError(null);

    try {
      const res =
        await fetch(
          "/api/pet-owner/pets",
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
        if (
          res.status ===
          401
        ) {
          window.location.href =
            "/pet-owner";

          return;
        }

        throw new Error(
          data.error ??
            "Couldn't add pet."
        );
      }

      window.location.href =
        `/pet-owner/pets/${encodeURIComponent(
          data.pet.id
        )}`;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't add pet."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          COLORS.page,
        padding:
          "28px 18px 44px",
        boxSizing:
          "border-box",
      }}
    >
      <section
        style={{
          width:
            "100%",
          maxWidth:
            820,
          margin:
            "0 auto",
        }}
      >
        <a
          href="/pet-owner"
          style={{
            display:
              "inline-block",
            marginBottom:
              18,
            color:
              COLORS.muted,
            textDecoration:
              "none",
            fontSize:
              12.5,
            fontWeight:
              700,
          }}
        >
          ← Back to My Pets
        </a>

        <p
          style={{
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
          }}
        >
          Pet Owner Portal
        </p>

        <h1
          style={{
            margin:
              "0 0 7px",
            color:
              COLORS.navy,
            fontSize:
              30,
          }}
        >
          Add Pet
        </h1>

        <p
          style={{
            margin:
              "0 0 20px",
            color:
              COLORS.muted,
            fontSize:
              13.5,
            lineHeight:
              1.55,
          }}
        >
          Start with the basics.
          You can add records,
          documents, reminders,
          and more details later.
        </p>

        <form
          onSubmit={
            submit
          }
          style={{
            display:
              "grid",
            gap:
              14,
          }}
        >
          <FormSection
            title="Pet Information"
          >
            <div
              style={
                twoCol
              }
            >
              <Field
                label="Pet name *"
                value={
                  form.name
                }
                onChange={(v) =>
                  update(
                    "name",
                    v
                  )
                }
                required
              />

              <Field
                label="Species"
                value={
                  form.species
                }
                onChange={(v) =>
                  update(
                    "species",
                    v
                  )
                }
                placeholder="Dog, cat, rabbit..."
              />

              <Field
                label="Breed / Type"
                value={
                  form.breedOrType
                }
                onChange={(v) =>
                  update(
                    "breedOrType",
                    v
                  )
                }
              />

              <label
                style={
                  labelStyle
                }
              >
                Sex

                <select
                  value={
                    form.sex
                  }
                  onChange={(e) =>
                    update(
                      "sex",
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                >
                  <option value="">
                    Not recorded
                  </option>
                  <option value="female">
                    Female
                  </option>
                  <option value="male">
                    Male
                  </option>
                  <option value="unknown">
                    Unknown
                  </option>
                </select>
              </label>

              <Field
                label="Birth date"
                value={
                  form.birthDate
                }
                onChange={(v) =>
                  update(
                    "birthDate",
                    v
                  )
                }
                type="date"
              />

              <Field
                label="Approximate age"
                value={
                  form.approximateAgeText
                }
                onChange={(v) =>
                  update(
                    "approximateAgeText",
                    v
                  )
                }
                placeholder="Example: About 4 years"
              />

              <Field
                label="Weight (lbs)"
                value={
                  form.weightLbs
                }
                onChange={(v) =>
                  update(
                    "weightLbs",
                    v
                  )
                }
                type="number"
              />

              <Field
                label="Color / Markings"
                value={
                  form.colorMarkings
                }
                onChange={(v) =>
                  update(
                    "colorMarkings",
                    v
                  )
                }
              />
            </div>
          </FormSection>

          <FormSection
            title="Identification & Care"
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
                Spay / Neuter Status

                <select
                  value={
                    form.spayNeuterStatus
                  }
                  onChange={(e) =>
                    update(
                      "spayNeuterStatus",
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                >
                  <option value="unknown">
                    Unknown
                  </option>
                  <option value="spayed">
                    Spayed
                  </option>
                  <option value="neutered">
                    Neutered
                  </option>
                  <option value="intact">
                    Intact
                  </option>
                  <option value="not_applicable">
                    Not Applicable
                  </option>
                </select>
              </label>

              <Field
                label="Microchip Number"
                value={
                  form.microchipNumber
                }
                onChange={(v) =>
                  update(
                    "microchipNumber",
                    v
                  )
                }
              />

              <Field
                label="Microchip Company"
                value={
                  form.microchipCompany
                }
                onChange={(v) =>
                  update(
                    "microchipCompany",
                    v
                  )
                }
              />

              <Field
                label="Veterinarian"
                value={
                  form.veterinarianName
                }
                onChange={(v) =>
                  update(
                    "veterinarianName",
                    v
                  )
                }
              />

              <Field
                label="Veterinarian Phone"
                value={
                  form.veterinarianPhone
                }
                onChange={(v) =>
                  update(
                    "veterinarianPhone",
                    v
                  )
                }
              />

              <Field
                label="Photo URL"
                value={
                  form.photoUrl
                }
                onChange={(v) =>
                  update(
                    "photoUrl",
                    v
                  )
                }
                type="url"
                placeholder="Photo upload will be added later"
              />
            </div>
          </FormSection>

          <FormSection
            title="Notes"
          >
            <label
              style={
                labelStyle
              }
            >
              Notes

              <textarea
                value={
                  form.notes
                }
                onChange={(e) =>
                  update(
                    "notes",
                    e.target.value
                  )
                }
                rows={
                  5
                }
                style={
                  inputStyle
                }
                placeholder="Allergies, behavior notes, care details, or anything else you want to remember."
              />
            </label>
          </FormSection>

          <div
            style={{
              display:
                "flex",
              gap:
                10,
              alignItems:
                "center",
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
                : "Add Pet"}
            </button>

            <a
              href="/pet-owner"
              style={{
                color:
                  COLORS.muted,
                textDecoration:
                  "none",
                fontSize:
                  12.5,
                fontWeight:
                  700,
              }}
            >
              Cancel
            </a>
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
    </main>
  );
}

function FormSection({
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
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
        required={
          required
        }
        placeholder={
          placeholder
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
