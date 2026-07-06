"""INCI ingestion pipeline: product JSON -> gb_* tables (RDS).

- Parses the raw INCI string (top-level commas; a comma between digits, as in
  "1,2-Hexanediol", is part of the name, not a separator).
- Resolves each token through gb_ingredient_aliases; "Water (Aqua)" style
  tokens try the full form, the base name, and each parenthetical.
- Unknown ingredients are auto-created with pattern-based classification
  (paraben/silicone/sulfate/fragrance/EU allergen/fatty-vs-drying alcohol...),
  rating left null for later curation.
- Recomputes the product's badge_flags and gb_product_effects afterward.

Usage:
  python3 pipelines/gb_inci_ingest.py --json product.json   # one product
  python3 pipelines/gb_inci_ingest.py --demo                # ingest the two reference products
Product JSON: {brand, name, category?, slug?, description?, size_label?,
               is_cruelty_free?, is_vegan?, inci: "Water, Glycerin, ..."}
Env: DATABASE_URL.
"""
from __future__ import annotations

import argparse
import json
import os
import re

import psycopg2
import psycopg2.extras

EU_ALLERGENS = {
    "amyl cinnamal", "amylcinnamyl alcohol", "anise alcohol", "benzyl alcohol",
    "benzyl benzoate", "benzyl cinnamate", "benzyl salicylate",
    "butylphenyl methylpropional", "cinnamal", "cinnamyl alcohol", "citral",
    "citronellol", "coumarin", "eugenol", "evernia furfuracea extract",
    "evernia prunastri extract", "farnesol", "geraniol", "hexyl cinnamal",
    "hydroxycitronellal", "hydroxyisohexyl 3-cyclohexene carboxaldehyde",
    "isoeugenol", "limonene", "linalool", "methyl 2-octynoate",
    "alpha-isomethyl ionone",
}
FRAGRANCE_NAMES = {"parfum", "fragrance", "aroma", "perfume", "fragrance (parfum)", "parfum (fragrance)"}
DRYING_ALCOHOLS = {"alcohol", "alcohol denat", "alcohol denat.", "denatured alcohol",
                   "ethanol", "isopropyl alcohol", "sd alcohol 40", "sd alcohol 40-b"}
FATTY_ALCOHOL_STEMS = ("cetyl", "stearyl", "cetearyl", "behenyl", "arachidyl", "myristyl", "lauryl", "oleyl")
FA_TRIGGER_ESTER = re.compile(
    r"(myristate|palmitate|stearate|isostearate|laurate|oleate|linoleate|ricinoleate|"
    r"polysorbate|glyceryl (stearate|oleate|laurate)|sorbitan)", re.I)
FA_TRIGGER_ACIDS = {"lauric acid", "myristic acid", "palmitic acid", "stearic acid",
                    "oleic acid", "linoleic acid"}
ANIMAL_HINTS = ("beeswax", "cera alba", "lanolin", "carmine", "ci 75470", "tallow",
                "snail secretion", "honey", "mel", "keratin", "silk", "serica", "collagen")
SILICONE = re.compile(r"(methicone|siloxane|silsesquioxane|silanol|silylate|silica dimethyl)", re.I)
SULFATE = re.compile(r"\b(lauryl|laureth|myreth|coceth) sulfate\b", re.I)
PARABEN = re.compile(r"paraben\b", re.I)
OILISH = re.compile(r"\b(oil|butter)\b", re.I)
ESSENTIAL_OIL = re.compile(r"(leaf|peel|flower|needle|wood|bark) oil\b", re.I)


def slugify(s: str) -> str:
    s = re.sub(r"[^\w\s-]", "", s.lower()).strip()
    return re.sub(r"[\s_]+", "-", s)[:80]


