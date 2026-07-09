"""goBeauty read-only products API (mounted into the 8443 shim).

Vercel (www.gobeauty.ai) cannot reach the VPC-private RDS, and 8443 is the
only csong-controlled port the security group exposes — so the product/compare
pages fetch through here. Read-only; its own small pool; import is guarded in
the shim so a failure here can never take down the Twilio inbound path.
"""
from __future__ import annotations

import os

import asyncpg
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/gb")

_pool: asyncpg.Pool | None = None


async def _db() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        dsn = os.environ["DATABASE_URL"].replace("postgresql+asyncpg://", "postgresql://").split("?")[0]
        _pool = await asyncpg.create_pool(dsn=dsn, ssl="require", min_size=0, max_size=3)
    return _pool


def _j(row, key):
    import json
    v = row[key]
    return json.loads(v) if isinstance(v, str) else (v or {})


_BADGE_KEYS = {
    "paraben_free", "sulfate_free", "silicone_free", "alcohol_free",
    "fragrance_free", "essential_oil_free", "oil_free", "fungal_acne_safe",
    "reef_safe", "eu_allergen_free",
}


@router.get("/products")
async def list_products(
    q: str = "",
    badge: str = "",
    category: str = "",
    brand: str = "",
    sort: str = "",
    limit: int = Query(24, le=60),
    offset: int = 0,
):
    pool = await _db()
    where = "p.status <> 'discontinued'"
    args: list = []
    if q.strip():
        args.append(f"%{q.strip().lower()}%")
        where += f" and (lower(p.name) like ${len(args)} or lower(b.name) like ${len(args)})"
    for key in badge.split(","):
        key = key.strip()
        if key in _BADGE_KEYS:  # whitelist — badge names go into the jsonb literal
            where += f" and p.badge_flags @> '{{\"{key}\": true}}'::jsonb"
    if category.strip():
        args.append(category.strip())
        where += f" and c.slug = ${len(args)}"
    if brand.strip():
        args.append(brand.strip())
        where += f" and b.slug = ${len(args)}"
    rows = await pool.fetch(
        f"""select p.slug, p.name, p.badge_flags, p.rating_avg, p.rating_count,
                   p.images, b.name as brand, b.slug as brand_slug, c.name as category
            from gb_products p
            join gb_brands b on b.id = p.brand_id
            left join gb_categories c on c.id = p.category_id
            where {where}
            order by {"(coalesce(p.rating_avg, 0) * p.rating_count + 4.0 * 10) / (p.rating_count + 10) desc, p.rating_count desc" if sort == "top" else "p.rating_count desc, p.created_at desc"}
            limit {int(limit)} offset {int(offset)}""",
        *args,
    )
    return {"products": [
        {"slug": r["slug"], "name": r["name"], "brand": r["brand"], "brandSlug": r["brand_slug"],
         "category": r["category"], "badges": _j(r, "badge_flags"),
         "ratingAvg": float(r["rating_avg"]) if r["rating_avg"] is not None else None,
         "ratingCount": r["rating_count"], "images": _j(r, "images") or []}
        for r in rows
    ]}


