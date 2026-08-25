"use client";

import {
  useEffect,
  useState,
} from "react";

type Profile = {
  id: string;
  display_name: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
};

type Pet = {
  id: string;
  name: string;
  species: string | null;
  breed_or_type: string | null;
  birth_date: string | null;
  approximate_age_text: string | null;
  sex: string | null;
  photo_url: string | null;
  archived_at: string | null;
};

type Stats = {
  activePets: number;
  records: number;
  upcomingReminders: number;
  overdueReminders: number;
};

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  peach: "#FBE3DA",
  pink: "#F2D6DC",
  mint: "#DCF0E8",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
  page: "#FFFDFC",
};

export default function PetOwnerPage() {
  const [
    profile,
    setProfile,
  ] =
    useState<
      Profile | null
    >(null);

  const [
    pets,
    setPets,
  ] =
    useState<
      Pet[]
    >([]);

  const [
    stats,
    setStats,
  ] =
    useState<Stats>({
      activePets: 0,
      records: 0,
      upcomingReminders: 0,
      overdueReminders: 0,
    });

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
    displayName,
    setDisplayName,
  ] =
    useState("");

  const [
    phone,
    setPhone,
  ] =
    useState("");

  const [
    city,
    setCity,
  ] =
    useState("");

  const [
    state,
    setState,
  ] =
    useState("TX");

  const [
    postalCode,
    setPostalCode,
  ] =
    useState("");

  const [
    activating,
    setActivating,
  ] =
    useState(false);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      const res =
        await fetch(
          "/api/pet-owner/profile",
          {
            cache:
              "no-store",
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        if (
          res.status ===
          401
        ) {
          window.location.href =
            "/login?portal=pet-owner";

          return;
        }

        throw new Error(
          data.error ??
            "Couldn't load Pet Owner Portal."
        );
      }

      setProfile(
        data.profile ??
          null
      );

      setPets(
        data.pets ??
          []
      );

      setStats({
        activePets:
          Number(
            data.stats
              ?.activePets ??
              0
          ),
        records:
          Number(
            data.stats
              ?.records ??
              0
          ),
      });

      if (
        data.profile
      ) {
        setDisplayName(
          data.profile
            .display_name ??
            ""
        );
        setPhone(
          data.profile
            .phone ??
            ""
        );
        setCity(
          data.profile
            .city ??
            ""
        );
        setState(
          data.profile
            .state ??
            "TX"
        );
        setPostalCode(
          data.profile
            .postal_code ??
            ""
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't load Pet Owner Portal."
      );
    } finally {
      setLoading(false);
    }
  }

  async function activate(
    e:
      React.FormEvent
  ) {
    e.preventDefault();

    setActivating(true);
    setError(null);

    try {
      const res =
        await fetch(
          "/api/pet-owner/profile",
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                displayName,
                phone,
                city,
                state,
                postalCode,
              }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ??
            "Couldn't activate Pet Owner Portal."
        );
      }

      setProfile(
        data.profile
      );

      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't activate Pet Owner Portal."
      );
    } finally {
      setActivating(false);
    }
  }

  if (loading) {
    return (
      <PageShell>
        <p
          style={{
            color:
              COLORS.muted,
          }}
        >
          Loading…
        </p>
      </PageShell>
    );
  }

  if (!profile) {
    return (
      <PageShell>
        <p
          style={
            eyebrowStyle
          }
        >
          Pet Owner Portal
        </p>

        <h1
          style={
            headingStyle
          }
        >
          Set up your Pet Owner profile
        </h1>

        <p
          style={{
            margin:
              "9px 0 18px",
            color:
              COLORS.muted,
            lineHeight:
              1.55,
            fontSize:
              13.5,
            maxWidth:
              650,
          }}
        >
          Add Pet Owner access to
          your existing Pack of Five
          account. This does not
          change or remove any Rescue
          Manager or Foster access
          you already have.
        </p>

        <form
          onSubmit={
            activate
          }
          style={{
            background:
              COLORS.white,
            border:
              `1px solid ${COLORS.border}`,
            padding:
              18,
            display:
              "grid",
            gap:
              13,
            maxWidth:
              620,
          }}
        >
          <Field
            label="Display name"
            value={
              displayName
            }
            onChange={
              setDisplayName
            }
          />

          <div
            style={
              twoCol
            }
          >
            <Field
              label="Phone"
              value={
                phone
              }
              onChange={
                setPhone
              }
            />

            <Field
              label="City"
              value={
                city
              }
              onChange={
                setCity
              }
            />

            <Field
              label="State"
              value={
                state
              }
              onChange={
                setState
              }
            />

            <Field
              label="ZIP / Postal Code"
              value={
                postalCode
              }
              onChange={
                setPostalCode
              }
            />
          </div>

          <button
            type="submit"
            disabled={
              activating
            }
            style={{
              ...primaryButton,
              opacity:
                activating
                  ? 0.65
                  : 1,
            }}
          >
            {activating
              ? "Activating…"
              : "Activate Pet Owner Portal"}
          </button>

          {error && (
            <p
              role="alert"
              style={
                errorStyle
              }
            >
              {error}
            </p>
          )}
        </form>
      </PageShell>
    );
  }

  const activePets =
    pets.filter(
      (pet) =>
        !pet.archived_at
    );

  return (
    <PageShell>
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
        }}
      >
        <div>
          <p
            style={
              eyebrowStyle
            }
          >
            Pet Owner Portal
          </p>

          <h1
            style={
              headingStyle
            }
          >
            My Pets
          </h1>

          <p
            style={{
              margin:
                "8px 0 0",
              color:
                COLORS.muted,
              fontSize:
                13.5,
            }}
          >
            Keep your pets, records,
            and care information
            together.
          </p>
        </div>

        <a
          href="/pet-owner/pets/new"
          style={
            primaryLink
          }
        >
          + Add Pet
        </a>
      </div>

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(150px, 1fr))",
          gap:
            10,
          margin:
            "18px 0",
        }}
      >
        <StatCard
          value={
            stats.activePets
          }
          label="Active Pets"
        />

        <StatCard
          value={
            stats.records
          }
          label="Saved Records"
        />

        <StatCard
          value={
            stats.upcomingReminders
          }
          label="Upcoming Reminders"
        />

        <StatCard
          value={
            stats.overdueReminders
          }
          label="Overdue"
        />
      </div>

      {error && (
        <p
          role="alert"
          style={
            errorStyle
          }
        >
          {error}
        </p>
      )}

      {activePets.length ===
      0 ? (
        <div
          style={{
            background:
              COLORS.white,
            border:
              `1px solid ${COLORS.border}`,
            padding:
              20,
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
                5,
            }}
          >
            No pets added yet.
          </strong>

          <p
            style={{
              margin:
                "0 0 13px",
              color:
                COLORS.muted,
              fontSize:
                13,
              lineHeight:
                1.5,
            }}
          >
            Add your first pet to
            begin building their
            profile and private
            records.
          </p>

          <a
            href="/pet-owner/pets/new"
            style={
              primaryLink
            }
          >
            Add My First Pet
          </a>
        </div>
      ) : (
        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(230px, 1fr))",
            gap:
              12,
            marginBottom:
              20,
          }}
        >
          {activePets.map(
            (pet) => (
              <PetCard
                key={
                  pet.id
                }
                pet={
                  pet
                }
              />
            )
          )}
        </div>
      )}

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap:
            12,
        }}
      >
        <FeatureCard
          background={
            COLORS.peach
          }
          title="Records & Documents"
          text="Vaccinations, vet visits, medications, microchip information, insurance, licenses, and other pet records."
          href="/pet-owner/records"
        />

        <FeatureCard
          background={
            COLORS.pink
          }
          title="Care & Reminders"
          text="Track medications, vaccines, preventatives, appointments, recurring care, and due dates."
          href="/pet-owner/reminders"
        />

        <FeatureCard
          background={
            COLORS.mint
          }
          title="Resources"
          text="Connect to Pack of Five public resources for responsible pet ownership and finding appropriate help."
          href="/resources"
        />
      </div>
    </PageShell>
  );
}

