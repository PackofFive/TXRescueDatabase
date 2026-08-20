export const runtime = "edge";

export default function Page() {
  return (
    <section style={{ maxWidth: 900, margin: "20px auto" }}>
      <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".08em", color: "#6B6862", margin: 0 }}>RESCUE MANAGER · NETWORKING</p>
      <h1 style={{ fontSize: 32, color: "#17233C", margin: "7px 0 12px" }}>Urgent Animals</h1>
      <p style={{ color: "#6B6862", lineHeight: 1.65, maxWidth: 720 }}>This private workspace will help approved rescues review urgent shelter animals, filter for animals they may be able to help, coordinate foster commitments, and begin the Tag process.</p>
      <div style={{ marginTop: 24, padding: 18, background: "#fff", border: "1px solid #E7E5E1", borderRadius: 10 }}><strong>Visibility model</strong><p style={{ color: "#6B6862", lineHeight: 1.6 }}>Urgent listings are primarily for rescue networking. Approved fosters may receive limited visibility when their rescue enables it. Shelters can make individual animals publicly shareable when public foster/networking help is appropriate. A foster response does not Tag an animal; the rescue makes the formal commitment.</p></div>
    </section>
  );
}