async def _product_detail(pool: asyncpg.Pool, slug: str) -> dict:
    p = await pool.fetchrow(
        """select p.*, b.name as brand, b.slug as brand_slug, b.country as brand_country, c.name as category
           from gb_products p
           join gb_brands b on b.id = p.brand_id
           left join gb_categories c on c.id = p.category_id
           where p.slug = $1""", slug)
    if not p:
        raise HTTPException(404, f"product {slug} not found")
    ings = await pool.fetch(
        """select pi.position, pi.is_key_ingredient, i.slug, i.inci_name, i.display_name,
                  i.rating, i.irritancy_min, i.irritancy_max,
                  i.comedogenicity_min, i.comedogenicity_max,
                  i.is_eu_fragrance_allergen, i.is_fungal_acne_trigger,
                  coalesce(array_agg(f.name order by f.name) filter (where f.name is not null), '{}') as functions
           from gb_product_ingredients pi
           join gb_ingredients i on i.id = pi.ingredient_id
           left join gb_ingredient_function_map m on m.ingredient_id = i.id
           left join gb_ingredient_functions f on f.id = m.function_id
           where pi.product_id = $1
           group by pi.position, pi.is_key_ingredient, i.slug, i.inci_name, i.display_name,
                    i.rating, i.irritancy_min, i.irritancy_max, i.comedogenicity_min,
                    i.comedogenicity_max, i.is_eu_fragrance_allergen, i.is_fungal_acne_trigger
           order by pi.position""", p["id"])
    effects = await pool.fetch(
        """select e.kind, e.slug, e.name, e.description, pe.ingredient_count, pe.score
           from gb_product_effects pe join gb_effects e on e.id = pe.effect_id
           where pe.product_id = $1 order by pe.score desc""", p["id"])
    variants = await pool.fetch(
        """select label, price_cents, currency, compare_at_cents, stock_qty, is_default
           from gb_product_variants where product_id = $1 and status = 'active'
           order by is_default desc, price_cents""", p["id"])
    offers = await pool.fetch(
        """select retailer, url, price_cents, currency, in_stock
           from gb_product_offers where product_id = $1 order by price_cents nulls last""", p["id"])
    dupes = await pool.fetch(
        """select d.shared_ingredients, d.similarity,
                  q.slug, q.name, q.badge_flags, q.images, b.name as brand, b.slug as brand_slug
           from gb_product_dupes d
           join gb_products q
             on q.id = case when d.product_id = $1 then d.dupe_product_id else d.product_id end
           join gb_brands b on b.id = q.brand_id
           where (d.product_id = $1 or d.dupe_product_id = $1)
             and q.status <> 'discontinued'
           order by d.similarity desc limit 8""", p["id"])
    counts = {"superstar": 0, "goodie": 0, "neutral": 0, "icky": 0, "unknown": 0}
    for r in ings:
        counts[r["rating"] or "unknown"] += 1
    return {
        "slug": p["slug"], "name": p["name"], "brand": p["brand"], "brandSlug": p["brand_slug"],
        "brandCountry": p["brand_country"],
        "category": p["category"], "description": p["description"],
        "sizeLabel": p["size_label"], "badges": _j(p, "badge_flags"),
        "images": _j(p, "images") or [],
        "isCrueltyFree": p["is_cruelty_free"], "isVegan": p["is_vegan"],
        "ratingAvg": float(p["rating_avg"]) if p["rating_avg"] is not None else None,
        "ratingCount": p["rating_count"],
        "ratingCounts": counts,
        "ingredients": [
            {"position": r["position"], "slug": r["slug"], "inciName": r["inci_name"],
             "displayName": r["display_name"], "rating": r["rating"],
             "irritancy": [r["irritancy_min"], r["irritancy_max"]] if r["irritancy_min"] is not None else None,
             "comedogenicity": [r["comedogenicity_min"], r["comedogenicity_max"]] if r["comedogenicity_min"] is not None else None,
             "isKey": r["is_key_ingredient"], "functions": list(r["functions"]),
             "euAllergen": r["is_eu_fragrance_allergen"], "faTrigger": r["is_fungal_acne_trigger"]}
            for r in ings
        ],
        "effects": {
            "benefits": [
                {"slug": r["slug"], "name": r["name"], "description": r["description"],
                 "count": r["ingredient_count"], "score": r["score"]}
                for r in effects if r["kind"] == "benefit"],
            "concerns": [
                {"slug": r["slug"], "name": r["name"], "description": r["description"],
                 "count": r["ingredient_count"], "score": r["score"]}
                for r in effects if r["kind"] == "concern"],
        },
        "variants": [dict(v) for v in variants],
        "offers": [dict(o) for o in offers],
        "dupes": [
            {"slug": r["slug"], "name": r["name"], "brand": r["brand"],
             "brandSlug": r["brand_slug"], "badges": _j(r, "badge_flags"),
             "images": _j(r, "images") or [],
             "sharedIngredients": r["shared_ingredients"], "similarity": r["similarity"]}
            for r in dupes
        ],
    }


