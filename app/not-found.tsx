export const runtime = "edge";

export default function NotFound() {
  return (
    <main
      style={{
        maxWidth: 700,
        margin: "80px auto",
        padding: "0 24px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "#6B6862",
          marginBottom: 8,
        }}
      >
        404
      </p>

      <h1
        style={{
          fontSize: 32,
          color: "#17233C",
          marginBottom: 12,
        }}
      >
        Page not found
      </h1>

      <p
        style={{
          color: "#6B6862",
          lineHeight: 1.6,
          marginBottom: 24,
        }}
      >
        The page you're looking for doesn't exist or may have moved.
      </p>

      <a
        href="/"
        style={{
          display: "inline-block",
          background: "#17233C",
          color: "#FFFFFF",
          padding: "10px 16px",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        Return to Rescue Network
      </a>
    </main>
  );
}
