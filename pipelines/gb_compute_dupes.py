"""Materialize gb_product_dupes: pairwise INCI similarity between products.

Similarity is position-weighted Jaccard — an ingredient at INCI position k
carries weight 1/sqrt(k), so two products sharing their first five ingredients
score far higher than two sharing five trace preservatives at the tail.
Pairs below MIN_SIMILARITY with fewer than MIN_SHARED shared ingredients are
skipped; each unordered pair is stored once with product_id < dupe_product_id
(table check constraint).

Usage: python3 pipelines/gb_compute_dupes.py
Env:   DATABASE_URL. Re-runnable; rebuilds the whole table each time.
"""
from __future__ import annotations

import math
import os
from itertools import combinations

import psycopg2

MIN_SIMILARITY = 0.20
MIN_SHARED = 5


def main() -> None:
    d = os.environ["DATABASE_URL"].replace("postgresql+asyncpg://", "postgresql://").split("?")[0]
    conn = psycopg2.connect(d + "?sslmode=require")
    cur = conn.cursor()

    cur.execute(
        """select pi.product_id, pi.ingredient_id, pi.position
           from gb_product_ingredients pi
           join gb_products p on p.id = pi.product_id
           where p.status <> 'discontinued'"""
    )
    by_product: dict[str, dict[str, float]] = {}
    for product_id, ingredient_id, position in cur.fetchall():
        by_product.setdefault(product_id, {})[ingredient_id] = 1.0 / math.sqrt(position)

    rows = []
    for a, b in combinations(sorted(by_product), 2):
        ia, ib = by_product[a], by_product[b]
        shared = ia.keys() & ib.keys()
        if not shared:
            continue
        inter = sum(max(ia[k], ib[k]) for k in shared)
        union = sum(max(ia.get(k, 0), ib.get(k, 0)) for k in ia.keys() | ib.keys())
        similarity = inter / union if union else 0.0
        if similarity >= MIN_SIMILARITY or len(shared) >= MIN_SHARED:
            rows.append((a, b, len(shared), round(similarity, 4)))

    cur.execute("delete from gb_product_dupes")
    cur.executemany(
        """insert into gb_product_dupes (product_id, dupe_product_id, shared_ingredients, similarity)
           values (%s, %s, %s, %s)""",
        rows,
    )
    conn.commit()
    print(f"gb_product_dupes: {len(rows)} pairs over {len(by_product)} products")


if __name__ == "__main__":
    main()
