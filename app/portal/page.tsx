"use client";

import { useEffect, useState } from "react";

export const runtime = "edge";

export default function PortalPage() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAccess() {
      try {
        const authRes = await fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "same-origin",
        });
        const authData = await authRes.json();
        const user = authData.user;

        if (!user) {
          window.location.replace("/login");
          return;
        }

        if (user.role === "org" && user.status === "approved") {
          setAuthorized(true);
          return;
        }

        if (user.role === "admin" && user.status === "approved") {
          const testRes = await fetch("/api/admin/test-org", {
            cache: "no-store",
            credentials: "same-origin",
          });
          const testData = await testRes.json();

          if (testRes.ok && testData.organization) {
            setAuthorized(true);
            return;
          }

          setError(
            testData.error ??
              "No Rescue Manager test organization is selected. Choose one from Admin > Organizations."
          );
          return;
        }

        window.location.replace("/login");
      } catch (err) {
        console.error("Portal access check failed:", err);
        setError("Couldn't verify Rescue Manager access. Please try again.");
      } finally {
        setChecking(false);
      }
    }

    checkAccess();
  }, []);

  if (checking) return <p>Loading…</p>;

  if (error && !authorized) {
    return (
      <section style={{ maxWidth: 700 }}>
        <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".08em", color: "#6B6862", margin: 0 }}>
          RESCUE MANAGER
        </p>
        <h1 style={{ color: "#17233C", margin: "7px 0 10px" }}>
          Test organization not selected
        </h1>
        <p style={{ color: "#6B6862", lineHeight: 1.6 }}>{error}</p>
        <a
          href="/admin/orgs"
          style={{
            display: "inline-block",
            marginTop: 8,
            background: "#17233C",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 7,
            padding: "9px 14px",
            fontWeight: 700,
          }}
        >
          Choose Test Organization
        </a>
      </section>
    );
  }

  if (!authorized) return <p>Access unavailable.</p>;

  return (
    <section>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 800, letterSpacing: ".08em", color: "#6B6862" }}>
        OVERVIEW
      </p>
      <h1 style={{ fontSize: 30, margin: "6px 0 8px", color: "#17233C" }}>
        Rescue Manager
      </h1>
      <p style={{ margin: 0, color: "#6B6862", maxWidth: 720 }}>
        Your private Pack of Five workspace for rescue or shelter operations.
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
          title="Urgent Animals"
          text="Review urgent shelter animals available for rescue networking."
          href="/portal/urgent"
        />
        <DashboardCard
          title="Organization"
          text="Organization management tools will continue to be added here."
        />
        <DashboardCard
          title="Needs Attention"
          text="Future home for overdue care, incomplete records, and priority items."
        />
      </div>
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
      <h2 style={{ fontSize: 17, margin: "0 0 7px", color: "#17233C" }}>
        {title}
      </h2>
      <p style={{ margin: 0, color: "#6B6862", fontSize: 14, lineHeight: 1.5 }}>
        {text}
      </p>
    </>
  );

  return href ? <a href={href} style={style}>{content}</a> : <div style={style}>{content}</div>;
}
