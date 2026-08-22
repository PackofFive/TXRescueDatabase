"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type Reminder = {
  kind: "medical" | "medication";
  label: string;
  dueAt: string;
  overdue: boolean;
};

type Animal = {
  id: string;

  name: string | null;

  temporary_name:
    | string
    | null;

  species: string;

  breed_or_type:
    | string
    | null;

  birth_date:
    | string
    | null;

  sex:
    | string
    | null;

  weight_lbs:
    | string
    | number
    | null;

  source:
    | string
    | null;

  custody: string;

  urgency:
    | string
    | null;

  placement:
    | string
    | null;

  public_share_enabled: boolean;

  external_listing_url:
    | string
    | null;

  outcome_status:
    | string
    | null;

  outcome_date:
    | string
    | null;

  created_at: string;

  photo_url:
    | string
    | null;

  open_help_offers:
    | number
    | string;

  reminders: Reminder[];
};

type AuthUser = {
  id: string;
  email: string;

  role:
    | "org"
    | "admin";

  orgId:
    | string
    | null;

  orgName:
    | string
    | null;

  status:
    | "pending"
    | "approved"
    | "rejected";
};

type TestOrg = {
  id: string;
  name: string;
} | null;

const CARD_FIELD_OPTIONS = [
  {
    key: "placement",
    label: "Placement",
  },
  {
    key: "sex",
    label: "Sex",
  },
  {
    key: "weight",
    label: "Weight",
  },
  {
    key: "source",
    label: "Source",
  },
  {
    key: "intake_date",
    label: "Intake date",
  },
  {
    key: "public_status",
    label: "Public profile status",
  },
  {
    key: "foster_offers",
    label: "Foster / help offers",
  },
];

