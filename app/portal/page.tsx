"use client";

import { useEffect, useState } from "react";

export const runtime = "edge";

type AuthUser = {
  id: string;
  email: string;
  role: "org" | "admin";
  orgId: string | null;
  orgName: string | null;
  status: "pending" | "approved" | "rejected";
};

export default function PortalPage() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function checkAccess() {
      try {
        const authRes = await fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "same-origin",
        });

        const authData = await authRes.json();
        const currentUser = authData.user as AuthUser | null;

        if (!currentUser) {
          window.location.replace("/login");
          return;
        }

        setUser(currentUser);

        if (
          currentUser.role === "org" &&
          currentUser.status === "approved"
        ) {
          setAuthorized(true);
          return;
        }

        if (
          currentUser.role === "admin" &&
          currentUser.status === "approved"
        ) {
          const testRes = await fetch("/api/admin/test-org", {
            cache: "no-store",
            credentials: "same-origin",
          });

          const testData = await testRes.json();

          if (
            testRes.ok &&
            testData.organization
          ) {
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
        console.error(
          "Portal access check failed:",
          err
        );

        setError(
          "Couldn't verify Rescue Manager access. Please try again."
        );
      } finally {
        setChecking(false);
      }
    }

    checkAccess();
  }, []);

  if (checking) {
    return <p>Loading…</p>;
  }

  if (
    error &&
    !authorized
  ) {
    return (
      <section
        style={{
          maxWidth: 700,
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: ".08em",
            color: "#6B6862",
            margin: 0,
          }}
        >
          RESCUE MANAGER
        </p>

        <h1
          style={{
            color: "#17233C",
            margin: "7px 0 10px",
          }}
        >
          Test organization not selected
        </h1>

        <p
          style={{
            color: "#6B6862",
            lineHeight: 1.6,
          }}
        >
          {error}
        </p>

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

  if (!authorized) {
    return <p>Access unavailable.</p>;
  }

  const orgName =
    user?.orgName ??
    "Your Organization";

  const animalsTitle =
    `${orgName} Animals`;

  return (
    <section>
      <p
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: ".08em",
          color: "#6B6862",
        }}
      >
        OVERVIEW
      </p>

      <h1
        style={{
          fontSize: 30,
          margin: "6px 0 8px",
          color: "#17233C",
        }}
      >
        {orgName} Rescue Manager
      </h1>

      <p
        style={{
          margin: 0,
          color: "#6B6862",
          maxWidth: 720,
          lineHeight: 1.5,
        }}
      >
        Private workspace for managing animals, rescue operations,
        organization information, and priority items.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          margin: "28px 0",
        }}
      >
        <DashboardCard
          title={animalsTitle}
          text="Animals currently under your organization’s care or active responsibility."
          href="/animals"
        />

        <DashboardCard
          title="Urgent Shelter Animals"
          text="Review animals still in shelter custody that need rescue placement, foster support, medical help, transfer, or networking."
          href="/portal/urgent"
        />

        <DashboardCard
          title="Organization"
          text="Manage organization information, settings, capacity, and operational details."
        />

        <DashboardCard
          title="Needs Attention"
          text="Future home for overdue care, incomplete records, reminders, and priority items."
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
      <h2
        style={{
          fontSize: 17,
          margin: "0 0 7px",
          color: "#17233C",
          lineHeight: 1.3,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: 0,
          color: "#6B6862",
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        {text}
      </p>
    </>
  );

  return href ? (
    <a
      href={href}
      style={style}
    >
      {content}
    </a>
  ) : (
    <div style={style}>
      {content}
    </div>
  );
}
