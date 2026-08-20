"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type ShellUser = {
  email: string;
  role: "org" | "admin";
  status: "pending" | "approved" | "rejected";
  orgId: string | null;
} | null;

type TestOrg = {
  id: string;
  name: string;
  city?: string | null;
  county?: string | null;
} | null;

const COLORS = {
  navy: "#17233C",
  coral: "#E8634A",
  text: "#1C1B19",
  muted: "#6B6862",
  border: "#E7E5E1",
  surface: "#FFFFFF",
  background: "#FAFAF9",
};

async function signOut() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } finally {
    window.location.href = "/";
  }
}

export default function AppShell({
  children,
  user,
}: {
  children: ReactNode;
  user: ShellUser;
}) {
  const pathname = usePathname();
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  const isManagerArea =
    pathname === "/portal" ||
    pathname.startsWith("/portal/") ||
    pathname === "/animals" ||
    pathname.startsWith("/animals/");

  if (isAdminArea) return <AdminShell>{children}</AdminShell>;

  if (
    isManagerArea &&
    user &&
    user.status === "approved" &&
    (user.role === "org" || user.role === "admin")
  ) {
    return <ManagerShell user={user}>{children}</ManagerShell>;
  }

  return (
    <>
      <PublicHeader user={user} />
      <main style={{ padding: "28px 24px", maxWidth: 1180, margin: "0 auto" }}>
        {children}
      </main>
    </>
  );
}

