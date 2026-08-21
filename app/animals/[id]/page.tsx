"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

type TimelineEvent = {
  id: string;
  event_type: string;
  org_id: string | null;
  started_at: string;
};

type Animal = {
  id: string;
  name: string | null;
  temporary_name: string | null;
  species: string;
  breed_or_type: string | null;
  birth_date: string | null;
  sex: string | null;
  weight_lbs: string | number | null;
  source: string | null;
  custody: string;
  urgency: string | null;
  placement: string | null;
  notes: string | null;

  public_share_enabled: boolean;
  public_summary: string | null;
  public_need: string | null;
  external_listing_url: string | null;

  open_help_offers: number;

  created_at: string;

  photo:
    | {
        id: string;
        url: string;
        source: string | null;
        visibility: string | null;
      }
    | null;

  timeline: TimelineEvent[];
};

export default function AnimalRecordPage() {
  const params = useParams();

  const animalId =
    params?.id as string;

  const [
    animal,
    setAnimal,
  ] = useState<Animal | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [
    savingPublic,
    setSavingPublic,
  ] = useState(false);

  const [
    publicMessage,
    setPublicMessage,
  ] = useState<
    string | null
  >(null);

  /* =====================================================
     PUBLIC PROFILE DRAFT
  ===================================================== */

  const [
    birthDate,
    setBirthDate,
  ] = useState("");

  const [
    sex,
    setSex,
  ] = useState("");

  const [
    weightLbs,
    setWeightLbs,
  ] = useState("");

  const [
    publicSummary,
    setPublicSummary,
  ] = useState("");

  const [
    publicNeed,
    setPublicNeed,
  ] = useState("");

  const [
    externalListingUrl,
    setExternalListingUrl,
  ] = useState("");

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    if (!animalId) {
      return;
    }

    fetch(
      `/api/animals/${encodeURIComponent(
        animalId
      )}`,
      {
        cache: "no-store",
      }
    )
      .then(async (r) => {
        const data =
          await r.json();

        if (!r.ok) {
          throw new Error(
            data.error ??
              "Failed to load animal."
          );
        }

        const loaded =
          data.animal as Animal;

        setAnimal(loaded);

        setBirthDate(
          loaded.birth_date
            ? String(
                loaded.birth_date
              ).slice(0, 10)
            : ""
        );

        setSex(
          loaded.sex ?? ""
        );

        setWeightLbs(
          loaded.weight_lbs !=
            null
            ? String(
                loaded.weight_lbs
              )
            : ""
        );

        setPublicSummary(
          loaded.public_summary ??
            ""
        );

        setPublicNeed(
          loaded.public_need ??
            ""
        );

        setExternalListingUrl(
          loaded.external_listing_url ??
            ""
        );
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load animal."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [animalId]);

  /* =====================================================
     SAVE PROFILE DRAFT

     Saves public-facing information WITHOUT changing
     whether the animal is published.
  ===================================================== */

  async function saveProfileDraft() {
    if (!animal) return;

    await saveProfile(
      animal.public_share_enabled,
      "Public profile draft saved."
    );
  }

  /* =====================================================
     PUBLISH
  ===================================================== */

  async function publishProfile() {
    const confirmed =
      window.confirm(
        "Publish this animal's public profile?\n\nThe animal will become visible through its public Pack of Five link. Private notes, detailed medical records, foster contacts, expenses, and other internal information will remain private."
      );

    if (!confirmed) {
      return;
    }

    await saveProfile(
      true,
      "Public profile published."
    );
  }

  /* =====================================================
     UNPUBLISH
  ===================================================== */

  async function unpublishProfile() {
    const confirmed =
      window.confirm(
        "Unpublish this animal?\n\nThe animal's private Rescue Manager file will remain unchanged, but the public profile will no longer be available."
      );

    if (!confirmed) {
      return;
    }

    await saveProfile(
      false,
      "Public profile unpublished. The animal is private again."
    );
  }

  /* =====================================================
     SHARED SAVE
  ===================================================== */

  async function saveProfile(
    publicShareEnabled: boolean,
    successMessage: string
  ) {
    setSavingPublic(true);
    setPublicMessage(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                birthDate,
                sex,
                weightLbs,

                publicShareEnabled,

                publicSummary,
                publicNeed,
                externalListingUrl,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't save animal profile."
        );
      }

      setAnimal(
        (current) =>
          current
            ? {
                ...current,

                birth_date:
                  data.animal
                    .birth_date,

                sex:
                  data.animal
                    .sex,

                weight_lbs:
                  data.animal
                    .weight_lbs,

                public_share_enabled:
                  data.animal
                    .public_share_enabled,

                public_summary:
                  data.animal
                    .public_summary,

                public_need:
                  data.animal
                    .public_need,

                external_listing_url:
                  data.animal
                    .external_listing_url,
              }
            : current
      );

      setPublicMessage(
        successMessage
      );
    } catch (err) {
      setPublicMessage(
        err instanceof Error
          ? err.message
          : "Couldn't save animal profile."
      );
    } finally {
      setSavingPublic(false);
    }
  }

  /* =====================================================
     COPY LINK
  ===================================================== */

  async function copyPublicLink() {
    const url =
      `${window.location.origin}/pet/${encodeURIComponent(
        animalId
      )}`;

    try {
      await navigator.clipboard.writeText(
        url
      );

      setPublicMessage(
        "Public link copied."
      );
    } catch {
      setPublicMessage(url);
    }
  }

  if (loading) {
    return <p>Loading…</p>;
  }

  if (error) {
    return (
      <div>
        <a
          href="/animals"
          style={{
            fontSize: 13,
            color: "#C05621",
            textDecoration:
              "none",
          }}
        >
          ← Back to Animals
        </a>

        <p
          style={{
            color: "#B23B2E",
          }}
        >
          {error}
        </p>
      </div>
    );
  }

  if (!animal) {
    return null;
  }

  const displayName =
    animal.name ||
    animal.temporary_name ||
    "Unnamed Animal";

  const publicUrl =
    `/pet/${encodeURIComponent(
      animal.id
    )}`;

  const isPublic =
    animal.public_share_enabled;

  return (
    <section>
      <a
        href="/animals"
        style={{
          fontSize: 12.5,
          color: "#C05621",
          textDecoration:
            "none",
        }}
      >
        ← Back to Animals
      </a>

      {/* ===============================================
          HEADER
      ================================================ */}

      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems:
            "flex-start",
          marginTop: 18,
          marginBottom: 28,
          flexWrap: "wrap",
        }}
      >
        {animal.photo?.url ? (
          <img
            src={animal.photo.url}
            alt={displayName}
            style={{
              width: 150,
              height: 150,
              borderRadius: 10,
              objectFit: "cover",
              border:
                "1px solid #E7E5E1",
            }}
          />
        ) : (
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: 10,
              background:
                "#F2F2F0",
              border:
                "1px solid #E7E5E1",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              color: "#8A8782",
              fontSize: 13,
              textAlign:
                "center",
              padding: 12,
              boxSizing:
                "border-box",
            }}
          >
            No photo yet
          </div>
        )}

        <div
          style={{
            flex: 1,
            minWidth: 250,
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
            PRIVATE ANIMAL RECORD
          </p>

          <h1
            style={{
              fontSize: 30,
              color: "#17233C",
              margin:
                "5px 0 6px",
            }}
          >
            {displayName}
          </h1>

          <p
            style={{
              margin:
                "0 0 12px",
              color: "#6B6862",
              fontSize: 14,
            }}
          >
            {[
              calculateAge(
                animal.birth_date
              ),
              animal.species,
              animal.breed_or_type,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <StatusBadge
              label={`Custody: ${formatValue(
                animal.custody
              )}`}
            />

            {animal.placement && (
              <StatusBadge
                label={`Placement: ${formatValue(
                  animal.placement
                )}`}
              />
            )}

            <span
              style={{
                display:
                  "inline-block",
                borderRadius: 20,
                padding:
                  "5px 9px",
                fontSize: 12,
                fontWeight: 700,

                background:
                  isPublic
                    ? "#EEF4F0"
                    : "#F1F3F5",

                border:
                  isPublic
                    ? "1px solid #C9DDD1"
                    : "1px solid #E0E3E7",

                color:
                  isPublic
                    ? "#2F6F4E"
                    : "#4F5661",
              }}
            >
              {isPublic
                ? "Public Profile Published"
                : "Private — Not Published"}
            </span>
          </div>
        </div>
      </div>

      {/* ===============================================
          PRIVATE STATUS MESSAGE
      ================================================ */}

      {!isPublic && (
        <div
          style={{
            background:
              "#F6F7F8",
            border:
              "1px solid #E0E3E7",
            borderRadius: 9,
            padding: 14,
            marginBottom: 22,
          }}
        >
          <strong
            style={{
              color:
                "#17233C",
            }}
          >
            This animal is private.
          </strong>

          <p
            style={{
              margin:
                "5px 0 0",
              color:
                "#6B6862",
              fontSize: 13.5,
              lineHeight: 1.55,
            }}
          >
            The animal is only
            visible inside your
            organization&apos;s
            Rescue Manager. You
            can complete medical
            care, surgery,
            behavior evaluation,
            foster placement and
            other work before
            deciding whether to
            publish a public
            profile.
          </p>
        </div>
      )}

      {/* ===============================================
          NEEDS ATTENTION
      ================================================ */}

      <div
        style={{
          border:
            "1px solid #E7E5E1",
          background:
            "#FAFAF9",
          borderRadius: 9,
          padding: 15,
          marginBottom: 22,
        }}
      >
        <strong
          style={{
            color: "#17233C",
          }}
        >
          Needs Attention
        </strong>

        <p
          style={{
            margin: "5px 0 0",
            color: "#6B6862",
            fontSize: 13.5,
            lineHeight: 1.5,
          }}
        >
          Important missing
          information, overdue
          care, medications,
          foster tasks and other
          priority items will
          appear here.
        </p>
      </div>

      {/* ===============================================
          RECORD MODULES
      ================================================ */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        <RecordCard
          title="Overview"
          text="Identity, source, intake details, current status, and general notes."
          active
        />

        <RecordCard
          title="Medical"
          text="Veterinary history, vaccinations, procedures, conditions, medications, and reminders."
          href={`/animals/${encodeURIComponent(
            animal.id
          )}/medical`}
        />

        <RecordCard
          title="Foster"
          text="Current foster placement, assignments, checklists, availability, and foster history."
        />

        <RecordCard
          title="Behavior"
          text="Behavior observations, assessments, training notes, and foster updates."
        />

        <RecordCard
          title="Expenses"
          text="Optional animal-specific expense and support tracking."
        />

        <RecordCard
          title="Documents & Photos"
          text="Photos, veterinary documents, intake paperwork, IDs, and other files."
        />

        <RecordCard
          title="Timeline"
          text="Intake, transfers, custody changes, foster placements, and other important events."
        />

        <RecordCard
          title="Outcome"
          text="Adoption, transfer, return, release, or other final outcome information."
        />
      </div>

      {/* ===============================================
          OVERVIEW
      ================================================ */}

      <Panel title="Overview">
        <InfoRow
          label="Species"
          value={animal.species}
        />

        <InfoRow
          label="Breed / type"
          value={
            animal.breed_or_type
          }
        />

        <InfoRow
          label="Age"
          value={calculateAge(
            animal.birth_date
          )}
        />

        <InfoRow
          label="Sex"
          value={animal.sex}
        />

        <InfoRow
          label="Weight"
          value={
            animal.weight_lbs !=
            null
              ? `${animal.weight_lbs} lb`
              : null
          }
        />

        <InfoRow
          label="Source"
          value={animal.source}
        />

        <InfoRow
          label="Current custody"
          value={formatValue(
            animal.custody
          )}
        />

        <InfoRow
          label="Current placement"
          value={
            animal.placement
              ? formatValue(
                  animal.placement
                )
              : null
          }
        />

        <InfoRow
          label="Urgency"
          value={
            animal.urgency
              ? formatValue(
                  animal.urgency
                )
              : null
          }
        />

        <InfoRow
          label="Record created"
          value={formatDate(
            animal.created_at
          )}
        />

        <div
          style={{
            marginTop: 16,
          }}
        >
          <FieldHeading>
            Private notes
          </FieldHeading>

          <div
            style={{
              fontSize: 14,
              color: "#3F3D39",
              lineHeight: 1.6,
              whiteSpace:
                "pre-wrap",
            }}
          >
            {animal.notes ||
              "No notes recorded yet."}
          </div>
        </div>
      </Panel>

      {/* ===============================================
          PUBLIC PROFILE & SHARING
      ================================================ */}

      <Panel title="Public Profile & Sharing">
        <div
          style={{
            background:
              isPublic
                ? "#EEF4F0"
                : "#F6F7F8",

            border:
              isPublic
                ? "1px solid #C9DDD1"
                : "1px solid #E0E3E7",

            borderRadius: 8,
            padding: 14,
            marginBottom: 20,
          }}
        >
          <strong
            style={{
              color:
                isPublic
                  ? "#2F6F4E"
                  : "#17233C",
            }}
          >
            {isPublic
              ? "Public profile is published"
              : "Public profile is not published"}
          </strong>

          <p
            style={{
              margin:
                "5px 0 0",
              color: "#6B6862",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {isPublic
              ? "This animal currently has a shareable public Pack of Five profile. The full Rescue Manager file remains private."
              : "You can prepare this information now without making the animal public. Nothing below becomes publicly visible until you choose Publish Public Profile."}
          </p>
        </div>

        {/* BASIC PUBLIC DETAILS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          <div>
            <FieldHeading>
              Birth date
            </FieldHeading>

            <input
              type="date"
              value={birthDate}
              onChange={(e) =>
                setBirthDate(
                  e.target.value
                )
              }
              style={inputStyle}
            />
          </div>

          <div>
            <FieldHeading>
              Sex
            </FieldHeading>

            <select
              value={sex}
              onChange={(e) =>
                setSex(
                  e.target.value
                )
              }
              style={inputStyle}
            >
              <option value="">
                Not recorded
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Unknown">
                Unknown
              </option>
            </select>
          </div>

          <div>
            <FieldHeading>
              Weight (lb)
            </FieldHeading>

            <input
              type="number"
              min="0"
              step="0.1"
              value={weightLbs}
              onChange={(e) =>
                setWeightLbs(
                  e.target.value
                )
              }
              style={inputStyle}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
          }}
        >
          <FieldHeading>
            Public summary
          </FieldHeading>

          <textarea
            rows={5}
            value={publicSummary}
            onChange={(e) =>
              setPublicSummary(
                e.target.value
              )
            }
            placeholder="Public-friendly description of the animal, personality, home needs, and other information you want people to see."
            style={inputStyle}
          />
        </div>

        <div
          style={{
            marginTop: 16,
          }}
        >
          <FieldHeading>
            Current public need
          </FieldHeading>

          <textarea
            rows={3}
            value={publicNeed}
            onChange={(e) =>
              setPublicNeed(
                e.target.value
              )
            }
            placeholder="Examples: Foster needed, adoption placement, medical fundraiser, transport assistance."
            style={inputStyle}
          />
        </div>

        <div
          style={{
            marginTop: 16,
          }}
        >
          <FieldHeading>
            External adoption /
            listing URL
          </FieldHeading>

          <input
            type="url"
            value={
              externalListingUrl
            }
            onChange={(e) =>
              setExternalListingUrl(
                e.target.value
              )
            }
            placeholder="https://..."
            style={inputStyle}
          />

          <p
            style={{
              margin:
                "5px 0 0",
              color: "#6B6862",
              fontSize: 12,
              lineHeight: 1.4,
            }}
          >
            Optional. Link to
            Petfinder, Adopt a
            Pet, your rescue
            website, or another
            adoption listing.
          </p>
        </div>

        {/* HELP OFFERS */}

        {animal.open_help_offers >
          0 && (
          <div
            style={{
              marginTop: 18,
              background:
                "#EEF4F0",
              border:
                "1px solid #C9DDD1",
              borderRadius: 8,
              padding: 12,
              color:
                "#2F6F4E",
            }}
          >
            <strong>
              {
                animal.open_help_offers
              }{" "}
              foster/help offer
              {animal.open_help_offers ===
              1
                ? ""
                : "s"}{" "}
              available
            </strong>

            <p
              style={{
                margin:
                  "4px 0 0",
                fontSize: 12.5,
              }}
            >
              Contact information
              from public
              responders remains
              private to the
              managing
              organization.
            </p>
          </div>
        )}

        {/* ACTIONS */}

        <div
          style={{
            marginTop: 22,
            paddingTop: 18,
            borderTop:
              "1px solid #E7E5E1",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems:
                "center",
            }}
          >
            <button
              type="button"
              disabled={
                savingPublic
              }
              onClick={
                saveProfileDraft
              }
              style={
                secondaryButton
              }
            >
              {savingPublic
                ? "Saving…"
                : "Save Profile Draft"}
            </button>

            {!isPublic && (
              <button
                type="button"
                disabled={
                  savingPublic
                }
                onClick={
                  publishProfile
                }
                style={
                  publishButton
                }
              >
                Publish Public
                Profile
              </button>
            )}

            {isPublic && (
              <>
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={
                    secondaryLink
                  }
                >
                  View Public
                  Profile
                </a>

                <button
                  type="button"
                  onClick={
                    copyPublicLink
                  }
                  style={
                    secondaryButton
                  }
                >
                  Copy Public Link
                </button>

                <button
                  type="button"
                  disabled={
                    savingPublic
                  }
                  onClick={
                    unpublishProfile
                  }
                  style={
                    unpublishButton
                  }
                >
                  Unpublish
                  Profile
                </button>
              </>
            )}
          </div>

          {publicMessage && (
            <p
              style={{
                margin:
                  "12px 0 0",
                fontSize: 13,

                color:
                  publicMessage.includes(
                    "Couldn't"
                  )
                    ? "#B23B2E"
                    : "#2F6F4E",
              }}
            >
              {publicMessage}
            </p>
          )}
        </div>
      </Panel>

      {/* ===============================================
          TIMELINE
      ================================================ */}

      <Panel title="Timeline">
        {animal.timeline.length ===
          0 && (
          <p
            style={{
              color: "#6B6862",
              fontSize: 13.5,
            }}
          >
            No timeline events
            have been recorded.
          </p>
        )}

        {animal.timeline.map(
          (event) => (
            <div
              key={event.id}
              style={{
                borderLeft:
                  "3px solid #D8D6D2",
                paddingLeft: 12,
                marginBottom: 14,
              }}
            >
              <strong
                style={{
                  display:
                    "block",
                  fontSize: 13.5,
                  color:
                    "#17233C",
                  textTransform:
                    "capitalize",
                }}
              >
                {event.event_type.replace(
                  /_/g,
                  " "
                )}
              </strong>

              <span
                style={{
                  fontSize: 12,
                  color:
                    "#6B6862",
                }}
              >
                {formatDate(
                  event.started_at
                )}
              </span>
            </div>
          )
        )}
      </Panel>
    </section>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function Panel({
  title,
  children,
}: {
  title: string;
  children:
    React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border:
          "1px solid #E7E5E1",
        borderRadius: 10,
        padding: 20,
        marginBottom: 18,
      }}
    >
      <h2
        style={{
          fontSize: 18,
          color: "#17233C",
          margin:
            "0 0 16px",
        }}
      >
        {title}
      </h2>

      {children}
    </div>
  );
}

function RecordCard({
  title,
  text,
  active = false,
  href,
}: {
  title: string;
  text: string;
  active?: boolean;
  href?: string;
}) {
  const content = (
    <>
      <strong
        style={{
          display: "block",
          color: "#17233C",
          fontSize: 15,
          marginBottom: 6,
        }}
      >
        {title}
      </strong>

      <p
        style={{
          margin: 0,
          color: "#6B6862",
          fontSize: 12.5,
          lineHeight: 1.5,
        }}
      >
        {text}
      </p>
    </>
  );

  const style = {
    display: "block",

    background:
      active
        ? "#F6F7F8"
        : "#fff",

    border:
      active
        ? "1px solid #B9C1CF"
        : "1px solid #E7E5E1",

    borderRadius: 9,
    padding: 15,
    textDecoration:
      "none",
  } as const;

  return href ? (
    <a
      href={href}
      style={style}
    >
      {content}
    </a>
  ) : (
    <div style={style}>
      {content}
    </div>
  );
}

function StatusBadge({
  label,
}: {
  label: string;
}) {
  return (
    <span
      style={{
        display:
          "inline-block",
        background:
          "#F1F3F5",
        border:
          "1px solid #E0E3E7",
        borderRadius: 20,
        padding:
          "5px 9px",
        color: "#4F5661",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value:
    | string
    | null;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "150px minmax(0, 1fr)",
        gap: 12,
        padding:
          "8px 0",
        borderBottom:
          "1px solid #F0EFED",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#6B6862",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 13.5,
          color: "#1C1B19",
        }}
      >
        {value ||
          "Not recorded"}
      </div>
    </div>
  );
}

function FieldHeading({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div
      style={{
        fontSize: 11.5,
        textTransform:
          "uppercase",
        letterSpacing:
          ".05em",
        color: "#6B6862",
        marginBottom: 5,
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   AGE / FORMATTING
========================================================= */

function calculateAge(
  birthDate:
    | string
    | null
) {
  if (!birthDate) {
    return null;
  }

  const birth =
    new Date(birthDate);

  if (
    Number.isNaN(
      birth.getTime()
    )
  ) {
    return null;
  }

  const now =
    new Date();

  let years =
    now.getFullYear() -
    birth.getFullYear();

  if (
    now.getMonth() <
      birth.getMonth() ||
    (
      now.getMonth() ===
        birth.getMonth() &&
      now.getDate() <
        birth.getDate()
    )
  ) {
    years--;
  }

  if (years >= 1) {
    return `${years} yr${
      years === 1
        ? ""
        : "s"
    }`;
  }

  let months =
    (
      now.getFullYear() -
      birth.getFullYear()
    ) *
      12 +
    now.getMonth() -
    birth.getMonth();

  if (
    now.getDate() <
    birth.getDate()
  ) {
    months--;
  }

  months =
    Math.max(
      months,
      0
    );

  return months >= 1
    ? `${months} mo`
    : "Under 1 mo";
}

function formatValue(
  value: string
) {
  return value
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

function formatDate(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString();
}

/* =========================================================
   STYLES
========================================================= */

const inputStyle:
  React.CSSProperties =
{
  width: "100%",
  boxSizing:
    "border-box",
  padding: 9,
  border:
    "1px solid #D8D6D2",
  borderRadius: 7,
  fontSize: 13.5,
  fontFamily:
    "inherit",
  color: "#1C1B19",
};

const secondaryButton:
  React.CSSProperties =
{
  background: "#fff",
  color: "#17233C",
  border:
    "1px solid #D8D6D2",
  borderRadius: 7,
  padding:
    "9px 14px",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};

const publishButton:
  React.CSSProperties =
{
  background: "#17233C",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  padding:
    "9px 14px",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};

const unpublishButton:
  React.CSSProperties =
{
  background: "#fff",
  color: "#85571F",
  border:
    "1px solid #C58A42",
  borderRadius: 7,
  padding:
    "9px 14px",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};

const secondaryLink:
  React.CSSProperties =
{
  ...secondaryButton,
  textDecoration:
    "none",
  display:
    "inline-block",
};
