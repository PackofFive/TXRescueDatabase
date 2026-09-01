"use client";

import { useState } from "react";

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_reset", email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The request could not be completed.");
      setMessage(data.message);
      setEmail("");
    } catch (reason) {
      console.error("Password reset request response was interrupted:", reason);
      setMessage(
        "If that email belongs to a Pack of Five account, a secure reset link has been sent."
      );
      setEmail("");
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
        <h1 style={headingStyle}>Reset your password</h1>
        <p style={bodyStyle}>
          Enter the email used for your Pack of Five account. If it matches an
          account, we’ll send a secure one-time link that expires after one hour.
        </p>

        <form onSubmit={submit} style={formStyle}>
          <label htmlFor="email" style={labelStyle}>Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={inputStyle}
          />
          <button type="submit" disabled={submitting} style={buttonStyle}>
            {submitting ? "Sending…" : "Send Secure Reset Link"}
          </button>
        </form>

        {message ? <div role="status" style={successStyle}>{message}</div> : null}
        {error ? <div role="alert" style={errorStyle}>{error}</div> : null}

        <p style={securityNoteStyle}>
          For your protection, this page does not confirm whether an email has
          an account. Never share a password-reset link with anyone.
        </p>
      </section>
    </main>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", display: "grid", placeItems: "center", padding: "28px 18px", boxSizing: "border-box", background: COLORS.page };
const containerStyle: React.CSSProperties = { width: "100%", maxWidth: 460 };
const backLinkStyle: React.CSSProperties = { display: "inline-block", marginBottom: 24, color: COLORS.muted, textDecoration: "none", fontSize: 13, fontWeight: 700 };
const accentStyle: React.CSSProperties = { width: 48, height: 8, marginBottom: 14, background: COLORS.pink };
const eyebrowStyle: React.CSSProperties = { margin: "0 0 8px", color: COLORS.coral, fontSize: 12, fontWeight: 800, letterSpacing: ".1em" };
const headingStyle: React.CSSProperties = { margin: "0 0 12px", color: COLORS.navy, fontSize: 34, lineHeight: 1.1 };
const bodyStyle: React.CSSProperties = { margin: 0, color: COLORS.muted, fontSize: 14, lineHeight: 1.6 };
const formStyle: React.CSSProperties = { display: "grid", gap: 10, marginTop: 22, padding: 20, border: `1px solid ${COLORS.border}`, background: COLORS.white };
const labelStyle: React.CSSProperties = { color: COLORS.navy, fontSize: 13, fontWeight: 800 };
const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "11px 12px", border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.navy, font: "inherit" };
const buttonStyle: React.CSSProperties = { marginTop: 5, padding: "11px 15px", border: 0, background: COLORS.navy, color: COLORS.white, fontWeight: 800, cursor: "pointer" };
const successStyle: React.CSSProperties = { marginTop: 16, padding: 15, border: `1px solid ${COLORS.border}`, background: COLORS.mint, color: COLORS.navy, fontSize: 13, lineHeight: 1.5, fontWeight: 700 };
const errorStyle: React.CSSProperties = { marginTop: 16, padding: 15, border: "1px solid #E9B9B4", background: "#FCE9E7", color: "#A9362B", fontSize: 13, lineHeight: 1.5 };
const securityNoteStyle: React.CSSProperties = { margin: "16px 0 0", padding: 14, background: COLORS.pink, color: COLORS.navy, fontSize: 12.5, lineHeight: 1.5 };
