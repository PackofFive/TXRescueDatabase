"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

type Invitation = {
  organizationName: string;
  invitedEmail: string;
  invitedName: string | null;
  fullName: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  expiresAt: string;
};

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
  page: "#FFFDFC",
};

export default function FosterAcceptPage() {
  const searchParams =
    useSearchParams();

  const token =
    searchParams.get(
      "token"
    ) ?? "";

  const [
    invitation,
    setInvitation,
  ] =
    useState<
      Invitation | null
    >(null);

  const [
    fullName,
    setFullName,
  ] =
    useState("");

  const [
    phone,
    setPhone,
  ] =
    useState("");

  const [
    city,
    setCity,
  ] =
    useState("");

  const [
    state,
    setState,
  ] =
    useState("TX");

  const [
    availabilityStatus,
    setAvailabilityStatus,
  ] =
    useState("available");

  const [
    transportAvailable,
    setTransportAvailable,
  ] =
    useState(false);

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
    accepted,
    setAccepted,
  ] =
    useState(false);

  useEffect(() => {
    if (!token) {
      setError(
        "This foster invitation link is missing its token."
      );

      setLoading(false);

      return;
    }

    fetch(
      `/api/fosters/accept?token=${encodeURIComponent(
        token
      )}`,
      {
        cache:
          "no-store",
      }
    )
      .then(
        async (res) => {
          const data =
            await res.json();

          if (!res.ok) {
            throw new Error(
              data.error ??
                "Couldn't load invitation."
            );
          }

          return data;
        }
      )
      .then(
        (data) => {
          const invite =
            data.invitation as Invitation;

          setInvitation(
            invite
          );

          setFullName(
            invite.fullName ??
              invite.invitedName ??
              ""
          );

          setPhone(
            invite.phone ??
              ""
          );

          setCity(
            invite.city ??
              ""
          );

          setState(
            invite.state ??
              "TX"
          );
        }
      )
      .catch(
        (err) =>
          setError(
            err instanceof Error
              ? err.message
              : "Couldn't load invitation."
          )
      )
      .finally(
        () =>
          setLoading(
            false
          )
      );
  }, [token]);

  async function acceptInvite(
    e:
      React.FormEvent
  ) {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      const res =
        await fetch(
          "/api/fosters/accept",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                token,
                fullName,
                phone,
                city,
                state,
                availabilityStatus,
                transportAvailable,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't accept invitation."
        );
      }

      setAccepted(
        true
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't accept invitation."
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  if (loading) {
    return (
      <PageShell>
        <p
          style={{
            color:
              COLORS.muted,
          }}
        >
          Loading invitation…
        </p>
      </PageShell>
    );
  }

  if (accepted) {
    return (
      <PageShell>
        <p
          style={
            eyebrowStyle
          }
        >
          Foster Invitation
        </p>

        <h1
          style={
            headingStyle
          }
        >
          Invitation accepted
        </h1>

        <div
          style={{
            marginTop:
              18,
            padding:
              18,
            background:
              COLORS.mint,
          }}
        >
          <strong
            style={{
              color:
                COLORS.navy,
              display:
                "block",
              marginBottom:
                6,
            }}
          >
            Your foster profile has
            been sent to{" "}
            {
              invitation
                ?.organizationName
            }
            .
          </strong>

          <p
            style={{
              margin:
                0,
              color:
                COLORS.muted,
              fontSize:
                13.5,
              lineHeight:
                1.55,
            }}
          >
            The rescue or shelter
            can now review and
            approve the relationship.
            Foster Portal account
            access will be connected
            in a later step.
          </p>
        </div>

        <a
          href="/"
          style={{
            ...secondaryLink,
            marginTop:
              16,
          }}
        >
          Return to Pack of Five
        </a>
      </PageShell>
    );
  }

  if (
    error &&
    !invitation
  ) {
    return (
      <PageShell>
        <p
          style={
            eyebrowStyle
          }
        >
          Foster Invitation
        </p>

        <h1
          style={
            headingStyle
          }
        >
          Invitation unavailable
        </h1>

        <p
          style={{
            color:
              "#B23B2E",
            lineHeight:
              1.55,
            fontSize:
              13.5,
          }}
        >
          {error}
        </p>

        <a
          href="/"
          style={
            secondaryLink
          }
        >
          Back to Pack of Five
        </a>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <p
        style={
          eyebrowStyle
        }
      >
        Foster Invitation
      </p>

      <h1
        style={
          headingStyle
        }
      >
        Join{" "}
        {
          invitation
            ?.organizationName
        }{" "}
        as a foster
      </h1>

      <p
        style={{
          margin:
            "9px 0 18px",
          color:
            COLORS.muted,
          fontSize:
            13.5,
          lineHeight:
            1.55,
        }}
      >
        Confirm your basic foster
        information. Accepting this
        invitation creates a
        relationship for the rescue
        or shelter to review.
      </p>

      <form
        onSubmit={
          acceptInvite
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
            13,
        }}
      >
        <Field
          label="Email"
          value={
            invitation
              ?.invitedEmail ??
            ""
          }
          disabled
        />

        <Field
          label="Your name *"
          value={
            fullName
          }
          onChange={
            setFullName
          }
          required
        />

        <div
          style={
            twoCol
          }
        >
          <Field
            label="Phone"
            value={
              phone
            }
            onChange={
              setPhone
            }
          />

          <Field
            label="City"
            value={
              city
            }
            onChange={
              setCity
            }
          />

          <Field
            label="State"
            value={
              state
            }
            onChange={
              setState
            }
          />
        </div>

        <label
          style={
            labelStyle
          }
        >
          Availability

          <select
            value={
              availabilityStatus
            }
            onChange={(e) =>
              setAvailabilityStatus(
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

            <option value="full">
              At Capacity
            </option>

            <option value="unavailable">
              Unavailable
            </option>
          </select>
        </label>

        <label
          style={{
            display:
              "flex",
            gap:
              8,
            alignItems:
              "center",
            color:
              COLORS.navy,
            fontSize:
              12.5,
            fontWeight:
              700,
          }}
        >
          <input
            type="checkbox"
            checked={
              transportAvailable
            }
            onChange={(e) =>
              setTransportAvailable(
                e.target.checked
              )
            }
          />

          I may be available to help
          with animal transport
        </label>

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
          }}
        >
          {submitting
            ? "Accepting…"
            : "Accept Foster Invitation"}
        </button>

        {error && (
          <p
            role="alert"
            style={{
              color:
                "#B23B2E",
              margin:
                0,
              fontSize:
                12.5,
            }}
          >
            {error}
          </p>
        )}
      </form>
    </PageShell>
  );
}

