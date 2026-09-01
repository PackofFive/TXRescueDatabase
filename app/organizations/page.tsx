"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import {
  CAPABILITY_FIELDS,
} from "@/lib/constants";

type Org = {
  id: string;
  name: string;
  org_type: string | null;
  species: string[] | null;
  focus: string | null;
  specialty: string | null;
  c3_status: string | null;
  city: string | null;
  county: string | null;
  service_area: string | null;
  region: string | null;
  statewide: string | null;
  intake_status: string | null;
  intake_restrictions: string | null;
  intake_form_url: string | null;
  website: string | null;
  social_media: string | null;
  public_email: string | null;
  public_phone: string | null;
  resource_status: string | null;
  last_verified: string | null;
  notes: string | null;
  is_claimed: boolean;
  last_org_update: string | null;
  has_logo: boolean;
  logo_updated_at: string | null;

  /*
    Number of currently-published,
    non-adopted animals for this org.
  */
  public_animal_count:
    | number
    | string
    | null;

  [key: string]: unknown;
};

/* =========================================================
   HELPERS
========================================================= */

function statusBadgeClass(
  v: unknown
): string {
  const s =
    typeof v === "string"
      ? v.toLowerCase()
      : "";

  if (s === "yes") {
    return "txdir-b-yes";
  }

  if (s === "no") {
    return "txdir-b-no";
  }

  if (
    !s ||
    s === "unknown"
  ) {
    return "txdir-b-unknown";
  }

  return "txdir-b-limited";
}

function formatDate(
  iso: string
): string {
  const d =
    new Date(iso);

  if (
    isNaN(
      d.getTime()
    )
  ) {
    return iso;
  }

  return d.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

function withProtocol(
  url: string
): string {
  return /^https?:\/\//i.test(
    url
  )
    ? url
    : `https://${url}`;
}

function resourceStatusClass(
  v: string | null
): string {
  const s =
    (v ?? "")
      .toLowerCase();

  if (
    s.includes(
      "verified"
    ) &&
    !s.includes(
      "restricted"
    )
  ) {
    return "txdir-rs-verified";
  }

  if (
    s.includes(
      "restricted"
    )
  ) {
    return "txdir-rs-restricted";
  }

  if (
    s.includes(
      "closed"
    ) ||
    s.includes(
      "inactive"
    )
  ) {
    return "txdir-rs-closed";
  }

  return "txdir-rs-needed";
}

/* =========================================================
   DIRECTORY
========================================================= */

