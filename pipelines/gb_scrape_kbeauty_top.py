#!/usr/bin/env python3
"""Scrape popular products for the US top-30 K-beauty brands from SkinSort.

Discovers product URLs via skinsort brand listing pages
(`/products/{brand-slug}` + turbo pagination), then reuses
`gb_skinsort_scrape.scrape_product` + `--load` into RDS.

Usage:
  # Discover URLs only (writes urls file)
  python3 pipelines/gb_scrape_kbeauty_top.py --discover --per-brand 10 \\
      --urls-out pipelines/data/kbeauty_top30_urls.txt

  # Scrape + load (skips products already in RDS)
  DATABASE_URL=... python3 pipelines/gb_scrape_kbeauty_top.py --per-brand 10 \\
      --out pipelines/data/kbeauty_top30.json --load

  # Scrape from a prior urls file
  DATABASE_URL=... python3 pipelines/gb_scrape_kbeauty_top.py \\
      --urls-file pipelines/data/kbeauty_top30_urls.txt --load \\
      --out pipelines/data/kbeauty_top30.json

Env: DATABASE_URL (required for --load / existing-product skip).
"""
from __future__ import annotations

import argparse
import http.cookiejar
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")
BASE = "https://skinsort.com"
SKIP_SLUGS = {"dupes", "page"}  # not real products
# SkinSort sometimes emits product-card ids as slug suffixes; drop those.
UUID_TAIL = re.compile(
    r"-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", re.I
)

# (display, gb_brands.slug, skinsort brand path candidates)
TOP30: list[tuple[str, str, list[str]]] = [
    # Top Tier
    ("Beauty of Joseon", "beauty-of-joseon", ["beauty-of-joseon"]),
    ("COSRX", "cosrx", ["cosrx"]),
    ("Anua", "anua", ["anua"]),
    ("Round Lab", "round-lab", ["round-lab"]),
    ("SKIN1004", "skin1004", ["skin-1004", "skin1004"]),
    ("Medicube", "medicube", ["medicube"]),
    ("Torriden", "torriden", ["torriden"]),
    ("Mixsoon", "mixsoon", ["mixsoon"]),
    ("VT Cosmetics", "vt-cosmetics", ["vt-cosmetics"]),
    ("Numbuzin", "numbuzin", ["numbuzin"]),
    # Second Tier
    ("Abib", "abib", ["abib"]),
    ("Biodance", "biodance", ["biodance"]),
    ("Haruharu", "haruharu-wonder", ["haruharu", "haruharu-wonder"]),
    ("Dr.G", "drg", ["dr-g", "drg"]),
    ("Purito", "purito", ["purito"]),
    ("Isntree", "isntree", ["isntree"]),
    ("Manyo", "manyo", ["ma-nyo", "manyo"]),
    ("Mary&May", "mary-may", ["mary-may", "mary-and-may"]),
    ("TirTir", "tirtir", ["tirtir"]),
    ("Rom&nd", "romand", ["romand"]),
    # Third Tier
    ("Mediheal", "mediheal", ["mediheal"]),
    ("Laneige", "laneige", ["laneige"]),
    ("Clio", "clio", ["clio"]),
    ("Peripera", "peripera", ["peripera"]),
    ("Hince", "hince", ["hince"]),
    ("FWEE", "fwee", ["fwee"]),
    ("Tocobo", "tocobo", ["tocobo"]),
    ("Needly", "needly", ["needly"]),
    ("Rejuran", "rejuran", ["rejuran"]),
    ("Aestura", "aestura", ["aestura"]),
]


def dsn() -> str:
    raw = os.environ.get("DATABASE_URL", "")
    if not raw:
        return ""
    return raw.replace("postgresql+asyncpg://", "postgresql://").split("?")[0]


def existing_product_urls() -> set[str]:
    """Return set of skinsort-style brand/product path suffixes already in RDS.

    We match on product slug (second path segment) when possible; full path
    when brand slug differs (skin-1004 vs skin1004).
    """
    d = dsn()
    if not d:
        return set()
    import psycopg2

    conn = psycopg2.connect(d, sslmode="require")
    cur = conn.cursor()
    cur.execute(
        """select b.slug, p.slug from gb_products p
           join gb_brands b on b.id = p.brand_id
           where p.status <> 'discontinued'"""
    )
    out: set[str] = set()
    for bslug, pslug in cur.fetchall():
        # product slugs in our DB are usually product-only (e.g. advanced-snail-96-...)
        # skinsort paths are /products/{brand}/{product}
        out.add(pslug)
        out.add(f"{bslug}/{pslug}")
    cur.close()
    conn.close()
    return out


