# Gym Bro

A mobile-first progressive overload workout tracker PWA. Tells you exactly what weight and reps to do next — every session, every exercise.

## Features

- **Smart double-progression** — auto-increases load when you hit top of rep range, detects plateaus, triggers deloads
- **103 exercises** seeded across 12 movement categories with muscle group tagging
- **Offline-first** — active workout lives in localStorage, syncs to Supabase on finish
- **Split builder** — Programs → Templates → Sessions
- **Progress charts** — 1RM trend, weekly volume, bodyweight, consistency
- **PWA** — installable on iOS/Android

## Stack

| Layer | Choice |
|---|---|
| Frontend | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS + Radix UI |
| State | TanStack Query v5 + Zustand |
| Backend | Supabase (Postgres + RLS + Auth) |
| Charts | Recharts |
| Hosting | Netlify |

## Quick Start

```bash
npm install
cp .env.example .env.local   # add your Supabase URL + anon key
npm run dev
```

See [SETUP.md](./SETUP.md) for full database setup, migrations, and deploy instructions.

## Tests

```bash
npm run test:run   # 42 tests covering the recommendation engine
```
