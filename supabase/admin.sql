-- Vasconcelos Fragrances — schema da área admin
-- Rodar APÓS schema.sql

-- ---------------------------------------------------------------
-- 1. Tabela de administradores (referencia auth.users do Supabase)
-- ---------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Cada admin pode ler a tabela apenas para checar a si mesmo.
create policy "admin can read self"
  on public.admins for select
  using (auth.uid() = user_id);

-- Helper SQL: retorna true se o user atual é admin
create or replace function public.is_admin() returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;

-- ---------------------------------------------------------------
-- 2. Policies de escrita para o catálogo (admin pode tudo)
-- ---------------------------------------------------------------
create policy "admin manages products"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin manages variants"
  on public.product_variants for all
  using (public.is_admin())
  with check (public.is_admin());

-- Admin lê todos os pedidos (writes ficam na service-role-key)
create policy "admin reads orders"
  on public.orders for select
  using (public.is_admin());

create policy "admin reads order items"
  on public.order_items for select
  using (public.is_admin());

create policy "admin updates orders"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------
-- 3. Storage bucket para imagens dos produtos
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Qualquer pessoa pode ler imagens do bucket public products
create policy "public read product images"
  on storage.objects for select
  using (bucket_id = 'products');

-- Apenas admins podem fazer upload/delete
create policy "admin uploads product images"
  on storage.objects for insert
  with check (bucket_id = 'products' and public.is_admin());

create policy "admin updates product images"
  on storage.objects for update
  using (bucket_id = 'products' and public.is_admin());

create policy "admin deletes product images"
  on storage.objects for delete
  using (bucket_id = 'products' and public.is_admin());

-- ---------------------------------------------------------------
-- 4. Como criar o primeiro admin (manual, uma vez):
-- ---------------------------------------------------------------
-- a) Authentication → Users → Add user → preencha e-mail e senha do dono.
-- b) Copie o UUID do usuário criado e rode:
--      insert into public.admins (user_id, full_name)
--      values ('UUID-DO-USER', 'Seu Nome');
