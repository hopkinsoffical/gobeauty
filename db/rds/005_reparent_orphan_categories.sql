-- Adopt scraper-created flat categories into the skincare / makeup / haircare /
-- bodycare trees so /products?category=skincare (and siblings) return products.
-- Idempotent: only reparents when parent_id is currently null.
-- Apply (tunnel): psql "$RDS_DSN" -f db/rds/005_reparent_orphan_categories.sql

-- Ensure root categories exist (haircare / bodycare were missing from 002).
insert into public.gb_categories (slug, name, parent_id, position, description)
values
  ('skincare', 'Skincare', null, 1,
   'Ingredient-checked skincare: every product decoded down to its INCI list, with benefit and concern analysis.'),
  ('makeup', 'Makeup', null, 2,
   'Makeup with full ingredient transparency — what''s in your base, cheek, eye, and lip products and what it does for your skin.'),
  ('haircare', 'Hair Care', null, 3,
   'Shampoos, conditioners, masks, and treatments with full ingredient transparency.'),
  ('bodycare', 'Body Care', null, 4,
   'Body washes, lotions, hand and foot care — decoded by ingredients.')
on conflict (slug) do update
  set name = excluded.name,
      description = coalesce(excluded.description, gb_categories.description),
      position = excluded.position;

-- Helper: set parent when child is currently a root (parent_id is null).
create or replace function pg_temp.reparent(p_child text, p_parent text) returns void
language plpgsql as $$
declare pid uuid;
begin
  select id into pid from public.gb_categories where slug = p_parent;
  if pid is null then
    raise notice 'parent % missing — skip %', p_parent, p_child;
    return;
  end if;
  update public.gb_categories c
     set parent_id = pid
   where c.slug = p_child
     and c.parent_id is null
     and c.slug <> p_parent;
end $$;

-- ── skincare orphans ─────────────────────────────────────────────────────────
select pg_temp.reparent('skin-care', 'skincare');
select pg_temp.reparent('health-beauty', 'skincare');
select pg_temp.reparent('general-moisturizers', 'moisturizers');
select pg_temp.reparent('cream', 'moisturizers');
select pg_temp.reparent('lotion-moisturizer', 'moisturizers');
select pg_temp.reparent('neck-cream', 'moisturizers');
select pg_temp.reparent('facial-cleansers', 'cleansers');
select pg_temp.reparent('face-cleansers', 'cleansers');
select pg_temp.reparent('blackheads-remover', 'cleansers');
select pg_temp.reparent('serum', 'serums-treatments');
select pg_temp.reparent('ampoules', 'serums-treatments');
select pg_temp.reparent('ampoule', 'serums-treatments');
select pg_temp.reparent('essence', 'serums-treatments');
select pg_temp.reparent('sunscreen', 'sunscreens');
select pg_temp.reparent('suncream', 'sunscreens');
select pg_temp.reparent('toner', 'toners');
select pg_temp.reparent('skin-care-masks-peels', 'face-masks');
select pg_temp.reparent('eye-cream', 'eye-care');
select pg_temp.reparent('lip-balms', 'lip-care');
select pg_temp.reparent('lip-moisturizers', 'lip-care');

-- ── makeup orphans ───────────────────────────────────────────────────────────
select pg_temp.reparent('foundations-concealers', 'face-makeup');
select pg_temp.reparent('face-primers', 'face-makeup');
select pg_temp.reparent('face-primer', 'face-makeup');
select pg_temp.reparent('bb-cream', 'face-makeup');
select pg_temp.reparent('beauty-balm', 'face-makeup');
select pg_temp.reparent('lip-tint', 'lip-makeup');
select pg_temp.reparent('lip-glosses', 'lip-makeup');
select pg_temp.reparent('lip-stains', 'lip-makeup');
select pg_temp.reparent('lipsticks', 'lip-makeup');
select pg_temp.reparent('lip-cheek-stains', 'lip-makeup');
select pg_temp.reparent('eyebrows', 'eye-makeup');
select pg_temp.reparent('eyeshadows', 'eye-makeup');
select pg_temp.reparent('mascaras', 'eye-makeup');
select pg_temp.reparent('eyeliners', 'eye-makeup');
select pg_temp.reparent('lash-brow-serums', 'eye-makeup');
select pg_temp.reparent('contours', 'cheek-makeup');

-- ── haircare ─────────────────────────────────────────────────────────────────
select pg_temp.reparent('hair-care', 'haircare');
select pg_temp.reparent('hair-treatment', 'haircare');
select pg_temp.reparent('hair-accessories', 'haircare');

-- ── bodycare ─────────────────────────────────────────────────────────────────
select pg_temp.reparent('body-wash', 'bodycare');
select pg_temp.reparent('hand-cream', 'bodycare');
select pg_temp.reparent('foot-cream', 'bodycare');
select pg_temp.reparent('foot', 'bodycare');

drop function pg_temp.reparent(text, text);

-- Sanity: root rollup counts
select c.slug, c.name,
       (select count(*) from gb_products p
         where p.status <> 'discontinued'
           and p.category_id in (
             with recursive t as (
               select id from gb_categories where slug = c.slug
               union all
               select x.id from gb_categories x join t on x.parent_id = t.id
             ) select id from t
           )) as product_count
from gb_categories c
where c.slug in ('skincare', 'makeup', 'haircare', 'bodycare')
order by c.position;
