# Rolling out on Supabase

You already have a Supabase project with a URL and API key ready, so this is just wiring
it up. Five steps.

## 1. Run the schema

Supabase Dashboard → your project → **SQL Editor** → New query → paste the entire
contents of `supabase/schema.sql` → **Run**.

This creates:
- `sponsorships` — one row per sponsorship, the full record stored as JSONB in a `data`
  column (matching the shape the app already uses), with `stage`/`event_date` duplicated
  out as plain columns for fast filtering.
- `app_settings` — one shared row holding the annual budget and follow-up thresholds.
- Row Level Security policies on both, so **only signed-in users** can read or write —
  anyone with just the anon key (e.g. a visitor to your public URL who isn't logged in)
  gets nothing back.

## 2. Add your team as users

Dashboard → **Authentication → Users → Add user**. Set an email + password for each
person (or use "Invite user" to email them a signup link instead). There's no public
self-signup in the app — this keeps the workspace closed to just the people you add,
which matters since everyone who signs in sees and can edit all sponsorship/budget data.

## 3. Set your environment variables

Copy `.env.local.example` to `.env.local` and fill in your project's URL and **anon /
public** key (Dashboard → Project Settings → API). Don't use the `service_role` key here
— that one bypasses Row Level Security and must never reach the browser.

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

## 4. Install and run

```
npm install
npm run dev
```

Open the app, sign in with a user you created in step 2. On first sign-in, if the
`sponsorships` table is empty, the app automatically loads it with the built-in demo
data so you're not staring at a blank screen — from then on it reads/writes Supabase
instead of the in-memory seed data.

## 5. Deploy

Push this repo to GitHub and import it into Vercel (or any Next.js host). Add the same
two environment variables in your host's project settings. That's it — no server code
to deploy, since the browser talks to Supabase directly using the anon key + your RLS
policies.

---

### How data flows

- All sponsorship edits (deliverables, approvals, tasks, stage changes, inline edits,
  new requests, deletes) still update local React state instantly, exactly as before —
  the app doesn't feel any different to use.
- A debounced effect (600ms after the last change) batch-upserts the full sponsorships
  array to Supabase in the background. Deletes fire immediately alongside the local
  removal.
- Annual budget and follow-up thresholds sync the same way, to the single
  `app_settings` row, so the whole team shares one set of numbers.
- Which follow-up items you've personally dismissed/acknowledged stays in your
  browser's `localStorage` — it's a personal view preference, not shared team data.

### If something looks wrong

- Blank/stuck on "Loading your workspace…" → open the browser console; a Supabase
  error (bad URL/key, or RLS blocking the request) will be logged there.
- Changes not showing up for teammates → they need to refresh; there's no realtime
  subscription wired up yet (each person loads a fresh snapshot on page load/refresh,
  not live-pushed). Ask if you want that added — Supabase Realtime can push changes
  to everyone's screen instantly with a small addition to `lib/dataSync.js`.
