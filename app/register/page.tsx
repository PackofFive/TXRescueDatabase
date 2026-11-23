"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const COLORS = { navy: "#1E3A5F", coral: "#E85C56", peach: "#FBE3DA", mint: "#DCF0E8", muted: "#4A5D75", border: "#DCE4EC", white: "#FFFFFF", page: "#FFFDFC" };

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const petOwnerRegistration = searchParams.get("portal") === "pet-owner";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const checks = [
    { label: "12–128 characters", met: password.length >= 12 && password.length <= 128 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "Passwords match", met: password.length > 0 && password === confirmation },
  ];
  const ready = petOwnerRegistration && email.trim().length > 0 && checks.every((check) => check.met);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const timer = window.setInterval(() => setResendSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await requestVerification();
  }

  async function requestVerification() {
    if (!ready) return;
    setSubmitting(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accountType: "pet_owner", email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The verification email could not be sent.");
      setMessage(data.message); setSent(true); setResendSeconds(60);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "The verification email could not be sent."); }
    finally { setSubmitting(false); }
  }

  if (!petOwnerRegistration) return <main style={pageStyle}><section style={containerStyle}><h1 style={headingStyle}>Choose how you use Pack of Five</h1><p style={bodyStyle}>Pet owners may create a personal login. Rescue and shelter access begins by claiming or requesting an organization.</p><div style={actionRowStyle}><a href="/register?portal=pet-owner" style={primaryLinkStyle}>Create Pet Owner Account</a><a href="/organizations" style={secondaryLinkStyle}>Find an Organization</a></div></section></main>;

  return <main style={pageStyle}><section style={containerStyle}><a href="/login?portal=pet-owner" style={backLinkStyle}>← Back to Pet Owner Sign In</a><div style={accentStyle} /><p style={eyebrowStyle}>PET OWNER ACCOUNT</p><h1 style={headingStyle}>Create your Pack of Five login</h1><p style={bodyStyle}>This creates personal Pet Owner access only. It does not grant rescue, shelter, volunteer, or administrative access.</p>
    {!sent ? <form onSubmit={submit} style={formStyle}><label style={labelStyle}>Email address<input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} style={inputStyle} /></label><label style={labelStyle}>Password<input type={showPasswords ? "text" : "password"} required autoComplete="new-password" minLength={12} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} /></label><label style={labelStyle}>Confirm password<input type={showPasswords ? "text" : "password"} required autoComplete="new-password" minLength={12} maxLength={128} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} style={inputStyle} /></label><label style={showStyle}><input type="checkbox" checked={showPasswords} onChange={(event) => setShowPasswords(event.target.checked)} />Show passwords</label><div style={checklistStyle} aria-live="polite"><strong>Password requirements</strong>{checks.map((check) => <span key={check.label} style={check.met ? metStyle : checkStyle}><span aria-hidden="true">{check.met ? "✓" : "○"}</span>{check.label}</span>)}</div><button type="submit" disabled={submitting || !ready} style={submitting || !ready ? disabledButtonStyle : buttonStyle}>{submitting ? "Sending Verification…" : "Email My Verification Link"}</button><a href="/login?portal=pet-owner" style={existingAccountLinkStyle}>Already have a Pack of Five account? Sign in</a></form> : <div role="status" style={successStyle}><strong>Check your email</strong><span>{message}</span><span>No account is created until you use the verification link.</span><div style={confirmationActionsStyle}><button type="button" disabled={submitting || resendSeconds > 0} onClick={requestVerification} style={submitting || resendSeconds > 0 ? disabledSecondaryButtonStyle : secondaryButtonStyle}>{submitting ? "Sending…" : resendSeconds > 0 ? `Resend available in ${resendSeconds}s` : "Resend verification email"}</button><button type="button" onClick={() => { setSent(false); setMessage(""); setError(""); setEmail(""); setPassword(""); setConfirmation(""); setResendSeconds(0); }} style={secondaryButtonStyle}>Use a different email</button><a href="/login?portal=pet-owner" style={existingAccountLinkStyle}>Already verified? Sign in</a></div></div>}
    {error ? <div role="alert" style={errorStyle}>{error}{error.includes("already uses") ? <a href="/login?portal=pet-owner" style={errorLinkStyle}>Sign In</a> : null}</div> : null}</section></main>;
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", display: "grid", placeItems: "center", padding: "28px 18px", boxSizing: "border-box", background: COLORS.page };
const containerStyle: React.CSSProperties = { width: "100%", maxWidth: 500 };
const backLinkStyle: React.CSSProperties = { display: "inline-block", marginBottom: 24, color: COLORS.muted, textDecoration: "none", fontSize: 13, fontWeight: 700 };
const accentStyle: React.CSSProperties = { width: 48, height: 8, marginBottom: 14, background: COLORS.peach };
const eyebrowStyle: React.CSSProperties = { margin: "0 0 8px", color: COLORS.coral, fontSize: 12, fontWeight: 800, letterSpacing: ".1em" };
const headingStyle: React.CSSProperties = { margin: "0 0 12px", color: COLORS.navy, fontSize: 34, lineHeight: 1.1 };
const bodyStyle: React.CSSProperties = { color: COLORS.muted, fontSize: 14, lineHeight: 1.6 };
const formStyle: React.CSSProperties = { display: "grid", gap: 13, marginTop: 22, padding: 20, border: `1px solid ${COLORS.border}`, background: COLORS.white };
const labelStyle: React.CSSProperties = { display: "grid", gap: 6, color: COLORS.navy, fontSize: 13, fontWeight: 800 };
const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "11px 12px", border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.navy, font: "inherit" };
const showStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, color: COLORS.navy, fontSize: 12.5, fontWeight: 700 };
const checklistStyle: React.CSSProperties = { display: "grid", gap: 6, padding: 13, background: COLORS.peach, color: COLORS.navy, fontSize: 12.5 };
const checkStyle: React.CSSProperties = { display: "flex", gap: 7, color: COLORS.muted };
const metStyle: React.CSSProperties = { ...checkStyle, color: COLORS.navy, fontWeight: 700 };
const buttonStyle: React.CSSProperties = { padding: "11px 15px", border: 0, background: COLORS.navy, color: COLORS.white, fontWeight: 800, cursor: "pointer" };
const disabledButtonStyle: React.CSSProperties = { ...buttonStyle, opacity: 0.5, cursor: "not-allowed" };
const successStyle: React.CSSProperties = { display: "grid", gap: 10, marginTop: 18, padding: 16, border: `1px solid ${COLORS.border}`, background: COLORS.mint, color: COLORS.navy, fontSize: 13, lineHeight: 1.5 };
const secondaryButtonStyle: React.CSSProperties = { justifySelf: "start", padding: "9px 12px", border: `1px solid ${COLORS.navy}`, background: COLORS.white, color: COLORS.navy, fontWeight: 800, cursor: "pointer" };
const disabledSecondaryButtonStyle: React.CSSProperties = { ...secondaryButtonStyle, opacity: 0.5, cursor: "not-allowed" };
const confirmationActionsStyle: React.CSSProperties = { display: "flex", gap: 9, flexWrap: "wrap" };
const errorStyle: React.CSSProperties = { display: "grid", gap: 10, marginTop: 16, padding: 15, border: "1px solid #E9B9B4", background: "#FCE9E7", color: "#A9362B", fontSize: 13 };
const errorLinkStyle: React.CSSProperties = { justifySelf: "start", color: COLORS.navy, fontWeight: 800 };
const actionRowStyle: React.CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 };
const primaryLinkStyle: React.CSSProperties = { padding: "10px 14px", background: COLORS.navy, color: COLORS.white, textDecoration: "none", fontWeight: 800 };
const secondaryLinkStyle: React.CSSProperties = { padding: "10px 14px", border: `1px solid ${COLORS.navy}`, color: COLORS.navy, textDecoration: "none", fontWeight: 800 };
const existingAccountLinkStyle: React.CSSProperties = { alignSelf: "center", color: COLORS.navy, fontSize: 12.5, fontWeight: 800 };
