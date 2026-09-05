"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BrandLogo from "./BrandLogo";

type ShellUser = {
  email: string;
  role: "org" | "admin";
  status: "pending" | "approved" | "rejected";
  orgId: string | null;
  orgName?: string | null;
  availablePortals?: string[];
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
    pathname.startsWith("/animals/") ||
    pathname === "/fosters" ||
    pathname.startsWith("/fosters/") ||
    pathname === "/volunteers" ||
    pathname.startsWith("/volunteers/");

  if (isAdminArea) {
    return (
      <AdminShell user={user}>
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

  const isFosterArea =
    pathname === "/foster" ||
    pathname.startsWith(
      "/foster/"
    );

  const isPetOwnerArea =
    pathname === "/pet-owner" ||
    pathname.startsWith(
      "/pet-owner/"
    );

  if (
    isHomePage ||
    isLoginArea
  ) {
    return children;
  }

  if (
    isPetOwnerArea &&
    user &&
    user.status === "approved"
  ) {
    return (
      <PetOwnerShell user={user}>
        {children}
      </PetOwnerShell>
    );
  }

  if (
    isFosterArea &&
    user &&
    user.status === "approved"
  ) {
    return (
      <FosterShell user={user}>
        {children}
      </FosterShell>
    );
  }

  if (
    isFosterArea ||
    isPetOwnerArea
  ) {
    return children;
  }

  if (
    pathname === "/account" &&
    user &&
    user.status === "approved"
  ) {
    return (
      <>
        <SignedInHeader user={user} />
        <main
          style={{
            padding: "28px 24px",
            maxWidth: 980,
            margin: "0 auto",
          }}
        >
          {children}
        </main>
      </>
    );
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
   SIGNED-IN HEADER
========================================================= */

function SignedInHeader({
  user,
}: {
  user: Exclude<ShellUser, null>;
}) {
  const pathname = usePathname();

  const [
    portals,
    setPortals,
  ] = useState<string[]>(
    user.availablePortals ??
      (
        user.role === "admin"
          ? ["admin"]
          : user.role === "org"
          ? ["organization"]
          : []
      )
  );

  useEffect(() => {
    fetch(
      "/api/auth/me",
      {
        cache: "no-store",
      }
    )
      .then((r) => r.json())
      .then((data) => {
        const next =
          data.user?.availablePortals;

        if (Array.isArray(next)) {
          setPortals(next);
        }
      })
      .catch(() => {
        // Keep server-provided fallback links.
      });
  }, []);

  const showOrganization =
    portals.includes(
      "organization"
    ) ||
    user.role === "org" ||
    (
      user.role === "admin" &&
      Boolean(user.orgId)
    );

  const showFoster =
    portals.includes(
      "foster"
    );

  const showPetOwner =
    portals.includes(
      "pet-owner"
    );

  return (
    <header
      style={{
        background:
          COLORS.surface,
        borderBottom:
          "1px solid #E8EDF2",
        position:
          "sticky",
        top:
          0,
        zIndex:
          60,
      }}
    >
      <div
        style={{
          maxWidth:
            1180,
          margin:
            "0 auto",
          padding:
            "0 20px",
        }}
      >
        <div
          style={{
            minHeight:
              58,
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            gap:
              18,
            flexWrap:
              "wrap",
          }}
        >
          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap:
                9,
            }}
          >
            <a
              href="/"
              aria-label="Pack of Five home"
              style={{
                display:
                  "inline-flex",
                alignItems:
                  "center",
                gap:
                  9,
                color:
                  COLORS.navy,
                textDecoration:
                  "none",
              }}
            >
              <BrandLogo size={28} />

              <span
                style={{
                  fontFamily:
                    '"Space Grotesk", Arial, sans-serif',
                  fontWeight:
                    700,
                  fontSize:
                    18,
                  letterSpacing:
                    ".035em",
                  whiteSpace:
                    "nowrap",
                }}
              >
                PACK OF FIVE
              </span>
            </a>

            <span
              aria-label="Current state: Texas"
              title="Texas"
              style={{
                display:
                  "inline-flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                minWidth:
                  30,
                height:
                  24,
                padding:
                  "0 7px",
                background:
                  COLORS.pink,
                color:
                  COLORS.navy,
                fontSize:
                  11,
                fontWeight:
                  800,
                letterSpacing:
                  ".08em",
                lineHeight:
                  1,
                borderRadius:
                  4,
              }}
            >
              TX
            </span>
          </div>

          <nav
            aria-label="Private portal navigation"
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap:
                16,
              flexWrap:
                "wrap",
            }}
          >
            {showOrganization && (
              <TopPortalLink
                href="/portal"
                active={
                  pathname ===
                    "/portal" ||
                  pathname.startsWith(
                    "/portal/"
                  ) ||
                  pathname ===
                    "/animals" ||
                  pathname.startsWith(
                    "/animals/"
                  ) ||
                  pathname ===
                    "/fosters" ||
                  pathname.startsWith(
                    "/fosters/"
                  ) ||
                  pathname ===
                    "/volunteers" ||
                  pathname.startsWith(
                    "/volunteers/"
                  )
                }
              >
                Rescue Manager
              </TopPortalLink>
            )}

            {showFoster && (
              <TopPortalLink
                href="/foster"
                active={
                  pathname ===
                    "/foster" ||
                  pathname.startsWith(
                    "/foster/"
                  )
                }
              >
                Volunteer Portal
              </TopPortalLink>
            )}

            {showPetOwner && (
              <TopPortalLink
                href="/pet-owner"
                active={
                  pathname ===
                    "/pet-owner" ||
                  pathname.startsWith(
                    "/pet-owner/"
                  )
                }
              >
                Pet Owner
              </TopPortalLink>
            )}

            <a
              href="/account"
              style={
                topUtilityLinkStyle
              }
            >
              Account
            </a>

            <button
              type="button"
              onClick={
                signOut
              }
              style={
                topSignOutStyle
              }
            >
              Sign Out
            </button>
          </nav>
        </div>

        <div
          style={{
            minHeight:
              42,
            borderTop:
              "1px solid #F0F2F5",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "flex-end",
            gap:
              22,
            flexWrap:
              "wrap",
          }}
        >
          <a
            href="/organizations"
            style={
              publicLinkStyle
            }
          >
            Directory
          </a>

          <a
            href="/adoptable"
            style={
              publicLinkStyle
            }
          >
            Adoptable Pets
          </a>

          <a
            href="/resources"
            style={
              publicLinkStyle
            }
          >
            Resources
          </a>
        </div>
      </div>
    </header>
  );
}

function TopPortalLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      style={{
        textDecoration:
          "none",
        color:
          COLORS.navy,
        fontSize:
          13,
        fontWeight:
          active
            ? 800
            : 700,
        whiteSpace:
          "nowrap",
        padding:
          "7px 0 6px",
        borderBottom:
          active
            ? `2px solid ${COLORS.coral}`
            : "2px solid transparent",
      }}
    >
      {children}
    </a>
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
            <BrandLogo size={28} />

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

/* =========================================================
   VOLUNTEER PORTAL
========================================================= */

function FosterShell({
  children,
  user,
}: {
  children: ReactNode;
  user: Exclude<ShellUser, null>;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          COLORS.background,
      }}
    >
      <SignedInHeader user={user} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "240px minmax(0, 1fr)",
          minHeight:
            "calc(100vh - 101px)",
        }}
      >
        <aside
          style={{
            background:
              COLORS.navy,
            color:
              "#fff",
            padding:
              "24px 18px",
          }}
        >
          <a
            href="/foster"
            style={{
              color:
                "#fff",
              textDecoration:
                "none",
              fontWeight:
                800,
              fontSize:
                18,
            }}
          >
            PACK OF FIVE
          </a>

          <div
            style={{
              fontSize:
                12,
              opacity:
                0.72,
              marginTop:
                3,
              marginBottom:
                28,
              letterSpacing:
                ".08em",
            }}
          >
            VOLUNTEER PORTAL
          </div>

          <nav
            aria-label="Volunteer Portal navigation"
          >
            <FosterLink
              href="/foster"
              exact
            >
              Dashboard
            </FosterLink>

            <FosterLink
              href="/foster/animals"
            >
              My Foster Animals
            </FosterLink>

            <FosterLink
              href="/foster/applications"
            >
              Applications &amp; Offers
            </FosterLink>

            <FosterLink
              href="/foster/relationships"
            >
              Rescue Relationships
            </FosterLink>

            <FosterLink
              href="/foster/profile"
            >
              Foster Profile
            </FosterLink>

            <FosterLink
              href="/resources"
            >
              Resources
            </FosterLink>
          </nav>

          <div
            style={{
              borderTop:
                "1px solid rgba(255,255,255,.16)",
              marginTop:
                28,
              paddingTop:
                18,
            }}
          >
            <div
              style={{
                fontSize:
                  12,
                color:
                  "rgba(255,255,255,.72)",
                marginBottom:
                  14,
                overflowWrap:
                  "anywhere",
              }}
            >
              {user.email}
            </div>

            <button
              onClick={
                signOut
              }
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
            minWidth:
              0,
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
                maxWidth:
                  1120,
                margin:
                  "0 auto",
              }}
            >
              <div
                style={{
                  fontWeight:
                    800,
                  color:
                    COLORS.navy,
                }}
              >
                Volunteer Portal
              </div>

              <div
                style={{
                  fontSize:
                    12,
                  color:
                    COLORS.muted,
                }}
              >
                Private volunteer and foster workspace
              </div>
            </div>
          </header>

          <main
            style={{
              padding:
                28,
              maxWidth:
                1120,
              margin:
                "0 auto",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function FosterLink({
  href,
  exact = false,
  children,
}: {
  href: string;
  exact?: boolean;
  children: ReactNode;
}) {
  const pathname =
    usePathname();

  const active =
    exact
      ? pathname === href
      : pathname === href ||
        pathname.startsWith(
          `${href}/`
        );

  return (
    <a
      href={href}
      style={{
        display:
          "block",
        padding:
          "10px 12px",
        borderRadius:
          7,
        color:
          "#fff",
        textDecoration:
          "none",
        marginBottom:
          4,
        background:
          active
            ? "rgba(255,255,255,.13)"
            : "transparent",
        fontWeight:
          active
            ? 700
            : 500,
        fontSize:
          14,
        lineHeight:
          1.35,
      }}
    >
      {children}
    </a>
  );
}

/* =========================================================
   PET OWNER PORTAL
========================================================= */

function PetOwnerShell({
  children,
  user,
}: {
  children: ReactNode;
  user: Exclude<ShellUser, null>;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          COLORS.background,
      }}
    >
      <SignedInHeader user={user} />

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "240px minmax(0, 1fr)",
          minHeight:
            "calc(100vh - 101px)",
        }}
      >
        <aside
          style={{
            background:
              COLORS.navy,
            color:
              "#fff",
            padding:
              "24px 18px",
          }}
        >
          <a
            href="/pet-owner"
            style={{
              color:
                "#fff",
              textDecoration:
                "none",
              fontWeight:
                800,
              fontSize:
                18,
            }}
          >
            PACK OF FIVE
          </a>

          <div
            style={{
              fontSize:
                12,
              opacity:
                0.72,
              marginTop:
                3,
              marginBottom:
                28,
              letterSpacing:
                ".08em",
            }}
          >
            PET OWNER
          </div>

          <nav
            aria-label="Pet Owner navigation"
          >
            <PetOwnerLink
              href="/pet-owner"
              exact
            >
              Dashboard
            </PetOwnerLink>

            <PetOwnerLink
              href="/pet-owner/records"
            >
              Records &amp; Documents
            </PetOwnerLink>

            <PetOwnerLink
              href="/pet-owner/reminders"
            >
              Care &amp; Reminders
            </PetOwnerLink>

            <PetOwnerLink
              href="/pet-owner/profile"
            >
              Profile &amp; Settings
            </PetOwnerLink>

            <PetOwnerLink
              href="/resources"
            >
              Resources
            </PetOwnerLink>
          </nav>

          <div
            style={{
              borderTop:
                "1px solid rgba(255,255,255,.16)",
              marginTop:
                28,
              paddingTop:
                18,
            }}
          >
            <div
              style={{
                fontSize:
                  12,
                color:
                  "rgba(255,255,255,.72)",
                marginBottom:
                  14,
                overflowWrap:
                  "anywhere",
              }}
            >
              {user.email}
            </div>

            <button
              onClick={
                signOut
              }
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
            minWidth:
              0,
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
                maxWidth:
                  1120,
                margin:
                  "0 auto",
              }}
            >
              <div
                style={{
                  fontWeight:
                    800,
                  color:
                    COLORS.navy,
                }}
              >
                Pet Owner Portal
              </div>

              <div
                style={{
                  fontSize:
                    12,
                  color:
                    COLORS.muted,
                }}
              >
                Private pet care workspace
              </div>
            </div>
          </header>

          <main
            style={{
              padding:
                28,
              maxWidth:
                1120,
              margin:
                "0 auto",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function PetOwnerLink({
  href,
  exact = false,
  children,
}: {
  href: string;
  exact?: boolean;
  children: ReactNode;
}) {
  const pathname =
    usePathname();

  const active =
    exact
      ? pathname === href
      : pathname === href ||
        pathname.startsWith(
          `${href}/`
        );

  return (
    <a
      href={href}
      style={{
        display:
          "block",
        padding:
          "10px 12px",
        borderRadius:
          7,
        color:
          "#fff",
        textDecoration:
          "none",
        marginBottom:
          4,
        background:
          active
            ? "rgba(255,255,255,.13)"
            : "transparent",
        fontWeight:
          active
            ? 700
            : 500,
        fontSize:
          14,
        lineHeight:
          1.35,
      }}
    >
      {children}
    </a>
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
  const organizationName =
    user.orgName || null;

  const animalsLabel =
    organizationName
      ? `${organizationName} Animals`
      : "Animals in Our Care";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          COLORS.background,
      }}
    >
      <SignedInHeader
        user={user}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "260px minmax(0, 1fr)",
          minHeight: "100vh",
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
            <ManagerNavigation
              animalsLabel={animalsLabel}
            />
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
              Rescue Network
            </a>

            <a
              href="/resources"
              style={managerFooterLink}
            >
              Resources
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
  user,
}: {
  children: ReactNode;
  user: ShellUser;
}) {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [platformLevel, setPlatformLevel] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setCompact(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" }).then(r => r.json()).then(data => setPlatformLevel(data.user?.platformAccessLevel ?? null)).catch(() => setPlatformLevel(null));
  }, []);

  const canUseDirectory = platformLevel === "platform_owner" || platformLevel === "directory_moderator";
  const canUseCases = platformLevel === "platform_owner" || platformLevel === "case_administrator";

  const adminLink = (href: string, label: string) => {
    const path = href.split("#")[0];
    const hasSectionAnchor = href.includes("#");
    const active = hasSectionAnchor
      ? false
      : href === "/admin"
      ? pathname === "/admin"
      : href === "/admin/orgs"
      ? pathname === "/admin/orgs" || (pathname.startsWith("/admin/orgs/") && pathname !== "/admin/orgs/new")
      : pathname === path;
    return <a href={href} style={{...adminSidebarLink,background:active?"#456284":"transparent",color:"#fff"}}>{label}</a>;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "#F7F7F8",
      }}
    >
      <header style={{background:"#fff",borderBottom:`1px solid ${COLORS.border}`,padding:compact?"12px 16px":"14px 28px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><BrandLogo size={compact?30:36}/><strong style={{color:COLORS.navy,fontSize:compact?18:22}}>PACK OF FIVE</strong></div>
          <div style={{display:"flex",gap:16,alignItems:"center",fontSize:13,fontWeight:700}}>
            <a href="/account" style={{color:COLORS.navy}}>Account</a>
            <button onClick={signOut} style={{...signOutDarkStyle,color:COLORS.navy,borderColor:COLORS.border}}>Sign Out</button>
          </div>
        </div>
      </header>

      {compact ? (
        <nav aria-label="Platform Administration" style={{display:"flex",gap:7,overflowX:"auto",padding:"10px 14px",background:COLORS.navy}}>
          {adminLink("/admin","Dashboard")}{canUseDirectory?adminLink("/admin/orgs","Organizations"):null}{canUseDirectory?adminLink("/admin/org-requests","Requests"):null}{canUseCases?adminLink("/admin#claim-issues","Cases"):null}{adminLink("/admin#admin-team","Admin Team")}
        </nav>
      ) : null}

      <div style={{display:"grid",gridTemplateColumns:compact?"1fr":"220px minmax(0, 1fr)",minHeight:"calc(100vh - 78px)"}}>
        {!compact ? <aside style={{background:COLORS.navy,color:"#fff",padding:"24px 16px",minHeight:"100%"}}>
          <nav aria-label="Platform Administration">
            <AdminNavGroup label="OVERVIEW">{adminLink("/admin","Dashboard")}</AdminNavGroup>
            {canUseDirectory?<AdminNavGroup label="DIRECTORY">{adminLink("/admin/orgs","Organizations")}{adminLink("/admin/orgs/new","Add Organization")}{adminLink("/admin/org-requests","Organization Requests")}{adminLink("/admin#submissions","Pending Public Updates")}</AdminNavGroup>:null}
            {canUseCases?<AdminNavGroup label="CASES">{adminLink("/admin#claims","Listing Claims")}{adminLink("/admin#claim-issues","Access Cases")}{adminLink("/admin#lifecycle-reviews","Closure & Dormancy")}</AdminNavGroup>:null}
            <AdminNavGroup label="PLATFORM SECURITY">{adminLink("/admin#admin-team","Admin Team")}</AdminNavGroup>
          </nav>
          <div style={{borderTop:"1px solid rgba(255,255,255,.18)",paddingTop:17,marginTop:24}}>
            <a href="/organizations" style={adminFooterLink}>Rescue Network</a><a href="/" style={adminFooterLink}>Public Home</a>
            {user?.email?<div style={{fontSize:12,opacity:.7,overflowWrap:"anywhere",margin:"14px 0"}}>{user.email}</div>:null}
          </div>
        </aside>:null}
        <div style={{minWidth:0}}>
          <main style={{padding:compact?"20px 16px":"28px",maxWidth:1120,margin:"0 auto"}}>{children}</main>
        </div>
      </div>
    </div>
  );
}

