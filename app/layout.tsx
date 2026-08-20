import type { ReactNode } from "react";
import { getSession } from "../lib/auth";
import AppShell from "./components/AppShell";

export const runtime = "edge";

export const metadata = {
  title: "Pack of Five Rescue Network",
  description:
    "Animal rescue organizations, adoptable pets, urgent shelter animals, and private rescue management tools.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          margin: 0,
          background: "#FAFAF9",
          color: "#1C1B19",
        }}
      >
        <AppShell
          user={
            session
              ? {
                  email: session.email,
                  role: session.role,
                  status: session.status,
                  orgId: session.orgId,
                }
              : null
          }
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
