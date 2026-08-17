/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages runs Next.js via the @cloudflare/next-on-pages adapter,
  // which requires every route to declare `export const runtime = "edge"`
  // (already done in each app/api/**/route.ts file in this project).
};

module.exports = nextConfig;