function PageShell({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          COLORS.page,
        padding:
          "28px 18px 44px",
        boxSizing:
          "border-box",
      }}
    >
      <section
        style={{
          width:
            "100%",
          maxWidth:
            980,
          margin:
            "0 auto",
        }}
      >
        {children}
      </section>
    </main>
  );
}

function Field({
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
    <label
      style={
        labelStyle
      }
    >
      {label}

      <input
        value={
          value
        }
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        style={
          inputStyle
        }
      />
    </label>
  );
}

function PetCard({
  pet,
}: {
  pet: Pet;
}) {
  return (
    <a
      href={`/pet-owner/pets/${encodeURIComponent(
        pet.id
      )}`}
      style={{
        display:
          "block",
        background:
          COLORS.white,
        border:
          `1px solid ${COLORS.border}`,
        color:
          "inherit",
        textDecoration:
          "none",
        overflow:
          "hidden",
      }}
    >
      <div
        style={{
          height:
            150,
          background:
            pet.photo_url
              ? `url("${pet.photo_url}") center/cover no-repeat`
              : COLORS.peach,
          display:
            "grid",
          placeItems:
            "center",
          color:
            COLORS.navy,
          fontSize:
            12,
          fontWeight:
            700,
        }}
      >
        {!pet.photo_url
          ? "Pet Photo"
          : null}
      </div>

      <div
        style={{
          padding:
            13,
        }}
      >
        <strong
          style={{
            color:
              COLORS.navy,
            fontSize:
              16,
          }}
        >
          {pet.name}
        </strong>

        <p
          style={{
            margin:
              "5px 0 0",
            color:
              COLORS.muted,
            fontSize:
              12.5,
          }}
        >
          {[
            pet.species,
            pet.breed_or_type,
          ]
            .filter(
              Boolean
            )
            .join(
              " · "
            ) ||
            "Pet profile"}
        </p>
      </div>
    </a>
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

function FeatureCard({
  background,
  title,
  text,
  href,
}: {
  background: string;
  title: string;
  text: string;
  href?: string;
}) {
  const content = (
    <>
      <h2
        style={{
          margin:
            "0 0 6px",
          color:
            COLORS.navy,
          fontSize:
            16,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin:
            0,
          color:
            COLORS.muted,
          fontSize:
            12.5,
          lineHeight:
            1.5,
        }}
      >
        {text}
      </p>
    </>
  );

  return href ? (
    <a
      href={
        href
      }
      style={{
        background,
        padding:
          16,
        color:
          "inherit",
        textDecoration:
          "none",
      }}
    >
      {content}
    </a>
  ) : (
    <article
      style={{
        background,
        padding:
          16,
      }}
    >
      {content}
    </article>
  );
}

const eyebrowStyle:
  React.CSSProperties =
{
  margin:
    "0 0 6px",
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
};

const headingStyle:
  React.CSSProperties =
{
  margin:
    0,
  color:
    COLORS.navy,
  fontSize:
    30,
  lineHeight:
    1.1,
  letterSpacing:
    "-.025em",
};

const labelStyle:
  React.CSSProperties =
{
  display:
    "grid",
  gap:
    6,
  color:
    COLORS.navy,
  fontSize:
    12.5,
  fontWeight:
    700,
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

const twoCol:
  React.CSSProperties =
{
  display:
    "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap:
    10,
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
    "10px 14px",
  fontWeight:
    800,
  fontSize:
    13,
  cursor:
    "pointer",
  width:
    "fit-content",
};

const primaryLink:
  React.CSSProperties =
{
  display:
    "inline-block",
  background:
    COLORS.navy,
  color:
    "#fff",
  padding:
    "9px 13px",
  textDecoration:
    "none",
  fontWeight:
    800,
  fontSize:
    12.5,
};

const errorStyle:
  React.CSSProperties =
{
  margin:
    0,
  color:
    "#B23B2E",
  fontSize:
    12.5,
  lineHeight:
    1.5,
};
