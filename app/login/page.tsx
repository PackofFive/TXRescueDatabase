"use client";

import { useEffect, useState } from "react";

export const runtime = "edge";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        const user = data.user;
        if (!user) return;

        if (user.role === "admin") {
          window.location.href = "/admin";
          return;
        }

        if (user.role === "org" && user.status === "approved") {
          window.location.href = "/portal";
        }
      })
      .finally(() => setChecking(false));
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

    const me = await fetch("/api/auth/me");
    const meData = await me.json();
    const user = meData.user;

    if (!user) {
      setStatus("Signed in, but the account could not be loaded.");
      return;
    }

    if (user.role === "admin") {
      window.location.href = "/admin";
      return;
    }

    if (user.role === "org") {
      if (user.status === "approved") {
        window.location.href = "/portal";
      } else if (user.status === "pending") {
        setStatus("Your organization account is still pending approval.");
      } else {
        setStatus("This organization account is not approved.");
      }
      return;
    }

    setStatus("This account does not have an available workspace.");
  }

  if (checking) return <p>Loading…</p>;

  return (
    <section style={{ maxWidth: 920, margin: "34px auto" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: ".08em", color: "#6B6862" }}>
          PACK OF FIVE
        </p>
        <h1 style={{ fontSize: 32, margin: "7px 0 8px", color: "#17233C" }}>Sign In</h1>
        <p style={{ margin: 0, color: "#6B6862" }}>
          One Pack of Five account connects you to the correct private workspace.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, marginBottom: 24 }}>
        <RoleCard
          title="Rescue & Shelter Manager"
          text="For approved rescue and shelter organizations managing animals, urgent listings, fosters, and organization records."
        />
        <RoleCard
          title="Pack of Five Admin"
          text="For authorized Pack of Five platform administrators reviewing claims, organizations, and system administration."
        />
      </div>

      <form
        onSubmit={handleLogin}
        style={{
          maxWidth: 430,
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #E7E5E1",
          borderRadius: 12,
          padding: 22,
        }}
      >
        <label htmlFor="email" style={labelStyle}>Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <label htmlFor="password" style={{ ...labelStyle, marginTop: 14 }}>Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          Sign In
        </button>

        {status && (
          <p role="alert" style={{ color: "#B23B2E", fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>
            {status}
          </p>
        )}
      </form>

      <p style={{ textAlign: "center", fontSize: 12, color: "#6B6862", marginTop: 16 }}>
        Forgot/reset password remains a required next account feature.
      </p>
    </section>
  );
}

function RoleCard({ title, text }: { title: string; text: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E7E5E1", borderRadius: 10, padding: 18 }}>
      <h2 style={{ fontSize: 17, color: "#17233C", margin: "0 0 7px" }}>{title}</h2>
      <p style={{ margin: 0, color: "#6B6862", lineHeight: 1.5, fontSize: 14 }}>{text}</p>
    </div>
  );
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
