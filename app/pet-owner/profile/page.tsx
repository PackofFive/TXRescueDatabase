"use client";

import {
  useEffect,
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

export default function PetOwnerProfilePage() {
  const [email, setEmail] =
    useState("");

  const [form, setForm] =
    useState({
      displayName: "",
      phone: "",
      city: "",
      state: "TX",
      postalCode: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pet-owner/profile", {
      cache: "no-store",
    })
      .then(async (res) => {
        const data = await res.json();

        if (res.status === 401) {
          window.location.href =
            "/login?portal=pet-owner";
          return;
        }

        if (!res.ok) {
          throw new Error(
            data.error ??
              "Couldn't load profile."
          );
        }

        const profile = data.profile;

        setEmail(data.email ?? "");

        setForm({
          displayName:
            profile.display_name ?? "",
          phone:
            profile.phone ?? "",
          city:
            profile.city ?? "",
          state:
            profile.state ?? "TX",
          postalCode:
            profile.postal_code ?? "",
        });
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load profile."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
    event: React.FormEvent
  ) {
    event.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        "/api/pet-owner/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't update profile."
        );
      }

      const profile = data.profile;

      setForm({
        displayName:
          profile.display_name ?? "",
        phone:
          profile.phone ?? "",
        city:
          profile.city ?? "",
        state:
          profile.state ?? "TX",
        postalCode:
          profile.postal_code ?? "",
      });

      setSuccess("Profile saved.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PageShell>
        <p style={{ color: COLORS.muted }}>
          Loading…
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <a
        href="/pet-owner"
        style={backLinkStyle}
      >
        ← Back to Pet Owner Portal
      </a>

      <p style={eyebrowStyle}>
        Pet Owner Portal
      </p>

      <h1 style={headingStyle}>
        Profile &amp; Settings
      </h1>

      <p style={introStyle}>
        Manage the contact and location
        information associated with your
        Pet Owner profile.
      </p>

      <form
        onSubmit={save}
        style={panelStyle}
      >
        <Field
          label="Display Name"
          value={form.displayName}
          onChange={(value) =>
            update("displayName", value)
          }
        />

        <label style={labelStyle}>
          Account Email
          <input
            value={email}
            disabled
            style={{
              ...inputStyle,
              background: "#F4F6F8",
              color: COLORS.muted,
            }}
          />
          <span style={helpStyle}>
            Email changes are not available
            from this page yet.
          </span>
        </label>

        <Field
          label="Phone"
          value={form.phone}
          onChange={(value) =>
            update("phone", value)
          }
          type="tel"
        />

        <div style={locationGrid}>
          <Field
            label="City"
            value={form.city}
            onChange={(value) =>
              update("city", value)
            }
          />

          <Field
            label="State"
            value={form.state}
            onChange={(value) =>
              update(
                "state",
                value
                  .toUpperCase()
                  .slice(0, 2)
              )
            }
            maxLength={2}
          />

          <Field
            label="ZIP Code"
            value={form.postalCode}
            onChange={(value) =>
              update("postalCode", value)
            }
            inputMode="numeric"
          />
        </div>

        <div style={buttonRow}>
          <button
            type="submit"
            disabled={saving}
            style={{
              ...primaryButton,
              opacity: saving ? 0.65 : 1,
            }}
          >
            {saving
              ? "Saving…"
              : "Save Profile"}
          </button>
        </div>

        {success && (
          <p style={successStyle}>
            {success}
          </p>
        )}

        {error && (
          <p
            role="alert"
            style={errorStyle}
          >
            {error}
          </p>
        )}
      </form>
    </PageShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  maxLength,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  maxLength?: number;
  inputMode?:
    | "text"
    | "numeric"
    | "tel"
    | "email"
    | "url";
}) {
  return (
    <label style={labelStyle}>
      {label}
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        inputMode={inputMode}
        onChange={(event) =>
          onChange(event.target.value)
        }
        style={inputStyle}
      />
    </label>
  );
}

function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: COLORS.page,
        padding: "28px 18px 44px",
        boxSizing: "border-box",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        {children}
      </section>
    </main>
  );
}

const backLinkStyle:
  React.CSSProperties = {
  display: "inline-block",
  marginBottom: 20,
  color: COLORS.muted,
  textDecoration: "none",
  fontSize: 12.5,
  fontWeight: 700,
};

const eyebrowStyle:
  React.CSSProperties = {
  margin: "0 0 6px",
  color: COLORS.coral,
  fontSize: 11.5,
  fontWeight: 800,
  letterSpacing: ".1em",
  textTransform: "uppercase",
};

const headingStyle:
  React.CSSProperties = {
  margin: 0,
  color: COLORS.navy,
  fontSize: 30,
  lineHeight: 1.1,
};

const introStyle:
  React.CSSProperties = {
  margin: "9px 0 0",
  color: COLORS.muted,
  fontSize: 13.5,
  lineHeight: 1.55,
};

const panelStyle:
  React.CSSProperties = {
  marginTop: 20,
  background: COLORS.white,
  border: `1px solid ${COLORS.border}`,
  padding: 18,
  display: "grid",
  gap: 15,
};

const locationGrid:
  React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "minmax(180px, 1fr) 90px minmax(120px, .6fr)",
  gap: 10,
};

const labelStyle:
  React.CSSProperties = {
  display: "grid",
  gap: 6,
  color: COLORS.navy,
  fontSize: 12.5,
  fontWeight: 700,
};

const inputStyle:
  React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: `1px solid ${COLORS.border}`,
  padding: "9px 10px",
  background: COLORS.white,
  color: "#1C1B19",
  fontFamily: "inherit",
};

const helpStyle:
  React.CSSProperties = {
  color: COLORS.muted,
  fontSize: 10.5,
  fontWeight: 400,
};

const buttonRow:
  React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const primaryButton:
  React.CSSProperties = {
  border: "none",
  background: COLORS.navy,
  color: "#fff",
  padding: "10px 14px",
  fontWeight: 800,
  fontSize: 13,
  cursor: "pointer",
};

const successStyle:
  React.CSSProperties = {
  margin: 0,
  color: "#2E6B57",
  fontSize: 12.5,
  fontWeight: 700,
};

const errorStyle:
  React.CSSProperties = {
  margin: 0,
  color: "#B23B2E",
  fontSize: 12.5,
};
