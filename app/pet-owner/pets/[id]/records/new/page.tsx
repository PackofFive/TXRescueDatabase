"use client";

import {
  useParams,
} from "next/navigation";

import {
  useState,
} from "react";

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
  page: "#FFFDFC",
};

const RECORD_TYPES = [
  ["vaccination", "Vaccination"],
  ["medical", "Medical"],
  ["medication", "Medication"],
  ["preventive_care", "Preventive Care"],
  ["microchip", "Microchip"],
  ["license", "License"],
  ["insurance", "Insurance"],
  ["lab_result", "Lab Result"],
  ["procedure", "Procedure"],
  ["other", "Other"],
];

export default function NewPetRecordPage() {
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
      recordType:
        "vaccination",
      title: "",
      recordDate: "",
      providerName: "",
      documentUrl: "",
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
          `/api/pet-owner/pets/${encodeURIComponent(
            petId
          )}/records`,
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
            "/login?portal=pet-owner";

          return;
        }

        throw new Error(
          data.error ??
            "Couldn't add record."
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
          : "Couldn't add record."
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
            720,
          margin:
            "0 auto",
        }}
      >
        <a
          href={`/pet-owner/pets/${encodeURIComponent(
            petId
          )}`}
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
          ← Back to Pet Profile
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
          Add Record
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
          Keep important care,
          medical, identification,
          and ownership information
          together in your pet&apos;s
          private profile.
        </p>

        <form
          onSubmit={
            submit
          }
          style={{
            background:
              COLORS.white,
            border:
              `1px solid ${COLORS.border}`,
            padding:
              18,
            display:
              "grid",
            gap:
              14,
          }}
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
              Record Type *

              <select
                value={
                  form.recordType
                }
                onChange={(e) =>
                  update(
                    "recordType",
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              >
                {RECORD_TYPES.map(
                  (
                    [
                      value,
                      label,
                    ]
                  ) => (
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

            <Field
              label="Record Date"
              value={
                form.recordDate
              }
              onChange={(v) =>
                update(
                  "recordDate",
                  v
                )
              }
              type="date"
            />
          </div>

          <Field
            label="Title *"
            value={
              form.title
            }
            onChange={(v) =>
              update(
                "title",
                v
              )
            }
            required
            placeholder="Example: Rabies vaccination"
          />

          <Field
            label="Veterinarian / Provider"
            value={
              form.providerName
            }
            onChange={(v) =>
              update(
                "providerName",
                v
              )
            }
            placeholder="Clinic, veterinarian, pharmacy, city..."
          />

          <Field
            label="Document URL"
            value={
              form.documentUrl
            }
            onChange={(v) =>
              update(
                "documentUrl",
                v
              )
            }
            type="url"
            placeholder="Document upload will be added later"
          />

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
              placeholder="Dose, lot number, results, instructions, renewal information, or other details."
            />
          </label>

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
                  saving
                    ? "default"
                    : "pointer",
                opacity:
                  saving
                    ? 0.65
                    : 1,
              }}
            >
              {saving
                ? "Saving…"
                : "Add Record"}
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
