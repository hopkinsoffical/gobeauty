# GoBeauty

Consumer-facing local ranking site for nail salons. Powers SEO landing pages
like **Best Nail Salons in Edison, NJ** and converts both consumers (browse &
discover) and salon owners (free Growth Report).

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Deploy target: Vercel

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

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
