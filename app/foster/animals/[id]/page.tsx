"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Animal = {
  assignment_id: string;
  started_at: string;
  assignment_notes: string | null;
  id: string;
  display_name: string;
  name: string | null;
  temporary_name: string | null;
  species: string;
  breed_or_type: string | null;
  sex: string | null;
  age_estimate: string | null;
  size: string | null;
  birth_date: string | null;
  weight_lbs: string | number | null;
  custody: string;
  urgency: string;
  urgency_deadline: string | null;
  placement: string;
  notes: string | null;
  current_org_id: string;
  organization_name: string;
  access_level: string;
  can_submit_updates: boolean;
  can_add_photos: boolean;
  can_add_behavior_notes: boolean;
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

export default function FosterAnimalFilePage() {
  const params = useParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    fetch(`/api/foster/animals/${encodeURIComponent(params.id)}`, {
      cache: "no-store",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error ?? "Couldn't load foster animal file."
          );
        }

        setAnimal(data.animal ?? null);
      })
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load foster animal file."
        )
      )
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return <p style={{ color: C.muted }}>Loading…</p>;
  }

  if (error || !animal) {
    return (
      <section style={{ maxWidth: 900 }}>
        <a href="/foster/animals" style={backLink}>
          ← My Foster Animals
        </a>
        <div style={card}>
          <strong style={{ color: C.navy }}>Animal unavailable</strong>
          <p style={body}>{error ?? "This animal is not available."}</p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}>
      <a href="/foster/animals" style={backLink}>
        ← My Foster Animals
      </a>

      <p style={eyebrow}>Volunteer Portal</p>

      <h1 style={heading}>{animal.display_name}</h1>

      <p style={intro}>
        Foster file managed by {animal.organization_name}. Your access is
        limited to your active assignment and the permissions granted by
        this organization.
      </p>

      <div style={stats}>
        <Info label="Species" value={animal.species} />
        <Info label="Breed / Type" value={animal.breed_or_type ?? "—"} />
        <Info label="Sex" value={fmt(animal.sex)} />
        <Info label="Age" value={animal.age_estimate ?? "—"} />
        <Info label="Size" value={fmt(animal.size)} />
        <Info
          label="Weight"
          value={
            animal.weight_lbs !== null
              ? `${animal.weight_lbs} lbs`
              : "—"
          }
        />
      </div>

      <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
        <article style={card}>
          <h2 style={sectionHeading}>Placement Information</h2>

          <div style={stats}>
            <Info label="Organization" value={animal.organization_name} />
            <Info label="Custody" value={fmt(animal.custody)} />
            <Info label="Placement" value={fmt(animal.placement)} />
            <Info label="Urgency" value={fmt(animal.urgency)} />
            <Info
              label="Foster Started"
              value={new Date(animal.started_at).toLocaleDateString()}
            />
            <Info
              label="Urgency Deadline"
              value={
                animal.urgency_deadline
                  ? new Date(animal.urgency_deadline).toLocaleString()
                  : "—"
              }
            />
          </div>

          {animal.assignment_notes && (
            <div style={noteBox}>
              <strong style={noteTitle}>Assignment Notes</strong>
              <p style={body}>{animal.assignment_notes}</p>
            </div>
          )}
        </article>

        <article style={card}>
          <h2 style={sectionHeading}>Animal Notes</h2>
          <p style={body}>
            {animal.notes || "No foster-visible animal notes are currently listed."}
          </p>
        </article>

        <article style={card}>
          <h2 style={sectionHeading}>Your Foster Access</h2>

          <p style={{ ...body, marginBottom: 10 }}>
            Access level: <strong>{fmt(animal.access_level)}</strong>
          </p>

          <div style={{ display: "grid", gap: 8 }}>
            <Permission
              enabled={animal.can_submit_updates}
              label="Submit Animal Updates"
            />
            <Permission
              enabled={animal.can_add_photos}
              label="Add Photos"
            />
            <Permission
              enabled={animal.can_add_behavior_notes}
              label="Add Behavior Notes"
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginTop: 14,
            }}
          >
            {animal.can_submit_updates && (
              <button type="button" style={actionButton} disabled>
                Submit Update — Coming Next
              </button>
            )}

            {animal.can_add_photos && (
              <button type="button" style={secondaryButton} disabled>
                Add Photo — Coming Next
              </button>
            )}

            {animal.can_add_behavior_notes && (
              <button type="button" style={secondaryButton} disabled>
                Add Behavior Note — Coming Next
              </button>
            )}
          </div>
        </article>
      </div>
    </section>
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
    <div
      style={{
        background: "#F8FAFC",
        border: `1px solid ${C.border}`,
        padding: 10,
      }}
    >
      <div
        style={{
          color: C.muted,
          fontSize: 10,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: ".04em",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: C.navy,
          fontSize: 12.5,
          fontWeight: 700,
          marginTop: 4,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Permission({
  enabled,
  label,
}: {
  enabled: boolean;
  label: string;
}) {
  return (
    <div
      style={{
        background: enabled ? C.mint : "#F4F6F8",
        color: C.navy,
        padding: "9px 10px",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {enabled ? "✓ " : "— "}
      {label}
    </div>
  );
}

function fmt(value: string | null) {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const backLink: React.CSSProperties = {
  display: "inline-block",
  color: C.muted,
  textDecoration: "none",
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 18,
};

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
  lineHeight: 1.1,
};

const intro: React.CSSProperties = {
  margin: "8px 0 0",
  color: C.muted,
  fontSize: 13.5,
  lineHeight: 1.55,
  maxWidth: 720,
};

const stats: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
  gap: 8,
  marginTop: 14,
};

const card: React.CSSProperties = {
  background: C.white,
  border: `1px solid ${C.border}`,
  padding: 17,
};

const sectionHeading: React.CSSProperties = {
  margin: "0 0 10px",
  color: C.navy,
  fontSize: 16,
};

const body: React.CSSProperties = {
  margin: "6px 0 0",
  color: C.muted,
  fontSize: 12.75,
  lineHeight: 1.55,
  whiteSpace: "pre-wrap",
};

const noteBox: React.CSSProperties = {
  marginTop: 12,
  background: C.peach,
  padding: 11,
};

const noteTitle: React.CSSProperties = {
  color: C.navy,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: ".04em",
};

const actionButton: React.CSSProperties = {
  border: "none",
  background: C.navy,
  color: "#fff",
  padding: "9px 12px",
  fontWeight: 800,
  fontSize: 12,
};

const secondaryButton: React.CSSProperties = {
  border: `1px solid ${C.border}`,
  background: C.white,
  color: C.navy,
  padding: "8px 11px",
  fontWeight: 800,
  fontSize: 12,
};
