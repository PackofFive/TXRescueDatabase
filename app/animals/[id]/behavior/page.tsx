"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type BehaviorProfile = {
  animal_id: string;
  summary: string | null;
  handling_notes: string | null;
  training_plan: string | null;
  restrictions: string | null;
  dog_compatibility: string | null;
  cat_compatibility: string | null;
  child_compatibility: string | null;
  stranger_compatibility: string | null;
  home_environment_notes: string | null;
  updated_at: string;
};

type BehaviorEntry = {
  id: string;
  observed_at: string;
  behavior_type: string | null;
  severity:
    | "low"
    | "moderate"
    | "high"
    | "critical"
    | null;
  trigger: string | null;
  observation: string;
  response_taken: string | null;
  outcome: string | null;
  status:
    | "current"
    | "monitoring"
    | "resolved";
  recorded_by_email: string | null;
  created_at: string;
  updated_at: string;
};

type ProfileDraft = {
  summary: string;
  handlingNotes: string;
  trainingPlan: string;
  restrictions: string;
  dogCompatibility: string;
  catCompatibility: string;
  childCompatibility: string;
  strangerCompatibility: string;
  homeEnvironmentNotes: string;
};

type EntryDraft = {
  observedAt: string;
  behaviorType: string;
  severity: string;
  trigger: string;
  observation: string;
  responseTaken: string;
  outcome: string;
  status: string;
};

const EMPTY_PROFILE: ProfileDraft = {
  summary: "",
  handlingNotes: "",
  trainingPlan: "",
  restrictions: "",
  dogCompatibility: "",
  catCompatibility: "",
  childCompatibility: "",
  strangerCompatibility: "",
  homeEnvironmentNotes: "",
};

const EMPTY_ENTRY: EntryDraft = {
  observedAt: "",
  behaviorType: "",
  severity: "",
  trigger: "",
  observation: "",
  responseTaken: "",
  outcome: "",
  status: "current",
};

const BEHAVIOR_TYPES = [
  "Fear / Anxiety",
  "Reactivity",
  "Resource Guarding",
  "Handling",
  "Separation",
  "Housetraining",
  "Leash Behavior",
  "Social Behavior",
  "Destructive Behavior",
  "Escape / Flight Risk",
  "Bite / Aggression Concern",
  "Training Progress",
  "Other",
];

const COMPATIBILITY_OPTIONS = [
  "",
  "Unknown",
  "Good",
  "Generally Good",
  "Selective",
  "Needs Slow Introduction",
  "Not Recommended",
  "Needs Further Evaluation",
];

