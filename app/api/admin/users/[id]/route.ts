import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdminFresh, requireUser, AuthError, type PlatformAdminAccessLevel } from "@/lib/auth";
import { createPasswordResetToken, normalizeEmail, sha256 } from "@/lib/account-security";
import { sendPlatformAdministratorInviteEmail } from "@/lib/email";

export const runtime = "edge";
const LEVELS: PlatformAdminAccessLevel[] = ["platform_owner", "case_administrator", "directory_moderator"];
const validLevel = (value: unknown): value is PlatformAdminAccessLevel => typeof value === "string" && LEVELS.includes(value as PlatformAdminAccessLevel);
const levelLabel = (level: PlatformAdminAccessLevel) => level === "platform_owner" ? "Platform Owner" : level === "case_administrator" ? "Case Administrator" : "Directory Moderator";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (id !== "platform") {
      await requireAdminFresh(["platform_owner"]);
      const rows = await sql`select u.id, u.email, u.org_id, o.name as org_name, u.created_at from users u left join organizations o on o.id=u.org_id where u.status='pending' order by u.created_at`;
      return NextResponse.json({ pendingUsers: rows });
    }
    const admin = await requireAdminFresh();
    const team = await sql`
      select m.user_id, u.email, m.access_level, m.status, m.granted_at, m.updated_at
      from platform_administrator_memberships m join users u on u.id=m.user_id
      order by case m.access_level when 'platform_owner' then 0 when 'case_administrator' then 1 else 2 end, lower(u.email)
    `;
    const invitations = admin.platformAccessLevel === "platform_owner" ? await sql`
      select i.id,i.email,i.access_level,i.status,i.expires_at,i.created_at,u.email as invited_by_email
      from platform_administrator_invitations i join users u on u.id=i.invited_by
      order by i.created_at desc limit 50
    ` : [];
    const audit = admin.platformAccessLevel === "platform_owner" ? await sql`
      select a.id,a.action,a.previous_access_level,a.new_access_level,a.reason,a.created_at,
             actor.email as actor_email,target.email as target_email
      from platform_administrator_audit a left join users actor on actor.id=a.actor_user_id
      left join users target on target.id=a.target_user_id order by a.created_at desc limit 100
    ` : [];
    return NextResponse.json({ currentAccessLevel: admin.platformAccessLevel, team, invitations, audit });
  } catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("GET platform administrators failed:", error);
    return NextResponse.json({ error: "Platform administrators could not be loaded." }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (id !== "platform") return NextResponse.json({ error: "Not found." }, { status: 404 });
    const body = await req.json().catch(() => null);
    if (body?.action === "accept_invitation") {
      const user = await requireUser();
      const token = typeof body.token === "string" ? body.token : "";
      if (!token) return NextResponse.json({ error: "The invitation link is incomplete." }, { status: 400 });
      const tokenHash = await sha256(token);
      const rows = await sql`select id,email,access_level,expires_at from platform_administrator_invitations where token_hash=${tokenHash} and status='pending' limit 1`;
      const invitation = rows[0] as { id:string;email:string;access_level:PlatformAdminAccessLevel;expires_at:string }|undefined;
      if (!invitation || new Date(invitation.expires_at).getTime() <= Date.now()) return NextResponse.json({ error: "This invitation is invalid or has expired." }, { status: 410 });
      if (normalizeEmail(user.email) !== normalizeEmail(invitation.email)) return NextResponse.json({ error: `Sign in with ${invitation.email} to accept this invitation.` }, { status: 403 });
      await sql`
        insert into platform_administrator_memberships(user_id,access_level,status,granted_by)
        select ${user.id},${invitation.access_level},'active',invited_by from platform_administrator_invitations where id=${invitation.id}
        on conflict(user_id) do update set access_level=excluded.access_level,status='active',granted_by=excluded.granted_by,updated_at=now()
      `;
      await sql`update platform_administrator_invitations set status='accepted',accepted_by=${user.id},accepted_at=now() where id=${invitation.id} and status='pending'`;
      await sql`insert into platform_administrator_audit(actor_user_id,target_user_id,invitation_id,action,new_access_level,reason) values(${user.id},${user.id},${invitation.id},'invitation_accepted',${invitation.access_level},'Accepted by exact-email account')`;
      return NextResponse.json({ message: `You now have ${levelLabel(invitation.access_level)} access.` });
    }
    const owner = await requireAdminFresh(["platform_owner"]);
    const email = normalizeEmail(body?.email), accessLevel = body?.accessLevel;
    if (!email || !validLevel(accessLevel)) return NextResponse.json({ error: "Enter an email and choose a valid access level." }, { status: 400 });
    const existing = await sql`select m.user_id from platform_administrator_memberships m join users u on u.id=m.user_id where lower(u.email)=${email} and m.status='active' limit 1`;
    if (existing[0]) return NextResponse.json({ error: "This person already has active platform access." }, { status: 409 });
    const account = await sql`select id from users where lower(email)=${email} and status='approved' limit 1`;
    if (!account[0]) return NextResponse.json({ error: "This person must first have an active Pack of Five account with this exact email." }, { status: 409 });
    await sql`update platform_administrator_invitations set status='revoked' where lower(email)=${email} and status='pending'`;
    const token=createPasswordResetToken(), tokenHash=await sha256(token), expiresAt=new Date(Date.now()+24*60*60*1000);
    const inviteRows=await sql`insert into platform_administrator_invitations(email,access_level,token_hash,invited_by,expires_at) values(${email},${accessLevel},${tokenHash},${owner.id},${expiresAt.toISOString()}) returning id`;
    const invitationId=String(inviteRows[0].id);
    await sql`insert into platform_administrator_audit(actor_user_id,invitation_id,action,new_access_level,reason) values(${owner.id},${invitationId},'invitation_sent',${accessLevel},'Secure administrator invitation')`;
    const inviteUrl=`${new URL(req.url).origin}/account?platformAdminInvite=${encodeURIComponent(token)}`;
    await sendPlatformAdministratorInviteEmail(email,levelLabel(accessLevel),inviteUrl,expiresAt);
    return NextResponse.json({ message:`A secure invitation was sent to ${email}.` });
  } catch(error) {
    if(error instanceof AuthError)return NextResponse.json({error:error.message},{status:error.status});
    console.error("POST platform administrator failed:",error);
    return NextResponse.json({error:error instanceof Error?error.message:"The invitation could not be sent."},{status:500});
  }
}

