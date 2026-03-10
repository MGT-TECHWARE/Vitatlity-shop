-- ============================================
-- COMPLETE SETUP: Schema + Admin Profile + Real Products
-- Run this in Supabase SQL Editor (one time)
-- ============================================

-- ============================================
-- PROFILES (extends Supabase Auth users)
-- ============================================
create table if not exists public.profiles (
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
-- CATEGORIES (dynamic, managed by admin)
-- ============================================
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  icon text default 'grid',
  display_order integer default 0,
  created_at timestamptz default now() not null
);

alter table public.categories enable row level security;

create policy "Anyone can read categories"
  on public.categories for select
  using (true);

create policy "Service role can manage categories"
  on public.categories for all
  using (true)
  with check (true);

create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_categories_display_order on public.categories(display_order);

-- Seed default categories
insert into public.categories (name, slug, icon, display_order) values
  ('Vitamins', 'vitamins', 'capsule', 1),
  ('Protein', 'protein', 'nutrition', 2),
  ('Pre-Workout', 'pre-workout', 'brain', 3),
  ('Post-Workout', 'post-workout', 'stethoscope', 4),
  ('Weight Loss', 'weight-loss', 'pill', 5),
  ('Gut Health', 'gut-health', 'shield', 6),
  ('Bundles', 'bundles', 'supplies', 7)
on conflict (slug) do nothing;

-- ============================================
-- PRODUCTS
-- ============================================
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  images text[] default '{}',
  category text not null,
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

-- Allow service role full access to products (for admin operations)
create policy "Service role can manage products"
  on public.products for all
  using (true)
  with check (true);

