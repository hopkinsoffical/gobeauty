#!/usr/bin/env node
/**
 * Google Search Console readiness checklist for goBeauty.ai
 *
 *   node scripts/gsc-checklist.mjs
 *   BASE_URL=https://www.gobeauty.ai node scripts/gsc-checklist.mjs
 *
 * Does not call Google APIs (no OAuth). Verifies public crawl surfaces and
 * prints the exact GSC submit steps / URLs to inspect.
 */
const BASE = (process.env.BASE_URL || "https://www.gobeauty.ai").replace(/\/$/, "");

const PATHS = [
  "/robots.txt",
  "/sitemap.xml",
  "/faq",
  "/blog",
  "/get-this-look",
  "/skin-analyzer",
  "/marketplace",
  "/blog/what-is-gobeauty-ai",
  "/llms.txt",
];

async function headOrGet(path) {
  const url = BASE + path;
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { method: "GET", redirect: "follow" });
    }
    return { url, status: res.status, type: res.headers.get("content-type") || "" };
  } catch (e) {
    return { url, status: 0, type: "", error: e.message };
  }
}

function ok(status) {
  return status >= 200 && status < 400;
}

async function main() {
  console.log("goBeauty Search Console checklist");
  console.log("Base:", BASE);
  console.log("");

  let fail = 0;
  for (const p of PATHS) {
    const r = await headOrGet(p);
    const mark = ok(r.status) ? "PASS" : "FAIL";
    if (!ok(r.status)) fail++;
    console.log(`${mark}  ${r.status || "ERR"}  ${r.url}${r.error ? "  (" + r.error + ")" : ""}`);
  }

  // Sitemap body peek
  try {
    const res = await fetch(BASE + "/sitemap.xml");
    const text = await res.text();
    const urls = (text.match(/<loc>/g) || []).length;
    const hasFaq = text.includes("/faq");
    const hasBlog = text.includes("/blog");
    console.log("");
    console.log(`Sitemap: HTTP ${res.status}, ~${urls} <loc>, faq=${hasFaq}, blog=${hasBlog}`);
    if (!hasFaq || !hasBlog) fail++;
  } catch (e) {
    console.log("Sitemap body: FAIL", e.message);
    fail++;
  }

  console.log(`
────────────────────────────────────────
Do this in Google Search Console (manual)
────────────────────────────────────────
1. Property: ${BASE}
2. Verify via HTML tag → set env NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION → redeploy
3. Sitemaps → submit: ${BASE}/sitemap.xml
4. URL Inspection (priority):
   ${BASE}/
   ${BASE}/faq
   ${BASE}/blog
   ${BASE}/get-this-look
   ${BASE}/skin-analyzer
   ${BASE}/marketplace
5. Performance / Generative AI report → review monthly
6. Rich Results Test: ${BASE}/faq

Full runbook: docs/SEARCH_CONSOLE.md
`);

  if (fail) {
    console.log(`Result: ${fail} issue(s) — fix before/while submitting in GSC.`);
    process.exit(1);
  }
  console.log("Result: public crawl surfaces look ready for GSC submission.");
}

main();
