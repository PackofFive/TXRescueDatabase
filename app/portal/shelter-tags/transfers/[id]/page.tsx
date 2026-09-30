"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Snapshot={name?:string|null;temporaryName?:string|null;publicName?:string|null;species?:string|null;publicSpecies?:string|null;breedOrType?:string|null;publicBreedOrType?:string|null;sex?:string|null;birthDate?:string|null;weightLbs?:string|number|null;urgency?:string|null;custody?:string|null;placement?:string|null;notes?:string|null;publicSummary?:string|null;publicNeed?:string|null;externalListingUrl?:string|null};
type Record={id:string;animal_id:string;animal_name:string;transfer_completed_at:string|null;source_organization_name:string|null;receiving_organization_name:string|null;transfer_confirmed_by_email:string|null;transfer_animal_snapshot:Snapshot|null;snapshot_captured_at:string|null};

const C={navy:"#1E3A5F",coral:"#E85C56",muted:"#4A5D75",border:"#DCE4EC",mint:"#DCF0E8",peach:"#FBE3DA"};

export default function RescueTransferRecordPage(){
 const params=useParams();const offerId=String(params?.id||"");
 const [record,setRecord]=useState<Record|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{fetch("/api/rescue/shelter-tags",{cache:"no-store"}).then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.error||"Transfer record could not be loaded.");const found=(data.requests||[]).find((item:Record)=>item.id===offerId&&item.transfer_completed_at);if(!found)throw new Error("Completed transfer record not found.");setRecord(found)}).catch(reason=>setError(reason instanceof Error?reason.message:"Transfer record could not be loaded.")).finally(()=>setLoading(false))},[offerId]);
 if(loading)return <div style={notice}>Loading permanent transfer record…</div>;
 if(error||!record)return <div role="alert" style={{...notice,background:C.peach,color:"#A9362B"}}>{error||"Transfer record not found."}</div>;
 const s=record.transfer_animal_snapshot;const identity=s?.publicName||s?.name||s?.temporaryName||record.animal_name;
 return <article className="pof-transfer-record" style={recordPage}>
  <div className="pof-no-print" style={topActions}><a href="/portal/shelter-tags?view=history" style={secondary}>← Back to Transfer History</a><button type="button" onClick={()=>window.print()} style={primary}>Print or Save as PDF</button></div>
  <header style={recordHeader}><p style={eyebrow}>PERMANENT RECEIVING RECORD</p><h1 style={title}>Animal Transfer Record</h1><p style={recordId}>Offer record: {record.id}</p></header>
  <section style={summary}><SummaryFact label="Animal" value={identity}/><SummaryFact label="Transferring shelter" value={record.source_organization_name||"Shelter"}/><SummaryFact label="Receiving rescue" value={record.receiving_organization_name||"Your rescue"}/><SummaryFact label="Transfer completed" value={new Date(record.transfer_completed_at!).toLocaleString()}/><SummaryFact label="Receipt confirmed by" value={record.transfer_confirmed_by_email||"Account no longer active"}/></section>
  {s?<section style={panel}><h2 style={sectionTitle}>Animal details at transfer</h2><dl style={details}><Fact label="Shelter ID" value={s.temporaryName}/><Fact label="Species" value={s.publicSpecies||s.species}/><Fact label="Breed or type" value={s.publicBreedOrType||s.breedOrType}/><Fact label="Sex" value={format(s.sex)}/><Fact label="Birth date" value={dateOnly(s.birthDate)}/><Fact label="Weight" value={s.weightLbs?`${s.weightLbs} lb`:null}/><Fact label="Urgency" value={format(s.urgency)}/><Fact label="Custody before transfer" value={format(s.custody)}/><Fact label="Placement" value={format(s.placement)}/></dl>{s.publicSummary?<TextFact label="Public summary" value={s.publicSummary}/>:null}{s.publicNeed?<TextFact label="Help requested" value={s.publicNeed}/>:null}{s.notes?<TextFact label="Recorded shelter notes" value={s.notes}/>:null}{s.externalListingUrl?<p style={textFact}><strong>Original external listing:</strong> {s.externalListingUrl}</p>:null}<p style={captured}>Snapshot captured {record.snapshot_captured_at?new Date(record.snapshot_captured_at).toLocaleString():"at transfer"}.</p></section>:<section style={panel}><h2 style={sectionTitle}>Legacy transfer record</h2><p style={textFact}>This transfer predates permanent animal snapshots. The custody event, organizations, confirmation account, and completion time remain retained.</p></section>}
  <footer style={footer}>This is a private Pack of Five receiving-rescue record. The transfer event and snapshot cannot be edited or deleted through the application.</footer>
 </article>;
}

