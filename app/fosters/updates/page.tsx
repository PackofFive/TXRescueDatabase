"use client";

import { useEffect, useMemo, useState } from "react";

type Update = {
  id: string;
  assignment_id: string;
  foster_id: string;
  animal_id: string;
  update_type: string;
  title: string | null;
  update_text: string;
  status: string;
  submitted_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
  incorporated_at: string | null;
  foster_name: string;
  foster_email: string | null;
  animal_name: string;
  species: string;
  breed_or_type: string | null;
};

const C = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  peach: "#FBE3DA",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
};

export default function FosterUpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [filter, setFilter] = useState("submitted");
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/fosters/updates", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Couldn't load foster updates.");
      }

      setUpdates(data.updates ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load foster updates."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    return {
      submitted: updates.filter((u) => u.status === "submitted").length,
      reviewed: updates.filter((u) => u.status === "reviewed").length,
      incorporated: updates.filter((u) => u.status === "incorporated").length,
      all: updates.length,
    };
  }, [updates]);

  const visible = useMemo(() => {
    if (filter === "all") return updates;
    return updates.filter((u) => u.status === filter);
  }, [updates, filter]);

  async function act(id: string, action: string) {
    setWorkingId(id);
    setError(null);

    try {
      const res = await fetch("/api/fosters/updates", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          action,
          reviewNotes: notes[id] ?? "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Couldn't update foster submission.");
      }

      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't update foster submission."
      );
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <section style={{ width: "100%", maxWidth: 1050, margin: "0 auto" }}>
      <p style={eyebrow}>Rescue Manager</p>
      <h1 style={heading}>Foster Updates</h1>
      <p style={intro}>
        Review updates submitted by fosters for animals currently managed by
        your organization.
      </p>

      {counts.all > 0 && <div style={statGrid}>
        {counts.submitted > 0 && <Stat value={counts.submitted} label="Needs Review" />}
        {counts.reviewed > 0 && <Stat value={counts.reviewed} label="Reviewed" />}
        {counts.incorporated > 0 && <Stat value={counts.incorporated} label="Incorporated" />}
        <Stat value={counts.all} label="Total Updates" />
      </div>}

      {counts.all > 0 && <details style={filters}>
        <summary style={{ color: C.navy, cursor: "pointer", fontWeight: 800 }}>Filter updates</summary>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
        {[
          ["submitted", "Needs Review"],
          ["reviewed", "Reviewed"],
          ["incorporated", "Incorporated"],
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
      </details>}

      {error && <p style={errorStyle}>{error}</p>}

      {loading ? (
        <p style={intro}>Loading…</p>
      ) : counts.all === 0 ? (
        <div style={{ ...card, background: C.mint }}>
          <strong style={{ color: C.navy }}>
            You’re all caught up
          </strong>
          <p style={{ ...intro, margin: "6px 0 0" }}>No foster updates need your review right now.</p>
        </div>
      ) : visible.length === 0 ? (
        <div style={card}><strong style={{ color: C.navy }}>No foster updates match this filter.</strong></div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {visible.map((update) => (
            <article key={update.id} style={card}>
              <div style={topRow}>
                <div>
                  <p style={miniLabel}>{fmt(update.update_type)}</p>
                  <h2 style={cardHeading}>
                    {update.title || `${update.animal_name} Update`}
                  </h2>
                  <p style={meta}>
                    {update.animal_name}
                    {" · "}
                    {update.foster_name}
                    {" · "}
                    {new Date(update.submitted_at).toLocaleString()}
                  </p>
                </div>

                <span
                  style={{
                    ...statusBadge,
                    background:
                      update.status === "submitted" ? C.peach : C.mint,
                  }}
                >
                  {fmt(update.status)}
                </span>
              </div>

              <p style={updateText}>{update.update_text}</p>

              <div style={animalInfo}>
                <strong>{update.animal_name}</strong>
                <span>
                  {[update.species, update.breed_or_type]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>

              <label style={labelStyle}>
                Rescue Review Notes
                <textarea
                  rows={3}
                  value={notes[update.id] ?? update.review_notes ?? ""}
                  onChange={(e) =>
                    setNotes((current) => ({
                      ...current,
                      [update.id]: e.target.value,
                    }))
                  }
                  style={inputStyle}
                  placeholder="Optional note visible in the foster update history."
                />
              </label>

              <div style={actions}>
                {update.status === "submitted" && (
                  <button
                    type="button"
                    disabled={workingId === update.id}
                    onClick={() => act(update.id, "review")}
                    style={primaryButton}
                  >
                    Mark Reviewed
                  </button>
                )}

                {update.status !== "incorporated" && (
                  <button
                    type="button"
                    disabled={workingId === update.id}
                    onClick={() => act(update.id, "incorporate")}
                    style={secondaryButton}
                  >
                    Mark Incorporated
                  </button>
                )}

                {update.status !== "archived" && (
                  <button
                    type="button"
                    disabled={workingId === update.id}
                    onClick={() => act(update.id, "archive")}
                    style={secondaryButton}
                  >
                    Archive
                  </button>
                )}

                <a
                  href={`/animals/${encodeURIComponent(update.animal_id)}`}
                  style={animalLink}
                >
                  Open Animal File
                </a>
              </div>

              {update.status === "incorporated" && (
                <p style={notice}>
                  Marked incorporated. This preserves the foster submission as
                  part of the audit history; it does not automatically overwrite
                  the animal record.
                </p>
              )}
            </article>
          ))}
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
      <strong style={{ display: "block", color: C.navy, fontSize: 23 }}>
        {value}
      </strong>
      <span style={{ color: C.muted, fontSize: 11.5 }}>{label}</span>
    </div>
  );
}

function fmt(value: string) {
  return value
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
};

const statGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
  gap: 9,
  margin: "18px 0 12px",
};

const statCard: React.CSSProperties = {
  background: C.white,
  border: `1px solid ${C.border}`,
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
  fontWeight: 750,
  fontSize: 11.5,
  cursor: "pointer",
};

const card: React.CSSProperties = {
  background: C.white,
  border: `1px solid ${C.border}`,
  padding: 16,
};

const topRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  flexWrap: "wrap",
};

const miniLabel: React.CSSProperties = {
  margin: "0 0 4px",
  color: C.coral,
  fontSize: 10,
  fontWeight: 800,
  textTransform: "uppercase",
};

const cardHeading: React.CSSProperties = {
  margin: 0,
  color: C.navy,
  fontSize: 17,
};

const meta: React.CSSProperties = {
  margin: "5px 0 0",
  color: C.muted,
  fontSize: 11.5,
};

const statusBadge: React.CSSProperties = {
  color: C.navy,
  padding: "5px 8px",
  fontSize: 10,
  fontWeight: 800,
  textTransform: "uppercase",
};

const updateText: React.CSSProperties = {
  color: C.muted,
  fontSize: 13,
  lineHeight: 1.55,
  whiteSpace: "pre-wrap",
  margin: "13px 0",
};

const animalInfo: React.CSSProperties = {
  display: "flex",
  gap: 7,
  flexWrap: "wrap",
  color: C.navy,
  fontSize: 11.5,
  marginBottom: 12,
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  color: C.navy,
  fontSize: 12,
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: `1px solid ${C.border}`,
  padding: 9,
  fontFamily: "inherit",
};

const actions: React.CSSProperties = {
  display: "flex",
  gap: 7,
  flexWrap: "wrap",
  marginTop: 11,
};

const primaryButton: React.CSSProperties = {
  border: "none",
  background: C.navy,
  color: C.white,
  padding: "9px 11px",
  fontWeight: 800,
  fontSize: 11.5,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  border: `1px solid ${C.border}`,
  background: C.white,
  color: C.navy,
  padding: "8px 10px",
  fontWeight: 800,
  fontSize: 11.5,
  cursor: "pointer",
};

const animalLink: React.CSSProperties = {
  display: "inline-block",
  color: C.navy,
  padding: "8px 4px",
  fontSize: 11.5,
  fontWeight: 800,
  textDecoration: "none",
};

const notice: React.CSSProperties = {
  background: C.mint,
  color: C.navy,
  padding: 9,
  margin: "12px 0 0",
  fontSize: 11.5,
};

const errorStyle: React.CSSProperties = {
  color: "#B23B2E",
  fontSize: 12.5,
};
