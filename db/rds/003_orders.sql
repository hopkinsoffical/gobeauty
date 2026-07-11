-- First-party store orders (created 2026-07-11, applied to prod RDS).
create table if not exists gb_orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique not null default ('GB-' || upper(substr(md5(random()::text), 1, 8))),
  customer_name text not null,
  email text not null,
  phone text,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  zip text not null,
  subtotal_cents int not null,
  status text not null default 'pending_payment',
  payment_method text not null default 'invoice',
  notes text,
  created_at timestamptz not null default now()
);
create table if not exists gb_order_items (
  id bigserial primary key,
  order_id uuid not null references gb_orders(id) on delete cascade,
  product_id uuid not null references gb_products(id),
  product_slug text not null,
  product_name text not null,
  brand text not null,
  unit_price_cents int not null,
  qty int not null check (qty > 0 and qty <= 20)
);
create index if not exists gb_order_items_order_idx on gb_order_items(order_id);
