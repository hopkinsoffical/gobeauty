#!/usr/bin/env python3
"""Scrape KBeauty Outlet USA catalog -> gb_products + gb_product_offers (RDS).

Source: Shopify storefront JSON
  https://kbeautyoutletusa.com/products.json?limit=250&page=N
  (HTML collection is ~25 pages; API yields the full catalog in fewer pages.)

Each product is upserted into public.gb_products (by slug = Shopify handle,
truncated to 80 chars) and linked to the marketplace supplier via
public.gb_product_offers.retailer = 'kbeauty-outlet-usa'.

Usage:
  # scrape only
  python3 pipelines/gb_scrape_kbeauty_outlet.py --out /tmp/kbeauty_outlet/products_all.json

  # scrape + load
  DATABASE_URL=... python3 pipelines/gb_scrape_kbeauty_outlet.py --load

  # load previously scraped JSON
  DATABASE_URL=... python3 pipelines/gb_scrape_kbeauty_outlet.py \\
      --from-json /tmp/kbeauty_outlet/products_all.json --load

Env: DATABASE_URL (postgresql:// or postgresql+asyncpg://). Direct storefront
requests are rate-limited from some hosts; the scraper falls back to
https://r.jina.ai/http://... when the origin returns 429.
"""
from __future__ import annotations

import argparse
import html as html_lib
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

RETAILER = "kbeauty-outlet-usa"
STORE_BASE = "https://kbeautyoutletusa.com"
UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36 goBeauty-scraper/1.0"
)
TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")


def slugify(s: str, max_len: int = 80) -> str:
    s = re.sub(r"[^\w\s-]", "", (s or "").lower()).strip()
    return re.sub(r"[\s_]+", "-", s)[:max_len] or "item"


def strip_html(raw: str | None) -> str | None:
    if not raw:
        return None
    text = html_lib.unescape(TAG_RE.sub(" ", raw))
    text = WS_RE.sub(" ", text).strip()
    return text or None


