"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type Relationship = {
  id: string;
  foster_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  availability_status: string;
  transport_available: boolean;
  status: string;
  access_level: string;
  created_at: string;
  approved_at: string | null;
};

type Invitation = {
  id: string;
  invited_email: string;
  invited_name: string | null;
  status: string;
  expires_at: string;
  created_at: string;
};

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  pink: "#FBEFF1",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
};

export default function FosterManagementPage() {
  const [
    relationships,
    setRelationships,
  ] =
    useState<
      Relationship[]
    >([]);

  const [
    invitations,
    setInvitations,
  ] =
    useState<
      Invitation[]
    >([]);

  const [
    name,
    setName,
  ] =
    useState("");

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    inviteUrl,
    setInviteUrl,
  ] =
    useState<
      string | null
    >(null);

  const [
    copied,
    setCopied,
  ] =
    useState(false);

  const [
    workingRelationshipId,
    setWorkingRelationshipId,
  ] =
    useState<
      string | null
    >(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const res =
        await fetch(
          "/api/fosters/invitations",
          {
            cache:
              "no-store",
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't load foster records."
        );
      }

      setRelationships(
        data.relationships ??
          []
      );

      setInvitations(
        data.invitations ??
          []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load foster records."
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitInvite(
    e:
      React.FormEvent
  ) {
    e.preventDefault();

    setSubmitting(true);
    setError(null);
    setInviteUrl(null);
    setCopied(false);

    try {
      const res =
        await fetch(
          "/api/fosters/invitations",
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                name,
                email,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't create invitation."
        );
      }

      setInviteUrl(
        data.inviteUrl
      );

      setName("");
      setEmail("");

      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't create invitation."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function copyInvite() {
    if (!inviteUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        inviteUrl
      );

      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function reviewRelationship(
    relationshipId: string,
    action:
      | "approve"
      | "decline"
  ) {
    setWorkingRelationshipId(
      relationshipId
    );

    setError(null);

    try {
      const res =
        await fetch(
          "/api/fosters/invitations",
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                relationshipId,
                action,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't update foster relationship."
        );
      }

      setRelationships(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              relationshipId
                ? {
                    ...item,
                    status:
                      action ===
                      "approve"
                        ? "approved"
                        : "declined",
                  }
                : item
          )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't update foster relationship."
      );
    } finally {
      setWorkingRelationshipId(
        null
      );
    }
  }

  const approvedCount =
    useMemo(
      () =>
        relationships.filter(
          (item) =>
            item.status ===
            "approved"
        ).length,
      [relationships]
    );

  const pendingCount =
    useMemo(
      () =>
        relationships.filter(
          (item) =>
            [
              "invited",
              "applied",
              "pending",
            ].includes(
              item.status
            )
        ).length,
      [relationships]
    );

  return (
    <section>
      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          gap:
            16,
          flexWrap:
            "wrap",
          marginBottom:
            22,
        }}
      >
        <div>
          <p
            style={{
              margin:
                0,
              color:
                COLORS.coral,
              fontSize:
                11.5,
              fontWeight:
                800,
              letterSpacing:
                ".1em",
              textTransform:
                "uppercase",
            }}
          >
            Rescue Manager
          </p>

          <h1
            style={{
              margin:
                "6px 0 6px",
              color:
                COLORS.navy,
              fontSize:
                28,
            }}
          >
            Fosters
          </h1>

          <p
            style={{
              margin:
                0,
              color:
                COLORS.muted,
              fontSize:
                13.5,
              lineHeight:
                1.5,
              maxWidth:
                700,
            }}
          >
            Invite fosters and manage
            rescue-specific foster
            relationships.
          </p>
        </div>
      </div>

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(150px, 1fr))",
          gap:
            10,
          marginBottom:
            18,
        }}
      >
        <StatCard
          value={
            approvedCount
          }
          label="Approved Fosters"
        />

        <StatCard
          value={
            pendingCount
          }
          label="Pending / Invited"
        />

        <StatCard
          value={
            invitations.filter(
              (item) =>
                item.status ===
                "pending"
            ).length
          }
          label="Open Invitations"
        />
      </div>

      <form
        onSubmit={
          submitInvite
        }
        style={{
          background:
            COLORS.mint,
          padding:
            16,
          marginBottom:
            18,
        }}
      >
        <strong
          style={{
            display:
              "block",
            color:
              COLORS.navy,
            marginBottom:
              4,
          }}
        >
          Invite a Foster
        </strong>

        <p
          style={{
            margin:
              "0 0 12px",
            color:
              COLORS.muted,
            fontSize:
              12.5,
          }}
        >
          Create a secure invitation
          link to send to a foster.
        </p>

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap:
              10,
        }}
        >
          <input
            value={
              name
            }
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="Foster name"
            style={
              inputStyle
            }
          />

          <input
            value={
              email
            }
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="Email *"
            type="email"
            required
            style={
              inputStyle
            }
          />
        </div>

        <button
          type="submit"
          disabled={
            submitting
          }
          style={{
            ...primaryButton,
            marginTop:
              10,
            opacity:
              submitting
                ? 0.65
                : 1,
          }}
        >
          {submitting
            ? "Creating…"
            : "Create Invitation"}
        </button>

        {inviteUrl && (
          <div
            style={{
              marginTop:
                12,
              background:
                COLORS.white,
              border:
                `1px solid ${COLORS.border}`,
              padding:
                10,
            }}
          >
            <div
              style={{
                color:
                  COLORS.muted,
                fontSize:
                  11.5,
                marginBottom:
                  5,
              }}
            >
              Invitation created.
              Copy this link and send
              it to the foster:
            </div>

            <div
              style={{
                display:
                  "flex",
                gap:
                  8,
                alignItems:
                  "center",
                flexWrap:
                  "wrap",
              }}
            >
              <code
                style={{
                  flex:
                    1,
                  minWidth:
                    220,
                  overflowWrap:
                    "anywhere",
                  fontSize:
                    11.5,
                  color:
                    COLORS.navy,
                }}
              >
                {inviteUrl}
              </code>

              <button
                type="button"
                onClick={
                  copyInvite
                }
                style={
                  secondaryButton
                }
              >
                {copied
                  ? "Copied"
                  : "Copy Link"}
              </button>
            </div>
          </div>
        )}
      </form>

      {error && (
        <div
          style={{
            background:
              "#FFF4F2",
            border:
              "1px solid #F3C7BF",
            color:
              "#B23B2E",
            padding:
              11,
            marginBottom:
              15,
            fontSize:
              13,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          background:
            COLORS.white,
          border:
            `1px solid ${COLORS.border}`,
        }}
      >
        <div
          style={{
            padding:
              "13px 15px",
            borderBottom:
              `1px solid ${COLORS.border}`,
          }}
        >
          <strong
            style={{
              color:
                COLORS.navy,
            }}
          >
            Foster Relationships
          </strong>
        </div>

        {loading ? (
          <p
            style={{
              padding:
                15,
              margin:
                0,
              color:
                COLORS.muted,
            }}
          >
            Loading…
          </p>
        ) : relationships.length ===
          0 ? (
          <p
            style={{
              padding:
                15,
              margin:
                0,
              color:
                COLORS.muted,
              fontSize:
                13,
            }}
          >
            No foster relationships
            yet.
          </p>
        ) : (
          relationships.map(
            (item) => (
              <div
                key={
                  item.id
                }
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "minmax(180px, 1fr) minmax(160px, .8fr) minmax(210px, auto)",
                  gap:
                    12,
                  alignItems:
                    "center",
                  padding:
                    "12px 15px",
                  borderBottom:
                    `1px solid ${COLORS.border}`,
                }}
              >
                <div>
                  <strong
                    style={{
                      color:
                        COLORS.navy,
                      fontSize:
                        13.5,
                    }}
                  >
                    {
                      item.full_name
                    }
                  </strong>

                  <div
                    style={{
                      marginTop:
                        2,
                      color:
                        COLORS.muted,
                      fontSize:
                        11.5,
                    }}
                  >
                    {item.email ??
                      "No email"}
                  </div>
                </div>

                <div
                  style={{
                    color:
                      COLORS.muted,
                    fontSize:
                      12,
                  }}
                >
                  {[
                    item.city,
                    item.state,
                  ]
                    .filter(
                      Boolean
                    )
                    .join(
                      ", "
                    ) ||
                    "Location not recorded"}
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "flex-end",
                    gap:
                      7,
                    flexWrap:
                      "wrap",
                  }}
                >
                  <StatusBadge
                    value={
                      item.status
                    }
                  />

                  {item.status ===
                    "pending" && (
                    <>
                      <button
                        type="button"
                        disabled={
                          workingRelationshipId ===
                          item.id
                        }
                        onClick={() =>
                          reviewRelationship(
                            item.id,
                            "approve"
                          )
                        }
                        style={{
                          ...smallApproveButton,
                          opacity:
                            workingRelationshipId ===
                            item.id
                              ? 0.6
                              : 1,
                        }}
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        disabled={
                          workingRelationshipId ===
                          item.id
                        }
                        onClick={() =>
                          reviewRelationship(
                            item.id,
                            "decline"
                          )
                        }
                        style={{
                          ...smallDeclineButton,
                          opacity:
                            workingRelationshipId ===
                            item.id
                              ? 0.6
                              : 1,
                        }}
                      >
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          )
        )}
      </div>
    </section>
  );
}