-- ============================================
-- ORDERS
-- ============================================
create table if not exists public.orders (
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
create table if not exists public.order_items (
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
-- CART ITEMS
-- ============================================
create table if not exists public.cart_items (
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
create table if not exists public.reviews (
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
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_status on public.products(status);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_reviews_product_id on public.reviews(product_id);

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
-- ADMIN PROFILE
-- ============================================
insert into public.profiles (id, email, full_name, role)
values (
  '2d96ecb3-effb-41b1-abbf-51cbd0ab72de',
  'zackyviriot987@gmail.com',
  'Zack Viriot',
  'admin'
) on conflict (id) do update set role = 'admin', full_name = 'Zack Viriot';

-- ============================================
-- 10 REAL SUPPLEMENT PRODUCTS
-- ============================================

-- 1. Creatine Monohydrate
insert into public.products (name, slug, description, short_description, price, compare_at_price, category, stock, sku, status, featured, tags, dietary_flags, serving_instructions, warnings, supplement_facts) values (
  'Creatine Monohydrate 5000mg',
  'creatine-monohydrate-5000mg',
  'Micronized creatine monohydrate for enhanced strength, power output, and muscle recovery. Each serving delivers 5g of pure creatine to help saturate your muscles and support ATP production during high-intensity training. Third-party tested for purity and potency.',
  'Pure micronized creatine for strength and power.',
  29.99,
  39.99,
  'protein',
  200,
  'VIT-CRE-001',
  'active',
  true,
  ARRAY['creatine', 'muscle', 'strength', 'recovery', 'performance'],
  ARRAY['gluten-free', 'vegan', 'sugar-free', 'soy-free'],
  'Mix 1 scoop (5g) with 8-10 oz of water or your favorite beverage. Take daily, preferably post-workout on training days.',
  'Consult your healthcare provider before use if you are pregnant, nursing, or taking medication. Keep out of reach of children.',
  '{"serving_size": "1 scoop (5g)", "servings_per_container": 60, "nutrients": [{"name": "Creatine Monohydrate", "amount": "5g", "daily_value": null}]}'::jsonb
);

-- 2. Whey Protein Isolate
insert into public.products (name, slug, description, short_description, price, compare_at_price, category, stock, sku, status, featured, tags, dietary_flags, serving_instructions, warnings, supplement_facts) values (
  'Whey Protein Isolate - Chocolate',
  'whey-protein-isolate-chocolate',
  'Premium cold-filtered whey protein isolate with 27g of protein per serving and less than 1g of sugar. Fast-absorbing formula ideal for post-workout recovery. Rich chocolate flavor with no artificial colors or fillers. 90% protein by weight.',
  '27g protein per serving, ultra-filtered whey isolate.',
  54.99,
  69.99,
  'protein',
  150,
  'VIT-WPI-002',
  'active',
  true,
  ARRAY['protein', 'whey', 'isolate', 'muscle', 'recovery', 'chocolate'],
  ARRAY['gluten-free', 'soy-free'],
  'Mix 1 scoop with 6-8 oz of cold water or milk. Consume within 30 minutes post-workout or as a protein supplement between meals.',
  'Contains milk. Manufactured in a facility that processes tree nuts, soy, and wheat. Consult a physician before use if you have any medical conditions.',
  '{"serving_size": "1 scoop (33g)", "servings_per_container": 30, "nutrients": [{"name": "Calories", "amount": "120", "daily_value": null}, {"name": "Protein", "amount": "27g", "daily_value": "54%"}, {"name": "Total Fat", "amount": "0.5g", "daily_value": "1%"}, {"name": "Total Carbohydrate", "amount": "2g", "daily_value": "1%"}, {"name": "Sugar", "amount": "<1g", "daily_value": null}]}'::jsonb
);

-- 3. Pre-Workout Formula
insert into public.products (name, slug, description, short_description, price, compare_at_price, category, stock, sku, status, featured, tags, dietary_flags, serving_instructions, warnings, supplement_facts) values (
  'Nitro Surge Pre-Workout',
  'nitro-surge-pre-workout',
  'Scientifically dosed pre-workout formula with 200mg caffeine, 3.2g beta-alanine, 6g L-citrulline, and 1.5g betaine for explosive energy, enhanced blood flow, and laser focus. No proprietary blends — every ingredient fully disclosed.',
  'Full-dose pre-workout for energy, pump, and focus.',
  39.99,
  49.99,
  'pre-workout',
  175,
  'VIT-PRE-003',
  'active',
  true,
  ARRAY['pre-workout', 'energy', 'pump', 'focus', 'caffeine', 'citrulline'],
  ARRAY['gluten-free', 'sugar-free', 'vegan'],
  'Mix 1 scoop with 8-12 oz of cold water 20-30 minutes before training. Assess tolerance with half a scoop first. Do not exceed 1 scoop in a 24-hour period.',
  'Contains 200mg of caffeine per serving. Do not use if you are sensitive to stimulants. Not intended for individuals under 18. Consult a healthcare professional before use.',
  '{"serving_size": "1 scoop (14g)", "servings_per_container": 30, "nutrients": [{"name": "L-Citrulline", "amount": "6g", "daily_value": null}, {"name": "Beta-Alanine", "amount": "3.2g", "daily_value": null}, {"name": "Betaine Anhydrous", "amount": "1.5g", "daily_value": null}, {"name": "Caffeine Anhydrous", "amount": "200mg", "daily_value": null}, {"name": "L-Theanine", "amount": "100mg", "daily_value": null}]}'::jsonb
);

-- 4. BCAA Recovery Complex
insert into public.products (name, slug, description, short_description, price, compare_at_price, category, stock, sku, status, featured, tags, dietary_flags, serving_instructions, warnings, supplement_facts) values (
  'BCAA Recovery Complex',
  'bcaa-recovery-complex',
  'Branched-chain amino acids in a 2:1:1 ratio (leucine, isoleucine, valine) with added electrolytes and coconut water powder. Supports muscle protein synthesis, reduces exercise-induced muscle soreness, and keeps you hydrated during intense sessions.',
  'BCAAs with electrolytes for recovery and hydration.',
  34.99,
  44.99,
  'post-workout',
  160,
  'VIT-BCA-004',
  'active',
  false,
  ARRAY['bcaa', 'recovery', 'amino acids', 'hydration', 'electrolytes'],
  ARRAY['gluten-free', 'vegan', 'sugar-free', 'soy-free'],
  'Mix 1 scoop with 10-14 oz of cold water. Sip during or after workouts. Can also be consumed throughout the day to support recovery.',
  'Consult your healthcare provider before use if you are pregnant, nursing, or taking medication. Not intended for individuals under 18.',
  '{"serving_size": "1 scoop (12g)", "servings_per_container": 30, "nutrients": [{"name": "L-Leucine", "amount": "3g", "daily_value": null}, {"name": "L-Isoleucine", "amount": "1.5g", "daily_value": null}, {"name": "L-Valine", "amount": "1.5g", "daily_value": null}, {"name": "Coconut Water Powder", "amount": "500mg", "daily_value": null}, {"name": "Sodium", "amount": "200mg", "daily_value": "9%"}, {"name": "Potassium", "amount": "100mg", "daily_value": "2%"}]}'::jsonb
);

-- 5. Vitamin D3 + K2
insert into public.products (name, slug, description, short_description, price, compare_at_price, category, stock, sku, status, featured, tags, dietary_flags, serving_instructions, warnings, supplement_facts) values (
  'Vitamin D3 + K2 Complex',
  'vitamin-d3-k2-complex',
  'High-potency Vitamin D3 (5000 IU) paired with Vitamin K2 (MK-7, 100mcg) for optimal calcium absorption and bone health. D3 supports immune function, mood regulation, and overall wellness, while K2 directs calcium to your bones instead of arteries.',
  'D3 5000 IU + K2 for bone and immune health.',
  24.99,
  34.99,
  'vitamins',
  250,
  'VIT-D3K-005',
  'active',
  true,
  ARRAY['vitamin d', 'vitamin k2', 'bone health', 'immune', 'wellness'],
  ARRAY['gluten-free', 'soy-free', 'non-gmo'],
  'Take 1 softgel daily with a meal containing fat for best absorption.',
  'Consult your healthcare provider before use if you are taking blood thinners (warfarin) or have any medical condition. Keep out of reach of children.',
  '{"serving_size": "1 softgel", "servings_per_container": 120, "nutrients": [{"name": "Vitamin D3 (Cholecalciferol)", "amount": "5000 IU (125mcg)", "daily_value": "625%"}, {"name": "Vitamin K2 (MK-7)", "amount": "100mcg", "daily_value": "83%"}]}'::jsonb
);

-- 6. Magnesium Glycinate
insert into public.products (name, slug, description, short_description, price, compare_at_price, category, stock, sku, status, featured, tags, dietary_flags, serving_instructions, warnings, supplement_facts) values (
  'Magnesium Glycinate 400mg',
  'magnesium-glycinate-400mg',
  'Chelated magnesium glycinate for superior absorption and gentle digestion. Supports muscle relaxation, quality sleep, stress management, and over 300 enzymatic reactions in the body. Glycinate form is the most bioavailable and least likely to cause GI discomfort.',
  'Highly absorbable magnesium for sleep and recovery.',
  22.99,
  29.99,
  'vitamins',
  220,
  'VIT-MAG-006',
  'active',
  false,
  ARRAY['magnesium', 'sleep', 'relaxation', 'recovery', 'stress'],
  ARRAY['gluten-free', 'vegan', 'soy-free', 'non-gmo'],
  'Take 2 capsules daily, preferably in the evening with or without food.',
  'Consult your healthcare provider before use if you are pregnant, nursing, have kidney disease, or take any medications.',
  '{"serving_size": "2 capsules", "servings_per_container": 60, "nutrients": [{"name": "Magnesium (as Magnesium Glycinate)", "amount": "400mg", "daily_value": "95%"}]}'::jsonb
);

-- 7. Omega-3 Fish Oil
insert into public.products (name, slug, description, short_description, price, compare_at_price, category, stock, sku, status, featured, tags, dietary_flags, serving_instructions, warnings, supplement_facts) values (
  'Triple Strength Omega-3 Fish Oil',
  'triple-strength-omega-3',
  'Molecularly distilled fish oil concentrate providing 2400mg of omega-3 fatty acids per serving (1400mg EPA, 1000mg DHA). Sourced from wild-caught fish, tested for heavy metals and contaminants. Enteric-coated softgels for no fishy aftertaste.',
  'High-potency EPA/DHA for heart and brain health.',
  32.99,
  42.99,
  'vitamins',
  180,
  'VIT-OMG-007',
  'active',
  false,
  ARRAY['omega-3', 'fish oil', 'EPA', 'DHA', 'heart health', 'brain health'],
  ARRAY['gluten-free', 'soy-free', 'non-gmo'],
  'Take 2 softgels daily with a meal. For best results, take with your largest meal of the day.',
  'Contains fish (anchovy, sardine, mackerel). Consult your healthcare provider before use if you are taking blood thinners or have a fish allergy.',
  '{"serving_size": "2 softgels", "servings_per_container": 45, "nutrients": [{"name": "Total Omega-3 Fatty Acids", "amount": "2400mg", "daily_value": null}, {"name": "EPA (Eicosapentaenoic Acid)", "amount": "1400mg", "daily_value": null}, {"name": "DHA (Docosahexaenoic Acid)", "amount": "1000mg", "daily_value": null}]}'::jsonb
);

-- 8. Probiotic 50 Billion CFU
insert into public.products (name, slug, description, short_description, price, compare_at_price, category, stock, sku, status, featured, tags, dietary_flags, serving_instructions, warnings, supplement_facts) values (
  'Probiotic 50 Billion CFU',
  'probiotic-50-billion-cfu',
  '16-strain probiotic blend with 50 billion CFU per capsule. Includes clinically studied Lactobacillus and Bifidobacterium strains for digestive balance, immune support, and gut barrier integrity. Shelf-stable — no refrigeration required. Delayed-release capsules survive stomach acid.',
  '16 strains, 50B CFU for complete gut health.',
  36.99,
  46.99,
  'gut-health',
  140,
  'VIT-PRO-008',
  'active',
  true,
  ARRAY['probiotic', 'gut health', 'digestion', 'immune', 'microbiome'],
  ARRAY['gluten-free', 'vegan', 'soy-free', 'dairy-free'],
  'Take 1 capsule daily with or without food. For intensive support, take 2 capsules daily for the first 2 weeks.',
  'Consult your healthcare provider before use if you are immunocompromised or have a serious medical condition. Store in a cool, dry place.',
  '{"serving_size": "1 capsule", "servings_per_container": 30, "nutrients": [{"name": "Probiotic Blend (16 strains)", "amount": "50 Billion CFU", "daily_value": null}, {"name": "Lactobacillus acidophilus", "amount": "12.5B CFU", "daily_value": null}, {"name": "Bifidobacterium lactis", "amount": "10B CFU", "daily_value": null}, {"name": "Lactobacillus rhamnosus", "amount": "7.5B CFU", "daily_value": null}]}'::jsonb
);

-- 9. Ashwagandha KSM-66
insert into public.products (name, slug, description, short_description, price, compare_at_price, category, stock, sku, status, featured, tags, dietary_flags, serving_instructions, warnings, supplement_facts) values (
  'Ashwagandha KSM-66 600mg',
  'ashwagandha-ksm66-600mg',
  'Full-spectrum ashwagandha root extract standardized to 5% withanolides using the KSM-66 process. Clinically proven to reduce cortisol levels by up to 27%, support healthy stress response, improve sleep quality, and enhance physical performance and endurance.',
  'Clinically studied adaptogen for stress and performance.',
  27.99,
  36.99,
  'vitamins',
  190,
  'VIT-ASH-009',
  'active',
  false,
  ARRAY['ashwagandha', 'stress', 'adaptogen', 'cortisol', 'sleep', 'performance'],
  ARRAY['gluten-free', 'vegan', 'soy-free', 'non-gmo'],
  'Take 1 capsule twice daily with meals, or 2 capsules once daily. Best taken consistently for at least 4-6 weeks for optimal results.',
  'Consult your healthcare provider before use if you are pregnant, nursing, have thyroid conditions, or are taking sedatives or immunosuppressants.',
  '{"serving_size": "2 capsules", "servings_per_container": 30, "nutrients": [{"name": "KSM-66 Ashwagandha Root Extract", "amount": "600mg", "daily_value": null}, {"name": "Withanolides (5%)", "amount": "30mg", "daily_value": null}, {"name": "BioPerine Black Pepper Extract", "amount": "5mg", "daily_value": null}]}'::jsonb
);

-- 10. Electrolyte Hydration Mix
insert into public.products (name, slug, description, short_description, price, compare_at_price, category, stock, sku, status, featured, tags, dietary_flags, serving_instructions, warnings, supplement_facts) values (
  'Electrolyte Hydration Mix',
  'electrolyte-hydration-mix',
  'Zero-sugar electrolyte powder with optimal ratios of sodium, potassium, and magnesium based on the latest hydration science. Contains 1000mg sodium, 200mg potassium, and 60mg magnesium per stick. Perfect for athletes, fasting, keto, or anyone needing proper hydration without the sugar.',
  'Zero-sugar electrolytes for optimal hydration.',
  24.99,
  32.99,
  'post-workout',
  300,
  'VIT-ELH-010',
  'active',
  true,
  ARRAY['electrolytes', 'hydration', 'sodium', 'potassium', 'keto', 'fasting'],
  ARRAY['gluten-free', 'vegan', 'sugar-free', 'keto-friendly', 'soy-free'],
  'Mix 1 stick pack with 16-32 oz of water. Adjust water amount to taste preference. Use during exercise, fasting, or any time you need hydration support.',
  'Consult your healthcare provider before use if you are on a sodium-restricted diet, have kidney disease, or take blood pressure medication.',
  '{"serving_size": "1 stick pack (6g)", "servings_per_container": 30, "nutrients": [{"name": "Sodium", "amount": "1000mg", "daily_value": "43%"}, {"name": "Potassium", "amount": "200mg", "daily_value": "4%"}, {"name": "Magnesium", "amount": "60mg", "daily_value": "14%"}, {"name": "Chloride", "amount": "1500mg", "daily_value": "65%"}, {"name": "Calories", "amount": "0", "daily_value": null}, {"name": "Sugar", "amount": "0g", "daily_value": null}]}'::jsonb
);
