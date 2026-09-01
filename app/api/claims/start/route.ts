import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendClaimVerificationEmail } from "@/lib/email";
import { normalizeEmail, validateNewPassword } from "@/lib/account-security";

export const runtime = "edge";

const ISSUE_TYPES = new Set(["already_claimed", "lost_email_access", "wrong_owner", "organization_details_wrong", "other"]);
const RELATIONSHIPS = new Set(["owner", "director", "staff", "board_member", "authorized_volunteer", "former_representative", "other"]);

function cleanText(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function cleanOptionalUrl(value: unknown) {
  const text = cleanText(value, 1000);
  if (!text) return { value: null, valid: true };
  try {
    const url = new URL(text);
    return { value: url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null, valid: url.protocol === "https:" || url.protocol === "http:" };
  } catch {
    return { value: null, valid: false };
  }
}

async function reportIssue(body: Record<string, unknown>) {
  const orgId = cleanText(body.orgId, 100);
  const reporterName = cleanText(body.reporterName, 160);
  const reporterEmail = normalizeEmail(body.reporterEmail);
  const reporterPhone = cleanText(body.reporterPhone, 50) || null;
  const relationshipToOrg = cleanText(body.relationshipToOrg, 50);
  const issueType = cleanText(body.issueType, 80);
  const previousOrgEmail = normalizeEmail(body.previousOrgEmail) || null;
  const details = cleanText(body.details, 5000);
  const evidence = cleanOptionalUrl(body.evidenceUrl);

  if (!orgId || !reporterName || !reporterEmail || !relationshipToOrg || !issueType || !details) {
    return NextResponse.json({ error: "Organization, name, email, relationship, issue type, and details are required." }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(reporterEmail)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!RELATIONSHIPS.has(relationshipToOrg) || !ISSUE_TYPES.has(issueType)) {
    return NextResponse.json({ error: "Choose a valid relationship and issue type." }, { status: 400 });
  }
  if (details.length < 20) {
    return NextResponse.json({ error: "Please provide at least 20 characters describing the issue." }, { status: 400 });
  }
  if (!evidence.valid) {
    return NextResponse.json({ error: "Evidence must be a valid http or https link." }, { status: 400 });
  }

  const organizations = await sql`select id from organizations where id = ${orgId} and archived_at is null limit 1`;
  if (!organizations[0]) return NextResponse.json({ error: "Organization not found." }, { status: 404 });

  const recent = await sql`
    select count(*)::int as count from organization_claim_issue_reports
    where org_id = ${orgId} and lower(reporter_email) = ${reporterEmail}
      and created_at > now() - interval '1 hour'
  `;
  if (Number(recent[0]?.count ?? 0) >= 3) {
    return NextResponse.json({ error: "Too many reports were submitted recently. Please wait an hour before trying again." }, { status: 429 });
  }

  const rows = await sql`
    insert into organization_claim_issue_reports (
      org_id, reporter_name, reporter_email, reporter_phone, relationship_to_org,
      issue_type, previous_org_email, details, evidence_url
    ) values (
      ${orgId}, ${reporterName}, ${reporterEmail}, ${reporterPhone}, ${relationshipToOrg},
      ${issueType}, ${previousOrgEmail}, ${details}, ${evidence.value}
    ) returning id
  `;
  return NextResponse.json({
    ok: true,
    reference: rows[0].id,
    message: "Your report was received for private administrative review. No ownership or access changes were made.",
  });
}

function generateCode(): string {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return (100000 + (value[0] % 900000)).toString();
}

// POST { orgId, email, password }
// `email` and `password` are for the account being created, chosen by the
// claimant — NOT necessarily the org's own address. The verification code
// goes to the org's own public_email on file, which is the actual proof
// of affiliation.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (body?.action === "report_issue") {
    return reportIssue(body);
  }
  const { orgId, password } = body ?? {};
  const email = normalizeEmail(body?.email);

  if (!orgId || !email || !password) {
    return NextResponse.json({ error: "orgId, email, and password are required." }, { status: 400 });
  }
  const passwordError = validateNewPassword(password);
  if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

  const orgRows = await sql`select id, name, public_email from organizations where id = ${orgId}`;
  const org = orgRows[0] as { id: string; name: string; public_email: string | null } | undefined;
  if (!org) {
    return NextResponse.json({ error: "Organization not found." }, { status: 404 });
  }

  // Don't allow claiming a listing that already has an approved org user.
  const existingApproved = await sql`
    select u.id
    from users u
    where u.org_id = ${orgId}
      and u.status = 'approved'
      and u.role = 'org'
    union all
    select membership.id
    from organization_memberships membership
    where membership.org_id = ${orgId}
      and membership.status = 'active'
      and membership.access_level = 'owner'
    limit 1
  `;
  if (existingApproved.length > 0) {
    return NextResponse.json(
      { error: "This organization already has an owner. Use Report an issue if you believe the ownership or access is incorrect." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(String(password));

  if (!org.public_email) {
    // No email on file to verify against — queue for manual admin review
    // instead of blocking the claim outright.
    const rows = await sql`
      insert into claims (org_id, requester_email, password_hash, status)
      values (${orgId}, ${email}, ${passwordHash}, 'manual_review')
      returning id
    `;
    return NextResponse.json({
      status: "manual_review",
      message:
        "This organization has no email on file for us to verify against, so your claim has been sent to an admin for manual review.",
      claimId: rows[0].id,
    });
  }

  const code = generateCode();
  const rows = await sql`
    insert into claims (org_id, requester_email, password_hash, target_email, code, code_expires_at, status)
    values (${orgId}, ${email}, ${passwordHash}, ${org.public_email}, ${code}, now() + interval '15 minutes', 'pending')
    returning id
  `;
  const claimId = rows[0].id;

  try {
    await sendClaimVerificationEmail(org.public_email, code, org.name);
  } catch (err) {
    console.error("Failed to send claim verification email:", err);
    return NextResponse.json(
      { error: "Couldn't send the verification email. Please try again in a moment." },
      { status: 502 }
    );
  }

  // Mask the email so the UI can show "we sent a code to j***@example.org"
  // without fully revealing an address the claimant may not already know.
  const maskedEmail = org.public_email.replace(/^(.{1,2}).*(@.*)$/, "$1***$2");

  return NextResponse.json({
    status: "code_sent",
    message: `A verification code was sent to the email address on file for this organization (${maskedEmail}).`,
    claimId,
  });
}
