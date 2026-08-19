"use client";

import { useEffect, useState } from "react";

// This is a functional login flow wired to the real API — it proves
// auth works end to end. The full capability-editing form from the
// prototype artifact (all 16 dropdowns, intake fields, "your pending
// submissions" list) should be ported in here once you've confirmed
// login works against your deployed database.
export default function PortalPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // On every visit to this page, check the real session cookie rather
  // than relying on local component state — state resets on navigation,
  // but the actual session doesn't. Without this, coming back to this
  // page after visiting another one always shows the login form again,
  // even though you're still genuinely signed in.
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
    setLoggedIn(true);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setLoggedIn(false);
  }

  if (checkingSession) {
    return <p>Loading…</p>;
  }

  if (loggedIn) {
    return (
      <div>
        <h1 style={{ fontSize: 20 }}>Org Portal</h1>
        <p>Signed in. Port the capability-editing form from the prototype artifact here, wired to POST /api/submissions.</p>
        <button onClick={handleLogout} style={{ marginTop: 12, padding: "8px 16px", background: "#fff", color: "#1C1B19", border: "1px solid #E7E5E1", borderRadius: 6 }}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 360 }}>
      <h1 style={{ fontSize: 20 }}>Org Portal — Sign in</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
            style={{ width: "100%", padding: 8, border: "1px solid #E7E5E1", borderRadius: 6 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required
            style={{ width: "100%", padding: 8, border: "1px solid #E7E5E1", borderRadius: 6 }} />
        </div>
        <button type="submit" style={{ padding: "8px 16px", background: "#1C1B19", color: "#fff", border: "none", borderRadius: 6 }}>
          Sign in
        </button>
        {status && <p style={{ color: "#B23B2E", fontSize: 13, marginTop: 10 }}>{status}</p>}
      </form>
      <p style={{ fontSize: 12, color: "#6B6862", marginTop: 16 }}>
        No account yet? Signup needs an orgId from your directory — wire up a signup form using POST /api/auth/signup once you've imported organizations.
      </p>
    </div>
  );
}
