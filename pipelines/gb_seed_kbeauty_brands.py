#!/usr/bin/env python3
"""Seed curated K-beauty brands into public.gb_brands (RDS).

Idempotent upsert by slug. Reads SQL from db/rds/004_kbeauty_brands.sql
or can regenerate from the same brand list embedded here for offline runs.

Usage:
  DATABASE_URL=... python3 pipelines/gb_seed_kbeauty_brands.py
  DATABASE_URL=... python3 pipelines/gb_seed_kbeauty_brands.py --dry-run

Env: DATABASE_URL (postgresql:// or postgresql+asyncpg://).
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

import psycopg2

ROOT = Path(__file__).resolve().parents[1]
SQL_PATH = ROOT / "db" / "rds" / "004_kbeauty_brands.sql"


def dsn() -> str:
    raw = os.environ.get("DATABASE_URL", "")
    if not raw:
        sys.exit("DATABASE_URL is required")
    return raw.replace("postgresql+asyncpg://", "postgresql://").split("?")[0]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true", help="print SQL path and exit")
    args = ap.parse_args()

    if not SQL_PATH.is_file():
        sys.exit(f"missing {SQL_PATH}")
    sql = SQL_PATH.read_text()
    if args.dry_run:
        print(f"would apply {SQL_PATH} ({len(sql)} bytes)")
        return

    conn = psycopg2.connect(dsn(), sslmode="require")
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute("select count(*) from gb_brands")
                before = cur.fetchone()[0]
                cur.execute(sql)
                cur.execute("select count(*) from gb_brands")
                after = cur.fetchone()[0]
                cur.execute(
                    "select count(*) from gb_brands where country ilike %s",
                    ("%korea%",),
                )
                korea = cur.fetchone()[0]
        print(f"gb_brands: {before} → {after} (+{after - before})")
        print(f"Korean country tags: {korea}")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
