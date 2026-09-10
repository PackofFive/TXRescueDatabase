"use client";

import { useEffect, useMemo, useState } from "react";

type Report = {
  id:string; animal_id:string; animal_name:string; foster_name:string;
  foster_email:string|null; title:string|null; update_text:string;
  update_type:string; status:string; submitted_at:string; review_notes:string|null;
};
type Filter = "submitted"|"reviewed"|"incorporated"|"all";

const C={navy:"#1E3A5F",coral:"#E85C56",muted:"#4A5D75",border:"#DCE4EC",mint:"#DCF0E8",peach:"#FBE3DA",pink:"#F2D6DC"};

export default function ReportsPage(){
  const [reports,setReports]=useState<Report[]>([]);
  const [filter,setFilter]=useState<Filter>("submitted");
  const [notes,setNotes]=useState<Record<string,string>>({});
  const [workingId,setWorkingId]=useState("");
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [message,setMessage]=useState("");

  async function load(){
    const response=await fetch("/api/fosters/updates",{cache:"no-store"});
    const data=await response.json();
    if(!response.ok)throw new Error(data.error??"Reports could not be loaded.");
    setReports(data.updates??[]);
  }

  useEffect(()=>{void load().catch(reason=>setError(reason instanceof Error?reason.message:"Reports could not be loaded.")).finally(()=>setLoading(false));},[]);

  const counts=useMemo(()=>({
    submitted:reports.filter(report=>report.status==="submitted").length,
    reviewed:reports.filter(report=>report.status==="reviewed").length,
    incorporated:reports.filter(report=>report.status==="incorporated").length,
    all:reports.length,
  }),[reports]);
  const visible=useMemo(()=>filter==="all"?reports:reports.filter(report=>report.status===filter),[filter,reports]);

  async function act(id:string,action:"review"|"incorporate"|"archive"){
    setWorkingId(id);setError("");setMessage("");
    try{
      const response=await fetch("/api/fosters/updates",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,action,reviewNotes:notes[id]??""})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error??"The report could not be updated.");
      await load();
      setMessage(action==="review"?"Report marked reviewed.":action==="incorporate"?"Report preserved in the animal’s update history.":"Report archived.");
    }catch(reason){setError(reason instanceof Error?reason.message:"The report could not be updated.");}
    finally{setWorkingId("");}
  }

  return <div>
    <p style={eyebrow}>People helping</p><h1 style={title}>Volunteer Reports</h1>
    <p style={intro}>Review updates submitted by approved volunteers or fosters for animals connected to your shelter. Reports stay private to your shelter.</p>
    {error?<div role="alert" style={{...notice,color:"#B93A2E",background:C.peach}}>{error}</div>:null}
    {message?<div role="status" style={{...notice,background:C.mint}}>{message}</div>:null}

    {!loading&&counts.all>0?<div style={filters}>{([['submitted','Needs review'],['reviewed','Reviewed'],['incorporated','Added to history'],['all','All']] as Array<[Filter,string]>).map(([key,label])=><button key={key} type="button" onClick={()=>setFilter(key)} style={{...filterButton,...(filter===key?activeFilter:{})}}>{label} ({counts[key]})</button>)}</div>:null}

    {loading?<div style={notice}>Loading reports…</div>:null}
    {!loading&&counts.all===0?<div style={{...notice,background:C.mint}}><strong>You&apos;re all caught up.</strong><div style={{marginTop:5}}>No volunteer reports need attention right now.</div></div>:null}
    {!loading&&counts.all>0&&visible.length===0?<div style={{...notice,background:C.mint}}><strong>You&apos;re all caught up.</strong><div style={{marginTop:5}}>There are no reports in this queue.</div></div>:null}

    <div style={{display:"grid",gap:14}}>{visible.map(report=><article key={report.id} style={card}>
      <div style={topRow}><div><div style={reportType}>{labelFor(report.update_type)}</div><h2 style={cardTitle}>{report.animal_name}: {report.title||"Volunteer update"}</h2><p style={meta}>From {report.foster_name} · {new Date(report.submitted_at).toLocaleString()}</p></div><span style={{...badge,background:report.status==="submitted"?C.peach:C.mint}}>{labelFor(report.status)}</span></div>
      <div style={reportText}>{report.update_text}</div>
      {report.foster_email?<a href={`mailto:${report.foster_email}`} style={contactLink}>Email {report.foster_name}</a>:null}
      <details style={reviewPanel} open={report.status==="submitted"}>
        <summary style={summary}>Shelter review</summary>
        <label style={label}>Private review note<textarea rows={3} value={notes[report.id]??report.review_notes??""} onChange={event=>setNotes(current=>({...current,[report.id]:event.target.value}))} style={textarea} placeholder="Follow-up, correction, or action taken"/></label>
        <div style={actions}>
          {report.status==="submitted"?<button disabled={workingId===report.id} onClick={()=>void act(report.id,"review")} style={primary}>Mark reviewed</button>:null}
          {report.status!=="incorporated"?<button disabled={workingId===report.id} onClick={()=>void act(report.id,"incorporate")} style={secondary}>Add to animal history</button>:null}
          {report.status!=="archived"?<button disabled={workingId===report.id} onClick={()=>void act(report.id,"archive")} style={secondary}>Archive</button>:null}
          <a href={`/pet/${encodeURIComponent(report.animal_id)}`} style={secondary}>View public animal profile</a>
        </div>
      </details>
    </article>)}</div>
  </div>;
}