@router.get("/products/{slug}")
async def product_detail(slug: str):
    return await _product_detail(await _db(), slug)


def _card(r) -> dict:
    return {"slug": r["slug"], "name": r["name"], "brand": r["brand"], "brandSlug": r["brand_slug"],
            "category": r["category"], "badges": _j(r, "badge_flags"),
            "ratingAvg": float(r["rating_avg"]) if r["rating_avg"] is not None else None,
            "ratingCount": r["rating_count"], "images": _j(r, "images") or []}


_CAT_ROLLUP = """
    with recursive tree as (
      select id, slug from gb_categories where slug = $1
      union all
      select c.id, c.slug from gb_categories c join tree t on c.parent_id = t.id
    )
"""


async def _category_counts(pool: asyncpg.Pool) -> dict[str, int]:
    """category id -> product count rolled up through descendants."""
    rows = await pool.fetch(
        """with recursive anc as (
             select c.id, c.id as top from gb_categories c
             union all
             select a.id, c.parent_id as top
             from anc a join gb_categories c on c.id = a.top
             where c.parent_id is not null
           )
           select a.top::text as id, count(p.id) as n
           from anc a join gb_products p on p.category_id = a.id
           where p.status <> 'discontinued'
           group by a.top""")
    return {r["id"]: r["n"] for r in rows}


@router.get("/categories")
async def list_categories():
    pool = await _db()
    counts = await _category_counts(pool)
    rows = await pool.fetch(
        """select id::text, slug, name, description, position, parent_id::text
           from gb_categories order by position, name""")
    by_id = {r["id"]: {"slug": r["slug"], "name": r["name"], "description": r["description"],
                       "productCount": counts.get(r["id"], 0), "children": []}
             for r in rows}
    roots = []
    for r in rows:
        node = by_id[r["id"]]
        if r["parent_id"] and r["parent_id"] in by_id:
            by_id[r["parent_id"]]["children"].append(node)
        else:
            roots.append(node)
    return {"categories": roots}


@router.get("/categories/{slug}")
async def category_detail(slug: str, limit: int = Query(48, le=100)):
    pool = await _db()
    c = await pool.fetchrow(
        "select id, id::text as id_text, slug, name, description, parent_id from gb_categories where slug = $1",
        slug)
    if not c:
        raise HTTPException(404, f"category {slug} not found")
    counts = await _category_counts(pool)

    breadcrumb, pid = [], c["parent_id"]
    for _ in range(4):
        if not pid:
            break
        p = await pool.fetchrow(
            "select slug, name, parent_id from gb_categories where id = $1", pid)
        if not p:
            break
        breadcrumb.insert(0, {"slug": p["slug"], "name": p["name"]})
        pid = p["parent_id"]

    def cat_node(r):
        return {"slug": r["slug"], "name": r["name"],
                "productCount": counts.get(r["id"], 0)}

    children = [cat_node(r) for r in await pool.fetch(
        "select id::text, slug, name from gb_categories where parent_id = $1 order by position, name",
        c["id"])]
    siblings = []
    if c["parent_id"]:
        siblings = [cat_node(r) for r in await pool.fetch(
            """select id::text, slug, name from gb_categories
               where parent_id = $1 and id <> $2 order by position, name""",
            c["parent_id"], c["id"])]

    prows = await pool.fetch(
        _CAT_ROLLUP + f"""
        select p.slug, p.name, p.description, p.badge_flags, p.rating_avg, p.rating_count,
               p.images, p.is_cruelty_free, p.is_vegan,
               b.name as brand, b.slug as brand_slug, b.country as brand_country,
               c2.name as category,
               (select count(*) from gb_product_ingredients pi where pi.product_id = p.id) as ingredient_count,
               (select min(o.price_cents) from gb_product_offers o
                 where o.product_id = p.id and o.price_cents is not null) as price_cents
        from gb_products p
        join gb_categories c2 on c2.id = p.category_id and c2.id in (select id from tree)
        join gb_brands b on b.id = p.brand_id
        where p.status <> 'discontinued'
        order by coalesce(p.rating_avg, 0) * ln(1 + p.rating_count) desc, p.rating_count desc
        limit {int(limit)}""",
        slug)
    products = [
        {**_card(r), "description": r["description"], "brandCountry": r["brand_country"],
         "ingredientCount": r["ingredient_count"],
         "priceCents": r["price_cents"],
         "isCrueltyFree": r["is_cruelty_free"], "isVegan": r["is_vegan"]}
        for r in prows
    ]

    def _pick(key, best):
        vals = [p for p in products if p.get(key) is not None]
        return best(vals, key=lambda p: p[key]) if vals else None

    def _ref(p):
        return {"slug": p["slug"], "name": p["name"], "brand": p["brand"]} if p else None

    rated = [p for p in products if p["ratingAvg"] is not None and p["ratingCount"] >= 3]
    faq = {
        "topRated": _ref(max(rated, key=lambda p: p["ratingAvg"]) if rated else None),
        "mostPopular": _ref(_pick("ratingCount", max)),
        "fewestIngredients": _ref(_pick("ingredientCount", min)),
        "mostAffordable": _ref(_pick("priceCents", min)),
        "mostAffordablePriceCents": (_pick("priceCents", min) or {}).get("priceCents"),
    }
    return {
        "slug": c["slug"], "name": c["name"], "description": c["description"],
        "productCount": counts.get(c["id_text"], 0),
        "breadcrumb": breadcrumb, "children": children, "siblings": siblings,
        "products": products, "faq": faq,
    }


