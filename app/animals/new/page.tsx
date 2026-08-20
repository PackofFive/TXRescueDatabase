"use client";

import { useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 9,
  border: "1px solid #E7E5E1",
  borderRadius: 6,
  fontSize: 13.5,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 5,
  color: "#3F3D39",
};

export default function QuickIntakePage() {
  const [species, setSpecies] = useState("");
  const [name, setName] = useState("");
  const [temporaryName, setTemporaryName] = useState("");

  const [source, setSource] = useState("");

  const [custody, setCustody] =
    useState("rescue");

  const [intakeDate, setIntakeDate] =
    useState(() =>
      new Date()
        .toISOString()
        .slice(0, 10)
    );

  const [photoUrl, setPhotoUrl] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [savedId, setSavedId] =
    useState<string | null>(null);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError(null);
    setSaving(true);

    try {
      const res = await fetch(
        "/api/animals",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            species,
            name,
            temporaryName,
            source,
            custody,
            intakeDate,
            photoUrl,
            notes,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Something went wrong recording intake."
        );
      }

      setSavedId(
        data.animal.id
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong recording intake."
      );
    } finally {
      setSaving(false);
    }
  }

  if (savedId) {
    return (
      <section
        style={{
          maxWidth: 560,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing:
              ".08em",
            color: "#6B6862",
          }}
        >
          RESCUE MANAGER
        </p>

        <h1
          style={{
            fontSize: 25,
            color: "#17233C",
            margin:
              "6px 0 8px",
          }}
        >
          Intake recorded
        </h1>

        <p
          style={{
            fontSize: 13.5,
            color: "#2F6F4E",
            lineHeight: 1.6,
            marginBottom: 18,
          }}
        >
          The animal is now in
          your organization&apos;s
          records. Medical,
          behavior, foster,
          identification, expense,
          photos, documents, and
          outcome information can
          be added to the animal&apos;s
          full record.
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <a
            href={`/animals/${encodeURIComponent(
              savedId
            )}`}
            style={{
              display:
                "inline-block",
              padding:
                "9px 14px",
              background:
                "#17233C",
              color: "#fff",
              textDecoration:
                "none",
              borderRadius: 7,
              fontSize: 13.5,
              fontWeight: 700,
            }}
          >
            Open Animal Record
          </a>

          <a
            href="/animals"
            style={{
              display:
                "inline-block",
              padding:
                "9px 14px",
              border:
                "1px solid #D8D6D2",
              color: "#17233C",
              textDecoration:
                "none",
              borderRadius: 7,
              fontSize: 13.5,
              fontWeight: 600,
            }}
          >
            Back to Animals
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{
        maxWidth: 560,
      }}
    >
      <a
        href="/animals"
        style={{
          fontSize: 12.5,
          color: "#C05621",
          textDecoration: "none",
        }}
      >
        ← Back to Animals
      </a>

      <p
        style={{
          margin:
            "18px 0 0",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing:
            ".08em",
          color: "#6B6862",
        }}
      >
        RESCUE MANAGER
      </p>

      <h1
        style={{
          fontSize: 26,
          color: "#17233C",
          margin:
            "5px 0 8px",
        }}
      >
        Quick Animal Intake
      </h1>

      <p
        style={{
          color: "#6B6862",
          fontSize: 13.5,
          lineHeight: 1.6,
          marginBottom: 18,
        }}
      >
        Record only what you know
        right now. The animal&apos;s
        full file can be completed
        later.
      </p>

      <div
        style={{
          background:
            "#F6F7F8",
          border:
            "1px solid #E7E5E1",
          borderRadius: 8,
          padding: 12,
          marginBottom: 22,
          color: "#4F4D49",
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        <strong>
          Use this when your
          organization is taking
          responsibility for or
          actively managing an
          animal.
        </strong>{" "}
        Shelter animals that are
        only being reviewed for
        possible rescue should
        remain under Urgent
        Shelter Animals until your
        organization formally
        commits.
      </div>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <div
          style={{
            marginBottom: 14,
          }}
        >
          <label
            style={labelStyle}
          >
            Species *
          </label>

          <select
            value={species}
            onChange={(e) =>
              setSpecies(
                e.target.value
              )
            }
            required
            style={inputStyle}
          >
            <option value="">
              Select…
            </option>
            <option value="Dog">
              Dog
            </option>
            <option value="Cat">
              Cat
            </option>
            <option value="Rabbit">
              Rabbit
            </option>
            <option value="Bird">
              Bird
            </option>
            <option value="Equine">
              Equine
            </option>
            <option value="Farm Animal">
              Farm Animal
            </option>
            <option value="Wildlife">
              Wildlife
            </option>
            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            marginBottom: 14,
          }}
        >
          <div>
            <label
              style={
                labelStyle
              }
            >
              Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="If known"
              style={
                inputStyle
              }
            />
          </div>

          <div>
            <label
              style={
                labelStyle
              }
            >
              Temporary name
            </label>

            <input
              value={
                temporaryName
              }
              onChange={(e) =>
                setTemporaryName(
                  e.target.value
                )
              }
              placeholder="If no established name"
              style={
                inputStyle
              }
            />
          </div>
        </div>

        <div
          style={{
            marginBottom: 14,
          }}
        >
          <label
            style={labelStyle}
          >
            Source
          </label>

          <select
            value={source}
            onChange={(e) =>
              setSource(
                e.target.value
              )
            }
            style={inputStyle}
          >
            <option value="">
              Select if known…
            </option>

            <option value="Shelter Transfer">
              Shelter transfer
            </option>

            <option value="Owner Surrender">
              Owner surrender
            </option>

            <option value="Stray / Found">
              Stray / found
            </option>

            <option value="Rescue Transfer">
              Transfer from
              another rescue
            </option>

            <option value="Cruelty / Neglect">
              Cruelty / neglect
            </option>

            <option value="Emergency Medical">
              Emergency medical
            </option>

            <option value="Born in Care">
              Born in care
            </option>

            <option value="Public Assistance">
              Public assistance
              case
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div
          style={{
            marginBottom: 14,
          }}
        >
          <label
            style={labelStyle}
          >
            Current care /
            custody *
          </label>

          <select
            value={custody}
            onChange={(e) =>
              setCustody(
                e.target.value
              )
            }
            required
            style={inputStyle}
          >
            <option value="rescue">
              In organization
              care
            </option>

            <option value="owner">
              Still with owner —
              organization is
              actively assisting
            </option>

            <option value="other">
              Other active
              responsibility
            </option>
          </select>
        </div>

        <div
          style={{
            marginBottom: 14,
          }}
        >
          <label
            style={labelStyle}
          >
            Intake / responsibility
            date *
          </label>

          <input
            type="date"
            value={intakeDate}
            onChange={(e) =>
              setIntakeDate(
                e.target.value
              )
            }
            required
            style={inputStyle}
          />
        </div>

        <div
          style={{
            marginBottom: 14,
          }}
        >
          <label
            style={labelStyle}
          >
            Photo URL
          </label>

          <input
            value={photoUrl}
            onChange={(e) =>
              setPhotoUrl(
                e.target.value
              )
            }
            placeholder="Optional for now — direct upload will be added later"
            style={inputStyle}
          />
        </div>

        <div
          style={{
            marginBottom: 18,
          }}
        >
          <label
            style={labelStyle}
          >
            Quick notes
          </label>

          <textarea
            rows={4}
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }
            placeholder="Anything important that should follow this animal into the record."
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            padding:
              "9px 18px",
            background:
              "#17233C",
            color: "#fff",
            border: "none",
            borderRadius: 7,
            fontWeight: 700,
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
            ? "Recording…"
            : "Record Intake"}
        </button>

        {error && (
          <p
            style={{
              color:
                "#B23B2E",
              fontSize: 13,
              marginTop: 10,
            }}
          >
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
