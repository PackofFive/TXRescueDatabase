import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendClaimVerificationEmail, sendClaimCaseEmail } from "@/lib/email";
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

  const organizations = await sql`
    select
      organization.id,
      organization.name,
      coalesce(
        (select account.email from organization_memberships membership join users account on account.id = membership.user_id where membership.org_id = organization.id and membership.status = 'active' and membership.access_level = 'owner' limit 1),
        (select account.email from users account where account.org_id = organization.id and account.status = 'approved' and account.role = 'org' order by account.created_at asc limit 1)
      ) as current_owner_email
    from organizations organization
    where organization.id = ${orgId} and organization.archived_at is null
    limit 1
  `;
  const organization = organizations[0] as { id:string; name:string; current_owner_email:string|null } | undefined;
  if (!organization) return NextResponse.json({ error: "Organization not found." }, { status: 404 });

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
      issue_type, previous_org_email, details, evidence_url, status, due_at,
      next_action, current_owner_email
    ) values (
      ${orgId}, ${reporterName}, ${reporterEmail}, ${reporterPhone}, ${relationshipToOrg},
      ${issueType}, ${previousOrgEmail}, ${details}, ${evidence.value}, 'waiting_documents',
      now() + interval '7 days', 'Waiting for documentation from the reporter and a response from the current owner.',
      ${organization.current_owner_email}
    ) returning id
  `;
  const reportId = String(rows[0].id);
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const dueLabel = dueDate.toLocaleDateString("en-US", { timeZone: "America/Chicago", year: "numeric", month: "long", day: "numeric" });
  const proofList =
    "Please gather two forms of current authority evidence, when available:\n" +
    "• Access to the established organization email or domain\n" +
    "• Current state, municipal, or IRS organization record\n" +
    "• Current board/officer authorization\n" +
    "• Municipal employment or supervisor confirmation\n" +
    "• Confirmation from an established veterinarian, shelter, or partner\n\n" +
    "An EIN, logo, social account, or personal ID alone does not establish organization ownership.";

  const reporterSubject = `Pack of Five received your organization access report — ${organization.name}`;
  const reporterMessage =
    `We received your private report concerning ${organization.name}.\n\nCase reference: ${reportId}\nResponse deadline: ${dueLabel}\n\n` +
    `${proofList}\n\nThe current owner will be contacted separately. We will not share your email address automatically, and no ownership or access change will occur without administrative review.`;
  const reporterDelivery = await sendClaimCaseEmail(reporterEmail, reporterSubject, reporterMessage);
  await sql`
    insert into organization_claim_case_messages (report_id, audience, message_type, subject, message_body, delivery_status, recipient_email, provider_message_id, delivery_error)
    values (${reportId}, 'reporter', 'case_opened', ${reporterSubject}, ${reporterMessage}, ${reporterDelivery.sent ? 'sent' : 'failed'}, ${reporterEmail}, ${reporterDelivery.providerMessageId}, ${reporterDelivery.error})
  `;
  if (reporterDelivery.sent) await sql`update organization_claim_issue_reports set reporter_notified_at = now() where id = ${reportId}`;

  if (organization.current_owner_email) {
    const ownerSubject = `Response requested for ${organization.name} Pack of Five access case`;
    const ownerMessage =
      `Pack of Five received a report requesting review of access or ownership for ${organization.name}.\n\nCase reference: ${reportId}\nResponse deadline: ${dueLabel}\n\n` +
      `${proofList}\n\nThe reporter's private contact information is not included. No ownership or access change has been made. An administrator will review both parties' information before making a decision.`;
    const ownerDelivery = await sendClaimCaseEmail(organization.current_owner_email, ownerSubject, ownerMessage);
    await sql`
      insert into organization_claim_case_messages (report_id, audience, message_type, subject, message_body, delivery_status, recipient_email, provider_message_id, delivery_error)
      values (${reportId}, 'current_owner', 'response_requested', ${ownerSubject}, ${ownerMessage}, ${ownerDelivery.sent ? 'sent' : 'failed'}, ${organization.current_owner_email}, ${ownerDelivery.providerMessageId}, ${ownerDelivery.error})
    `;
    if (ownerDelivery.sent) await sql`update organization_claim_issue_reports set owner_notified_at = now() where id = ${reportId}`;
  }

  return NextResponse.json({
    ok: true,
    reference: reportId,
    message: reporterDelivery.sent
      ? "Your report was received and an explanation of the verification process was emailed to you. No ownership or access changes were made."
      : "Your report was received for private administrative review. Email delivery is pending, but no ownership or access changes were made.",
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

    await sql`
      update claims
      set status = 'manual_review'
      where id = ${claimId}
    `;

    return NextResponse.json(
      {
        status: "manual_review",
        message:
          "The verification email could not be delivered, so this claim was sent to Pack of Five for private administrator review. No access has been granted yet.",
        claimId,
      },
      { status: 202 }
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