@router.get("/ingredients")
async def list_ingredients(q: str = "", limit: int = Query(60, le=200), offset: int = 0):
    pool = await _db()
    where, args = "true", []
    if q.strip():
        args.append(f"%{q.strip().lower()}%")
        where = ("(lower(i.inci_name) like $1 or lower(i.display_name) like $1"
                 " or exists (select 1 from gb_ingredient_aliases a"
                 "            where a.ingredient_id = i.id and a.alias like $1))")
    rows = await pool.fetch(
        f"""select i.slug, i.inci_name, i.display_name, i.rating,
                   i.irritancy_min, i.irritancy_max, i.comedogenicity_min, i.comedogenicity_max,
                   coalesce(array_agg(distinct f.name) filter (where f.name is not null), '{{}}') as functions,
                   count(distinct pi.product_id) as product_count
            from gb_ingredients i
            left join gb_ingredient_function_map m on m.ingredient_id = i.id
            left join gb_ingredient_functions f on f.id = m.function_id
            left join gb_product_ingredients pi on pi.ingredient_id = i.id
            where {where}
            group by i.id
            order by (i.rating = 'superstar') desc, product_count desc, i.inci_name
            limit {int(limit)} offset {int(offset)}""",
        *args,
    )
    return {"ingredients": [
        {"slug": r["slug"], "inciName": r["inci_name"], "displayName": r["display_name"],
         "rating": r["rating"],
         "irritancy": [r["irritancy_min"], r["irritancy_max"]] if r["irritancy_min"] is not None else None,
         "comedogenicity": [r["comedogenicity_min"], r["comedogenicity_max"]] if r["comedogenicity_min"] is not None else None,
         "functions": list(r["functions"]), "productCount": r["product_count"]}
        for r in rows
    ]}