function StatCard({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div
      style={{
        background:
          COLORS.white,
        border:
          `1px solid ${COLORS.border}`,
        padding:
          13,
      }}
    >
      <strong
        style={{
          display:
            "block",
          color:
            COLORS.navy,
          fontSize:
            22,
        }}
      >
        {value}
      </strong>

      <span
        style={{
          display:
            "block",
          marginTop:
            3,
          color:
            COLORS.muted,
          fontSize:
            11.5,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function StatusBadge({
  value,
}: {
  value: string;
}) {
  const background =
    value ===
      "approved"
      ? COLORS.mint
      : value ===
          "declined" ||
        value ===
          "inactive"
      ? "#F3F1EF"
      : COLORS.pink;

  return (
    <span
      style={{
        display:
          "inline-block",
        background,
        color:
          COLORS.navy,
        padding:
          "4px 8px",
        fontSize:
          11,
        fontWeight:
          750,
        textTransform:
          "capitalize",
        whiteSpace:
          "nowrap",
      }}
    >
      {value}
    </span>
  );
}

const smallApproveButton:
  React.CSSProperties =
{
  border:
    "none",
  background:
    COLORS.navy,
  color:
    "#fff",
  padding:
    "6px 9px",
  fontWeight:
    800,
  fontSize:
    11,
  cursor:
    "pointer",
};

const smallDeclineButton:
  React.CSSProperties =
{
  border:
    "1px solid #E8C8C2",
  background:
    "#fff",
  color:
    "#B23B2E",
  padding:
    "5px 9px",
  fontWeight:
    800,
  fontSize:
    11,
  cursor:
    "pointer",
};

const inputStyle:
  React.CSSProperties =
{
  width:
    "100%",
  boxSizing:
    "border-box",
  border:
    `1px solid ${COLORS.border}`,
  padding:
    "9px 10px",
  background:
    "#fff",
  color:
    "#1C1B19",
  fontFamily:
    "inherit",
};

const primaryButton:
  React.CSSProperties =
{
  border:
    "none",
  background:
    COLORS.navy,
  color:
    "#fff",
  padding:
    "9px 13px",
  fontWeight:
    800,
  fontSize:
    12.5,
  cursor:
    "pointer",
};

const secondaryButton:
  React.CSSProperties =
{
  border:
    `1px solid ${COLORS.border}`,
  background:
    "#fff",
  color:
    COLORS.navy,
  padding:
    "7px 10px",
  fontWeight:
    750,
  fontSize:
    11.5,
  cursor:
    "pointer",
};
