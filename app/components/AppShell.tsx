"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type ShellUser = {
  email: string;
  role: "org" | "admin";
  status: "pending" | "approved" | "rejected";
  orgId: string | null;
  orgName?: string | null;
} | null;

type TestOrg = {
  id: string;
  name: string;
  city?: string | null;
  county?: string | null;
} | null;

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  peach: "#F2A48D",
  mint: "#A9DCC9",
  pink: "#F2D6DC",
  text: "#1E3A5F",
  muted: "#4A5D75",
  border: "#E9E5E3",
  surface: "#FFFFFF",
  background: "#FFFDFC",
};

async function signOut() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
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

  const isAdminArea =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const isManagerArea =
    pathname === "/portal" ||
    pathname.startsWith("/portal/") ||
    pathname === "/animals" ||
    pathname.startsWith("/animals/");

  if (isAdminArea) {
    return (
      <AdminShell>
        {children}
      </AdminShell>
    );
  }

  if (
    isManagerArea &&
    user &&
    user.status === "approved" &&
    (user.role === "org" || user.role === "admin")
  ) {
    return (
      <ManagerShell user={user}>
        {children}
      </ManagerShell>
    );
  }

  const isHomePage =
    pathname === "/";

  const isLoginArea =
    pathname === "/login" ||
    pathname.startsWith(
      "/login/"
    );

  const isStandalonePortalArea =
    pathname === "/foster" ||
    pathname.startsWith(
      "/foster/"
    );

  if (
    isHomePage ||
    isLoginArea ||
    isStandalonePortalArea
  ) {
    return children;
  }

  return (
    <>
      <PublicHeader user={user} />

      <main
        style={{
          padding: "28px 24px",
          maxWidth: 1180,
          margin: "0 auto",
        }}
      >
        {children}
      </main>
    </>
  );
}

/* =========================================================
   PUBLIC HEADER
========================================================= */

function PublicHeader({
  user,
}: {
  user: ShellUser;
}) {
  return (
    <header
      style={{
        background: COLORS.surface,
        borderBottom:
          "1px solid #E8EDF2",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          minHeight: 58,
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <a
            href="/"
            aria-label="Pack of Five home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              color: COLORS.navy,
              textDecoration: "none",
            }}
          >
            <PawMark />

            <span
              style={{
                fontFamily:
                  '"Space Grotesk", Arial, sans-serif',
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: ".035em",
                whiteSpace: "nowrap",
              }}
            >
              PACK OF FIVE
            </span>
          </a>

          <span
            aria-label="Current state: Texas"
            title="Texas"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 30,
              height: 24,
              padding: "0 7px",
              background: COLORS.pink,
              color: COLORS.navy,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: ".08em",
              lineHeight: 1,
              borderRadius: 4,
            }}
          >
            TX
          </span>
        </div>

        <nav
          aria-label="Public navigation"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <a
            href="/organizations"
            style={publicLinkStyle}
          >
            Directory
          </a>

          <a
            href="/adoptable"
            style={publicLinkStyle}
          >
            Adoptable Pets
          </a>

          <a
            href="/resources"
            style={publicLinkStyle}
          >
            Resources
          </a>
        </nav>
      </div>
    </header>
  );
}

function PawMark() {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "relative",
        display: "inline-block",
        width: 28,
        height: 26,
        flex: "0 0 auto",
      }}
    >
      <span
        style={{
          ...pawToeStyle,
          left: 1,
          top: 5,
          background: COLORS.coral,
          transform: "rotate(-24deg)",
        }}
      />

      <span
        style={{
          ...pawToeStyle,
          left: 7,
          top: 0,
          background: COLORS.peach,
          transform: "rotate(-8deg)",
        }}
      />

      <span
        style={{
          ...pawToeStyle,
          right: 6,
          top: 0,
          background: COLORS.mint,
          transform: "rotate(8deg)",
        }}
      />

      <span
        style={{
          ...pawToeStyle,
          right: 0,
          top: 5,
          background: COLORS.pink,
          transform: "rotate(24deg)",
        }}
      />

      <span
        style={{
          position: "absolute",
          left: 6,
          bottom: 0,
          width: 17,
          height: 15,
          borderRadius: "50% 50% 45% 45%",
          background: COLORS.navy,
        }}
      />
    </span>
  );
}

