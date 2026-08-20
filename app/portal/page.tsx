"use client";

import { useEffect, useState } from "react";

export default function PortalPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setLoggedIn(!!data.user))
      .finally(() => setCheckingSession(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(data.error ?? "Login failed.");
      return;
    }

    window.location.href = "/portal";
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (checkingSession) return <p>Loading…</p>;

  if (loggedIn) {
    return (
      <section>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "#6B6862" }}>
          OVERVIEW
        </p>
        <h1 style={{ fontSize: 30, margin: "6px 0 8px", color: "#17233C" }}>
          Rescue Manager
        </h1>
        <p style={{ margin: 0, color: "#6B6862", maxWidth: 720 }}>
          Your private Pack of Five workspace for managing organization information and animal records.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            margin: "28px 0",
          }}
        >
          <DashboardCard title="Animals" text="View and manage animal records." href="/animals" />
          <DashboardCard
            title="Organization"
            text="Organization management tools will continue to be added here."
          />
          <DashboardCard
            title="Needs Attention"
            text="Future home for overdue care, incomplete records, and priority items."
          />
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "9px 15px",
            background: "#fff",
            color: "#1C1B19",
            border: "1px solid #D8D6D2",
            borderRadius: 7,
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </section>
    );
  }

  return (
    <section style={{ maxWidth: 420, margin: "44px auto" }}>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "#6B6862" }}>
        PACK OF FIVE
      </p>
      <h1 style={{ fontSize: 28, margin: "6px 0 8px", color: "#17233C" }}>
        Rescue Manager
      </h1>
      <p style={{ margin: "0 0 24px", color: "#6B6862" }}>
        Sign in to your private rescue or shelter workspace.
      </p>

      <form
        onSubmit={handleLogin}
        style={{
          background: "#fff",
          border: "1px solid #E7E5E1",
          borderRadius: 12,
          padding: 22,
        }}
      >
        <label htmlFor="email" style={labelStyle}>Email</label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
          required
          style={inputStyle}
        />

        <label htmlFor="password" style={{ ...labelStyle, marginTop: 14 }}>Password</label>
        <input
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
          required
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: 16,
            padding: "10px 16px",
            background: "#17233C",
            color: "#fff",
            border: "none",
            borderRadius: 7,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Sign in
        </button>

        {status && <p role="alert" style={{ color: "#B23B2E", fontSize: 13, marginTop: 12 }}>{status}</p>}
      </form>

      <p style={{ fontSize: 12, lineHeight: 1.5, color: "#6B6862", marginTop: 16 }}>
        Forgot/reset password is a required next account feature. It is not linked yet because the reset endpoint has not been implemented.
      </p>
    </section>
  );
}

function DashboardCard({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href?: string;
}) {
  const style = {
    display: "block",
    background: "#fff",
    border: "1px solid #E7E5E1",
    borderRadius: 10,
    padding: 18,
    textDecoration: "none",
  } as const;

  const content = (
    <>
      <h2 style={{ fontSize: 17, margin: "0 0 7px", color: "#17233C" }}>{title}</h2>
      <p style={{ margin: 0, color: "#6B6862", fontSize: 14, lineHeight: 1.5 }}>{text}</p>
    </>
  );

  return href ? <a href={href} style={style}>{content}</a> : <div style={style}>{content}</div>;
}

const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  marginBottom: 6,
} as const;

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 11px",
  border: "1px solid #D8D6D2",
  borderRadius: 7,
  fontSize: 14,
  background: "#fff",
} as const;
