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

export default function EditRecordPage() {
  const params = useParams<{
    id: string;
  }>();

  const recordId = params.id;

  const [petId, setPetId] =
    useState("");

  const [form, setForm] =
    useState({
      recordType: "vaccination",
      title: "",
      recordDate: "",
      providerName: "",
      documentUrl: "",
      notes: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!recordId) {
      return;
    }

    fetch(
      `/api/pet-owner/records/${encodeURIComponent(
        recordId
      )}`,
      {
        cache: "no-store",
      }
    )
      .then(async (res) => {
        const data =
          await res.json();

        if (res.status === 401) {
          window.location.href =
            "/login?portal=pet-owner";
          return;
        }

        if (!res.ok) {
          throw new Error(
            data.error ??
              "Couldn't load record."
          );
        }

        const record = data.record;

        setPetId(record.pet_id);

        setForm({
          recordType:
            record.record_type ??
            "other",
          title:
            record.title ?? "",
          recordDate:
            record.record_date
              ? String(
                  record.record_date
                ).slice(0, 10)
              : "",
          providerName:
            record.provider_name ?? "",
          documentUrl:
            record.document_url ?? "",
          notes:
            record.notes ?? "",
        });
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load record."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [recordId]);

  function update(
    field: string,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function save(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/pet-owner/records/${encodeURIComponent(
          recordId
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't update record."
        );
      }

      window.location.href =
        `/pet-owner/pets/${encodeURIComponent(
          data.record.pet_id
        )}`;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't update record."
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    const confirmed =
      window.confirm(
        "Delete this record? This cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/pet-owner/records/${encodeURIComponent(
          recordId
        )}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't delete record."
        );
      }

      window.location.href =
        `/pet-owner/pets/${encodeURIComponent(
          data.petId
        )}`;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't delete record."
      );
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <section style={sectionStyle}>
          <p
            style={{
              color: COLORS.muted,
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
          href={
            petId
              ? `/pet-owner/pets/${encodeURIComponent(
                  petId
                )}`
              : "/pet-owner"
          }
          style={backLinkStyle}
        >
          ← Back to Pet Profile
        </a>

        <p style={eyebrowStyle}>
          Pet Owner Portal
        </p>

        <h1
          style={{
            margin: "0 0 7px",
            color: COLORS.navy,
            fontSize: 30,
          }}
        >
          Edit Record
        </h1>

        <form
          onSubmit={save}
          style={{
            marginTop: 18,
            background: COLORS.white,
            border:
              `1px solid ${COLORS.border}`,
            padding: 18,
            display: "grid",
            gap: 14,
          }}
        >
          <div style={twoCol}>
            <label style={labelStyle}>
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
                style={inputStyle}
              >
                {RECORD_TYPES.map(
                  ([
                    value,
                    label,
                  ]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <Field
              label="Record Date"
              value={form.recordDate}
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
            value={form.title}
            onChange={(v) =>
              update("title", v)
            }
            required
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
          />

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

          <div
            style={{
              display: "flex",
              gap: 9,
              alignItems: "center",
              flexWrap: "wrap",
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

            <button
              type="button"
              disabled={deleting}
              onClick={remove}
              style={deleteButton}
            >
              {deleting
                ? "Deleting…"
                : "Delete Record"}
            </button>
          </div>

          {error && (
            <p
              role="alert"
              style={{
                margin: 0,
                color: "#B23B2E",
                fontSize: 12.5,
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
  minHeight: "100vh",
  background: COLORS.page,
  padding: "28px 18px 44px",
  boxSizing: "border-box",
};

const sectionStyle:
  React.CSSProperties =
{
  width: "100%",
  maxWidth: 720,
  margin: "0 auto",
};

const twoCol:
  React.CSSProperties =
{
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const eyebrowStyle:
  React.CSSProperties =
{
  margin: "0 0 6px",
  color: COLORS.coral,
  fontSize: 11.5,
  fontWeight: 800,
  letterSpacing: ".1em",
  textTransform: "uppercase",
};

const backLinkStyle:
  React.CSSProperties =
{
  display: "inline-block",
  marginBottom: 18,
  color: COLORS.muted,
  textDecoration: "none",
  fontSize: 12.5,
  fontWeight: 700,
};

const labelStyle:
  React.CSSProperties =
{
  display: "grid",
  gap: 6,
  color: COLORS.navy,
  fontSize: 12.5,
  fontWeight: 700,
};

const inputStyle:
  React.CSSProperties =
{
  width: "100%",
  boxSizing: "border-box",
  border:
    `1px solid ${COLORS.border}`,
  padding: "9px 10px",
  background: "#fff",
  color: "#1C1B19",
  fontFamily: "inherit",
};

const primaryButton:
  React.CSSProperties =
{
  border: "none",
  background: COLORS.navy,
  color: "#fff",
  padding: "10px 14px",
  fontWeight: 800,
  fontSize: 13,
  cursor: "pointer",
};

const deleteButton:
  React.CSSProperties =
{
  border:
    "1px solid #E8C8C2",
  background: "#fff",
  color: "#B23B2E",
  padding: "9px 13px",
  fontWeight: 800,
  fontSize: 12.5,
  cursor: "pointer",
};
