# Google Search Console — goBeauty GEO setup

This runbook covers **property verification**, **sitemap submission**, and
**Generative AI performance** monitoring for https://www.gobeauty.ai.

> Code cannot submit a sitemap for you without Google OAuth credentials.
> Complete the steps below once in Search Console; re-check after major deploys.

## 1. Prerequisites (already in the repo)

| Item | Location / URL |
|------|----------------|
| Canonical host | `https://www.gobeauty.ai` (`metadataBase` in `app/layout.tsx`) |
| Robots | `https://www.gobeauty.ai/robots.txt` (`app/robots.ts`) |
| Sitemap | `https://www.gobeauty.ai/sitemap.xml` (`app/sitemap.ts`) |
| AI crawlers allowed | GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended |
| FAQ / Blog hubs | `/faq`, `/blog` (+ posts) in sitemap |
| Verification env | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` or `GOOGLE_SITE_VERIFICATION` |

Smoke-check production after deploy:

```bash
curl -sI https://www.gobeauty.ai/robots.txt | head -5
curl -sI https://www.gobeauty.ai/sitemap.xml | head -5
curl -s https://www.gobeauty.ai/sitemap.xml | head -40
# Optional local checklist:
node scripts/gsc-checklist.mjs
```

## 2. Add the property in Search Console

1. Open [Google Search Console](https://search.google.com/search-console).
2. **Add property** → prefer **URL prefix**: `https://www.gobeauty.ai`
   - (Domain property is fine if you control DNS for `gobeauty.ai`.)
3. Verify ownership (pick one):

### Option A — HTML tag (recommended with Vercel)

1. In GSC, choose **HTML tag** verification.
2. Copy the `content` value only (the long token).
3. Set in Vercel (or `.env.local` for preview):

   ```bash
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=paste_token_here
   ```

4. Redeploy so `app/layout.tsx` emits:

   ```html
   <meta name="google-site-verification" content="…" />
   ```

5. Click **Verify** in Search Console.

### Option B — DNS TXT

Add the TXT record Google shows for `gobeauty.ai` / `www`, then verify.

## 3. Submit the sitemap

1. In the verified property → **Sitemaps**.
2. Enter: `sitemap.xml` (or full `https://www.gobeauty.ai/sitemap.xml`).
3. **Submit**.
4. Wait for status **Success**. If “Couldn’t fetch”, confirm the deploy is live and returns `200` + XML.

After GEO content launches, confirm these paths appear (or are discovered):

- `/` `/faq` `/blog` `/blog/*`
- `/get-this-look` `/skin-analyzer` `/marketplace`
- `/products` `/ingredients` (and dynamic URLs as API allows)

## 4. Request indexing for priority URLs (optional, first week)

In **URL Inspection**:

1. Inspect each URL below.
2. If “URL is not on Google”, click **Request indexing**.

Priority list:

```
https://www.gobeauty.ai/
https://www.gobeauty.ai/faq
https://www.gobeauty.ai/blog
https://www.gobeauty.ai/get-this-look
https://www.gobeauty.ai/skin-analyzer
https://www.gobeauty.ai/marketplace
https://www.gobeauty.ai/blog/what-is-gobeauty-ai
```

Do not bulk-spam requests; Google rate-limits manual indexing.

## 5. Monitor Generative AI performance

1. Search Console → **Performance** (or **Generative AI** performance report when enabled for the property).
2. Track impressions/clicks from AI features once data exists (often delayed).
3. Monthly checklist:
   - Sitemap still **Success**
   - No surge in coverage errors on `/faq` `/blog`
   - Manually ask ChatGPT / Perplexity: “What is goBeauty.ai?” and note citations

## 6. Rich results / FAQ schema

Validate sample pages:

- [Rich Results Test](https://search.google.com/test/rich-results)
- Test: `/faq`, `/get-this-look`, `/skin-analyzer`, `/marketplace`, one blog post

Expect **FAQ** (and **Article** on blog posts) eligible types when markup is valid.

## 7. Troubleshooting

| Symptom | Fix |
|---------|-----|
| Verification fails | Redeploy after setting env; view page source for the meta tag |
| Sitemap “Couldn’t fetch” | Ensure production 200 on `/sitemap.xml`; no auth wall |
| Soft 404 on blog/faq | Confirm deploy includes new routes; hard-refresh CDN |
| FAQ not in rich results | Content must be visible HTML Q&A + valid FAQPage JSON-LD |
| Apex vs www | Stick to `www.gobeauty.ai` everywhere (canonical + GSC property) |

## 8. Owner checklist (copy/paste)

- [ ] GSC property `https://www.gobeauty.ai` verified  
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` set in production  
- [ ] Sitemap `sitemap.xml` submitted → Success  
- [ ] Priority URLs inspected / requested once  
- [ ] Rich Results Test OK on FAQ + one key page  
- [ ] Calendar reminder: monthly GEO / GSC review  
