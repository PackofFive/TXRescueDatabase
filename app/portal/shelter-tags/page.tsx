const C = {
  navy: "#1E3A5F",
  coral: "#E85C56",
  mint: "#DCF0E8",
  muted: "#4A5D75",
  border: "#DCE4EC",
  white: "#FFFFFF",
};

export default function ShelterTagsPage() {
  return (
    <section style={{ maxWidth: 980 }}>
      <p style={eyebrow}>SHELTER TAGS</p>
      <div style={headingRow}>
        <div>
          <h1 style={heading}>Tag Requests &amp; Transfers</h1>
          <p style={intro}>
            Track shelter animals your rescue has offered to tag, without adding
            them to Animals in Our Care before the shelter approves the request
            and custody is formally transferred.
          </p>
        </div>
        <a href="/urgent-animals" style={primaryButton}>
          Find Urgent Shelter Animals
        </a>
      </div>

      <div style={notice}>
        <strong>These are not rescue-owned animal records.</strong> The shelter
        remains the source of record while a request is pending. After approval,
        the transfer must still be completed before the animal moves into your
        rescue&apos;s Animals in Our Care.
      </div>

      <div style={statusGrid}>
        <StatusCard
          title="Pending Shelter Approval"
          description="Tag requests sent by your rescue that the shelter has not approved or declined yet."
        />
        <StatusCard
          title="Approved for Transfer"
          description="Requests the shelter approved that still need custody and file transfer completed."
        />
        <StatusCard
          title="Transfer History"
          description="Completed, declined, withdrawn, and expired requests retained for your records."
        />
      </div>

      <div style={emptyState}>
        <strong style={{ display: "block", marginBottom: 6 }}>
          No shelter tag requests are connected yet.
        </strong>
        When your rescue submits a tag request from an urgent shelter animal&apos;s
        public profile, it will appear here as Pending Shelter Approval.
      </div>
    </section>
  );
}

function StatusCard({ title, description }: { title: string; description: string }) {
  return (
    <article style={statusCard}>
      <div style={statusCount}>0</div>
      <h2 style={statusTitle}>{title}</h2>
      <p style={statusDescription}>{description}</p>
    </article>
  );
}

const eyebrow: React.CSSProperties = { margin: "0 0 7px", color: C.coral, fontSize: 12, fontWeight: 900, letterSpacing: ".09em" };
const headingRow: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 18, flexWrap: "wrap" };
const heading: React.CSSProperties = { margin: "0 0 8px", color: C.navy, fontSize: "clamp(30px, 5vw, 46px)" };
const intro: React.CSSProperties = { margin: 0, color: C.muted, maxWidth: 760, lineHeight: 1.55, fontSize: 16 };
const primaryButton: React.CSSProperties = { display: "inline-block", padding: "11px 14px", background: C.navy, color: C.white, textDecoration: "none", borderRadius: 7, fontWeight: 850 };
const notice: React.CSSProperties = { marginTop: 24, padding: 18, background: C.mint, border: `1px solid ${C.border}`, color: C.navy, lineHeight: 1.55 };
const statusGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: 14, marginTop: 22 };
const statusCard: React.CSSProperties = { padding: 18, background: C.white, border: `1px solid ${C.border}`, borderRadius: 9 };
const statusCount: React.CSSProperties = { color: C.navy, fontSize: 32, fontWeight: 900 };
const statusTitle: React.CSSProperties = { margin: "6px 0", color: C.navy, fontSize: 18 };
const statusDescription: React.CSSProperties = { margin: 0, color: C.muted, lineHeight: 1.5, fontSize: 13.5 };
const emptyState: React.CSSProperties = { marginTop: 18, padding: 20, background: C.white, border: `1px dashed ${C.border}`, color: C.muted, lineHeight: 1.55 };