export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}) {
  try {
    const {id}=await params;
    if(id!=="platform") {
      await requireAdminFresh(["platform_owner"]);
      const body=await req.json().catch(()=>null),action=body?.action;
      if(action!=="approve"&&action!=="reject")return NextResponse.json({error:"Invalid action."},{status:400});
      const rows=await sql`update users set status=${action==="approve"?"approved":"rejected"} where id=${id} and status='pending' returning id,email,status`;
      if(!rows[0])return NextResponse.json({error:"User not found or already reviewed."},{status:404});
      return NextResponse.json({user:rows[0]});
    }
    const owner=await requireAdminFresh(["platform_owner"]),body=await req.json().catch(()=>null);
    const targetUserId=typeof body?.userId==="string"?body.userId:"",action=body?.action,reason=typeof body?.reason==="string"?body.reason.trim():"";
    if(!targetUserId||!["change_level","suspend","restore"].includes(action)||reason.length<10)return NextResponse.json({error:"Choose an action and enter a clear reason of at least 10 characters."},{status:400});
    const rows=await sql`select access_level,status from platform_administrator_memberships where user_id=${targetUserId} limit 1`;
    const target=rows[0] as {access_level:PlatformAdminAccessLevel;status:string}|undefined;
    if(!target)return NextResponse.json({error:"Administrator not found."},{status:404});
    const newLevel=body?.accessLevel;
    if(action==="change_level"&&!validLevel(newLevel))return NextResponse.json({error:"Choose a valid access level."},{status:400});
    if((action==="suspend"||(action==="change_level"&&newLevel!=="platform_owner"))&&target.access_level==="platform_owner"&&target.status==="active"){
      const counts=await sql`select count(*)::int as count from platform_administrator_memberships where access_level='platform_owner' and status='active'`;
      if(Number(counts[0]?.count??0)<=1)return NextResponse.json({error:"At least one active Platform Owner must remain."},{status:409});
    }
    const finalLevel=action==="change_level"?newLevel:target.access_level,finalStatus=action==="suspend"?"suspended":action==="restore"?"active":target.status;
    await sql`update platform_administrator_memberships set access_level=${finalLevel},status=${finalStatus},updated_at=now() where user_id=${targetUserId}`;
    await sql`update users set session_version=session_version+1 where id=${targetUserId}`;
    await sql`insert into platform_administrator_audit(actor_user_id,target_user_id,action,previous_access_level,new_access_level,reason) values(${owner.id},${targetUserId},${action},${target.access_level},${finalLevel},${reason})`;
    return NextResponse.json({message:"Platform access was updated and previous sessions were ended."});
  } catch(error) {
    if(error instanceof AuthError)return NextResponse.json({error:error.message},{status:error.status});
    console.error("PATCH platform administrator failed:",error);
    return NextResponse.json({error:"Platform access could not be updated."},{status:500});
  }
}
