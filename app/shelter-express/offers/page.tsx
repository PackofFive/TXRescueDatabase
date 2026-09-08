"use client";

import { useEffect, useState } from "react";

type Offer = { id:string; animal_id:string; animal_name:string; offer_type:string; contact_name:string; contact_email:string; contact_phone:string|null; city:string|null; availability:string|null; message:string|null; status:string; created_at:string };
const C={navy:"#1E3A5F",coral:"#E85C56",muted:"#4A5D75",border:"#DCE4EC",mint:"#DCF0E8"};

export default function ShelterOffersPage(){
  const [offers,setOffers]=useState<Offer[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
  const load=()=>fetch("/api/shelter-express/offers",{cache:"no-store"}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error);setOffers(d.offers??[])}).catch(e=>setError(e.message??"Offers could not be loaded.")).finally(()=>setLoading(false));
  useEffect(()=>{void load();},[]);
  async function update(id:string,status:string){const r=await fetch("/api/shelter-express/offers",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({offerId:id,status})});const d=await r.json();if(!r.ok){setError(d.error);return}setOffers(rows=>rows.map(row=>row.id===id?{...row,status}:row));}
  return <div><p style={eyebrow}>Coordination</p><h1 style={title}>Rescue &amp; Tag Offers</h1><p style={intro}>Review rescue interest, tag requests, foster help, transport, and other offers submitted for your urgent animals.</p>
    {loading?<div style={notice}>Loading offers…</div>:null}{error?<div style={{...notice,color:"#B93A2E",background:"#FBE3DA"}}>{error}</div>:null}
    {!loading&&!error&&offers.length===0?<div style={{...notice,background:C.mint}}><strong>No offers need review.</strong><div style={{marginTop:5}}>New help offers will appear here and stay connected to the animal listing.</div></div>:null}
    <div style={{display:"grid",gap:12}}>{offers.map(o=><article key={o.id} style={card}><div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><div><h2 style={{margin:0,color:C.navy,fontSize:21}}>{o.animal_name}</h2><p style={{margin:"5px 0",color:C.muted}}>{o.offer_type.replaceAll("_"," ")} from <strong>{o.contact_name}</strong> · {o.contact_email}</p></div><span style={badge}>{o.status}</span></div>{o.message?<p style={{color:C.muted,lineHeight:1.5}}>{o.message}</p>:null}<div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}><select aria-label={`Status for ${o.animal_name}`} value={o.status} onChange={e=>update(o.id,e.target.value)} style={select}>{["new","reviewing","contacted","accepted","declined","closed"].map(s=><option key={s} value={s}>{s.replaceAll("_"," ")}</option>)}</select></div></article>)}</div>
  </div>;
}
const eyebrow:React.CSSProperties={margin:"0 0 8px",color:C.coral,fontWeight:800,fontSize:12,letterSpacing:".1em",textTransform:"uppercase"};
const title:React.CSSProperties={margin:0,color:C.navy,fontSize:38,lineHeight:1.1};
const intro:React.CSSProperties={margin:"12px 0 24px",color:C.muted,fontSize:16,lineHeight:1.6,maxWidth:760};
const notice:React.CSSProperties={padding:20,border:`1px solid ${C.border}`,color:C.navy,marginBottom:16};
const card:React.CSSProperties={padding:18,border:`1px solid ${C.border}`,background:"#fff"};
const badge:React.CSSProperties={padding:"5px 9px",background:"#F2D6DC",color:C.navy,fontSize:12,fontWeight:800,textTransform:"uppercase"};
const select:React.CSSProperties={padding:"9px 12px",border:`1px solid ${C.border}`,color:C.navy,background:"#fff",textTransform:"capitalize"};
