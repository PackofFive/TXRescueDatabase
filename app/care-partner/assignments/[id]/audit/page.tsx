"use client";

import { useParams } from "next/navigation";
import CarePartnerAssignmentAudit from "@/app/components/CarePartnerAssignmentAudit";

export default function Page() {
  const params = useParams<{ id: string }>();
  return <section style={{ maxWidth: 900, margin: "0 auto", padding: "8px 0 44px" }}>
    <a href="/care-partner/assignments" style={{ color: "#E85C56", fontWeight: 800, textDecoration: "none" }}>← Back to assigned work</a>
    <p style={{ margin: "24px 0 7px", color: "#E85C56", fontSize: 12, fontWeight: 800, letterSpacing: ".1em" }}>PERMANENT ACCESS HISTORY</p>
    <h1 style={{ margin: "0 0 8px", color: "#1E3A5F", fontSize: "clamp(30px, 5vw, 44px)" }}>Assignment Audit History</h1>
    <p style={{ color: "#4A5D75", lineHeight: 1.6 }}>This history records important access and activity events for this assignment. It does not expose unrelated organization activity.</p>
    <CarePartnerAssignmentAudit assignmentId={params.id} />
  </section>;
}
