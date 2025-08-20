# Clinical Reasoning Demo (Vite + React + Tailwind)

A no-backend demo of a criteria-based rehab/performance planner with daily readiness auto-regulation and a tiny exercise recommender.

## Quick run (local)
1. Install Node 18+ from nodejs.org
2. In this folder: `npm install`
3. Start dev server: `npm run dev`

## Deploy (no code)
**Replit (fastest):**
1. Create a new Repl → "Import from GitHub or Zip" → Upload this folder or the provided zip.
2. Replit detects Node and installs packages automatically.
3. Press **Run** → open the web preview → share the URL.

**Vercel (production-grade):**
1. Create a GitHub repo and upload files.
2. In Vercel → New Project → Import the repo.
3. Framework preset: *Vite*, Build: `npm run build`, Output: `dist`.
4. Deploy → copy your live URL.

**StackBlitz (zero install):**
1. Go to stackblitz.com → "Upload Project" → select this zip.
2. It will run in the browser. Use "Share" to copy the link.

## Where the exercise data lives
We ship a small sample at `public/exercise_sample.json` (first 100 rows). Swap it for your full library or connect Airtable later.
