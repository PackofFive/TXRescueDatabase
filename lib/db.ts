import { neon, NeonQueryFunction } from "@neondatabase/serverless";

// DATABASE_URL comes from your Neon project's connection string
// (Neon dashboard → Connection Details → pick "Pooled connection").
// Set it as an environment variable in Cloudflare Pages — see README.md.
//
// IMPORTANT: this check is deliberately lazy (inside a function, not at
// module top-level). Next.js's build step imports every route file to
// analyze it, in an environment that doesn't have your Cloudflare
// environment variables available — a top-level throw here would fail
// the build itself, before the app ever runs. Keeping the check inside
// getSql() means it only runs when a request actually comes in, when
// the real environment variables are present.
let cachedSql: NeonQueryFunction<false, false> | null = null;

function getSql(): NeonQueryFunction<false, false> {
  if (cachedSql) return cachedSql;
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. See README.md for setup steps.");
  }
  cachedSql = neon(process.env.DATABASE_URL);
  return cachedSql;
}

// `sql` is a tagged-template query function — usage: `await sql\`select * from organizations\``
// This is the officially recommended way to talk to Neon from edge/serverless
// runtimes like Cloudflare Pages, since it goes over HTTP rather than a
// persistent TCP connection. Proxy defers the getSql() call (and its env
// check) until the tagged template is actually invoked.
export const sql: NeonQueryFunction<false, false> = new Proxy(
  (() => {}) as unknown as NeonQueryFunction<false, false>,
  {
    apply(_target, _thisArg, args) {
      return (getSql() as unknown as (...a: unknown[]) => unknown)(...args);
    },
  }
);
