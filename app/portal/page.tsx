"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type Priority =
  | "critical"
  | "high"
  | "normal"
  | "info";

type Alert = {
  id: string;
  animal_id: string;
  animal_name: string;
  alert_type: string;
  title: string;
  due_at: string | null;
  created_at: string;
  priority: Priority;
};

type Stats = {
  animals_in_care: number;
  active_help_offers: number;
  published_profiles: number;
  adopted_animals: number;
};

type AlertPreference = {
  alertType: string;
  priority: Priority;
  enabled: boolean;
};

type AuthUser = {
  role: "org" | "admin";
  status: string;
  orgName:
    | string
    | null;
};

const PRIORITIES: {
  key: Priority;
  label: string;
}[] = [
  {
    key: "critical",
    label: "Critical",
  },
  {
    key: "high",
    label: "High Priority",
  },
  {
    key: "normal",
    label: "Normal",
  },
  {
    key: "info",
    label: "Informational",
  },
];

const ALERT_TYPE_LABELS:
  Record<
    string,
    string
  > = {
  medication:
    "Medication Reminders",

  medical:
    "Medical Reminders",

  foster_offer:
    "Foster / Help Offers",

  custom_reminder:
    "Custom Reminders",
};

export default function PortalPage() {
  const [
    alerts,
    setAlerts,
  ] =
    useState<Alert[]>([]);

  const [
    stats,
    setStats,
  ] =
    useState<Stats>({
      animals_in_care: 0,
      active_help_offers: 0,
      published_profiles: 0,
      adopted_animals: 0,
    });

  const [
    orgName,
    setOrgName,
  ] =
    useState<
      string | null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    filter,
    setFilter,
  ] =
    useState<
      | "all"
      | "medical"
      | "foster"
    >("all");

  const [
    hiddenPriorities,
    setHiddenPriorities,
  ] =
    useState<
      Set<Priority>
    >(new Set());

  const [
    showAlertSettings,
    setShowAlertSettings,
  ] =
    useState(false);

  const [
    alertPreferences,
    setAlertPreferences,
  ] =
    useState<
      AlertPreference[]
    >([]);

  const [
    savingPreferences,
    setSavingPreferences,
  ] =
    useState(false);

  const [
    preferenceMessage,
    setPreferenceMessage,
  ] =
    useState<
      string | null
    >(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError(null);

    try {
      const authRes =
        await fetch(
          "/api/auth/me",
          {
            cache:
              "no-store",
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

      const res =
        await fetch(
          "/api/dashboard/alerts",
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
            "Couldn't load dashboard."
        );
      }

      setAlerts(
        data.alerts ??
          []
      );

      setStats({
        animals_in_care:
          Number(
            data.stats
              ?.animals_in_care ??
              0
          ),

        active_help_offers:
          Number(
            data.stats
              ?.active_help_offers ??
              0
          ),

        published_profiles:
          Number(
            data.stats
              ?.published_profiles ??
              0
          ),

        adopted_animals:
          Number(
            data.stats
              ?.adopted_animals ??
              0
          ),
      });

      const preferenceRes =
        await fetch(
          "/api/org-settings/alerts",
          {
            cache:
              "no-store",
          }
        );

      const preferenceData =
        await preferenceRes.json();

      if (
        preferenceRes.ok
      ) {
        setAlertPreferences(
          preferenceData.preferences ??
            []
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveAlertPreferences() {
    setSavingPreferences(
      true
    );

    setPreferenceMessage(
      null
    );

    try {
      const res =
        await fetch(
          "/api/org-settings/alerts",
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                preferences:
                  alertPreferences,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't save alert preferences."
        );
      }

      setPreferenceMessage(
        "Alert preferences saved."
      );

      await loadDashboard();
    } catch (err) {
      setPreferenceMessage(
        err instanceof Error
          ? err.message
          : "Couldn't save alert preferences."
      );
    } finally {
      setSavingPreferences(
        false
      );
    }
  }

  function changePreferencePriority(
    alertType: string,
    priority: Priority
  ) {
    setAlertPreferences(
      (current) =>
        current.map(
          (item) =>
            item.alertType ===
            alertType
              ? {
                  ...item,
                  priority,
                }
              : item
        )
    );
  }

  function changePreferenceEnabled(
    alertType: string,
    enabled: boolean
  ) {
    setAlertPreferences(
      (current) =>
        current.map(
          (item) =>
            item.alertType ===
            alertType
              ? {
                  ...item,
                  enabled,
                }
              : item
        )
    );
  }

  const visibleAlerts =
    useMemo(() => {
      return alerts.filter(
        (alert) => {
          if (
            hiddenPriorities.has(
              alert.priority
            )
          ) {
            return false;
          }

          if (
            filter ===
            "medical"
          ) {
            return [
              "medical",
              "medication",
            ].includes(
              alert.alert_type
            );
          }

          if (
            filter ===
            "foster"
          ) {
            return (
              alert.alert_type ===
              "foster_offer"
            );
          }

          return true;
        }
      );
    }, [
      alerts,
      filter,
      hiddenPriorities,
    ]);

  const grouped =
    useMemo(() => {
      const result:
        Record<
          Priority,
          Alert[]
        > = {
        critical: [],
        high: [],
        normal: [],
        info: [],
      };

      for (
        const alert of visibleAlerts
      ) {
        result[
          alert.priority
        ].push(
          alert
        );
      }

      return result;
    }, [
      visibleAlerts,
    ]);

  function togglePriority(
    priority: Priority
  ) {
    setHiddenPriorities(
      (current) => {
        const next =
          new Set(
            current
          );

        if (
          next.has(
            priority
          )
        ) {
          next.delete(
            priority
          );
        } else {
          next.add(
            priority
          );
        }

        return next;
      }
    );
  }

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
          flexWrap:
            "wrap",
          marginBottom: 24,
        }}
      >
        <div>
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
            RESCUE MANAGER
          </p>

          <h1
            style={{
              fontSize: 30,
              margin:
                "6px 0 6px",
              color:
                "#17233C",
            }}
          >
            {orgName
              ? `${orgName} Dashboard`
              : "Dashboard"}
          </h1>

          <p
            style={{
              margin: 0,
              color:
                "#6B6862",
              maxWidth: 720,
              lineHeight: 1.5,
            }}
          >
            A quick view of what
            needs attention across
            your organization.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowAlertSettings(
              (value) =>
                !value
            )
          }
          style={
            secondaryButton
          }
        >
          Customize Alerts
        </button>
      </div>

      {showAlertSettings && (
        <section
          style={{
            background:
              "#fff",
            border:
              "1px solid #E7E5E1",
            borderRadius: 10,
            padding: 18,
            marginBottom: 22,
          }}
        >
          <h2
            style={{
              margin:
                "0 0 5px",
              color:
                "#17233C",
              fontSize: 18,
            }}
          >
            Customize Alerts
          </h2>

          <p
            style={{
              margin:
                "0 0 16px",
              color:
                "#6B6862",
              fontSize: 13.5,
              lineHeight: 1.5,
              maxWidth: 720,
            }}
          >
            Choose which alert
            categories appear and
            how important they are
            to your organization.
            Overdue or urgent care
            may automatically
            escalate to a higher
            priority.
          </p>

          <div
            style={{
              display:
                "grid",
              gap: 8,
            }}
          >
            {alertPreferences.map(
              (
                preference
              ) => (
                <div
                  key={
                    preference.alertType
                  }
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "minmax(180px, 1fr) 150px 90px",
                    gap: 12,
                    alignItems:
                      "center",
                    border:
                      "1px solid #F0EFED",
                    borderRadius: 8,
                    padding: 11,
                  }}
                >
                  <strong
                    style={{
                      color:
                        "#17233C",
                      fontSize:
                        13.5,
                    }}
                  >
                    {ALERT_TYPE_LABELS[
                      preference
                        .alertType
                    ] ??
                      preference
                        .alertType}
                  </strong>

                  <select
                    value={
                      preference.priority
                    }
                    disabled={
                      !preference.enabled
                    }
                    onChange={(
                      e
                    ) =>
                      changePreferencePriority(
                        preference.alertType,
                        e.target
                          .value as Priority
                      )
                    }
                    style={
                      inputStyle
                    }
                  >
                    <option value="critical">
                      Critical
                    </option>

                    <option value="high">
                      High
                    </option>

                    <option value="normal">
                      Normal
                    </option>

                    <option value="info">
                      Informational
                    </option>
                  </select>

                  <label
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: 6,
                      fontSize: 13,
                      color:
                        "#4F4D49",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        preference.enabled
                      }
                      onChange={(
                        e
                      ) =>
                        changePreferenceEnabled(
                          preference.alertType,
                          e.target
                            .checked
                        )
                      }
                    />

                    Show
                  </label>
                </div>
              )
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems:
                "center",
              flexWrap:
                "wrap",
              marginTop: 16,
            }}
          >
            <button
              type="button"
              disabled={
                savingPreferences
              }
              onClick={
                saveAlertPreferences
              }
              style={
                primaryButton
              }
            >
              {savingPreferences
                ? "Saving…"
                : "Save Alert Preferences"}
            </button>

            {preferenceMessage && (
              <span
                style={{
                  fontSize: 13,
                  color:
                    preferenceMessage.includes(
                      "saved"
                    )
                      ? "#2F6F4E"
                      : "#B23B2E",
                }}
              >
                {
                  preferenceMessage
                }
              </span>
            )}
          </div>
        </section>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 10,
          marginBottom: 24,
        }}
      >
        <StatCard
          value={
            stats.animals_in_care
          }
          label="Animals in Care"
          href="/animals"
        />

        <StatCard
          value={
            stats.active_help_offers
          }
          label="Active Help Offers"
        />

        <StatCard
          value={
            stats.published_profiles
          }
          label="Published Profiles"
        />

        <StatCard
          value={
            stats.adopted_animals
          }
          label="Adopted"
        />
      </div>

      <div
        style={{
          background:
            "#fff",
          border:
            "1px solid #E7E5E1",
          borderRadius: 9,
          padding: 14,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: 16,
            flexWrap:
              "wrap",
          }}
        >
          <div>
            <strong
              style={{
                color:
                  "#17233C",
              }}
            >
              Alert View
            </strong>

            <div
              style={{
                display:
                  "flex",
                gap: 7,
                marginTop: 9,
                flexWrap:
                  "wrap",
              }}
            >
              <FilterButton
                active={
                  filter ===
                  "all"
                }
                onClick={() =>
                  setFilter(
                    "all"
                  )
                }
              >
                All
              </FilterButton>

              <FilterButton
                active={
                  filter ===
                  "medical"
                }
                onClick={() =>
                  setFilter(
                    "medical"
                  )
                }
              >
                Medical
              </FilterButton>

              <FilterButton
                active={
                  filter ===
                  "foster"
                }
                onClick={() =>
                  setFilter(
                    "foster"
                  )
                }
              >
                Foster / Help
              </FilterButton>
            </div>
          </div>

          <div>
            <strong
              style={{
                color:
                  "#17233C",
              }}
            >
              Show Priorities
            </strong>

            <div
              style={{
                display:
                  "flex",
                gap: 7,
                marginTop: 9,
                flexWrap:
                  "wrap",
              }}
            >
              {PRIORITIES.map(
                (
                  priority
                ) => (
                  <label
                    key={
                      priority.key
                    }
                    style={{
                      display:
                        "flex",
                      gap: 5,
                      alignItems:
                        "center",
                      fontSize:
                        12.5,
                      color:
                        "#4F4D49",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        !hiddenPriorities.has(
                          priority.key
                        )
                      }
                      onChange={() =>
                        togglePriority(
                          priority.key
                        )
                      }
                    />

                    {
                      priority.label
                    }
                  </label>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            background:
              "#FFF4F2",
            border:
              "1px solid #F3C7BF",
            borderRadius: 8,
            padding: 12,
            color:
              "#B23B2E",
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {loading && (
        <p>Loading…</p>
      )}

      {!loading &&
        visibleAlerts.length ===
          0 && (
          <div
            style={{
              background:
                "#fff",
              border:
                "1px dashed #D8D6D2",
              borderRadius: 10,
              padding: 24,
            }}
          >
            <strong
              style={{
                color:
                  "#17233C",
                display:
                  "block",
                marginBottom: 5,
              }}
            >
              Nothing needs your
              attention right now.
            </strong>

            <p
              style={{
                margin: 0,
                color:
                  "#6B6862",
                fontSize:
                  13.5,
              }}
            >
              New medical
              reminders,
              medication tasks,
              foster/help offers,
              and other future
              alerts will appear
              here automatically.
            </p>
          </div>
        )}

      {PRIORITIES.map(
        (priority) => {
          const items =
            grouped[
              priority.key
            ];

          if (
            items.length === 0
          ) {
            return null;
          }

          return (
            <PrioritySection
              key={
                priority.key
              }
              priority={
                priority.key
              }
              label={
                priority.label
              }
              alerts={
                items
              }
            />
          );
        }
      )}
    </section>
  );
}

function PrioritySection({
  priority,
  label,
  alerts,
}: {
  priority: Priority;
  label: string;
  alerts: Alert[];
}) {
  const colors =
    priorityColors[
      priority
    ];

  return (
    <section
      style={{
        marginTop: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "space-between",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems:
              "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius:
                "50%",
              background:
                colors.dot,
            }}
          />

          <h2
            style={{
              margin: 0,
              fontSize: 15,
              color:
                "#17233C",
            }}
          >
            {label}
          </h2>
        </div>

        <span
          style={{
            fontSize: 12,
            color:
              "#6B6862",
          }}
        >
          {alerts.length}
        </span>
      </div>

      <div
        style={{
          background:
            "#fff",
          border:
            `1px solid ${colors.border}`,
          borderRadius: 9,
          overflow: "hidden",
        }}
      >
        {alerts.map(
          (
            alert,
            index
          ) => (
            <AlertRow
              key={
                alert.id
              }
              alert={
                alert
              }
              last={
                index ===
                alerts.length -
                  1
              }
            />
          )
        )}
      </div>
    </section>
  );
}

function AlertRow({
  alert,
  last,
}: {
  alert: Alert;
  last: boolean;
}) {
  const colors =
    priorityColors[
      alert.priority
    ];

  const details =
    alert.due_at
      ? relativeDue(
          alert.due_at
        )
      : relativeCreated(
          alert.created_at
        );

  let destination =
    `/animals/${encodeURIComponent(
      alert.animal_id
    )}`;

  if (
    alert.alert_type ===
    "medication"
  ) {
    destination =
      `/animals/${encodeURIComponent(
        alert.animal_id
      )}/medical`;
  }

  if (
    alert.alert_type ===
    "medical"
  ) {
    destination =
      `/animals/${encodeURIComponent(
        alert.animal_id
      )}/medical`;
  }

  if (
    alert.alert_type ===
    "foster_offer"
  ) {
    destination =
      `/animals/${encodeURIComponent(
        alert.animal_id
      )}/offers`;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "minmax(120px, 180px) minmax(200px, 1fr) auto",
        gap: 14,
        alignItems:
          "center",
        padding:
          "11px 14px",
        borderBottom:
          last
            ? "none"
            : "1px solid #F0EFED",
        borderLeft:
          `4px solid ${colors.dot}`,
      }}
    >
      <a
        href={`/animals/${encodeURIComponent(
          alert.animal_id
        )}`}
        style={{
          color:
            "#17233C",
          fontWeight: 700,
          textDecoration:
            "none",
          fontSize: 13.5,
          overflowWrap:
            "anywhere",
        }}
      >
        {alert.animal_name}
      </a>

      <a
        href={destination}
        style={{
          color:
            "#3F3D39",
          textDecoration:
            "none",
          fontSize: 13.5,
        }}
      >
        {alert.title}
      </a>

      <span
        style={{
          color:
            alert.priority ===
            "critical"
              ? "#B23B2E"
              : "#6B6862",
          fontSize: 12,
          whiteSpace:
            "nowrap",
          fontWeight:
            alert.priority ===
            "critical"
              ? 700
              : 500,
        }}
      >
        {details}
      </span>
    </div>
  );
}

