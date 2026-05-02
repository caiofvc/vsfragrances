-- Vasconcelos Fragrances — schema do catálogo + pedidos
-- Rodar em: Supabase Dashboard → SQL Editor

-- Tipos
create type olfactory_family as enum (
  'amadeirado','citrico','floral','oriental','aromatico','doce','frutal'
);
create type gender as enum ('masculino','feminino','unissex');
create type order_status as enum (
  'pending','paid','processing','shipped','delivered','canceled','refunded'
);

-- Produtos (1 perfume = 1 linha)
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  inspiration text not null,
  description text not null,
  family olfactory_family not null,
  gender gender not null,
  top_notes text[] not null default '{}',
  heart_notes text[] not null default '{}',
  base_notes text[] not null default '{}',
  image_url text not null,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Variantes (tamanhos: 30/50/100ml)
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size_ml int not null check (size_ml > 0),
  price_cents int not null check (price_cents > 0),
  stock int not null default 0 check (stock >= 0),
  sku text unique not null,
  created_at timestamptz not null default now(),
  unique (product_id, size_ml)
);

create index on public.products (featured) where featured = true;
create index on public.products (family);
create index on public.products (gender);
create index on public.product_variants (product_id);

-- View pronta para consumo no front (1 produto + array de variantes)
create or replace view public.products_with_variants as
select
  p.id,
  p.slug,
  p.name,
  p.inspiration,
  p.description,
  p.family,
  p.gender,
  p.top_notes  as "topNotes",
  p.heart_notes as "heartNotes",
  p.base_notes as "baseNotes",
  p.image_url  as "imageUrl",
  p.featured,
  coalesce(
    (
      select json_agg(
        json_build_object(
          'id',         v.id,
          'sizeMl',     v.size_ml,
          'priceCents', v.price_cents,
          'stock',      v.stock,
          'sku',        v.sku
        ) order by v.size_ml
      )
      from public.product_variants v
      where v.product_id = p.id
    ),
    '[]'::json
  ) as variants
from public.products p
where p.active = true;

-- Pedidos
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  status order_status not null default 'pending',
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_zip text,
  shipping_address jsonb,
  subtotal_cents int not null,
  shipping_cents int not null default 0,
  total_cents int not null,
  payment_provider text not null default 'infinitepay',
  payment_reference text,
  payment_url text,
  notes text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  product_name text not null,
  size_ml int not null,
  unit_price_cents int not null,
  quantity int not null check (quantity > 0),
  line_total_cents int not null
);

create index on public.order_items (order_id);

-- Row Level Security
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Catálogo é público para leitura
create policy "products are viewable by everyone"
  on public.products for select using (active = true);

create policy "variants are viewable by everyone"
  on public.product_variants for select using (true);

-- Pedidos: clientes anônimos só conseguem inserir; leitura/atualização ficam para a service-role-key (usada no servidor).
create policy "anyone can place an order"
  on public.orders for insert with check (true);

create policy "anyone can attach items to a fresh order"
  on public.order_items for insert with check (true);
