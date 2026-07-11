"""Mirror scraped skinsort product images into the repo's public/ folder.

skinsort blocks hotlinking (Cross-Origin-Resource-Policy: same-origin behind
a Cloudflare rule) and also blocks Vercel egress IPs, so images must be
served first-party. This downloads every skinsort URL referenced by
gb_products.images to public/pimg/<sha1-16>.<ext> and rewrites the DB url to
that path (original kept as src_url). ~1.2k images / ~19MB total.

Re-runnable and incremental: already-mirrored rows are skipped. RE-RUN after
loading new products (gb_skinsort_scrape.py), then commit public/pimg and
push so Vercel serves the new files.

Usage: python3 pipelines/gb_mirror_images.py
Env:   DATABASE_URL
"""
from __future__ import annotations

import hashlib
import json
import os
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

import psycopg2

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(REPO, "public", "pimg")
SKINSORT = ("https://storage.skinsort.com/", "https://skinsort.com/")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Referer": "https://skinsort.com/",
    "Accept": "image/avif,image/webp,image/*,*/*;q=0.8",
}
EXT = {"image/webp": "webp", "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/avif": "avif"}


def fetch(url: str) -> tuple[str, str] | None:
    """Download url into OUT_DIR; returns (url, local_path) or None on failure."""
    name = hashlib.sha1(url.encode()).hexdigest()[:16]
    for ext in EXT.values():  # already mirrored under any extension?
        p = f"{name}.{ext}"
        if os.path.exists(os.path.join(OUT_DIR, p)):
            return url, f"/pimg/{p}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            ctype = r.headers.get("Content-Type", "").split(";")[0].strip()
            ext = EXT.get(ctype)
            if not ext:
                print(f"  skip (not image, {ctype}): {url}", file=sys.stderr)
                return None
            body = r.read()
    except Exception as e:  # noqa: BLE001 — one bad URL must not kill the run
        print(f"  fail {e}: {url}", file=sys.stderr)
        return None
    p = f"{name}.{ext}"
    with open(os.path.join(OUT_DIR, p), "wb") as f:
        f.write(body)
    return url, f"/pimg/{p}"


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    d = os.environ["DATABASE_URL"].replace("postgresql+asyncpg://", "postgresql://").split("?")[0]
    conn = psycopg2.connect(d + "?sslmode=require")
    cur = conn.cursor()

    cur.execute("select id, images from gb_products where images::text like '%skinsort%'")
    rows = cur.fetchall()
    urls = {
        img["url"]
        for _, images in rows
        for img in images
        if isinstance(img.get("url"), str) and img["url"].startswith(SKINSORT)
    }
    print(f"{len(rows)} products, {len(urls)} skinsort urls to mirror")

    with ThreadPoolExecutor(max_workers=4) as ex:
        mirrored = dict(filter(None, ex.map(fetch, sorted(urls))))
    print(f"mirrored {len(mirrored)}/{len(urls)}")

    updated = 0
    for pid, images in rows:
        changed = False
        for img in images:
            u = img.get("url")
            if isinstance(u, str) and u in mirrored:
                img["src_url"] = u
                img["url"] = mirrored[u]
                changed = True
        if changed:
            cur.execute("update gb_products set images = %s where id = %s", (json.dumps(images), pid))
            updated += 1
    conn.commit()
    print(f"updated {updated} product rows")


if __name__ == "__main__":
    main()
