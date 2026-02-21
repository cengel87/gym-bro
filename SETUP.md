# Setup Guide

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier works)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for local dev)

## Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Both values are in your Supabase project → Settings → API.

## Database Setup

### Option A — Supabase Cloud (recommended)

1. Open your Supabase project → **SQL Editor**
2. Run each file in order:
   ```
   supabase/migrations/00001_extensions.sql
   supabase/migrations/00002_exercises.sql
   supabase/migrations/00003_programs.sql
   supabase/migrations/00004_templates.sql
   supabase/migrations/00005_sessions.sql
   supabase/migrations/00006_bodyweight.sql
   supabase/migrations/00007_user_settings.sql
   supabase/migrations/00008_exercise_prefs.sql
   supabase/migrations/00009_views.sql
   supabase/migrations/00010_grants.sql
   ```
3. Generate and run the exercise seed:
   ```bash
   node scripts/generate_seed_sql.js
   ```
   Then run `supabase/migrations/00011_exercises_data.sql` in the SQL Editor.

### Option B — Supabase CLI (local dev)

```bash
supabase start
supabase db push
node scripts/generate_seed_sql.js
supabase db push

# Regenerate TypeScript types after schema changes
supabase gen types typescript --local > src/types/database.types.ts
```

## Auth Configuration

In Supabase → **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:5173` (dev) or your production URL
- **Redirect URLs**: `https://your-app.netlify.app/**`

## Running Locally

```bash
npm run dev        # dev server at http://localhost:5173
npm run build      # production build → dist/
npm run test:run   # run all tests
```

## Deploying to Netlify

1. Push repo to GitHub
2. Connect to Netlify → **New site from Git**
3. Build command: `npm run build` / Publish dir: `dist`
4. Add environment variables in Netlify UI:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Copy your Netlify URL back into Supabase Auth → URL Configuration

The `netlify.toml` already handles SPA routing (`/* → /index.html`).

## Project Structure

```
src/
├── engine/       # Pure TS recommendation engine (zero Supabase deps)
├── hooks/        # TanStack Query data hooks
├── store/        # Zustand active workout store (localStorage persist)
├── pages/        # Route-level components
├── components/   # UI components
├── lib/          # Supabase client, utils, constants
└── types/        # TypeScript types

supabase/
├── config.toml
└── migrations/   # 11 SQL files — run in order

scripts/
└── generate_seed_sql.js   # JSON → SQL for exercise seed data
```

## How the Recommendation Engine Works

Pure TypeScript, no Supabase deps (`src/engine/recommendation.ts`). Given the last N sessions for an exercise+variant:

1. **No history** → suggest a sensible starting load
2. **3+ consecutive misses** → auto-deload by 10% (if enabled)
3. **All sets hit max reps** → increase load by increment, reset to min reps
4. **2+ sets below min reps** → decrease load
5. **Between min/max** → maintain load, push lagging sets +1 rep
6. **Plateau detected** → microload / rep floor reset / full increment (based on aggressiveness setting)

Increments default by movement pattern (squat/hinge: 2.5 kg, OHP: 1.25 kg, isolation: 1.0 kg) with per-exercise user overrides.
