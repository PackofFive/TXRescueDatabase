"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
  page: "#FFFDFC",
};

export default function EditPetPage() {
  const params =
    useParams<{
      id: string;
    }>();

  const petId =
    params.id;

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

  useEffect(() => {
    if (!petId) {
      return;
    }

    fetch(
      `/api/pet-owner/pets/${encodeURIComponent(
        petId
      )}`,
      {
        cache:
          "no-store",
      }
    )
      .then(async (res) => {
        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data.error ??
              "Couldn't load pet."
          );
        }

        const pet =
          data.pet;

        setForm({
          name:
            pet.name ?? "",
          species:
            pet.species ?? "",
          breedOrType:
            pet.breed_or_type ?? "",
          birthDate:
            pet.birth_date
              ? String(
                  pet.birth_date
                ).slice(0, 10)
              : "",
          approximateAgeText:
            pet.approximate_age_text ?? "",
          sex:
            pet.sex ?? "",
          colorMarkings:
            pet.color_markings ?? "",
          weightLbs:
            pet.weight_lbs !== null &&
            pet.weight_lbs !== undefined
              ? String(
                  pet.weight_lbs
                )
              : "",
          spayNeuterStatus:
            pet.spay_neuter_status ??
            "unknown",
          microchipNumber:
            pet.microchip_number ?? "",
          microchipCompany:
            pet.microchip_company ?? "",
          veterinarianName:
            pet.veterinarian_name ?? "",
          veterinarianPhone:
            pet.veterinarian_phone ?? "",
          photoUrl:
            pet.photo_url ?? "",
          notes:
            pet.notes ?? "",
        });
      })
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load pet."
        )
      )
      .finally(() =>
        setLoading(false)
      );
  }, [petId]);

  function update(
    field: string,
    value: string
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
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
          `/api/pet-owner/pets/${encodeURIComponent(
            petId
          )}`,
          {
            method:
              "PATCH",
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
            "Couldn't update pet."
        );
      }

      window.location.href =
        `/pet-owner/pets/${encodeURIComponent(
          petId
        )}`;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't update pet."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <section style={sectionStyle}>
          <p
            style={{
              color:
                COLORS.muted,
            }}
          >
            Loading…
          </p>
        </section>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <section style={sectionStyle}>
        <a
          href={`/pet-owner/pets/${encodeURIComponent(
            petId
          )}`}
          style={backLink}
        >
          ← Back to Pet Profile
        </a>

        <p style={eyebrow}>
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
          Edit Pet
        </h1>

        <p
          style={{
            margin:
              "0 0 20px",
            color:
              COLORS.muted,
            fontSize:
              13.5,
          }}
        >
          Update your pet&apos;s
          profile information.
        </p>

        <form
          onSubmit={submit}
          style={{
            display:
              "grid",
            gap:
              14,
          }}
        >
          <Card title="Pet Information">
            <div style={twoCol}>
              <Field
                label="Pet name *"
                value={form.name}
                onChange={(v) =>
                  update("name", v)
                }
                required
              />

              <Field
                label="Species"
                value={form.species}
                onChange={(v) =>
                  update("species", v)
                }
              />

              <Field
                label="Breed / Type"
                value={form.breedOrType}
                onChange={(v) =>
                  update(
                    "breedOrType",
                    v
                  )
                }
              />

              <label style={labelStyle}>
                Sex
                <select
                  value={form.sex}
                  onChange={(e) =>
                    update(
                      "sex",
                      e.target.value
                    )
                  }
                  style={inputStyle}
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
                value={form.birthDate}
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
              />

              <Field
                label="Weight (lbs)"
                value={form.weightLbs}
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
          </Card>

          <Card title="Identification & Care">
            <div style={twoCol}>
              <label style={labelStyle}>
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
                  style={inputStyle}
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
                value={form.photoUrl}
                onChange={(v) =>
                  update(
                    "photoUrl",
                    v
                  )
                }
                type="url"
              />
            </div>
          </Card>

          <Card title="Notes">
            <label style={labelStyle}>
              Notes
              <textarea
                value={form.notes}
                onChange={(e) =>
                  update(
                    "notes",
                    e.target.value
                  )
                }
                rows={5}
                style={inputStyle}
              />
            </label>
          </Card>

          <div
            style={{
              display:
                "flex",
              gap:
                10,
              flexWrap:
                "wrap",
              alignItems:
                "center",
            }}
          >
            <button
              type="submit"
              disabled={saving}
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
                : "Save Changes"}
            </button>

            <a
              href={`/pet-owner/pets/${encodeURIComponent(
                petId
              )}`}
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
                margin: 0,
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
  required = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label style={labelStyle}>
      {label}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        style={inputStyle}
      />
    </label>
  );
}

const pageStyle:
  React.CSSProperties =
{
  minHeight:
    "100vh",
  background:
    COLORS.page,
  padding:
    "28px 18px 44px",
  boxSizing:
    "border-box",
};

const sectionStyle:
  React.CSSProperties =
{
  width:
    "100%",
  maxWidth:
    820,
  margin:
    "0 auto",
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

const eyebrow:
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

const backLink:
  React.CSSProperties =
{
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