def parse_inci(raw: str) -> list[str]:
    """Ordered INCI tokens. Commas inside parens or between digits don't split."""
    tokens, buf, depth = [], [], 0
    chars = raw.strip()
    for i, ch in enumerate(chars):
        if ch in "([":
            depth += 1
        elif ch in ")]":
            depth = max(0, depth - 1)
        if ch == "," and depth == 0:
            prev = chars[i - 1] if i else ""
            nxt = chars[i + 1] if i + 1 < len(chars) else ""
            if prev.isdigit() and nxt.isdigit():   # 1,2-Hexanediol
                buf.append(ch)
                continue
            tok = "".join(buf).strip()
            if tok:
                tokens.append(tok)
            buf = []
        else:
            buf.append(ch)
    tok = "".join(buf).strip(" .")
    if tok:
        tokens.append(tok)
    return tokens


def alias_candidates(token: str) -> list[str]:
    """Lookup keys for one token: full form, paren-stripped base, each paren part."""
    t = re.sub(r"\s+", " ", token).strip().lower()
    cands = [t]
    base = re.sub(r"\s*\([^)]*\)", "", t).strip()
    if base and base != t:
        cands.append(base)
    cands += [m.strip() for m in re.findall(r"\(([^)]+)\)", t) if m.strip()]
    return cands


def classify(name: str) -> dict:
    n = name.lower().strip()
    flags = {}
    if PARABEN.search(n):
        flags["is_paraben"] = True
    if SULFATE.search(n):
        flags["is_sulfate"] = True
    if SILICONE.search(n):
        flags["is_silicone"] = True
    if n in FRAGRANCE_NAMES:
        flags["is_fragrance"] = True
    if n in EU_ALLERGENS:
        flags["is_eu_fragrance_allergen"] = True
        flags["is_fragrance"] = True
    if n in DRYING_ALCOHOLS:
        flags["is_drying_alcohol"] = True
    elif n.endswith(" alcohol") and n.split()[0] in FATTY_ALCOHOL_STEMS:
        flags["is_fungal_acne_trigger"] = True   # fatty alcohol: FA risk, NOT drying
    if FA_TRIGGER_ESTER.search(n) or n in FA_TRIGGER_ACIDS:
        flags["is_fungal_acne_trigger"] = True
    if OILISH.search(n):
        flags["is_oil"] = True
        if ESSENTIAL_OIL.search(n):
            flags["is_essential_oil"] = True
            flags["is_fragrance"] = True
    if any(h in n for h in ANIMAL_HINTS):
        flags["is_animal_derived"] = True
    return flags


def resolve_or_create(cur, token: str) -> str:
    for cand in alias_candidates(token):
        cur.execute("select ingredient_id from gb_ingredient_aliases where alias=%s", (cand,))
        row = cur.fetchone()
        if row:
            return row[0]
    canonical = re.sub(r"\s+", " ", token).strip()
    slug = slugify(canonical)
    flags = classify(canonical)
    cols = ", ".join(flags)
    vals = ", ".join("true" for _ in flags)
    cur.execute(
        f"""insert into gb_ingredients (slug, inci_name{', ' + cols if cols else ''})
            values (%s, %s{', ' + vals if vals else ''})
            on conflict (slug) do update set updated_at=now()
            returning id""",
        (slug, canonical),
    )
    ing_id = cur.fetchone()[0]
    for cand in alias_candidates(canonical):
        cur.execute(
            "insert into gb_ingredient_aliases (alias, ingredient_id) values (%s,%s) on conflict (alias) do nothing",
            (cand, ing_id),
        )
    return ing_id


BADGES = {
    "paraben_free": "is_paraben", "sulfate_free": "is_sulfate",
    "silicone_free": "is_silicone", "alcohol_free": "is_drying_alcohol",
    "fragrance_free": "is_fragrance", "essential_oil_free": "is_essential_oil",
    "oil_free": "is_oil", "fungal_acne_safe": "is_fungal_acne_trigger",
    "reef_safe": "is_reef_unsafe", "eu_allergen_free": "is_eu_fragrance_allergen",
}