export default function BehaviorPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const [
    animalId,
    setAnimalId,
  ] = useState("");

  const [
    profile,
    setProfile,
  ] =
    useState<BehaviorProfile | null>(
      null
    );

  const [
    profileDraft,
    setProfileDraft,
  ] =
    useState<ProfileDraft>(
      EMPTY_PROFILE
    );

  const [
    entries,
    setEntries,
  ] =
    useState<BehaviorEntry[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const [
    message,
    setMessage,
  ] =
    useState<string | null>(
      null
    );

  const [
    editingProfile,
    setEditingProfile,
  ] = useState(false);

  const [
    savingProfile,
    setSavingProfile,
  ] = useState(false);

  const [
    showAddEntry,
    setShowAddEntry,
  ] = useState(false);

  const [
    savingEntry,
    setSavingEntry,
  ] = useState(false);

  const [
    entryDraft,
    setEntryDraft,
  ] =
    useState<EntryDraft>(
      EMPTY_ENTRY
    );

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("active");

  const [
    historyExpanded,
    setHistoryExpanded,
  ] = useState(false);

  /* =====================================================
     RESOLVE PARAM
  ===================================================== */

  useEffect(() => {
    params.then(
      ({ id }) => {
        setAnimalId(id);
      }
    );
  }, [params]);

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    if (!animalId) {
      return;
    }

    loadBehavior();
  }, [animalId]);

  async function loadBehavior() {
    setLoading(true);
    setError(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/behavior`,
          {
            cache: "no-store",
            credentials:
              "same-origin",
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't load behavior information."
        );
      }

      const loadedProfile =
        data.profile ??
        null;

      setProfile(
        loadedProfile
      );

      setProfileDraft(
        profileToDraft(
          loadedProfile
        )
      );

      setEntries(
        Array.isArray(
          data.entries
        )
          ? data.entries
          : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load behavior information."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     FILTERED ENTRIES
  ===================================================== */

  const activeEntries =
    useMemo(
      () =>
        entries.filter(
          (entry) =>
            entry.status !==
            "resolved"
        ),
      [entries]
    );

  const resolvedEntries =
    useMemo(
      () =>
        entries.filter(
          (entry) =>
            entry.status ===
            "resolved"
        ),
      [entries]
    );

  const filteredEntries =
    useMemo(() => {
      if (
        statusFilter ===
        "current"
      ) {
        return entries.filter(
          (entry) =>
            entry.status ===
            "current"
        );
      }

      if (
        statusFilter ===
        "monitoring"
      ) {
        return entries.filter(
          (entry) =>
            entry.status ===
            "monitoring"
        );
      }

      if (
        statusFilter ===
        "resolved"
      ) {
        return resolvedEntries;
      }

      return activeEntries;
    }, [
      entries,
      activeEntries,
      resolvedEntries,
      statusFilter,
    ]);

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  async function saveProfile() {
    setSavingProfile(true);
    setError(null);
    setMessage(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/behavior`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "same-origin",

            body:
              JSON.stringify({
                action:
                  "update_profile",

                ...profileDraft,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't save behavior profile."
        );
      }

      setProfile(
        data.profile
      );

      setProfileDraft(
        profileToDraft(
          data.profile
        )
      );

      setEditingProfile(
        false
      );

      setMessage(
        "Behavior profile saved."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't save behavior profile."
      );
    } finally {
      setSavingProfile(
        false
      );
    }
  }

  /* =====================================================
     ADD ENTRY
  ===================================================== */

  async function addEntry() {
    if (
      !entryDraft.observation.trim()
    ) {
      setError(
        "Observation is required."
      );
      return;
    }

    setSavingEntry(true);
    setError(null);
    setMessage(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/behavior`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "same-origin",

            body:
              JSON.stringify({
                observedAt:
                  entryDraft.observedAt
                    ? new Date(
                        entryDraft.observedAt
                      ).toISOString()
                    : null,

                behaviorType:
                  entryDraft.behaviorType,

                severity:
                  entryDraft.severity,

                trigger:
                  entryDraft.trigger,

                observation:
                  entryDraft.observation,

                responseTaken:
                  entryDraft.responseTaken,

                outcome:
                  entryDraft.outcome,

                status:
                  entryDraft.status,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't add behavior observation."
        );
      }

      setEntries(
        (current) => [
          {
            ...data.entry,
            recorded_by_email:
              null,
          },
          ...current,
        ]
      );

      setEntryDraft(
        EMPTY_ENTRY
      );

      setShowAddEntry(
        false
      );

      setMessage(
        "Behavior observation added."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't add behavior observation."
      );
    } finally {
      setSavingEntry(
        false
      );
    }
  }

  /* =====================================================
     UPDATE STATUS
  ===================================================== */

  async function updateEntryStatus(
    entry: BehaviorEntry,
    status:
      | "current"
      | "monitoring"
      | "resolved"
  ) {
    setError(null);
    setMessage(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}/behavior`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "same-origin",

            body:
              JSON.stringify({
                action:
                  "update_entry",

                entryId:
                  entry.id,

                status,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't update behavior observation."
        );
      }

      setEntries(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              entry.id
                ? {
                    ...item,
                    ...data.entry,
                  }
                : item
          )
      );

      setMessage(
        status ===
          "resolved"
          ? "Observation marked resolved."
          : "Observation status updated."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't update behavior observation."
      );
    }
  }

  /* =====================================================
     PAGE
  ===================================================== */

  if (
    loading ||
    !animalId
  ) {
    return (
      <section>
        <p>Loading…</p>
      </section>
    );
  }

  return (
    <section
      style={{
        maxWidth: 1000,
      }}
    >
      <a
        href={`/animals/${encodeURIComponent(
          animalId
        )}`}
        style={{
          color: "#52627A",
          fontSize: 13,
          fontWeight: 700,
          textDecoration:
            "none",
        }}
      >
        ← Back to Animal
      </a>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          gap: 16,
          margin:
            "14px 0 20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 11.5,
              fontWeight: 800,
              letterSpacing:
                ".08em",
              color: "#6B6862",
              textTransform:
                "uppercase",
            }}
          >
            Private Animal File
          </p>

          <h1
            style={{
              fontSize: 28,
              margin:
                "5px 0 6px",
              color: "#17233C",
            }}
          >
            Behavior
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6B6862",
              fontSize: 13.5,
              lineHeight: 1.5,
              maxWidth: 720,
            }}
          >
            Maintain the
            animal&apos;s current
            behavior picture and
            record observations,
            incidents, triggers,
            responses, and
            progress over time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddEntry(
              (value) =>
                !value
            );

            setError(null);
            setMessage(null);
          }}
          style={primaryButton}
        >
          {showAddEntry
            ? "Cancel"
            : "+ Add Observation"}
        </button>
      </div>

      {error && (
        <Notice
          type="error"
          text={error}
        />
      )}

      {message && (
        <Notice
          type="success"
          text={message}
        />
      )}

      {/* ===============================================
          CURRENT PROFILE
      ================================================ */}

      <div
        style={cardStyle}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: 12,
            alignItems:
              "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={sectionTitle}
            >
              Current Behavior
              Profile
            </h2>

            <p
              style={sectionHelp}
            >
              The working summary
              staff and approved
              caregivers should
              know about this
              animal now.
            </p>
          </div>

          {!editingProfile && (
            <button
              type="button"
              onClick={() => {
                setProfileDraft(
                  profileToDraft(
                    profile
                  )
                );

                setEditingProfile(
                  true
                );

                setError(null);
                setMessage(null);
              }}
              style={
                secondaryButton
              }
            >
              Edit Profile
            </button>
          )}
        </div>

        {editingProfile ? (
          <div
            style={{
              marginTop: 18,
            }}
          >
            <FieldLabel
              label="Current behavior summary"
            >
              <textarea
                value={
                  profileDraft.summary
                }
                onChange={(e) =>
                  updateProfileDraft(
                    setProfileDraft,
                    "summary",
                    e.target.value
                  )
                }
                rows={4}
                style={
                  textareaStyle
                }
                placeholder="Overall current behavior, temperament, important patterns, and major considerations."
              />
            </FieldLabel>

            <div
              style={twoColumnGrid}
            >
              <CompatibilityField
                label="Dogs"
                value={
                  profileDraft.dogCompatibility
                }
                onChange={(
                  value
                ) =>
                  updateProfileDraft(
                    setProfileDraft,
                    "dogCompatibility",
                    value
                  )
                }
              />

              <CompatibilityField
                label="Cats"
                value={
                  profileDraft.catCompatibility
                }
                onChange={(
                  value
                ) =>
                  updateProfileDraft(
                    setProfileDraft,
                    "catCompatibility",
                    value
                  )
                }
              />

              <CompatibilityField
                label="Children"
                value={
                  profileDraft.childCompatibility
                }
                onChange={(
                  value
                ) =>
                  updateProfileDraft(
                    setProfileDraft,
                    "childCompatibility",
                    value
                  )
                }
              />

              <CompatibilityField
                label="Strangers"
                value={
                  profileDraft.strangerCompatibility
                }
                onChange={(
                  value
                ) =>
                  updateProfileDraft(
                    setProfileDraft,
                    "strangerCompatibility",
                    value
                  )
                }
              />
            </div>

            <FieldLabel
              label="Handling notes"
            >
              <textarea
                value={
                  profileDraft.handlingNotes
                }
                onChange={(e) =>
                  updateProfileDraft(
                    setProfileDraft,
                    "handlingNotes",
                    e.target.value
                  )
                }
                rows={3}
                style={
                  textareaStyle
                }
                placeholder="Leash handling, touch sensitivities, restraint, grooming, feeding, crate handling, etc."
              />
            </FieldLabel>

            <FieldLabel
              label="Restrictions / safety notes"
            >
              <textarea
                value={
                  profileDraft.restrictions
                }
                onChange={(e) =>
                  updateProfileDraft(
                    setProfileDraft,
                    "restrictions",
                    e.target.value
                  )
                }
                rows={3}
                style={
                  textareaStyle
                }
                placeholder="Current restrictions, separation requirements, bite precautions, flight-risk precautions, or other safety information."
              />
            </FieldLabel>

            <FieldLabel
              label="Training / behavior plan"
            >
              <textarea
                value={
                  profileDraft.trainingPlan
                }
                onChange={(e) =>
                  updateProfileDraft(
                    setProfileDraft,
                    "trainingPlan",
                    e.target.value
                  )
                }
                rows={3}
                style={
                  textareaStyle
                }
                placeholder="Current training plan, behavior modification work, goals, or professional recommendations."
              />
            </FieldLabel>

            <FieldLabel
              label="Home environment notes"
            >
              <textarea
                value={
                  profileDraft.homeEnvironmentNotes
                }
                onChange={(e) =>
                  updateProfileDraft(
                    setProfileDraft,
                    "homeEnvironmentNotes",
                    e.target.value
                  )
                }
                rows={3}
                style={
                  textareaStyle
                }
                placeholder="Environment where this animal is most successful or situations that should be avoided."
              />
            </FieldLabel>

            <div
              style={{
                display: "flex",
                gap: 9,
                flexWrap: "wrap",
                marginTop: 14,
              }}
            >
              <button
                type="button"
                disabled={
                  savingProfile
                }
                onClick={
                  saveProfile
                }
                style={
                  primaryButton
                }
              >
                {savingProfile
                  ? "Saving…"
                  : "Save Profile"}
              </button>

              <button
                type="button"
                disabled={
                  savingProfile
                }
                onClick={() => {
                  setProfileDraft(
                    profileToDraft(
                      profile
                    )
                  );

                  setEditingProfile(
                    false
                  );
                }}
                style={
                  secondaryButton
                }
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <BehaviorProfileView
            profile={profile}
          />
        )}
      </div>

      {/* ===============================================
          ADD OBSERVATION
      ================================================ */}

      {showAddEntry && (
        <div
          style={{
            ...cardStyle,
            marginTop: 16,
          }}
        >
          <h2
            style={sectionTitle}
          >
            Add Behavior
            Observation
          </h2>

          <p
            style={sectionHelp}
          >
            Record what was
            actually observed.
            Avoid assumptions
            when the cause or
            trigger is unknown.
          </p>

          <div
            style={{
              ...twoColumnGrid,
              marginTop: 16,
            }}
          >
            <FieldLabel
              label="Observed date & time"
            >
              <input
                type="datetime-local"
                value={
                  entryDraft.observedAt
                }
                onChange={(e) =>
                  updateEntryDraft(
                    setEntryDraft,
                    "observedAt",
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              />
            </FieldLabel>

            <FieldLabel
              label="Behavior type"
            >
              <select
                value={
                  entryDraft.behaviorType
                }
                onChange={(e) =>
                  updateEntryDraft(
                    setEntryDraft,
                    "behaviorType",
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              >
                <option value="">
                  Select…
                </option>

                {BEHAVIOR_TYPES.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>
            </FieldLabel>

            <FieldLabel
              label="Severity"
            >
              <select
                value={
                  entryDraft.severity
                }
                onChange={(e) =>
                  updateEntryDraft(
                    setEntryDraft,
                    "severity",
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              >
                <option value="">
                  Not rated
                </option>
                <option value="low">
                  Low
                </option>
                <option value="moderate">
                  Moderate
                </option>
                <option value="high">
                  High
                </option>
                <option value="critical">
                  Critical
                </option>
              </select>
            </FieldLabel>

            <FieldLabel
              label="Status"
            >
              <select
                value={
                  entryDraft.status
                }
                onChange={(e) =>
                  updateEntryDraft(
                    setEntryDraft,
                    "status",
                    e.target.value
                  )
                }
                style={
                  inputStyle
                }
              >
                <option value="current">
                  Current
                </option>
                <option value="monitoring">
                  Monitoring
                </option>
                <option value="resolved">
                  Resolved
                </option>
              </select>
            </FieldLabel>
          </div>

          <FieldLabel
            label="Known or suspected trigger"
          >
            <input
              value={
                entryDraft.trigger
              }
              onChange={(e) =>
                updateEntryDraft(
                  setEntryDraft,
                  "trigger",
                  e.target.value
                )
              }
              style={inputStyle}
              placeholder="Example: another dog approached food bowl"
            />
          </FieldLabel>

          <FieldLabel
            label="Observation"
            required
          >
            <textarea
              value={
                entryDraft.observation
              }
              onChange={(e) =>
                updateEntryDraft(
                  setEntryDraft,
                  "observation",
                  e.target.value
                )
              }
              rows={4}
              style={
                textareaStyle
              }
              placeholder="Describe exactly what happened or what behavior was observed."
            />
          </FieldLabel>

          <FieldLabel
            label="Response taken"
          >
            <textarea
              value={
                entryDraft.responseTaken
              }
              onChange={(e) =>
                updateEntryDraft(
                  setEntryDraft,
                  "responseTaken",
                  e.target.value
                )
              }
              rows={3}
              style={
                textareaStyle
              }
              placeholder="What did the caregiver, foster, trainer, or staff member do in response?"
            />
          </FieldLabel>

          <FieldLabel
            label="Outcome / follow-up"
          >
            <textarea
              value={
                entryDraft.outcome
              }
              onChange={(e) =>
                updateEntryDraft(
                  setEntryDraft,
                  "outcome",
                  e.target.value
                )
              }
              rows={3}
              style={
                textareaStyle
              }
              placeholder="Result, recommended follow-up, or changes to the care plan."
            />
          </FieldLabel>

          <button
            type="button"
            disabled={
              savingEntry
            }
            onClick={addEntry}
            style={
              primaryButton
            }
          >
            {savingEntry
              ? "Saving…"
              : "Save Observation"}
          </button>
        </div>
      )}

      {/* ===============================================
          OBSERVATIONS
      ================================================ */}

      <div
        style={{
          ...cardStyle,
          marginTop: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "flex-start",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={sectionTitle}
            >
              Behavior
              Observations
            </h2>

            <p
              style={sectionHelp}
            >
              {activeEntries.length}{" "}
              active or monitoring
              observation
              {activeEntries.length ===
              1
                ? ""
                : "s"}
              .
            </p>
          </div>

          <select
            value={
              statusFilter
            }
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            style={{
              ...inputStyle,
              width: "auto",
              minWidth: 170,
            }}
          >
            <option value="active">
              Current +
              Monitoring
            </option>

            <option value="current">
              Current
            </option>

            <option value="monitoring">
              Monitoring
            </option>

            <option value="resolved">
              Resolved
            </option>
          </select>
        </div>

        {filteredEntries.length ===
        0 ? (
          <div
            style={emptyStyle}
          >
            No behavior
            observations in this
            view.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 16,
            }}
          >
            {filteredEntries.map(
              (entry) => (
                <BehaviorEntryCard
                  key={entry.id}
                  entry={entry}
                  onStatusChange={
                    updateEntryStatus
                  }
                />
              )
            )}
          </div>
        )}
      </div>

      {/* ===============================================
          COLLAPSED RESOLVED HISTORY
      ================================================ */}

      {statusFilter !==
        "resolved" &&
        resolvedEntries.length >
          0 && (
          <div
            style={{
              ...cardStyle,
              marginTop: 16,
            }}
          >
            <button
              type="button"
              onClick={() =>
                setHistoryExpanded(
                  (value) =>
                    !value
                )
              }
              style={{
                width: "100%",
                border: "none",
                background:
                  "transparent",
                padding: 0,
                cursor: "pointer",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                gap: 10,
                color:
                  "#17233C",
                fontFamily:
                  "inherit",
                textAlign: "left",
              }}
            >
              <strong>
                Resolved Behavior
                History (
                {
                  resolvedEntries.length
                }
                )
              </strong>

              <span>
                {historyExpanded
                  ? "▲"
                  : "▼"}
              </span>
            </button>

            {historyExpanded && (
              <div
                style={{
                  display: "grid",
                  gap: 10,
                  marginTop: 16,
                }}
              >
                {resolvedEntries.map(
                  (entry) => (
                    <BehaviorEntryCard
                      key={
                        entry.id
                      }
                      entry={
                        entry
                      }
                      onStatusChange={
                        updateEntryStatus
                      }
                    />
                  )
                )}
              </div>
            )}
          </div>
        )}
    </section>
  );
}

/* =========================================================
   PROFILE VIEW
========================================================= */

function BehaviorProfileView({
  profile,
}: {
  profile:
    | BehaviorProfile
    | null;
}) {
  if (!profile) {
    return (
      <div
        style={emptyStyle}
      >
        No current behavior
        profile has been added
        yet.
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: 16,
      }}
    >
      {profile.summary ? (
        <p
          style={{
            margin:
              "0 0 16px",
            color: "#35332F",
            fontSize: 14,
            lineHeight: 1.6,
            whiteSpace:
              "pre-wrap",
          }}
        >
          {profile.summary}
        </p>
      ) : (
        <p
          style={{
            color: "#77736D",
            fontSize: 13,
          }}
        >
          No current summary.
        </p>
      )}

      <div
        style={twoColumnGrid}
      >
        <InfoItem
          label="Dogs"
          value={
            profile.dog_compatibility
          }
        />

        <InfoItem
          label="Cats"
          value={
            profile.cat_compatibility
          }
        />

        <InfoItem
          label="Children"
          value={
            profile.child_compatibility
          }
        />

        <InfoItem
          label="Strangers"
          value={
            profile.stranger_compatibility
          }
        />
      </div>

      <LongInfoItem
        label="Handling notes"
        value={
          profile.handling_notes
        }
      />

      <LongInfoItem
        label="Restrictions / safety notes"
        value={
          profile.restrictions
        }
      />

      <LongInfoItem
        label="Training / behavior plan"
        value={
          profile.training_plan
        }
      />

      <LongInfoItem
        label="Home environment"
        value={
          profile.home_environment_notes
        }
      />

      <div
        style={{
          fontSize: 11.5,
          color: "#8A8782",
          marginTop: 14,
        }}
      >
        Last updated{" "}
        {formatDateTime(
          profile.updated_at
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ENTRY CARD
========================================================= */

function BehaviorEntryCard({
  entry,
  onStatusChange,
}: {
  entry: BehaviorEntry;

  onStatusChange: (
    entry: BehaviorEntry,
    status:
      | "current"
      | "monitoring"
      | "resolved"
  ) => void;
}) {
  const [
    expanded,
    setExpanded,
  ] = useState(false);

  return (
    <div
      style={{
        border:
          entry.severity ===
            "critical" ||
          entry.severity ===
            "high"
            ? "1px solid #E4B9B3"
            : "1px solid #E7E5E1",

        borderRadius: 9,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <button
        type="button"
        onClick={() =>
          setExpanded(
            (value) =>
              !value
          )
        }
        style={{
          width: "100%",
          border: "none",
          background:
            entry.severity ===
              "critical"
              ? "#FFF3F1"
              : entry.severity ===
                "high"
              ? "#FFF8F6"
              : "#fff",
          padding: 13,
          cursor: "pointer",
          textAlign: "left",
          fontFamily:
            "inherit",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: 12,
            alignItems:
              "flex-start",
          }}
        >
          <div
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                alignItems:
                  "center",
                marginBottom: 5,
              }}
            >
              <strong
                style={{
                  color:
                    "#17233C",
                  fontSize: 13.5,
                }}
              >
                {entry.behavior_type ||
                  "Behavior Observation"}
              </strong>

              {entry.severity && (
                <SeverityBadge
                  severity={
                    entry.severity
                  }
                />
              )}

              <StatusBadge
                status={
                  entry.status
                }
              />
            </div>

            <div
              style={{
                fontSize: 12,
                color:
                  "#6B6862",
              }}
            >
              {formatDateTime(
                entry.observed_at
              )}
            </div>

            <p
              style={{
                margin:
                  "7px 0 0",
                fontSize: 13,
                lineHeight: 1.5,
                color:
                  "#35332F",
              }}
            >
              {entry.observation}
            </p>
          </div>

          <span
            style={{
              color:
                "#6B6862",
              flexShrink: 0,
            }}
          >
            {expanded
              ? "▲"
              : "▼"}
          </span>
        </div>
      </button>

      {expanded && (
        <div
          style={{
            borderTop:
              "1px solid #EEECE8",
            padding: 13,
          }}
        >
          <LongInfoItem
            label="Trigger"
            value={
              entry.trigger
            }
          />

          <LongInfoItem
            label="Response taken"
            value={
              entry.response_taken
            }
          />

          <LongInfoItem
            label="Outcome / follow-up"
            value={
              entry.outcome
            }
          />

          {entry.recorded_by_email && (
            <div
              style={{
                fontSize: 12,
                color:
                  "#6B6862",
                marginBottom: 12,
              }}
            >
              Recorded by{" "}
              {
                entry.recorded_by_email
              }
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {entry.status !==
              "current" && (
              <button
                type="button"
                onClick={() =>
                  onStatusChange(
                    entry,
                    "current"
                  )
                }
                style={
                  smallButton
                }
              >
                Mark Current
              </button>
            )}

            {entry.status !==
              "monitoring" && (
              <button
                type="button"
                onClick={() =>
                  onStatusChange(
                    entry,
                    "monitoring"
                  )
                }
                style={
                  smallButton
                }
              >
                Monitor
              </button>
            )}

            {entry.status !==
              "resolved" && (
              <button
                type="button"
                onClick={() =>
                  onStatusChange(
                    entry,
                    "resolved"
                  )
                }
                style={
                  smallButton
                }
              >
                Mark Resolved
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function CompatibilityField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <FieldLabel
      label={label}
    >
      <select
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        style={inputStyle}
      >
        {COMPATIBILITY_OPTIONS.map(
          (option) => (
            <option
              key={
                option ||
                "blank"
              }
              value={option}
            >
              {option ||
                "Not recorded"}
            </option>
          )
        )}
      </select>
    </FieldLabel>
  );
}

function FieldLabel({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children:
    React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "block",
        marginBottom: 14,
      }}
    >
      <span
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 700,
          color: "#4F4D49",
          marginBottom: 5,
        }}
      >
        {label}
        {required
          ? " *"
          : ""}
      </span>

      {children}
    </label>
  );
}

function InfoItem({
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
        marginBottom: 12,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: "#77736D",
          textTransform:
            "uppercase",
          letterSpacing:
            ".05em",
          marginBottom: 3,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 13.5,
          color: "#35332F",
        }}
      >
        {value ||
          "Not recorded"}
      </div>
    </div>
  );
}

function LongInfoItem({
  label,
  value,
}: {
  label: string;
  value:
    | string
    | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: 12,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: "#77736D",
          textTransform:
            "uppercase",
          letterSpacing:
            ".05em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 13.5,
          lineHeight: 1.55,
          color: "#35332F",
          whiteSpace:
            "pre-wrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function SeverityBadge({
  severity,
}: {
  severity:
    | "low"
    | "moderate"
    | "high"
    | "critical";
}) {
  const label =
    severity.charAt(0)
      .toUpperCase() +
    severity.slice(1);

  const background =
    severity ===
    "critical"
      ? "#FBE5E2"
      : severity ===
        "high"
      ? "#FCEDEA"
      : severity ===
        "moderate"
      ? "#FFF3D9"
      : "#EEF4F0";

  const color =
    severity ===
      "critical" ||
    severity ===
      "high"
      ? "#A83A2D"
      : severity ===
        "moderate"
      ? "#85571F"
      : "#2F6F4E";

  return (
    <span
      style={{
        borderRadius: 20,
        padding:
          "3px 7px",
        fontSize: 10.5,
        fontWeight: 800,
        background,
        color,
      }}
    >
      {label}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status:
    | "current"
    | "monitoring"
    | "resolved";
}) {
  return (
    <span
      style={{
        borderRadius: 20,
        padding:
          "3px 7px",
        fontSize: 10.5,
        fontWeight: 700,
        background:
          status ===
          "resolved"
            ? "#F0F0EE"
            : status ===
              "monitoring"
            ? "#EEF1F5"
            : "#EEF4F0",
        color:
          status ===
          "resolved"
            ? "#6B6862"
            : status ===
              "monitoring"
            ? "#52627A"
            : "#2F6F4E",
      }}
    >
      {formatValue(
        status
      )}
    </span>
  );
}

function Notice({
  type,
  text,
}: {
  type:
    | "error"
    | "success";
  text: string;
}) {
  return (
    <div
      style={{
        padding: 11,
        marginBottom: 14,
        borderRadius: 8,
        fontSize: 13,
        background:
          type ===
          "error"
            ? "#FFF4F2"
            : "#F1F7F3",
        border:
          type ===
          "error"
            ? "1px solid #F3C7BF"
            : "1px solid #C9DDD1",
        color:
          type ===
          "error"
            ? "#B23B2E"
            : "#2F6F4E",
      }}
    >
      {text}
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function profileToDraft(
  profile:
    | BehaviorProfile
    | null
): ProfileDraft {
  if (!profile) {
    return {
      ...EMPTY_PROFILE,
    };
  }

  return {
    summary:
      profile.summary ??
      "",

    handlingNotes:
      profile.handling_notes ??
      "",

    trainingPlan:
      profile.training_plan ??
      "",

    restrictions:
      profile.restrictions ??
      "",

    dogCompatibility:
      profile.dog_compatibility ??
      "",

    catCompatibility:
      profile.cat_compatibility ??
      "",

    childCompatibility:
      profile.child_compatibility ??
      "",

    strangerCompatibility:
      profile.stranger_compatibility ??
      "",

    homeEnvironmentNotes:
      profile.home_environment_notes ??
      "",
  };
}

function updateProfileDraft(
  setter: React.Dispatch<
    React.SetStateAction<ProfileDraft>
  >,
  key: keyof ProfileDraft,
  value: string
) {
  setter(
    (current) => ({
      ...current,
      [key]: value,
    })
  );
}

function updateEntryDraft(
  setter: React.Dispatch<
    React.SetStateAction<EntryDraft>
  >,
  key: keyof EntryDraft,
  value: string
) {
  setter(
    (current) => ({
      ...current,
      [key]: value,
    })
  );
}

function formatValue(
  value: string
) {
  return value
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    );
}

function formatDateTime(
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

  return date.toLocaleString(
    [],
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

/* =========================================================
   STYLES
========================================================= */

const cardStyle:
  React.CSSProperties =
{
  background: "#fff",
  border:
    "1px solid #E7E5E1",
  borderRadius: 11,
  padding: 18,
};

const sectionTitle:
  React.CSSProperties =
{
  margin: 0,
  fontSize: 18,
  color: "#17233C",
};

const sectionHelp:
  React.CSSProperties =
{
  margin: "4px 0 0",
  color: "#6B6862",
  fontSize: 12.5,
  lineHeight: 1.5,
};

const twoColumnGrid:
  React.CSSProperties =
{
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "0 14px",
};

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
  fontSize: 13,
  fontFamily: "inherit",
  background: "#fff",
  color: "#1C1B19",
};

const textareaStyle:
  React.CSSProperties =
{
  ...inputStyle,
  resize: "vertical",
  lineHeight: 1.5,
};

const primaryButton:
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

const smallButton:
  React.CSSProperties =
{
  background: "#fff",
  color: "#17233C",
  border:
    "1px solid #D8D6D2",
  borderRadius: 6,
  padding: "6px 9px",
  fontSize: 11.5,
  fontWeight: 700,
  cursor: "pointer",
};

const emptyStyle:
  React.CSSProperties =
{
  marginTop: 16,
  padding: 16,
  border:
    "1px dashed #D8D6D2",
  borderRadius: 8,
  color: "#77736D",
  fontSize: 13,
  background: "#FCFCFB",
};