@router.get("/ingredients/{slug}")
async def ingredient_detail(slug: str):
    pool = await _db()
    i = await pool.fetchrow("select * from gb_ingredients where slug = $1", slug)
    if not i:
        raise HTTPException(404, f"ingredient {slug} not found")
    functions = await pool.fetch(
        """select f.name from gb_ingredient_function_map m
           join gb_ingredient_functions f on f.id = m.function_id
           where m.ingredient_id = $1 order by f.name""", i["id"])
    effects = await pool.fetch(
        """select e.kind, e.slug, e.name, e.description, ie.weight
           from gb_ingredient_effects ie join gb_effects e on e.id = ie.effect_id
           where ie.ingredient_id = $1 order by ie.weight desc""", i["id"])
    aliases = await pool.fetch(
        "select alias from gb_ingredient_aliases where ingredient_id = $1 order by alias", i["id"])
    products = await pool.fetch(
        """select p.slug, p.name, p.badge_flags, p.rating_avg, p.rating_count, p.images,
                  b.name as brand, b.slug as brand_slug, c.name as category,
                  pi.position, pi.is_key_ingredient
           from gb_product_ingredients pi
           join gb_products p on p.id = pi.product_id and p.status <> 'discontinued'
           join gb_brands b on b.id = p.brand_id
           left join gb_categories c on c.id = p.category_id
           where pi.ingredient_id = $1
           order by pi.is_key_ingredient desc, p.rating_count desc limit 48""", i["id"])
    import json
    quick_facts = i["quick_facts"]
    if isinstance(quick_facts, str):
        quick_facts = json.loads(quick_facts)
    return {
        "slug": i["slug"], "inciName": i["inci_name"], "displayName": i["display_name"],
        "description": i["description"], "quickFacts": quick_facts or [],
        "rating": i["rating"],
        "irritancy": [i["irritancy_min"], i["irritancy_max"]] if i["irritancy_min"] is not None else None,
        "comedogenicity": [i["comedogenicity_min"], i["comedogenicity_max"]] if i["comedogenicity_min"] is not None else None,
        "euAllergen": i["is_eu_fragrance_allergen"], "faTrigger": i["is_fungal_acne_trigger"],
        "functions": [r["name"] for r in functions],
        "aliases": [r["alias"] for r in aliases],
        "effects": {
            "benefits": [{"slug": r["slug"], "name": r["name"], "description": r["description"],
                          "count": 0, "score": r["weight"]} for r in effects if r["kind"] == "benefit"],
            "concerns": [{"slug": r["slug"], "name": r["name"], "description": r["description"],
                          "count": 0, "score": r["weight"]} for r in effects if r["kind"] == "concern"],
        },
        "products": [
            {**_card(r), "position": r["position"], "isKey": r["is_key_ingredient"]}
            for r in products
        ],
    }


@router.get("/brands/{slug}")
async def brand_detail(slug: str):
    pool = await _db()
    b = await pool.fetchrow("select * from gb_brands where slug = $1", slug)
    if not b:
        raise HTTPException(404, f"brand {slug} not found")
    products = await pool.fetch(
        """select p.slug, p.name, p.badge_flags, p.rating_avg, p.rating_count, p.images,
                  b.name as brand, b.slug as brand_slug, c.name as category
           from gb_products p
           join gb_brands b on b.id = p.brand_id
           left join gb_categories c on c.id = p.category_id
           where b.slug = $1 and p.status <> 'discontinued'
           order by p.rating_count desc, p.created_at desc""", slug)
    return {
        "slug": b["slug"], "name": b["name"], "website": b["website"],
        "country": b["country"], "description": b["description"], "logoUrl": b["logo_url"],
        "products": [_card(r) for r in products],
    }


@router.get("/compare")
async def compare(a: str, b: str):
    pool = await _db()
    pa = await _product_detail(pool, a)
    pb = await _product_detail(pool, b)
    names_a = {i["slug"]: i for i in pa["ingredients"]}
    names_b = {i["slug"]: i for i in pb["ingredients"]}
    shared = [names_a[s]["inciName"] for s in names_a if s in names_b]
    return {
        "a": pa, "b": pb,
        "overlap": {
            "shared": sorted(shared),
            "onlyA": sorted(names_a[s]["inciName"] for s in names_a if s not in names_b),
            "onlyB": sorted(names_b[s]["inciName"] for s in names_b if s not in names_a),
            "sharedCount": len(shared),
        },
    }


