"""Seed the goBeauty ingredient dictionary (RDS gb_* tables).

Loads: function vocabulary, benefit/concern vocabulary, and a curated set of
annotated ingredients (rating, irritancy/comedogenicity, classification flags,
functions, effects, INCI aliases). The INCI ingest pipeline auto-creates the
long tail with pattern-based classification; this file is the expert-knowledge
core the auto-created rows can't provide.

Idempotent (upserts by slug/alias). Env: DATABASE_URL. Run:
  python3 pipelines/gb_seed_ingredients.py
"""
from __future__ import annotations

import os
import re

import psycopg2

FUNCTIONS = [
    "solvent", "humectant", "emollient", "surfactant", "emulsifying",
    "emulsion-stabilising", "preservative", "antioxidant", "masking",
    "perfuming", "skin-conditioning", "smoothing", "soothing", "cleansing",
    "buffering", "chelating", "viscosity-controlling", "film-forming",
    "cosmetic-colorant", "abrasive", "uv-filter", "astringent", "tonic",
    "hair-conditioning", "anti-sebum", "exfoliating", "opacifying", "binding",
]

BENEFITS = [
    ("hydrating", "Hydrating", "Boosts hydration and relieves dry, tight skin."),
    ("barrier-repair", "Barrier Repair", "Strengthens and restores the skin's natural barrier."),
    ("reduces-irritation", "Reduces Irritation", "Eases discomfort and supports skin resilience."),
    ("redness-reducing", "Redness Reducing", "Soothes visible redness and calms irritation."),
    ("scar-healing", "Scar Healing", "Improves the look of marks and scars."),
    ("anti-aging", "Anti-Aging", "Softens lines and helps skin look youthful."),
    ("brightening", "Brightening", "Restores radiance to dull, tired skin."),
    ("good-for-oily-skin", "Good For Oily Skin", "Balances oil and helps reduce shine."),
    ("good-for-dry-skin", "Good For Dry Skin", "Comforts and replenishes dry skin."),
    ("dark-spots", "Dark Spots", "Fades dark spots for even skin tone."),
    ("skin-texture", "Skin Texture", "Smooths rough patches and refines texture."),
    ("acne-fighting", "Acne Fighting", "Fights acne and helps prevent breakouts."),
    ("reduces-large-pores", "Reduces Large Pores", "Minimizes the look of enlarged pores."),
    ("exfoliating", "Exfoliating", "Sloughs off dead cells for smoother skin."),
    ("uv-protection", "UV Protection", "Shields skin from UV damage."),
]

CONCERNS = [
    ("may-worsen-oily-skin", "May Worsen Oily Skin", "May increase shine or excess oil."),
    ("may-trigger-acne", "May Trigger Acne", "Can clog pores or trigger breakouts."),
    ("may-worsen-eczema", "May Worsen Eczema", "May worsen itching or irritation for eczema."),
    ("may-worsen-dryness", "May Worsen Dryness", "Can strip moisture and worsen dryness."),
    ("may-worsen-irritation", "May Worsen Irritation", "May sting or aggravate sensitive skin."),
    ("may-cause-allergy", "May Cause Allergic Reaction", "A known contact allergen for some people."),
]

