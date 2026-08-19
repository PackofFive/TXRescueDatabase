import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendClaimVerificationEmail } from "@/lib/email";

export const runtime = "edge";

function generateCode(): string {
  // 6-digit numeric code — easy to type from an email on a phone.
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST { orgId, email, password }
// `email` and `password` are for the account being created, chosen by the
// claimant — NOT necessarily the org's own address. The verification code
// goes to the org's own public_email on file, which is the actual proof
// of affiliation.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { orgId, email, password } = body ?? {};

  if (!orgId || !email || !password) {
    return NextResponse.json({ error: "orgId, email, and password are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const orgRows = await sql`select id, name, public_email from organizations where id = ${orgId}`;
  const org = orgRows[0] as { id: string; name: string; public_email: string | null } | undefined;
  if (!org) {
    return NextResponse.json({ error: "Organization not found." }, { status: 404 });
  }

  // Don't allow claiming a listing that already has an approved org user.
  const existingApproved = await sql`
    select id from users where org_id = ${orgId} and status = 'approved' and role = 'org'
  `;
  if (existingApproved.length > 0) {
    return NextResponse.json(
      { error: "This listing has already been claimed. Contact an admin if you believe this is a mistake." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

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