function AdminNavGroup({label,children}:{label:string;children:ReactNode}){return <section style={{marginBottom:18}}><div style={{fontSize:9.5,fontWeight:800,letterSpacing:".12em",opacity:.68,margin:"0 9px 6px"}}>{label}</div><div style={{display:"grid",gap:2}}>{children}</div></section>}

const adminSidebarLink:CSSProperties={display:"block",padding:"8px 9px",borderRadius:7,textDecoration:"none",fontSize:12.5,fontWeight:700,whiteSpace:"normal",lineHeight:1.3};
const adminFooterLink:CSSProperties={display:"block",color:"#fff",textDecoration:"none",fontSize:14,marginBottom:12};

/* =========================================================
   MANAGER NAVIGATION
========================================================= */

function ManagerNavigation({
  animalsLabel,
}: {
  animalsLabel: string;
}) {
  const pathname = usePathname();
  const [dashboardAlerts, setDashboardAlerts] = useState({
    count: 0,
    critical: false,
    urgentAnimals: 0,
  });
  const inAnimalsSection =
    pathname === "/animals" ||
    pathname.startsWith("/animals/") ||
    pathname === "/portal/urgent" ||
    pathname.startsWith("/portal/urgent/");
  const inPeopleSection =
    pathname === "/fosters" ||
    pathname.startsWith("/fosters/") ||
    pathname === "/volunteers" ||
    pathname.startsWith("/volunteers/");
  const inOrganizationSection =
    pathname === "/portal/organization-profile" ||
    pathname.startsWith(
      "/portal/organization-profile/"
    ) ||
    pathname === "/portal/team-access" ||
    pathname.startsWith(
      "/portal/team-access/"
    ) ||
    pathname === "/portal/data-imports" ||
    pathname.startsWith(
      "/portal/data-imports/"
    );

  const [animalsOpen, setAnimalsOpen] =
    useState(true);
  const [peopleOpen, setPeopleOpen] =
    useState(true);
  const [organizationOpen, setOrganizationOpen] =
    useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboardAlertCount() {
      try {
        const response = await fetch("/api/dashboard/alerts", {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok || !active) return;

        const actionable = Array.isArray(data.alerts)
          ? data.alerts.filter((alert: { priority?: string }) => alert.priority !== "info")
          : [];

        setDashboardAlerts({
          count: actionable.length,
          critical: actionable.some((alert: { priority?: string; due_at?: string | null }) =>
            alert.priority === "critical" ||
            (alert.due_at ? new Date(alert.due_at).getTime() < Date.now() : false)
          ),
          urgentAnimals: Number(data.stats?.urgent_animals ?? 0),
        });
      } catch {
        // A badge failure must never block Rescue Manager navigation.
      }
    }

    loadDashboardAlertCount();
    const refresh = window.setInterval(loadDashboardAlertCount, 60_000);

    return () => {
      active = false;
      window.clearInterval(refresh);
    };
  }, [pathname]);

  useEffect(() => {
    if (inAnimalsSection) {
      setAnimalsOpen(true);
    }
  }, [inAnimalsSection]);

  useEffect(() => {
    if (inPeopleSection) {
      setPeopleOpen(true);
    }
  }, [inPeopleSection]);

  useEffect(() => {
    if (inOrganizationSection) {
      setOrganizationOpen(true);
    }
  }, [inOrganizationSection]);

  return (
    <>
      <ManagerSectionLabel>
        Overview
      </ManagerSectionLabel>

      <ManagerLink
        href="/portal"
        exact
      >
        <span style={dashboardLinkContentStyle}>
          <span>Dashboard</span>
          {dashboardAlerts.count > 0 ? (
            <span
              aria-label={`${dashboardAlerts.count} alert${dashboardAlerts.count === 1 ? "" : "s"} need attention`}
              title={`${dashboardAlerts.count} alert${dashboardAlerts.count === 1 ? "" : "s"} need attention`}
              style={{
                ...dashboardAlertBadgeStyle,
                background: dashboardAlerts.critical ? "#C63D32" : COLORS.coral,
              }}
            >
              {dashboardAlerts.count > 99 ? "99+" : dashboardAlerts.count}
            </span>
          ) : null}
        </span>
      </ManagerLink>

      <ManagerLink href="/fosters/offers">
        Applications &amp; Offers
      </ManagerLink>

      <ManagerSectionToggle
        expanded={animalsOpen}
        controls="manager-animals-navigation"
        onClick={() =>
          setAnimalsOpen((open) => !open)
        }
      >
        Animals
      </ManagerSectionToggle>

      <div
        id="manager-animals-navigation"
        hidden={!animalsOpen}
        style={managerSectionItemsStyle}
      >
        <ManagerLink href="/animals">
          {animalsLabel}
        </ManagerLink>

        <ManagerLink href="/portal/urgent">
          <span style={dashboardLinkContentStyle}>
            <span>Urgent</span>
            {dashboardAlerts.urgentAnimals > 0 ? <span aria-label={`${dashboardAlerts.urgentAnimals} urgent animals`} style={{...dashboardAlertBadgeStyle,background:"#C63D32"}}>{dashboardAlerts.urgentAnimals > 99 ? "99+" : dashboardAlerts.urgentAnimals}</span> : null}
          </span>
        </ManagerLink>
      </div>

      <ManagerSectionToggle
        expanded={peopleOpen}
        controls="manager-people-navigation"
        onClick={() =>
          setPeopleOpen((open) => !open)
        }
      >
        People &amp; Placement
      </ManagerSectionToggle>

      <div
        id="manager-people-navigation"
        hidden={!peopleOpen}
        style={managerSectionItemsStyle}
      >
        <ManagerLink
          href="/fosters"
          exact
        >
          Fosters
        </ManagerLink>

        <ManagerLink
          href="/volunteers"
          exact
        >
          Volunteers
        </ManagerLink>

        <ManagerLink href="/fosters/assignments">
          Foster Assignments
        </ManagerLink>

        <ManagerLink href="/fosters/updates">
              Foster Updates
        </ManagerLink>
      </div>

      <ManagerSectionToggle
        expanded={organizationOpen}
        controls="manager-organization-navigation"
        onClick={() =>
          setOrganizationOpen((open) => !open)
        }
      >
        Organization
      </ManagerSectionToggle>

      <div
        id="manager-organization-navigation"
        hidden={!organizationOpen}
        style={managerSectionItemsStyle}
      >
        <ManagerLink href="/portal/organization-profile">
          Organization Profile
        </ManagerLink>

        <ManagerLink href="/portal/team-access">
          Team &amp; Access
        </ManagerLink>

        <ManagerLink href="/portal/data-imports" exact>
          Data &amp; Imports
        </ManagerLink>

        <ManagerLink href="/portal/data-imports/audit">
          Import Audit
        </ManagerLink>
      </div>
    </>
  );
}

