"use client";

import {
  useEffect,
  useState,
} from "react";

export const runtime = "edge";

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  pink: "#F2D6DC",
  text: "#1E3A5F",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
  page: "#FFFDFC",
};

export default function LoginPage() {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState<
    string | null
  >(null);

  const [
    checking,
    setChecking,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  useEffect(() => {
    fetch(
      "/api/auth/me",
      {
        cache:
          "no-store",
      }
    )
      .then(
        (r) =>
          r.json()
      )
      .then(
        (data) => {
          const user =
            data.user;

          if (!user) {
            return;
          }

          if (
            user.role ===
            "admin"
          ) {
            window.location.href =
              "/admin";

            return;
          }

          if (
            user.role ===
              "org" &&
            user.status ===
              "approved"
          ) {
            window.location.href =
              "/portal";
          }
        }
      )
      .finally(
        () =>
          setChecking(
            false
          )
      );
  }, []);

  async function handleLogin(
    e:
      React.FormEvent
  ) {
    e.preventDefault();

    setStatus(null);
    setSubmitting(true);

    try {
      const res =
        await fetch(
          "/api/auth/login",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                email,
                password,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        setStatus(
          data.error ??
            "Login failed."
        );

        return;
      }

      const me =
        await fetch(
          "/api/auth/me",
          {
            cache:
              "no-store",
          }
        );

      const meData =
        await me.json();

      const user =
        meData.user;

      if (!user) {
        setStatus(
          "Signed in, but the account could not be loaded."
        );

        return;
      }

      /*
        Admin access is intentionally
        not promoted on this page.
        If an admin signs in here
        anyway, route them to admin.
      */
      if (
        user.role ===
        "admin"
      ) {
        window.location.href =
          "/admin";

        return;
      }

      if (
        user.role ===
        "org"
      ) {
        if (
          user.status ===
          "approved"
        ) {
          window.location.href =
            "/portal";

          return;
        }

        if (
          user.status ===
          "pending"
        ) {
          setStatus(
            "Your organization account is still pending approval."
          );

          return;
        }

        setStatus(
          "This organization account is not approved."
        );

        return;
      }

      setStatus(
        "This account does not have access to Rescue & Shelter Manager."
      );
    } catch {
      setStatus(
        "Couldn't sign in. Please try again."
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  if (checking) {
    return (
      <main
        style={{
          minHeight:
            "100vh",
          display:
            "grid",
          placeItems:
            "center",
          background:
            COLORS.page,
          color:
            COLORS.muted,
          fontSize:
            14,
        }}
      >
        Loading…
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          COLORS.page,
        display:
          "grid",
        placeItems:
          "center",
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
            430,
        }}
      >
        <a
          href="/"
          style={{
            display:
              "inline-block",
            color:
              COLORS.muted,
            textDecoration:
              "none",
            fontSize:
              12.5,
            fontWeight:
              650,
            marginBottom:
              24,
          }}
        >
          ← Back to Pack of Five
        </a>

        <div
          style={{
            marginBottom:
              22,
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
            Sign In
          </p>

          <h1
            style={{
              margin:
                0,
              color:
                COLORS.navy,
              fontSize:
                31,
              lineHeight:
                1.1,
              letterSpacing:
                "-.025em",
            }}
          >
            Rescue &amp; Shelter Manager
          </h1>

          <p
            style={{
              margin:
                "10px 0 0",
              color:
                COLORS.muted,
              fontSize:
                14,
              lineHeight:
                1.55,
            }}
          >
            Sign in to your
            organization&apos;s private
            Pack of Five workspace.
          </p>
        </div>

        <form
          onSubmit={
            handleLogin
          }
          style={{
            background:
              COLORS.white,
            border:
              `1px solid ${COLORS.border}`,
            padding:
              20,
          }}
        >
          <label
            htmlFor="email"
            style={
              labelStyle
            }
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={
              email
            }
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            style={
              inputStyle
            }
          />

          <label
            htmlFor="password"
            style={{
              ...labelStyle,
              marginTop:
                14,
            }}
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={
              password
            }
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            style={
              inputStyle
            }
          />

          <button
            type="submit"
            disabled={
              submitting
            }
            style={{
              width:
                "100%",
              marginTop:
                16,
              padding:
                "10px 16px",
              background:
                COLORS.navy,
              color:
                "#fff",
              border:
                "none",
              fontWeight:
                800,
              fontSize:
                14,
              cursor:
                submitting
                  ? "default"
                  : "pointer",
              opacity:
                submitting
                  ? 0.65
                  : 1,
            }}
          >
            {submitting
              ? "Signing In…"
              : "Sign In"}
          </button>

          {status && (
            <p
              role="alert"
              style={{
                color:
                  "#B23B2E",
                fontSize:
                  13,
                margin:
                  "12px 0 0",
                lineHeight:
                  1.5,
              }}
            >
              {status}
            </p>
          )}
        </form>

        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            gap:
              14,
            marginTop:
              14,
            flexWrap:
              "wrap",
          }}
        >
          <span
            style={{
              color:
                COLORS.muted,
              fontSize:
                11.5,
            }}
          >
            Approved rescue and
            shelter accounts only.
          </span>

          <a
            href="/claim"
            style={{
              color:
                COLORS.coral,
              textDecoration:
                "none",
              fontSize:
                11.5,
              fontWeight:
                700,
            }}
          >
            Claim an organization
          </a>
        </div>
      </section>
    </main>
  );
}

const labelStyle:
  React.CSSProperties =
{
  display:
    "block",
  fontSize:
    13,
  fontWeight:
    700,
  marginBottom:
    6,
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
    "10px 11px",
  border:
    `1px solid ${COLORS.border}`,
  borderRadius:
    6,
  fontSize:
    14,
  background:
    "#fff",
  color:
    "#1C1B19",
  fontFamily:
    "inherit",
};