function StatCard({
  value,
  label,
  href,
}: {
  value: number;
  label: string;
  href?: string;
}) {
  const content = (
    <>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color:
            "#17233C",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 3,
          fontSize: 12,
          color:
            "#6B6862",
        }}
      >
        {label}
      </div>
    </>
  );

  const style = {
    display: "block",
    background: "#fff",
    border:
      "1px solid #E7E5E1",
    borderRadius: 9,
    padding: 14,
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

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children:
    React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background:
          active
            ? "#17233C"
            : "#fff",

        color:
          active
            ? "#fff"
            : "#17233C",

        border:
          active
            ? "1px solid #17233C"
            : "1px solid #D8D6D2",

        borderRadius: 7,

        padding:
          "6px 10px",

        fontSize: 12.5,

        fontWeight: 700,

        cursor:
          "pointer",
      }}
    >
      {children}
    </button>
  );
}

function relativeDue(
  value: string
) {
  const due =
    new Date(value);

  const now =
    new Date();

  const diffMs =
    due.getTime() -
    now.getTime();

  const days =
    Math.ceil(
      diffMs /
        (1000 *
          60 *
          60 *
          24)
    );

  if (days < 0) {
    const amount =
      Math.abs(days);

    return `${amount} day${
      amount === 1
        ? ""
        : "s"
    } overdue`;
  }

  if (days === 0) {
    return "Today";
  }

  if (days === 1) {
    return "Tomorrow";
  }

  return `In ${days} days`;
}

