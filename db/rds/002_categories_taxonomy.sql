-- goBeauty category taxonomy: skincare + makeup trees for the category browse
-- pages (/products/<category-slug>, skinsort-style).
--
-- Idempotent: upserts by slug, so scraper-created flat categories ("Day
-- Moisturizers") get adopted into the tree instead of duplicated.
-- Apply (tunnel): psql "$RDS_DSN" -f db/rds/002_categories_taxonomy.sql

alter table public.gb_categories add column if not exists description text;

create or replace function pg_temp.gb_cat(
  p_slug text, p_name text, p_parent text, p_pos int, p_desc text
) returns void language plpgsql as $$
declare parent uuid;
begin
  if p_parent is not null then
    select id into parent from public.gb_categories where slug = p_parent;
  end if;
  insert into public.gb_categories (slug, name, parent_id, position, description)
  values (p_slug, p_name, parent, p_pos, p_desc)
  on conflict (slug) do update
    set name = excluded.name,
        parent_id = excluded.parent_id,
        position = excluded.position,
        description = coalesce(excluded.description, gb_categories.description);
end $$;

-- ── roots ────────────────────────────────────────────────────────────────────
select pg_temp.gb_cat('skincare', 'Skincare', null, 1,
  'Ingredient-checked skincare: every product decoded down to its INCI list, with benefit and concern analysis.');
select pg_temp.gb_cat('makeup', 'Makeup', null, 2,
  'Makeup with full ingredient transparency — what''s in your base, cheek, eye, and lip products and what it does for your skin.');
select pg_temp.gb_cat('haircare', 'Hair Care', null, 3,
  'Shampoos, conditioners, masks, and treatments with full ingredient transparency.');
select pg_temp.gb_cat('bodycare', 'Body Care', null, 4,
  'Body washes, lotions, hand and foot care — decoded by ingredients.');

-- ── skincare ────────────────────────────────────────────────────────────────
select pg_temp.gb_cat('moisturizers', 'Moisturizers', 'skincare', 1,
  'Creams, lotions, and gels that hydrate and lock in moisture — compared by ingredients, not marketing.');
select pg_temp.gb_cat('day-moisturizers', 'Day Moisturizers', 'moisturizers', 1,
  'Daytime moisturizers — lightweight hydration, often with SPF, that plays well under makeup.');
select pg_temp.gb_cat('night-moisturizers', 'Night Moisturizers', 'moisturizers', 2,
  'Richer overnight creams built around barrier repair and actives like retinol, peptides, and ceramides.');

select pg_temp.gb_cat('cleansers', 'Cleansers', 'skincare', 2,
  'Face washes, oils, balms, and micellar waters that remove dirt, oil, and makeup without wrecking your barrier.');
select pg_temp.gb_cat('makeup-removers', 'Makeup Removers', 'cleansers', 1,
  'Cleansing oils, balms, and micellar waters that dissolve makeup and sunscreen — ranked by ingredients and community rating.');
select pg_temp.gb_cat('face-washes', 'Face Washes', 'cleansers', 2,
  'Daily gel, foam, and cream cleansers.');

select pg_temp.gb_cat('serums-treatments', 'Serums & Treatments', 'skincare', 3,
  'Concentrated actives: serums, essences, ampoules, and targeted treatments.');
select pg_temp.gb_cat('serums', 'Serums', 'serums-treatments', 1,
  'Concentrated active serums — vitamin C, niacinamide, retinol, peptides, and hyaluronic acid — compared by ingredients, not marketing.');
select pg_temp.gb_cat('essences', 'Essences', 'serums-treatments', 2, null);
select pg_temp.gb_cat('facial-treatments', 'Facial Treatments', 'serums-treatments', 3, null);

select pg_temp.gb_cat('sunscreens', 'Sunscreens', 'skincare', 4,
  'Broad-spectrum SPF — mineral and chemical filters explained.');
select pg_temp.gb_cat('toners', 'Toners', 'skincare', 5,
  'Hydrating, exfoliating, and pH-balancing toners, mists, and toner pads — the prep step between cleansing and treatment, compared by ingredients.');
select pg_temp.gb_cat('exfoliators', 'Exfoliators', 'skincare', 6,
  'AHA, BHA, PHA, and physical exfoliants.');
select pg_temp.gb_cat('face-masks', 'Face Masks', 'skincare', 7, null);
select pg_temp.gb_cat('eye-care', 'Eye Care', 'skincare', 8,
  'Eye-area skincare — creams, gels, and serums for dark circles, puffiness, and fine lines.');
select pg_temp.gb_cat('eye-moisturizers', 'Eye Moisturizers', 'eye-care', 1,
  'Eye creams, gels, and serums that hydrate the eye area and target dark circles, puffiness, and crow''s feet — compared by ingredients.');
select pg_temp.gb_cat('eye-masks', 'Eye Masks', 'eye-care', 2,
  'Hydrogel patches, under-eye masks, and overnight eye treatments that de-puff, brighten, and firm — compared by ingredients.');
select pg_temp.gb_cat('lip-care', 'Lip Care', 'skincare', 9, null);
select pg_temp.gb_cat('face-oils', 'Face Oils', 'skincare', 10,
  'Facial oils — argan, rosehip, jojoba, squalane, and retinol oil blends that seal in moisture and nourish the barrier, compared by ingredients.');

-- ── makeup ──────────────────────────────────────────────────────────────────
select pg_temp.gb_cat('face-makeup', 'Face Makeup', 'makeup', 1,
  'Base products: foundations, tinted moisturizers, concealers, primers, and setting products.');
select pg_temp.gb_cat('foundations', 'Foundations', 'face-makeup', 1, null);
select pg_temp.gb_cat('bb-cc-tinted-moisturizers', 'BB, CC & Tinted Moisturizers', 'face-makeup', 2, null);
select pg_temp.gb_cat('concealers', 'Concealers', 'face-makeup', 3, null);
select pg_temp.gb_cat('makeup-primers', 'Makeup Primers', 'face-makeup', 4, null);
select pg_temp.gb_cat('setting-sprays-powders', 'Setting Sprays & Powders', 'face-makeup', 5, null);

select pg_temp.gb_cat('cheek-makeup', 'Cheek Makeup', 'makeup', 2,
  'Blushes, bronzers, contours, and highlighters.');
select pg_temp.gb_cat('blushes', 'Blushes', 'cheek-makeup', 1, null);
select pg_temp.gb_cat('bronzers', 'Bronzers', 'cheek-makeup', 2, null);
select pg_temp.gb_cat('highlighters', 'Highlighters', 'cheek-makeup', 3, null);

select pg_temp.gb_cat('eye-makeup', 'Eye Makeup', 'makeup', 3,
  'Mascaras, eyeliners, eyeshadows, and brow products.');
select pg_temp.gb_cat('lip-makeup', 'Lip Makeup', 'makeup', 4,
  'Lipsticks, glosses, liners, and tints.');

drop function pg_temp.gb_cat(text, text, text, int, text);
