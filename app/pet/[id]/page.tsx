"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PublicAnimalPage() {
  const params = useParams();
  const id = params?.id as string;
  const [animal, setAnimal] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    fetch(`/api/public/animals/${encodeURIComponent(id)}`, { cache: "no-store" })
      .then(async r => { const d=await r.json(); if(!r.ok) throw new Error(d.error); setAnimal(d.animal); })
      .catch(e => setError(e.message));
  }, [id]);

  if (error) return <p style={{color:"#B23B2E"}}>{error}</p>;
  if (!animal) return <p>Loading…</p>;

  const name = animal.name || animal.temporary_name || "Animal";
  const loc = [animal.organization_city, animal.organization_state].filter(Boolean).join(", ");

  return (
    <section style={{maxWidth:850,margin:"24px auto"}}>
      <div style={{display:"flex",gap:22,flexWrap:"wrap"}}>
        {animal.photo_url
          ? <img src={animal.photo_url} alt={name} style={{width:280,height:280,objectFit:"cover",borderRadius:12}} />
          : <div style={{width:280,height:280,background:"#F1F1EF",borderRadius:12,display:"grid",placeItems:"center"}}>No photo yet</div>}
        <div style={{flex:1,minWidth:260}}>
          <p style={{fontSize:12,fontWeight:800,color:"#6B6862"}}>{animal.organization_name}</p>
          <h1 style={{fontSize:34,color:"#17233C",margin:"6px 0"}}>{name}</h1>
          <p style={{color:"#6B6862"}}>{[age(animal.birth_date), animal.breed_or_type || animal.species, animal.sex].filter(Boolean).join(" · ")}</p>
          {loc && <p style={{color:"#6B6862"}}>{loc}</p>}
          {animal.public_need && <div style={{padding:12,background:"#FFF8F5",border:"1px solid #F0D3C9",borderRadius:8}}><strong>Current need:</strong> {animal.public_need}</div>}
          {animal.public_summary && <p style={{lineHeight:1.65}}>{animal.public_summary}</p>}
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:18}}>
            <button onClick={()=>setShowOffer(v=>!v)} style={primary}>Offer to Foster / Help</button>
            {animal.external_listing_url && <a href={animal.external_listing_url} target="_blank" rel="noreferrer" style={secondary}>Adoption / Listing Page</a>}
          </div>
        </div>
      </div>
      {showOffer && <OfferForm id={animal.id} />}
    </section>
  );
}

function OfferForm({id}:{id:string}) {
  const [f,setF]=useState({offerType:"foster",contactName:"",contactEmail:"",contactPhone:"",city:"",postalCode:"",availability:"",householdInfo:"",message:""});
  const [status,setStatus]=useState("");
  const [saving,setSaving]=useState(false);
  const set=(k:string,v:string)=>setF(p=>({...p,[k]:v}));

  async function submit(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setStatus("");
    const r=await fetch(`/api/public/animals/${encodeURIComponent(id)}/offers`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});
    const d=await r.json(); setSaving(false);
    setStatus(r.ok ? "Your offer was sent to the organization. They can contact you directly." : (d.error ?? "Couldn't submit offer."));
  }

  return <form onSubmit={submit} style={{marginTop:28,padding:18,border:"1px solid #E7E5E1",borderRadius:10}}>
    <h2>Offer to Help</h2>
    <p style={{color:"#6B6862",fontSize:13.5}}>No account is required. Your contact information is private and is shared with the organization managing this animal.</p>
    <select value={f.offerType} onChange={e=>set("offerType",e.target.value)} style={input}><option value="foster">Foster</option><option value="transport">Transport</option><option value="medical_support">Medical support</option><option value="donation">Donation / supplies</option><option value="other">Other</option></select>
    <input required placeholder="Name *" value={f.contactName} onChange={e=>set("contactName",e.target.value)} style={input}/>
    <input required type="email" placeholder="Email *" value={f.contactEmail} onChange={e=>set("contactEmail",e.target.value)} style={input}/>
    <input required placeholder="Phone *" value={f.contactPhone} onChange={e=>set("contactPhone",e.target.value)} style={input}/>
    <input placeholder="City" value={f.city} onChange={e=>set("city",e.target.value)} style={input}/>
    <input placeholder="ZIP / Postal code" value={f.postalCode} onChange={e=>set("postalCode",e.target.value)} style={input}/>
    <textarea rows={2} placeholder="Availability" value={f.availability} onChange={e=>set("availability",e.target.value)} style={input}/>
    <textarea rows={3} placeholder="Household / foster information" value={f.householdInfo} onChange={e=>set("householdInfo",e.target.value)} style={input}/>
    <textarea rows={3} placeholder="Message" value={f.message} onChange={e=>set("message",e.target.value)} style={input}/>
    <button disabled={saving} style={primary}>{saving?"Sending…":"Send Offer"}</button>
    {status && <p>{status}</p>}
  </form>
}

function age(v:string|null){
  if(!v) return null;
  const b=new Date(v), n=new Date();
  let y=n.getFullYear()-b.getFullYear();
  if(n.getMonth()<b.getMonth() || (n.getMonth()===b.getMonth() && n.getDate()<b.getDate())) y--;
  return y>0 ? `${y} yr${y===1?"":"s"}` : "Under 1 yr";
}
const input:React.CSSProperties={display:"block",width:"100%",boxSizing:"border-box",padding:9,margin:"5px 0 12px",border:"1px solid #D8D6D2",borderRadius:6,fontFamily:"inherit"};
const primary:React.CSSProperties={background:"#17233C",color:"#fff",border:"none",borderRadius:7,padding:"10px 15px",fontWeight:700,cursor:"pointer"};
const secondary:React.CSSProperties={border:"1px solid #D8D6D2",borderRadius:7,padding:"10px 15px",textDecoration:"none",color:"#17233C",fontWeight:700};