function relativeCreated(
  value: string
) {
  const created =
    new Date(value);

  const now =
    new Date();

  const diffMinutes =
    Math.max(
      0,
      Math.floor(
        (
          now.getTime() -
          created.getTime()
        ) /
          60000
      )
    );

  if (
    diffMinutes < 60
  ) {
    return `${diffMinutes} min ago`;
  }

  const hours =
    Math.floor(
      diffMinutes / 60
    );

  if (hours < 24) {
    return `${hours} hr${
      hours === 1
        ? ""
        : "s"
    } ago`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  return `${days} day${
    days === 1
      ? ""
      : "s"
  } ago`;
}

const priorityColors:
  Record<
    Priority,
    {
      dot: string;
      border: string;
    }
  > = {
  critical: {
    dot: "#B23B2E",
    border: "#E6C3BD",
  },

  high: {
    dot: "#C58A42",
    border: "#E7D2B4",
  },

  normal: {
    dot: "#2B5C8A",
    border: "#CCD7E2",
  },

  info: {
    dot: "#86827B",
    border: "#DDDAD6",
  },
};

const inputStyle:
  React.CSSProperties =
{
  width: "100%",
  boxSizing:
    "border-box",
  border:
    "1px solid #D8D6D2",
  borderRadius: 6,
  padding: 8,
  background: "#fff",
  color: "#1C1B19",
  fontFamily:
    "inherit",
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
