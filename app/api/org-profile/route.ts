import { NextRequest, NextResponse } from "next/server";
import {
  AuthError,
  getSession,
  hashPassword,
  requireEffectiveOrg,
} from "@/lib/auth";
import { sql } from "@/lib/db";
import { sendOrganizationTeamInviteEmail } from "@/lib/email";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function createInviteToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashToken(token: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token)
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

function normalizeEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

async function resolveAccess(
  session: Awaited<ReturnType<typeof requireEffectiveOrg>>["session"],
  orgId: string
) {
  if (session.role === "admin") {
    return {
      level: "platform_admin",
      canEditOrganizationProfile: true,
      canManageOrganizationAccess: true,
    };
  }

  const membershipRows = await sql`
    select access_level
    from organization_memberships
    where org_id = ${orgId}::uuid
      and user_id = ${session.id}::uuid
      and status = 'active'
    limit 1
  `;

  const level = membershipRows[0]?.access_level
    ? String(membershipRows[0].access_level)
    : null;

  return {
    level,
    canEditOrganizationProfile:
      level === "owner" || level === "administrator",
    canManageOrganizationAccess: level === "owner",
  };
}

export async function GET(request: NextRequest) {
  try {
    const { session, orgId } = await requireEffectiveOrg();

    const access = await resolveAccess(session, orgId);

    if (request.nextUrl.searchParams.get("team") === "true") {
      if (!access.canManageOrganizationAccess) {
        throw new AuthError(
          "Organization Owner access is required to manage team access.",
          403
        );
      }

      const members = await sql`
        select
          membership.id,
          membership.user_id,
          membership.access_level,
          membership.status,
          membership.granted_at,
          membership.updated_at,
          membership.suspended_at,
          membership.removed_at,
          account.email
        from organization_memberships membership
        join users account on account.id = membership.user_id
        where membership.org_id = ${orgId}::uuid
        order by
          case membership.status when 'active' then 0 else 1 end,
          case membership.access_level
            when 'owner' then 0
            when 'administrator' then 1
            when 'contributor' then 2
            else 3
          end,
          lower(account.email)
      `;

      const audit = await sql`
        select
          entry.id,
          entry.action,
          entry.previous_access_level,
          entry.new_access_level,
          entry.reason,
          entry.created_at,
          affected.email as affected_email,
          actor.email as actor_email
        from organization_access_audit entry
        left join users affected on affected.id = entry.affected_user_id
        left join users actor on actor.id = entry.actor_user_id
        where entry.org_id = ${orgId}::uuid
        order by entry.created_at desc
        limit 50
      `;

      await sql`
        update organization_access_invites
        set status = 'expired', updated_at = now()
        where org_id = ${orgId}::uuid
          and status = 'sent'
          and expires_at <= now()
      `;

      const invites = await sql`
        select
          invite.id,
          invite.email,
          invite.access_level,
          invite.status,
          invite.expires_at,
          invite.accepted_at,
          invite.cancelled_at,
          invite.created_at,
          inviter.email as invited_by_email
        from organization_access_invites invite
        join users inviter on inviter.id = invite.invited_by
        where invite.org_id = ${orgId}::uuid
        order by invite.created_at desc
        limit 100
      `;

      return NextResponse.json(
        { access, members, audit, invites },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const rows = await sql`
      select
        id,
        name,
        org_type,
        species,
        focus,
        specialty,
        c3_status,
        city,
        county,
        state,
        service_area,
        region,
        statewide,
        intake_status,
        intake_restrictions,
        intake_form_url,
        website,
        social_media,
        public_email,
        public_phone,
        resource_status,
        last_verified,
        updated_at
      from organizations
      where id = ${orgId}::uuid
      limit 1
    `;

    if (!rows[0]) {
      return NextResponse.json(
        { error: "Organization profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        organization: rows[0],
        access,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("GET /api/org-profile failed:", error);

    return NextResponse.json(
      { error: "Couldn't load the organization profile." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session, orgId } = await requireEffectiveOrg();
    const access = await resolveAccess(session, orgId);

    if (!access.canManageOrganizationAccess) {
      throw new AuthError(
        "Organization Owner access is required to invite team members.",
        403
      );
    }

    const body = await request.json().catch(() => null);
    const email = normalizeEmail(body?.email);
    const accessLevel = String(body?.accessLevel ?? "").trim();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    if (!["administrator", "contributor", "viewer"].includes(accessLevel)) {
      return NextResponse.json(
        { error: "Choose Administrator, Contributor, or Viewer access." },
        { status: 400 }
      );
    }

    const existingMembers = await sql`
      select membership.id
      from organization_memberships membership
      join users account on account.id = membership.user_id
      where membership.org_id = ${orgId}::uuid
        and lower(account.email) = ${email}
        and membership.status in ('active', 'invited')
      limit 1
    `;

    if (existingMembers[0]) {
      return NextResponse.json(
        { error: "This person already has active or pending organization access." },
        { status: 409 }
      );
    }

    await sql`
      update organization_access_invites
      set status = 'expired', updated_at = now()
      where org_id = ${orgId}::uuid
        and lower(email) = ${email}
        and status = 'sent'
        and expires_at <= now()
    `;

    const activeInvites = await sql`
      select id
      from organization_access_invites
      where org_id = ${orgId}::uuid
        and lower(email) = ${email}
        and status = 'sent'
      limit 1
    `;

    if (activeInvites[0]) {
      return NextResponse.json(
        { error: "An active invitation already exists. Use Resend Invitation instead." },
        { status: 409 }
      );
    }

    const token = createInviteToken();
    const tokenHash = await hashToken(token);
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

    const organizations = await sql`
      select name from organizations where id = ${orgId}::uuid limit 1
    `;
    const organizationName = String(organizations[0]?.name ?? "Your rescue organization");

    const rows = await sql`
      insert into organization_access_invites (
        org_id, email, access_level, token_hash, status,
        invited_by, expires_at
      ) values (
        ${orgId}::uuid, ${email}, ${accessLevel}, ${tokenHash}, 'sent',
        ${session.id}::uuid, ${expiresAt.toISOString()}::timestamptz
      )
      returning id, email, access_level, status, expires_at, created_at
    `;

    try {
      const inviteUrl = `${request.nextUrl.origin}/accept-organization-invite?token=${token}`;
      await sendOrganizationTeamInviteEmail(
        email,
        organizationName,
        accessLevel.replaceAll("_", " "),
        inviteUrl,
        expiresAt
      );
    } catch (emailError) {
      await sql`
        update organization_access_invites
        set status = 'cancelled', cancelled_at = now(), updated_at = now()
        where id = ${String(rows[0].id)}::uuid
      `;
      throw emailError;
    }

    const invitedAccounts = await sql`
      select id from users where lower(email) = ${email} limit 1
    `;

    await sql`
      insert into organization_access_audit (
        org_id, affected_user_id, actor_user_id, action,
        previous_access_level, new_access_level, reason
      ) values (
        ${orgId}::uuid,
        ${invitedAccounts[0]?.id ? String(invitedAccounts[0].id) : null}::uuid,
        ${session.id}::uuid,
        'invitation_sent',
        null,
        ${accessLevel},
        ${`Invitation sent to ${email}`}
      )
    `;

    return NextResponse.json({ invite: rows[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("POST /api/org-profile failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Couldn't send the team invitation." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { session, orgId } = await requireEffectiveOrg();
    const access = await resolveAccess(session, orgId);

    if (!access.canManageOrganizationAccess) {
      throw new AuthError(
        "Organization Owner access is required to manage team access.",
        403
      );
    }

    const body = await request.json().catch(() => null);
    const action = String(body?.action ?? "").trim();
    const inviteId = String(body?.inviteId ?? "").trim();

    if (["cancel_invite", "resend_invite"].includes(action)) {
      if (!inviteId) {
        return NextResponse.json({ error: "Choose an invitation." }, { status: 400 });
      }

      const inviteRows = await sql`
        select invite.*, organization.name as organization_name
        from organization_access_invites invite
        join organizations organization on organization.id = invite.org_id
        where invite.id = ${inviteId}::uuid
          and invite.org_id = ${orgId}::uuid
        limit 1
      `;
      const invite = inviteRows[0];
      if (!invite) return NextResponse.json({ error: "Invitation not found." }, { status: 404 });
      if (invite.status === "accepted") return NextResponse.json({ error: "An accepted invitation cannot be changed." }, { status: 409 });

      if (action === "cancel_invite") {
        await sql`
          update organization_access_invites
          set status = 'cancelled', cancelled_at = now(), updated_at = now()
          where id = ${inviteId}::uuid
        `;
        await sql`
          insert into organization_access_audit (org_id, actor_user_id, action, new_access_level, reason)
          values (${orgId}::uuid, ${session.id}::uuid, 'invitation_cancelled', ${String(invite.access_level)}, ${`Invitation cancelled for ${String(invite.email)}`})
        `;
        return NextResponse.json({ result: { ok: true } });
      }

      const token = createInviteToken();
      const tokenHash = await hashToken(token);
      const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
      const inviteUrl = `${request.nextUrl.origin}/accept-organization-invite?token=${token}`;
      await sendOrganizationTeamInviteEmail(String(invite.email), String(invite.organization_name), String(invite.access_level).replaceAll("_", " "), inviteUrl, expiresAt);
      await sql`
        update organization_access_invites
        set token_hash = ${tokenHash}, status = 'sent', expires_at = ${expiresAt.toISOString()}::timestamptz,
            cancelled_at = null, updated_at = now()
        where id = ${inviteId}::uuid
      `;
      await sql`
        insert into organization_access_audit (org_id, actor_user_id, action, new_access_level, reason)
        values (${orgId}::uuid, ${session.id}::uuid, 'invitation_resent', ${String(invite.access_level)}, ${`Invitation resent to ${String(invite.email)}`})
      `;
      return NextResponse.json({ result: { ok: true } });
    }

    const membershipId = String(body?.membershipId ?? "").trim();
    const newAccessLevel = body?.newAccessLevel
      ? String(body.newAccessLevel).trim()
      : null;
    const reason = body?.reason ? String(body.reason).trim() : null;

    if (!membershipId) {
      return NextResponse.json(
        { error: "Choose a team member." },
        { status: 400 }
      );
    }

    if (!["change_level", "suspend", "restore", "remove", "transfer_ownership"].includes(action)) {
      return NextResponse.json(
        { error: "Choose a valid access action." },
        { status: 400 }
      );
    }

    if (["suspend", "remove", "transfer_ownership"].includes(action) && !reason) {
      return NextResponse.json(
        { error: "A reason is required for this security-sensitive action." },
        { status: 400 }
      );
    }

    const rows = await sql`
      select pof_manage_organization_access(
        ${orgId}::uuid,
        ${session.id}::uuid,
        ${membershipId}::uuid,
        ${action},
        ${newAccessLevel},
        ${reason}
      ) as result
    `;

    return NextResponse.json({ result: rows[0]?.result ?? { ok: true } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("PATCH /api/org-profile failed:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Couldn't update organization access.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const token = String(body?.token ?? "").trim();
    const password = String(body?.password ?? "");
    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
      return NextResponse.json({ error: "This invitation link is invalid." }, { status: 400 });
    }

    const tokenHash = await hashToken(token);
    const session = await getSession();
    let rows;

    if (session) {
      if (session.status !== "approved") {
        throw new AuthError("An approved account is required.", 403);
      }

      rows = await sql`
        select pof_accept_organization_invite(
          ${tokenHash},
          ${session.id}::uuid
        ) as result
      `;
    } else {
      if (password.length < 12) {
        return NextResponse.json(
          { error: "Create a password with at least 12 characters." },
          { status: 400 }
        );
      }

      if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return NextResponse.json(
          { error: "Include an uppercase letter, lowercase letter, and number in your password." },
          { status: 400 }
        );
      }

      const passwordHash = await hashPassword(password);
      rows = await sql`
        select pof_create_account_from_organization_invite(
          ${tokenHash},
          ${passwordHash}
        ) as result
      `;
    }

    return NextResponse.json({ result: rows[0]?.result ?? { ok: true } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("PUT /api/org-profile failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Couldn't accept the invitation." },
      { status: 500 }
    );
  }
}