# (inci, display, rating, irr(min,max)|None, com(min,max)|None, flags, functions,
#  effects {slug: weight}, aliases)
I = None  # shorthand for "unknown"
SEED = [
    ("Water", "Water", "neutral", (0, 0), (0, 0), [], ["solvent"], {}, ["aqua", "eau", "water (aqua)", "aqua (water)"]),
    ("Glycerin", "Glycerin", "superstar", (0, 0), (0, 0), [], ["humectant"], {"hydrating": 1, "barrier-repair": 0.6, "good-for-dry-skin": 0.8}, ["glycerine", "glycerol"]),
    ("Niacinamide", "Niacinamide (Vitamin B3)", "superstar", (0, 0), (0, 0), [], ["skin-conditioning", "smoothing"], {"brightening": 1, "dark-spots": 1, "acne-fighting": 0.8, "reduces-large-pores": 0.8, "barrier-repair": 0.8, "anti-aging": 0.6, "good-for-oily-skin": 0.6}, ["vitamin b3", "nicotinamide"]),
    ("Sodium Hyaluronate", "Hyaluronic Acid (salt)", "superstar", (0, 0), (0, 0), [], ["humectant", "skin-conditioning"], {"hydrating": 1, "anti-aging": 0.5, "good-for-dry-skin": 0.8}, ["hyaluronic acid"]),
    ("Panthenol", "Pro-Vitamin B5", "goodie", (0, 0), (0, 0), [], ["skin-conditioning", "soothing", "humectant"], {"hydrating": 0.8, "reduces-irritation": 0.8, "barrier-repair": 0.6, "scar-healing": 0.5}, ["dl-panthenol", "d-panthenol", "provitamin b5"]),
    ("Tocopheryl Acetate", "Vitamin E Acetate", "goodie", (0, 0), (0, 0), [], ["antioxidant"], {"anti-aging": 0.5, "reduces-irritation": 0.4}, ["vitamin e acetate"]),
    ("Tocopherol", "Vitamin E", "goodie", (0, 3), (0, 3), [], ["antioxidant"], {"anti-aging": 0.5, "good-for-dry-skin": 0.4}, ["vitamin e"]),
    ("Squalane", "Squalane", "goodie", (0, 0), (0, 1), ["is_oil"], ["emollient", "skin-conditioning"], {"hydrating": 0.7, "barrier-repair": 0.6, "good-for-dry-skin": 0.7}, []),
    ("Butylene Glycol", "Butylene Glycol", "goodie", (0, 1), (0, 1), [], ["humectant", "solvent"], {"hydrating": 0.5}, []),
    ("Pentylene Glycol", "Pentylene Glycol", "goodie", (0, 0), (0, 0), [], ["humectant", "solvent", "preservative"], {"hydrating": 0.4}, []),
    ("Caprylyl Glycol", "Caprylyl Glycol", "goodie", (0, 0), (0, 0), [], ["humectant", "preservative", "emollient"], {}, []),
    ("Hexylene Glycol", "Hexylene Glycol", "neutral", (0, 2), (0, 2), [], ["solvent", "surfactant"], {}, []),
    ("Dimethicone", "Dimethicone", "neutral", (0, 1), (0, 1), ["is_silicone"], ["emollient", "skin-conditioning"], {"skin-texture": 0.5}, []),
    ("Cyclopentasiloxane", "Cyclopentasiloxane", "neutral", (0, 0), (0, 0), ["is_silicone"], ["emollient", "solvent"], {}, []),
    ("Dimethiconol", "Dimethiconol", "neutral", I, I, ["is_silicone"], ["emollient"], {}, []),
    ("Methicone", "Methicone", "neutral", I, I, ["is_silicone"], ["emollient"], {}, []),
    ("Amodimethicone", "Amodimethicone", "neutral", I, I, ["is_silicone"], ["hair-conditioning"], {}, []),
    ("Polysilicone-11", "Polysilicone-11", "neutral", I, I, ["is_silicone"], ["film-forming"], {"skin-texture": 0.4}, []),
    ("Polymethylsilsesquioxane", "Polymethylsilsesquioxane", "neutral", I, I, ["is_silicone"], ["film-forming"], {}, []),
    ("Vinyl Dimethicone/Methicone Silsesquioxane Crosspolymer", None, "neutral", I, I, ["is_silicone"], ["viscosity-controlling"], {}, []),
    ("Methylsilanol Tri-PEG-8 Glyceryl Cocoate", None, "neutral", I, I, ["is_silicone"], ["surfactant"], {}, []),
    ("Isohexadecane", "Isohexadecane", "neutral", (0, 1), (0, 1), [], ["emollient", "solvent"], {}, []),
    ("Isopropyl Isostearate", "Isopropyl Isostearate", "neutral", (0, 1), (4, 5), ["is_fungal_acne_trigger"], ["emollient"], {"may-trigger-acne": 1}, []),
    ("Butyrospermum Parkii Butter", "Shea Butter", "goodie", (0, 0), (0, 0), ["is_oil", "is_fungal_acne_trigger"], ["emollient", "skin-conditioning"], {"good-for-dry-skin": 0.8, "barrier-repair": 0.5, "may-worsen-oily-skin": 0.5}, ["shea butter", "butyrospermum parkii (shea) butter", "butyrospermum parkii (shea butter)"]),
    ("Caprylic/Capric Triglyceride", "Caprylic/Capric Triglyceride", "goodie", (0, 0), (0, 1), ["is_fungal_acne_trigger"], ["emollient"], {"good-for-dry-skin": 0.4}, []),
    ("Stearyl Alcohol", "Stearyl Alcohol (fatty)", "neutral", (2, 2), (2, 2), ["is_fungal_acne_trigger"], ["emollient", "emulsifying"], {}, []),
    ("Cetyl Alcohol", "Cetyl Alcohol (fatty)", "neutral", (2, 2), (2, 2), ["is_fungal_acne_trigger"], ["emollient", "emulsifying"], {}, []),
    ("Cetearyl Alcohol", "Cetearyl Alcohol (fatty)", "neutral", (1, 2), (1, 2), ["is_fungal_acne_trigger"], ["emollient", "emulsifying"], {}, []),
    ("Behenyl Alcohol", "Behenyl Alcohol (fatty)", "neutral", I, I, ["is_fungal_acne_trigger"], ["emollient"], {}, []),
    ("Benzyl Alcohol", "Benzyl Alcohol", "icky", (0, 3), (0, 0), ["is_eu_fragrance_allergen"], ["preservative", "perfuming", "solvent"], {"may-cause-allergy": 0.8, "may-worsen-irritation": 0.5}, []),
    ("Methylparaben", "Methylparaben", "icky", (0, 0), (0, 0), ["is_paraben"], ["preservative"], {"may-cause-allergy": 0.3}, []),
    ("Propylparaben", "Propylparaben", "icky", (0, 0), (0, 0), ["is_paraben"], ["preservative"], {"may-cause-allergy": 0.3}, []),
    ("Ethylparaben", "Ethylparaben", "icky", (0, 0), (0, 0), ["is_paraben"], ["preservative"], {"may-cause-allergy": 0.3}, []),
    ("Parfum", "Fragrance", "icky", (3, 5), I, ["is_fragrance"], ["perfuming", "masking"], {"may-cause-allergy": 1, "may-worsen-irritation": 0.8}, ["fragrance", "fragrance (parfum)", "parfum (fragrance)", "aroma", "perfume"]),
    ("Phenoxyethanol", "Phenoxyethanol", "neutral", (0, 2), (0, 0), [], ["preservative"], {}, []),
    ("Ethylhexylglycerin", "Ethylhexylglycerin", "neutral", (0, 1), (0, 1), [], ["preservative", "skin-conditioning"], {}, []),
    ("Sodium Benzoate", "Sodium Benzoate", "neutral", (0, 0), (0, 0), [], ["preservative"], {}, []),
    ("Disodium EDTA", "Disodium EDTA", "neutral", (0, 0), (0, 0), [], ["chelating"], {}, []),
    ("Carbomer", "Carbomer", "neutral", (0, 1), (0, 1), [], ["viscosity-controlling"], {}, []),
    ("Polysorbate 20", "Polysorbate 20", "neutral", (0, 0), (0, 0), ["is_fungal_acne_trigger"], ["emulsifying", "surfactant"], {}, []),
    ("Polysorbate 80", "Polysorbate 80", "neutral", (0, 0), (0, 0), ["is_fungal_acne_trigger"], ["emulsifying", "surfactant"], {}, []),
    ("Sorbitan Oleate", "Sorbitan Oleate", "neutral", (0, 3), (0, 3), ["is_fungal_acne_trigger"], ["emulsifying"], {}, []),
    ("PEG-100 Stearate", "PEG-100 Stearate", "neutral", (0, 1), (0, 1), ["is_fungal_acne_trigger"], ["surfactant", "emulsifying"], {}, []),
    ("PEG-7 Glyceryl Cocoate", "PEG-7 Glyceryl Cocoate", "neutral", I, I, ["is_fungal_acne_trigger"], ["emollient", "surfactant"], {}, []),
    ("Palmitic Acid", "Palmitic Acid", "neutral", (0, 2), (2, 3), ["is_fungal_acne_trigger"], ["emollient", "cleansing"], {"may-trigger-acne": 0.4}, []),
    ("Stearic Acid", "Stearic Acid", "neutral", (0, 2), (2, 3), ["is_fungal_acne_trigger"], ["emollient", "cleansing"], {"may-trigger-acne": 0.3}, []),
    ("Oleic Acid", "Oleic Acid", "icky", (0, 3), (4, 5), ["is_fungal_acne_trigger"], ["emollient", "emulsifying"], {"may-trigger-acne": 1, "may-worsen-oily-skin": 0.6}, []),
    ("Sodium Hydroxide", "Sodium Hydroxide", "neutral", (0, 3), (0, 0), [], ["buffering"], {}, ["naoh"]),
    ("Potassium Hydroxide", "Potassium Hydroxide", "neutral", (0, 3), (0, 0), [], ["buffering"], {}, ["koh"]),
    ("Lactic Acid", "Lactic Acid (AHA)", "superstar", (0, 4), (0, 1), [], ["exfoliating", "humectant", "buffering"], {"exfoliating": 1, "skin-texture": 0.8, "brightening": 0.6, "hydrating": 0.4, "may-worsen-irritation": 0.5}, []),
    ("Glycolic Acid", "Glycolic Acid (AHA)", "superstar", (0, 4), (0, 1), [], ["exfoliating", "buffering"], {"exfoliating": 1, "skin-texture": 1, "brightening": 0.7, "anti-aging": 0.6, "may-worsen-irritation": 0.7}, []),
    ("Salicylic Acid", "Salicylic Acid (BHA)", "superstar", (0, 3), (0, 1), [], ["exfoliating", "preservative"], {"acne-fighting": 1, "exfoliating": 1, "reduces-large-pores": 0.8, "good-for-oily-skin": 0.8, "may-worsen-dryness": 0.4}, ["bha"]),
    ("Retinol", "Retinol (Vitamin A)", "superstar", (0, 4), (0, 2), [], ["skin-conditioning"], {"anti-aging": 1, "skin-texture": 0.9, "acne-fighting": 0.7, "dark-spots": 0.6, "may-worsen-irritation": 0.8, "may-worsen-dryness": 0.6}, ["vitamin a"]),
    ("Ascorbic Acid", "Vitamin C (L-AA)", "superstar", (0, 3), (0, 1), [], ["antioxidant", "buffering"], {"brightening": 1, "anti-aging": 0.9, "dark-spots": 0.9, "uv-protection": 0.3, "may-worsen-irritation": 0.4}, ["l-ascorbic acid", "vitamin c"]),
    ("Sodium Ascorbyl Phosphate", "Vitamin C (SAP)", "goodie", (0, 0), (0, 0), [], ["antioxidant"], {"brightening": 0.8, "acne-fighting": 0.6, "dark-spots": 0.6}, []),
    ("Hyaluronic Acid", "Hyaluronic Acid", "superstar", (0, 0), (0, 0), [], ["humectant", "skin-conditioning"], {"hydrating": 1, "anti-aging": 0.5}, []),
    ("Ceramide NP", "Ceramide NP", "superstar", (0, 0), (0, 0), [], ["skin-conditioning"], {"barrier-repair": 1, "hydrating": 0.7, "good-for-dry-skin": 0.8}, ["ceramide 3"]),
    ("Centella Asiatica Extract", "Centella Asiatica (Cica)", "superstar", (0, 0), (0, 0), [], ["soothing", "skin-conditioning"], {"reduces-irritation": 1, "redness-reducing": 0.9, "scar-healing": 0.7, "barrier-repair": 0.6}, ["cica", "centella asiatica leaf extract"]),
    ("Allantoin", "Allantoin", "goodie", (0, 0), (0, 0), [], ["soothing", "skin-conditioning"], {"reduces-irritation": 0.8, "scar-healing": 0.5}, []),
    ("Caffeine", "Caffeine", "goodie", (0, 0), (0, 0), [], ["skin-conditioning", "tonic"], {"anti-aging": 0.3, "redness-reducing": 0.4}, []),
    ("Acetyl Hexapeptide-8", "Argireline (peptide)", "goodie", (0, 0), (0, 0), [], ["skin-conditioning"], {"anti-aging": 0.9, "skin-texture": 0.5}, ["argireline"]),
    ("Palmitoyl Pentapeptide-4", "Matrixyl (peptide)", "goodie", (0, 0), (0, 0), [], ["skin-conditioning"], {"anti-aging": 0.9, "scar-healing": 0.4}, ["matrixyl"]),
    ("Palmitoyl Hexapeptide-52", "Peptide", "goodie", I, I, [], ["skin-conditioning"], {"anti-aging": 0.7}, []),
    ("Palmitoyl Heptapeptide-18", "Peptide", "goodie", I, I, [], ["skin-conditioning"], {"anti-aging": 0.7}, []),
    ("Acetyl Glucosamine", "N-Acetyl Glucosamine", "goodie", (0, 0), (0, 0), [], ["skin-conditioning", "humectant"], {"dark-spots": 0.6, "hydrating": 0.5, "exfoliating": 0.3}, ["n-acetyl glucosamine"]),
    ("Galactomyces Ferment Filtrate", "Galactomyces Ferment (Pitera)", "goodie", (0, 0), (0, 0), ["is_fungal_acne_trigger"], ["skin-conditioning", "humectant"], {"brightening": 0.7, "hydrating": 0.6, "skin-texture": 0.5}, ["pitera"]),
    ("Creatine", "Creatine", "goodie", (0, 0), (0, 0), [], ["skin-conditioning"], {"anti-aging": 0.4, "hydrating": 0.3}, []),
    ("Glabridin", "Licorice Extract (Glabridin)", "superstar", (0, 0), (0, 0), [], ["skin-conditioning", "soothing"], {"brightening": 0.9, "dark-spots": 0.8, "reduces-irritation": 0.6}, ["licorice root extract"]),
    ("Mica", "Mica", "neutral", (0, 0), (0, 0), [], ["cosmetic-colorant"], {}, []),
    ("CI 77891", "Titanium Dioxide (colorant)", "neutral", (0, 0), (0, 0), [], ["cosmetic-colorant"], {}, ["titanium dioxide (ci 77891)"]),
    ("CI 77492", "Iron Oxide Yellow", "neutral", (0, 0), (0, 0), [], ["cosmetic-colorant"], {}, ["iron oxides (ci 77492)"]),
    ("Red 4 (CI 14700)", "Red 4", "icky", I, I, [], ["cosmetic-colorant"], {"may-cause-allergy": 0.3}, ["ci 14700", "red 4"]),
    ("Zinc Oxide", "Zinc Oxide", "superstar", (0, 0), (0, 1), [], ["uv-filter", "soothing"], {"uv-protection": 1, "reduces-irritation": 0.5, "acne-fighting": 0.3}, []),
    ("Titanium Dioxide", "Titanium Dioxide (UV)", "goodie", (0, 0), (0, 0), [], ["uv-filter"], {"uv-protection": 1}, []),
    ("Urea", "Urea", "goodie", (0, 2), (0, 0), [], ["humectant", "exfoliating"], {"hydrating": 0.9, "exfoliating": 0.4, "good-for-dry-skin": 0.9}, []),
    ("Whey Protein", "Whey Protein", "neutral", I, I, ["is_animal_derived"], ["skin-conditioning"], {"hydrating": 0.3}, ["lac", "whey protein (lac)"]),
    ("Algae Extract", "Algae Extract", "goodie", (0, 1), (0, 1), [], ["skin-conditioning", "humectant"], {"hydrating": 0.5, "anti-aging": 0.3}, []),
    ("Sucrose", "Sucrose", "neutral", (0, 0), (0, 0), [], ["humectant", "soothing"], {}, []),
    ("Glycine", "Glycine", "goodie", (0, 0), (0, 0), [], ["humectant", "skin-conditioning"], {"hydrating": 0.4}, []),
    ("Dimethyl Isosorbide", "Dimethyl Isosorbide", "neutral", I, I, [], ["solvent"], {}, []),
    ("Beeswax", "Beeswax", "neutral", (0, 2), (0, 2), ["is_animal_derived", "is_fungal_acne_trigger"], ["emollient", "emulsion-stabilising"], {}, ["cera alba", "cire d'abeille"]),
    ("Lanolin", "Lanolin", "goodie", (0, 2), (0, 2), ["is_animal_derived", "is_fungal_acne_trigger"], ["emollient"], {"good-for-dry-skin": 0.8, "may-cause-allergy": 0.4}, []),
    ("Carmine", "Carmine", "neutral", I, I, ["is_animal_derived"], ["cosmetic-colorant"], {}, ["ci 75470"]),
    ("Limonene", "Limonene", "icky", (2, 4), I, ["is_eu_fragrance_allergen", "is_fragrance"], ["perfuming", "solvent"], {"may-cause-allergy": 0.8, "may-worsen-irritation": 0.5}, []),
    ("Linalool", "Linalool", "icky", (2, 4), I, ["is_eu_fragrance_allergen", "is_fragrance"], ["perfuming"], {"may-cause-allergy": 0.8, "may-worsen-irritation": 0.5}, []),
    ("Citronellol", "Citronellol", "icky", I, I, ["is_eu_fragrance_allergen", "is_fragrance"], ["perfuming"], {"may-cause-allergy": 0.7}, []),
    ("Geraniol", "Geraniol", "icky", I, I, ["is_eu_fragrance_allergen", "is_fragrance"], ["perfuming"], {"may-cause-allergy": 0.7}, []),
    ("Alcohol Denat.", "Denatured Alcohol", "icky", (2, 5), (0, 0), ["is_drying_alcohol"], ["solvent", "astringent"], {"may-worsen-dryness": 1, "may-worsen-irritation": 0.6, "good-for-oily-skin": 0.3}, ["alcohol denat", "sd alcohol 40", "sd alcohol 40-b", "denatured alcohol", "ethanol", "alcohol"]),
]