def fetch_text(url: str, timeout: int = 90) -> str | None:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": UA,
            "Accept": "application/json,text/plain,*/*",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            text = r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        print(f"  ! HTTP {e.code} {url}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"  ! {e}: {url}", file=sys.stderr)
        return None
    if text.strip() == "local_rate_limited" or "local_rate_limited" == text.strip():
        return None
    return text


def parse_products_payload(text: str) -> list[dict]:
    """Parse products.json, tolerating Jina markdown wrappers."""
    try:
        data = json.loads(text)
        return list(data.get("products") or [])
    except json.JSONDecodeError:
        pass
    body = text
    if "Markdown Content:" in text:
        body = text.split("Markdown Content:", 1)[1].strip()
    body = re.sub(r"^```\w*\n?", "", body)
    body = re.sub(r"\n?```\s*$", "", body)
    try:
        data = json.loads(body)
        return list(data.get("products") or [])
    except json.JSONDecodeError:
        pass
    i, j = body.find("{"), body.rfind("}")
    if i >= 0 and j > i:
        data = json.loads(body[i : j + 1])
        return list(data.get("products") or [])
    raise ValueError("could not parse products JSON")


def fetch_page(page: int, limit: int = 250) -> list[dict]:
    origin = f"{STORE_BASE}/products.json?limit={limit}&page={page}"
    jina = f"https://r.jina.ai/http://kbeautyoutletusa.com/products.json?limit={limit}&page={page}"
    for url in (origin, jina):
        text = fetch_text(url)
        if not text:
            continue
        try:
            return parse_products_payload(text)
        except Exception as e:
            print(f"  ! parse {url[:70]}: {e}", file=sys.stderr)
    return []


def scrape_all(delay: float = 1.2) -> list[dict]:
    all_prods: list[dict] = []
    page = 1
    while True:
        print(f"scraping page {page}…")
        prods = fetch_page(page)
        print(f"  -> {len(prods)} products")
        if not prods:
            break
        all_prods.extend(prods)
        if len(prods) < 250:
            break
        page += 1
        time.sleep(delay)
    seen: dict[int, dict] = {}
    for p in all_prods:
        seen[int(p["id"])] = p
    return list(seen.values())


def product_url(handle: str) -> str:
    return f"{STORE_BASE}/products/{handle}"


def min_variant(p: dict) -> dict | None:
    vs = p.get("variants") or []
    if not vs:
        return None
    def price(v):
        try:
            return float(v.get("price") or 0)
        except (TypeError, ValueError):
            return 0.0
    return min(vs, key=price)


def price_cents(v: dict | None) -> int | None:
    if not v:
        return None
    try:
        return int(round(float(v["price"]) * 100))
    except (KeyError, TypeError, ValueError):
        return None


def compare_at_cents(v: dict | None) -> int | None:
    if not v or not v.get("compare_at_price"):
        return None
    try:
        return int(round(float(v["compare_at_price"]) * 100))
    except (TypeError, ValueError):
        return None


def images_json(p: dict) -> list[dict]:
    out = []
    for i, img in enumerate(p.get("images") or []):
        src = img.get("src") if isinstance(img, dict) else None
        if not src:
            continue
        out.append({"url": src, "alt": (p.get("title") or "")[:200], "position": i})
    return out


def clean_brand(vendor: str | None, title: str | None) -> str:
    v = (vendor or "").strip()
    if v and v.upper() not in ("KBEAUTYOUTLETUSA.COM", "KBEAUTY OUTLET USA", "KBEAUTYOUTLET"):
        return v
    # title often "[Brand] Product Name"
    m = re.match(r"^\[([^\]]+)\]\s*", title or "")
    if m:
        return m.group(1).strip()
    return v or "Unknown"


def clean_name(title: str, brand: str) -> str:
    t = (title or "").strip()
    # drop leading [Brand] if it matches vendor
    m = re.match(r"^\[([^\]]+)\]\s*(.+)$", t)
    if m and slugify(m.group(1)) == slugify(brand):
        return m.group(2).strip()
    return t


def dsn() -> str:
    raw = os.environ.get("DATABASE_URL", "")
    if not raw:
        sys.exit("DATABASE_URL is required for --load")
    return raw.replace("postgresql+asyncpg://", "postgresql://").split("?")[0]


def load_products(products: list[dict]) -> dict:
    import psycopg2
    import psycopg2.extras

    conn = psycopg2.connect(dsn(), sslmode="require")
    cur = conn.cursor()
    stats = {
        "products_inserted": 0,
        "products_updated": 0,
        "offers_upserted": 0,
        "variants_upserted": 0,
        "brands_touched": 0,
        "errors": 0,
    }
    brand_cache: dict[str, str] = {}
    cat_cache: dict[str, str] = {}

    for p in products:
        handle = (p.get("handle") or "").strip()
        title = (p.get("title") or "").strip()
        if not handle or not title:
            stats["errors"] += 1
            continue
        brand = clean_brand(p.get("vendor"), title)
        name = clean_name(title, brand)
        brand_slug = slugify(brand)
        product_slug = handle[:80]
        category = (p.get("product_type") or "").strip() or None
        desc = strip_html(p.get("body_html"))
        images = images_json(p)
        v0 = min_variant(p)
        cents = price_cents(v0)
        compare = compare_at_cents(v0)
        in_stock = any(bool(v.get("available")) for v in (p.get("variants") or []))
        url = product_url(handle)
        size_label = None
        if v0 and v0.get("title") and v0["title"] not in ("Default Title", "Default"):
            size_label = v0["title"]
        elif v0 and v0.get("option1") and v0["option1"] not in ("Default Title", "Default"):
            size_label = v0["option1"]

        try:
            if brand_slug not in brand_cache:
                cur.execute(
                    """insert into gb_brands (slug, name, country)
                       values (%s, %s, %s)
                       on conflict (slug) do update set
                         name = coalesce(nullif(excluded.name, ''), gb_brands.name),
                         updated_at = now()
                       returning id""",
                    (brand_slug, brand, "South Korea" if brand_slug != "unknown" else None),
                )
                brand_cache[brand_slug] = cur.fetchone()[0]
                stats["brands_touched"] += 1
            brand_id = brand_cache[brand_slug]

            cat_id = None
            if category:
                cslug = slugify(category)
                if cslug not in cat_cache:
                    cur.execute(
                        """insert into gb_categories (slug, name)
                           values (%s, %s)
                           on conflict (slug) do update set name = excluded.name
                           returning id""",
                        (cslug, category),
                    )
                    cat_cache[cslug] = cur.fetchone()[0]
                cat_id = cat_cache[cslug]

            cur.execute("select id from gb_products where slug = %s", (product_slug,))
            row = cur.fetchone()
            if row:
                product_id = row[0]
                cur.execute(
                    """update gb_products set
                         brand_id = %s,
                         category_id = coalesce(%s, category_id),
                         name = %s,
                         description = coalesce(%s, description),
                         images = case
                           when images is null or images = '[]'::jsonb then %s::jsonb
                           else images
                         end,
                         size_label = coalesce(%s, size_label),
                         updated_at = now()
                       where id = %s""",
                    (
                        brand_id,
                        cat_id,
                        name,
                        desc,
                        json.dumps(images),
                        size_label,
                        product_id,
                    ),
                )
                stats["products_updated"] += 1
            else:
                cur.execute(
                    """insert into gb_products
                         (slug, brand_id, category_id, name, description, images,
                          size_label, status, published_at)
                       values (%s, %s, %s, %s, %s, %s::jsonb, %s, 'published', now())
                       returning id""",
                    (
                        product_slug,
                        brand_id,
                        cat_id,
                        name,
                        desc,
                        json.dumps(images),
                        size_label,
                    ),
                )
                product_id = cur.fetchone()[0]
                stats["products_inserted"] += 1

            cur.execute(
                """insert into gb_product_offers
                     (product_id, retailer, url, price_cents, currency, in_stock,
                      is_affiliate, checked_at)
                   values (%s, %s, %s, %s, 'USD', %s, false, now())
                   on conflict (product_id, retailer, url) do update set
                     price_cents = excluded.price_cents,
                     in_stock = excluded.in_stock,
                     checked_at = now()""",
                (product_id, RETAILER, url, cents, in_stock),
            )
            stats["offers_upserted"] += 1

            # Default sellable variant carrying Shopify external refs + price.
            sku = (v0 or {}).get("sku") or None
            if sku == "":
                sku = None
            label = size_label or "Default"
            ext = {
                "shopify": {
                    "product_id": p.get("id"),
                    "variant_id": (v0 or {}).get("id"),
                    "handle": handle,
                },
                "source": RETAILER,
            }
            # Prefer update by product+default when sku is null/collision-prone.
            cur.execute(
                """select id from gb_product_variants
                   where product_id = %s and is_default = true
                   limit 1""",
                (product_id,),
            )
            vrow = cur.fetchone()
            if vrow:
                cur.execute(
                    """update gb_product_variants set
                         sku = coalesce(%s, sku),
                         label = %s,
                         price_cents = %s,
                         compare_at_cents = %s,
                         external_refs = external_refs || %s::jsonb,
                         status = case when %s then 'active' else 'sold_out' end,
                         updated_at = now()
                       where id = %s""",
                    (
                        sku,
                        label,
                        cents if cents is not None else 0,
                        compare,
                        json.dumps(ext),
                        in_stock,
                        vrow[0],
                    ),
                )
            else:
                # sku unique globally — skip sku on conflict risk
                try:
                    cur.execute(
                        """insert into gb_product_variants
                             (product_id, sku, label, price_cents, compare_at_cents,
                              currency, is_default, external_refs, status)
                           values (%s, %s, %s, %s, %s, 'USD', true, %s::jsonb, %s)""",
                        (
                            product_id,
                            sku,
                            label,
                            cents if cents is not None else 0,
                            compare,
                            json.dumps(ext),
                            "active" if in_stock else "sold_out",
                        ),
                    )
                except Exception:
                    conn.rollback()
                    # re-open transaction state after unique sku collision
                    cur = conn.cursor()
                    # re-fetch brand/product context already committed? we commit per product
                    # Actually we haven't committed yet - need careful handling.
                    # Use savepoint instead.
                    raise
            stats["variants_upserted"] += 1
            conn.commit()
        except Exception as e:
            conn.rollback()
            stats["errors"] += 1
            print(f"  ! {handle}: {e}", file=sys.stderr)

    cur.close()
    conn.close()
    return stats


def load_products_safe(products: list[dict]) -> dict:
    """Load with savepoints so a single product failure does not poison the batch."""
    import psycopg2

    conn = psycopg2.connect(dsn(), sslmode="require")
    cur = conn.cursor()
    stats = {
        "products_inserted": 0,
        "products_updated": 0,
        "offers_upserted": 0,
        "variants_upserted": 0,
        "brands_touched": 0,
        "errors": 0,
    }
    brand_cache: dict[str, str] = {}
    cat_cache: dict[str, str] = {}

    for idx, p in enumerate(products, 1):
        handle = (p.get("handle") or "").strip()
        title = (p.get("title") or "").strip()
        if not handle or not title:
            stats["errors"] += 1
            continue
        brand = clean_brand(p.get("vendor"), title)
        name = clean_name(title, brand)
        brand_slug = slugify(brand)
        product_slug = handle[:80]
        category = (p.get("product_type") or "").strip() or None
        desc = strip_html(p.get("body_html"))
        images = images_json(p)
        v0 = min_variant(p)
        cents = price_cents(v0)
        compare = compare_at_cents(v0)
        in_stock = any(bool(v.get("available")) for v in (p.get("variants") or []))
        url = product_url(handle)
        size_label = None
        if v0 and v0.get("title") and v0["title"] not in ("Default Title", "Default"):
            size_label = str(v0["title"])
        elif v0 and v0.get("option1") and v0["option1"] not in ("Default Title", "Default"):
            size_label = str(v0["option1"])

        try:
            cur.execute("savepoint sp_prod")
            if brand_slug not in brand_cache:
                cur.execute(
                    """insert into gb_brands (slug, name, country)
                       values (%s, %s, %s)
                       on conflict (slug) do update set
                         name = coalesce(nullif(excluded.name, ''), gb_brands.name),
                         updated_at = now()
                       returning id""",
                    (brand_slug, brand, "South Korea"),
                )
                brand_cache[brand_slug] = cur.fetchone()[0]
                stats["brands_touched"] += 1
            brand_id = brand_cache[brand_slug]

            cat_id = None
            if category:
                cslug = slugify(category)
                if cslug not in cat_cache:
                    cur.execute(
                        """insert into gb_categories (slug, name)
                           values (%s, %s)
                           on conflict (slug) do update set name = excluded.name
                           returning id""",
                        (cslug, category),
                    )
                    cat_cache[cslug] = cur.fetchone()[0]
                cat_id = cat_cache[cslug]

            cur.execute("select id from gb_products where slug = %s", (product_slug,))
            row = cur.fetchone()
            if row:
                product_id = row[0]
                cur.execute(
                    """update gb_products set
                         brand_id = %s,
                         category_id = coalesce(%s, category_id),
                         name = %s,
                         description = coalesce(nullif(%s, ''), description),
                         images = case
                           when images is null or images = '[]'::jsonb then %s::jsonb
                           else images
                         end,
                         size_label = coalesce(%s, size_label),
                         updated_at = now()
                       where id = %s""",
                    (
                        brand_id,
                        cat_id,
                        name,
                        desc,
                        json.dumps(images),
                        size_label,
                        product_id,
                    ),
                )
                stats["products_updated"] += 1
            else:
                cur.execute(
                    """insert into gb_products
                         (slug, brand_id, category_id, name, description, images,
                          size_label, status, published_at)
                       values (%s, %s, %s, %s, %s, %s::jsonb, %s, 'published', now())
                       returning id""",
                    (
                        product_slug,
                        brand_id,
                        cat_id,
                        name,
                        desc,
                        json.dumps(images),
                        size_label,
                    ),
                )
                product_id = cur.fetchone()[0]
                stats["products_inserted"] += 1

            cur.execute(
                """insert into gb_product_offers
                     (product_id, retailer, url, price_cents, currency, in_stock,
                      is_affiliate, checked_at)
                   values (%s, %s, %s, %s, 'USD', %s, false, now())
                   on conflict (product_id, retailer, url) do update set
                     price_cents = excluded.price_cents,
                     in_stock = excluded.in_stock,
                     checked_at = now()""",
                (product_id, RETAILER, url, cents, in_stock),
            )
            stats["offers_upserted"] += 1

            sku = (v0 or {}).get("sku") or None
            if sku == "":
                sku = None
            label = size_label or "Default"
            ext = {
                "shopify": {
                    "product_id": p.get("id"),
                    "variant_id": (v0 or {}).get("id"),
                    "handle": handle,
                },
                "source": RETAILER,
            }
            cur.execute(
                """select id from gb_product_variants
                   where product_id = %s and is_default = true
                   limit 1""",
                (product_id,),
            )
            vrow = cur.fetchone()
            status = "active" if in_stock else "sold_out"
            price = cents if cents is not None else 0
            if vrow:
                cur.execute(
                    """update gb_product_variants set
                         sku = coalesce(%s, sku),
                         label = %s,
                         price_cents = %s,
                         compare_at_cents = %s,
                         external_refs = coalesce(external_refs, '{}'::jsonb) || %s::jsonb,
                         status = %s,
                         updated_at = now()
                       where id = %s""",
                    (sku, label, price, compare, json.dumps(ext), status, vrow[0]),
                )
            else:
                # Avoid global sku uniqueness collisions across products.
                safe_sku = None
                if sku:
                    cur.execute(
                        "select 1 from gb_product_variants where sku = %s limit 1", (sku,)
                    )
                    if not cur.fetchone():
                        safe_sku = sku
                cur.execute(
                    """insert into gb_product_variants
                         (product_id, sku, label, price_cents, compare_at_cents,
                          currency, is_default, external_refs, status)
                       values (%s, %s, %s, %s, %s, 'USD', true, %s::jsonb, %s)""",
                    (product_id, safe_sku, label, price, compare, json.dumps(ext), status),
                )
            stats["variants_upserted"] += 1
            cur.execute("release savepoint sp_prod")
            if idx % 100 == 0:
                conn.commit()
                print(f"  committed {idx}/{len(products)}")
        except Exception as e:
            cur.execute("rollback to savepoint sp_prod")
            stats["errors"] += 1
            print(f"  ! [{idx}] {handle}: {e}", file=sys.stderr)

    conn.commit()
    cur.close()
    conn.close()
    return stats


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--out", help="write scraped products JSON")
    ap.add_argument("--from-json", help="load products from a prior scrape")
    ap.add_argument("--load", action="store_true", help="upsert into RDS")
    ap.add_argument("--delay", type=float, default=1.2, help="seconds between API pages")
    ap.add_argument("--limit", type=int, default=0, help="only process first N products (debug)")
    args = ap.parse_args()

    if args.from_json:
        products = json.loads(Path(args.from_json).read_text())
        print(f"loaded {len(products)} from {args.from_json}")
    else:
        products = scrape_all(delay=args.delay)
        print(f"scraped {len(products)} unique products")

    if args.limit and args.limit > 0:
        products = products[: args.limit]
        print(f"truncated to {len(products)}")

    if args.out:
        Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        Path(args.out).write_text(json.dumps(products, ensure_ascii=False, indent=2))
        print(f"wrote {args.out}")

    if args.load:
        stats = load_products_safe(products)
        print("load stats:", json.dumps(stats, indent=2))
    elif not args.out:
        ap.error("pass --out and/or --load (or --from-json --load)")


if __name__ == "__main__":
    main()