function labelFor(value:string){return value.replaceAll("_"," ").replace(/\b\w/g,character=>character.toUpperCase());}
const eyebrow:React.CSSProperties={margin:"0 0 8px",color:C.coral,fontWeight:800,fontSize:12,letterSpacing:".1em",textTransform:"uppercase"};
const title:React.CSSProperties={margin:0,color:C.navy,fontSize:38};
const intro:React.CSSProperties={margin:"12px 0 22px",color:C.muted,lineHeight:1.6,maxWidth:760};
const notice:React.CSSProperties={padding:18,border:`1px solid ${C.border}`,color:C.navy,marginBottom:16};
const filters:React.CSSProperties={display:"flex",gap:8,flexWrap:"wrap",marginBottom:20};
const filterButton:React.CSSProperties={padding:"9px 13px",border:`1px solid ${C.border}`,background:"#fff",color:C.navy,fontWeight:800,cursor:"pointer"};
const activeFilter:React.CSSProperties={background:C.navy,color:"#fff",borderColor:C.navy};
const card:React.CSSProperties={padding:18,border:`1px solid ${C.border}`,background:"#fff"};
const topRow:React.CSSProperties={display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-start",flexWrap:"wrap"};
const reportType:React.CSSProperties={color:C.coral,fontSize:11,fontWeight:800,letterSpacing:".08em",textTransform:"uppercase"};
const cardTitle:React.CSSProperties={margin:"4px 0",color:C.navy,fontSize:20};
const meta:React.CSSProperties={margin:0,color:C.muted,fontSize:13};
const badge:React.CSSProperties={padding:"6px 10px",color:C.navy,fontSize:11,fontWeight:800,textTransform:"uppercase"};
const reportText:React.CSSProperties={margin:"16px 0",padding:14,background:"#F8FAFC",borderLeft:`4px solid ${C.pink}`,color:C.muted,lineHeight:1.55};
const contactLink:React.CSSProperties={display:"inline-block",color:C.navy,fontWeight:800,marginBottom:14};
const reviewPanel:React.CSSProperties={borderTop:`1px solid ${C.border}`,paddingTop:13};
const summary:React.CSSProperties={color:C.navy,fontWeight:800,cursor:"pointer"};
const label:React.CSSProperties={display:"grid",gap:5,color:C.navy,fontSize:13,fontWeight:700,marginTop:13};
const textarea:React.CSSProperties={padding:10,border:`1px solid ${C.border}`,font:"inherit",resize:"vertical"};
const actions:React.CSSProperties={display:"flex",gap:8,flexWrap:"wrap",marginTop:12};
const primary:React.CSSProperties={padding:"9px 13px",border:0,background:C.navy,color:"#fff",fontWeight:800,cursor:"pointer"};
const secondary:React.CSSProperties={...primary,background:"#fff",color:C.navy,border:`1px solid ${C.border}`,textDecoration:"none"};
