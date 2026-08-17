# TX Animal Rescue & Resource Database

A real, deployable backend for the prototype we built together: organization
directory, capability tracking, org self-service submissions with an
auto-publish/review split, an admin approval queue, and AI search grounded
in the live data.

## What's built vs. what's a starting point

**Fully built and enforced server-side:**
- Database schema (`db/schema.sql`) — organizations, capabilities, users,
  submissions (review queue), update_log (audit trail), invites
- Authentication (signup, login, logout) with hashed passwords and
  signed session cookies
- Permission checks on every route — an org account can only ever edit
  its own organization's data; admin routes re-check the live admin
  status on every request, not just at login
- Submissions API that automatically splits auto-publish vs.
  review-required fields, per `lib/constants.ts`
- Admin approve/reject, which writes to both the real table and the
  permanent audit log
- AI Search, now server-side — the Anthropic API key lives on the
  server and is never exposed to the browser (unlike the prototype
  artifact, which had to call the API from the browser)

**Minimal starting point — port the prototype's UI into these:**
- `app/page.tsx` (Directory), `app/portal/page.tsx` (Org Portal),
  `app/admin/page.tsx` (Admin Queue) are plain, functional, unstyled.
  The visual design and richer interactions from the HTML prototype
  artifact should be rebuilt as React components here, calling the
  same API routes.
- Invite emails aren't sent automatically yet — `POST /api/admin/invites`
  creates the record; wiring up an email provider (e.g. Resend) to
  actually send the email is a small follow-up.

## 1. Create your accounts (~10 minutes)

