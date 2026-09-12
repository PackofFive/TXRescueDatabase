"use client";

import { useEffect, useMemo, useState } from "react";

type Offer = {
  id: string; animal_id: string; animal_name: string; offer_type: string;
  contact_name: string; contact_email: string; contact_phone: string | null;
  city: string | null; postal_code: string | null; availability: string | null;
  household_info: string | null; message: string | null;
  status: string; urgency: string | null; created_at: string; updated_at: string | null;
  internal_notes: string;
};
type Activity = { id: string; offer_id: string; action: string; previous_status: string | null; new_status: string | null; note: string | null; created_at: string; actor_email: string };
type Filter = "needs_action" | "all" | "accepted" | "closed";

const C = { navy: "#1E3A5F", coral: "#E85C56", muted: "#4A5D75", border: "#DCE4EC", mint: "#DCF0E8", pink: "#F2D6DC" };
const actionStatuses = new Set(["new", "reviewing", "contacted"]);
const closedStatuses = new Set(["declined", "closed"]);

export default function ShelterOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
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
        setActivities(data.activities ?? []);
        setNotes(Object.fromEntries((data.offers ?? []).map((offer: Offer) => [offer.id, offer.internal_notes ?? ""])));
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
    if (["declined", "closed"].includes(status)) {
      const action = status === "declined" ? "decline this offer" : "close this offer";
      if (!window.confirm(`Are you sure you want to ${action}? The record will remain in history.`)) return;
    }
    setWorkingId(id); setError(""); setMessage("");
    try {
      const response = await fetch("/api/shelter-express/offers", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId: id, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The offer could not be updated.");
      setOffers((rows) => rows.map((row) => row.id === id ? { ...row, status } : row));
      if (data.activity) setActivities((rows) => [data.activity, ...rows]);
      setMessage(statusMessage(status));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The offer could not be updated.");
    } finally { setWorkingId(""); }
  }

  async function saveNote(id: string) {
    setWorkingId(id); setError(""); setMessage("");
    try {
      const response = await fetch("/api/shelter-express/offers", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId: id, action: "save_note", note: notes[id] ?? "" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The private note could not be saved.");
      setOffers((rows) => rows.map((row) => row.id === id ? { ...row, internal_notes: data.offer.internal_notes, updated_at: data.offer.updated_at } : row));
      if (data.activity) setActivities((rows) => [data.activity, ...rows]);
      setMessage("Private note saved to the offer history.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The private note could not be saved.");
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
        <div style={detailsGrid}><Detail label="From" value={offer.contact_name}/><Detail label="Location" value={[offer.city, offer.postal_code].filter(Boolean).join(" · ") || "Not provided"}/><Detail label="Availability" value={offer.availability || "Not provided"}/><Detail label="Animal priority" value={offer.urgency ? labelFor(offer.urgency) : "Not marked"}/></div>
        {offer.household_info ? <DetailPanel label="Household or relevant experience" value={offer.household_info}/> : null}
        {offer.message ? <DetailPanel label="Message" value={offer.message}/> : null}
        <div style={actions}>
          <a href={`mailto:${offer.contact_email}?subject=${encodeURIComponent(`Your offer to help ${offer.animal_name}`)}`} style={primary}>Email {offer.contact_name}</a>
          {offer.contact_phone ? <a href={`tel:${offer.contact_phone}`} style={secondary}>Call {offer.contact_phone}</a> : null}
          <a href={`/shelter-express/animals/${offer.animal_id}`} style={secondary}>View urgent animal</a>
        </div>
        <div style={workflow}>
          <div><strong style={{ color: C.navy }}>Review status</strong><div style={workflowHelp}>{helpForStatus(offer.status)}</div></div>
          <div style={workflowActions}>
            {offer.status === "new" ? <ActionButton label="Start review" onClick={() => void update(offer.id, "reviewing")} disabled={workingId === offer.id}/> : null}
            {["new", "reviewing"].includes(offer.status) ? <ActionButton label="Mark contacted" onClick={() => void update(offer.id, "contacted")} disabled={workingId === offer.id}/> : null}
            {actionStatuses.has(offer.status) ? <ActionButton label="Move forward" onClick={() => void update(offer.id, "accepted")} disabled={workingId === offer.id} primary/> : null}
            {actionStatuses.has(offer.status) ? <ActionButton label="Decline" onClick={() => void update(offer.id, "declined")} disabled={workingId === offer.id} danger/> : null}
            {offer.status === "accepted" ? <ActionButton label="Close completed offer" onClick={() => void update(offer.id, "closed")} disabled={workingId === offer.id}/> : null}
            {closedStatuses.has(offer.status) ? <ActionButton label="Reopen review" onClick={() => void update(offer.id, "reviewing")} disabled={workingId === offer.id}/> : null}
          </div>
        </div>
        <details style={privateSection}>
          <summary style={privateSummary}>Private shelter notes &amp; activity ({activities.filter((entry) => entry.offer_id === offer.id).length})</summary>
          <div style={privateBody}>
            <label style={noteLabel}>Current internal note
              <textarea rows={4} value={notes[offer.id] ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [offer.id]: event.target.value }))} placeholder="Record verification, follow-up, concerns, or next steps. This is never shown publicly." style={noteInput}/>
            </label>
            <button type="button" onClick={() => void saveNote(offer.id)} disabled={workingId === offer.id || !(notes[offer.id] ?? "").trim()} style={primary}>{workingId === offer.id ? "Saving…" : "Save private note"}</button>
            <div style={activityList}>
              {activities.filter((entry) => entry.offer_id === offer.id).map((entry) => <div key={entry.id} style={activityRow}><strong>{entry.action === "note_added" ? "Private note saved" : `${labelFor(entry.previous_status || "unknown")} → ${labelFor(entry.new_status || "unknown")}`}</strong><span>{new Date(entry.created_at).toLocaleString()} · {entry.actor_email}</span>{entry.note ? <p>{entry.note}</p> : null}</div>)}
              {activities.every((entry) => entry.offer_id !== offer.id) ? <p style={{ margin: 0, color: C.muted }}>No activity recorded yet.</p> : null}
            </div>
          </div>
        </details>
      </article>
    )}</div>
  </div>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div><div style={detailLabel}>{label}</div><div style={detailValue}>{value}</div></div>; }
