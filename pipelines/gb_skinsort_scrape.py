"""SkinSort product scraper -> gb_* schema JSON (and optional RDS load).

Scrapes skinsort.com product pages into the product-JSON shape that
gb_inci_ingest.py consumes (brand/name/category/slug/description/inci/
key_ingredients/is_cruelty_free/is_vegan), plus every extra data point the
page exposes, mapped onto the gb_* schema:

  gb_products            name, description, images, rating_avg, rating_count,
                         badge_flags, is_cruelty_free, is_vegan, ingredients_raw
  gb_brands              name + country (JSON-LD brand.location)
  gb_categories          skinsort category ("Night Moisturizers", ...)
  gb_product_ingredients ordered INCI list + is_key_ingredient
  gb_ingredients         per-ingredient functions, comedogenicity/irritancy,
                         fungal-acne + pore-clogging flags, editorial blurb
  gb_ingredient_functions / _function_map   "Humectant", "Emollient", ...
  gb_effects / gb_product_effects           benefit ("Helps hydrate Dry Skin")
                         and concern ("May Worsen Oily Skin") chips with the
                         per-chip ingredient counts, via --deep also the
                         chip -> member-ingredient mapping (gb_ingredient_effects)
  gb_product_offers      "Where to buy" retailers, prices, decoded URLs

Page anatomy relied on (see parse_product):
  - JSON-LD Product block: name/brand/category/description/rating/dates/image
  - /attributes?attribute=X&contained=Y turbo-frame URLs: badge truth
    (contained=false => product is X-free)
  - button#ingredient-attribute-{attr}-{pid}: key-ingredient / benefit /
    concern chips (name, blurb, ingredient count); attr best_* = benefit,
    worst_* = concern, anything else = key-ingredient group
  - "Ingredient List" paragraph: ordered INCI anchors
  - quick-list rows (div[data-ingredient-id] inside a[href^=/ingredients/]):
    functions line, "com / irr" numbers, icon alts, fungal-acne level,
    pore-clogging flag
  - .ingredient-table-row: per-ingredient editorial description
  - /vendors subpage: retailer + price + affiliate-wrapped retailer URL

If a skinsort page has no ingredient list, the ordered INCI (plus functions,
irr/com ranges, and superstar/goodie/icky ratings) is pulled from
incidecoder.com via its search (see incidecoder_fallback).

Usage:
  python3 pipelines/gb_skinsort_scrape.py URL [URL ...] --out products.json
  python3 pipelines/gb_skinsort_scrape.py --urls-file urls.txt --out products.json
  python3 pipelines/gb_skinsort_scrape.py --urls-file urls.txt --load   # scrape + write to RDS
  python3 pipelines/gb_skinsort_scrape.py --from-json products.json --load  # re-load w/o scraping

--urls-file format: one product URL per line; a non-URL line ("Day
Moisturizers") sets the category override for the URLs that follow.
--deep (default on) fetches each chip's ingredient-attributes frame to map
chips to member ingredients; --no-deep / --no-vendors trim the extra requests.
Env for --load: DATABASE_URL (same convention as gb_inci_ingest.py).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone

from bs4 import BeautifulSoup

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")
BASE = "https://skinsort.com"
PRODUCT_PATH = re.compile(r"^/products/([^/]+)/([^/?#]+)$")

# skinsort attribute key -> gb badge_flags key (value = NOT contained)
ATTR_BADGE = {
    "paraben": "paraben_free", "sulfate": "sulfate_free",
    "silicone": "silicone_free", "alcohol": "alcohol_free",
    "fragrance": "fragrance_free", "oil": "oil_free",
    "fungal": "fungal_acne_safe", "reef": "reef_safe",
    "allergen": "eu_allergen_free",
}


def fetch(url: str, delay: float, retries: int = 3) -> str | None:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html"})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                html = r.read().decode("utf-8", "replace")
            time.sleep(delay)
            return html
        except urllib.error.HTTPError as e:
            if e.code in (403, 429, 503) and attempt < retries - 1:
                time.sleep(delay * (attempt + 2) * 3)
                continue
            print(f"  ! {url}: HTTP {e.code}", file=sys.stderr)
            return None
        except Exception as e:  # DNS, timeout, ...
            if attempt < retries - 1:
                time.sleep(delay * (attempt + 2))
                continue
            print(f"  ! {url}: {e}", file=sys.stderr)
            return None


def jsonld_product(soup: BeautifulSoup) -> dict:
    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.string or "")
        except (json.JSONDecodeError, TypeError):
            continue
        for obj in data if isinstance(data, list) else [data]:
            if isinstance(obj, dict) and obj.get("@type") == "Product":
                return obj
    return {}


def parse_badges(html: str) -> tuple[dict, bool | None, bool | None]:
    """badge_flags + is_cruelty_free/is_vegan from /attributes?...&contained= URLs."""
    badges: dict[str, bool] = {}
    cruelty = vegan = None
    for m in re.finditer(r"/attributes\?attribute=(\w+)&(?:amp;)?contained=(true|false)", html):
        attr, contained = m.group(1), m.group(2) == "true"
        if attr == "cruelty":
            cruelty = not contained          # contained=true => NOT cruelty-free
        elif attr == "vegan":
            vegan = not contained
        elif attr in ATTR_BADGE:
            badges[ATTR_BADGE[attr]] = not contained
    return badges, cruelty, vegan


def parse_chips(soup: BeautifulSoup) -> dict[str, dict]:
    """ingredient-attribute chips keyed by attr: key-ingredient groups + effects."""
    chips: dict[str, dict] = {}
    for btn in soup.select('button[id^="ingredient-attribute-"]'):
        m = re.match(r"ingredient-attribute-([a-z0-9_]+)-\d+$", btn.get("id", ""))
        if not m:
            continue
        attr = m.group(1)
        spans = [s.get_text(" ", strip=True) for s in btn.find_all("span")]
        spans = [s for s in spans if s]
        if not spans:
            continue
        count = None
        if spans[-1].isdigit():
            count = int(spans[-1])
            spans = spans[:-1]
        chips.setdefault(attr, {
            "attr": attr,
            "name": spans[0] if spans else attr,
            "description": spans[1] if len(spans) > 1 else None,
            "ingredient_count": count,
        })
    return chips


def parse_inci(soup: BeautifulSoup) -> tuple[str | None, list[dict]]:
    """Ordered INCI string + [{name, slug, skinsort_id}].

    The full ingredient-list block has no stable heading; the reliable marker
    is the <p> holding one ingredient anchor per INCI entry — take the
    densest one.
    """
    paras = soup.find_all("p")
    para = max(paras, key=lambda p: len(p.find_all("a", attrs={"data-ingredient-id": True})),
               default=None)
    if para is None or len(para.find_all("a", attrs={"data-ingredient-id": True})) < 3:
        return None, []
    ordered = []
    for a in para.find_all("a", attrs={"data-ingredient-id": True}):
        name = a.get_text(" ", strip=True)
        # OTC/SPF actives carry a declared strength ("Zinc Oxide 12%")
        pm = re.search(r"\s+([\d.]+\s*%)$", name)
        ordered.append({
            "name": name[:pm.start()] if pm else name,
            "concentration": pm.group(1).replace(" ", "") if pm else None,
            "slug": (a.get("href") or "").rsplit("/", 1)[-1] or None,
            "skinsort_id": a.get("data-ingredient-id"),
        })
    # The paragraph text interleaves "Active/Inactive Ingredients:" labels on
    # SPF products, so the parseable INCI comes from the anchors.
    inci = ", ".join(i["name"] for i in ordered)
    return inci or None, ordered


def parse_quick_rows(soup: BeautifulSoup) -> dict[str, dict]:
    """Per-ingredient metrics from the quick list: functions, com/irr, icons, flags."""
    rows: dict[str, dict] = {}
    for row in soup.select('a[href^="/ingredients/"] div[data-ingredient-id]'):
        name_el = row.find(attrs={"data-ingredient-name-for": True})
        if not name_el:
            continue
        name = name_el.get_text(" ", strip=True)
        fn_el = name_el.find_next_sibling("span")
        functions = []
        if fn_el:
            functions = [f.strip() for f in fn_el.get_text(" ", strip=True).split(",") if f.strip()]
        com = irr = None
        # the metrics live in their own span ("0 / 3"); matching the row text
        # would pick digits out of names like "PEG/PPG-18/18 Dimethicone"
        for sp in row.find_all("span"):
            m = re.fullmatch(r"(\d)\s*/\s*(\d)", sp.get_text(" ", strip=True))
            if m:
                com, irr = int(m.group(1)), int(m.group(2))
                break
        icons = [img["alt"].removesuffix(" Icon") for img in row.find_all("img") if img.get("alt")]
        fa = (row.get("data-fungal-acne-trigger-level") or "").strip() or None
        rows.setdefault(name.lower(), {
            "functions": functions,
            "comedogenicity": com,
            "irritancy": irr,
            "effect_icons": icons,
            "fungal_acne_trigger_level": fa,
            "pore_clogging": row.get("data-pore-clogging-highlightable") == "true",
        })
    return rows


def parse_deep_rows(soup: BeautifulSoup) -> dict[str, str]:
    """Editorial ingredient descriptions from the what-it-does deep-dive rows."""
    out: dict[str, str] = {}
    for row in soup.select("div.ingredient-table-row"):
        a = row.find("a", attrs={"data-ingredient-id": True})
        prose = row.find("div", class_=re.compile(r"ingredient-description"))
        if not (a and prose):
            continue
        paras = [p.get_text(" ", strip=True) for p in prose.find_all("p")]
        text = " ".join(p for p in paras if p and p != "What it does:")
        text = re.sub(r"\s+", " ", text).strip()
        if text:
            out.setdefault(a.get_text(" ", strip=True).lower(), text)
    return out


def fetch_chip_members(page_path: str, attrs: list[str], delay: float) -> dict[str, list[str]]:
    """--deep: chip attr -> member ingredient names via the ingredient-attributes frames."""
    members: dict[str, list[str]] = {}
    for attr in attrs:
        html = fetch(f"{BASE}{page_path}/ingredient-attributes?attribute={urllib.parse.quote(attr)}", delay)
        if not html:
            continue
        frame = BeautifulSoup(html, "lxml")
        names = []
        for a in frame.select('a[href^="/ingredients/"]'):
            n = a.get_text(" ", strip=True)
            if n and n not in names and not n.startswith("Learn more"):
                names.append(n)
        members[attr] = names
    return members


def incidecoder_fallback(brand: str, name: str, delay: float) -> tuple[str | None, list[dict]]:
    """When skinsort has no INCI, pull the ordered list from incidecoder.com.

    Search -> first product hit -> #ingredlist-short anchors for order, details
    table for functions / "irr , com" (that order — reverse of skinsort) /
    ID-Rating (superstar/goodie/icky -> gb_ingredients.rating).
    """
    q = urllib.parse.quote_plus(f"{brand} {name}")
    html = fetch(f"https://incidecoder.com/search?query={q}", delay)
    if not html:
        return None, []
    hit = next((m for m in re.findall(r'href="(/products/[^"#?]+)"', html)
                if m != "/products/create"), None)
    if not hit:
        return None, []
    html = fetch(f"https://incidecoder.com{hit}", delay)
    if not html:
        return None, []
    soup = BeautifulSoup(html, "lxml")
    short = soup.select_one("#ingredlist-short") or soup

    def clean(s: str) -> str:
        return re.sub(r"\s+", " ", s.replace("\u200b", "")).strip()

    details: dict[str, dict] = {}
    for tr in soup.find_all("tr"):
        cells = [clean(td.get_text(" ", strip=True)) for td in tr.find_all("td")]
        if len(cells) < 2:
            continue
        d = {"functions": [f.strip() for f in cells[1].split(",") if f.strip()]}
        if len(cells) > 2 and cells[2]:
            parts = [p.strip() for p in cells[2].split(",")]  # "irr , com", each "n" or "n-m"
            if parts and re.search(r"\d", parts[0]):
                lo, *hi = re.findall(r"\d+", parts[0])
                d["irritancy"], d["irritancy_max"] = int(lo), int((hi or [lo])[0])
            if len(parts) > 1 and re.search(r"\d", parts[1]):
                lo, *hi = re.findall(r"\d+", parts[1])
                d["comedogenicity"], d["comedogenicity_max"] = int(lo), int((hi or [lo])[0])
        if len(cells) > 3 and cells[3].lower() in ("superstar", "goodie", "icky"):
            d["rating"] = cells[3].lower()
        details.setdefault(clean(cells[0]).lower(), d)

    ordered = []
    for a in short.select('a[href^="/ingredients/"]'):
        n = clean(a.get_text(" ", strip=True))
        if not n:
            continue
        ordered.append({
            "name": n,
            "slug": (a.get("href") or "").rsplit("/", 1)[-1] or None,
            **details.get(n.lower(), {}),
            "source": "incidecoder",
        })
    return (", ".join(i["name"] for i in ordered) or None), ordered


def parse_vendors(html: str) -> list[dict]:
    offers, seen = [], set()
    soup = BeautifulSoup(html, "lxml")
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "viglink.com" not in href and "amazon." not in href and "amzn.to" not in href:
            continue
        text = re.sub(r"\s+", " ", a.get_text(" ", strip=True))
        pm = re.search(r"\$\s*([\d,]+(?:\.\d{1,2})?)", text)
        retailer = re.sub(r"\$.*$", "", text).strip() or "Amazon"
        # price-less rows render as "Amazon Search on Amazon" / "iHerb Check latest price"
        sm = re.search(r"Search on (\w+)", retailer)
        if sm:
            retailer = sm.group(1)
        retailer = re.sub(r"\s+Check latest price$", "", retailer)
        url = href
        if "viglink.com" in href:  # unwrap the affiliate redirect
            q = urllib.parse.parse_qs(urllib.parse.urlparse(href).query)
            url = q.get("u", [href])[0]
        key = (retailer, url)
        if key in seen:
            continue
        seen.add(key)
        offers.append({
            "retailer": retailer,
            "url": url,
            "price": float(pm.group(1).replace(",", "")) if pm else None,
            "currency": "USD",
            "is_affiliate": "viglink.com" in href or "tag=" in href,
        })
    return offers


def scrape_product(url: str, delay: float, deep: bool, vendors: bool,
                   category_override: str | None) -> dict | None:
    path = urllib.parse.urlparse(url).path
    m = PRODUCT_PATH.match(path)
    if not m:
        print(f"  skip (not a product URL): {url}", file=sys.stderr)
        return None
    brand_slug, product_slug = m.groups()
    html = fetch(url, delay)
    if not html:
        return None
    soup = BeautifulSoup(html, "lxml")

    ld = jsonld_product(soup)
    agg = ld.get("aggregateRating") or {}
    brand = ld.get("brand") or {}
    badge_flags, cruelty, vegan = parse_badges(html)
    chips = parse_chips(soup)
    inci_raw, inci_ordered = parse_inci(soup)
    inci_source = "skinsort"
    if not inci_ordered:
        brand_name = (ld.get("brand") or {}).get("name") or brand_slug.replace("-", " ")
        prod_name = ld.get("name") or product_slug.replace("-", " ")
        inci_raw, inci_ordered = incidecoder_fallback(brand_name, prod_name, delay)
        if inci_ordered:
            inci_source = "incidecoder"
            print(f"  ~ INCI from incidecoder fallback ({len(inci_ordered)} ingredients)")
    quick = parse_quick_rows(soup)
    deep_desc = parse_deep_rows(soup)

    benefits = [c for a, c in chips.items() if a.startswith("best_")]
    concerns = [c for a, c in chips.items() if a.startswith("worst_")]
    key_groups = [c for a, c in chips.items() if not a.startswith(("best_", "worst_"))]

    if deep and chips:
        members = fetch_chip_members(path, list(chips), delay)
        for c in benefits + concerns + key_groups:
            c["ingredients"] = members.get(c["attr"], [])

    key_names: list[str] = []
    for g in key_groups:
        for n in g.get("ingredients", []):
            if n.lower() not in {k.lower() for k in key_names}:
                key_names.append(n)

    ingredients = []
    for pos, ing in enumerate(inci_ordered, 1):
        q = quick.get(ing["name"].lower(), {})
        ingredients.append({
            "position": pos, **ing, **q,
            "description": deep_desc.get(ing["name"].lower()),
        })

    offers = []
    if vendors:
        vhtml = fetch(f"{BASE}{path}/vendors", delay)
        if vhtml:
            offers = parse_vendors(vhtml)

    images = []
    for i, u in enumerate(dict.fromkeys(filter(None, [
            ld.get("image"),
            (soup.find("meta", property="og:image") or {}).get("content")]))):
        if u.startswith("/"):  # some pages emit site-relative active_storage paths
            u = BASE + u
        images.append({"url": u, "alt": ld.get("name"), "position": i})

    name = ld.get("name") or soup.find("h1").get_text(" ", strip=True)
    product = {
        # gb_inci_ingest.py-compatible core
        "brand": brand.get("name") or brand_slug.replace("-", " ").title(),
        "name": name,
        "slug": f"{brand_slug}-{product_slug}"[:80],
        "category": category_override or ld.get("category"),
        "description": ld.get("description"),
        "inci": inci_raw,
        "key_ingredients": key_names,
        "is_cruelty_free": cruelty,
        "is_vegan": vegan,
        # gb_* extras
        "brand_country": ((brand.get("location") or {}).get("name")),
        "images": images,
        "rating_avg": float(agg["ratingValue"]) if agg.get("ratingValue") else None,
        "rating_count": int(agg["reviewCount"]) if agg.get("reviewCount") else None,
        "badge_flags": badge_flags,
        "key_ingredient_groups": key_groups,
        "benefits": benefits,
        "concerns": concerns,
        "ingredients": ingredients,
        "offers": offers,
        "source": {
            "url": url,
            "site": "skinsort",
            "inci_from": inci_source,
            "date_published": ld.get("datePublished"),
            "date_modified": ld.get("dateModified"),
            "scraped_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        },
    }
    n_metrics = sum(1 for i in ingredients if i.get("comedogenicity") is not None)
    print(f"  ok {product['brand']} / {name}: {len(ingredients)} ingredients "
          f"({n_metrics} with com/irr), {len(benefits)}+{len(concerns)} effect chips, "
          f"{len(key_names)} key ingredients, {len(offers)} offers")
    return product


# ── optional RDS load (on top of gb_inci_ingest) ─────────────────────────────

def load_extras(cur, base, p: dict, product_id: str) -> None:
    """Write the fields gb_inci_ingest doesn't cover onto the gb_* tables."""
    cur.execute(
        """update gb_products set images=%s, rating_avg=%s, rating_count=coalesce(%s, rating_count),
             badge_flags=badge_flags || %s, updated_at=now() where id=%s""",
        (json.dumps(p["images"]), p.get("rating_avg"), p.get("rating_count"),
         json.dumps(p.get("badge_flags") or {}), product_id))
    if p.get("brand_country"):
        cur.execute("update gb_brands set country=coalesce(country,%s) where slug=%s",
                    (p["brand_country"], base.slugify(p["brand"])))

    def ing_id(name: str) -> str | None:
        for cand in base.alias_candidates(name):
            cur.execute("select ingredient_id from gb_ingredient_aliases where alias=%s", (cand,))
            row = cur.fetchone()
            if row:
                return row[0]
        return None

    for ing in p.get("ingredients", []):
        iid = ing_id(ing["name"])
        if not iid:
            continue
        cur.execute(
            """update gb_ingredients set
                 comedogenicity_min=coalesce(comedogenicity_min,%(com)s),
                 comedogenicity_max=coalesce(comedogenicity_max,%(com_max)s),
                 irritancy_min=coalesce(irritancy_min,%(irr)s),
                 irritancy_max=coalesce(irritancy_max,%(irr_max)s),
                 rating=coalesce(rating,%(rating)s),
                 description=coalesce(description,%(desc)s),
                 is_fungal_acne_trigger=is_fungal_acne_trigger or %(fa)s,
                 updated_at=now()
               where id=%(id)s""",
            {"com": ing.get("comedogenicity"),
             "com_max": ing.get("comedogenicity_max", ing.get("comedogenicity")),
             "irr": ing.get("irritancy"),
             "irr_max": ing.get("irritancy_max", ing.get("irritancy")),
             "rating": ing.get("rating") if ing.get("rating") in
                       ("superstar", "goodie", "neutral", "icky") else None,
             "desc": ing.get("description"),
             "fa": bool(ing.get("fungal_acne_trigger_level")), "id": iid})
        if ing.get("concentration"):
            cur.execute(
                "update gb_product_ingredients set note=%s where product_id=%s and ingredient_id=%s",
                (ing["concentration"] + " declared", product_id, iid))
        for fn in ing.get("functions", []):
            cur.execute(
                "insert into gb_ingredient_functions (slug, name) values (%s,%s) "
                "on conflict (slug) do update set name=excluded.name returning id",
                (base.slugify(fn), fn))
            cur.execute(
                "insert into gb_ingredient_function_map (ingredient_id, function_id) "
                "values (%s,%s) on conflict do nothing", (iid, cur.fetchone()[0]))

    for kind, chips in (("benefit", p.get("benefits", [])), ("concern", p.get("concerns", []))):
        for c in chips:
            cur.execute(
                """insert into gb_effects (kind, slug, name, description) values (%s,%s,%s,%s)
                   on conflict (slug) do update set name=excluded.name,
                     description=coalesce(excluded.description, gb_effects.description)
                   returning id""",
                (kind, c["attr"].replace("_", "-"), c["name"], c.get("description")))
            eff_id = cur.fetchone()[0]
            for n in c.get("ingredients", []):
                iid = ing_id(n)
                if iid:
                    cur.execute(
                        "insert into gb_ingredient_effects (ingredient_id, effect_id) "
                        "values (%s,%s) on conflict do nothing", (iid, eff_id))
            cur.execute(
                """insert into gb_product_effects (product_id, effect_id, ingredient_count, score)
                   values (%s,%s,%s,%s)
                   on conflict (product_id, effect_id) do update set
                     ingredient_count=excluded.ingredient_count, score=excluded.score,
                     computed_at=now()""",
                (product_id, eff_id, c.get("ingredient_count") or 0,
                 float(c.get("ingredient_count") or 0)))

    for o in p.get("offers", []):
        cur.execute(
            """insert into gb_product_offers (product_id, retailer, url, price_cents,
                                              currency, is_affiliate, checked_at)
               values (%s,%s,%s,%s,%s,%s,now())
               on conflict (product_id, retailer, url) do update set
                 price_cents=excluded.price_cents, checked_at=now()""",
            (product_id, o["retailer"], o["url"],
             round(o["price"] * 100) if o.get("price") else None,
             o.get("currency", "USD"), o.get("is_affiliate", False)))


