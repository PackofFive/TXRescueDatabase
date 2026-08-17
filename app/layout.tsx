export const metadata = {
  title: "TX Animal Rescue & Resource Database",
  description: "Directory, capability tracking, and self-service updates for Texas rescues, shelters, and resource partners.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, sans-serif", margin: 0, background: "#FAFAF9", color: "#1C1B19" }}>
        <nav style={{ padding: "16px 28px", borderBottom: "1px solid #E7E5E1", display: "flex", gap: 20, justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="/" style={{ fontWeight: 600, textDecoration: "none", color: "inherit" }}>Directory</a>
            <a href="/portal" style={{ textDecoration: "none", color: "inherit" }}>Org Portal</a>
            <a href="/admin" style={{ textDecoration: "none", color: "inherit" }}>Admin Queue</a>
          </div>
          <a href="/support" style={{ textDecoration: "none", color: "#6B6862", fontSize: 13.5 }}>Support this project</a>
        </nav>
        <main style={{ padding: "24px 28px", maxWidth: 1040, margin: "0 auto" }}>{children}</main>
      </body>
    </html>
  );
}
