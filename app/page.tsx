"use client";

import { useEffect, useMemo, useState } from "react";
import { CAPABILITY_FIELDS } from "@/lib/constants";

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
  // capability columns accessed dynamically via CAPABILITY_FIELDS keys
  [key: string]: unknown;
};

function statusBadgeClass(v: unknown): string {
  const s = typeof v === "string" ? v.toLowerCase() : "";
  if (s === "yes") return "txdir-b-yes";
  if (s === "no") return "txdir-b-no";
  if (!s || s === "unknown") return "txdir-b-unknown";
  return "txdir-b-limited"; // limited, case-by-case, etc.
}

function resourceStatusClass(v: string | null): string {
  const s = (v ?? "").toLowerCase();
  if (s.includes("verified") && !s.includes("restricted")) return "txdir-rs-verified";
  if (s.includes("restricted")) return "txdir-rs-restricted";
  if (s.includes("closed") || s.includes("inactive")) return "txdir-rs-closed";
  return "txdir-rs-needed";
}

export default function DirectoryPage() {
  const [orgs, setOrgs] = useState<Org[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [capabilityFilter, setCapabilityFilter] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/orgs")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? "Failed to load organizations.");
        setOrgs(data.organizations ?? []);
      })
      .catch((e) => setError(e.message));
  }, []);

  const regions = useMemo(() => {
    if (!orgs) return [];
    return Array.from(new Set(orgs.map((o) => o.region).filter((r): r is string => !!r))).sort();
  }, [orgs]);

  const speciesOptions = useMemo(() => {
    if (!orgs) return [];
    const all = orgs.flatMap((o) => o.species ?? []);
    return Array.from(new Set(all)).sort();
  }, [orgs]);

  const filtered = useMemo(() => {
    if (!orgs) return [];
    const q = query.trim().toLowerCase();
    return orgs.filter((o) => {
      if (q) {
        const haystack = [o.name, o.city, o.county, o.specialty, o.service_area].filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (regionFilter && o.region !== regionFilter) return false;
      if (speciesFilter && !(o.species ?? []).includes(speciesFilter)) return false;
      if (capabilityFilter) {
        const v = typeof o[capabilityFilter] === "string" ? (o[capabilityFilter] as string).toLowerCase() : "";
        if (v !== "yes" && !v.includes("case") && !v.includes("limit")) return false;
      }
      return true;
    });
  }, [orgs, query, regionFilter, speciesFilter, capabilityFilter]);

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (error) {
    return <p style={{ color: "#B23B2E" }}>{error}</p>;
  }

  return (
    <div className="txdir-root">
      <style>{`
        .txdir-root {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cg fill='%231C1B19' fill-opacity='0.035'%3E%3Cellipse cx='70' cy='78' rx='13' ry='16'/%3E%3Cellipse cx='53' cy='58' rx='6.5' ry='8'/%3E%3Cellipse cx='70' cy='50' rx='7' ry='8.5'/%3E%3Cellipse cx='87' cy='58' rx='6.5' ry='8'/%3E%3C/g%3E%3C/svg%3E");
          background-repeat: repeat;
          margin: -24px -28px;
          padding: 24px 28px;
        }
        .txdir-header { margin-bottom: 4px; }
        .txdir-header h1 { font-size: 20px; margin: 0; }
        .txdir-header p { color: #6B6862; font-size: 13.5px; margin: 5px 0 0; }
        .txdir-count { text-align: right; }
        .txdir-count .num { font-size: 24px; font-weight: 700; line-height: 1; }
        .txdir-count .label { font-size: 11px; color: #6B6862; margin-top: 3px; }
        .txdir-toprow { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }

        .txdir-legend {
          display: flex; gap: 16px; flex-wrap: wrap;
          padding: 0 0 14px 0; margin-bottom: 16px;
          border-bottom: 1px solid #E7E5E1; font-size: 12px;
        }
        .txdir-legend-item { display: flex; align-items: center; gap: 6px; color: #6B6862; }
        .txdir-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

        .txdir-searchbar { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
        .txdir-input, .txdir-select {
          background: #fff; border: 1px solid #E7E5E1; border-radius: 6px;
          padding: 8px 11px; font-size: 13.5px; font-family: inherit; color: #1C1B19;
        }
        .txdir-input { flex: 1; min-width: 200px; }
        .txdir-input:focus, .txdir-select:focus { outline: 2px solid #C05621; outline-offset: 1px; }

        .txdir-results-count { font-size: 12px; color: #6B6862; margin-bottom: 10px; font-family: monospace; }

        .txdir-card {
          background: #fff; border: 1px solid #E7E5E1; border-radius: 6px;
          padding: 14px 16px; margin-bottom: 8px;
          box-shadow: 0 1px 2px rgba(28,27,25,0.04);
        }
        .txdir-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; cursor: pointer; }
        .txdir-card-name { font-size: 14.5px; font-weight: 600; }
        .txdir-card-meta { font-size: 12.5px; color: #6B6862; margin-top: 3px; }
        .txdir-statewide-tag { display: inline-block; color: #C05621; font-weight: 600; font-size: 11.5px; margin-left: 4px; }

        .txdir-resource-status {
          font-size: 11px; font-family: monospace; font-weight: 600;
          padding: 3px 8px; border-radius: 4px; white-space: nowrap;
        }
        .txdir-rs-verified { background: #E4ECF3; color: #2B5C8A; }
        .txdir-rs-restricted { background: #FBEFD9; color: #A66A11; }
        .txdir-rs-needed { background: #EDE8E4; color: #86827B; }
        .txdir-rs-closed { background: #FAE7E3; color: #B23B2E; }

        .txdir-badges { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
        .txdir-badge { font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
        .txdir-b-yes { background: #E4ECF3; color: #2B5C8A; }
        .txdir-b-limited { background: #FBEFD9; color: #A66A11; }
        .txdir-b-unknown { display: none; }
        .txdir-b-no { background: #FAE7E3; color: #B23B2E; }

        .txdir-card-detail { margin-top: 12px; padding-top: 12px; border-top: 1px solid #F0EFEC; font-size: 13px; }
        .txdir-detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px 16px; margin-bottom: 10px; }
        .txdir-detail-grid .k { color: #6B6862; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
        .txdir-detail-grid .v { font-size: 13px; }
        .txdir-notes { color: #6B6862; font-size: 12.5px; margin-top: 8px; }
        .txdir-section-label { font-size: 11.5px; text-transform: uppercase; letter-spacing: .06em; color: #6B6862; font-weight: 600; margin-bottom: 10px; margin-top: 10px; }

        .txdir-empty { text-align: center; padding: 50px 20px; color: #6B6862; }
      `}</style>

      <div className="txdir-toprow">
        <div className="txdir-header">
          <h1>TX Animal Rescue &amp; Resource Database</h1>
          <p>Directory, capability tracking, and self-service updates for Texas rescues, shelters, and resource partners.</p>
        </div>
        <div className="txdir-count">
          <div className="num">{orgs ? orgs.length : "—"}</div>
          <div className="label">Organizations loaded</div>
        </div>
      </div>

      <div className="txdir-legend">
        <div className="txdir-legend-item"><span className="txdir-dot" style={{ background: "#2B5C8A" }} />Yes — verified capability</div>
        <div className="txdir-legend-item"><span className="txdir-dot" style={{ background: "#A66A11" }} />Limited / case-by-case</div>
        <div className="txdir-legend-item"><span className="txdir-dot" style={{ background: "#B23B2E" }} />No</div>
        <div className="txdir-legend-item"><span className="txdir-dot" style={{ background: "#86827B" }} />Unknown — not yet verified (never treat as &quot;No&quot;)</div>
      </div>

      <div className="txdir-searchbar">
        <input
          className="txdir-input"
          placeholder="Search by org name, city, county, or breed…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="txdir-select" value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
          <option value="">All regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select className="txdir-select" value={speciesFilter} onChange={(e) => setSpeciesFilter(e.target.value)}>
          <option value="">All species</option>
          {speciesOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select className="txdir-select" value={capabilityFilter} onChange={(e) => setCapabilityFilter(e.target.value)}>
          <option value="">Any capability</option>
          {CAPABILITY_FIELDS.map((f) => (
            <option key={f.key} value={f.key}>{f.label} (Yes)</option>
          ))}
        </select>
      </div>

      {orgs === null ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className="txdir-results-count">{filtered.length} of {orgs.length} organizations</div>
          {filtered.length === 0 ? (
            <div className="txdir-empty">No organizations match those filters. Try clearing a filter — remember, &quot;Unknown&quot; fields may still be a fit once verified.</div>
          ) : (
            filtered.map((o) => {
              const isOpen = expanded.has(o.id);
              const activeBadges = CAPABILITY_FIELDS.filter((f) => {
                const v = typeof o[f.key] === "string" ? (o[f.key] as string).toLowerCase() : "";
                return v === "yes" || v.includes("case") || v.includes("limit");
              });
              return (
                <div key={o.id} className="txdir-card">
                  <div className="txdir-card-top" onClick={() => toggleExpanded(o.id)}>
                    <div>
                      <div className="txdir-card-name">{o.name}</div>
                      <div className="txdir-card-meta">
                        {[o.org_type, [o.city, o.county].filter(Boolean).join(", "), o.region].filter(Boolean).join(" · ") || "—"}
                        {(o.statewide ?? "").toLowerCase() === "yes" && <span className="txdir-statewide-tag">Statewide</span>}
                      </div>
                    </div>
                    <span className={`txdir-resource-status ${resourceStatusClass(o.resource_status)}`}>
                      {o.resource_status ?? "Verification Needed"}
                    </span>
                  </div>

                  <div className="txdir-badges">
                    {activeBadges.length > 0 ? (
                      activeBadges.map((f) => {
                        const v = o[f.key] as string;
                        return (
                          <span key={f.key} className={`txdir-badge ${statusBadgeClass(v)}`}>
                            {f.label}{v.toLowerCase() !== "yes" ? ` · ${v}` : ""}
                          </span>
                        );
                      })
                    ) : (
                      <span style={{ fontSize: 12, color: "#6B6862" }}>No verified capabilities on file yet</span>
                    )}
                  </div>

                  {isOpen && (
                    <div className="txdir-card-detail">
                      <div className="txdir-detail-grid">
                        <div><div className="k">Focus</div><div className="v">{o.focus || "—"}</div></div>
                        <div><div className="k">Specialty</div><div className="v">{o.specialty || "—"}</div></div>
                        <div><div className="k">Species</div><div className="v">{(o.species ?? []).join(", ") || "—"}</div></div>
                        <div><div className="k">501(c)(3)</div><div className="v">{o.c3_status || "Unclear"}</div></div>
                        <div><div className="k">Service area</div><div className="v">{o.service_area || "—"}</div></div>
                        <div><div className="k">Current intake status</div><div className="v">{o.intake_status || "Unknown"}</div></div>
                        <div><div className="k">Website</div><div className="v">{o.website || "—"}</div></div>
                        <div><div className="k">Social media</div><div className="v">{o.social_media || "—"}</div></div>
                        <div><div className="k">Contact</div><div className="v">{[o.public_email, o.public_phone].filter(Boolean).join(" · ") || "—"}</div></div>
                        <div><div className="k">Last verified</div><div className="v" style={{ fontFamily: "monospace" }}>{o.last_verified || "—"}</div></div>
                      </div>

                      {o.intake_restrictions ? (
                        <>
                          <div className="txdir-section-label">Intake restrictions</div>
                          <div className="txdir-notes" style={{ marginTop: 0 }}>{o.intake_restrictions}</div>
                        </>
                      ) : null}
                      {o.intake_form_url ? (
                        <div className="txdir-detail-grid" style={{ marginTop: 8 }}>
                          <div><div className="k">Intake form</div><div className="v" style={{ fontFamily: "monospace" }}>{o.intake_form_url}</div></div>
                        </div>
                      ) : null}

                      <div className="txdir-section-label">All capabilities</div>
                      {CAPABILITY_FIELDS.map((f) => {
                        const v = (o[f.key] as string) || "Unknown";
                        return (
                          <div key={f.key} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #FAFAF9", fontSize: 12.5 }}>
                            <span style={{ color: "#6B6862" }}>{f.label}</span>
                            <span className={`txdir-badge ${statusBadgeClass(v)}`} style={{ display: v.toLowerCase() === "unknown" ? "inline-block" : undefined, background: v.toLowerCase() === "unknown" ? "#EDE8E4" : undefined, color: v.toLowerCase() === "unknown" ? "#86827B" : undefined }}>
                              {v}
                            </span>
                          </div>
                        );
                      })}

                      {o.notes ? <div className="txdir-notes">{o.notes}</div> : null}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </>
      )}
    </div>
  );
}