def fetch(opener, url: str, data: bytes | None = None, headers: dict | None = None) -> str:
    h = {"User-Agent": UA, "Accept": "text/html,application/xhtml+xml"}
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, data=data, headers=h)
    with opener.open(req, timeout=35) as r:
        return r.read().decode("utf-8", "replace"), r.geturl()  # type: ignore[return-value]


def resolve_brand_slug(candidates: list[str], delay: float) -> str | None:
    jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    for slug in candidates:
        url = f"{BASE}/products/{slug}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with opener.open(req, timeout=25) as r:
                final = r.geturl()
                html = r.read(12000).decode("utf-8", "replace")
        except Exception:
            time.sleep(delay)
            continue
        time.sleep(delay)
        if final.rstrip("/") in (f"{BASE}/products", BASE):
            continue
        # must land on brand page or have brand product links
        n = len(set(re.findall(rf'href="(/products/{re.escape(slug)}/[a-z0-9-]+)"', html)))
        if n >= 1 or final.rstrip("/").endswith(f"/products/{slug}"):
            return slug
    return None


def list_brand_products(brand_slug: str, pages: int, delay: float) -> list[str]:
    """Return full skinsort product URLs, first page ≈ most popular."""
    jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    url = f"{BASE}/products/{brand_slug}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with opener.open(req, timeout=35) as r:
        html = r.read().decode("utf-8", "replace")
    time.sleep(delay)

    def extract(text: str) -> list[str]:
        found = re.findall(rf'href="(/products/{re.escape(brand_slug)}/([a-z0-9-]+))"', text)
        out = []
        for path, pslug in found:
            if pslug in SKIP_SLUGS or pslug.isdigit():
                continue
            if UUID_TAIL.search(pslug):
                # strip accidental UUID suffix from card markup
                clean = UUID_TAIL.sub("", pslug)
                if not clean or clean in SKIP_SLUGS:
                    continue
                path = f"/products/{brand_slug}/{clean}"
                pslug = clean
            out.append(f"{BASE}{path}")
        # preserve order, unique
        seen, ordered = set(), []
        for u in out:
            if u not in seen:
                seen.add(u)
                ordered.append(u)
        return ordered

    products = extract(html)
    m = re.search(r'name="csrf-token" content="([^"]+)"', html)
    tok = m.group(1) if m else None
    if tok:
        for page in range(2, pages + 1):
            post_url = f"{BASE}/products/{brand_slug}/filtered_products?page={page}"
            data = urllib.parse.urlencode({"authenticity_token": tok}).encode()
            req = urllib.request.Request(
                post_url,
                data=data,
                headers={
                    "User-Agent": UA,
                    "Accept": "text/vnd.turbo-stream.html, text/html",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Referer": url,
                },
            )
            try:
                with opener.open(req, timeout=35) as r:
                    body = r.read().decode("utf-8", "replace")
            except Exception as e:
                print(f"  ! page {page}: {e}", file=sys.stderr)
                break
            time.sleep(delay)
            batch = extract(body)
            if not batch:
                break
            for u in batch:
                if u not in products:
                    products.append(u)
    return products


def product_slug_from_url(url: str) -> str:
    # https://skinsort.com/products/{brand}/{product}
    parts = urllib.parse.urlparse(url).path.strip("/").split("/")
    return parts[-1] if parts else url


def path_key_from_url(url: str) -> str:
    parts = urllib.parse.urlparse(url).path.strip("/").split("/")
    if len(parts) >= 3:
        return f"{parts[1]}/{parts[2]}"
    return product_slug_from_url(url)


def discover(per_brand: int, pages: int, delay: float) -> list[tuple[str, str, str]]:
    """Return list of (gb_brand_slug, display, product_url)."""
    rows: list[tuple[str, str, str]] = []
    for display, gb_slug, cands in TOP30:
        ss = resolve_brand_slug(cands, delay)
        if not ss:
            print(f"  MISS brand page for {display} ({cands})", file=sys.stderr)
            continue
        urls = list_brand_products(ss, pages=pages, delay=delay)
        pick = urls[:per_brand]
        print(f"  {display:22s} skinsort={ss:20s} listed={len(urls):3d} take={len(pick)}")
        for u in pick:
            rows.append((gb_slug, display, u))
    return rows