def recompute(cur, product_id: str) -> None:
    checks = ", ".join(
        f"bool_and(not coalesce(i.{col}, false)) as {badge}" for badge, col in BADGES.items()
    )
    cur.execute(
        f"select {checks} from gb_product_ingredients pi join gb_ingredients i on i.id=pi.ingredient_id "
        "where pi.product_id=%s", (product_id,))
    row = cur.fetchone()
    badge_flags = dict(zip(BADGES.keys(), row)) if row and row[0] is not None else {}
    cur.execute("update gb_products set badge_flags=%s, updated_at=now() where id=%s",
                (json.dumps(badge_flags), product_id))
    cur.execute("delete from gb_product_effects where product_id=%s", (product_id,))
    cur.execute(
        """insert into gb_product_effects (product_id, effect_id, ingredient_count, score)
           select %s, ie.effect_id, count(*), sum(ie.weight)
           from gb_product_ingredients pi
           join gb_ingredient_effects ie on ie.ingredient_id = pi.ingredient_id
           where pi.product_id=%s
           group by ie.effect_id""",
        (product_id, product_id))


def ingest(cur, p: dict) -> str:
    brand_slug = slugify(p["brand"])
    cur.execute(
        "insert into gb_brands (slug, name) values (%s,%s) on conflict (slug) do update set updated_at=now() returning id",
        (brand_slug, p["brand"]))
    brand_id = cur.fetchone()[0]
    cat_id = None
    if p.get("category"):
        cur.execute(
            "insert into gb_categories (slug, name) values (%s,%s) on conflict (slug) do update set name=excluded.name returning id",
            (slugify(p["category"]), p["category"]))
        cat_id = cur.fetchone()[0]
    slug = p.get("slug") or f"{brand_slug}-{slugify(p['name'])}"
    cur.execute(
        """insert into gb_products (slug, brand_id, category_id, name, description, size_label,
                                    ingredients_raw, is_cruelty_free, is_vegan, status)
           values (%s,%s,%s,%s,%s,%s,%s,%s,%s,'draft')
           on conflict (slug) do update set
             brand_id=excluded.brand_id, category_id=excluded.category_id,
             name=excluded.name, description=coalesce(excluded.description, gb_products.description),
             size_label=coalesce(excluded.size_label, gb_products.size_label),
             ingredients_raw=excluded.ingredients_raw,
             is_cruelty_free=coalesce(excluded.is_cruelty_free, gb_products.is_cruelty_free),
             is_vegan=coalesce(excluded.is_vegan, gb_products.is_vegan),
             updated_at=now()
           returning id""",
        (slug, brand_id, cat_id, p["name"], p.get("description"), p.get("size_label"),
         p["inci"], p.get("is_cruelty_free"), p.get("is_vegan")))
    product_id = cur.fetchone()[0]

    tokens = parse_inci(p["inci"])
    cur.execute("delete from gb_product_ingredients where product_id=%s", (product_id,))
    seen: set[str] = set()
    pos = 0
    key_set = {k.lower() for k in p.get("key_ingredients", [])}
    for tok in tokens:
        ing_id = resolve_or_create(cur, tok)
        if ing_id in seen:
            continue
        seen.add(ing_id)
        pos += 1
        cur.execute(
            "insert into gb_product_ingredients (product_id, ingredient_id, position, is_key_ingredient) "
            "values (%s,%s,%s,%s)",
            (product_id, ing_id, pos, any(c in key_set for c in alias_candidates(tok))))
    recompute(cur, product_id)
    print(f"ingested {p['brand']} / {p['name']} -> {slug}: {pos} ingredients")
    return product_id