function PublicHeader({ user }: { user: ShellUser }) {
  const accountHref =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "org" && user.status === "approved"
      ? "/portal"
      : "/login";

  const accountLabel =
    user?.role === "admin"
      ? "Admin"
      : user?.role === "org" && user.status === "approved"
      ? "Rescue Manager"
      : "Sign In";

  return (
    <header
      style={{
        background: COLORS.surface,
        borderBottom: `1px solid ${COLORS.border}`,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <a
          href="/"
          style={{
            color: COLORS.navy,
            fontWeight: 800,
            textDecoration: "none",
            fontSize: 19,
            marginRight: "auto",
          }}
        >
          PACK OF FIVE
        </a>

        <nav
          aria-label="Public navigation"
          style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}
        >
          <a href="/" style={publicLinkStyle}>Organizations</a>
          <a href="/adoptable" style={publicLinkStyle}>Adoptable Pets</a>
          <a href="/resources" style={publicLinkStyle}>Resources</a>
          <a
            href="/support"
            style={{ ...publicLinkStyle, color: COLORS.coral, fontWeight: 700 }}
          >
            Support
          </a>
        </nav>

        <a
          href={accountHref}
          style={{
            textDecoration: "none",
            background: COLORS.navy,
            color: "#fff",
            borderRadius: 8,
            padding: "9px 14px",
            fontSize: 14,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {accountLabel}
        </a>
      </div>
    </header>
  );
}

function ManagerShell({
  children,
  user,
}: {
  children: ReactNode;
  user: Exclude<ShellUser, null>;
}) {
  const [testOrg, setTestOrg] = useState<TestOrg>(null);
  const [testOrgChecked, setTestOrgChecked] = useState(user.role !== "admin");

  useEffect(() => {
    if (user.role !== "admin") return;

    fetch("/api/admin/test-org")
      .then((r) => r.json())
      .then((data) => setTestOrg(data.organization ?? null))
      .finally(() => setTestOrgChecked(true));
  }, [user.role]);

  async function exitTestMode() {
    await fetch("/api/admin/test-org", { method: "DELETE" });
    window.location.href = "/admin/orgs";
  }

  if (user.role === "admin" && !testOrgChecked) {
    return <main style={{ padding: 28 }}>Loading Rescue Manager test mode…</main>;
  }

  if (user.role === "admin" && !testOrg) {
    return (
      <main style={{ padding: 28, maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ color: COLORS.navy }}>Choose a test organization</h1>
        <p style={{ color: COLORS.muted, lineHeight: 1.6 }}>
          Your admin account can test Rescue Manager without becoming an
          organization user. Choose an organization from the Admin organization
          list first.
        </p>
        <a
          href="/admin/orgs"
          style={{
            display: "inline-block",
            background: COLORS.navy,
            color: "#fff",
            textDecoration: "none",
            borderRadius: 7,
            padding: "9px 14px",
            fontWeight: 700,
          }}
        >
          Choose Organization
        </a>
      </main>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.background }}>
      {user.role === "admin" && testOrg && (
        <div
          style={{
            background: "#FFF3CD",
            borderBottom: "1px solid #E6CF82",
            padding: "9px 18px",
            fontSize: 13,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <strong>Admin Test Mode</strong>
          <span>Viewing Rescue Manager as {testOrg.name}</span>
          <button
            onClick={exitTestMode}
            style={{
              background: "transparent",
              border: "1px solid #9A8127",
              borderRadius: 6,
              padding: "5px 8px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Exit Test Mode
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px minmax(0, 1fr)",
          minHeight: user.role === "admin" ? "calc(100vh - 40px)" : "100vh",
        }}
      >
        <aside style={{ background: COLORS.navy, color: "#fff", padding: "24px 18px" }}>
          <a href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: 18 }}>
            PACK OF FIVE
          </a>
          <div
            style={{
              fontSize: 12,
              opacity: 0.72,
              marginTop: 3,
              marginBottom: 28,
              letterSpacing: "0.08em",
            }}
          >
            RESCUE MANAGER
          </div>

          <nav aria-label="Rescue Manager navigation">
            <ManagerLink href="/portal">Overview</ManagerLink>
            <ManagerLink href="/animals">Animals</ManagerLink>
            <ManagerLink href="/portal/urgent">Urgent Animals</ManagerLink>
          </nav>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,.16)",
              marginTop: 28,
              paddingTop: 18,
            }}
          >
            <a href="/" style={managerFooterLink}>← Rescue Network</a>
            {user.role === "admin" && (
              <a href="/admin" style={managerFooterLink}>← Admin Dashboard</a>
            )}
            <div
              style={{
                fontSize: 12,
                lineHeight: 1.4,
                color: "rgba(255,255,255,.72)",
                overflowWrap: "anywhere",
                marginBottom: 14,
              }}
            >
              {user.email}
            </div>
            <button onClick={signOut} style={signOutDarkStyle}>Sign Out</button>
          </div>
        </aside>

        <div style={{ minWidth: 0 }}>
          <header
            style={{
              background: COLORS.surface,
              borderBottom: `1px solid ${COLORS.border}`,
              padding: "16px 28px",
            }}
          >
            <div style={{ maxWidth: 1120, margin: "0 auto" }}>
              <div style={{ fontWeight: 800, color: COLORS.navy }}>Rescue Manager</div>
              <div style={{ fontSize: 12, color: COLORS.muted }}>
                Private rescue or shelter workspace
              </div>
            </div>
          </header>

          <main style={{ padding: 28, maxWidth: 1120, margin: "0 auto" }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F8" }}>
      <header style={{ background: "#111827", color: "#fff", padding: "16px 24px" }}>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div>
            <div style={{ fontWeight: 800 }}>PACK OF FIVE</div>
            <div style={{ fontSize: 12, opacity: 0.72 }}>PLATFORM ADMINISTRATION</div>
          </div>
          <nav style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <a href="/admin" style={darkLinkStyle}>Admin Dashboard</a>
            <a href="/admin/orgs" style={darkLinkStyle}>Organizations</a>
            <a href="/" style={darkLinkStyle}>Rescue Network</a>
            <button onClick={signOut} style={signOutDarkStyle}>Sign Out</button>
          </nav>
        </div>
      </header>
      <main style={{ padding: 28, maxWidth: 1180, margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}

function ManagerLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <a
      href={href}
      style={{
        display: "block",
        padding: "10px 12px",
        borderRadius: 7,
        color: "#fff",
        textDecoration: "none",
        marginBottom: 4,
        background: active ? "rgba(255,255,255,.13)" : "transparent",
        fontWeight: active ? 700 : 500,
        fontSize: 14,
      }}
    >
      {children}
    </a>
  );
}

const publicLinkStyle = {
  textDecoration: "none",
  color: COLORS.text,
  fontSize: 14,
  whiteSpace: "nowrap",
} as const;

const darkLinkStyle = {
  textDecoration: "none",
  color: "#fff",
  fontSize: 14,
} as const;

const signOutDarkStyle = {
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,.45)",
  borderRadius: 7,
  padding: "7px 11px",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
} as const;

const managerFooterLink = {
  display: "block",
  color: "#fff",
  textDecoration: "none",
  fontSize: 14,
  marginBottom: 12,
} as const;
