import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { requireAdminFresh } from "@/lib/auth";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    await requireAdminFresh();
  } catch {
    redirect(
      "/login?portal=admin"
    );
  }

  return children;
}
