"""Materialize gb_product_dupes: pairwise INCI similarity between products.

Similarity is position-weighted Jaccard — an ingredient at INCI position k
carries weight 1/sqrt(k), so two products sharing their first five ingredients
score far higher than two sharing five trace preservatives at the tail.
Pairs below MIN_SIMILARITY with fewer than MIN_SHARED shared ingredients are
skipped; each unordered pair is stored once with product_id < dupe_product_id
(table check constraint). Storage is bounded: a qualifying pair is kept only
while it ranks in the TOP_K closest of either endpoint (the UI shows 8), and
every product keeps its TOP_N_FLOOR closest pairs even below the thresholds,
so no product page shows an empty "similar products" panel.

Usage: python3 pipelines/gb_compute_dupes.py
Env:   DATABASE_URL. Re-runnable; rebuilds the whole table each time.
"""
from __future__ import annotations

import math
import os
from itertools import combinations

import psycopg2
from psycopg2.extras import execute_values

MIN_SIMILARITY = 0.20
MIN_SHARED = 5
TOP_K = 12
TOP_N_FLOOR = 3


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

    # Per-product ranked candidates: qualifying pairs (thresholds met) and all
    # pairs (for the empty-panel floor). Lists stay length-capped as we stream
    # the O(n^2) pair space, so memory and the final insert stay bounded.
    qual: dict[str, list[tuple[float, int, str, str]]] = {p: [] for p in by_product}
    floor: dict[str, list[tuple[float, int, str, str]]] = {p: [] for p in by_product}

    def keep(heap: list, cap: int, item: tuple) -> None:
        heap.append(item)
        if len(heap) > cap * 2:  # amortize: sort+trim only at 2x cap
            heap.sort(reverse=True)
            del heap[cap:]

    for a, b in combinations(sorted(by_product), 2):
        ia, ib = by_product[a], by_product[b]
        shared = ia.keys() & ib.keys()
        if not shared:
            continue
        inter = sum(max(ia[k], ib[k]) for k in shared)
        union = sum(max(ia.get(k, 0), ib.get(k, 0)) for k in ia.keys() | ib.keys())
        similarity = inter / union if union else 0.0
        item = (similarity, len(shared), a, b)
        qualifies = similarity >= MIN_SIMILARITY or len(shared) >= MIN_SHARED
        for p in (a, b):
            if qualifies:
                keep(qual[p], TOP_K, item)
            keep(floor[p], TOP_N_FLOOR, item)

    rows: dict[tuple[str, str], tuple] = {}
    for p, heap in qual.items():
        heap.sort(reverse=True)
        for similarity, n_shared, a, b in heap[:TOP_K]:
            rows[(a, b)] = (a, b, n_shared, round(similarity, 4))
    # Floor: products whose every pair fell below the thresholds still get
    # their closest TOP_N_FLOOR matches, so the panel is never empty.
    covered = {p for a, b in rows for p in (a, b)}
    for p, heap in floor.items():
        if p in covered:
            continue
        heap.sort(reverse=True)
        for similarity, n_shared, a, b in heap[:TOP_N_FLOOR]:
            rows.setdefault((a, b), (a, b, n_shared, round(similarity, 4)))

    rows = list(rows.values())
    cur.execute("delete from gb_product_dupes")
    execute_values(
        cur,
        """insert into gb_product_dupes (product_id, dupe_product_id, shared_ingredients, similarity)
           values %s""",
        rows,
        page_size=1000,
    )
    conn.commit()
    print(f"gb_product_dupes: {len(rows)} pairs over {len(by_product)} products")


if __name__ == "__main__":
    main()
