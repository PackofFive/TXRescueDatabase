// Thin wrapper around Resend's HTTP API. Using fetch directly (rather than
// Resend's SDK) keeps this dependency-free and edge/Workers-compatible —
// no SMTP relay needed, which Cloudflare Workers can't do anyway.
//
// RESEND_API_KEY check is deliberately lazy (inside the function, not at
// module top-level) for the same reason as lib/db.ts and lib/auth.ts —
// Next.js imports every route file during its build step, in an
// environment without your Cloudflare environment variables. A top-level
// throw here would fail the build itself. See README.md for setup.

const FROM_ADDRESS = "TX Animal Rescue Database <onboarding@resend.dev>";
// ^ onboarding@resend.dev works immediately with no setup, for getting
// started. Once you verify your own domain in the Resend dashboard, swap
// this to something like "TX Animal Rescue Database <noreply@yourdomain.org>"
// for better deliverability and a more trustworthy sender name.

export async function sendClaimVerificationEmail(
  to: string,
  code: string,
  orgName: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set. See README.md for setup steps.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [to],
      subject: `Verify your claim of "${orgName}"`,
      text:
        `Someone requested to claim the "${orgName}" listing on the TX Animal Rescue & Resource Database, ` +
        `using this email address as the organization's contact on file.\n\n` +
        `If that was you, enter this code to verify:\n\n${code}\n\n` +
        `This code expires in 15 minutes.\n\n` +
        `If you didn't request this, you can safely ignore this email — no account will be created without the code.`,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Resend API request failed (${response.status}): ${errText}`);
  }
}

export async function sendOrganizationTeamInviteEmail(
  to: string,
  organizationName: string,
  accessLabel: string,
  inviteUrl: string,
  expiresAt: Date
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set. See README.md for setup steps.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [to],
      subject: `You're invited to help manage ${organizationName}`,
      text:
        `${organizationName} invited you to its Pack of Five Rescue Manager workspace with ${accessLabel} access.\n\n` +
        `Accept the secure invitation:\n${inviteUrl}\n\n` +
        `This one-time invitation expires ${expiresAt.toLocaleString("en-US", { timeZone: "America/Chicago", timeZoneName: "short" })}.\n\n` +
        `Sign in or create your Pack of Five account using this same email address. ` +
        `If you weren't expecting this invitation, you can safely ignore it.`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Organization invitation email failed (${response.status}):`,
      errorText
    );
    throw new Error(
      "Email delivery is not configured for this recipient yet. Verify the Pack of Five sending domain, then try again."
    );
  }
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  expiresAt: Date
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set. See README.md for setup steps.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [to],
      subject: "Reset your Pack of Five password",
      text:
        `A password reset was requested for your Pack of Five account.\n\n` +
        `Choose a new password using this secure link:\n${resetUrl}\n\n` +
        `This one-time link expires ${expiresAt.toLocaleString("en-US", {
          timeZone: "America/Chicago",
          timeZoneName: "short",
        })}.\n\n` +
        `If you did not request this change, you can safely ignore this email. ` +
        `Your password will remain unchanged. Never forward this reset link to anyone.`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Password reset email failed (${response.status}):`, errorText);
    throw new Error(
      "Password reset email delivery is not configured for this recipient yet."
    );
  }
}

export async function sendClaimCaseEmail(
  to: string,
  subject: string,
  message: string
): Promise<{ sent: boolean; providerMessageId: string | null; error: string | null }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, providerMessageId: null, error: "RESEND_API_KEY is not configured." };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM_ADDRESS, to: [to], subject, text: message }),
    });
    const responseText = await response.text();
    if (!response.ok) return { sent: false, providerMessageId: null, error: `Resend ${response.status}: ${responseText}`.slice(0, 1000) };
    let providerMessageId: string | null = null;
    try { providerMessageId = String(JSON.parse(responseText)?.id ?? "") || null; } catch { providerMessageId = null; }
    return { sent: true, providerMessageId, error: null };
  } catch (error) {
    return { sent: false, providerMessageId: null, error: error instanceof Error ? error.message.slice(0, 1000) : "Email request failed." };
  }
}