export default function DirectoryPage() {
  const searchParams =
    useSearchParams();

  /*
    Initialize filter state from the URL.

    This is what allows a visitor to:
    Directory
      → Adoptable Pets
      → Back to Directory

    without losing their filters.
  */

  const [
    query,
    setQuery,
  ] =
    useState(
      () =>
        searchParams.get(
          "q"
        ) ?? ""
    );

  const [
    regionFilter,
    setRegionFilter,
  ] =
    useState(
      () =>
        searchParams.get(
          "region"
        ) ?? ""
    );

  const [
    speciesFilter,
    setSpeciesFilter,
  ] =
    useState(
      () =>
        searchParams.get(
          "species"
        ) ?? ""
    );

  const [
    capabilityFilter,
    setCapabilityFilter,
  ] =
    useState(
      () =>
        searchParams.get(
          "capability"
        ) ?? ""
    );

  const initialOpen =
    searchParams.get(
      "open"
    );

  const [
    expanded,
    setExpanded,
  ] =
    useState<Set<string>>(
      () =>
        initialOpen
          ? new Set([
              initialOpen,
            ])
          : new Set()
    );

  const [
    orgs,
    setOrgs,
  ] =
    useState<
      Org[] | null
    >(null);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    showBackToTop,
    setShowBackToTop,
  ] =
    useState(false);

  const headingRef =
    useRef<HTMLHeadingElement>(
      null
    );

  const cardRefs =
    useRef<
      Map<
        string,
        HTMLDivElement
      >
    >(
      new Map()
    );

  /* =====================================================
     REDUCED MOTION
  ===================================================== */

  function prefersReducedMotion() {
    return (
      typeof window !==
        "undefined" &&
      window
        .matchMedia(
          "(prefers-reduced-motion: reduce)"
        )
        .matches
    );
  }

  /* =====================================================
     LOAD ORGS
  ===================================================== */

  useEffect(() => {
    fetch("/api/orgs")
      .then(
        async (r) => {
          const data =
            await r.json();

          if (!r.ok) {
            throw new Error(
              data.error ??
                "Failed to load organizations."
            );
          }

          setOrgs(
            data.organizations ??
              []
          );
        }
      )
      .catch((e) =>
        setError(
          e.message
        )
      );
  }, []);

  /* =====================================================
     KEEP FILTERS IN URL

     replaceState avoids a full navigation/reload.
  ===================================================== */

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const params =
      new URLSearchParams();

    if (
      query.trim()
    ) {
      params.set(
        "q",
        query.trim()
      );
    }

    if (
      regionFilter
    ) {
      params.set(
        "region",
        regionFilter
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
      capabilityFilter
    ) {
      params.set(
        "capability",
        capabilityFilter
      );
    }

    /*
      Preserve one expanded
      organization in the URL.

      This gives the visitor the
      same expanded card when
      returning from Adoptable Pets.
    */

    const firstExpanded =
      Array.from(
        expanded
      )[0];

    if (
      firstExpanded
    ) {
      params.set(
        "open",
        firstExpanded
      );
    }

    const queryString =
      params.toString();

    const next =
      queryString
        ? `/organizations?${queryString}`
        : "/organizations";

    window.history.replaceState(
      null,
      "",
      `${next}${window.location.hash}`
    );
  }, [
    query,
    regionFilter,
    speciesFilter,
    capabilityFilter,
    expanded,
  ]);

  /* =====================================================
     RESTORE HASH LOCATION AFTER RETURN
  ===================================================== */

  useEffect(() => {
    if (
      !orgs ||
      typeof window ===
        "undefined"
    ) {
      return;
    }

    const hash =
      window.location.hash;

    if (
      !hash.startsWith(
        "#org-"
      )
    ) {
      return;
    }

    const id =
      hash.replace(
        "#org-",
        ""
      );

    const timer =
      window.setTimeout(
        () => {
          const el =
            cardRefs.current.get(
              id
            );

          if (el) {
            el.scrollIntoView({
              behavior:
                prefersReducedMotion()
                  ? "auto"
                  : "smooth",

              block:
                "center",
            });

            el.focus();
          }
        },
        150
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [orgs]);

  /* =====================================================
     SCROLL
  ===================================================== */

  useEffect(() => {
    function onScroll() {
      setShowBackToTop(
        window.scrollY >
          400
      );
    }

    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true,
      }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );
  }, []);

  const scrollToTop =
    useCallback(() => {
      window.scrollTo({
        top: 0,

        behavior:
          prefersReducedMotion()
            ? "auto"
            : "smooth",
      });

      headingRef.current?.focus();
    }, []);

  /* =====================================================
     OPTIONS
  ===================================================== */

  const regions =
    useMemo(() => {
      if (!orgs) {
        return [];
      }

      return Array.from(
        new Set(
          orgs
            .map(
              (o) =>
                o.region
            )
            .filter(
              (
                r
              ): r is string =>
                !!r
            )
        )
      ).sort();
    }, [orgs]);

  const speciesOptions = [
    "Cat",
    "Dog",
    "Other",
  ];

  /* =====================================================
     FILTERING
  ===================================================== */

  const filtered =
    useMemo(() => {
      if (!orgs) {
        return [];
      }

      const q =
        query
          .trim()
          .toLowerCase();

      return orgs.filter(
        (o) => {
          if (q) {
            const haystack =
              [
                o.name,
                o.city,
                o.county,
                o.specialty,
                o.service_area,
              ]
                .filter(
                  Boolean
                )
                .join(" ")
                .toLowerCase();

            if (
              !haystack.includes(
                q
              )
            ) {
              return false;
            }
          }

          if (
            regionFilter &&
            o.region !==
              regionFilter
          ) {
            return false;
          }

          if (
            speciesFilter &&
            !(
              o.species ??
              []
            ).includes(
              speciesFilter
            )
          ) {
            return false;
          }

          if (
            capabilityFilter
          ) {
            const v =
              typeof o[
                capabilityFilter
              ] === "string"
                ? (
                    o[
                      capabilityFilter
                    ] as string
                  ).toLowerCase()
                : "";

            if (
              v !== "yes" &&
              !v.includes(
                "case"
              ) &&
              !v.includes(
                "limit"
              )
            ) {
              return false;
            }
          }

          return true;
        }
      );
    }, [
      orgs,
      query,
      regionFilter,
      speciesFilter,
      capabilityFilter,
    ]);

  /* =====================================================
     ALPHABET
  ===================================================== */

  const ALPHABET =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
      ""
    );

  const letterIndex =
    useMemo(() => {
      const map:
        Record<
          string,
          string
        > = {};

      for (
        const o of filtered
      ) {
        const first =
          o.name
            .trim()
            .charAt(0)
            .toUpperCase();

        if (
          /[A-Z]/.test(
            first
          ) &&
          !map[first]
        ) {
          map[first] =
            o.id;
        }
      }

      return map;
    }, [filtered]);

  const jumpToLetter =
    useCallback(
      (
        letter: string
      ) => {
        const orgId =
          letterIndex[
            letter
          ];

        if (!orgId) {
          return;
        }

        const el =
          cardRefs.current.get(
            orgId
          );

        if (!el) {
          return;
        }

        el.scrollIntoView({
          behavior:
            prefersReducedMotion()
              ? "auto"
              : "smooth",

          block:
            "start",
        });

        el.focus();
      },
      [letterIndex]
    );

  /* =====================================================
     EXPAND
  ===================================================== */

  function toggleExpanded(
    id: string
  ) {
    setExpanded(
      (prev) => {
        const next =
          new Set(prev);

        if (
          next.has(id)
        ) {
          next.delete(id);
        } else {
          next.add(id);
        }

        return next;
      }
    );
  }

  /* =====================================================
     ADOPTABLE LINK

     Creates a return URL containing:
     - current search
     - region
     - species
     - capability
     - expanded org
     - #org-ID anchor
  ===================================================== */

  function adoptableHref(
    org: Org
  ) {
    const params =
      new URLSearchParams();

    if (
      query.trim()
    ) {
      params.set(
        "q",
        query.trim()
      );
    }

    if (
      regionFilter
    ) {
      params.set(
        "region",
        regionFilter
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
      capabilityFilter
    ) {
      params.set(
        "capability",
        capabilityFilter
      );
    }

    if (
      expanded.has(
        org.id
      )
    ) {
      params.set(
        "open",
        org.id
      );
    }

    const qs =
      params.toString();

    const returnTo =
      `/organizations${
        qs
          ? `?${qs}`
          : ""
      }#org-${org.id}`;

    return (
      `/organizations/${encodeURIComponent(
        org.id
      )}/adoptable?returnTo=` +
      encodeURIComponent(
        returnTo
      )
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <p
        style={{
          color:
            "#B23B2E",
        }}
      >
        {error}
      </p>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="txdir-root">
      <style>{`
        .txdir-root {
          background: #FFFFFF;
          margin: -24px -28px;
          min-height: 100vh;
          color: #1E3A5F;
        }

        .txdir-content {
          max-width: 1120px;
          margin: 0 auto;
          padding: 24px 28px 50px;
        }

        .txdir-header {
          margin-bottom: 4px;
        }

        .txdir-header h1 {
          font-size: 28px;
          line-height: 1.1;
          letter-spacing: -.025em;
          margin: 0;
          color: #1E3A5F;
        }

        .txdir-header p {
          color: #4A5D75;
          font-size: 13.5px;
          margin: 5px 0 0;
        }

        .txdir-count {
          text-align: right;
        }

        .txdir-count .num {
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
        }

        .txdir-count .label {
          font-size: 11px;
          color: #4A5D75;
          margin-top: 3px;
        }

        .txdir-toprow {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 16px;
        }

        .txdir-legend {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          padding: 0 0 14px 0;
          margin-bottom: 16px;
          border-bottom: 1px solid #E8EDF2;
          font-size: 12px;
        }

        .txdir-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #4A5D75;
        }

        .txdir-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .txdir-searchbar {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .txdir-input,
        .txdir-select {
          background: #fff;
          border: 1px solid #DCE4EC;
          border-radius: 6px;
          padding: 8px 11px;
          font-size: 13.5px;
          font-family: inherit;
          color: #1E3A5F;
        }

        .txdir-input {
          flex: 1;
          min-width: 200px;
        }

        .txdir-input:focus,
        .txdir-select:focus {
          outline: 2px solid #E85C56;
          outline-offset: 1px;
        }

        .txdir-results-count {
          font-size: 12px;
          color: #4A5D75;
          margin-bottom: 10px;
          font-family: monospace;
        }

        .txdir-card {
          background: #fff;
          border: 1px solid #DCE4EC;
          border-radius: 6px;
          padding: 14px 16px;
          margin-bottom: 8px;
          box-shadow: none;
          scroll-margin-top: 90px;
        }

        .txdir-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
          border-radius: 4px;
        }

        .txdir-card-name {
          font-size: 14.5px;
          font-weight: 600;
        }

        .txdir-card-meta {
          font-size: 12.5px;
          color: #4A5D75;
          margin-top: 3px;
        }

        .txdir-statewide-tag {
          display: inline-block;
          color: #E85C56;
          font-weight: 600;
          font-size: 11.5px;
          margin-left: 4px;
        }

        .txdir-verified-tag {
          display: inline-block;
          color: #2B5C8A;
          font-weight: 600;
          font-size: 11.5px;
          margin-left: 4px;
        }

        .txdir-update-note {
          font-size: 12px;
          color: #4A5D75;
        }

        .txdir-resource-status {
          font-size: 11px;
          font-family: monospace;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          white-space: nowrap;
        }

        .txdir-rs-verified {
          background: #E4ECF3;
          color: #2B5C8A;
        }

        .txdir-rs-restricted {
          background: #FBEFD9;
          color: #A66A11;
        }

        .txdir-rs-needed {
          background: #EDE8E4;
          color: #86827B;
        }

        .txdir-rs-closed {
          background: #FAE7E3;
          color: #B23B2E;
        }

        .txdir-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 10px;
        }

        .txdir-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        .txdir-adoptable-link {
          display: inline-block;
          background: #1E3A5F;
          color: #fff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          border-radius: 6px;
          padding: 7px 10px;
        }

        .txdir-adoptable-link:hover {
          background: #294E78;
        }

        .txdir-adoptable-link:focus-visible {
          outline: 3px solid #E85C56;
          outline-offset: 2px;
        }

        .txdir-claim-row {
          margin-top: 8px;
        }

        .txdir-claim-link {
          font-size: 12px;
          color: #E85C56;
          text-decoration: none;
          font-weight: 600;
        }

        .txdir-claim-link:hover {
          text-decoration: underline;
        }

        .txdir-claim-link:focus-visible {
          outline: 3px solid #E85C56;
          outline-offset: 2px;
          border-radius: 2px;
        }

        .txdir-badge {
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 600;
        }

        .txdir-b-yes {
          background: #E4ECF3;
          color: #2B5C8A;
        }

        .txdir-b-limited {
          background: #FBEFD9;
          color: #A66A11;
        }

        .txdir-b-unknown {
          display: none;
        }

        .txdir-b-no {
          background: #FAE7E3;
          color: #B23B2E;
        }

        .txdir-card-detail {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #F0EFEC;
          font-size: 13px;
        }

        .txdir-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 10px 20px;
          margin-bottom: 10px;
        }

        .txdir-detail-grid > div {
          min-width: 0;
        }

        .txdir-detail-grid .k {
          color: #4A5D75;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .txdir-detail-grid .v {
          font-size: 13px;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .txdir-detail-grid .v a {
          color: #E85C56;
          text-decoration: none;
        }

        .txdir-detail-grid .v a:hover {
          text-decoration: underline;
        }

        .txdir-notes {
          color: #4A5D75;
          font-size: 12.5px;
          margin-top: 8px;
        }

        .txdir-section-label {
          font-size: 11.5px;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: #4A5D75;
          font-weight: 600;
          margin-bottom: 10px;
          margin-top: 10px;
        }

        .txdir-empty {
          text-align: center;
          padding: 50px 20px;
          color: #4A5D75;
        }

        .txdir-card:focus,
        .txdir-card-top:focus-visible,
        .txdir-back-to-top:focus-visible,
        .txdir-alpha-btn:focus-visible {
          outline: 3px solid #E85C56;
          outline-offset: 2px;
        }

        .txdir-back-to-top {
          position: fixed;
          right: 24px;
          bottom: 24px;
          background: #1E3A5F;
          color: #fff;
          border: none;
          border-radius: 999px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          box-shadow: none;
          z-index: 40;
        }

        .txdir-back-to-top:hover {
          background: #294E78;
        }

        .txdir-alpha-nav {
          position: fixed;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: #fff;
          border: 1px solid #DCE4EC;
          border-radius: 8px;
          padding: 6px 3px;
          z-index: 30;
        }

        .txdir-alpha-btn {
          background: none;
          border: none;
          font-family: monospace;
          font-size: 11px;
          font-weight: 600;
          color: #1E3A5F;
          padding: 2px 5px;
          border-radius: 3px;
          cursor: pointer;
          line-height: 1.4;
        }

        .txdir-alpha-btn:hover:not(:disabled) {
          background: #FBEFF1;
          color: #E85C56;
        }

        .txdir-alpha-btn:disabled {
          color: #A7B2BE;
          cursor: default;
        }

        @media (max-width: 860px) {
          .txdir-alpha-nav {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .txdir-root {
            margin: -24px;
          }

          .txdir-content {
            padding: 20px 16px 40px;
          }

          .txdir-toprow {
            flex-direction: column;
          }

          .txdir-count {
            text-align: left;
          }

          .txdir-card-top {
            flex-direction: column;
          }

          .txdir-resource-status {
            align-self: flex-start;
          }

          .txdir-input,
          .txdir-select {
            width: 100%;
          }
        }
      `}</style>

      <div className="txdir-content">

      {/* ===============================================
          ALPHABET
      ================================================ */}

      <nav
        className="txdir-alpha-nav"
        aria-label="Jump to organizations by first letter"
      >
        {ALPHABET.map(
          (letter) => {
            const hasMatch =
              !!letterIndex[
                letter
              ];

            return (
              <button
                key={letter}
                type="button"
                className="txdir-alpha-btn"
                onClick={() =>
                  jumpToLetter(
                    letter
                  )
                }
                disabled={
                  !hasMatch
                }
                aria-label={
                  hasMatch
                    ? `Jump to organizations starting with ${letter}`
                    : `No organizations starting with ${letter} in the current results`
                }
              >
                {letter}
              </button>
            );
          }
        )}
      </nav>

      {/* ===============================================
          BACK TO TOP
      ================================================ */}

      {showBackToTop && (
        <button
          type="button"
          className="txdir-back-to-top"
          onClick={
            scrollToTop
          }
          aria-label="Back to top of page"
        >
          ↑ Top
        </button>
      )}

      {/* ===============================================
          HEADER
      ================================================ */}

      <div className="txdir-toprow">
        <div className="txdir-header">
          <h1
            ref={
              headingRef
            }
            tabIndex={-1}
          >
            Texas Organization
            Directory
          </h1>

          <p>
            Find Texas rescues, shelters, and animal-welfare
            organizations by location, species, and services.
          </p>
        </div>

        <div className="txdir-count">
          <div className="num">
            {orgs
              ? orgs.length
              : "—"}
          </div>

          <div className="label">
            Organizations
          </div>
        </div>
      </div>

      {/* ===============================================
          LEGEND
      ================================================ */}

      <div className="txdir-legend">
        <div className="txdir-legend-item">
          <span
            className="txdir-dot"
            style={{
              background:
                "#2B5C8A",
            }}
          />
          Yes — verified capability
        </div>

        <div className="txdir-legend-item">
          <span
            className="txdir-dot"
            style={{
              background:
                "#A66A11",
            }}
          />
          Limited / case-by-case
        </div>

        <div className="txdir-legend-item">
          <span
            className="txdir-dot"
            style={{
              background:
                "#B23B2E",
            }}
          />
          No
        </div>

        <div className="txdir-legend-item">
          <span
            className="txdir-dot"
            style={{
              background:
                "#86827B",
            }}
          />
          Unknown — not yet verified
          (never treat as
          &quot;No&quot;)
        </div>
      </div>

      {/* ===============================================
          SEARCH / FILTERS
      ================================================ */}

      <div className="txdir-searchbar">
        <input
          className="txdir-input"
          placeholder="Search by org name, city, county, or breed…"
          value={query}
          onChange={(e) =>
            setQuery(
              e.target.value
            )
          }
        />

        <select
          className="txdir-select"
          value={
            regionFilter
          }
          onChange={(e) =>
            setRegionFilter(
              e.target.value
            )
          }
        >
          <option value="">
            All regions
          </option>

          {regions.map(
            (r) => (
              <option
                key={r}
                value={r}
              >
                {r}
              </option>
            )
          )}
        </select>

        <select
          className="txdir-select"
          value={
            speciesFilter
          }
          onChange={(e) =>
            setSpeciesFilter(
              e.target.value
            )
          }
        >
          <option value="">
            All species
          </option>

          {speciesOptions.map(
            (s) => (
              <option
                key={s}
                value={s}
              >
                {s}
              </option>
            )
          )}
        </select>

        <select
          className="txdir-select"
          value={
            capabilityFilter
          }
          onChange={(e) =>
            setCapabilityFilter(
              e.target.value
            )
          }
        >
          <option value="">
            Any capability
          </option>

          {CAPABILITY_FIELDS.map(
            (f) => (
              <option
                key={
                  f.key
                }
                value={
                  f.key
                }
              >
                {f.label} (Yes)
              </option>
            )
          )}
        </select>
      </div>

      {/* ===============================================
          ORGANIZATIONS
      ================================================ */}

      {orgs === null ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className="txdir-results-count">
            {filtered.length} of{" "}
            {orgs.length}{" "}
            organizations
          </div>

          {filtered.length ===
          0 ? (
            <div className="txdir-empty">
              No organizations
              match those filters.
              Try clearing a
              filter — remember,
              &quot;Unknown&quot;
              fields may still be
              a fit once verified.
            </div>
          ) : (
            filtered.map(
              (o) => {
                const isOpen =
                  expanded.has(
                    o.id
                  );

                const publicAnimalCount =
                  Number(
                    o.public_animal_count ??
                      0
                  );

                const activeBadges =
                  CAPABILITY_FIELDS.filter(
                    (f) => {
                      const v =
                        typeof o[
                          f.key
                        ] ===
                        "string"
                          ? (
                              o[
                                f.key
                              ] as string
                            ).toLowerCase()
                          : "";

                      return (
                        v ===
                          "yes" ||
                        v.includes(
                          "case"
                        ) ||
                        v.includes(
                          "limit"
                        )
                      );
                    }
                  );

                return (
                  <div
                    key={o.id}
                    id={`org-${o.id}`}
                    className="txdir-card"
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    aria-controls={`org-detail-${o.id}`}
                    onClick={(event) => {
                      const target = event.target as HTMLElement;
                      if (target.closest("a, button, input, select, textarea, label")) return;
                      toggleExpanded(o.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleExpanded(o.id);
                      }
                    }}
                    ref={(
                      el
                    ) => {
                      if (el) {
                        cardRefs.current.set(
                          o.id,
                          el
                        );
                      } else {
                        cardRefs.current.delete(
                          o.id
                        );
                      }
                    }}
                  >
                    {/* CARD HEADER */}

                    <div
                      className="txdir-card-top"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                        <div style={{ width: 58, height: 58, flex: "0 0 58px", display: "grid", placeItems: "center", overflow: "hidden", border: "1px solid #DCE4EC", borderRadius: 8, background: "#F5F7F9", color: "#1E3A5F", fontWeight: 900, fontSize: 15 }}>
                          {o.has_logo ? (
                            <img src={`/api/orgs?logo=${encodeURIComponent(o.id)}&v=${encodeURIComponent(o.logo_updated_at ?? "1")}`} alt={`${o.name} logo`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "contain", background: "#fff" }} />
                          ) : organizationInitials(o.name)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                        <div className="txdir-card-name">
                          {o.name}
                        </div>

                        <div className="txdir-card-meta">
                          {[
                            o.org_type,

                            [
                              o.city,
                              o.county,
                            ]
                              .filter(
                                Boolean
                              )
                              .join(
                                ", "
                              ),

                            o.region,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              " · "
                            ) ||
                            "—"}

                          {(o.statewide ??
                            "")
                            .toLowerCase() ===
                            "yes" && (
                            <span className="txdir-statewide-tag">
                              Statewide
                            </span>
                          )}

                          {o.is_claimed && (
                            <span className="txdir-verified-tag">
                              ✓ Org-Verified
                            </span>
                          )}
                        </div>
                        </div>
                      </div>

                      <span
                        className={`txdir-resource-status ${resourceStatusClass(
                          o.resource_status
                        )}`}
                      >
                        {o.resource_status ??
                          "Verification Needed"}
                      </span>
                    </div>

                    {/* CAPABILITY BADGES */}

                    <div className="txdir-badges">
                      {activeBadges.length >
                      0 ? (
                        activeBadges.map(
                          (f) => {
                            const v =
                              o[
                                f.key
                              ] as string;

                            return (
                              <span
                                key={
                                  f.key
                                }
                                className={`txdir-badge ${statusBadgeClass(
                                  v
                                )}`}
                              >
                                {f.label}

                                {v.toLowerCase() !==
                                  "yes"
                                  ? ` · ${v}`
                                  : ""}
                              </span>
                            );
                          }
                        )
                      ) : (
                        <span
                          style={{
                            fontSize: 12,
                            color:
                              "#6B6862",
                          }}
                        >
                          No verified
                          capabilities
                          on file yet
                        </span>
                      )}
                    </div>

                    {/* PUBLIC ACTIONS */}

                    <div className="txdir-actions">
                      {publicAnimalCount >
                        0 && (
                        <a
                          href={adoptableHref(
                            o
                          )}
                          className="txdir-adoptable-link"
                          onClick={(
                            e
                          ) =>
                            e.stopPropagation()
                          }
                        >
                          View Adoptable Pets (
                          {
                            publicAnimalCount
                          }
                          )
                        </a>
                      )}

                      {o.is_claimed ? (
                        <div className="txdir-claim-row">
                          {o.last_org_update && (
                            <div className="txdir-update-note">
                              Last updated by this organization: {formatDate(o.last_org_update)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <a
                          href={`/claim?orgId=${o.id}&name=${encodeURIComponent(
                            o.name
                          )}`}
                          className="txdir-claim-link"
                          onClick={(
                            e
                          ) =>
                            e.stopPropagation()
                          }
                        >
                          Is this your
                          organization?
                          Claim it
                        </a>
                      )}
                    </div>

                    {/* EXPANDED DETAILS */}

                    {isOpen && (
                      <div
                        className="txdir-card-detail"
                        id={`org-detail-${o.id}`}
                        role="region"
                        aria-label={`Details for ${o.name}`}
                      >
                        <div className="txdir-detail-grid">
                          <div>
                            <div className="k">
                              Focus
                            </div>

                            <div className="v">
                              {o.focus ||
                                "—"}
                            </div>
                          </div>

                          <div>
                            <div className="k">
                              Specialty
                            </div>

                            <div className="v">
                              {o.specialty ||
                                "—"}
                            </div>
                          </div>

                          <div>
                            <div className="k">
                              Species
                            </div>

                            <div className="v">
                              {(o.species ??
                                []).join(
                                ", "
                              ) ||
                                "—"}
                            </div>
                          </div>

                          <div>
                            <div className="k">
                              501(c)(3)
                            </div>

                            <div className="v">
                              {o.c3_status ||
                                "Unclear"}
                            </div>
                          </div>

                          <div>
                            <div className="k">
                              Service area
                            </div>

                            <div className="v">
                              {o.service_area ||
                                "—"}
                            </div>
                          </div>

                          <div>
                            <div className="k">
                              Current intake
                              status
                            </div>

                            <div className="v">
                              {o.intake_status ||
                                "Unknown"}
                            </div>
                          </div>

                          <div>
                            <div className="k">
                              Website
                            </div>

                            <div className="v">
                              {o.website ? (
                                <a
                                  href={withProtocol(
                                    o.website
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {
                                    o.website
                                  }
                                </a>
                              ) : (
                                "—"
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="k">
                              Social media
                            </div>

                            <div className="v">
                              {o.social_media ? (
                                <a
                                  href={withProtocol(
                                    o.social_media
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {
                                    o.social_media
                                  }
                                </a>
                              ) : (
                                "—"
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="k">
                              Contact
                            </div>

                            <div className="v">
                              {o.public_email ||
                              o.public_phone ? (
                                <>
                                  {o.public_email && (
                                    <a
                                      href={`mailto:${o.public_email}`}
                                    >
                                      {
                                        o.public_email
                                      }
                                    </a>
                                  )}

                                  {o.public_email &&
                                    o.public_phone &&
                                    " · "}

                                  {o.public_phone && (
                                    <a
                                      href={`tel:${o.public_phone.replace(
                                        /[^\d+]/g,
                                        ""
                                      )}`}
                                    >
                                      {
                                        o.public_phone
                                      }
                                    </a>
                                  )}
                                </>
                              ) : (
                                "—"
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="k">
                              Last verified
                            </div>

                            <div
                              className="v"
                              style={{
                                fontFamily:
                                  "monospace",
                              }}
                            >
                              {o.last_verified ||
                                "—"}
                            </div>
                          </div>
                        </div>

                        {o.intake_restrictions ? (
                          <>
                            <div className="txdir-section-label">
                              Intake
                              restrictions
                            </div>

                            <div
                              className="txdir-notes"
                              style={{
                                marginTop: 0,
                              }}
                            >
                              {
                                o.intake_restrictions
                              }
                            </div>
                          </>
                        ) : null}

                        {o.intake_form_url ? (
                          <div
                            className="txdir-detail-grid"
                            style={{
                              marginTop: 8,
                            }}
                          >
                            <div>
                              <div className="k">
                                Intake form
                              </div>

                              <div className="v">
                                <a
                                  href={withProtocol(
                                    o.intake_form_url
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {
                                    o.intake_form_url
                                  }
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        <div className="txdir-section-label">
                          All
                          capabilities
                        </div>

                        {CAPABILITY_FIELDS.map(
                          (f) => {
                            const v =
                              (o[
                                f.key
                              ] as string) ||
                              "Unknown";

                            return (
                              <div
                                key={
                                  f.key
                                }
                                style={{
                                  display:
                                    "flex",
                                  justifyContent:
                                    "space-between",
                                  padding:
                                    "4px 0",
                                  borderBottom:
                                    "1px solid #FAFAF9",
                                  fontSize:
                                    12.5,
                                  gap: 12,
                                }}
                              >
                                <span
                                  style={{
                                    color:
                                      "#6B6862",
                                  }}
                                >
                                  {
                                    f.label
                                  }
                                </span>

                                <span
                                  className={`txdir-badge ${statusBadgeClass(
                                    v
                                  )}`}
                                  style={{
                                    display:
                                      v.toLowerCase() ===
                                      "unknown"
                                        ? "inline-block"
                                        : undefined,

                                    background:
                                      v.toLowerCase() ===
                                      "unknown"
                                        ? "#EDE8E4"
                                        : undefined,

                                    color:
                                      v.toLowerCase() ===
                                      "unknown"
                                        ? "#86827B"
                                        : undefined,
                                  }}
                                >
                                  {v}
                                </span>
                              </div>
                            );
                          }
                        )}

                        {o.notes ? (
                          <div className="txdir-notes">
                            {
                              o.notes
                            }
                          </div>
                        ) : null}

                        {o.is_claimed && (
                          <div style={{ marginTop: 18, paddingTop: 12, borderTop: "1px solid #E7E5E1" }}>
                            <a
                              href={`/claim?orgId=${o.id}&name=${encodeURIComponent(o.name)}`}
                              className="txdir-claim-link"
                              onClick={(event) => event.stopPropagation()}
                            >
                              Report a listing or access issue
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            )
          )}
        </>
      )}
      </div>
    </div>
  );
}

function organizationInitials(name:string){return name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]?.toUpperCase()).join("")||"ORG";}