function PageShell({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          COLORS.page,
        padding:
          "28px 18px",
        boxSizing:
          "border-box",
      }}
    >
      <section
        style={{
          width:
            "100%",
          maxWidth:
            620,
          margin:
            "0 auto",
        }}
      >
        <a
          href="/"
          style={{
            display:
              "inline-block",
            marginBottom:
              22,
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
          ← Back to Pack of Five
        </a>

        {children}
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (
    value: string
  ) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label
      style={
        labelStyle
      }
    >
      {label}

      <input
        value={
          value
        }
        required={
          required
        }
        disabled={
          disabled
        }
        onChange={(e) =>
          onChange?.(
            e.target.value
          )
        }
        style={{
          ...inputStyle,
          background:
            disabled
              ? "#F6F7F8"
              : "#fff",
          color:
            disabled
              ? COLORS.muted
              : "#1C1B19",
        }}
      />
    </label>
  );
}

const eyebrowStyle:
  React.CSSProperties =
{
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
  letterSpacing:
    "-.025em",
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

const twoCol:
  React.CSSProperties =
{
  display:
    "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(160px, 1fr))",
  gap:
    10,
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

const secondaryLink:
  React.CSSProperties =
{
  display:
    "inline-block",
  color:
    COLORS.navy,
  textDecoration:
    "none",
  fontSize:
    12.5,
  fontWeight:
    700,
};
