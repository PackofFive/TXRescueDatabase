"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Animal = {
  id: string;
  name: string | null;
  organization: { name: string };
};

const COLORS = {
  navy: "#213F67",
  coral: "#EB5A57",
  muted: "#4E6380",
  border: "#D9E2EC",
  mint: "#DDF2EA",
  pink: "#F7DDE3",
};

export default function OfferHelpPage() {
  const params = useParams();
  const animalId = params?.id as string;
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!animalId) return;
    fetch(`/api/public/animals/${encodeURIComponent(animalId)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "This animal profile is not available.");
        setAnimal(data.animal);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "This animal profile is not available."))
      .finally(() => setLoading(false));
  }, [animalId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/public/animals/${encodeURIComponent(animalId)}/offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        offerType: form.get("offerType"),
        contactName: form.get("contactName"),
        contactEmail: form.get("contactEmail"),
        contactPhone: form.get("contactPhone"),
        city: form.get("city"),
        postalCode: form.get("postalCode"),
        availability: form.get("availability"),
        householdInfo: form.get("householdInfo"),
        message: form.get("message"),
      }),
    });
    const data = await response.json().catch(() => ({}));
    setSubmitting(false);

    if (!response.ok) {
      setError(data.error || "Your offer could not be submitted. Please try again.");
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) return <main style={page}><p>Loading…</p></main>;

  if (!animal) {
    return <main style={page}><h1 style={title}>Profile unavailable</h1><p style={body}>{error}</p><a href="/adoptable" style={link}>Browse animals</a></main>;
  }

  const name = animal.name || "this animal";

  if (submitted) {
    return (
      <main style={page}>
        <section style={{ ...panel, background: COLORS.mint }}>
          <p style={eyebrow}>Offer sent</p>
          <h1 style={title}>Thank you for offering to help {name}.</h1>
          <p style={body}>{animal.organization.name} received your contact information and offer. Submitting an offer does not confirm placement or transfer custody; the organization will contact you about next steps.</p>
          <a href={`/pet/${encodeURIComponent(animalId)}`} style={primaryLink}>Return to {name}&apos;s profile</a>
        </section>
      </main>
    );
  }

  return (
    <main style={page}>
      <a href={`/pet/${encodeURIComponent(animalId)}`} style={link}>← Back to {name}&apos;s profile</a>
      <p style={{ ...eyebrow, marginTop: 24 }}>Offer foster care or help</p>
      <h1 style={title}>How can you help {name}?</h1>
      <p style={body}>Send your offer directly to {animal.organization.name}. They will review it and contact you if it may be a good fit.</p>

      <form onSubmit={submit} style={panel}>
        <label style={label}>How can you help? *
          <select name="offerType" required defaultValue="" style={input}>
            <option value="" disabled>Select one…</option>
            <option value="foster">Foster care</option>
            <option value="transport">Transportation</option>
            <option value="medical_support">Medical support</option>
            <option value="donation">Donation or supplies</option>
            <option value="other">Other help</option>
          </select>
        </label>

        <div style={columns}>
          <label style={label}>Your name *<input name="contactName" required autoComplete="name" style={input} /></label>
          <label style={label}>Email *<input name="contactEmail" type="email" required autoComplete="email" style={input} /></label>
        </div>
        <div style={columns}>
          <label style={label}>Phone *<input name="contactPhone" type="tel" required autoComplete="tel" style={input} /></label>
          <label style={label}>City<input name="city" autoComplete="address-level2" style={input} /></label>
        </div>
        <label style={label}>ZIP code<input name="postalCode" inputMode="numeric" autoComplete="postal-code" style={input} /></label>
        <label style={label}>When are you available?<textarea name="availability" rows={3} style={input} placeholder="Include dates, times, or how soon you can help." /></label>
        <label style={label}>Household or relevant experience<textarea name="householdInfo" rows={3} style={input} placeholder="Optional details that may help the organization review your offer." /></label>
        <label style={label}>Message<textarea name="message" rows={4} style={input} placeholder={`Anything else ${animal.organization.name} should know?`} /></label>

        <div style={{ padding: 16, background: COLORS.pink, color: COLORS.navy, lineHeight: 1.5 }}>
          Your information is sent privately to {animal.organization.name}. An offer is not an approval, reservation, rescue tag, or transfer of custody.
        </div>
        {error ? <p role="alert" style={{ margin: 0, color: "#B63A2B", fontWeight: 700 }}>{error}</p> : null}
        <button type="submit" disabled={submitting} style={button}>{submitting ? "Sending…" : "Send offer to help"}</button>
      </form>
    </main>
  );
}

const page: React.CSSProperties = { width: "100%", maxWidth: 820, margin: "0 auto", padding: "24px 16px 56px", boxSizing: "border-box" };
const eyebrow: React.CSSProperties = { margin: "0 0 8px", color: COLORS.coral, fontSize: 13, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" };
const title: React.CSSProperties = { margin: "0 0 10px", color: COLORS.navy, fontSize: "clamp(32px, 7vw, 52px)", lineHeight: 1.05 };
const body: React.CSSProperties = { maxWidth: 700, color: COLORS.muted, fontSize: 18, lineHeight: 1.55 };
const panel: React.CSSProperties = { display: "grid", gap: 17, marginTop: 24, padding: "clamp(18px, 4vw, 28px)", border: `1px solid ${COLORS.border}`, background: "#fff" };
const columns: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 };
const label: React.CSSProperties = { display: "grid", gap: 7, color: COLORS.navy, fontWeight: 800 };
const input: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "12px 13px", border: `1px solid ${COLORS.border}`, background: "#fff", color: COLORS.navy, font: "inherit" };
const button: React.CSSProperties = { justifySelf: "start", padding: "13px 20px", border: 0, background: COLORS.navy, color: "#fff", font: "inherit", fontWeight: 800, cursor: "pointer" };
const link: React.CSSProperties = { color: COLORS.navy, fontWeight: 800, textDecoration: "underline" };
const primaryLink: React.CSSProperties = { ...button, display: "inline-block", textDecoration: "none", marginTop: 6 };