# --- Local salon rankings (salon_ai_leaderboard) -------------------------
# Powers /local-rankings "Top 3 near you". Same read-only pool; the table is
# the RankMySalon leaderboard, so report pages exist for every slug.

_SALON_CATEGORIES: dict[str, list[str]] = {
    "nail-salon": ["nail salon"],
    "hair-salon": ["hair salon"],
    "beauty-salon": ["beauty salon", "salon"],
    "spa": ["spa", "day spa", "massage spa", "massage", "facial spa"],
    "barber": ["barber shop", "barber"],
    "skin-care": ["skin care clinic", "skin care", "medical spa", "wellness center"],
}

# The leaderboard carries a small non-beauty tail (scraped Google categories);
# keep it out of the default "all services" ranking.
_NON_BEAUTY = [
    "doctor", "medical clinic", "medical center", "educational institution",
    "health", "service", "store",
]


def _salon_row(r) -> dict:
    return {
        "slug": r["slug"], "name": r["name"], "address": r["address"],
        "town": r["town"], "state": r["state"], "zipcode": r["zipcode"],
        "category": r["category"],
        "rating": float(r["rating"]) if r["rating"] is not None else None,
        "reviewCount": r["review_count"],
        "aiScore": float(r["ai_score"]) if r["ai_score"] is not None else None,
        "website": r["website"], "phone": r["phone"],
        "reportUrl": f"https://www.rankmysalon.ai/analysis-reports/{r['slug']}",
    }


@router.get("/salons/top")
async def top_salons(
    town: str = "",
    state: str = "",
    zip3: str = "",
    category: str = "",
    limit: int = Query(3, le=10),
):
    """Top salons for a location, ranked by a review-count-weighted rating.

    Location fallback: town+state -> zip3+state (same metro) -> state, so the
    section never comes back empty for a sparse town. `scope` reports which
    tier answered so the UI can label results honestly.
    """
    pool = await _db()
    state = state.strip().upper()[:2]
    town = town.strip()
    zip3 = "".join(ch for ch in zip3.strip() if ch.isdigit())[:3]
    cats = _SALON_CATEGORIES.get(category.strip())

    async def fetch(scope_where: str, args: list) -> list:
        args = list(args)
        if cats:
            args.append(cats)
            cat_where = f" and lower(category) = any(${len(args)})"
        else:
            args.append(_NON_BEAUTY)
            cat_where = f" and lower(category) <> all(${len(args)})"
        # distinct-on collapses duplicate listings of the same salon (same
        # name scraped under two categories); bayesian score keeps a 4.9 with
        # 800 reviews ahead of a 5.0 with 6.
        return await pool.fetch(
            f"""select * from (
                    select distinct on (lower(name))
                           slug, name, address, town, state, zipcode, category,
                           rating, review_count, ai_score, website, phone,
                           (rating * review_count + 4.3 * 25) / (review_count + 25) as score
                    from salon_ai_leaderboard
                    where rating is not null and review_count >= 5
                          {scope_where}{cat_where}
                    order by lower(name), review_count desc
                ) t
                order by score desc, review_count desc
                limit {int(limit)}""",
            *args,
        )

    tiers: list[tuple[str, str, list]] = []
    if town and state:
        tiers.append(("town", " and lower(town) = lower($1) and state = $2", [town, state]))
    elif town:
        tiers.append(("town", " and lower(town) = lower($1)", [town]))
    if zip3 and state:
        tiers.append(("area", " and left(zipcode, 3) = $1 and state = $2", [zip3, state]))
    elif zip3:
        tiers.append(("area", " and left(zipcode, 3) = $1", [zip3]))
    if state:
        tiers.append(("state", " and state = $1", [state]))
    if not tiers:
        raise HTTPException(400, "provide town, zip3, or state")

    for scope, where, args in tiers:
        rows = await fetch(where, args)
        if len(rows) >= min(limit, 3):
            return {"scope": scope, "salons": [_salon_row(r) for r in rows]}
    return {"scope": tiers[-1][0], "salons": [_salon_row(r) for r in rows]}