DEMO = [
    {
        "brand": "Erasa", "name": "XEP-30", "category": "Facial Treatments",
        "slug": "erasa-xep-30",
        "description": "Anti-aging concentrate targeting expression lines.",
        "key_ingredients": ["Mu-Conotoxin Cniiic", "Acetyl Hexapeptide-8", "Niacinamide"],
        "inci": "Water (Aqua), Cyclopentasiloxane, Polysilicone-11, Dimethyl Isosorbide, Adipic Acid/Neopentyl Glycol Crosspolymer, Polyethylene, Dimethicone, Pentylene Glycol, Squalane, Amodimethicone, Steareth-21, Mica, Creatine, Niacinamide, Whey Protein, Polysorbate 20, Butylene Glycol, Glycerin, Hydroxypropyl Methylcellulose, Mu-Conotoxin Cniiic, Acetyl Hexapeptide-8, Palmitoyl Hexapeptide-52, Palmitoyl Heptapeptide-18, Algae Extract, Sodium Hyaluronate, Glabridin, Sucrose, Glycine, Oryza Sativa (Rice) Bran Extract, Albizia Julibrissin Bark Extract, Caffeine, Boswellia Serrata Resin Extract, Magnolia Grandiflora Bark Extract, Acetyl Glucosamine, Betula Alba Bark Extract, Centella Asiatica Extract, Oleic Acid, Laureth-12, Sodium Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, Vp/Va Copolymer, Isohexadecane, Darutoside, Lactic Acid, Glycolic Acid, Polyvinyl Alcohol, Dimethylacrylamide Acrylic Acid/Polystyrene Ethyl Methacrylate Copolymer, Carbomer, Dextran, Polysorbate 80, Potassium Hydroxide, Fragrance (Parfum), Sodium Benzoate, Ethylhexylglycerin, Caprylyl Glycol, Phenoxyethanol, Hexylene Glycol, Red 4 (Ci 14700)",
    },
    {
        "brand": "SK-II", "name": "SKINPOWER Advanced Cream", "category": "Night Moisturizers",
        "slug": "sk-ii-skinpower-advanced-cream", "size_label": "80g",
        "description": "Moisturizing cream with Galactomyces Ferment Filtrate and Niacinamide.",
        "key_ingredients": ["Galactomyces Ferment Filtrate", "Niacinamide", "Tocopheryl Acetate", "Palmitoyl Pentapeptide-4"],
        "inci": "Water, Glycerin, Galactomyces Ferment Filtrate, Isohexadecane, Niacinamide, Isopropyl Isostearate, Butylene Glycol, Butyrospermum Parkii Butter, Caprylic/Capric Triglyceride, Pentylene Glycol, Dimethicone, Phytosteryl/Behenyl/Octyldodecyl Lauroyl Glutamate, Vinyl Dimethicone/Methicone Silsesquioxane Crosspolymer, Stearyl Alcohol, Cetyl Alcohol, Sodium Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, Behenyl Alcohol, Panthenol, Tocopheryl Acetate, Benzyl Alcohol, Dimethiconol, PEG-100 Stearate, Cetearyl Alcohol, Cetearyl Glucoside, Polysorbate 80, Polymethylsilsesquioxane, Methylparaben, Disodium EDTA, Parfum, Paeonia Albiflora Root Extract, Palmitic Acid, Stearic Acid, Propylparaben, Ethylparaben, Sorbitan Oleate, PEG-7 Glyceryl Cocoate, Sodium Hydroxide, Houttuynia Cordata Extract, Palmitoyl Pentapeptide-4, Methylsilanol Tri-PEG-8 Glyceryl Cocoate, Zantedeschia Aethiopica Flower/Stem Extract, Polyquaternium-7, Methicone, CI 77891, CI 77492",
    },
]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", help="path to a product JSON file (single object or array)")
    ap.add_argument("--demo", action="store_true", help="ingest the two reference products")
    args = ap.parse_args()
    products = DEMO if args.demo else []
    if args.json:
        data = json.load(open(args.json))
        products += data if isinstance(data, list) else [data]
    if not products:
        ap.error("nothing to ingest: pass --json or --demo")
    d = os.environ["DATABASE_URL"].replace("postgresql+asyncpg://", "postgresql://").split("?")[0]
    conn = psycopg2.connect(d + "?sslmode=require")
    conn.autocommit = False
    cur = conn.cursor()
    for p in products:
        ingest(cur, p)
        conn.commit()


if __name__ == "__main__":
    main()