function SummaryFact({label,value}:{label:string;value:string}){return <div style={summaryFact}><span style={fieldLabel}>{label}</span><strong style={fieldValue}>{value}</strong></div>}
function Fact({label,value}:{label:string;value:string|null|undefined}){return <div><dt style={fieldLabel}>{label}</dt><dd style={factValue}>{value||"Not recorded"}</dd></div>}
function TextFact({label,value}:{label:string;value:string}){return <p style={textFact}><strong>{label}:</strong> {value}</p>}
function format(value?:string|null){return value?value.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase()):null}
function dateOnly(value?:string|null){return value?new Date(`${value.slice(0,10)}T00:00:00`).toLocaleDateString():null}

const recordPage:React.CSSProperties={maxWidth:900,margin:"0 auto",color:C.navy};
const topActions:React.CSSProperties={display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap",marginBottom:20};
const primary:React.CSSProperties={padding:"10px 14px",border:0,background:C.navy,color:"#fff",fontWeight:800,textDecoration:"none",cursor:"pointer"};
const secondary:React.CSSProperties={...primary,background:"#fff",color:C.navy,border:`1px solid ${C.border}`};
const recordHeader:React.CSSProperties={padding:"24px 26px",border:`1px solid ${C.border}`,borderLeft:`6px solid ${C.coral}`,background:"#fff"};
const eyebrow:React.CSSProperties={margin:"0 0 7px",color:C.coral,fontSize:12,fontWeight:900,letterSpacing:".1em"};
const title:React.CSSProperties={margin:0,fontSize:"clamp(32px,6vw,50px)"};
const recordId:React.CSSProperties={margin:"10px 0 0",color:C.muted,fontSize:12,overflowWrap:"anywhere"};
const summary:React.CSSProperties={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:1,marginTop:18,background:C.border,border:`1px solid ${C.border}`};
const summaryFact:React.CSSProperties={padding:16,background:"#fff"};
const fieldLabel:React.CSSProperties={display:"block",marginBottom:5,color:C.muted,fontSize:11,fontWeight:800,letterSpacing:".06em",textTransform:"uppercase"};
const fieldValue:React.CSSProperties={display:"block",fontSize:15};
const panel:React.CSSProperties={marginTop:18,padding:22,background:"#fff",border:`1px solid ${C.border}`};
const sectionTitle:React.CSSProperties={margin:"0 0 17px",fontSize:23};
const details:React.CSSProperties={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:16,margin:0,padding:16,background:C.mint};
const factValue:React.CSSProperties={margin:0,color:C.navy,fontWeight:700};
const textFact:React.CSSProperties={margin:"15px 0 0",color:C.muted,lineHeight:1.55,whiteSpace:"pre-wrap"};
const captured:React.CSSProperties={margin:"18px 0 0",paddingTop:12,borderTop:`1px solid ${C.border}`,color:C.muted,fontSize:11};
const footer:React.CSSProperties={marginTop:18,padding:16,border:`1px solid ${C.border}`,color:C.muted,fontSize:12,lineHeight:1.5};
const notice:React.CSSProperties={padding:20,border:`1px solid ${C.border}`,color:C.navy};