def filter_new(rows: list[tuple[str, str, str]]) -> list[tuple[str, str, str]]:
    """Skip URLs whose product is already ingested.

    DB product slugs are usually `{skinsortBrand}-{product}` (e.g.
    `anua-heartleaf-77-soothing-toner`). Also match bare product slug suffix
    and path keys for older rows.
    """
    existing = existing_product_urls()
    if not existing:
        print("  (no DATABASE_URL / empty — not skipping existing)", file=sys.stderr)
        return rows
    kept = []
    skipped = 0
    for gb, display, url in rows:
        parts = urllib.parse.urlparse(url).path.strip("/").split("/")
        # /products/{brand}/{product}
        ss_brand = parts[1] if len(parts) >= 3 else ""
        pslug = parts[-1] if parts else ""
        candidates = {
            pslug,
            f"{ss_brand}-{pslug}" if ss_brand else "",
            f"{gb}-{pslug}" if gb else "",
            f"{ss_brand}/{pslug}" if ss_brand else "",
            path_key_from_url(url),
        }
        # skin-1004 vs skin1004 / ma-nyo vs manyo aliases
        if ss_brand == "skin-1004":
            candidates.add(f"skin1004-{pslug}")
        if ss_brand == "ma-nyo":
            candidates.add(f"manyo-{pslug}")
        if ss_brand == "dr-g":
            candidates.add(f"drg-{pslug}")
        if ss_brand == "haruharu":
            candidates.add(f"haruharu-wonder-{pslug}")
        candidates.discard("")
        if candidates & existing:
            skipped += 1
            continue
        kept.append((gb, display, url))
    print(f"  skip existing={skipped} new={len(kept)}")
    return kept


def write_urls_file(path: Path, rows: list[tuple[str, str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        current = None
        for gb, display, url in rows:
            header = f"# {display} ({gb})"
            if header != current:
                f.write(f"\n{header}\n")
                current = header
            f.write(url + "\n")
    print(f"wrote {len(rows)} urls -> {path}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--discover", action="store_true", help="only discover URLs, do not scrape")
    ap.add_argument("--per-brand", type=int, default=10, help="max popular products per brand")
    ap.add_argument("--pages", type=int, default=4, help="skinsort brand listing pages to crawl")
    ap.add_argument("--delay", type=float, default=1.0)
    ap.add_argument("--urls-out", default=str(ROOT / "pipelines/data/kbeauty_top30_urls.txt"))
    ap.add_argument("--urls-file", help="use an existing urls file instead of discovering")
    ap.add_argument("--out", help="write scraped JSON")
    ap.add_argument("--load", action="store_true", help="ingest into RDS")
    ap.add_argument("--no-deep", dest="deep", action="store_false")
    ap.add_argument("--no-vendors", dest="vendors", action="store_false")
    ap.add_argument("--include-existing", action="store_true",
                    help="re-scrape even if product slug already in RDS")
    ap.add_argument("--limit", type=int, default=0, help="cap total products scraped (0=all)")
    args = ap.parse_args()

    if args.urls_file:
        rows = []
        for line in open(args.urls_file):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith("http"):
                # best-effort brand from path
                parts = urllib.parse.urlparse(line).path.strip("/").split("/")
                gb = parts[1] if len(parts) >= 2 else "unknown"
                rows.append((gb, gb, line))
        print(f"loaded {len(rows)} urls from {args.urls_file}")
    else:
        print(f"discovering top {args.per_brand} products × {len(TOP30)} brands…")
        rows = discover(args.per_brand, args.pages, args.delay)
        write_urls_file(Path(args.urls_out), rows)

    if not args.include_existing:
        rows = filter_new(rows)

    if args.limit and len(rows) > args.limit:
        rows = rows[: args.limit]
        print(f"  limit -> {len(rows)}")

    if args.discover:
        print(f"discover-only done ({len(rows)} urls)")
        return

    if not rows:
        print("nothing to scrape")
        return

    import gb_skinsort_scrape as scrape

    products = []
    for i, (gb, display, url) in enumerate(rows, 1):
        print(f"[{i}/{len(rows)}] {display}: {url}")
        try:
            p = scrape.scrape_product(url, args.delay, args.deep, args.vendors, None)
        except Exception as e:
            print(f"  ! scrape error: {e}", file=sys.stderr)
            p = None
        if p:
            products.append(p)

    if args.out:
        Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        with open(args.out, "w") as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        print(f"wrote {len(products)} products -> {args.out}")

    if args.load:
        if not dsn():
            sys.exit("DATABASE_URL required for --load")
        os.environ.setdefault("DATABASE_URL", os.environ["DATABASE_URL"])
        print(f"loading {len(products)} products into RDS…")
        scrape.load_products(products)
        print("load done")

    if not args.out and not args.load:
        json.dump(products, sys.stdout, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