def slugify(s: str) -> str:
    s = re.sub(r"[^\w\s-]", "", s.lower()).strip()
    return re.sub(r"[\s_]+", "-", s)[:80]


def dsn() -> str:
    return os.environ["DATABASE_URL"].replace("postgresql+asyncpg://", "postgresql://").split("?")[0]


def main() -> None:
    conn = psycopg2.connect(dsn() + "?sslmode=require")
    conn.autocommit = True
    cur = conn.cursor()

    for slug in FUNCTIONS:
        cur.execute(
            "insert into gb_ingredient_functions (slug, name) values (%s, %s) on conflict (slug) do nothing",
            (slug, slug.replace("-", " ").title()),
        )
    for kind, rows in (("benefit", BENEFITS), ("concern", CONCERNS)):
        for slug, name, desc in rows:
            cur.execute(
                "insert into gb_effects (kind, slug, name, description) values (%s,%s,%s,%s) "
                "on conflict (slug) do update set name=excluded.name, description=excluded.description",
                (kind, slug, name, desc),
            )

    n = 0
    for inci, display, rating, irr, com, flags, funcs, effects, aliases in SEED:
        slug = slugify(inci)
        flag_cols = {f: True for f in flags}
        cur.execute(
            f"""insert into gb_ingredients
                 (slug, inci_name, display_name, rating,
                  irritancy_min, irritancy_max, comedogenicity_min, comedogenicity_max
                  {''.join(', ' + c for c in flag_cols)})
               values (%s,%s,%s,%s,%s,%s,%s,%s{',true' * len(flag_cols)})
               on conflict (slug) do update set
                 inci_name=excluded.inci_name, display_name=excluded.display_name,
                 rating=excluded.rating,
                 irritancy_min=excluded.irritancy_min, irritancy_max=excluded.irritancy_max,
                 comedogenicity_min=excluded.comedogenicity_min,
                 comedogenicity_max=excluded.comedogenicity_max,
                 updated_at=now()
                 {''.join(f', {c}=true' for c in flag_cols)}
               returning id""",
            (slug, inci, display, rating,
             irr[0] if irr else None, irr[1] if irr else None,
             com[0] if com else None, com[1] if com else None),
        )
        ing_id = cur.fetchone()[0]
        for a in {inci.lower(), *(x.lower() for x in aliases)}:
            cur.execute(
                "insert into gb_ingredient_aliases (alias, ingredient_id) values (%s,%s) on conflict (alias) do nothing",
                (a, ing_id),
            )
        for f in funcs:
            cur.execute(
                "insert into gb_ingredient_function_map (ingredient_id, function_id) "
                "select %s, id from gb_ingredient_functions where slug=%s on conflict do nothing",
                (ing_id, f),
            )
        for eslug, w in effects.items():
            cur.execute(
                "insert into gb_ingredient_effects (ingredient_id, effect_id, weight) "
                "select %s, id, %s from gb_effects where slug=%s "
                "on conflict (ingredient_id, effect_id) do update set weight=excluded.weight",
                (ing_id, w, eslug),
            )
        n += 1
    cur.execute("select count(*) from gb_ingredients")
    print(f"seeded/updated {n} curated ingredients; dictionary now {cur.fetchone()[0]} rows")


if __name__ == "__main__":
    main()
