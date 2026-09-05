-- ============================================================
-- Teluginti Mithai — Supabase (PostgreSQL) schema
-- Run this whole file in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ---------- tables ----------

create table if not exists public.products (
  id        text primary key,
  name      text not null,
  telugu    text default '',
  "desc"    text default '',
  price     integer not null default 0,
  unit      text default '',
  category  text not null,
  img       text default '',
  rating    numeric default 4.5,
  reviews   integer default 0,
  tag       text,
  available boolean default true
);

create table if not exists public.orders (
  id           text primary key,
  created_at   timestamptz not null,
  name         text not null,
  phone        text not null,
  email        text default '',
  address      text default '',
  landmark     text default '',
  city         text default '',
  pincode      text default '',
  instructions text default '',
  items        jsonb not null default '[]',
  subtotal     integer not null default 0,
  discount     integer not null default 0,
  delivery     integer not null default 0,
  total        integer not null default 0,
  payment      text not null default 'Cash on Delivery',
  status       text not null default 'Placed',
  admin_set    boolean default false
);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

create table if not exists public.reviews (
  id       text primary key,
  name     text not null,
  rating   integer not null check (rating between 1 and 5),
  "text"   text default '',
  date     date not null default current_date,
  approved boolean default false,
  hidden   boolean default false
);

create table if not exists public.offers (
  id     integer primary key default 1 check (id = 1),  -- single row
  title  text not null default 'Flat 10% OFF on All Items',
  code   text not null default 'TELUGU10',
  pct    integer not null default 10 check (pct between 0 and 100),
  start  date not null default current_date,
  "end"  date not null default (current_date + interval '1 year'),
  active boolean default true
);
insert into public.offers (id) values (1) on conflict (id) do nothing;

create table if not exists public.ledger (
  m      text primary key,          -- 'YYYY-MM'
  sales  integer not null default 0,
  orders integer not null default 0
);

-- ---------- row level security ----------
-- anon key (browser) can read the public catalogue and place
-- orders / reviews; the authenticated admin account gets full control.

alter table public.products enable row level security;
alter table public.orders   enable row level security;
alter table public.reviews  enable row level security;
alter table public.offers   enable row level security;
alter table public.ledger   enable row level security;

-- public read
create policy "public read products" on public.products for select using (true);
create policy "public read offers"   on public.offers   for select using (true);
create policy "public read ledger"   on public.ledger   for select using (true);
create policy "public read approved reviews" on public.reviews
  for select using (approved and not hidden);
-- orders are readable so the order-tracking page works with just an order id.
-- (Harden later if you want per-account tracking.)
create policy "public read orders" on public.orders for select using (true);

-- customers can create orders & reviews without an account
create policy "anyone can place an order" on public.orders for insert with check (true);
create policy "anyone can leave a review" on public.reviews for insert with check (true);

-- authenticated admin: full management rights
create policy "admin manages products" on public.products for all to authenticated using (true) with check (true);
create policy "admin manages orders"   on public.orders   for all to authenticated using (true) with check (true);
create policy "admin manages reviews"  on public.reviews  for all to authenticated using (true) with check (true);
create policy "admin manages offers"   on public.offers   for all to authenticated using (true) with check (true);
create policy "admin manages ledger"   on public.ledger   for all to authenticated using (true) with check (true);

-- ============================================================
-- NEXT STEP: create the admin login account
-- Supabase Dashboard → Authentication → Users → "Add user"
--   Email:    you@telugintimithai.com
--   Password: (a strong password you choose)
-- Then sign in at  /#/admin  with that email + password.
-- ============================================================
