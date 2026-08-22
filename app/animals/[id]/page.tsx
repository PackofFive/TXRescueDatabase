"use client";

import {
  useEffect,
  useMemo,
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

  public_name: string | null;
  public_species: string | null;
  public_breed_or_type: string | null;
  public_birth_date: string | null;
  public_sex: string | null;
  public_weight_lbs: string | number | null;

  public_share_enabled: boolean;
  public_summary: string | null;
  public_need: string | null;
  external_listing_url: string | null;

  outcome_status: string | null;
  outcome_date: string | null;
  public_outcome_message: string | null;
  show_on_success_wall: boolean;

  open_help_offers: number;
  open_reminders: number;

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

type OverviewDraft = {
  name: string;
  temporaryName: string;
  species: string;
  breedOrType: string;
  source: string;
  custody: string;
  placement: string;
  urgency: string;
  birthDate: string;
  sex: string;
  weightLbs: string;
  notes: string;
};

type PublicSyncField =
  | "name"
  | "species"
  | "breed_or_type"
  | "birth_date"
  | "sex"
  | "weight_lbs";

type SyncOption = {
  field: PublicSyncField;
  label: string;
  oldValue: string;
  newValue: string;
  selected: boolean;
};

export default function AnimalRecordPage() {
  const params = useParams();

  const animalId =
    params?.id as string;

  const [
    animal,
    setAnimal,
  ] =
    useState<Animal | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const [
    editingOverview,
    setEditingOverview,
  ] =
    useState(false);

  const [
    overviewDraft,
    setOverviewDraft,
  ] =
    useState<OverviewDraft | null>(
      null
    );

  const [
    savingOverview,
    setSavingOverview,
  ] =
    useState(false);

  const [
    overviewMessage,
    setOverviewMessage,
  ] =
    useState<string | null>(
      null
    );

  const [
    syncOptions,
    setSyncOptions,
  ] =
    useState<SyncOption[]>([]);

  const [
    pendingOverviewSave,
    setPendingOverviewSave,
  ] =
    useState<OverviewDraft | null>(
      null
    );

  const [
    savingPublic,
    setSavingPublic,
  ] =
    useState(false);

  const [
    publicMessage,
    setPublicMessage,
  ] =
    useState<string | null>(
      null
    );

  const [
    fileMenuOpen,
    setFileMenuOpen,
  ] =
    useState(false);

  /* =====================================================
     PUBLIC PROFILE DRAFT
  ===================================================== */

  const [
    publicSummary,
    setPublicSummary,
  ] =
    useState("");

  const [
    publicNeed,
    setPublicNeed,
  ] =
    useState("");

  const [
    externalListingUrl,
    setExternalListingUrl,
  ] =
    useState("");

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    if (!animalId) {
      return;
    }

    loadAnimal();
  }, [animalId]);

  async function loadAnimal() {
    setLoading(true);
    setError(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}`,
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
            "Failed to load animal."
        );
      }

      const loaded =
        data.animal as Animal;

      setAnimal(loaded);

      setOverviewDraft(
        createOverviewDraft(
          loaded
        )
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
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load animal."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     EDIT OVERVIEW
  ===================================================== */

  function startOverviewEdit() {
    if (!animal) {
      return;
    }

    setOverviewDraft(
      createOverviewDraft(
        animal
      )
    );

    setOverviewMessage(
      null
    );

    setEditingOverview(
      true
    );
  }

  function cancelOverviewEdit() {
    if (animal) {
      setOverviewDraft(
        createOverviewDraft(
          animal
        )
      );
    }

    setEditingOverview(
      false
    );

    setSyncOptions([]);
    setPendingOverviewSave(
      null
    );
  }

  function updateOverviewField(
    key: keyof OverviewDraft,
    value: string
  ) {
    setOverviewDraft(
      (current) =>
        current
          ? {
              ...current,
              [key]: value,
            }
          : current
    );
  }

  async function requestOverviewSave() {
    if (
      !animal ||
      !overviewDraft
    ) {
      return;
    }

    const syncCandidates =
      getPublicSyncCandidates(
        animal,
        overviewDraft
      );

    if (
      animal.public_share_enabled &&
      syncCandidates.length >
        0
    ) {
      setPendingOverviewSave(
        overviewDraft
      );

      setSyncOptions(
        syncCandidates
      );

      return;
    }

    await performOverviewSave(
      overviewDraft,
      []
    );
  }

  async function saveWithPublicSync() {
    if (
      !pendingOverviewSave
    ) {
      return;
    }

    const selectedFields =
      syncOptions
        .filter(
          (option) =>
            option.selected
        )
        .map(
          (option) =>
            option.field
        );

    await performOverviewSave(
      pendingOverviewSave,
      selectedFields
    );

    setSyncOptions([]);
    setPendingOverviewSave(
      null
    );
  }

  async function saveWithoutPublicSync() {
    if (
      !pendingOverviewSave
    ) {
      return;
    }

    await performOverviewSave(
      pendingOverviewSave,
      []
    );

    setSyncOptions([]);
    setPendingOverviewSave(
      null
    );
  }

  async function performOverviewSave(
    draft: OverviewDraft,
    publicSyncFields: PublicSyncField[]
  ) {
    setSavingOverview(
      true
    );

    setOverviewMessage(
      null
    );

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name:
                  draft.name,

                temporaryName:
                  draft.temporaryName,

                species:
                  draft.species,

                breedOrType:
                  draft.breedOrType,

                source:
                  draft.source,

                custody:
                  draft.custody,

                placement:
                  draft.placement,

                urgency:
                  draft.urgency,

                birthDate:
                  draft.birthDate,

                sex:
                  draft.sex,

                weightLbs:
                  draft.weightLbs,

                notes:
                  draft.notes,

                publicSyncFields,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't save overview."
        );
      }

      const updated =
        data.animal as Animal;

      setAnimal(
        (current) =>
          current
            ? {
                ...current,
                ...updated,
              }
            : updated
      );

      setOverviewDraft(
        createOverviewDraft(
          updated
        )
      );

      setEditingOverview(
        false
      );

      if (
        publicSyncFields.length >
        0
      ) {
        setOverviewMessage(
          `Overview saved. ${publicSyncFields.length} public profile field${
            publicSyncFields.length ===
            1
              ? ""
              : "s"
          } updated.`
        );
      } else {
        setOverviewMessage(
          "Overview saved."
        );
      }
    } catch (err) {
      setOverviewMessage(
        err instanceof Error
          ? err.message
          : "Couldn't save overview."
      );
    } finally {
      setSavingOverview(
        false
      );
    }
  }

  function toggleSyncOption(
    field: PublicSyncField
  ) {
    setSyncOptions(
      (current) =>
        current.map(
          (option) =>
            option.field ===
            field
              ? {
                  ...option,
                  selected:
                    !option.selected,
                }
              : option
        )
    );
  }

  /* =====================================================
     PUBLIC PROFILE
  ===================================================== */

  async function saveProfileDraft() {
    if (!animal) {
      return;
    }

    await savePublicProfile(
      animal.public_share_enabled,
      "Public profile draft saved."
    );
  }

  async function publishProfile() {
    const confirmed =
      window.confirm(
        "Publish this animal's public profile?\n\nOnly the approved public profile information will be visible. Private notes, medical records, foster contacts, expenses, reminders, and other internal information remain private."
      );

    if (!confirmed) {
      return;
    }

    await savePublicProfile(
      true,
      "Public profile published."
    );
  }

  async function unpublishProfile() {
    const confirmed =
      window.confirm(
        "Unpublish this animal?\n\nThe private Rescue Manager file will remain unchanged, but the public profile will no longer be available."
      );

    if (!confirmed) {
      return;
    }

    await savePublicProfile(
      false,
      "Public profile unpublished."
    );
  }

  async function savePublicProfile(
    publicShareEnabled: boolean,
    successMessage: string
  ) {
    if (!animal) {
      return;
    }

    setSavingPublic(true);
    setPublicMessage(null);

    try {
      const res =
        await fetch(
          `/api/animals/${encodeURIComponent(
            animalId
          )}`,
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                publicShareEnabled,

                publicSummary,
                publicNeed,
                externalListingUrl,

                outcomeStatus:
                  animal.outcome_status,

                outcomeDate:
                  animal.outcome_date
                    ? String(
                        animal.outcome_date
                      ).slice(0, 10)
                    : null,

                publicOutcomeMessage:
                  animal.public_outcome_message,

                showOnSuccessWall:
                  animal.show_on_success_wall,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't save public profile."
        );
      }

      setAnimal(
        (current) =>
          current
            ? {
                ...current,
                ...data.animal,
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
          : "Couldn't save public profile."
      );
    } finally {
      setSavingPublic(false);
    }
  }

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

  /* =====================================================
     STATES
  ===================================================== */

  if (loading) {
    return <p>Loading…</p>;
  }

  if (error) {
    return (
      <div>
        <a
          href="/animals"
          style={backLink}
        >
          ← Back to Animals
        </a>

        <p
          style={{
            color:
              "#B23B2E",
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

  const isPublic =
    animal.public_share_enabled;

  const openHelpOffers =
    Number(
      animal.open_help_offers ??
        0
    );

  const openReminders =
    Number(
      animal.open_reminders ??
        0
    );

  const publicUrl =
    `/pet/${encodeURIComponent(
      animal.id
    )}`;

  return (
    <section>
      <a
        href="/animals"
        style={backLink}
      >
        ← Back to Animals
      </a>

      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems:
            "flex-start",
          marginTop: 18,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {animal.photo?.url ? (
          <img
            src={animal.photo.url}
            alt={displayName}
            style={{
              width: 145,
              height: 145,
              borderRadius: 10,
              objectFit:
                "cover",
              border:
                "1px solid #E7E5E1",
            }}
          />
        ) : (
          <div
            style={{
              width: 145,
              height: 145,
              borderRadius: 10,
              background:
                "#F2F2F0",
              border:
                "1px solid #E7E5E1",
              display: "grid",
              placeItems:
                "center",
              color:
                "#8A8782",
              fontSize: 13,
              textAlign:
                "center",
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
              color:
                "#6B6862",
            }}
          >
            PRIVATE ANIMAL RECORD
          </p>

          <h1
            style={{
              fontSize: 30,
              color:
                "#17233C",
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
              color:
                "#6B6862",
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
              flexWrap:
                "wrap",
              marginBottom: 14,
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

            {animal.urgency && (
              <StatusBadge
                label={`Urgency: ${formatValue(
                  animal.urgency
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

          <div
            style={{
              position:
                "relative",
              display:
                "inline-block",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setFileMenuOpen(
                  (value) =>
                    !value
                )
              }
              style={
                fileMenuButton
              }
            >
              Animal File ▾
            </button>

            {fileMenuOpen && (
              <div
                style={
                  fileMenu
                }
              >
                <FileMenuItem
                  label="Overview"
                  href={`/animals/${encodeURIComponent(
                    animal.id
                  )}`}
                />

                <FileMenuItem
                  label="Medical"
                  href={`/animals/${encodeURIComponent(
                    animal.id
                  )}/medical`}
                />

                <FileMenuItem
                  label={
                    openReminders >
                    0
                      ? `Reminders & Tasks (${openReminders})`
                      : "Reminders & Tasks"
                  }
                  href={`/animals/${encodeURIComponent(
                    animal.id
                  )}/reminders`}
                />

                <FileMenuItem
                  label={
                    openHelpOffers >
                    0
                      ? `Foster & Help Offers (${openHelpOffers})`
                      : "Foster & Help Offers"
                  }
                  href={`/animals/${encodeURIComponent(
                    animal.id
                  )}/offers`}
                />

                <FileMenuItem
                  label="Behavior"
                  href={`/animals/${encodeURIComponent(
                    animal.id
                  )}/behavior`}
                />

                <FileMenuItem
                  label="Expenses"
                  disabled
                />

                <FileMenuItem
  label="Documents & Photos"
  href={`/animals/${encodeURIComponent(
    animal.id
  )}/documents`}
/>
                />

                <FileMenuItem
                  label="Timeline"
                  href="#timeline"
                />

                <FileMenuItem
                  label="Outcome"
                  disabled
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {(openHelpOffers > 0 ||
        openReminders >
          0) && (
        <div
          style={{
            display:
              "grid",
            gap: 8,
            marginBottom: 18,
          }}
        >
          {openHelpOffers >
            0 && (
            <a
              href={`/animals/${encodeURIComponent(
                animal.id
              )}/offers`}
              style={
                alertLink
              }
            >
              <strong>
                {openHelpOffers} active
                foster/help offer
                {openHelpOffers ===
                1
                  ? ""
                  : "s"}
              </strong>

              <span>
                Review private
                contact
                information →
              </span>
            </a>
          )}

          {openReminders >
            0 && (
            <a
              href={`/animals/${encodeURIComponent(
                animal.id
              )}/reminders`}
              style={{
                ...alertLink,
                background:
                  "#FFF8EA",
                border:
                  "1px solid #E7D2B4",
                color:
                  "#85571F",
              }}
            >
              <strong>
                {openReminders} open
                reminder
                {openReminders ===
                1
                  ? ""
                  : "s"}
              </strong>

              <span>
                Review tasks and
                due dates →
              </span>
            </a>
          )}
        </div>
      )}

      <Panel
        title="Overview"
        action={
          !editingOverview ? (
            <button
              type="button"
              onClick={
                startOverviewEdit
              }
              style={
                secondaryButton
              }
            >
              Edit Overview
            </button>
          ) : null
        }
      >
        {overviewMessage && (
          <div
            style={{
              marginBottom: 14,
              padding: 10,
              borderRadius: 7,
              background:
                overviewMessage.includes(
                  "Couldn't"
                )
                  ? "#FFF4F2"
                  : "#EEF4F0",

              color:
                overviewMessage.includes(
                  "Couldn't"
                )
                  ? "#B23B2E"
                  : "#2F6F4E",

              border:
                overviewMessage.includes(
                  "Couldn't"
                )
                  ? "1px solid #F3C7BF"
                  : "1px solid #C9DDD1",

              fontSize: 13,
            }}
          >
            {overviewMessage}
          </div>
        )}

        {!editingOverview ||
        !overviewDraft ? (
          <>
            <InfoRow
              label="Name"
              value={
                animal.name
              }
            />

            <InfoRow
              label="Temporary name"
              value={
                animal.temporary_name
              }
            />

            <InfoRow
              label="Species"
              value={
                animal.species
              }
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
              label="Birth date"
              value={
                animal.birth_date
                  ? formatDate(
                      animal.birth_date
                    )
                  : null
              }
            />

            <InfoRow
              label="Sex"
              value={
                animal.sex
              }
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
              value={
                animal.source
              }
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
                  color:
                    "#3F3D39",
                  lineHeight: 1.6,
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {animal.notes ||
                  "No notes recorded yet."}
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              <EditField
                label="Name"
                value={
                  overviewDraft.name
                }
                onChange={(value) =>
                  updateOverviewField(
                    "name",
                    value
                  )
                }
              />

              <EditField
                label="Temporary name"
                value={
                  overviewDraft.temporaryName
                }
                onChange={(value) =>
                  updateOverviewField(
                    "temporaryName",
                    value
                  )
                }
              />

              <div>
                <FieldHeading>
                  Species
                </FieldHeading>

                <select
                  value={
                    overviewDraft.species
                  }
                  onChange={(e) =>
                    updateOverviewField(
                      "species",
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                >
                  <option value="Dog">
                    Dog
                  </option>

                  <option value="Cat">
                    Cat
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <EditField
                label="Breed / type"
                value={
                  overviewDraft.breedOrType
                }
                onChange={(value) =>
                  updateOverviewField(
                    "breedOrType",
                    value
                  )
                }
              />

              <EditField
                label="Source"
                value={
                  overviewDraft.source
                }
                onChange={(value) =>
                  updateOverviewField(
                    "source",
                    value
                  )
                }
              />

              <div>
                <FieldHeading>
                  Custody
                </FieldHeading>

                <select
                  value={
                    overviewDraft.custody
                  }
                  onChange={(e) =>
                    updateOverviewField(
                      "custody",
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                >
                  <option value="rescue">
                    Rescue custody
                  </option>

                  <option value="owner">
                    Owner / assistance
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              <EditField
                label="Placement"
                value={
                  overviewDraft.placement
                }
                onChange={(value) =>
                  updateOverviewField(
                    "placement",
                    value
                  )
                }
              />

              <EditField
                label="Urgency"
                value={
                  overviewDraft.urgency
                }
                onChange={(value) =>
                  updateOverviewField(
                    "urgency",
                    value
                  )
                }
              />

              <div>
                <FieldHeading>
                  Birth date
                </FieldHeading>

                <input
                  type="date"
                  value={
                    overviewDraft.birthDate
                  }
                  onChange={(e) =>
                    updateOverviewField(
                      "birthDate",
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                />
              </div>

              <div>
                <FieldHeading>
                  Sex
                </FieldHeading>

                <select
                  value={
                    overviewDraft.sex
                  }
                  onChange={(e) =>
                    updateOverviewField(
                      "sex",
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
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
                  value={
                    overviewDraft.weightLbs
                  }
                  onChange={(e) =>
                    updateOverviewField(
                      "weightLbs",
                      e.target.value
                    )
                  }
                  style={
                    inputStyle
                  }
                />
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
              }}
            >
              <FieldHeading>
                Private notes
              </FieldHeading>

              <textarea
                rows={5}
                value={
                  overviewDraft.notes
                }
                onChange={(e) =>
                  updateOverviewField(
                    "notes",
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
                display:
                  "flex",
                gap: 9,
                marginTop: 16,
                flexWrap:
                  "wrap",
              }}
            >
              <button
                type="button"
                disabled={
                  savingOverview
                }
                onClick={
                  requestOverviewSave
                }
                style={
                  primaryButton
                }
              >
                {savingOverview
                  ? "Saving…"
                  : "Save Overview"}
              </button>

              <button
                type="button"
                disabled={
                  savingOverview
                }
                onClick={
                  cancelOverviewEdit
                }
                style={
                  secondaryButton
                }
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </Panel>

      {syncOptions.length >
        0 &&
        pendingOverviewSave && (
          <Panel title="Update Published Profile?">
            <p
              style={{
                margin:
                  "0 0 14px",
                color:
                  "#6B6862",
                fontSize: 13.5,
                lineHeight: 1.55,
              }}
            >
              You changed information
              that may also be useful on
              the published profile.
              Choose exactly which fields
              should update publicly.
              Private-only information is
              never included here.
            </p>

            <div
              style={{
                display:
                  "grid",
                gap: 8,
              }}
            >
              {syncOptions.map(
                (option) => (
                  <label
                    key={
                      option.field
                    }
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "22px minmax(120px, 160px) 1fr",
                      gap: 10,
                      alignItems:
                        "start",
                      padding: 10,
                      border:
                        "1px solid #E7E5E1",
                      borderRadius: 7,
                      cursor:
                        "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        option.selected
                      }
                      onChange={() =>
                        toggleSyncOption(
                          option.field
                        )
                      }
                    />

                    <strong
                      style={{
                        fontSize:
                          13,
                        color:
                          "#17233C",
                      }}
                    >
                      {
                        option.label
                      }
                    </strong>

                    <div
                      style={{
                        fontSize:
                          12.5,
                        color:
                          "#6B6862",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            color:
                              "#8A8782",
                          }}
                        >
                          Public now:
                        </span>{" "}
                        {option.oldValue ||
                          "Not shown"}
                      </div>

                      <div
                        style={{
                          marginTop: 3,
                        }}
                      >
                        <span
                          style={{
                            color:
                              "#8A8782",
                          }}
                        >
                          Update to:
                        </span>{" "}
                        <strong
                          style={{
                            color:
                              "#1C1B19",
                          }}
                        >
                          {option.newValue ||
                            "Blank"}
                        </strong>
                      </div>
                    </div>
                  </label>
                )
              )}
            </div>

            <div
              style={{
                display:
                  "flex",
                gap: 9,
                marginTop: 16,
                flexWrap:
                  "wrap",
              }}
            >
              <button
                type="button"
                disabled={
                  savingOverview
                }
                onClick={
                  saveWithPublicSync
                }
                style={
                  primaryButton
                }
              >
                Update Selected
                Public Fields
              </button>

              <button
                type="button"
                disabled={
                  savingOverview
                }
                onClick={
                  saveWithoutPublicSync
                }
                style={
                  secondaryButton
                }
              >
                Keep Public Profile
                As-Is
              </button>

              <button
                type="button"
                disabled={
                  savingOverview
                }
                onClick={() => {
                  setSyncOptions(
                    []
                  );

                  setPendingOverviewSave(
                    null
                  );
                }}
                style={
                  textButton
                }
              >
                Go Back
              </button>
            </div>
          </Panel>
        )}

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
            marginBottom: 18,
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
              color:
                "#6B6862",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {isPublic
              ? "Only approved public-profile information is visible. The full animal record remains private."
              : "You can prepare public information while this animal is private. Nothing becomes publicly visible until Publish Public Profile is selected."}
          </p>
        </div>

        <div
          style={{
            marginBottom: 18,
          }}
        >
          <FieldHeading>
            Currently approved public details
          </FieldHeading>

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 8,
            }}
          >
            <PublicValue
              label="Name"
              value={
                animal.public_name
              }
            />

            <PublicValue
              label="Species"
              value={
                animal.public_species
              }
            />

            <PublicValue
              label="Breed"
              value={
                animal.public_breed_or_type
              }
            />

            <PublicValue
              label="Age"
              value={calculateAge(
                animal.public_birth_date
              )}
            />

            <PublicValue
              label="Sex"
              value={
                animal.public_sex
              }
            />

            <PublicValue
              label="Weight"
              value={
                animal.public_weight_lbs !=
                null
                  ? `${animal.public_weight_lbs} lb`
                  : null
              }
            />
          </div>
        </div>

        <div>
          <FieldHeading>
            Public summary
          </FieldHeading>

          <textarea
            rows={5}
            value={
              publicSummary
            }
            onChange={(e) =>
              setPublicSummary(
                e.target.value
              )
            }
            placeholder="Public-friendly description of the animal, personality, home needs, and other information you want people to see."
            style={
              inputStyle
            }
          />
        </div>

        <div
          style={{
            marginTop: 14,
          }}
        >
          <FieldHeading>
            Current public need
          </FieldHeading>

          <textarea
            rows={3}
            value={
              publicNeed
            }
            onChange={(e) =>
              setPublicNeed(
                e.target.value
              )
            }
            placeholder="Examples: Foster needed, adoption placement, medical fundraiser, transport assistance."
            style={
              inputStyle
            }
          />
        </div>

        <div
          style={{
            marginTop: 14,
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
            style={
              inputStyle
            }
          />
        </div>

        <div
          style={{
            marginTop: 18,
            paddingTop: 16,
            borderTop:
              "1px solid #E7E5E1",
            display: "flex",
            gap: 9,
            flexWrap:
              "wrap",
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
                primaryButton
              }
            >
              Publish Public
              Profile
            </button>
          )}

          {isPublic && (
            <>
              <a
                href={
                  publicUrl
                }
                target="_blank"
                rel="noreferrer"
                style={
                  secondaryLink
                }
              >
                View Public Profile
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
      </Panel>

      <div id="timeline">
        <Panel title="Timeline">
          {animal.timeline.length ===
            0 && (
            <p
              style={{
                color:
                  "#6B6862",
                fontSize:
                  13.5,
              }}
            >
              No timeline events have
              been recorded.
            </p>
          )}

          {animal.timeline.map(
            (event) => (
              <div
                key={
                  event.id
                }
                style={{
                  borderLeft:
                    "3px solid #D8D6D2",
                  paddingLeft:
                    12,
                  marginBottom:
                    14,
                }}
              >
                <strong
                  style={{
                    display:
                      "block",
                    fontSize:
                      13.5,
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
                    fontSize:
                      12,
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
      </div>
    </section>
  );
}

function createOverviewDraft(
  animal: Animal
): OverviewDraft {
  return {
    name:
      animal.name ?? "",

    temporaryName:
      animal.temporary_name ??
      "",

    species:
      animal.species ??
      "",

    breedOrType:
      animal.breed_or_type ??
      "",

    source:
      animal.source ?? "",

    custody:
      animal.custody ??
      "rescue",

    placement:
      animal.placement ??
      "",

    urgency:
      animal.urgency ?? "",

    birthDate:
      animal.birth_date
        ? String(
            animal.birth_date
          ).slice(0, 10)
        : "",

    sex:
      animal.sex ?? "",

    weightLbs:
      animal.weight_lbs !=
      null
        ? String(
            animal.weight_lbs
          )
        : "",

    notes:
      animal.notes ?? "",
  };
}

function getPublicSyncCandidates(
  animal: Animal,
  draft: OverviewDraft
): SyncOption[] {
  const options: SyncOption[] =
    [];

  addCandidate(
    options,
    "name",
    "Name",
    animal.name,
    draft.name,
    animal.public_name
  );

  addCandidate(
    options,
    "species",
    "Species",
    animal.species,
    draft.species,
    animal.public_species
  );

  addCandidate(
    options,
    "breed_or_type",
    "Breed / type",
    animal.breed_or_type,
    draft.breedOrType,
    animal.public_breed_or_type
  );

  addCandidate(
    options,
    "birth_date",
    "Birth date / age",
    animal.birth_date
      ? String(
          animal.birth_date
        ).slice(0, 10)
      : "",
    draft.birthDate,
    animal.public_birth_date
      ? String(
          animal.public_birth_date
        ).slice(0, 10)
      : ""
  );

  addCandidate(
    options,
    "sex",
    "Sex",
    animal.sex,
    draft.sex,
    animal.public_sex
  );

  addCandidate(
    options,
    "weight_lbs",
    "Weight",
    animal.weight_lbs,
    draft.weightLbs,
    animal.public_weight_lbs
  );

  return options;
}

function addCandidate(
  options: SyncOption[],
  field: PublicSyncField,
  label: string,
  originalPrivate:
    | string
    | number
    | null,
  newPrivate:
    | string
    | number
    | null,
  currentPublic:
    | string
    | number
    | null
) {
  const oldPrivate =
    normalizeDisplay(
      originalPrivate
    );

  const nextPrivate =
    normalizeDisplay(
      newPrivate
    );

  if (
    oldPrivate ===
    nextPrivate
  ) {
    return;
  }

  options.push({
    field,
    label,

    oldValue:
      normalizeDisplay(
        currentPublic
      ),

    newValue:
      nextPrivate,

    selected: true,
  });
}

function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children:
    React.ReactNode;
  action?:
    React.ReactNode;
}) {
  return (
    <section
      style={{
        background:
          "#fff",
        border:
          "1px solid #E7E5E1",
        borderRadius: 10,
        padding: 20,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          gap: 12,
          marginBottom: 16,
          flexWrap:
            "wrap",
        }}
      >
        <h2
          style={{
            fontSize: 18,
            color:
              "#17233C",
            margin: 0,
          }}
        >
          {title}
        </h2>

        {action}
      </div>

      {children}
    </section>
  );
}

function EditField({
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
    <div>
      <FieldHeading>
        {label}
      </FieldHeading>

      <input
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        style={inputStyle}
      />
    </div>
  );
}

function PublicValue({
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
        background:
          "#F7F7F5",
        border:
          "1px solid #ECEAE7",
        borderRadius: 7,
        padding: 10,
      }}
    >
      <div
        style={{
          fontSize: 10.5,
          color:
            "#6B6862",
          textTransform:
            "uppercase",
          letterSpacing:
            ".04em",
          marginBottom: 4,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color:
            "#17233C",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {value ||
          "Not shared"}
      </div>
    </div>
  );
}

function FileMenuItem({
  label,
  href,
  disabled = false,
}: {
  label: string;
  href?: string;
  disabled?: boolean;
}) {
  if (
    disabled ||
    !href
  ) {
    return (
      <div
        style={{
          padding:
            "9px 12px",
          color:
            "#9A9690",
          fontSize: 13,
          borderBottom:
            "1px solid #F1F0EE",
        }}
      >
        {label}
        <span
          style={{
            float:
              "right",
            fontSize:
              10.5,
          }}
        >
          Soon
        </span>
      </div>
    );
  }

  return (
    <a
      href={href}
      style={{
        display:
          "block",
        padding:
          "9px 12px",
        color:
          "#17233C",
        fontSize: 13,
        textDecoration:
          "none",
        borderBottom:
          "1px solid #F1F0EE",
      }}
    >
      {label}
    </a>
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
        color:
          "#4F5661",
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
          color:
            "#6B6862",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 13.5,
          color:
            "#1C1B19",
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
        color:
          "#6B6862",
        marginBottom: 5,
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}

function normalizeDisplay(
  value:
    | string
    | number
    | null
    | undefined
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(
    value
  ).trim();
}

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
  color:
    "#1C1B19",
};

const primaryButton:
  React.CSSProperties =
{
  background:
    "#17233C",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  padding:
    "9px 14px",
  fontWeight: 700,
  fontSize: 13,
  cursor:
    "pointer",
};

const secondaryButton:
  React.CSSProperties =
{
  background: "#fff",
  color:
    "#17233C",
  border:
    "1px solid #D8D6D2",
  borderRadius: 7,
  padding:
    "9px 14px",
  fontWeight: 700,
  fontSize: 13,
  cursor:
    "pointer",
};

const textButton:
  React.CSSProperties =
{
  background:
    "transparent",
  color:
    "#6B6862",
  border: "none",
  padding:
    "9px 8px",
  fontWeight: 600,
  fontSize: 13,
  cursor:
    "pointer",
};

const unpublishButton:
  React.CSSProperties =
{
  background: "#fff",
  color:
    "#85571F",
  border:
    "1px solid #C58A42",
  borderRadius: 7,
  padding:
    "9px 14px",
  fontWeight: 700,
  fontSize: 13,
  cursor:
    "pointer",
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

const backLink:
  React.CSSProperties =
{
  fontSize: 12.5,
  color:
    "#C05621",
  textDecoration:
    "none",
  fontWeight: 600,
};

const fileMenuButton:
  React.CSSProperties =
{
  background:
    "#17233C",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  padding:
    "9px 14px",
  fontSize: 13,
  fontWeight: 700,
  cursor:
    "pointer",
};

const fileMenu:
  React.CSSProperties =
{
  position:
    "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  zIndex: 30,
  width: 240,
  background:
    "#fff",
  border:
    "1px solid #D8D6D2",
  borderRadius: 8,
  boxShadow:
    "0 8px 24px rgba(28,27,25,.14)",
  overflow:
    "hidden",
};

const alertLink:
  React.CSSProperties =
{
  display: "flex",
  justifyContent:
    "space-between",
  gap: 12,
  flexWrap:
    "wrap",
  textDecoration:
    "none",
  background:
    "#EEF4F0",
  border:
    "1px solid #C9DDD1",
  borderRadius: 8,
  padding:
    "11px 13px",
  color:
    "#2F6F4E",
  fontSize: 13,
};
