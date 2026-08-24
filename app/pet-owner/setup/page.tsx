"use client";

import {
  useEffect,
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

export default function PetOwnerSetupPage() {
  const [
    checking,
    setChecking,
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
    form,
    setForm,
  ] =
    useState({
      displayName: "",
      phone: "",
      city: "",
      state: "TX",
      postalCode: "",
    });

  useEffect(() => {
    fetch(
      "/api/pet-owner/profile",
      {
        cache:
          "no-store",
      }
    )
      .then(async (res) => {
        const data =
          await res.json();

        if (
          res.status === 401
        ) {
          window.location.href =
            "/login?portal=pet-owner";
          return;
        }

        if (!res.ok) {
          throw new Error(
            data.error ??
              "Couldn't load Pet Owner profile."
          );
        }

        if (data.profile) {
          window.location.href =
            "/pet-owner";
        }
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load Pet Owner setup."
        );
      })
      .finally(() => {
        setChecking(false);
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
          "/api/pet-owner/profile",
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
          res.status === 401
        ) {
          window.location.href =
            "/login?portal=pet-owner";
          return;
        }

        throw new Error(
          data.error ??
            "Couldn't create Pet Owner profile."
        );
      }

      /*
        Force a full navigation so AppShell and /api/auth/me
        reload and immediately see the newly-added pet-owner
        portal membership.
      */
      window.location.href =
        "/pet-owner";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't create Pet Owner profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (checking) {
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
          href="/"
          style={backLinkStyle}
        >
          ← Back to Pack of Five
        </a>

        <span
          aria-hidden="true"
          style={{
            display:
              "block",
            width:
              42,
            height:
              7,
            background:
              COLORS.peach,
            marginBottom:
              13,
          }}
        />

        <p style={eyebrowStyle}>
          Pet Owner Portal
        </p>

        <h1
          style={{
            margin:
              "0 0 8px",
            color:
              COLORS.navy,
            fontSize:
              31,
            lineHeight:
              1.1,
          }}
        >
          Create your Pet Owner profile
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
            maxWidth:
              620,
          }}
        >
          Pet Owner is another portal
          on your existing Pack of Five
          account. Creating this profile
          will not remove or replace any
          Rescue Manager or Foster access.
        </p>

        <form
          onSubmit={submit}
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
              13,
          }}
        >
          <Field
            label="Display name"
            value={
              form.displayName
            }
            onChange={(v) =>
              update(
                "displayName",
                v
              )
            }
          />

          <div style={twoCol}>
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
                )
              }
              required
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
              ? "Creating…"
              : "Create Pet Owner Profile"}
          </button>

          {error && (
            <p
              role="alert"
              style={{
                margin: 0,
                color:
                  "#B23B2E",
                fontSize:
                  12.5,
                lineHeight:
                  1.5,
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
  required = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  required?: boolean;
}) {
  return (
    <label style={labelStyle}>
      {label}

      <input
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
    650,
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
  width:
    "fit-content",
};

const backLinkStyle:
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
