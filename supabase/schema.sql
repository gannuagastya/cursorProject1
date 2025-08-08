-- Enable extensions
create extension if not exists pgcrypto;

-- Sellers table
create table if not exists public.sellers (
  id uuid primary key default gen_random_uuid(),
  handle text unique not null,
  name text not null,
  whatsapp text,
  currency_code text default 'USD',
  created_at timestamp with time zone default now()
);

-- Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.sellers(id) on delete cascade not null,
  title text not null,
  price_cents integer not null,
  sku text unique not null,
  stock integer not null default 0,
  image_urls text[] default '{}',
  active boolean not null default true,
  created_at timestamp with time zone default now()
);

-- Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.sellers(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  sku text not null,
  buyer_name text not null,
  phone text not null,
  address text,
  notes text,
  qty integer not null,
  price_cents integer not null,
  total_cents integer not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.sellers enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- RLS policies: allow anyone to read sellers/products; allow anyone to insert orders/products (MVP)
create policy if not exists sellers_read on public.sellers for select using (true);
create policy if not exists products_read on public.products for select using (true);
create policy if not exists orders_insert on public.orders for insert with check (true);
create policy if not exists products_insert on public.products for insert with check (true);

-- Seed one seller
insert into public.sellers (handle, name, whatsapp, currency_code)
values ('yourbrand', 'Your Saree Brand', '+15551234567', 'USD')
on conflict (handle) do update set name = excluded.name, whatsapp = excluded.whatsapp, currency_code = excluded.currency_code;