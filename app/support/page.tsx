const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL;

// This page is intentionally simple: it links out to a hosted payment
// page (Stripe Payment Link, PayPal.me, Buy Me a Coffee, or similar)
// rather than handling card details or money movement itself. That
// keeps this app out of PCI-compliance territory and avoids needing
// to build real payment infrastructure — see README.md "Optional:
// accepting donations" for how to set NEXT_PUBLIC_DONATE_URL.
export default function SupportPage() {
  return (
    <div style={{ maxWidth: 480 }}>
      <h1 style={{ fontSize: 20 }}>Support this project</h1>
      <p style={{ color: "#6B6862", fontSize: 13.5, lineHeight: 1.6 }}>
        This directory is free to use and always will be — no organization
        needs to pay anything to be listed or to use the Org Portal. If
        you'd like to help cover the cost of the AI Search feature, any
        contribution goes directly toward that usage. It's entirely
        optional.
      </p>
      {DONATE_URL ? (
        <a
          href={DONATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: 16,
            padding: "10px 20px",
            background: "#C05621",
            color: "#fff",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Contribute toward AI usage
        </a>
      ) : (
        <p style={{ fontSize: 13, color: "#B23B2E", marginTop: 16 }}>
          No donation link is configured yet — set NEXT_PUBLIC_DONATE_URL
          in your environment variables once you've created a payment
          link. See README.md.
        </p>
      )}
    </div>
  );
}
