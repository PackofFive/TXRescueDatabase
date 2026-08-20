"use client";

import { useState } from "react";

export default function OrganizationDangerZone({
  orgId,
  orgName,
  archivedAt,
}: {
  orgId: string;
  orgName: string;
  archivedAt: string | null;
}) {
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function archiveOrRestore(action: "archive" | "restore") {
    setWorking(true);
    setMessage(null);

    const res = await fetch(`/api/admin/orgs/${encodeURIComponent(orgId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error ?? "Couldn't update organization.");
      setWorking(false);
      return;
    }

    window.location.reload();
  }

  async function permanentlyDelete() {
    const expected = `DELETE ${orgName}`;
    const typed = window.prompt(
      `Permanent deletion cannot be undone.\n\nType exactly:\n${expected}`
    );

    if (typed !== expected) return;

    setWorking(true);
    setMessage(null);

    const res = await fetch(`/api/admin/orgs/${encodeURIComponent(orgId)}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      let msg = data.error ?? "Couldn't delete organization.";
      if (data.dependencies) {
        msg += ` Linked records — users: ${data.dependencies.users}, animals: ${data.dependencies.animals}, claims: ${data.dependencies.claims}, requests: ${data.dependencies.organizationRequests}.`;
      }
      setMessage(msg);
      setWorking(false);
      return;
    }

    window.location.href = "/admin/orgs";
  }

  return (
    <section
      style={{
        marginTop: 36,
        paddingTop: 22,
        borderTop: "1px solid #E7E5E1",
      }}
    >
      <h2 style={{ fontSize: 16, color: "#7A2E25" }}>
        Admin Actions
      </h2>

      <p style={{ fontSize: 13, color: "#6B6862", lineHeight: 1.5 }}>
        Archive organizations that have history in Pack of Five. Permanent delete
        is intended only for accidental or test organizations with no important
        linked records.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {archivedAt ? (
          <button
            type="button"
            disabled={working}
            onClick={() => archiveOrRestore("restore")}
          >
            Restore Organization
          </button>
        ) : (
          <button
            type="button"
            disabled={working}
            onClick={() => archiveOrRestore("archive")}
          >
            Archive Organization
          </button>
        )}

        <button
          type="button"
          disabled={working}
          onClick={permanentlyDelete}
          style={{
            border: "1px solid #B23B2E",
            color: "#B23B2E",
            background: "#fff",
            borderRadius: 6,
            padding: "8px 12px",
            fontWeight: 700,
          }}
        >
          Permanently Delete
        </button>
      </div>

      {message && (
        <p style={{ color: "#B23B2E", fontSize: 13, marginTop: 10 }}>
          {message}
        </p>
      )}
    </section>
  );
}
