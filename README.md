# GoBeauty

Consumer-facing local ranking site for nail salons. Powers SEO landing pages
like **Best Nail Salons in Edison, NJ**, plus an AI **photo analysis chat** at
`/analyze`, and converts both consumers (browse, analyze & discover) and salon
owners (free Growth Report).

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase — Auth, Postgres, Storage
- Anthropic Claude (`claude-opus-4-8`) — photo analysis + follow-up chat
- Deploy target: Vercel

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Anthropic keys
npm run dev
```

Open http://localhost:3000.

## Photo analysis feature (`/analyze`)

After signing up / in, a user uploads a beauty photo in the chatbox. Claude
analyzes it and returns a structured breakdown — **what** it is, **why** it
works, **how** it's done, **how much** it costs, plus a **recommendation** and
suggested **next-step** questions to keep chatting. Past analyses surface in the
"What others are asking" trending feed below the chat.

Flow:

- `components/AuthProvider` + `AuthModal` — Supabase email/password auth.
- `app/analyze/page.tsx` → `AnalyzeExperience` → `AnalyzeChat` (upload, downscale,
  thread) + `TrendingFeed`.
- `app/api/analyze` — verifies the user, calls Claude vision (forced tool call
  for structured output, see `lib/anthropic.ts`), stores the image in Supabase
  Storage, and persists the analysis.
- `app/api/chat` — follow-up Q&A grounded in the analysis.
- `app/api/feed` — public trending feed.

### One-time setup

1. Set the env vars in `.env.local` (see `.env.example`): the Supabase URL/keys
   and `ANTHROPIC_API_KEY`.
2. Run `supabase/schema.sql` in the Supabase SQL editor — it creates the
   `analyses` table (+ RLS for a public read feed) and the public
   `analysis-images` storage bucket.

The feature degrades gracefully: without keys the marketing site still renders,
auth shows a configuration notice, and persistence is best-effort.

## Project layout

```
app/
  layout.tsx       # Root shell — fonts, metadata, header, footer
  page.tsx         # Best Nail Salons in Edison, NJ (first ranking page)
  globals.css      # Tailwind base + tokens
components/
  SiteHeader.tsx
  SiteFooter.tsx
  RankingHero.tsx
  SalonRankingCard.tsx
  SalonMap.tsx
  RankingMethodology.tsx
  OwnerCTA.tsx
  RankingFAQ.tsx
lib/
  types.ts         # Salon, MethodCriterion, FaqItem
  data/
    salons.ts      # Mock Top 10 — drop-in for API later
    methods.ts
    faq.ts
```

## Swapping mock data for API

The ranking page reads from `lib/data/salons.ts`. To plug in real data:

1. Replace the `SALONS_EDISON_NJ` export with a server fetch (e.g.
   `getSalonsByCity('edison-nj')`) inside `app/page.tsx`.
2. Keep the `Salon` type contract in `lib/types.ts` stable.

Components don't care where the data comes from — they just take props.