function ManagerSectionLabel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div style={managerSectionLabelStyle}>
      {children}
    </div>
  );
}

function ManagerSectionToggle({
  expanded,
  controls,
  onClick,
  children,
}: {
  expanded: boolean;
  controls: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onClick}
      style={managerSectionToggleStyle}
    >
      <span>{children}</span>
      <span aria-hidden="true">
        {expanded ? "▾" : "▸"}
      </span>
    </button>
  );
}

function ManagerLink({
  href,
  exact = false,
  children,
}: {
  href: string;
  exact?: boolean;
  children: ReactNode;
}) {
  const pathname =
    usePathname();

  const active =
    exact
      ? pathname === href
      : pathname === href ||
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

const publicLinkStyle = {
  textDecoration: "none",
  color: COLORS.navy,
  fontSize: 13.5,
  fontWeight: 700,
  whiteSpace: "nowrap",
} as const;

const topUtilityLinkStyle:
  CSSProperties =
{
  textDecoration:
    "none",
  color:
    COLORS.muted,
  fontSize:
    12.5,
  fontWeight:
    700,
  whiteSpace:
    "nowrap",
};

const topSignOutStyle:
  CSSProperties =
{
  background:
    "transparent",
  color:
    COLORS.muted,
  border:
    `1px solid ${COLORS.border}`,
  borderRadius:
    6,
  padding:
    "6px 9px",
  fontSize:
    12,
  fontWeight:
    700,
  cursor:
    "pointer",
};

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

const dashboardLinkContentStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const dashboardAlertBadgeStyle: CSSProperties = {
  minWidth: 23,
  height: 23,
  padding: "0 7px",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: 11,
  lineHeight: 1,
  fontWeight: 800,
  boxShadow: "0 0 0 2px rgba(255,255,255,.18)",
};

const managerFooterLink = {
  display: "block",
  color: "#fff",
  textDecoration: "none",
  fontSize: 14,
  marginBottom: 12,
} as const;

const managerSectionLabelStyle:
  CSSProperties =
{
  color:
    "rgba(255,255,255,.64)",
  fontSize:
    11,
  fontWeight:
    800,
  letterSpacing:
    ".1em",
  margin:
    "20px 12px 7px",
  textTransform:
    "uppercase",
};

const managerSectionToggleStyle:
  CSSProperties =
{
  width:
    "100%",
  display:
    "flex",
  alignItems:
    "center",
  justifyContent:
    "space-between",
  gap:
    12,
  margin:
    "20px 0 7px",
  padding:
    "0 12px",
  border:
    0,
  background:
    "transparent",
  color:
    "rgba(255,255,255,.72)",
  cursor:
    "pointer",
  fontFamily:
    "inherit",
  fontSize:
    11,
  fontWeight:
    800,
  letterSpacing:
    ".1em",
  lineHeight:
    1.4,
  textAlign:
    "left",
  textTransform:
    "uppercase",
};

const managerSectionItemsStyle:
  CSSProperties =
{
  paddingLeft:
    8,
};
