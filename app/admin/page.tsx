"use client";
import { useEffect, useState } from "react";

type Submission = { id:string; org_name:string; field_label:string; old_value:string; new_value:string; };
type Claim = { id:string; org_id:string; org_name:string; requester_email:string; created_at:string; };
type OrgRequest = { id:string; organization_name:string; relationship:string; created_at:string; };
type ClaimIssue = { id:string; org_name:string; reporter_name:string; reporter_email:string; reporter_phone:string|null; relationship_to_org:string; issue_type:string; previous_org_email:string|null; details:string; evidence_url:string|null; status:string; created_at:string; };

export default function AdminPage() {
  const [submissions,setSubmissions]=useState<Submission[]|null>(null);
  const [claims,setClaims]=useState<Claim[]|null>(null);
  const [orgRequests,setOrgRequests]=useState<OrgRequest[]|null>(null);
  const [claimIssues,setClaimIssues]=useState<ClaimIssue[]|null>(null);
  const [error,setError]=useState<string|null>(null);
  const [issueNotes,setIssueNotes]=useState<Record<string,string>>({});

  function load() {
    fetch("/api/admin/submissions").then(async r => {
      const d=await r.json(); if(!r.ok) throw new Error(d.error??"Failed to load submissions."); setSubmissions(d.submissions);
    }).catch(e=>setError(e.message));

    fetch("/api/admin/claims").then(async r => {
      const d=await r.json(); if(!r.ok) throw new Error(d.error??"Failed to load claims."); setClaims(d.claims);
    }).catch(e=>setError(e.message));

    fetch("/api/admin/org-requests",{cache:"no-store"}).then(async r => {
      const d=await r.json(); if(!r.ok) throw new Error(d.error??"Failed to load organization requests.");
      setOrgRequests((d.requests??[]).filter((x:any)=>x.status==="pending"));
    }).catch(e=>setError(e.message));

    fetch("/api/admin/claim-issues",{cache:"no-store"}).then(async r => {
      const d=await r.json(); if(!r.ok) throw new Error(d.error??"Failed to load claim issues."); setClaimIssues(d.reports??[]);
    }).catch(e=>setError(e.message));
  }

  useEffect(load,[]);

  async function act(id:string, action:"approve"|"reject") {
    await fetch(`/api/admin/submissions/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action})}); load();
  }
  async function actClaim(id:string, action:"approve"|"reject") {
    await fetch(`/api/admin/claims/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({action})}); load();
  }
  async function actClaimIssue(id:string, status:"reviewing"|"resolved"|"rejected") {
    const res=await fetch("/api/admin/claim-issues",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({reportId:id,status,resolutionNotes:issueNotes[id]??""})});
    const data=await res.json();
    if(!res.ok){setError(data.error??"Failed to update claim issue.");return;}
    load();
  }

  if(error) return <p style={{color:"#B23B2E"}}>{error}</p>;

  return (
    <div>
      <h1 style={{fontSize:24,color:"#17233C"}}>Admin Dashboard</h1>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(190px, 1fr))",gap:12,margin:"18px 0 26px"}}>
        <Card label="Organization Requests" count={orgRequests?.length} href="/admin/org-requests" />
        <Card label="Listing Claims" count={claims?.length} href="#claims" />
        <Card label="Claim & Access Issues" count={claimIssues?.length} href="#claim-issues" />
        <Card label="Pending Updates" count={submissions?.length} href="#submissions" />
        <Card label="Add Organization" href="/admin/orgs/new" />
      </div>

      <h2 id="submissions" style={{fontSize:15}}>Pending submissions</h2>
      {submissions===null && <p>Loading…</p>}
      {submissions?.length===0 && <p style={{color:"#6B6862"}}>No pending submissions.</p>}
      {submissions?.map(s=>(
        <div key={s.id} style={{border:"1px solid #E7E5E1",borderRadius:6,padding:14,marginBottom:8}}>
          <strong>{s.org_name}</strong> — {s.field_label}
          <div style={{fontSize:13,margin:"6px 0"}}>{s.old_value} → <strong>{s.new_value}</strong></div>
          <button onClick={()=>act(s.id,"approve")} style={{marginRight:8}}>Approve</button>
          <button onClick={()=>act(s.id,"reject")}>Reject</button>
        </div>
      ))}

      <h2 id="claims" style={{fontSize:15,marginTop:28}}>Listing claims needing manual review</h2>
      {claims===null && <p>Loading…</p>}
      {claims?.length===0 && <p style={{color:"#6B6862"}}>No claims awaiting review.</p>}
      {claims?.map(c=>(
        <div key={c.id} style={{border:"1px solid #E7E5E1",borderRadius:6,padding:14,marginBottom:8}}>
          <strong>{c.org_name}</strong>
          <div style={{fontSize:13,margin:"6px 0",color:"#6B6862"}}>Requested by: {c.requester_email}</div>
          <button onClick={()=>actClaim(c.id,"approve")} style={{marginRight:8}}>Approve claim</button>
          <button onClick={()=>actClaim(c.id,"reject")}>Reject</button>
        </div>
      ))}

      <h2 id="claim-issues" style={{fontSize:15,marginTop:28}}>Ownership and access issues</h2>
      {claimIssues===null && <p>Loading…</p>}
      {claimIssues?.length===0 && <p style={{color:"#6B6862"}}>No ownership or access issues awaiting review.</p>}
      {claimIssues?.map(report=>(
        <div key={report.id} style={{border:"1px solid #E7E5E1",borderRadius:6,padding:14,marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
            <strong>{report.org_name}</strong>
            <span style={{fontSize:11,fontWeight:800,color:report.status==="pending"?"#B23B2E":"#2B5C8A"}}>{report.status.toUpperCase()}</span>
          </div>
          <div style={{fontSize:13,lineHeight:1.6,marginTop:7}}>
            <div><strong>Issue:</strong> {issueLabel(report.issue_type)}</div>
            <div><strong>Reported by:</strong> {report.reporter_name} · {report.reporter_email}{report.reporter_phone?` · ${report.reporter_phone}`:""}</div>
            <div><strong>Relationship:</strong> {report.relationship_to_org.replaceAll("_"," ")}</div>
            {report.previous_org_email&&<div><strong>Previous organization email:</strong> {report.previous_org_email}</div>}
            <div style={{marginTop:6,whiteSpace:"pre-wrap"}}>{report.details}</div>
            {report.evidence_url&&<div style={{marginTop:5}}><a href={report.evidence_url} target="_blank" rel="noreferrer">Open supporting link</a></div>}
          </div>
          <label style={{display:"block",fontSize:12,fontWeight:700,marginTop:10}}>Private review or resolution notes
            <textarea value={issueNotes[report.id]??""} onChange={e=>setIssueNotes(current=>({...current,[report.id]:e.target.value}))} rows={3} style={{display:"block",width:"100%",marginTop:4,padding:8,border:"1px solid #D8D6D2"}} />
          </label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:9}}>
            {report.status==="pending"&&<button onClick={()=>actClaimIssue(report.id,"reviewing")}>Mark under review</button>}
            <button onClick={()=>actClaimIssue(report.id,"resolved")}>Resolve</button>
            <button onClick={()=>actClaimIssue(report.id,"rejected")}>Reject report</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function issueLabel(value:string){return ({already_claimed:"Organization is already claimed",lost_email_access:"Lost access to organization email",wrong_owner:"Current owner may be incorrect",organization_details_wrong:"Organization information is incorrect",other:"Other issue"} as Record<string,string>)[value]??value;}

function Card({label,count,href}:{label:string;count?:number;href:string}) {
  return (
    <a href={href} style={{display:"block",background:"#fff",border:"1px solid #E7E5E1",borderRadius:9,padding:14,color:"#17233C",textDecoration:"none"}}>
      <div style={{fontSize:13,color:"#6B6862"}}>{label}</div>
      {typeof count==="number" && <div style={{fontSize:28,fontWeight:800,marginTop:3}}>{count}</div>}
    </a>
  );
}
