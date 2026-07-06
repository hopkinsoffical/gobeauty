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


@router.get("/products")
async def list_products(q: str = "", limit: int = Query(24, le=60), offset: int = 0):
    pool = await _db()
    where = "p.status <> 'discontinued'"
    args: list = []
    if q.strip():
        args.append(f"%{q.strip().lower()}%")
        where += " and (lower(p.name) like $1 or lower(b.name) like $1)"
    rows = await pool.fetch(
        f"""select p.slug, p.name, p.badge_flags, p.rating_avg, p.rating_count,
                   p.images, b.name as brand, b.slug as brand_slug, c.name as category
            from gb_products p
            join gb_brands b on b.id = p.brand_id
            left join gb_categories c on c.id = p.category_id
            where {where}
            order by p.rating_count desc, p.created_at desc
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
        """select p.*, b.name as brand, b.slug as brand_slug, c.name as category
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
    counts = {"superstar": 0, "goodie": 0, "neutral": 0, "icky": 0, "unknown": 0}
    for r in ings:
        counts[r["rating"] or "unknown"] += 1
    return {
        "slug": p["slug"], "name": p["name"], "brand": p["brand"], "brandSlug": p["brand_slug"],
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
    }


@router.get("/products/{slug}")
async def product_detail(slug: str):
    return await _product_detail(await _db(), slug)


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
