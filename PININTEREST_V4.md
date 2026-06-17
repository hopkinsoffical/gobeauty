# Pinterest v4 — dev branch preview

**Branch:** `pinterest-v4`
**Deployed to:** Vercel preview URL (auto-generated on push)
**Local dev:** `npm run dev` (currently running on :3099)

## What changed

| File | What | Why |
|---|---|---|
| `app/page.tsx` | Replaced 7-section old layout with 5-section Pinterest layout | Smaller hero, masonry feed, V4 BP features |
| `components/ChipBar.tsx` | NEW — sticky category chip row | Pinterest's signature below the search bar |
| `components/CompactHero.tsx` | NEW — replaces `HeroSection.tsx` | Compact hero with 3 horizontal photo cards |
| `components/PathCardGrid.tsx` | NEW — replaces `FourPathsSection.tsx` | 5-tile V4 BP module grid (Get Look / Find Pros / Rankings / DIY / Shop) |
| `components/TrendingFeed.tsx` | NEW — replaces `FeaturedLooksSection.tsx` + `ShopProductsSection.tsx` + `LocalServicesSection.tsx` | CSS-columns masonry with 18 real 美业素材 |
| `components/ForBusinessesSection.tsx` | Replaced with dark CTA strip | Cleaner visual separation from feed |
| `components/SiteHeader.tsx` | Added Pinterest-style search input with "Upload a look" button | Search is the hero, not a tagline |
| `components/MobileTabBar.tsx` | NEW — fixed bottom tab bar (Home/Search/+/Saved/You) | Mobile Pinterest pattern, pink floating + button |
| `app/layout.tsx` | Added `<MobileTabBar />`, added `pb-20 md:pb-0` to main | Tab bar needs `position: fixed` |
| `public/assets/` | NEW — 20 JPGs from Cathy's Drive 美业素材 | 7 salon + 13 nail art, 736px wide |

## What was NOT changed

- `components/AuthModal.tsx` — kept as-is (auth flow)
- `components/SiteFooter.tsx` — kept as-is
- `lib/auth/useAuth.tsx` — kept as-is
- `tailwind.config.ts` — kept as-is (using existing brand-* tokens)
- `components/HeroSection.tsx`, `FourPathsSection.tsx`, etc. — **left in place** for AB comparison. Cathy can delete after approving.

## Old section files (kept for AB comparison, delete after approval)

- `components/HeroSection.tsx` (168 lines)
- `components/FourPathsSection.tsx` (73 lines)
- `components/UseCasesSection.tsx` (63 lines)
- `components/FeaturedLooksSection.tsx` (64 lines)
- `components/ShopProductsSection.tsx` (77 lines)
- `components/LocalServicesSection.tsx` (66 lines)

## How to test

1. **Desktop (1440px):** Open the Vercel preview URL → see sticky topbar with search, chip row, compact hero with 3 photo cards, 5-tile path grid, 18-card masonry feed, dark "For businesses" strip
2. **Mobile (390px):** Open same URL in mobile browser / DevTools mobile mode → chip bar scrolls horizontally, hero stack, 5-tile horizontal scroll, 2-col masonry, bottom tab bar with floating pink +
3. **Click "Save" on a card:** Should trigger `openAuth("sign-in")` since users need to be logged in to save
4. **Click category chips (Nails, Hair, etc):** State-only, doesn't filter yet — needs API
5. **Click the 5 path tiles:** Links are placeholder `#` — needs routing (`/get-look`, `/find-pros`, etc)

## Known limitations

- **Search is decorative** — needs to wire to `/api/search`
- **"Save" requires login** — that's correct, but no toast/feedback
- **"Show more"** is decorative — needs API pagination
- **Cards don't link to detail pages** — needs `/looks/[id]` route
- **No lightbox** — clicking a card does nothing
- **Masonry uses CSS columns** — fine for 18 cards, will need virtualization for 1000+ (use `masonic` lib later)

## Status

- [x] Build: `next build` succeeds (7.58 kB page, 144 kB First Load JS)
- [x] Typecheck: `tsc --noEmit` clean
- [x] Local dev: running on :3099
- [x] Desktop screenshot: confirmed working (see `dev-desktop-fold.jpg`)
- [ ] Mobile screenshot: pending (playwright hung, design verified in static mockup instead)
- [ ] Push to `origin/pinterest-v4` for Vercel preview URL
- [ ] AB comparison screenshot (old vs new) — TBD

## Open questions for Cathy

1. **Module card icons** — emoji (current) or real photos (need to source)?
2. **Brand pink** — `#e85a82` (current) or `#f4a8c7` (BP v4 zoca)?
3. **Path card colors** — all use the same accent palette, or per-card themed (e.g., Nails=pink, Hair=amber, Skin=teal)?
4. **Masonry card click** — go to `/looks/[id]` (lightbox) or to a new tab?
5. **Real vs placeholder data** — feed currently shows fake handles (`@na***_x`), connect to Supabase `gobeauty_search_log` + a new `gobeauty_looks` table?

## Next: git push to origin/pinterest-v4

```bash
git add -A
git commit -m "feat: Pinterest v4 UI with 5-tile path grid + masonry feed

- Replace 7-section v3 layout with 5-section Pinterest layout
- Sticky topbar with search input + 'Upload a look' button
- Sticky category chip row (Nails/Hair/Skin/Makeup/K-Beauty/etc)
- Compact hero with 3 real 美业素材 cards
- 5-tile V4 BP module grid (Get Look/Find Pros/Rankings/DIY/Shop)
- 18-card CSS-columns masonry feed with real 美业素材
- Dark For Businesses CTA strip
- Mobile bottom tab bar (Home/Search/+/Saved/You)

Branch: pinterest-v4 (dev preview)
Deployed: TBD via Vercel auto-deploy"
git push -u origin pinterest-v4
```
