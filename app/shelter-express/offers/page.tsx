"use client";

import { useEffect, useMemo, useState } from "react";

type Offer = {
  id: string; animal_id: string; animal_name: string; offer_type: string;
  contact_name: string; contact_email: string; contact_phone: string | null;
  city: string | null; availability: string | null; message: string | null;
  status: string; urgency: string | null; created_at: string;
};
type Filter = "needs_action" | "all" | "accepted" | "closed";

const C = { navy: "#1E3A5F", coral: "#E85C56", muted: "#4A5D75", border: "#DCE4EC", mint: "#DCF0E8", pink: "#F2D6DC" };
const actionStatuses = new Set(["new", "reviewing", "contacted"]);
const closedStatuses = new Set(["declined", "closed"]);

export default function ShelterOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filter, setFilter] = useState<Filter>("needs_action");
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/shelter-express/offers", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Offers could not be loaded.");
        setOffers(data.offers ?? []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Offers could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => ({
    needs_action: offers.filter((offer) => actionStatuses.has(offer.status)).length,
    all: offers.length,
    accepted: offers.filter((offer) => offer.status === "accepted").length,
    closed: offers.filter((offer) => closedStatuses.has(offer.status)).length,
  }), [offers]);

  const visibleOffers = useMemo(() => {
    if (filter === "needs_action") return offers.filter((offer) => actionStatuses.has(offer.status));
    if (filter === "accepted") return offers.filter((offer) => offer.status === "accepted");
    if (filter === "closed") return offers.filter((offer) => closedStatuses.has(offer.status));
    return offers;
  }, [filter, offers]);

  async function update(id: string, status: string) {
    setWorkingId(id); setError(""); setMessage("");
    try {
      const response = await fetch("/api/shelter-express/offers", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId: id, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The offer could not be updated.");
      setOffers((rows) => rows.map((row) => row.id === id ? { ...row, status } : row));
      setMessage("Offer status updated.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The offer could not be updated.");
    } finally { setWorkingId(""); }
  }

  return <div>
    <p style={eyebrow}>Coordination</p><h1 style={title}>Rescue &amp; Tag Offers</h1>
    <p style={intro}>Review rescue interest, tag requests, foster help, transport, and other offers submitted for your urgent animals.</p>
    {error ? <div role="alert" style={{ ...notice, color: "#B93A2E", background: "#FBE3DA" }}>{error}</div> : null}
    {message ? <div role="status" style={{ ...notice, background: C.mint }}>{message}</div> : null}

    <section aria-label="Offer filters" style={filterPanel}>
      {([["needs_action", "Needs action"], ["all", "All"], ["accepted", "Accepted"], ["closed", "Closed"]] as Array<[Filter, string]>).map(([key, label]) =>
        <button key={key} type="button" onClick={() => setFilter(key)} style={{ ...filterButton, ...(filter === key ? activeFilterButton : {}) }}>{label} ({counts[key]})</button>
      )}
    </section>

    {loading ? <div style={notice}>Loading offers…</div> : null}
    {!loading && offers.length === 0 ? <div style={{ ...notice, background: C.mint }}><strong>No offers have been submitted yet.</strong><div style={{ marginTop: 5 }}>New help offers will appear here and stay connected to the animal listing.</div></div> : null}
    {!loading && offers.length > 0 && visibleOffers.length === 0 ? <div style={{ ...notice, background: C.mint }}><strong>You&apos;re all caught up.</strong><div style={{ marginTop: 5 }}>There are no offers in this queue.</div></div> : null}

    <div style={{ display: "grid", gap: 14 }}>{visibleOffers.map((offer) =>
      <article key={offer.id} style={card}>
        <div style={cardHeader}><div><div style={offerType}>{labelFor(offer.offer_type)}</div><h2 style={animalName}>{offer.animal_name}</h2><p style={submitted}>Submitted {new Date(offer.created_at).toLocaleDateString()}</p></div><span style={{ ...badge, background: offer.status === "accepted" ? C.mint : C.pink }}>{labelFor(offer.status)}</span></div>
        <div style={detailsGrid}><Detail label="From" value={offer.contact_name}/><Detail label="Location" value={offer.city || "Not provided"}/><Detail label="Availability" value={offer.availability || "Not provided"}/><Detail label="Animal priority" value={offer.urgency ? labelFor(offer.urgency) : "Not marked"}/></div>
        {offer.message ? <div style={messagePanel}>{offer.message}</div> : null}
        <div style={actions}>
          <a href={`mailto:${offer.contact_email}`} style={primary}>Email {offer.contact_name}</a>
          {offer.contact_phone ? <a href={`tel:${offer.contact_phone}`} style={secondary}>Call {offer.contact_phone}</a> : null}
          <a href={`/animals/${offer.animal_id}/offers`} style={secondary}>Open animal offers</a>
          <label style={statusLabel}>Status<select aria-label={`Status for ${offer.animal_name}`} value={offer.status} disabled={workingId === offer.id} onChange={(event) => void update(offer.id, event.target.value)} style={select}>{["new", "reviewing", "contacted", "accepted", "declined", "closed"].map((status) => <option key={status} value={status}>{labelFor(status)}</option>)}</select></label>
        </div>
      </article>
    )}</div>
  </div>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div><div style={detailLabel}>{label}</div><div style={detailValue}>{value}</div></div>; }
