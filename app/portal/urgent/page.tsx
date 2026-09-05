export const runtime = "edge";

const COLORS = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  peach: "#FFF3EE",
  muted: "#4A5D75",
  border: "#DCE4EC",
};

export default function Page() {
  return (
    <section style={{ maxWidth: 980 }}>
      <p style={{ margin: "0 0 6px", color: COLORS.coral, fontSize: 12, fontWeight: 800, letterSpacing: ".08em" }}>
        RESCUE MANAGER · NETWORKING
      </p>

      <h1 style={{ margin: "0 0 6px", color: COLORS.navy, fontSize: 30 }}>
        Urgent Shelter Animals
      </h1>

      <p style={{ margin: 0, maxWidth: 760, color: COLORS.muted, fontSize: 13.5, lineHeight: 1.5 }}>
        Review shelter animals needing rescue placement, foster support, medical assistance, transport, or another urgent intervention.
      </p>

      <section style={{ marginTop: 20, padding: 16, border: `1px solid ${COLORS.border}`, borderRadius: 9, background: COLORS.peach }}>
        <strong style={{ color: COLORS.navy }}>Shelter custody stays in place until a formal commitment is completed.</strong>
        <p style={{ margin: "6px 0 0", color: COLORS.muted, fontSize: 13, lineHeight: 1.5 }}>
          Volunteer or foster interest does not create a rescue Tag or transfer custody. The rescue and shelter must complete their normal approval and transfer process.
        </p>
      </section>

      <section style={{ marginTop: 16, padding: 20, border: `1px solid ${COLORS.border}`, borderRadius: 9, background: COLORS.mint }}>
        <strong style={{ display: "block", color: COLORS.navy, marginBottom: 5 }}>No urgent shelter listings are available yet</strong>
        <p style={{ margin: 0, color: COLORS.muted, fontSize: 13.5, lineHeight: 1.5 }}>
          Verified shelter listings will appear here with deadlines, placement needs, rescue interest, available foster help, and Tag or transfer status.
        </p>
      </section>
    </section>
  );
}
