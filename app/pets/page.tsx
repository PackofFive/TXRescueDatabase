export const runtime = "edge";

export default function Page() {
  return (
    <section style={{ maxWidth: 900, margin: "20px auto" }}>
      <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".08em", color: "#6B6862", margin: 0 }}>PRIVATE PET RECORDS</p>
      <h1 style={{ fontSize: 32, color: "#17233C", margin: "7px 0 12px" }}>Owner Portal</h1>
      <p style={{ color: "#6B6862", lineHeight: 1.65, maxWidth: 720 }}>This is the future private Owner Portal. Animals adopted through participating rescues and shelters will be able to transfer selected records here with appropriate permissions.</p>
      <div style={{ marginTop: 24, padding: 18, background: "#fff", border: "1px solid #E7E5E1", borderRadius: 10 }}><strong>Planned, not active yet.</strong><p style={{ marginBottom: 0, color: "#6B6862" }}>Future features include household pet records, optional lost-pet/microchip sharing, reminders, and additional pet-owner tools.</p></div>
    </section>
  );
}
