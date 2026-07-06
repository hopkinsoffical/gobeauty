-- goBeauty commerce + ingredient-intelligence schema (AWS RDS, shared `vforce` DB).
--
-- Tables are `gb_`-prefixed in public — the app role cannot create schemas on this
-- RDS, and salon_*/restr_* set the per-product-prefix precedent.
-- Model follows skinsort.com / incidecoder.com product pages:
--   product → ordered INCI list → ingredient dictionary → functions / effects,
--   with product-level badges and benefit/concern chips as *computed* aggregates.
-- Users authenticate against Supabase (auth.users); RDS stores their uuid only.
--
-- Apply (tunnel): psql "$RDS_DSN" -f db/rds/001_products_ingredients.sql

-- ── dictionaries ─────────────────────────────────────────────────────────────

create table if not exists public.gb_brands (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  website     text,
  country     text,
  description text,
  logo_url    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Category tree (Skincare > Moisturizers > Night Moisturizers, ...)
create table if not exists public.gb_categories (
  id        uuid primary key default gen_random_uuid(),
  slug      text not null unique,
  name      text not null,
  parent_id uuid references public.gb_categories (id) on delete set null,
  position  int  not null default 0
);
create index if not exists gb_categories_parent_idx on public.gb_categories (parent_id);

-- What-it-does vocabulary (solvent, humectant, emollient, preservative, ...)
create table if not exists public.gb_ingredient_functions (
  id   serial primary key,
  slug text not null unique,
  name text not null
);

-- Benefit / concern vocabulary. kind splits the two chip groups on the product
-- page ("Hydrating" vs "May Trigger Acne"); description is the chip subtitle.
create table if not exists public.gb_effects (
  id          serial primary key,
  kind        text not null check (kind in ('benefit', 'concern')),
  slug        text not null unique,
  name        text not null,
  description text
);

-- ── ingredient dictionary ────────────────────────────────────────────────────

create table if not exists public.gb_ingredients (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  inci_name           text not null,           -- canonical INCI, e.g. "Butyrospermum Parkii Butter"
  display_name        text,                    -- consumer name, e.g. "Shea Butter"
  description         text,                    -- editorial blurb (incidecoder-style)
  quick_facts         jsonb not null default '[]',  -- ["Strengthens, smooths, and brightens skin.", ...]
  rating              text check (rating in ('superstar','goodie','neutral','icky')),
  -- incidecoder publishes ranges ("irr. 0-3, com. 4-5"); null = unknown
  irritancy_min       smallint check (irritancy_min between 0 and 5),
  irritancy_max       smallint check (irritancy_max between 0 and 5),
  comedogenicity_min  smallint check (comedogenicity_min between 0 and 5),
  comedogenicity_max  smallint check (comedogenicity_max between 0 and 5),
  -- classification flags that drive the product-level "free from" badges
  is_paraben              boolean not null default false,
  is_sulfate              boolean not null default false,
  is_silicone             boolean not null default false,
  is_drying_alcohol       boolean not null default false,
  is_fragrance            boolean not null default false,
  is_essential_oil        boolean not null default false,
  is_oil                  boolean not null default false,
  is_eu_fragrance_allergen boolean not null default false,  -- "Worth noting" callout
  is_fungal_acne_trigger  boolean not null default false,
  is_reef_unsafe          boolean not null default false,
  is_animal_derived       boolean not null default false,   -- breaks vegan
  cas_number          text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- INCI spelling variants ("Water", "Aqua", "Eau", "Water (Aqua)") → one ingredient.
-- Ingredient-list parsing matches through here; keep aliases lower-cased.
create table if not exists public.gb_ingredient_aliases (
  alias         text primary key,
  ingredient_id uuid not null references public.gb_ingredients (id) on delete cascade
);
create index if not exists gb_ingredient_aliases_ingredient_idx
  on public.gb_ingredient_aliases (ingredient_id);

create table if not exists public.gb_ingredient_function_map (
  ingredient_id uuid not null references public.gb_ingredients (id) on delete cascade,
  function_id   int  not null references public.gb_ingredient_functions (id) on delete cascade,
  primary key (ingredient_id, function_id)
);

-- Which effects an ingredient contributes to; weight lets a hero active count
-- more than a trace ingredient when scoring products.
create table if not exists public.gb_ingredient_effects (
  ingredient_id uuid not null references public.gb_ingredients (id) on delete cascade,
  effect_id     int  not null references public.gb_effects (id) on delete cascade,
  weight        real not null default 1.0,
  primary key (ingredient_id, effect_id)
);

-- ── products ─────────────────────────────────────────────────────────────────

create table if not exists public.gb_products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,             -- "sk-ii/skinpower-advanced-cream" style: brand handled via join; keep slug flat
  brand_id        uuid not null references public.gb_brands (id),
  category_id     uuid references public.gb_categories (id),
  name            text not null,
  description     text,
  images          jsonb not null default '[]',      -- [{url, alt, position}]
  ingredients_raw text,                             -- original INCI string as printed on pack (source of truth for re-parses)
  size_label      text,                             -- "80g", "2.7 oz"
  upc             text,
  status          text not null default 'draft' check (status in ('draft','published','discontinued')),
  -- declared (not derivable from INCI) claims
  is_cruelty_free boolean,
  is_vegan        boolean,
  -- cached aggregates (recomputed from gb_product_ingredients; null = not yet computed)
  badge_flags     jsonb not null default '{}',      -- {"paraben_free":true,"fragrance_free":false,...} for chip row + filters
  rating_avg      numeric(3,2),
  rating_count    int not null default 0,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists gb_products_brand_idx    on public.gb_products (brand_id);
create index if not exists gb_products_category_idx on public.gb_products (category_id, status);
create index if not exists gb_products_badges_idx   on public.gb_products using gin (badge_flags);

-- Ordered INCI list. position 1 = highest concentration; the comparison UI and
-- "first five ingredients" analyses depend on the order.
create table if not exists public.gb_product_ingredients (
  product_id        uuid not null references public.gb_products (id) on delete cascade,
  ingredient_id     uuid not null references public.gb_ingredients (id),
  position          smallint not null,
  is_key_ingredient boolean not null default false,  -- "Key Ingredients" section
  note              text,                            -- e.g. "encapsulated", "0.5%claimed"
  primary key (product_id, ingredient_id),
  unique (product_id, position)
);
create index if not exists gb_product_ingredients_ingredient_idx
  on public.gb_product_ingredients (ingredient_id);

-- Product-level benefit/concern chips, materialized from ingredient effects.
-- ingredient_count is the little number on each skinsort chip ("Hydrating 8").
create table if not exists public.gb_product_effects (
  product_id       uuid not null references public.gb_products (id) on delete cascade,
  effect_id        int  not null references public.gb_effects (id) on delete cascade,
  ingredient_count int  not null,
  score            real not null default 0,          -- weight-sum; orders chips
  computed_at      timestamptz not null default now(),
  primary key (product_id, effect_id)
);

-- ── commerce ────────────────────────────────────────────────────────────────

-- Own-store sellable variants (size/shade). Shopify linkage goes in
-- external_refs ({"shopify": {"product_id":..., "variant_id":...}}) — same
-- pattern as the xiebaobao storefront.
create table if not exists public.gb_product_variants (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.gb_products (id) on delete cascade,
  sku           text unique,
  label         text not null,                     -- "50ml", "80g refill"
  price_cents   int  not null check (price_cents >= 0),
  currency      text not null default 'USD',
  compare_at_cents int,
  stock_qty     int,                               -- null = not inventory-tracked
  is_default    boolean not null default false,
  external_refs jsonb not null default '{}',
  status        text not null default 'active' check (status in ('active','hidden','sold_out')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists gb_product_variants_product_idx
  on public.gb_product_variants (product_id, status);

-- External "where to buy" offers (retailer/affiliate links shown under the
-- buy box; also price-comparison rows).
create table if not exists public.gb_product_offers (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.gb_products (id) on delete cascade,
  retailer    text not null,                       -- "Walmart", "Stylevana"
  url         text not null,
  price_cents int,
  currency    text not null default 'USD',
  in_stock    boolean,
  is_affiliate boolean not null default false,
  checked_at  timestamptz,
  unique (product_id, retailer, url)
);

-- ── reviews & comparison ────────────────────────────────────────────────────

-- user_id is the Supabase auth.users uuid (cross-DB — no FK possible here).
create table if not exists public.gb_product_reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.gb_products (id) on delete cascade,
  user_id     uuid not null,
  rating      smallint not null check (rating between 1 and 5),
  title       text,
  body        text,
  skin_type   text check (skin_type in ('oily','dry','combination','normal','sensitive')),
  status      text not null default 'pending' check (status in ('pending','published','rejected')),
  created_at  timestamptz not null default now(),
  unique (product_id, user_id)
);
create index if not exists gb_product_reviews_product_idx
  on public.gb_product_reviews (product_id, status);

-- Materialized dupe/similarity pairs ("Find dupes", "Similar products").
-- Store each unordered pair once with product_id < dupe_product_id.
create table if not exists public.gb_product_dupes (
  product_id      uuid not null references public.gb_products (id) on delete cascade,
  dupe_product_id uuid not null references public.gb_products (id) on delete cascade,
  shared_ingredients int not null,
  similarity      real not null,                   -- 0..1 (e.g. weighted Jaccard on INCI)
  computed_at     timestamptz not null default now(),
  primary key (product_id, dupe_product_id),
  check (product_id < dupe_product_id)
);

-- ── search ──────────────────────────────────────────────────────────────────

-- Fuzzy search wants pg_trgm, but installing an extension needs CREATE on the
-- database (vforce_app doesn't have it — ask jjiang/root to run:
--   CREATE EXTENSION pg_trgm;  then re-run this file for the trgm indexes).
-- Until then the btree indexes below cover exact/prefix lookups.
do $$
begin
  create extension if not exists pg_trgm;
exception when insufficient_privilege then
  raise warning 'pg_trgm not installed (needs db owner); skipping trigram indexes';
end $$;

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_trgm') then
    create index if not exists gb_products_name_trgm
      on public.gb_products using gin (name gin_trgm_ops);
    create index if not exists gb_ingredients_inci_trgm
      on public.gb_ingredients using gin (inci_name gin_trgm_ops);
  end if;
end $$;

create index if not exists gb_products_name_lower_idx
  on public.gb_products (lower(name) text_pattern_ops);
create index if not exists gb_ingredients_inci_lower_idx
  on public.gb_ingredients (lower(inci_name) text_pattern_ops);
