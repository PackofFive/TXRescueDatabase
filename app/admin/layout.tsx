import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login?portal=admin");
  }

  if (
    session.status !== "approved" ||
    session.role !== "admin"
  ) {
    redirect(
      "/login?portal=admin&error=access-denied"
    );
  }

  return children;
}