1. **Neon** (database): go to [neon.tech](https://neon.tech), sign up free,
   click "New Project." Name it whatever you like (e.g. `tx-rescue-db`).
2. **Cloudflare** (hosting): go to [dash.cloudflare.com](https://dash.cloudflare.com),
   sign up free. You'll use "Workers & Pages" from the sidebar.
3. **Anthropic** (for AI Search): you'll need an API key from
   [console.anthropic.com](https://console.anthropic.com) — separate
   from your claude.ai account. This is a pay-as-you-go API, not free,
   but costs are small at this usage level (check current pricing at
   the link above).

## 2. Set up the database

1. In your Neon project dashboard, open the **SQL Editor** — as of
   August 2026 it's nested inside a collapsible "Postgres database"
   section in the left sidebar (alongside Tables, Roles, etc.) rather
   than sitting as its own top-level item. Expand that section first
   if you don't see it.
2. Paste in the entire contents of `db/schema.sql` and run it. This
   creates all 6 tables.
3. Go to **Connection Details**, choose **Pooled connection**, and copy
   the connection string — it looks like
   `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`.
   You'll need this in step 4.

## 3. Import your real organization data

This is done — `db/import_batches/` contains 580 organizations from
your Master Directory, already converted to SQL that matches this
schema exactly (species split into an array, every capability
normalized to one of the five status values, breed/wildlife flags
derived from the Focus and Organization Type columns where your sheet
didn't have dedicated columns for them).

To load them into Neon:

1. Open the **SQL Editor** in your Neon project (see the note above
   about where it moved in the August 2026 redesign).
2. Open `db/import_batches/batch_01_of_10.sql` in a text editor, copy
   its entire contents, paste into the SQL Editor, and click **Run**.
3. Repeat for `batch_02_of_10.sql` through `batch_10_of_10.sql`, in
   order. Each batch is wrapped in its own transaction, so if one
   batch fails partway through, that batch rolls back cleanly without
   affecting the ones already loaded.
4. After batch 10, run `select count(*) from organizations;` in the
   SQL Editor — it should return 580.

Each batch is split out separately (rather than one combined file)
because the full import is 744KB — too large to paste comfortably in
one go, and closer to the edge of what the SQL Editor handles
smoothly in a single run.

A few notes on how the data came through:
- **Farm/Equine** has no source column in your sheet, so every
  organization is imported as `Unknown` for it — same conservative
  rule the rest of the dataset already follows (don't infer, mark
  Unknown).
- **Breed Specific** was set to `Yes` automatically wherever an org's
  Focus column said "Breed Specific"; **Wildlife** was set to `Yes`
  wherever Organization Type said "Wildlife Rescue." Both stay
  `Unknown` otherwise.
- Any capability cell that didn't already read as one of Yes / No /
  Limited / Case-by-case / Unknown was mapped conservatively to
  `Unknown` rather than guessed.

This is worth spot-checking after import — pick a few organizations
you know well and compare what's in the app to your original sheet.

## 4. Configure environment variables

You'll set these in Cloudflare Pages (step 5), but for local testing
first, create a `.env.local` file in this project with:

```
DATABASE_URL=<your Neon pooled connection string from step 2>
SESSION_SECRET=<a long random string — generate one with: openssl rand -base64 32>
ANTHROPIC_API_KEY=<your key from console.anthropic.com>
```

(A fourth, optional variable — `NEXT_PUBLIC_DONATE_URL` — is covered
in "Optional: accepting donations" below; skip it for now if you're
not setting that up yet.)

Never commit `.env.local` to git — it's already covered by the
`.gitignore` in this project.

## 5. Deploy to Cloudflare Pages

1. Push this project to a GitHub repository (create one at
   github.com/new, then `git init`, `git add .`, `git commit`,
   `git remote add origin ...`, `git push`).
2. In the Cloudflare dashboard, go to **Workers & Pages → Create →
   Pages → Connect to Git**, and select your new repository.
3. Build settings:
   - Framework preset: **Next.js**
   - Build command: `npx @cloudflare/next-on-pages`
   - Build output directory: `.vercel/output/static`
4. Under **Environment Variables**, add the same three variables from
   step 4 (`DATABASE_URL`, `SESSION_SECRET`, `ANTHROPIC_API_KEY`).
5. Click **Save and Deploy**. First build takes a few minutes.

Your app will be live at `<project-name>.pages.dev`, and you can
attach a custom domain later from the same dashboard.

## 6. Create your first admin account

The schema has no built-in admin — you create the first one directly
in the Neon SQL Editor (subsequent admins can be promoted the same
way, or you can build an "promote to admin" admin-only UI later):

```sql
-- Generate a bcrypt hash for your password first (ask Claude to
-- generate one, or use an online bcrypt generator with cost factor 12),
-- then:
insert into users (email, password_hash, role, status)
values ('you@example.org', '<bcrypt hash>', 'admin', 'approved');
```

## Optional: accepting donations toward AI usage

The app has a `/support` page (linked from the top nav) where visitors
can optionally contribute toward the AI Search feature's running
costs. It's just a link out to a hosted payment page — nothing in
this codebase touches card details or money directly, which keeps
things simple and avoids needing PCI-compliance infrastructure.

Pick one, create a payment link (all of these are free to set up):

- **Stripe Payment Links** — [dashboard.stripe.com/payment-links](https://dashboard.stripe.com/payment-links).
  Supports one-time or recurring amounts, and lets people choose their
  own amount if you enable that option. Requires a Stripe account
  (identity/bank verification needed before payouts, but the link
  itself can be created immediately).
- **PayPal.me** — [paypal.me](https://paypal.me). Fastest to set up,
  works with an existing PayPal account.
- **Buy Me a Coffee** — [buymeacoffee.com](https://buymeacoffee.com).
  Simple, donation-focused, small platform fee per contribution.

Once you have a link, set it as an environment variable in Cloudflare
Pages (same place as the other three from step 4):

```
NEXT_PUBLIC_DONATE_URL=<your payment link>
```

Note the `NEXT_PUBLIC_` prefix — that's required for Next.js to expose
it to the browser (this is a public link, not a secret, so that's
fine). Without this variable set, the `/support` page shows a plain
notice instead of a broken link.

A couple of things worth deciding before you turn this on:
- **Where the money actually goes** — Stripe/PayPal/BMC all pay out to
  your own bank account; nothing here automatically earmarks funds
  for "AI usage" specifically. If you want that separation to be more
  than a stated intention, keep a separate account or budget line for
  it.
- **Tax treatment** — if this project isn't run under a registered
  nonprofit, contributions likely aren't tax-deductible for the giver.
  Worth saying so explicitly on the `/support` page copy if that's the
  case, so nobody's surprised at tax time.

## Local development

```
npm install
npm run dev
```

Requires `.env.local` from step 4 to be set up first.

## Where things live

- `db/schema.sql` — the full database schema
- `lib/db.ts` — Neon connection
- `lib/auth.ts` — password hashing, sessions, permission checks
- `lib/constants.ts` — capability fields, auto-publish vs. review rules
- `app/api/**` — all backend routes
- `app/*.tsx` — frontend pages (minimal — see note above)
