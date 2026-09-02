"use client";

export const runtime = "edge";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CAPABILITY_FIELDS,
  CAPABILITY_STATUSES,
  RESOURCE_STATUS_OPTIONS,
} from "@/lib/constants";

type OrgRecord = Record<string, unknown>;

const ORG_TEXT_FIELDS: {
  key: string;
  label: string;
  type?: string;
}[] = [
  { key: "name", label: "Organization name" },
  { key: "org_type", label: "Organization type" },
  { key: "focus", label: "Focus" },
  { key: "specialty", label: "Specialty" },
  { key: "c3_status", label: "501(c)(3) status" },
  { key: "city", label: "City" },
  { key: "county", label: "County" },
  { key: "state", label: "State" },
  { key: "service_area", label: "Service area" },
  { key: "region", label: "Region" },
  { key: "statewide", label: "Statewide (Yes/No/Unclear)" },
  { key: "intake_status", label: "Current intake status" },
  { key: "intake_restrictions", label: "Intake restrictions" },
  { key: "intake_form_url", label: "Intake form URL" },
  { key: "website", label: "Website" },
  { key: "social_media", label: "Social media" },
  { key: "public_email", label: "Public email" },
  { key: "public_phone", label: "Public phone" },
  { key: "last_verified", label: "Last verified", type: "date" },
  { key: "notes", label: "Notes" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  border: "1px solid #E7E5E1",
  borderRadius: 6,
  fontSize: 13.5,
  fontFamily: "inherit",
  color: "#1C1B19",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11.5,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "#6B6862",
  marginBottom: 4,
};

export default function AdminOrgEditPage() {
  const params = useParams();
  const orgId = params?.id as string;

  const [original, setOriginal] =
    useState<OrgRecord | null>(null);

  const [form, setForm] =
    useState<Record<string, string>>({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [adminActionLoading, setAdminActionLoading] =
    useState(false);

  const [adminActionError, setAdminActionError] =
    useState<string | null>(null);

  const [ownerRequestConfirmed, setOwnerRequestConfirmed] =
    useState(false);
  const [supportReference, setSupportReference] =
    useState("");
  const [assistanceReason, setAssistanceReason] =
    useState("");
  const [lifecycleType, setLifecycleType] =
    useState("possible_dormancy");
  const [lifecycleReason, setLifecycleReason] =
    useState("");
  const [closureConfirmed, setClosureConfirmed] =
    useState(false);
  const [lifecycleDecision, setLifecycleDecision] =
    useState("");
  const [archiveConfirmation, setArchiveConfirmation] =
    useState("");

  /* =====================================================
     LOAD ORGANIZATION
  ===================================================== */

  useEffect(() => {
    if (!orgId) return;

    fetch(
      `/api/admin/orgs/${encodeURIComponent(orgId)}`
    )
      .then(async (r) => {
        const data = await r.json();

        if (!r.ok) {
          throw new Error(
            data.error ??
              "Failed to load organization."
          );
        }

        const org =
          data.organization as OrgRecord;

        setOriginal(org);

        const initial:
          Record<string, string> = {};

        for (const f of ORG_TEXT_FIELDS) {
          const v = org[f.key];

          initial[f.key] =
            f.key === "last_verified" && v
              ? String(v).slice(0, 10)
              : v != null
                ? String(v)
                : "";
        }

        initial.resource_status =
          org.resource_status != null
            ? String(org.resource_status)
            : RESOURCE_STATUS_OPTIONS[0] ??
              "";

        initial.species =
          Array.isArray(org.species)
            ? (
                org.species as string[]
              ).join(", ")
            : "";

        for (const f of CAPABILITY_FIELDS) {
          initial[f.key] =
            (org[f.key] as string) ||
            "Unknown";
        }

        setForm(initial);
      })
      .catch((e) => {
        setError(
          e instanceof Error
            ? e.message
            : "Failed to load organization."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orgId]);

  function setField(
    key: string,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  /* =====================================================
     SAVE NORMAL EDITS
  ===================================================== */

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!original) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    const changes: {
      table: string;
      field: string;
      newValue: string;
    }[] = [];

    for (const f of ORG_TEXT_FIELDS) {
      const originalValue =
        original[f.key] != null
          ? String(original[f.key])
          : "";

      const compareOriginal =
        f.key === "last_verified"
          ? originalValue.slice(0, 10)
          : originalValue;

      if (
        (form[f.key] ?? "") !==
        compareOriginal
      ) {
        changes.push({
          table: "organizations",
          field: f.key,
          newValue:
            form[f.key] ?? "",
        });
      }
    }

    const originalResourceStatus =
      original.resource_status != null
        ? String(
            original.resource_status
          )
        : RESOURCE_STATUS_OPTIONS[0] ??
          "";

    if (
      (form.resource_status ?? "") !==
      originalResourceStatus
    ) {
      changes.push({
        table: "organizations",
        field: "resource_status",
        newValue:
          form.resource_status ?? "",
      });
    }

    const originalSpecies =
      Array.isArray(original.species)
        ? (
            original.species as string[]
          ).join(", ")
        : "";

    if (
      (form.species ?? "") !==
      originalSpecies
    ) {
      changes.push({
        table: "organizations",
        field: "species",
        newValue:
          form.species ?? "",
      });
    }

    for (
      const f of CAPABILITY_FIELDS
    ) {
      const originalValue =
        (original[f.key] as string) ||
        "Unknown";

      if (
        (form[f.key] ?? "Unknown") !==
        originalValue
      ) {
        changes.push({
          table: "capabilities",
          field: f.key,
          newValue:
            form[f.key] ?? "Unknown",
        });
      }
    }

    if (changes.length === 0) {
      setMessage(
        "No changes to save."
      );

      setSaving(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/admin/orgs/${encodeURIComponent(
          orgId
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            changes,
            adminAssistance: {
              ownerRequestConfirmed,
              supportReference,
              reason: assistanceReason,
            },
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Failed to save changes."
        );
      }

      setMessage(
        `Saved ${changes.length} field(s).`
      );

      setOriginal((prev) => {
        if (!prev) return prev;

        const next = { ...prev };

        for (const c of changes) {
          if (
            c.field === "species"
          ) {
            next[c.field] =
              c.newValue
                .split(",")
                .map((s) =>
                  s.trim()
                )
                .filter(Boolean);
          } else {
            next[c.field] =
              c.newValue;
          }
        }

        return next;
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =====================================================
     ARCHIVE / RESTORE
  ===================================================== */

  async function handleArchiveAction(
    action: "archive" | "restore"
  ) {
    if (!original) return;

    const orgName =
      String(
        original.name ??
          "this organization"
      );

    if (action === "archive") {
      const confirmed =
        window.confirm(
          `Archive ${orgName}?\n\nIt will be removed from the active public directory, but its records and history will be preserved.`
        );

      if (!confirmed) return;
    }

    setAdminActionLoading(true);
    setAdminActionError(null);

    try {
      const res = await fetch(
        `/api/admin/orgs/${encodeURIComponent(
          orgId
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            action,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            `Couldn't ${action} organization.`
        );
      }

      window.location.reload();
    } catch (err) {
      setAdminActionError(
        err instanceof Error
          ? err.message
          : `Couldn't ${action} organization.`
      );

      setAdminActionLoading(false);
    }
  }

  /* =====================================================
     PERMANENT DELETE
  ===================================================== */

  async function handleDelete() {
    if (!original) return;

    const orgName =
      String(original.name);

    const expected =
      `DELETE ${orgName}`;

    const typed =
      window.prompt(
        `PERMANENT DELETE\n\nThis should only be used for test or accidental organizations.\n\nThis cannot be undone.\n\nType exactly:\n${expected}`
      );

    if (typed === null) {
      return;
    }

    if (typed !== expected) {
      setAdminActionError(
        "Organization was not deleted because the confirmation text did not match."
      );

      return;
    }

    setAdminActionLoading(true);
    setAdminActionError(null);

    try {
      const res = await fetch(
        `/api/admin/orgs/${encodeURIComponent(
          orgId
        )}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        let errorMessage =
          data.error ??
          "Couldn't delete organization.";

        if (data.dependencies) {
          const dependencies =
            data.dependencies;

          const details = [
            dependencies.users
              ? `${dependencies.users} user(s)`
              : null,

            dependencies.animals
              ? `${dependencies.animals} animal(s)`
              : null,

            dependencies.organizationRequests
              ? `${dependencies.organizationRequests} organization request(s)`
              : null,
          ]
            .filter(Boolean)
            .join(", ");

          if (details) {
            errorMessage +=
              ` Linked records: ${details}.`;
          }
        }

        throw new Error(
          errorMessage
        );
      }

      window.location.href =
        "/admin/orgs";
    } catch (err) {
      setAdminActionError(
        err instanceof Error
          ? err.message
          : "Couldn't delete organization."
      );

      setAdminActionLoading(false);
    }
  }

  async function handleLifecycleAction(action:string, extra:Record<string,unknown>={}) {
    setAdminActionLoading(true);
    setAdminActionError(null);
    try {
      const res=await fetch(`/api/admin/orgs/${encodeURIComponent(orgId)}`,{
        method:"PATCH",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action,...extra})
      });
      const data=await res.json();
      if(!res.ok)throw new Error(data.error??"The lifecycle review could not be updated.");
      window.location.reload();
    }catch(err){
      setAdminActionError(err instanceof Error?err.message:"The lifecycle review could not be updated.");
      setAdminActionLoading(false);
    }
  }

  /* =====================================================
     PAGE STATES
  ===================================================== */

  if (loading) {
    return <p>Loading…</p>;
  }

  if (
    error &&
    !original
  ) {
    return (
      <p
        style={{
          color: "#B23B2E",
        }}
      >
        {error}
      </p>
    );
  }

  if (!original) {
    return null;
  }

  const archived =
    Boolean(
      original.archived_at
    );

  const claimed = Boolean(original.has_active_owner);
  const lifecycleReview = original.lifecycle_review && typeof original.lifecycle_review === "object"
    ? original.lifecycle_review as Record<string,unknown> : null;
  const lifecycleOpen = lifecycleReview && (lifecycleReview.status === "waiting_owner" || lifecycleReview.status === "ready_decision");
  const assistanceUnlocked = !claimed || (
    ownerRequestConfirmed &&
    supportReference.trim().length >= 3 &&
    assistanceReason.trim().length >= 20
  );

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div
      style={{
        maxWidth: 640,
      }}
    >
      <a
        href="/admin/orgs"
        style={{
          fontSize: 12.5,
          color: "#C05621",
          textDecoration: "none",
        }}
      >
        ← Back to organization list
      </a>

      <h1
        style={{
          fontSize: 20,
          marginTop: 8,
        }}
      >
        {String(
          original.name
        )}
      </h1>

      {archived && (
        <div
          style={{
            background:
              "#FFF4E8",
            border:
              "1px solid #E6C59D",
            borderRadius: 6,
            padding:
              "9px 12px",
            marginBottom: 16,
            fontSize: 13,
            color: "#744B20",
            fontWeight: 600,
          }}
        >
          This organization is
          archived.
        </div>
      )}

      {claimed ? (
        <section style={{background:"#F2D6DC",padding:16,marginBottom:20,border:"1px solid #E8BCC6"}}>
          <strong style={{color:"#1E3A5F"}}>Owner-controlled organization</strong>
          <p style={{color:"#1E3A5F",fontSize:13.5,lineHeight:1.5,margin:"7px 0 12px"}}>
            This profile is read-only to platform administrators by default. Only unlock it to provide specifically requested assistance to the current owner. Every change is permanently audited.
          </p>
          <label style={{display:"block",fontSize:12,fontWeight:700,marginBottom:9}}>
            <input type="checkbox" checked={ownerRequestConfirmed} onChange={e=>setOwnerRequestConfirmed(e.target.checked)}/> The current owner asked Pack of Five to make this change
          </label>
          <label style={labelStyle}>Support request or case reference</label>
          <input value={supportReference} onChange={e=>setSupportReference(e.target.value)} placeholder="Example: email date or case number" style={{...inputStyle,marginBottom:10}}/>
          <label style={labelStyle}>Specific reason for administrator assistance</label>
          <textarea value={assistanceReason} onChange={e=>setAssistanceReason(e.target.value)} rows={3} placeholder="Explain what the owner requested and why administrator assistance is necessary." style={inputStyle}/>
          <p style={{fontSize:12,color:"#6B6862",margin:"9px 0 0"}}>{assistanceUnlocked?"Editing is temporarily unlocked for this save.":"Complete all three items to unlock the form."}</p>
        </section>
      ) : (
        <p style={{color:"#6B6862",fontSize:13.5,marginBottom:20}}>This organization has no active owner. Administrator changes are still recorded in the update history.</p>
      )}

      {/* ================================================
          EDIT FORM
      ================================================= */}

      <form
        onSubmit={
          handleSubmit
        }
      >
        <fieldset disabled={!assistanceUnlocked} style={{border:0,padding:0,margin:0,minWidth:0}}>
        <div
          style={{
            fontSize: 11.5,
            textTransform:
              "uppercase",
            letterSpacing:
              "0.06em",
            color: "#6B6862",
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          Profile
        </div>

        {ORG_TEXT_FIELDS.map(
          (f) => (
            <div
              key={f.key}
              style={{
                marginBottom: 12,
              }}
            >
              <label
                style={
                  labelStyle
                }
              >
                {f.label}
              </label>

              {f.key ===
                "notes" ||
              f.key ===
                "intake_restrictions" ? (
                <textarea
                  rows={3}
                  value={
                    form[
                      f.key
                    ] ?? ""
                  }
                  onChange={(
                    e
                  ) =>
                    setField(
                      f.key,
                      e.target
                        .value
                    )
                  }
                  style={
                    inputStyle
                  }
                />
              ) : (
                <input
                  type={
                    f.type ??
                    "text"
                  }
                  value={
                    form[
                      f.key
                    ] ?? ""
                  }
                  onChange={(
                    e
                  ) =>
                    setField(
                      f.key,
                      e.target
                        .value
                    )
                  }
                  style={
                    inputStyle
                  }
                />
              )}
            </div>
          )
        )}

        <div
          style={{
            marginBottom: 12,
          }}
        >
          <label
            style={labelStyle}
          >
            Species
            (comma-separated,
            e.g. Dog, Cat)
          </label>

          <input
            value={
              form.species ??
              ""
            }
            onChange={(e) =>
              setField(
                "species",
                e.target.value
              )
            }
            style={
              inputStyle
            }
          />
        </div>

        <div
          style={{
            marginBottom: 12,
          }}
        >
          <label
            style={labelStyle}
          >
            Resource status
          </label>

          <select
            value={
              form.resource_status ??
              RESOURCE_STATUS_OPTIONS[0] ??
              ""
            }
            onChange={(e) =>
              setField(
                "resource_status",
                e.target.value
              )
            }
            style={
              inputStyle
            }
          >
            {RESOURCE_STATUS_OPTIONS.map(
              (s) => (
                <option
                  key={s}
                  value={s}
                >
                  {s}
                </option>
              )
            )}
          </select>
        </div>

        <div
          style={{
            fontSize: 11.5,
            textTransform:
              "uppercase",
            letterSpacing:
              "0.06em",
            color: "#6B6862",
            fontWeight: 600,
            margin:
              "24px 0 10px",
          }}
        >
          Capabilities
        </div>

        {CAPABILITY_FIELDS.map(
          (f) => (
            <div
              key={f.key}
              style={{
                marginBottom: 10,
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                gap: 12,
              }}
            >
              <label
                style={{
                  fontSize: 13,
                  flex: 1,
                }}
              >
                {f.label}
              </label>

              <select
                value={
                  form[
                    f.key
                  ] ??
                  "Unknown"
                }
                onChange={(
                  e
                ) =>
                  setField(
                    f.key,
                    e.target
                      .value
                  )
                }
                style={{
                  ...inputStyle,
                  width: 160,
                }}
              >
                {CAPABILITY_STATUSES.map(
                  (s) => (
                    <option
                      key={s}
                      value={s}
                    >
                      {s}
                    </option>
                  )
                )}
              </select>
            </div>
          )
        )}

        <div
          style={{
            marginTop: 20,
          }}
        >
          <button
            type="submit"
            disabled={saving}
            style={{
              padding:
                "9px 18px",
              background:
                "#1C1B19",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              cursor: saving
                ? "default"
                : "pointer",
              opacity:
                saving
                  ? 0.6
                  : 1,
            }}
          >
            {saving
              ? "Saving…"
              : "Save changes"}
          </button>

          {message && (
            <span
              style={{
                marginLeft: 12,
                fontSize: 13,
                color:
                  "#2F6F4E",
              }}
            >
              {message}
            </span>
          )}

          {error && (
            <span
              style={{
                marginLeft: 12,
                fontSize: 13,
                color:
                  "#B23B2E",
              }}
            >
              {error}
            </span>
          )}
        </div>
        </fieldset>
      </form>

      {/* ================================================
          ADMIN ACTIONS
      ================================================= */}

      <section
        style={{
          marginTop: 42,
          paddingTop: 24,
          borderTop:
            "1px solid #E7E5E1",
        }}
      >
        <div
          style={{
            fontSize: 11.5,
            textTransform:
              "uppercase",
            letterSpacing:
              "0.06em",
            color: "#B23B2E",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Admin Actions
        </div>

        {claimed && (
          <div style={{border:"1px solid #E6C59D",background:"#FFF9F1",padding:16,marginBottom:22}}>
            <h2 style={{fontSize:17,margin:"0 0 8px",color:"#17233C"}}>Documented closure or dormancy review</h2>
            {lifecycleOpen ? (
              <div>
                <p style={{fontSize:13,lineHeight:1.5,color:"#6B6862"}}><strong>Status:</strong> {String(lifecycleReview.status).replaceAll("_"," ")}<br/><strong>Review:</strong> {String(lifecycleReview.review_type).replaceAll("_"," ")}<br/><strong>Owner response due:</strong> {new Date(String(lifecycleReview.response_due_at)).toLocaleDateString()}<br/><strong>Reason:</strong> {String(lifecycleReview.reason)}</p>
                {!lifecycleReview.owner_response_received_at&&<button type="button" disabled={adminActionLoading} onClick={()=>handleLifecycleAction("record_lifecycle_response",{reviewId:lifecycleReview.id})}>Record owner response</button>}
                <label style={{...labelStyle,marginTop:14}}>Final decision reason</label>
                <textarea rows={3} value={lifecycleDecision} onChange={e=>setLifecycleDecision(e.target.value)} style={inputStyle} placeholder="Explain the verified closure or completed dormancy review."/>
                <label style={{...labelStyle,marginTop:10}}>Type ARCHIVE to confirm</label>
                <input value={archiveConfirmation} onChange={e=>setArchiveConfirmation(e.target.value)} style={inputStyle}/>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>
                  <button type="button" disabled={adminActionLoading} onClick={()=>handleLifecycleAction("complete_lifecycle_review",{reviewId:lifecycleReview.id,reason:lifecycleDecision,confirmation:archiveConfirmation})}>Archive after completed review</button>
                  <button type="button" disabled={adminActionLoading} onClick={()=>handleLifecycleAction("cancel_lifecycle_review",{reviewId:lifecycleReview.id,reason:lifecycleDecision})}>Cancel review</button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{fontSize:13,lineHeight:1.5,color:"#6B6862"}}>Starting a review does not archive the listing. The owner is notified first. Possible dormancy uses a 30-day response period; owner-requested closure uses 7 days.</p>
                <label style={labelStyle}>Review type</label>
                <select value={lifecycleType} onChange={e=>setLifecycleType(e.target.value)} style={{...inputStyle,marginBottom:10}}><option value="possible_dormancy">Possible prolonged dormancy</option><option value="owner_requested_closure">Owner-requested closure</option></select>
                {lifecycleType==="owner_requested_closure"&&<label style={{display:"block",fontSize:12,fontWeight:700,marginBottom:10}}><input type="checkbox" checked={closureConfirmed} onChange={e=>setClosureConfirmed(e.target.checked)}/> I confirmed this closure request came from the active owner</label>}
                <label style={labelStyle}>Reason and supporting facts</label>
                <textarea rows={3} value={lifecycleReason} onChange={e=>setLifecycleReason(e.target.value)} style={inputStyle} placeholder="Document the closure request or the signs of prolonged dormancy."/>
                <button type="button" disabled={adminActionLoading} onClick={()=>handleLifecycleAction("start_lifecycle_review",{reviewType:lifecycleType,reason:lifecycleReason,ownerRequestConfirmed:closureConfirmed})} style={{marginTop:10}}>Start review and notify owner</button>
              </div>
            )}
          </div>
        )}

        <h2
          style={{
            fontSize: 17,
            margin:
              "0 0 8px",
            color: "#17233C",
          }}
        >
          Archive or delete
          organization
        </h2>

        <p
          style={{
            color: "#6B6862",
            fontSize: 13,
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          Archive real
          organizations when
          they should no longer
          appear in the active
          directory. Permanent
          deletion should only
          be used for test,
          duplicate, or
          accidental records
          that have no linked
          operational history.
          {claimed && " Claimed organizations must use a documented closure or dormant-organization review case instead."}
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {archived ? (
            <button
              type="button"
              disabled={
                adminActionLoading || claimed
              }
              onClick={() =>
                handleArchiveAction(
                  "restore"
                )
              }
              style={{
                padding:
                  "9px 14px",
                border:
                  "1px solid #2F6F4E",
                borderRadius: 6,
                background:
                  "#fff",
                color:
                  "#2F6F4E",
                fontWeight: 600,
                cursor:
                  adminActionLoading
                    ? "default"
                    : "pointer",
                opacity:
                  adminActionLoading
                    ? 0.6
                    : 1,
              }}
            >
              Restore
              Organization
            </button>
          ) : (
            <button
              type="button"
              disabled={
                adminActionLoading || claimed
              }
              onClick={() =>
                handleArchiveAction(
                  "archive"
                )
              }
              style={{
                padding:
                  "9px 14px",
                border:
                  "1px solid #C58A42",
                borderRadius: 6,
                background:
                  "#fff",
                color:
                  "#85571F",
                fontWeight: 600,
                cursor:
                  adminActionLoading
                    ? "default"
                    : "pointer",
                opacity:
                  adminActionLoading
                    ? 0.6
                    : 1,
              }}
            >
              Archive
              Organization
            </button>
          )}

          <button
            type="button"
            disabled={
              adminActionLoading || claimed
            }
            onClick={
              handleDelete
            }
            style={{
              padding:
                "9px 14px",
              border:
                "1px solid #B23B2E",
              borderRadius: 6,
              background:
                "#fff",
              color:
                "#B23B2E",
              fontWeight: 600,
              cursor:
                adminActionLoading
                  ? "default"
                  : "pointer",
              opacity:
                adminActionLoading
                  ? 0.6
                  : 1,
            }}
          >
            Permanently Delete
          </button>
        </div>

        {adminActionLoading && (
          <p
            style={{
              marginTop: 10,
              fontSize: 13,
              color:
                "#6B6862",
            }}
          >
            Processing…
          </p>
        )}

        {adminActionError && (
          <div
            style={{
              marginTop: 12,
              padding: 10,
              background:
                "#FFF4F2",
              border:
                "1px solid #F3C7BF",
              borderRadius: 6,
              color:
                "#B23B2E",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {adminActionError}
          </div>
        )}
      </section>
    </div>
  );
}
