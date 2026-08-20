"use client";

import { useEffect, useState } from "react";

export const runtime = "edge";

export default function PortalPage() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        const user = data.user;

        if (!user) {
          window.location.href = "/login";
          return;
        }

        if (user.role === "admin") {
          window.location.href = "/admin";
          return;
        }

        if (user.role === "org" && user.status === "approved") {
          setAuthorized(true);
          return;
        }

        window.location.href = "/login";
      })
      .finally(() => setChecking(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (checking || !authorized) return <p>Loading…</p>;

  return (
    <section>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: ".08em", color: "#6B6862" }}>
        OVERVIEW
      </p>
      <h1 style={{ fontSize: 30, margin: "6px 0 8px", color: "#17233C" }}>Rescue Manager</h1>
      <p style={{ margin: 0, color: "#6B6862", maxWidth: 720 }}>
        Your private Pack of Five workspace for rescue or shelter operations.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, margin: "28px 0" }}>
        <DashboardCard title="Animals" text="View and manage animal records." href="/animals" />
        <DashboardCard title="Urgent Animals" text="Review urgent shelter animals available for rescue networking." href="/portal/urgent" />
        <DashboardCard title="Organization" text="Organization management tools will continue to be added here." />
        <DashboardCard title="Needs Attention" text="Future home for overdue care, incomplete records, and priority items." />
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
        Sign Out
      </button>
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
