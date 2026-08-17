import { neon } from "@neondatabase/serverless";

// DATABASE_URL comes from your Neon project's connection string
// (Neon dashboard → Connection Details → pick "Pooled connection").
// Set it as an environment variable in Cloudflare Pages — see README.md.
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. See README.md for setup steps.");
}

// `sql` is a tagged-template query function — usage: `await sql\`select * from organizations\``
// This is the officially recommended way to talk to Neon from edge/serverless
// runtimes like Cloudflare Pages, since it goes over HTTP rather than a
// persistent TCP connection.
export const sql = neon(process.env.DATABASE_URL);
