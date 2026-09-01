"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

export const runtime =
  "edge";

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  pink: "#F2D6DC",
  peach: "#FBE3DA",
  mint: "#DCF0E8",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
  page: "#FFFDFC",
};

type RequestedPortal =
  | "admin"
  | "organization"
  | "pet-owner"
  | "foster";

type AuthUser = {
  id?: string;
  email?: string;
  role?: string;
  status?: string;
  orgId?: string | null;
  fosterId?: string | null;
  petOwnerId?: string | null;
  availablePortals?: string[];
};

type PortalConfig = {
  title: string;
  description: string;
  accent: string;
  accountNote: string;
};

const PORTALS:
  Record<
    RequestedPortal,
    PortalConfig
  > = {
    admin: {
      title:
        "Pack of Five Administration",
      description:
        "Sign in to manage organizations, requests, claims, and platform operations.",
      accent:
        COLORS.navy,
      accountNote:
        "Approved Pack of Five administrators only.",
    },

    organization: {
      title:
        "Rescue & Shelter Manager",
      description:
        "Sign in to your organization's private Pack of Five workspace.",
      accent:
        COLORS.pink,
      accountNote:
        "Approved rescue and shelter accounts only.",
    },

    "pet-owner": {
      title:
        "Pet Owner Portal",
      description:
        "Sign in with your Pack of Five account to access or create your Pet Owner profile.",
      accent:
        COLORS.peach,
      accountNote:
        "Pet Owner access can be added to an existing Pack of Five account.",
    },

    foster: {
      title:
        "Volunteer Portal",
      description:
        "Sign in to access approved foster relationships, animals, and foster tools.",
      accent:
        COLORS.mint,
      accountNote:
        "Approved foster relationships can use this portal.",
    },
  };

export default function LoginPage() {
  const searchParams =
    useSearchParams();

  const requestedPortal =
    useMemo(
      () =>
        normalizePortal(
          searchParams.get(
            "portal"
          )
        ),
      [searchParams]
    );

  const portal =
    PORTALS[
      requestedPortal
    ];

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState<
      string | null
    >(null);

  const [
    checking,
    setChecking,
  ] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

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
            data.user as
              | AuthUser
              | null;

          if (!user) {
            return;
          }

          routeSignedInUser(
            user,
            requestedPortal,
            setStatus
          );
        }
      )
      .finally(
        () =>
          setChecking(
            false
          )
      );
  }, [
    requestedPortal,
  ]);

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
        meData.user as
          | AuthUser
          | null;

      if (!user) {
        setStatus(
          "Signed in, but the account could not be loaded."
        );

        return;
      }

      routeSignedInUser(
        user,
        requestedPortal,
        setStatus
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
              20,
          }}
        >
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
                portal.accent,
              marginBottom:
                13,
            }}
          />

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
            {portal.title}
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
            {portal.description}
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
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            style={inputStyle}
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
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <div
            style={{
              marginTop: 9,
              textAlign: "right",
            }}
          >
            <a
              href="/forgot-password"
              style={{
                color: COLORS.navy,
                fontSize: 12.5,
                fontWeight: 750,
              }}
            >
              Forgot password?
            </a>
          </div>

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
            {portal.accountNote}
          </span>

          {requestedPortal ===
          "organization" ? (
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
          ) : null}
        </div>
      </section>
    </main>
  );
}

function normalizePortal(
  value:
    | string
    | null
): RequestedPortal {
  if (
    value ===
      "admin" ||
    value ===
      "pet-owner" ||
    value ===
      "foster" ||
    value ===
      "organization"
  ) {
    return value;
  }

  return "organization";
}

function routeSignedInUser(
  user: AuthUser,
  requestedPortal:
    RequestedPortal,
  setStatus: (
    value: string
  ) => void
) {
  const portals =
    Array.isArray(
      user.availablePortals
    )
      ? user.availablePortals
      : [];

  if (
    requestedPortal ===
    "admin"
  ) {
    if (
      portals.includes(
        "admin"
      ) &&
      user.status ===
        "approved"
    ) {
      window.location.href =
        "/admin";
      return;
    }

    setStatus(
      "This account does not have Pack of Five administrator access."
    );
    return;
  }

  if (
    requestedPortal ===
    "organization"
  ) {
    if (
      portals.includes(
        "organization"
      )
    ) {
      window.location.href =
        "/portal";
      return;
    }

    if (
      user.role ===
        "org" &&
      user.status ===
        "pending"
    ) {
      setStatus(
        "Your organization account is still pending approval."
      );
      return;
    }

    setStatus(
      "This account does not currently have access to Rescue & Shelter Manager."
    );
    return;
  }

  if (
    requestedPortal ===
    "foster"
  ) {
    if (
      portals.includes(
        "foster"
      )
    ) {
      window.location.href =
        "/foster";
      return;
    }

    setStatus(
        "This account does not currently have access to the Volunteer Portal."
    );
    return;
  }

  if (
    requestedPortal ===
    "pet-owner"
  ) {
    if (
      portals.includes(
        "pet-owner"
      )
    ) {
      window.location.href =
        "/pet-owner";
    } else {
      window.location.href =
        "/pet-owner/setup";
    }

    return;
  }

  setStatus(
    "This account does not have an available workspace."
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
