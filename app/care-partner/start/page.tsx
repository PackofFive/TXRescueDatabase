export default function CarePartnerStart() {
  return (
    <section style={{ maxWidth: 720, margin: "0 auto", color: "#1E3A5F", lineHeight: 1.6 }}>
      <h1>Claim or add your business</h1>
      <h2>Is your business already listed?</h2>
      <p>Search by business name. During the claim, we send a verification code to the business email on file. If you can’t access that address, use the claim form’s option to report an issue for private review.</p>
      <a href="/claim">Find and claim my business →</a>
      <h2>Is your business missing?</h2>
      <p>Request a directory listing using an email you can access. After listing approval, return here to claim it and set up access.</p>
      <a href="/request-organization?type=care-partner">Request a business listing →</a>
      <h2>Already have Care Partner access?</h2>
      <p>Care Partner access requires an active membership and provider verification. Private animal records are shared by assignment.</p>
      <a href="/login?portal=care-partner">Sign in to Care Partner →</a>
    </section>
  );
}
