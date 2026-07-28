# Sponsorship Ops Tracker

Personal sponsorship workflow and follow-up command center, built with Next.js, TypeScript, and Tailwind.

## Run locally
npm install
npm run dev
Then open http://localhost:3000

## Deploy
See the deployment guide from Claude, or deploy directly on vercel.com by importing this repo.

## Notes
- Data currently lives in-memory in the browser (component state + localStorage for
  acknowledged follow-ups and threshold settings). It resets if you clear browser data.
- Next step: connect Supabase for a real persistent multi-device backend.

## Supabase setup
This app is backed by Supabase (auth + database). Locally it reads credentials from `.env.local`
(already filled in with this project's keys for convenience — this file is gitignored and should
NOT be uploaded to GitHub).

For the deployed (Vercel) version to work, add these two variables in
Vercel → Project Settings → Environment Variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

(values are in your local `.env.local` file, or Supabase → Project Settings → API)
