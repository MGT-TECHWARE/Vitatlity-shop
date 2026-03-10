-- ============================================
-- MIGRATION 002: Dynamic Categories
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create categories table
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  icon text default 'grid',
  display_order integer default 0,
  created_at timestamptz default now() not null
);

alter table public.categories enable row level security;

-- Anyone can read categories
create policy "Anyone can read categories"
  on public.categories for select
  using (true);

-- Service role can manage categories (for admin operations)
create policy "Service role can manage categories"
  on public.categories for all
  using (true)
  with check (true);

create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_categories_display_order on public.categories(display_order);

-- 2. Remove the CHECK constraint on products.category
-- The constraint name may vary; this drops all check constraints on the category column
do $$
declare
  r record;
begin
  for r in (
    select con.conname
    from pg_constraint con
    join pg_attribute att on att.attnum = any(con.conkey) and att.attrelid = con.conrelid
    where con.conrelid = 'public.products'::regclass
      and att.attname = 'category'
      and con.contype = 'c'
  ) loop
    execute format('alter table public.products drop constraint %I', r.conname);
  end loop;
end $$;

-- 3. Seed with the existing categories
insert into public.categories (name, slug, icon, display_order) values
  ('Vitamins', 'vitamins', 'capsule', 1),
  ('Protein', 'protein', 'nutrition', 2),
  ('Pre-Workout', 'pre-workout', 'brain', 3),
  ('Post-Workout', 'post-workout', 'stethoscope', 4),
  ('Weight Loss', 'weight-loss', 'pill', 5),
  ('Gut Health', 'gut-health', 'shield', 6),
  ('Bundles', 'bundles', 'supplies', 7)
on conflict (slug) do nothing;
