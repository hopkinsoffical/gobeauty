import { NextRequest, NextResponse } from "next/server";

// Same-origin image proxy for scraped product imagery. storage.skinsort.com
// serves Cross-Origin-Resource-Policy: same-origin (plus a Cloudflare
// hotlink rule), so browsers refuse to render it cross-origin — every image
// must be fetched server-side and re-served from our origin. Host allowlist
// keeps this from being an open proxy.
const ALLOWED_HOSTS = new Set(["storage.skinsort.com", "skinsort.com"]);

const DAY = 86400;

export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get("u");
  if (!u) return new NextResponse("missing u", { status: 400 });

  let url: URL;
  try {
    url = new URL(u);
  } catch {
    return new NextResponse("bad url", { status: 400 });
  }
  if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname)) {
    return new NextResponse("host not allowed", { status: 403 });
  }

  const upstream = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      Referer: "https://skinsort.com/",
      Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
    },
    next: { revalidate: 30 * DAY },
  });

  const type = upstream.headers.get("content-type") ?? "";
  if (!upstream.ok || !type.startsWith("image/")) {
    return new NextResponse("upstream unavailable", {
      status: 404,
      headers: { "Cache-Control": `public, max-age=300, s-maxage=300` },
    });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": `public, max-age=${30 * DAY}, s-maxage=${30 * DAY}, immutable`,
    },
  });
}
