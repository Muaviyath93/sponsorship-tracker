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