export default function AnimalsListPage() {
  const [
    animals,
    setAnimals,
  ] =
    useState<
      Animal[] | null
    >(null);

  const [
    orgName,
    setOrgName,
  ] =
    useState<
      string | null
    >(null);

  const [
    cardFields,
    setCardFields,
  ] =
    useState<string[]>([
      "placement",
      "foster_offers",
    ]);

  const [
    draftCardFields,
    setDraftCardFields,
  ] =
    useState<string[]>([
      "placement",
      "foster_offers",
    ]);

  const [
    showCardSettings,
    setShowCardSettings,
  ] =
    useState(false);

  const [
    savingCardSettings,
    setSavingCardSettings,
  ] =
    useState(false);

  const [
    settingsMessage,
    setSettingsMessage,
  ] =
    useState<
      string | null
    >(null);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    loadingAnimals,
    setLoadingAnimals,
  ] =
    useState(true);

  /* =====================================================
     FILTERS
  ===================================================== */

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    speciesFilter,
    setSpeciesFilter,
  ] =
    useState("");

  const [
    placementFilter,
    setPlacementFilter,
  ] =
    useState("");

  const [
    needsAttention,
    setNeedsAttention,
  ] =
    useState(false);

  const [
    sort,
    setSort,
  ] =
    useState("newest");

  const [
    caseStatus,
    setCaseStatus,
  ] =
    useState<
      "active" | "closed" | "all"
    >("active");

  /* =====================================================
     LOAD ORGANIZATION IDENTITY
  ===================================================== */

  useEffect(() => {
    async function loadIdentity() {
      try {
        const authRes =
          await fetch(
            "/api/auth/me",
            {
              cache:
                "no-store",

              credentials:
                "same-origin",
            }
          );

        const authData =
          await authRes.json();

        const user =
          authData.user as
            | AuthUser
            | null;

        if (
          user?.orgName
        ) {
          setOrgName(
            user.orgName
          );
        }

        if (
          user?.role ===
          "admin"
        ) {
          try {
            const testRes =
              await fetch(
                "/api/admin/test-org",
                {
                  cache:
                    "no-store",

                  credentials:
                    "same-origin",
                }
              );

            const testData =
              await testRes.json();

            const testOrg =
              testData.organization as TestOrg;

            if (
              testRes.ok &&
              testOrg?.name
            ) {
              setOrgName(
                testOrg.name
              );
            }
          } catch {
            // AppShell handles missing
            // admin test organization.
          }
        }
      } catch (err) {
        console.error(
          "Animal dashboard identity load failed:",
          err
        );
      }
    }

    loadIdentity();
  }, []);

  /* =====================================================
     LOAD ANIMALS
  ===================================================== */

  useEffect(() => {
    async function loadAnimals() {
      setLoadingAnimals(
        true
      );

      setError(null);

      try {
        const params =
          new URLSearchParams();

        if (
          search.trim()
        ) {
          params.set(
            "q",
            search.trim()
          );
        }

        if (
          speciesFilter
        ) {
          params.set(
            "species",
            speciesFilter
          );
        }

        if (
          placementFilter
        ) {
          params.set(
            "placement",
            placementFilter
          );
        }

        if (
          needsAttention
        ) {
          params.set(
            "attention",
            "true"
          );
        }

        params.set(
          "sort",
          sort ===
            "attention"
            ? "newest"
            : sort
        );

        params.set(
          "caseStatus",
          caseStatus
        );

        const animalRes =
          await fetch(
            `/api/animals?${params.toString()}`,
            {
              cache:
                "no-store",

              credentials:
                "same-origin",
            }
          );

        const animalData =
          await animalRes.json();

        if (
          !animalRes.ok
        ) {
          throw new Error(
            animalData.error ??
              "Failed to load animals."
          );
        }

        setAnimals(
          animalData.animals ??
            []
        );

        const fields =
          Array.isArray(
            animalData.cardFields
          )
            ? animalData.cardFields
            : [
                "placement",
                "foster_offers",
              ];

        setCardFields(
          fields
        );

        setDraftCardFields(
          fields
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load animals."
        );
      } finally {
        setLoadingAnimals(
          false
        );
      }
    }

    const timer =
      window.setTimeout(
        loadAnimals,
        250
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    search,
    speciesFilter,
    placementFilter,
    needsAttention,
    sort,
    caseStatus,
  ]);

  /* =====================================================
     SORT NEEDS ATTENTION
  ===================================================== */

  const displayAnimals =
    useMemo(() => {
      if (!animals) {
        return null;
      }

      const result = [
        ...animals,
      ];

      if (
        sort ===
        "attention"
      ) {
        result.sort(
          (a, b) => {
            const aOverdue =
              a.reminders?.some(
                (r) =>
                  r.overdue
              )
                ? 1
                : 0;

            const bOverdue =
              b.reminders?.some(
                (r) =>
                  r.overdue
              )
                ? 1
                : 0;

            if (
              aOverdue !==
              bOverdue
            ) {
              return (
                bOverdue -
                aOverdue
              );
            }

            const aAttention =
              a.reminders
                ?.length ??
              0;

            const bAttention =
              b.reminders
                ?.length ??
              0;

            return (
              bAttention -
              aAttention
            );
          }
        );
      }

      return result;
    }, [
      animals,
      sort,
    ]);

  /* =====================================================
     FILTER OPTIONS
  ===================================================== */

  const speciesOptions =
    useMemo(() => {
      if (!animals) {
        return [];
      }

      return [
        ...new Set(
          animals
            .map(
              (a) =>
                a.species
            )
            .filter(Boolean)
        ),
      ].sort();
    }, [animals]);

  const placementOptions =
    useMemo(() => {
      if (!animals) {
        return [];
      }

      return [
        ...new Set(
          animals
            .map(
              (a) =>
                a.placement
            )
            .filter(
              (
                value
              ): value is string =>
                Boolean(value)
            )
        ),
      ].sort();
    }, [animals]);

  /* =====================================================
     CARD SETTINGS
  ===================================================== */

  function toggleCardField(
    key: string
  ) {
    setSettingsMessage(
      null
    );

    setDraftCardFields(
      (current) => {
        if (
          current.includes(
            key
          )
        ) {
          return current.filter(
            (field) =>
              field !== key
          );
        }

        if (
          current.length >=
          4
        ) {
          setSettingsMessage(
            "Choose up to four optional card fields."
          );

          return current;
        }

        return [
          ...current,
          key,
        ];
      }
    );
  }

  async function saveCardSettings() {
    setSavingCardSettings(
      true
    );

    setSettingsMessage(
      null
    );

    try {
      const res =
        await fetch(
          "/api/org-settings/animal-cards",
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  fields:
                    draftCardFields,
                }
              ),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't save card settings."
        );
      }

      setCardFields(
        data.fields
      );

      setDraftCardFields(
        data.fields
      );

      setSettingsMessage(
        "Card display saved."
      );
    } catch (err) {
      setSettingsMessage(
        err instanceof Error
          ? err.message
          : "Couldn't save card settings."
      );
    } finally {
      setSavingCardSettings(
        false
      );
    }
  }

  const pageTitle =
    orgName
      ? `${orgName} Animals`
      : "Our Animals";

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "flex-start",
          gap: 16,
          marginBottom: 22,
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
              color:
                "#6B6862",
              textTransform:
                "uppercase",
            }}
          >
            Rescue Manager
          </p>

          <h1
            style={{
              fontSize: 28,
              margin:
                "5px 0 6px",
              color:
                "#17233C",
            }}
          >
            {pageTitle}
          </h1>

          <p
            style={{
              margin: 0,
              color:
                "#6B6862",
              fontSize: 13.5,
              lineHeight: 1.5,
              maxWidth: 720,
            }}
          >
            Active animals are
            those currently under
            your organization&apos;s
            care or responsibility.
            Closed cases remain
            available without
            cluttering the active
            dashboard.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 9,
            flexWrap:
              "wrap",
          }}
        >
          <button
            type="button"
            onClick={() =>
              setShowCardSettings(
                (value) =>
                  !value
              )
            }
            style={
              secondaryButton
            }
          >
            Customize Cards
          </button>

          <a
            href="/animals/new"
            style={{
              ...primaryButton,
              textDecoration:
                "none",
              display:
                "inline-block",
              whiteSpace:
                "nowrap",
            }}
          >
            + Quick Intake
          </a>
        </div>
      </div>

      {/* ===============================================
          CUSTOM CARD SETTINGS
      ================================================ */}

      {showCardSettings && (
        <div
          style={{
            background:
              "#fff",
            border:
              "1px solid #E7E5E1",
            borderRadius: 10,
            padding: 16,
            marginBottom: 18,
          }}
        >
          <strong
            style={{
              display:
                "block",
              color:
                "#17233C",
              marginBottom: 5,
            }}
          >
            Customize animal
            cards
          </strong>

          <p
            style={{
              margin:
                "0 0 12px",
              color:
                "#6B6862",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            Photo, name, age,
            breed/type, and
            priority reminders
            are always shown.
            Choose up to four
            additional fields.
          </p>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap:
                "wrap",
            }}
          >
            {CARD_FIELD_OPTIONS.map(
              (option) => {
                const selected =
                  draftCardFields.includes(
                    option.key
                  );

                return (
                  <button
                    key={
                      option.key
                    }
                    type="button"
                    onClick={() =>
                      toggleCardField(
                        option.key
                      )
                    }
                    style={{
                      border:
                        selected
                          ? "1px solid #17233C"
                          : "1px solid #D8D6D2",

                      background:
                        selected
                          ? "#EEF1F5"
                          : "#fff",

                      color:
                        "#17233C",

                      borderRadius:
                        20,

                      padding:
                        "6px 10px",

                      fontSize:
                        12.5,

                      fontWeight:
                        selected
                          ? 700
                          : 500,

                      cursor:
                        "pointer",
                    }}
                  >
                    {selected
                      ? "✓ "
                      : ""}
                    {
                      option.label
                    }
                  </button>
                );
              }
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems:
                "center",
              marginTop: 14,
              flexWrap:
                "wrap",
            }}
          >
            <button
              type="button"
              disabled={
                savingCardSettings
              }
              onClick={
                saveCardSettings
              }
              style={
                primaryButton
              }
            >
              {savingCardSettings
                ? "Saving…"
                : "Save Card Display"}
            </button>

            {settingsMessage && (
              <span
                style={{
                  fontSize: 13,
                  color:
                    settingsMessage ===
                    "Card display saved."
                      ? "#2F6F4E"
                      : "#B23B2E",
                }}
              >
                {
                  settingsMessage
                }
              </span>
            )}
          </div>
        </div>
      )}

      {/* ===============================================
          ACTIVE / CLOSED CASES
      ================================================ */}

      <div
        style={{
          display: "flex",
          gap: 7,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        {[
          {
            value: "active",
            label: "Active Animals",
          },
          {
            value: "closed",
            label: "Closed Cases",
          },
          {
            value: "all",
            label: "All Records",
          },
        ].map((option) => {
          const selected =
            caseStatus ===
            option.value;

          return (
            <button
              key={
                option.value
              }
              type="button"
              onClick={() => {
                setCaseStatus(
                  option.value as
                    | "active"
                    | "closed"
                    | "all"
                );

                if (
                  option.value ===
                  "closed"
                ) {
                  setNeedsAttention(
                    false
                  );
                }
              }}
              style={{
                border:
                  selected
                    ? "1px solid #17233C"
                    : "1px solid #D8D6D2",

                background:
                  selected
                    ? "#EEF1F5"
                    : "#fff",

                color:
                  "#17233C",

                borderRadius:
                  20,

                padding:
                  "7px 11px",

                fontSize:
                  12.5,

                fontWeight:
                  selected
                    ? 700
                    : 600,

                cursor:
                  "pointer",
              }}
            >
              {
                option.label
              }
            </button>
          );
        })}
      </div>

      {/* ===============================================
          FILTERS
      ================================================ */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(220px, 2fr) repeat(3, minmax(140px, 1fr))",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <input
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search name or breed…"
          style={inputStyle}
        />

        <select
          value={
            speciesFilter
          }
          onChange={(e) =>
            setSpeciesFilter(
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option value="">
            All species
          </option>

          {speciesOptions.map(
            (value) => (
              <option
                key={value}
                value={value}
              >
                {value}
              </option>
            )
          )}
        </select>

        <select
          value={
            placementFilter
          }
          onChange={(e) =>
            setPlacementFilter(
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option value="">
            All placements
          </option>

          {placementOptions.map(
            (value) => (
              <option
                key={value}
                value={value}
              >
                {formatValue(
                  value
                )}
              </option>
            )
          )}
        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option value="attention">
            Needs Attention First
          </option>

          <option value="newest">
            Newest Intake
          </option>

          <option value="oldest">
            Longest in Care
          </option>

          <option value="name">
            Name A–Z
          </option>
        </select>
      </div>

      <div
        style={{
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "space-between",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems:
              "center",
            gap: 7,
            fontSize: 13,
            color:
              "#4F4D49",
            cursor:
              "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={
              needsAttention
            }
            disabled={
              caseStatus ===
              "closed"
            }
            onChange={(e) =>
              setNeedsAttention(
                e.target
                  .checked
              )
            }
          />

          {caseStatus ===
          "closed"
            ? "Closed cases do not show active reminders"
            : "Show only animals needing attention"}
        </label>

        {!loadingAnimals &&
          displayAnimals && (
            <span
              style={{
                fontSize: 12.5,
                color:
                  "#6B6862",
              }}
            >
              {
                displayAnimals.length
              }{" "}
              animal
              {displayAnimals.length ===
              1
                ? ""
                : "s"}
            </span>
          )}
      </div>

      {/* ===============================================
          LOADING / ERROR
      ================================================ */}

      {error && (
        <div
          style={{
            color:
              "#B23B2E",
            background:
              "#FFF4F2",
            border:
              "1px solid #F3C7BF",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {loadingAnimals && (
        <p>Loading…</p>
      )}

      {/* ===============================================
          EMPTY STATE
      ================================================ */}

      {!loadingAnimals &&
        displayAnimals
          ?.length === 0 && (
          <div
            style={{
              border:
                "1px dashed #D8D6D2",
              borderRadius: 9,
              padding: 24,
              background:
                "#fff",
            }}
          >
            <strong
              style={{
                display:
                  "block",
                marginBottom: 5,
                color:
                  "#17233C",
              }}
            >
              No animals match
              these filters
            </strong>

            <p
              style={{
                margin: 0,
                color:
                  "#6B6862",
                fontSize: 13.5,
                lineHeight: 1.5,
              }}
            >
              Adjust the filters
              or use Quick Intake
              to add an animal
              currently under your
              organization&apos;s
              care.
            </p>
          </div>
        )}

      {/* ===============================================
          ANIMAL CARDS
      ================================================ */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(330px, 1fr))",
          gap: 14,
        }}
      >
        {displayAnimals?.map(
          (animal) => (
            <AnimalCard
              key={
                animal.id
              }
              animal={
                animal
              }
              cardFields={
                cardFields
              }
            />
          )
        )}
      </div>
    </section>
  );
}

/* =========================================================
   ANIMAL CARD
========================================================= */

function AnimalCard({
  animal,
  cardFields,
}: {
  animal: Animal;
  cardFields: string[];
}) {
  const displayName =
    animal.name ||
    animal.temporary_name ||
    "Unnamed Animal";

  const age =
    calculateAge(
      animal.birth_date
    );

  const breed =
    animal.breed_or_type ||
    animal.species;

  const helpOffers =
    Number(
      animal.open_help_offers ??
        0
    );

  return (
    <article
      style={{
        display: "block",
        background: "#fff",
        border:
          "1px solid #E7E5E1",
        borderRadius: 11,
        overflow: "hidden",
        color: "inherit",
        minWidth: 0,
      }}
    >
      {/* ===============================================
          MAIN ANIMAL RECORD LINK
      ================================================ */}

      <a
        href={`/animals/${encodeURIComponent(
          animal.id
        )}`}
        style={{
          display: "block",
          color: "inherit",
          textDecoration:
            "none",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 14,
            padding: 15,
          }}
        >
          {animal.photo_url ? (
            <img
              src={
                animal.photo_url
              }
              alt={
                displayName
              }
              style={{
                width: 105,
                height: 105,
                borderRadius: 9,
                objectFit:
                  "cover",
                flexShrink: 0,
                background:
                  "#F1F1EF",
              }}
            />
          ) : (
            <div
              style={{
                width: 105,
                height: 105,
                borderRadius: 9,
                background:
                  "#F1F1EF",
                display: "grid",
                placeItems:
                  "center",
                color:
                  "#8A8782",
                fontSize: 12,
                textAlign:
                  "center",
                flexShrink: 0,
                padding: 8,
                boxSizing:
                  "border-box",
              }}
            >
              No photo
            </div>
          )}

          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-start",
                gap: 8,
              }}
            >
              <div
                style={{
                  minWidth: 0,
                }}
              >
                <h2
                  style={{
                    fontSize: 18,
                    color:
                      "#17233C",
                    margin:
                      "0 0 4px",
                    lineHeight: 1.25,
                    overflowWrap:
                      "anywhere",
                  }}
                >
                  {
                    displayName
                  }
                </h2>

                <div
                  style={{
                    color:
                      "#6B6862",
                    fontSize: 13,
                    lineHeight: 1.45,
                  }}
                >
                  {[
                    age,
                    breed,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>

              <span
                aria-hidden="true"
                style={{
                  color:
                    "#17233C",
                  fontSize: 22,
                  lineHeight: 1,
                }}
              >
                ›
              </span>
            </div>

            {animal.outcome_status && (
              <div
                style={{
                  marginTop: 7,
                }}
              >
                <span
                  style={{
                    display:
                      "inline-block",

                    background:
                      "#F1F3F5",

                    border:
                      "1px solid #DDE1E5",

                    borderRadius:
                      20,

                    padding:
                      "4px 7px",

                    color:
                      "#4F5661",

                    fontSize:
                      11,

                    fontWeight:
                      700,
                  }}
                >
                  {formatValue(
                    animal.outcome_status
                  )}

                  {animal.outcome_date
                    ? ` · ${formatDate(
                        animal.outcome_date
                      )}`
                    : ""}
                </span>
              </div>
            )}

            {/* ===============================================
                OPTIONAL FIELDS
            ================================================ */}

            <div
              style={{
                marginTop: 9,
                display: "flex",
                flexWrap:
                  "wrap",
                gap: 5,
              }}
            >
              {cardFields.includes(
                "placement"
              ) &&
                animal.placement && (
                  <SmallBadge
                    label={formatValue(
                      animal.placement
                    )}
                  />
                )}

              {cardFields.includes(
                "sex"
              ) &&
                animal.sex && (
                  <SmallBadge
                    label={formatValue(
                      animal.sex
                    )}
                  />
                )}

              {cardFields.includes(
                "weight"
              ) &&
                animal.weight_lbs && (
                  <SmallBadge
                    label={`${animal.weight_lbs} lb`}
                  />
                )}

              {cardFields.includes(
                "source"
              ) &&
                animal.source && (
                  <SmallBadge
                    label={
                      animal.source
                    }
                  />
                )}

              {cardFields.includes(
                "public_status"
              ) && (
                <SmallBadge
                  label={
                    animal.public_share_enabled
                      ? "Public Profile On"
                      : "Private"
                  }
                />
              )}
            </div>
          </div>
        </div>
      </a>

      {/* ===============================================
          REMINDERS
      ================================================ */}

      {animal.reminders
        ?.length > 0 && (
        <div
          style={{
            borderTop:
              "1px solid #F0EFED",
            padding:
              "6px 0",
            display: "grid",
          }}
        >
          {animal.reminders.map(
            (
              reminder,
              index
            ) => (
              <ReminderRow
                key={`${reminder.kind}-${index}`}
                reminder={
                  reminder
                }
                animalId={
                  animal.id
                }
              />
            )
          )}
        </div>
      )}

      {/* ===============================================
          BOTTOM STATUS
      ================================================ */}

      <div
        style={{
          borderTop:
            "1px solid #F0EFED",
          padding:
            "9px 15px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          gap: 10,
          flexWrap:
            "wrap",
          background:
            "#FCFCFB",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color:
              "#6B6862",
          }}
        >
          {animal.outcome_status
            ? "Closed case"
            : cardFields.includes(
                "intake_date"
              )
            ? `Added ${formatDate(
                animal.created_at
              )}`
            : formatValue(
                animal.custody
              )}
        </div>

        <div
          style={{
            display:
              "flex",

            gap:
              7,

            flexWrap:
              "wrap",

            alignItems:
              "center",
          }}
        >
          {cardFields.includes(
            "foster_offers"
          ) &&
            helpOffers >
              0 && (
              <a
                href={`/animals/${encodeURIComponent(
                  animal.id
                )}/offers`}
                style={{
                  display:
                    "inline-block",
                  background:
                    "#EEF4F0",
                  color:
                    "#2F6F4E",
                  border:
                    "1px solid #C9DDD1",
                  borderRadius:
                    20,
                  padding:
                    "4px 8px",
                  fontSize:
                    11.5,
                  fontWeight:
                    700,
                  textDecoration:
                    "none",
                }}
              >
                {helpOffers}{" "}
                Help Offer
                {helpOffers ===
                1
                  ? ""
                  : "s"}
              </a>
            )}

          <a
            href={`/animals/${encodeURIComponent(
              animal.id
            )}/outcome`}
            style={{
              display:
                "inline-block",

              background:
                animal.outcome_status
                  ? "#F1F3F5"
                  : "#FFF8F5",

              color:
                animal.outcome_status
                  ? "#4F5661"
                  : "#A04B35",

              border:
                animal.outcome_status
                  ? "1px solid #DDE1E5"
                  : "1px solid #F0D3C9",

              borderRadius:
                20,

              padding:
                "4px 8px",

              fontSize:
                11.5,

              fontWeight:
                700,

              textDecoration:
                "none",

              whiteSpace:
                "nowrap",
            }}
          >
            {animal.outcome_status
              ? "View Outcome"
              : "Close Case"}
          </a>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   REMINDER ROW
========================================================= */

function ReminderRow({
  reminder,
  animalId,
}: {
  reminder: Reminder;
  animalId: string;
}) {
  const destination =
    reminder.kind ===
      "medical" ||
    reminder.kind ===
      "medication"
      ? `/animals/${encodeURIComponent(
          animalId
        )}/medical`
      : `/animals/${encodeURIComponent(
          animalId
        )}`;

  return (
    <a
      href={destination}
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems:
          "center",
        gap: 10,
        fontSize: 12.5,
        textDecoration:
          "none",
        padding:
          "7px 15px",
        color:
          "inherit",
        background:
          reminder.overdue
            ? "#FFF8F6"
            : "transparent",
      }}
    >
      <span
        style={{
          fontWeight: 700,

          color:
            reminder.overdue
              ? "#B23B2E"
              : "#85571F",

          minWidth: 0,
          overflowWrap:
            "anywhere",
        }}
      >
        {reminder.overdue
          ? "● "
          : "○ "}

        {reminder.label}
      </span>

      <span
        style={{
          color:
            reminder.overdue
              ? "#B23B2E"
              : "#6B6862",

          whiteSpace:
            "nowrap",

          flexShrink: 0,
        }}
      >
        {formatDateTime(
          reminder.dueAt
        )}
        {" ›"}
      </span>
    </a>
  );
}

/* =========================================================
   SMALL BADGE
========================================================= */

function SmallBadge({
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
          "4px 7px",
        color:
          "#4F5661",
        fontSize: 11,
        fontWeight: 600,
        lineHeight: 1.2,
      }}
    >
      {label}
    </span>
  );
}

/* =========================================================
   AGE
========================================================= */

function calculateAge(
  birthDate:
    | string
    | null
) {
  if (!birthDate) {
    return "Age not recorded";
  }

  const birth =
    new Date(
      birthDate
    );

  if (
    Number.isNaN(
      birth.getTime()
    )
  ) {
    return "Age not recorded";
  }

  const now =
    new Date();

  let years =
    now.getFullYear() -
    birth.getFullYear();

  const monthDifference =
    now.getMonth() -
    birth.getMonth();

  if (
    monthDifference <
      0 ||
    (monthDifference ===
      0 &&
      now.getDate() <
        birth.getDate())
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
    (now.getFullYear() -
      birth.getFullYear()) *
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

  if (months >= 1) {
    return `${months} mo`;
  }

  return "Under 1 mo";
}

/* =========================================================
   FORMATTING
========================================================= */

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

      hour:
        value.includes(
          "T"
        )
          ? "numeric"
          : undefined,

      minute:
        value.includes(
          "T"
        )
          ? "2-digit"
          : undefined,
    }
  );
}

/* =========================================================
   STYLES
========================================================= */

const inputStyle:
  React.CSSProperties =
{
  width: "100%",
  minWidth: 0,
  boxSizing:
    "border-box",
  padding: 9,
  border:
    "1px solid #D8D6D2",
  borderRadius: 7,
  fontSize: 13,
  fontFamily:
    "inherit",
  background: "#fff",
  color: "#1C1B19",
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