function labelFor(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase()); }

const eyebrow:React.CSSProperties={margin:"0 0 8px",color:C.coral,fontWeight:800,fontSize:12,letterSpacing:".1em",textTransform:"uppercase"};
const title:React.CSSProperties={margin:0,color:C.navy,fontSize:38,lineHeight:1.1};
const intro:React.CSSProperties={margin:"12px 0 22px",color:C.muted,fontSize:16,lineHeight:1.6,maxWidth:760};
const notice:React.CSSProperties={padding:18,border:`1px solid ${C.border}`,color:C.navy,marginBottom:16};
const filterPanel:React.CSSProperties={display:"flex",gap:8,flexWrap:"wrap",marginBottom:20};
const filterButton:React.CSSProperties={padding:"9px 13px",border:`1px solid ${C.border}`,background:"#fff",color:C.navy,fontWeight:800,cursor:"pointer"};
const activeFilterButton:React.CSSProperties={background:C.navy,color:"#fff",borderColor:C.navy};
const card:React.CSSProperties={padding:18,border:`1px solid ${C.border}`,background:"#fff"};
const cardHeader:React.CSSProperties={display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"};
const offerType:React.CSSProperties={color:C.coral,fontWeight:800,fontSize:12,letterSpacing:".07em",textTransform:"uppercase"};
const animalName:React.CSSProperties={margin:"4px 0 0",color:C.navy,fontSize:22};
const submitted:React.CSSProperties={margin:"4px 0 0",color:C.muted,fontSize:13};
const badge:React.CSSProperties={padding:"6px 10px",color:C.navy,fontSize:11,fontWeight:800,textTransform:"uppercase"};
const detailsGrid:React.CSSProperties={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14,marginTop:18,padding:14,background:"#F8FAFC",border:`1px solid ${C.border}`};
const detailLabel:React.CSSProperties={color:C.muted,fontSize:11,fontWeight:800,letterSpacing:".06em",textTransform:"uppercase"};
const detailValue:React.CSSProperties={color:C.navy,fontWeight:700,marginTop:3};
const messagePanel:React.CSSProperties={marginTop:14,padding:14,color:C.muted,lineHeight:1.55,background:"#FFFDFC",borderLeft:`4px solid ${C.pink}`};
const actions:React.CSSProperties={display:"flex",gap:9,flexWrap:"wrap",alignItems:"end",marginTop:16};
const primary:React.CSSProperties={padding:"10px 14px",border:0,background:C.navy,color:"#fff",fontWeight:800,textDecoration:"none"};
const secondary:React.CSSProperties={...primary,color:C.navy,background:"#fff",border:`1px solid ${C.border}`};
const statusLabel:React.CSSProperties={display:"grid",gap:4,marginLeft:"auto",color:C.muted,fontSize:11,fontWeight:800,textTransform:"uppercase"};
const select:React.CSSProperties={padding:"9px 12px",border:`1px solid ${C.border}`,color:C.navy,background:"#fff",fontWeight:700};