/* =========================================================
   RESCUE MANAGER
========================================================= */

function ManagerShell({
  children,
  user,
}: {
  children: ReactNode;
  user: Exclude<ShellUser, null>;
}) {
  const [testOrg, setTestOrg] =
    useState<TestOrg>(null);

  const [
    testOrgChecked,
    setTestOrgChecked,
  ] = useState(
    user.role !== "admin"
  );

  useEffect(() => {
    if (user.role !== "admin") {
      return;
    }

    fetch("/api/admin/test-org", {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data) => {
        setTestOrg(
          data.organization ?? null
        );
      })
      .finally(() => {
        setTestOrgChecked(true);
      });
  }, [user.role]);

  async function exitTestMode() {
    await fetch("/api/admin/test-org", {
      method: "DELETE",
    });

    window.location.href =
      "/admin/orgs";
  }

  if (
    user.role === "admin" &&
    !testOrgChecked
  ) {
    return (
      <main
        style={{
          padding: 28,
        }}
      >
        Loading Rescue Manager test mode…
      </main>
    );
  }

  if (
    user.role === "admin" &&
    !testOrg
  ) {
    return (
      <main
        style={{
          padding: 28,
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <h1>
          Choose a test organization
        </h1>

        <a href="/admin/orgs">
          Choose Organization
        </a>
      </main>
    );
  }

  const organizationName =
    user.role === "admin" &&
    testOrg
      ? testOrg.name
      : user.orgName || null;

  const animalsLabel =
    organizationName
      ? `${organizationName} Animals`
      : "Our Animals";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          COLORS.background,
      }}
    >
      {user.role === "admin" &&
        testOrg && (
          <div
            style={{
              background:
                "#FFF3CD",
              borderBottom:
                "1px solid #E6CF82",
              padding:
                "9px 18px",
              fontSize: 13,
              display: "flex",
              justifyContent:
                "center",
              alignItems:
                "center",
              gap: 12,
              flexWrap:
                "wrap",
            }}
          >
            <strong>
              Admin Test Mode
            </strong>

            <span>
              Viewing Rescue
              Manager as{" "}
              {testOrg.name}
            </span>

            <button
              onClick={
                exitTestMode
              }
              style={{
                background:
                  "transparent",
                border:
                  "1px solid #9A8127",
                borderRadius: 6,
                padding:
                  "5px 8px",
                cursor:
                  "pointer",
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
          gridTemplateColumns:
            "260px minmax(0, 1fr)",
          minHeight:
            user.role === "admin"
              ? "calc(100vh - 40px)"
              : "100vh",
        }}
      >
        <aside
          style={{
            background:
              COLORS.navy,
            color: "#fff",
            padding:
              "24px 18px",
          }}
        >
          <a
            href="/"
            style={{
              color: "#fff",
              textDecoration:
                "none",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            PACK OF FIVE
          </a>

          <div
            style={{
              fontSize: 12,
              opacity: 0.72,
              marginTop: 3,
              marginBottom: 28,
              letterSpacing:
                ".08em",
            }}
          >
            RESCUE MANAGER
          </div>

          {organizationName && (
            <div
              style={{
                fontSize: 13,
                lineHeight: 1.4,
                fontWeight: 700,
                marginBottom: 18,
                paddingBottom: 14,
                borderBottom:
                  "1px solid rgba(255,255,255,.16)",
              }}
            >
              {organizationName}
            </div>
          )}

          <nav
            aria-label="Rescue Manager navigation"
          >
            <ManagerLink href="/portal">
              Overview
            </ManagerLink>

            <ManagerLink href="/animals">
              {animalsLabel}
            </ManagerLink>

            <ManagerLink href="/portal/urgent">
              Urgent Shelter Animals
            </ManagerLink>

            <ManagerLink href="/fosters">
              Fosters
            </ManagerLink>
          </nav>

          <div
            style={{
              borderTop:
                "1px solid rgba(255,255,255,.16)",
              marginTop: 28,
              paddingTop: 18,
            }}
          >
            <a
              href="/organizations"
              style={managerFooterLink}
            >
              ← Rescue Network
            </a>

            {user.role === "admin" && (
              <a
                href="/admin"
                style={managerFooterLink}
              >
                ← Admin Dashboard
              </a>
            )}

            <div
              style={{
                fontSize: 12,
                color:
                  "rgba(255,255,255,.72)",
                marginBottom: 14,
                overflowWrap:
                  "anywhere",
              }}
            >
              {user.email}
            </div>

            <button
              onClick={signOut}
              style={
                signOutDarkStyle
              }
            >
              Sign Out
            </button>
          </div>
        </aside>

        <div
          style={{
            minWidth: 0,
          }}
        >
          <header
            style={{
              background:
                COLORS.surface,
              borderBottom:
                `1px solid ${COLORS.border}`,
              padding:
                "16px 28px",
            }}
          >
            <div
              style={{
                maxWidth: 1120,
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  color:
                    COLORS.navy,
                }}
              >
                {organizationName
                  ? `${organizationName} Rescue Manager`
                  : "Rescue Manager"}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color:
                    COLORS.muted,
                }}
              >
                Private rescue or shelter workspace
              </div>
            </div>
          </header>

          <main
            style={{
              padding: 28,
              maxWidth: 1120,
              margin: "0 auto",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ADMIN SHELL
========================================================= */

function AdminShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "#F7F7F8",
      }}
    >
      <header
        style={{
          background:
            "#111827",
          color: "#fff",
          padding:
            "16px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 800,
              }}
            >
              PACK OF FIVE
            </div>

            <div
              style={{
                fontSize: 12,
                opacity: 0.72,
              }}
            >
              PLATFORM ADMINISTRATION
            </div>
          </div>

          <nav
            style={{
              display: "flex",
              gap: 18,
              alignItems:
                "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/admin"
              style={darkLinkStyle}
            >
              Admin Dashboard
            </a>

            <a
              href="/admin/orgs"
              style={darkLinkStyle}
            >
              Organizations
            </a>

            <a
              href="/admin/orgs/new"
              style={darkLinkStyle}
            >
              Add Organization
            </a>

            <a
              href="/admin/org-requests"
              style={darkLinkStyle}
            >
              Org Requests
            </a>

            <a
              href="/organizations"
              style={darkLinkStyle}
            >
              Rescue Network
            </a>

            <a
              href="/"
              style={darkLinkStyle}
            >
              Home
            </a>

            <button
              onClick={signOut}
              style={
                signOutDarkStyle
              }
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <main
        style={{
          padding: 28,
          maxWidth: 1180,
          margin: "0 auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}

/* =========================================================
   MANAGER LINK
========================================================= */

function ManagerLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname =
    usePathname();

  const active =
    pathname === href ||
    pathname.startsWith(
      `${href}/`
    );

  return (
    <a
      href={href}
      style={{
        display: "block",
        padding:
          "10px 12px",
        borderRadius: 7,
        color: "#fff",
        textDecoration:
          "none",
        marginBottom: 4,
        background: active
          ? "rgba(255,255,255,.13)"
          : "transparent",
        fontWeight: active
          ? 700
          : 500,
        fontSize: 14,
        lineHeight: 1.35,
      }}
    >
      {children}
    </a>
  );
}

/* =========================================================
   SHARED STYLES
========================================================= */

const pawToeStyle: CSSProperties = {
  position: "absolute",
  width: 7,
  height: 9,
  borderRadius: "50%",
};

const publicLinkStyle = {
  textDecoration: "none",
  color: COLORS.navy,
  fontSize: 13.5,
  fontWeight: 700,
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
  border:
    "1px solid rgba(255,255,255,.45)",
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
