"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  pink: "#F2D6DC",
  mint: "#DCF0E8",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
  page: "#FFFDFC",
};

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token")?.trim() ?? "", [searchParams]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmation) {
      setError("The two passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_password", token, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The password could not be reset.");
      setMessage(data.message);
      setComplete(true);
      setNewPassword("");
      setConfirmation("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The password could not be reset.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={pageStyle}>
      <section style={containerStyle}>
        <a href="/login" style={backLinkStyle}>← Back to Sign In</a>
        <div style={accentStyle} />
        <p style={eyebrowStyle}>ACCOUNT SECURITY</p>
        <h1 style={headingStyle}>Choose a new password</h1>
        <p style={bodyStyle}>
          A successful reset signs out older sessions so the account can be
          accessed only by signing in again with the new password.
        </p>

        {!token ? (
          <div role="alert" style={errorStyle}>
            This reset link is incomplete. Request a new secure link below.
          </div>
        ) : !complete ? (
          <form onSubmit={submit} style={formStyle}>
            <label htmlFor="new-password" style={labelStyle}>New password</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              maxLength={128}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              style={inputStyle}
            />
            <label htmlFor="confirm-password" style={{ ...labelStyle, marginTop: 5 }}>Confirm new password</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              maxLength={128}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              style={inputStyle}
            />
            <div style={requirementsStyle}>
              Use 12–128 characters with an uppercase letter, lowercase letter,
              and number. A unique password or password manager is recommended.
            </div>
            <button type="submit" disabled={submitting} style={buttonStyle}>
              {submitting ? "Securing Account…" : "Reset Password"}
            </button>
          </form>
        ) : null}

        {message ? (
          <div role="status" style={successStyle}>
            {message}
            <a href="/login" style={signInLinkStyle}>Continue to Sign In</a>
          </div>
        ) : null}
        {error ? <div role="alert" style={errorStyle}>{error}</div> : null}
        {!complete ? <a href="/forgot-password" style={requestLinkStyle}>Request a new reset link</a> : null}
      </section>
    </main>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", display: "grid", placeItems: "center", padding: "28px 18px", boxSizing: "border-box", background: COLORS.page };
const containerStyle: React.CSSProperties = { width: "100%", maxWidth: 480 };
const backLinkStyle: React.CSSProperties = { display: "inline-block", marginBottom: 24, color: COLORS.muted, textDecoration: "none", fontSize: 13, fontWeight: 700 };
const accentStyle: React.CSSProperties = { width: 48, height: 8, marginBottom: 14, background: COLORS.pink };
const eyebrowStyle: React.CSSProperties = { margin: "0 0 8px", color: COLORS.coral, fontSize: 12, fontWeight: 800, letterSpacing: ".1em" };
const headingStyle: React.CSSProperties = { margin: "0 0 12px", color: COLORS.navy, fontSize: 34, lineHeight: 1.1 };
const bodyStyle: React.CSSProperties = { margin: 0, color: COLORS.muted, fontSize: 14, lineHeight: 1.6 };
const formStyle: React.CSSProperties = { display: "grid", gap: 10, marginTop: 22, padding: 20, border: `1px solid ${COLORS.border}`, background: COLORS.white };
const labelStyle: React.CSSProperties = { color: COLORS.navy, fontSize: 13, fontWeight: 800 };
const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "11px 12px", border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.navy, font: "inherit" };
const requirementsStyle: React.CSSProperties = { padding: 13, background: COLORS.pink, color: COLORS.navy, fontSize: 12.5, lineHeight: 1.5 };
const buttonStyle: React.CSSProperties = { marginTop: 5, padding: "11px 15px", border: 0, background: COLORS.navy, color: COLORS.white, fontWeight: 800, cursor: "pointer" };
const successStyle: React.CSSProperties = { display: "grid", gap: 12, marginTop: 16, padding: 15, border: `1px solid ${COLORS.border}`, background: COLORS.mint, color: COLORS.navy, fontSize: 13, lineHeight: 1.5, fontWeight: 700 };
const errorStyle: React.CSSProperties = { marginTop: 16, padding: 15, border: "1px solid #E9B9B4", background: "#FCE9E7", color: "#A9362B", fontSize: 13, lineHeight: 1.5 };
const signInLinkStyle: React.CSSProperties = { justifySelf: "start", padding: "9px 12px", background: COLORS.navy, color: COLORS.white, textDecoration: "none", fontWeight: 800 };
const requestLinkStyle: React.CSSProperties = { display: "inline-block", marginTop: 16, color: COLORS.navy, fontSize: 13, fontWeight: 800 };
