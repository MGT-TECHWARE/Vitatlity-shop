-- ============================================
-- PROFILES (extends Supabase Auth users)
-- ============================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- PRODUCTS
-- ============================================
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  images text[] default '{}',
  category text not null check (category in (
    'vitamins', 'weight-loss', 'protein', 'pre-workout',
    'post-workout', 'gut-health', 'bundles'
  )),
  supplement_facts jsonb,
  serving_instructions text,
  warnings text,
  stock integer not null default 0,
  sku text unique,
  tags text[] default '{}',
  dietary_flags text[] default '{}',
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  featured boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.products enable row level security;

create policy "Anyone can read active products"
  on public.products for select
  using (status = 'active');

-- ============================================
-- ORDERS
-- ============================================
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  subtotal numeric(10,2) not null,
  shipping_cost numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  status text not null default 'pending' check (status in (
    'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  )),
  payment_status text not null default 'unpaid' check (payment_status in (
    'unpaid', 'paid', 'failed', 'refunded'
  )),
  stripe_payment_intent_id text,
  shipping_address jsonb not null,
  tracking_number text,
  customer_email text not null,
  customer_name text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.orders enable row level security;

create policy "Users can read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- ============================================
-- ORDER ITEMS
-- ============================================
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  product_name text not null,
  quantity integer not null,
  unit_price numeric(10,2) not null,
  created_at timestamptz default now() not null
);

alter table public.order_items enable row level security;

create policy "Users can read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- ============================================
-- CART ITEMS (for future server-side cart)
-- ============================================
create table public.cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer not null default 1,
  created_at timestamptz default now() not null,
  unique(user_id, product_id)
);

alter table public.cart_items enable row level security;

create policy "Users can manage own cart"
  on public.cart_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================
-- REVIEWS
-- ============================================
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  comment text,
  verified_purchase boolean default false,
  created_at timestamptz default now() not null,
  unique(user_id, product_id)
);

alter table public.reviews enable row level security;

create policy "Anyone can read reviews"
  on public.reviews for select
  using (true);

create policy "Authenticated users can insert reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

-- ============================================
-- INDEXES
-- ============================================
create index idx_products_category on public.products(category);
create index idx_products_slug on public.products(slug);
create index idx_products_status on public.products(status);
create index idx_orders_user_id on public.orders(user_id);
create index idx_order_items_order_id on public.order_items(order_id);
create index idx_reviews_product_id on public.reviews(product_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================
create or replace function decrement_stock(p_id uuid, qty integer)
returns void as $$
begin
  update products set stock = stock - qty where id = p_id and stock >= qty;
end;
$$ language plpgsql security definer;

-- ============================================
-- STORAGE (run in Supabase dashboard or via API)
-- ============================================
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);
