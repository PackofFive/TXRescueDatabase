"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type Offer = {
  id: string;
  animal_id: string;
  offer_type: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  city: string | null;
  postal_code: string | null;
  availability: string | null;
  household_info: string | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  foster_id: string | null;
  organization_id: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  animal_name: string;
  species: string;
  breed_or_type: string | null;
  sex: string | null;
  age_estimate: string | null;
  size: string | null;
  placement: string | null;
  foster_profile_name: string | null;
  foster_availability_status: string | null;
  relationship_id: string | null;
  relationship_status: string | null;
  access_level: string | null;
  can_submit_updates: boolean | null;
  can_add_photos: boolean | null;
  can_add_behavior_notes: boolean | null;
  active_assignment_id: string | null;
  active_assignment_foster_id: string | null;
  active_assignment_foster_name: string | null;
};

const C = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  peach: "#FBE3DA",
  pink: "#F2D6DC",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
};

const STATUS_OPTIONS = [
  "new",
  "reviewing",
  "contacted",
  "accepted",
  "declined",
  "closed",
];

export default function HelpOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filter, setFilter] = useState("active");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] =
    useState<Record<string, string>>({});
  const [draftNotes, setDraftNotes] =
    useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/fosters/offers", {
        cache: "no-store",
      });

      const data = await res.json();

      if (res.status === 401) {
        window.location.href = "/login?portal=organization";
        return;
      }

      if (!res.ok) {
        throw new Error(
          data.error ?? "Couldn't load help offers."
        );
      }

      const next: Offer[] = data.offers ?? [];
      setOffers(next);

      setDraftStatus(
        Object.fromEntries(
          next.map((offer) => [offer.id, offer.status])
        )
      );

      setDraftNotes(
        Object.fromEntries(
          next.map((offer) => [
            offer.id,
            offer.review_notes ?? "",
          ])
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load help offers."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(
    () => ({
      new: offers.filter((o) => o.status === "new").length,
      active: offers.filter((o) =>
        ["new", "reviewing", "contacted"].includes(o.status)
      ).length,
      accepted: offers.filter((o) => o.status === "accepted").length,
      closed: offers.filter((o) =>
        ["declined", "closed"].includes(o.status)
      ).length,
    }),
    [offers]
  );

  const visible = useMemo(() => {
    if (filter === "all") return offers;
    if (filter === "new") {
      return offers.filter((o) => o.status === "new");
    }
    if (filter === "active") {
      return offers.filter((o) =>
        ["new", "reviewing", "contacted"].includes(o.status)
      );
    }
    if (filter === "accepted") {
      return offers.filter((o) => o.status === "accepted");
    }
    return offers.filter((o) =>
      ["declined", "closed"].includes(o.status)
    );
  }, [filter, offers]);

  async function saveReview(offer: Offer) {
    setSavingId(offer.id);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/fosters/offers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerId: offer.id,
          status: draftStatus[offer.id] ?? offer.status,
          reviewNotes: draftNotes[offer.id] ?? "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ?? "Couldn't update help offer."
        );
      }

      setSuccess("Help offer updated.");
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't update help offer."
      );
    } finally {
      setSavingId(null);
    }
  }

  async function createAssignment(offer: Offer) {
    const confirmed = window.confirm(
      `Create an active foster assignment for ${offer.animal_name} with ${
        offer.foster_profile_name ?? offer.contact_name
      }?`
    );

    if (!confirmed) return;

    setSavingId(offer.id);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/fosters/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerId: offer.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ?? "Couldn't create foster assignment."
        );
      }

      setSuccess(
        `Foster assignment created for ${offer.animal_name}.`
      );
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't create foster assignment."
      );
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return <p style={{ color: C.muted }}>Loading…</p>;
  }

  return (
    <section style={{ maxWidth: 1000 }}>
      <p style={eyebrow}>Rescue Manager</p>

      <h1 style={heading}>Help Offers</h1>

      <p style={intro}>
        Review foster, transport, medical-support, donation, and
        other offers submitted for animals managed by your
        organization. Contact information and review notes remain
        private to your organization.
      </p>

      <div style={statsGrid}>
        <Stat value={counts.new} label="New" />
        <Stat value={counts.active} label="Active Review" />
        <Stat value={counts.accepted} label="Accepted" />
        <Stat value={counts.closed} label="Declined / Closed" />
      </div>

      <div style={filters}>
        {[
          ["active", "Active"],
          ["new", "New"],
          ["accepted", "Accepted"],
          ["closed", "Closed"],
          ["all", "All"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            style={{
              ...filterButton,
              background: filter === value ? C.navy : C.white,
              color: filter === value ? C.white : C.navy,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {success && <p style={successStyle}>{success}</p>}
      {error && (
        <p role="alert" style={errorStyle}>
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <div style={card}>
          <strong style={{ color: C.navy }}>
            No help offers in this view.
          </strong>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {visible.map((offer) => {
            const open = expanded === offer.id;
            const busy = savingId === offer.id;

            const canCreateAssignment =
              offer.offer_type === "foster" &&
              offer.status === "accepted" &&
              Boolean(offer.foster_id) &&
              offer.relationship_status === "approved" &&
              !offer.active_assignment_id;

            return (
              <article key={offer.id} style={card}>
                <button
                  type="button"
                  onClick={() =>
                    setExpanded(open ? null : offer.id)
                  }
                  style={cardButton}
                >
                  <div>
                    <div style={titleRow}>
                      <strong
                        style={{
                          color: C.navy,
                          fontSize: 15,
                        }}
                      >
                        {offer.animal_name}
                      </strong>

                      <Badge status={offer.status} />

                      <span style={typeBadge}>
                        {fmt(offer.offer_type)}
                      </span>
                    </div>

                    <div style={meta}>
                      {offer.contact_name}
                      {" · "}
                      {new Date(
                        offer.created_at
                      ).toLocaleDateString()}
                    </div>
                  </div>

                  <span style={{ color: C.muted }}>
                    {open ? "▲" : "▼"}
                  </span>
                </button>

                {open && (
                  <div style={details}>
                    <div style={infoGrid}>
                      <Info
                        label="Animal"
                        value={[
                          offer.animal_name,
                          offer.species,
                          offer.breed_or_type,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      />
                      <Info
                        label="Contact"
                        value={offer.contact_name}
                      />
                      <Info
                        label="Email"
                        value={offer.contact_email}
                      />
                      <Info
                        label="Phone"
                        value={offer.contact_phone}
                      />
                      <Info
                        label="Location"
                        value={
                          [offer.city, offer.postal_code]
                            .filter(Boolean)
                            .join(" ") || "—"
                        }
                      />
                      <Info
                        label="Foster Profile"
                        value={
                          offer.foster_profile_name
                            ? offer.foster_profile_name
                            : "Not linked"
                        }
                      />
                    </div>

                    {offer.availability && (
                      <TextSection
                        title="Availability"
                        text={offer.availability}
                      />
                    )}

                    {offer.household_info && (
                      <TextSection
                        title="Household Information"
                        text={offer.household_info}
                      />
                    )}

                    {offer.message && (
                      <TextSection
                        title="Applicant Message"
                        text={offer.message}
                      />
                    )}

                    {offer.offer_type === "foster" && (
                      <div style={fosterPanel}>
                        <strong style={sectionTitle}>
                          Foster Access Readiness
                        </strong>

                        {!offer.foster_id ? (
                          <p style={body}>
                            This offer is not yet linked to a Pack
                            of Five Foster Profile. Invite or link
                            the person as a foster before creating
                            animal access.
                          </p>
                        ) : offer.relationship_status !==
                          "approved" ? (
                          <p style={body}>
                            Foster Profile linked, but this person
                            does not yet have an approved
                            relationship with your organization.
                          </p>
                        ) : offer.active_assignment_id ? (
                          <p style={body}>
                            {offer.active_assignment_foster_id ===
                            offer.foster_id
                              ? `${offer.animal_name} is already actively assigned to this foster.`
                              : `${offer.animal_name} already has an active foster assignment${
                                  offer.active_assignment_foster_name
                                    ? ` with ${offer.active_assignment_foster_name}`
                                    : ""
                                }.`}
                          </p>
                        ) : (
                          <p style={body}>
                            Foster Profile and approved rescue
                            relationship confirmed. This offer can
                            become an animal assignment after the
                            offer is accepted.
                          </p>
                        )}
                      </div>
                    )}

                    <div style={reviewPanel}>
                      <label style={label}>
                        Review Status
                        <select
                          value={
                            draftStatus[offer.id] ?? offer.status
                          }
                          onChange={(e) =>
                            setDraftStatus((current) => ({
                              ...current,
                              [offer.id]: e.target.value,
                            }))
                          }
                          style={input}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {fmt(status)}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label style={label}>
                        Private Review Notes
                        <textarea
                          rows={4}
                          value={draftNotes[offer.id] ?? ""}
                          onChange={(e) =>
                            setDraftNotes((current) => ({
                              ...current,
                              [offer.id]: e.target.value,
                            }))
                          }
                          style={input}
                          placeholder="Private notes for your rescue team."
                        />
                      </label>

                      <div style={actions}>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => saveReview(offer)}
                          style={{
                            ...primaryButton,
                            opacity: busy ? 0.65 : 1,
                          }}
                        >
                          {busy ? "Saving…" : "Save Review"}
                        </button>

                        {canCreateAssignment && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              createAssignment(offer)
                            }
                            style={{
                              ...assignmentButton,
                              opacity: busy ? 0.65 : 1,
                            }}
                          >
                            Create Foster Assignment
                          </button>
                        )}

                        <a
                          href={`/animals/${encodeURIComponent(
                            offer.animal_id
                          )}`}
                          style={secondaryLink}
                        >
                          View Animal
                        </a>

                        {offer.foster_id && (
                          <a
                            href="/fosters"
                            style={secondaryLink}
                          >
                            Manage Foster
                          </a>
                        )}
                      </div>

                      {offer.offer_type === "foster" &&
                        draftStatus[offer.id] === "accepted" &&
                        offer.status !== "accepted" && (
                          <p style={hint}>
                            Save the Accepted status first. The
                            Create Foster Assignment button will
                            appear after the offer is saved and all
                            foster-access requirements are met.
                          </p>
                        )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Stat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div style={statCard}>
      <strong
        style={{
          display: "block",
          color: C.navy,
          fontSize: 22,
        }}
      >
        {value}
      </strong>
      <span
        style={{
          color: C.muted,
          fontSize: 11.5,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={infoCard}>
      <div style={infoLabel}>{label}</div>
      <div style={infoValue}>{value}</div>
    </div>
  );
}

function TextSection({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div style={{ marginTop: 12 }}>
      <strong style={sectionTitle}>{title}</strong>
      <p style={body}>{text}</p>
    </div>
  );
}

function Badge({
  status,
}: {
  status: string;
}) {
  const background =
    status === "accepted"
      ? C.mint
      : ["new", "reviewing", "contacted"].includes(status)
      ? C.peach
      : C.pink;

  return (
    <span
      style={{
        background,
        color: C.navy,
        padding: "4px 7px",
        fontSize: 10,
        fontWeight: 800,
        textTransform: "uppercase",
      }}
    >
      {fmt(status)}
    </span>
  );
}

function fmt(value: string) {
  return (value || "—")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const eyebrow: React.CSSProperties = {
  margin: "0 0 6px",
  color: C.coral,
  fontSize: 11.5,
  fontWeight: 800,
  letterSpacing: ".1em",
  textTransform: "uppercase",
};

const heading: React.CSSProperties = {
  margin: 0,
  color: C.navy,
  fontSize: 30,
};

const intro: React.CSSProperties = {
  margin: "8px 0 0",
  color: C.muted,
  fontSize: 13.5,
  lineHeight: 1.55,
  maxWidth: 760,
};

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 10,
  margin: "18px 0 12px",
};

const statCard: React.CSSProperties = {
  background: C.mint,
  padding: 13,
};

const filters: React.CSSProperties = {
  display: "flex",
  gap: 7,
  flexWrap: "wrap",
  marginBottom: 14,
};

const filterButton: React.CSSProperties = {
  border: `1px solid ${C.border}`,
  padding: "8px 10px",
  fontSize: 11.5,
  fontWeight: 750,
  cursor: "pointer",
};

const card: React.CSSProperties = {
  background: C.white,
  border: `1px solid ${C.border}`,
  padding: 15,
};

const cardButton: React.CSSProperties = {
  width: "100%",
  border: "none",
  background: "transparent",
  padding: 0,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  textAlign: "left",
  cursor: "pointer",
  fontFamily: "inherit",
};

const titleRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const typeBadge: React.CSSProperties = {
  border: `1px solid ${C.border}`,
  color: C.navy,
  padding: "3px 6px",
  fontSize: 10,
  fontWeight: 800,
  textTransform: "uppercase",
};

const meta: React.CSSProperties = {
  marginTop: 4,
  color: C.muted,
  fontSize: 11.5,
};

const details: React.CSSProperties = {
  borderTop: `1px solid ${C.border}`,
  paddingTop: 13,
  marginTop: 13,
};

const infoGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 8,
};

const infoCard: React.CSSProperties = {
  background: "#F8FAFC",
  border: `1px solid ${C.border}`,
  padding: 10,
};

const infoLabel: React.CSSProperties = {
  color: C.muted,
  fontSize: 10,
  fontWeight: 800,
  textTransform: "uppercase",
};

const infoValue: React.CSSProperties = {
  color: C.navy,
  fontSize: 12.5,
  fontWeight: 700,
  marginTop: 4,
  overflowWrap: "anywhere",
};

const sectionTitle: React.CSSProperties = {
  color: C.navy,
  fontSize: 11,
  textTransform: "uppercase",
};

const body: React.CSSProperties = {
  margin: "5px 0 0",
  color: C.muted,
  fontSize: 12.5,
  lineHeight: 1.5,
  whiteSpace: "pre-wrap",
};

const fosterPanel: React.CSSProperties = {
  background: C.mint,
  padding: 12,
  marginTop: 12,
};

const reviewPanel: React.CSSProperties = {
  borderTop: `1px solid ${C.border}`,
  marginTop: 14,
  paddingTop: 14,
  display: "grid",
  gap: 12,
};

const label: React.CSSProperties = {
  display: "grid",
  gap: 6,
  color: C.navy,
  fontSize: 12.5,
  fontWeight: 700,
};

const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: `1px solid ${C.border}`,
  padding: "9px 10px",
  background: C.white,
  color: "#1C1B19",
  fontFamily: "inherit",
};

const actions: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  alignItems: "center",
};

const primaryButton: React.CSSProperties = {
  border: "none",
  background: C.navy,
  color: "#fff",
  padding: "9px 12px",
  fontWeight: 800,
  fontSize: 12,
  cursor: "pointer",
};

const assignmentButton: React.CSSProperties = {
  border: "none",
  background: "#2E6B57",
  color: "#fff",
  padding: "9px 12px",
  fontWeight: 800,
  fontSize: 12,
  cursor: "pointer",
};

const secondaryLink: React.CSSProperties = {
  display: "inline-block",
  border: `1px solid ${C.border}`,
  color: C.navy,
  padding: "8px 10px",
  textDecoration: "none",
  fontSize: 11.5,
  fontWeight: 800,
};

const hint: React.CSSProperties = {
  margin: 0,
  color: C.muted,
  fontSize: 11.5,
  lineHeight: 1.45,
};

const successStyle: React.CSSProperties = {
  color: "#2E6B57",
  fontWeight: 700,
  fontSize: 12.5,
};

const errorStyle: React.CSSProperties = {
  color: "#B23B2E",
  fontSize: 12.5,
};