def load_products(products: list[dict]) -> None:
    import os

    import psycopg2

    import gb_inci_ingest as base
    dsn = os.environ["DATABASE_URL"].replace("postgresql+asyncpg://", "postgresql://").split("?")[0]
    conn = psycopg2.connect(dsn + "?sslmode=require")
    cur = conn.cursor()
    for p in products:
        if not p.get("inci"):
            print(f"  ! no INCI for {p['slug']}; skipping load", file=sys.stderr)
            continue
        product_id = base.ingest(cur, p)
        load_extras(cur, base, p, product_id)
        conn.commit()
    conn.close()


def read_urls_file(path: str) -> list[tuple[str, str | None]]:
    """(url, category_override) pairs; bare text lines set the category."""
    out, category = [], None
    for line in open(path):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("http"):
            out.append((line, category))
        else:
            category = line
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("urls", nargs="*", help="skinsort product URLs")
    ap.add_argument("--urls-file", help="file of URLs; bare lines set the category")
    ap.add_argument("--out", help="write scraped products JSON here")
    ap.add_argument("--delay", type=float, default=1.0, help="seconds between requests")
    ap.add_argument("--no-deep", dest="deep", action="store_false",
                    help="skip chip->ingredient membership frames")
    ap.add_argument("--no-vendors", dest="vendors", action="store_false",
                    help="skip the where-to-buy page")
    ap.add_argument("--load", action="store_true", help="also ingest into RDS (DATABASE_URL)")
    ap.add_argument("--from-json", help="load a previously scraped JSON file instead of scraping")
    args = ap.parse_args()

    if args.from_json:
        products = json.load(open(args.from_json))
    else:
        targets = [(u, None) for u in args.urls]
        if args.urls_file:
            targets += read_urls_file(args.urls_file)
        if not targets:
            ap.error("no URLs: pass them as args or via --urls-file")
        products = []
        for url, category in targets:
            print(f"scraping {url}")
            p = scrape_product(url, args.delay, args.deep, args.vendors, category)
            if p:
                products.append(p)

    if args.out:
        with open(args.out, "w") as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        print(f"wrote {len(products)} products -> {args.out}")
    if args.load:
        load_products(products)
    if not args.out and not args.load:
        json.dump(products, sys.stdout, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
