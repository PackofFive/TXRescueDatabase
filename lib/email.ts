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
