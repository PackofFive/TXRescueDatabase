"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const COLORS = { navy: "#1E3A5F", coral: "#E85C56", mint: "#DCF0E8", muted: "#4A5D75", border: "#DCE4EC", white: "#FFFFFF" };

export default function AcceptOrganizationInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [signedIn, setSignedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<"signin" | "create">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setSignedIn(Boolean(data.user)))
      .finally(() => setChecking(false));
  }, []);

  async function acceptInvite(createPassword?: string) {
    const response = await fetch("/api/org-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: createPassword }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Couldn't accept the invitation.");
    return data.result ?? {};
  }

  async function acceptWhileSignedIn() {
    setWorking(true);
    setError("");
    try {
      await acceptInvite();
      setSuccess("Invitation accepted. Your organization workspace is ready.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn't accept the invitation.");
    } finally {
      setWorking(false);
    }
  }

  async function signInAndAccept(event: React.FormEvent) {
    event.preventDefault();
    setWorking(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Couldn't sign in.");
      setSignedIn(true);
      await acceptInvite();
      setSuccess("Invitation accepted. Your organization workspace is ready.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn't accept the invitation.");
    } finally {
      setWorking(false);
    }
  }

  async function createAndAccept(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setWorking(true);
    setError("");
    try {
      const result = await acceptInvite(password);
      setAccountCreated(Boolean(result.accountCreated));
      setSuccess("Your Pack of Five account was created and the invitation was accepted.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Couldn't create the account.");
    } finally {
      setWorking(false);
    }
  }

  if (checking) return <main style={pageStyle}><p style={{ color: COLORS.muted }}>Checking your invitation…</p></main>;

  if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
    return <main style={pageStyle}><section style={cardStyle}><p style={eyebrowStyle}>TEAM INVITATION</p><h1 style={headingStyle}>Invalid invitation link</h1><p style={bodyStyle}>Ask the Organization Owner to send a new secure invitation.</p></section></main>;
  }

  if (success) {
    return <main style={pageStyle}><section style={cardStyle}><p style={eyebrowStyle}>TEAM INVITATION</p><h1 style={headingStyle}>Welcome to the team</h1><div style={successStyle}>{success}</div><p style={bodyStyle}>{accountCreated ? "Sign in with your new account to open Rescue Manager." : "You can now open Rescue Manager."}</p><a href={accountCreated ? "/login?portal=organization" : "/portal"} style={primaryLinkStyle}>{accountCreated ? "Sign In" : "Open Rescue Manager"}</a></section></main>;
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>SECURE TEAM INVITATION</p>
        <h1 style={headingStyle}>Join a rescue organization</h1>
        <p style={bodyStyle}>Use the same email address that received this invitation. The link is one-time and expires after 72 hours.</p>

        {error ? <div style={errorStyle}>{error}</div> : null}

        {signedIn ? (
          <div style={panelStyle}><h2 style={sectionHeadingStyle}>You are signed in</h2><p style={bodyStyle}>Accepting will add this organization to your Rescue Manager access at the level chosen by the Organization Owner.</p><button type="button" disabled={working} onClick={acceptWhileSignedIn} style={buttonStyle}>{working ? "Accepting…" : "Accept Team Invitation"}</button></div>
        ) : (
          <>
            <div style={tabRowStyle}><button type="button" onClick={() => { setMode("signin"); setError(""); }} style={mode === "signin" ? activeTabStyle : tabStyle}>I Have an Account</button><button type="button" onClick={() => { setMode("create"); setError(""); }} style={mode === "create" ? activeTabStyle : tabStyle}>Create an Account</button></div>
            {mode === "signin" ? (
              <form onSubmit={signInAndAccept} style={formStyle}><label style={labelStyle}>Email address<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} style={inputStyle} /></label><label style={labelStyle}>Password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} /></label><button type="submit" disabled={working} style={buttonStyle}>{working ? "Signing in…" : "Sign In & Accept"}</button></form>
            ) : (
              <form onSubmit={createAndAccept} style={formStyle}><p style={securityNoteStyle}>Your email is verified by this private invitation. Create a strong password with at least 12 characters, including uppercase, lowercase, and a number.</p><label style={labelStyle}>Create password<input type="password" required minLength={12} value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} /></label><label style={labelStyle}>Confirm password<input type="password" required minLength={12} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} style={inputStyle} /></label><button type="submit" disabled={working} style={buttonStyle}>{working ? "Creating account…" : "Create Account & Accept"}</button></form>
            )}
          </>
        )}
      </section>
    </main>
  );
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", display: "grid", placeItems: "start center", padding: "36px 18px", boxSizing: "border-box", background: "#FFFDFC" };
const cardStyle: React.CSSProperties = { width: "100%", maxWidth: 620, padding: 24, boxSizing: "border-box", border: `1px solid ${COLORS.border}`, background: COLORS.white };
const eyebrowStyle: React.CSSProperties = { margin: "0 0 8px", color: COLORS.coral, fontSize: 12, fontWeight: 800, letterSpacing: ".1em" };
const headingStyle: React.CSSProperties = { margin: "0 0 10px", color: COLORS.navy, fontSize: 32, lineHeight: 1.1 };
const sectionHeadingStyle: React.CSSProperties = { margin: "0 0 8px", color: COLORS.navy, fontSize: 19 };
const bodyStyle: React.CSSProperties = { color: COLORS.muted, fontSize: 14, lineHeight: 1.6 };
const errorStyle: React.CSSProperties = { marginTop: 15, padding: 13, color: "#A9362B", border: "1px solid #E9B9B4", background: "#FCE9E7" };
const successStyle: React.CSSProperties = { marginTop: 15, padding: 13, color: COLORS.navy, border: `1px solid ${COLORS.border}`, background: COLORS.mint, fontWeight: 700 };
const panelStyle: React.CSSProperties = { marginTop: 20, padding: 18, background: COLORS.mint, border: `1px solid ${COLORS.border}` };
const tabRowStyle: React.CSSProperties = { display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" };
const tabStyle: React.CSSProperties = { padding: "10px 13px", border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.navy, fontWeight: 800, cursor: "pointer" };
const activeTabStyle: React.CSSProperties = { ...tabStyle, background: COLORS.navy, color: COLORS.white };
const formStyle: React.CSSProperties = { display: "grid", gap: 14, marginTop: 18 };
const labelStyle: React.CSSProperties = { display: "grid", gap: 6, color: COLORS.navy, fontSize: 13, fontWeight: 800 };
const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "11px 12px", border: `1px solid ${COLORS.border}`, color: COLORS.navy, background: COLORS.white, font: "inherit" };
const buttonStyle: React.CSSProperties = { justifySelf: "start", padding: "11px 15px", border: 0, background: COLORS.navy, color: COLORS.white, fontWeight: 800, cursor: "pointer" };
const primaryLinkStyle: React.CSSProperties = { display: "inline-block", padding: "11px 15px", background: COLORS.navy, color: COLORS.white, textDecoration: "none", fontWeight: 800 };
const securityNoteStyle: React.CSSProperties = { margin: 0, padding: 13, background: COLORS.mint, color: COLORS.navy, fontSize: 12.5, lineHeight: 1.5 };