function DetailPanel({ label, value }: { label: string; value: string }) { return <div style={messagePanel}><div style={detailLabel}>{label}</div><div style={{ marginTop: 5 }}>{value}</div></div>; }
function ActionButton({ label, onClick, disabled, primary: isPrimary, danger }: { label: string; onClick: () => void; disabled: boolean; primary?: boolean; danger?: boolean }) { return <button type="button" onClick={onClick} disabled={disabled} style={{ ...secondary, ...(isPrimary ? primary : {}), ...(danger ? dangerButton : {}), cursor: disabled ? "wait" : "pointer" }}>{disabled ? "Saving…" : label}</button>; }
function labelFor(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase()); }
function statusMessage(status: string) { const messages: Record<string, string> = { reviewing: "Offer moved into review.", contacted: "Offer marked as contacted.", accepted: "Offer marked as moving forward. Custody has not been transferred.", declined: "Offer declined and retained in history.", closed: "Offer closed and retained in history." }; return messages[status] || "Offer status updated."; }
function helpForStatus(status: string) { const help: Record<string, string> = { new: "New offer—review the details and contact the person before making a decision.", reviewing: "Your shelter is reviewing this offer.", contacted: "Your shelter has contacted the person and is awaiting or coordinating next steps.", accepted: "Your shelter intends to move forward. This does not transfer custody or complete a rescue tag.", declined: "Your shelter declined this offer. The record remains available in Closed.", closed: "Work on this offer is complete. The record remains available in Closed." }; return help[status] || "Review this offer."; }

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
const dangerButton:React.CSSProperties={...secondary,color:"#A9362B",border:"1px solid #E9B9B4"};
const workflow:React.CSSProperties={display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,flexWrap:"wrap",marginTop:16,paddingTop:16,borderTop:`1px solid ${C.border}`};
const workflowHelp:React.CSSProperties={maxWidth:560,marginTop:3,color:C.muted,fontSize:13,lineHeight:1.45};
const workflowActions:React.CSSProperties={display:"flex",gap:8,flexWrap:"wrap"};
const privateSection:React.CSSProperties={marginTop:16,border:`1px solid ${C.border}`,background:"#F8FAFC"};
const privateSummary:React.CSSProperties={padding:14,color:C.navy,fontWeight:800,cursor:"pointer"};
const privateBody:React.CSSProperties={display:"grid",gap:12,padding:"0 14px 14px"};
const noteLabel:React.CSSProperties={display:"grid",gap:6,color:C.navy,fontSize:13,fontWeight:800};
const noteInput:React.CSSProperties={width:"100%",boxSizing:"border-box",padding:11,border:`1px solid ${C.border}`,font:"inherit",color:C.navy,resize:"vertical"};
const activityList:React.CSSProperties={display:"grid",gap:8,marginTop:4};
const activityRow:React.CSSProperties={display:"grid",gap:3,padding:11,borderLeft:`3px solid ${C.coral}`,background:"#fff",color:C.muted,fontSize:12,lineHeight:1.45};
