"use client";

import { useParams } from "next/navigation";
import CarePartnerAssignmentDocuments from "@/app/components/CarePartnerAssignmentDocuments";

export default function Page() {
  const params = useParams<{ id: string }>();
  return <section style={{ maxWidth: 900, margin: "0 auto", padding: "8px 0 44px" }}>
    <a href={`/care-partner/assignments/${params.id}`} style={{ color: "#E85C56", fontWeight: 800, textDecoration: "none" }}>← Back to assigned work</a>
    <p style={{ margin: "24px 0 7px", color: "#E85C56", fontSize: 12, fontWeight: 800, letterSpacing: ".1em" }}>PRIVATE ASSIGNMENT FILES</p>
    <h1 style={{ margin: 0, color: "#1E3A5F", fontSize: "clamp(30px, 5vw, 44px)" }}>Care Partner Documents</h1>
    <p style={{ color: "#4A5D75", lineHeight: 1.6 }}>Upload only documents related to this authorized assignment. The animal’s rescue or shelter retains these records after the assignment ends.</p>
    <CarePartnerAssignmentDocuments assignmentId={params.id} canUpload />
  </section>;
}
