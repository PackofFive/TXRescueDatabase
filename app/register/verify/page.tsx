"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const COLORS = { navy: "#1E3A5F", coral: "#E85C56", mint: "#DCF0E8", muted: "#4A5D75", border: "#DCE4EC", page: "#FFFDFC" };

export default function VerifyRegistrationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [state, setState] = useState<"idle" | "checking" | "ready" | "error">(token ? "idle" : "error");
  const [message, setMessage] = useState(token ? "Confirm that you want to create this personal Pet Owner account." : "This verification link is incomplete.");

  async function verifyEmail() {
    if (!token || state === "checking") return;
    setState("checking");
    setMessage("Verifying your email…");
    await fetch("/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accountType: "pet_owner", action: "verify", token }) })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "The verification link could not be used."); setMessage(data.message); setState("ready"); })
      .catch((reason) => { setMessage(reason instanceof Error ? reason.message : "The verification link could not be used."); setState("error"); });
  }

  return <main style={pageStyle}><section style={cardStyle}><p style={eyebrowStyle}>PET OWNER ACCOUNT</p><h1 style={headingStyle}>{state === "idle" ? "Verify your email" : state === "checking" ? "Verifying your email" : state === "ready" ? "Email verified" : "Verification unavailable"}</h1><div role={state === "error" ? "alert" : "status"} style={state === "error" ? errorStyle : successStyle}>{message}</div>{state === "idle" ? <button type="button" onClick={verifyEmail} style={verifyButtonStyle}>Verify My Email</button> : null}{state === "checking" ? <button type="button" disabled style={disabledVerifyButtonStyle}>Verifying…</button> : null}{state === "ready" ? <a href="/pet-owner/setup" style={primaryLinkStyle}>Create My Pet Owner Profile</a> : null}{state === "error" ? <a href="/register?portal=pet-owner" style={secondaryLinkStyle}>Request a New Verification Link</a> : null}</section></main>;
}

const pageStyle: React.CSSProperties = { minHeight: "100vh", display: "grid", placeItems: "center", padding: 20, background: COLORS.page };
const cardStyle: React.CSSProperties = { width: "100%", maxWidth: 520, boxSizing: "border-box", padding: 24, border: `1px solid ${COLORS.border}` };
const eyebrowStyle: React.CSSProperties = { color: COLORS.coral, fontSize: 12, fontWeight: 800, letterSpacing: ".1em" };
const headingStyle: React.CSSProperties = { color: COLORS.navy, fontSize: 32 };
const successStyle: React.CSSProperties = { marginBottom: 18, padding: 15, background: COLORS.mint, color: COLORS.navy, lineHeight: 1.5 };
const errorStyle: React.CSSProperties = { marginBottom: 18, padding: 15, background: "#FCE9E7", color: "#A9362B", lineHeight: 1.5 };
const primaryLinkStyle: React.CSSProperties = { display: "inline-block", padding: "10px 14px", background: COLORS.navy, color: "white", textDecoration: "none", fontWeight: 800 };
const secondaryLinkStyle: React.CSSProperties = { display: "inline-block", color: COLORS.navy, fontWeight: 800 };
const verifyButtonStyle: React.CSSProperties = { padding: "10px 14px", border: 0, background: COLORS.navy, color: "white", fontWeight: 800, cursor: "pointer" };
const disabledVerifyButtonStyle: React.CSSProperties = { ...verifyButtonStyle, opacity: 0.5, cursor: "not-allowed" };
