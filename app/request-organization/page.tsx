"use client";

import {
  useState,
} from "react";

export const runtime =
  "edge";

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
  page: "#FFFDFC",
  soft: "#FBEFF1",
};

export default function RequestOrganizationPage() {
  const [
    form,
    setForm,
  ] =
    useState({
      organizationName:
        "",
      organizationType:
        "",
      city:
        "",
      county:
        "",
      state:
        "TX",
      website:
        "",
      socialUrl:
        "",
      contactName:
        "",
      contactEmail:
        "",
      contactPhone:
        "",
      description:
        "",
      relationship:
        "representative",
    });

  const [
    status,
    setStatus,
  ] =
    useState<
      string | null
    >(null);

  const [
    submitted,
    setSubmitted,
  ] =
    useState(false);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  function update(
    field: string,
    value: string
  ) {
    setForm(
      (prev) => ({
        ...prev,
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

    setStatus(null);
    setSubmitting(true);

    try {
      const res =
        await fetch(
          "/api/org-requests",
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
        setStatus(
          data.error ??
            "Couldn't submit request."
        );

        return;
      }

      setSubmitted(
        true
      );
    } catch {
      setStatus(
        "Couldn't submit request. Please try again."
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  if (submitted) {
    return (
      <section
        style={{
          maxWidth:
            640,
          margin:
            "0 auto",
          padding:
            "18px 0 40px",
        }}
      >
        <p
          style={{
            margin:
              "0 0 7px",
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
          Public Access · Texas
        </p>

        <h1
          style={{
            margin:
              0,
            color:
              COLORS.navy,
            fontSize:
              30,
          }}
        >
          Request received
        </h1>

        <p
          style={{
            margin:
              "10px 0 18px",
            color:
              COLORS.muted,
            lineHeight:
              1.6,
            fontSize:
              14,
          }}
        >
          Pack of Five will review
          the organization before
          it is added to the public
          directory.
        </p>

        <a
          href="/organizations"
          style={
            primaryLink
          }
        >
          Return to Directory
        </a>
      </section>
    );
  }

  return (
    <section
      style={{
        maxWidth:
          860,
        margin:
          "0 auto",
        padding:
          "8px 0 44px",
      }}
    >
      <div
        style={{
          marginBottom:
            20,
          maxWidth:
            720,
        }}
      >
        <p
          style={{
            margin:
              "0 0 7px",
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
          Public Access · Texas
        </p>

        <h1
          style={{
            margin:
              0,
            color:
              COLORS.navy,
            fontSize:
              "clamp(28px, 4vw, 36px)",
            lineHeight:
              1.08,
            letterSpacing:
              "-.03em",
          }}
        >
          Request an Organization
        </h1>

        <p
          style={{
            margin:
              "10px 0 0",
            color:
              COLORS.muted,
            fontSize:
              14.5,
            lineHeight:
              1.6,
          }}
        >
          Rescue, shelter, or
          animal-welfare organization
          missing from the Texas
          directory? Send it to Pack
          of Five for review.
        </p>
      </div>

      <div
        style={{
          background:
            COLORS.soft,
          padding:
            "13px 15px",
          marginBottom:
            18,
          color:
            COLORS.muted,
          fontSize:
            12.5,
          lineHeight:
            1.5,
        }}
      >
        Requests are reviewed before
        publication. If you represent
        the organization, you can
        identify that below so the
        claim/verification process can
        be handled appropriately.
      </div>

      <form
        onSubmit={
          submit
        }
        style={{
          display:
            "grid",
          gap:
            14,
          background:
            COLORS.white,
          border:
            `1px solid ${COLORS.border}`,
          padding:
            18,
        }}
      >
        <Field
          label="Organization name *"
          value={
            form.organizationName
          }
          onChange={(v) =>
            update(
              "organizationName",
              v
            )
          }
          required
        />

        <Field
          label="Organization type"
          value={
            form.organizationType
          }
          onChange={(v) =>
            update(
              "organizationType",
              v
            )
          }
          placeholder="Rescue, municipal shelter, sanctuary..."
        />

        <div
          style={
            twoCol
          }
        >
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
            label="County"
            value={
              form.county
            }
            onChange={(v) =>
              update(
                "county",
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
              )
            }
          />
        </div>

        <Field
          label="Website"
          value={
            form.website
          }
          onChange={(v) =>
            update(
              "website",
              v
            )
          }
          type="url"
        />

        <Field
          label="Social media page"
          value={
            form.socialUrl
          }
          onChange={(v) =>
            update(
              "socialUrl",
              v
            )
          }
          type="url"
        />

        <div
          style={
            twoCol
          }
        >
          <Field
            label="Your name"
            value={
              form.contactName
            }
            onChange={(v) =>
              update(
                "contactName",
                v
              )
            }
          />

          <Field
            label="Your email *"
            value={
              form.contactEmail
            }
            onChange={(v) =>
              update(
                "contactEmail",
                v
              )
            }
            type="email"
            required
          />

          <Field
            label="Your phone"
            value={
              form.contactPhone
            }
            onChange={(v) =>
              update(
                "contactPhone",
                v
              )
            }
          />
        </div>

        <label
          style={
            labelStyle
          }
        >
          Your relationship to this
          organization *

          <select
            value={
              form.relationship
            }
            onChange={(e) =>
              update(
                "relationship",
                e.target.value
              )
            }
            style={
              inputStyle
            }
          >
            <option value="representative">
              I represent this organization
            </option>

            <option value="suggestion">
              I am suggesting this organization
            </option>
          </select>
        </label>

        <label
          style={
            labelStyle
          }
        >
          Additional information

          <textarea
            value={
              form.description
            }
            onChange={(e) =>
              update(
                "description",
                e.target.value
              )
            }
            rows={
              4
            }
            placeholder="Anything that may help verify or categorize this organization."
            style={
              inputStyle
            }
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
              submitting
            }
            style={{
              ...primaryButton,
              opacity:
                submitting
                  ? 0.65
                  : 1,
              cursor:
                submitting
                  ? "default"
                  : "pointer",
            }}
          >
            {submitting
              ? "Submitting…"
              : "Submit for Review"}
          </button>

          <a
            href="/organizations"
            style={{
              color:
                COLORS.muted,
              textDecoration:
                "none",
              fontSize:
                12.5,
              fontWeight:
                650,
            }}
          >
            Back to Directory
          </a>
        </div>

        {status && (
          <p
            role="alert"
            style={{
              color:
                "#B23B2E",
              fontSize:
                13,
              margin:
                0,
            }}
          >
            {status}
          </p>
        )}
      </form>
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

const labelStyle:
  React.CSSProperties =
{
  display:
    "grid",
  gap:
    6,
  fontSize:
    12.5,
  fontWeight:
    700,
  color:
    COLORS.navy,
};

const inputStyle:
  React.CSSProperties =
{
  width:
    "100%",
  boxSizing:
    "border-box",
  padding:
    9,
  border:
    `1px solid ${COLORS.border}`,
  borderRadius:
    6,
  background:
    "#fff",
  fontFamily:
    "inherit",
  color:
    "#1C1B19",
};

const twoCol:
  React.CSSProperties =
{
  display:
    "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(200px, 1fr))",
  gap:
    14,
};

const primaryButton:
  React.CSSProperties =
{
  border:
    "none",
  padding:
    "10px 14px",
  background:
    COLORS.navy,
  color:
    "#fff",
  fontWeight:
    800,
  fontSize:
    13,
  width:
    "fit-content",
};

const primaryLink:
  React.CSSProperties =
{
  display:
    "inline-block",
  padding:
    "10px 14px",
  background:
    COLORS.navy,
  color:
    "#fff",
  textDecoration:
    "none",
  fontSize:
    13,
  fontWeight:
    800,
};
