-- Sample product data for development
INSERT INTO public.products (name, slug, description, short_description, price, compare_at_price, images, category, supplement_facts, serving_instructions, warnings, stock, sku, tags, dietary_flags, status, featured) VALUES

-- VITAMINS & MINERALS
('Daily Multivitamin Complex', 'daily-multivitamin-complex',
  'A comprehensive daily multivitamin with 25 essential vitamins and minerals to support overall health. Formulated with bioavailable forms for maximum absorption.',
  'Complete daily nutrition in one tablet',
  29.99, 34.99, '{}', 'vitamins',
  '{"serving_size": "1 tablet", "servings_per_container": 90, "nutrients": [{"name": "Vitamin A", "amount": "900 mcg", "daily_value": "100%"}, {"name": "Vitamin C", "amount": "90 mg", "daily_value": "100%"}, {"name": "Vitamin D3", "amount": "50 mcg", "daily_value": "250%"}, {"name": "Vitamin E", "amount": "15 mg", "daily_value": "100%"}, {"name": "Zinc", "amount": "11 mg", "daily_value": "100%"}, {"name": "Iron", "amount": "18 mg", "daily_value": "100%"}], "other_ingredients": "Cellulose, stearic acid, silicon dioxide"}',
  'Take 1 tablet daily with food and water.', 'Keep out of reach of children. Do not exceed recommended dose.',
  250, 'VIT-MULTI-90', '{"Best Seller"}', '{"Non-GMO", "Gluten-Free"}', 'active', true),

('Vitamin D3 + K2', 'vitamin-d3-k2',
  'High-potency Vitamin D3 (5000 IU) paired with Vitamin K2 (MK-7) for optimal calcium absorption and bone health support.',
  'Sunshine vitamin with K2 for bone health',
  24.99, NULL, '{}', 'vitamins',
  '{"serving_size": "1 softgel", "servings_per_container": 120, "nutrients": [{"name": "Vitamin D3", "amount": "125 mcg (5000 IU)", "daily_value": "625%"}, {"name": "Vitamin K2 (MK-7)", "amount": "100 mcg", "daily_value": "83%"}], "other_ingredients": "Olive oil, softgel capsule (gelatin, glycerin, water)"}',
  'Take 1 softgel daily with a meal containing fat.', 'Consult your physician if taking blood thinners.',
  180, 'VIT-D3K2-120', '{"New Arrival"}', '{"Gluten-Free", "Soy-Free"}', 'active', false),

('Magnesium Glycinate 400mg', 'magnesium-glycinate-400',
  'Highly bioavailable magnesium glycinate for muscle relaxation, sleep support, and nervous system health. Gentle on the stomach.',
  'Premium magnesium for relaxation and sleep',
  27.99, NULL, '{}', 'vitamins',
  '{"serving_size": "2 capsules", "servings_per_container": 60, "nutrients": [{"name": "Magnesium (as Magnesium Glycinate)", "amount": "400 mg", "daily_value": "95%"}], "other_ingredients": "Vegetable cellulose capsule, rice flour"}',
  'Take 2 capsules in the evening with or without food.', 'If pregnant, nursing, or taking medications, consult your physician.',
  200, 'VIT-MAG-120', '{}', '{"Vegan", "Gluten-Free", "Non-GMO"}', 'active', false),

-- WEIGHT LOSS
('Thermogenic Fat Burner', 'thermogenic-fat-burner',
  'Advanced thermogenic formula with green tea extract, caffeine, and L-carnitine to boost metabolism and support fat loss. Designed for active individuals.',
  'Metabolism-boosting fat loss support',
  39.99, 49.99, '{}', 'weight-loss',
  '{"serving_size": "2 capsules", "servings_per_container": 30, "nutrients": [{"name": "Green Tea Extract (50% EGCG)", "amount": "500 mg"}, {"name": "Caffeine Anhydrous", "amount": "200 mg"}, {"name": "L-Carnitine Tartrate", "amount": "500 mg"}, {"name": "Cayenne Pepper Extract", "amount": "100 mg"}, {"name": "Black Pepper Extract (BioPerine)", "amount": "5 mg"}], "other_ingredients": "Vegetable cellulose capsule, magnesium stearate"}',
  'Take 2 capsules 30 minutes before exercise. Do not take within 6 hours of bedtime.', 'Contains 200mg caffeine per serving. Not for those sensitive to stimulants. Not intended for those under 18.',
  150, 'WL-THERMO-60', '{"Best Seller"}', '{"Vegan", "Gluten-Free"}', 'active', true),

('Apple Cider Vinegar Gummies', 'apple-cider-vinegar-gummies',
  'Delicious apple-flavored ACV gummies with the Mother. Supports digestion, weight management, and healthy blood sugar levels.',
  'Tasty ACV gummies for digestive support',
  19.99, NULL, '{}', 'weight-loss',
  '{"serving_size": "2 gummies", "servings_per_container": 30, "nutrients": [{"name": "Apple Cider Vinegar", "amount": "500 mg"}, {"name": "Vitamin B12", "amount": "1.2 mcg", "daily_value": "50%"}, {"name": "Folic Acid", "amount": "200 mcg", "daily_value": "50%"}], "other_ingredients": "Organic tapioca syrup, water, pectin, citric acid, natural apple flavor"}',
  'Chew 2 gummies daily. Can be taken with or without food.', 'Keep out of reach of children.',
  300, 'WL-ACV-60', '{"New Arrival"}', '{"Vegan", "Organic", "Gluten-Free"}', 'active', false),

-- PROTEIN
('Whey Protein Isolate - Vanilla', 'whey-protein-isolate-vanilla',
  'Ultra-pure whey protein isolate with 27g protein per serving. Fast-absorbing, low-fat, and low-carb. Perfect for post-workout recovery.',
  '27g pure protein per scoop',
  54.99, 64.99, '{}', 'protein',
  '{"serving_size": "1 scoop (33g)", "servings_per_container": 30, "nutrients": [{"name": "Calories", "amount": "120"}, {"name": "Protein", "amount": "27 g"}, {"name": "Total Fat", "amount": "0.5 g"}, {"name": "Total Carbohydrate", "amount": "2 g"}, {"name": "Sodium", "amount": "90 mg", "daily_value": "4%"}], "other_ingredients": "Whey protein isolate, natural vanilla flavor, sunflower lecithin, stevia extract"}',
  'Mix 1 scoop with 8-10 oz of water or milk. Shake well.', 'Contains milk. Manufactured in a facility that also processes soy, egg, wheat, and tree nuts.',
  120, 'PRO-WPI-VAN-30', '{"Best Seller"}', '{"Gluten-Free"}', 'active', true),

('Plant Protein Blend - Chocolate', 'plant-protein-blend-chocolate',
  'Organic plant protein blend from pea, brown rice, and hemp proteins. 24g protein per serving with a rich chocolate flavor.',
  'Organic plant-powered protein',
  49.99, NULL, '{}', 'protein',
  '{"serving_size": "1 scoop (38g)", "servings_per_container": 25, "nutrients": [{"name": "Calories", "amount": "140"}, {"name": "Protein", "amount": "24 g"}, {"name": "Total Fat", "amount": "2.5 g"}, {"name": "Total Carbohydrate", "amount": "5 g"}, {"name": "Fiber", "amount": "3 g"}], "other_ingredients": "Organic pea protein, organic brown rice protein, organic hemp protein, organic cocoa powder, organic stevia"}',
  'Mix 1 scoop with 10-12 oz of water or plant milk.', 'Manufactured in a facility that processes tree nuts.',
  90, 'PRO-PLANT-CHOC-25', '{}', '{"Vegan", "Organic", "Gluten-Free", "Soy-Free", "Non-GMO"}', 'active', false),

-- PRE-WORKOUT
('Pre-Workout Ignite', 'pre-workout-ignite',
  'Explosive energy, laser focus, and enhanced performance. Featuring citrulline malate, beta-alanine, and 300mg caffeine for intense workouts.',
  'Explosive energy for peak performance',
  44.99, NULL, '{}', 'pre-workout',
  '{"serving_size": "1 scoop (12g)", "servings_per_container": 30, "nutrients": [{"name": "L-Citrulline Malate", "amount": "6 g"}, {"name": "Beta-Alanine", "amount": "3.2 g"}, {"name": "Caffeine Anhydrous", "amount": "300 mg"}, {"name": "L-Theanine", "amount": "100 mg"}, {"name": "Vitamin B12", "amount": "500 mcg", "daily_value": "20833%"}], "other_ingredients": "Citric acid, natural flavors, silicon dioxide, sucralose"}',
  'Mix 1 scoop with 8-12 oz water. Consume 20-30 minutes before training.', 'Contains 300mg caffeine. Do not exceed 1 scoop in 24 hours. Not for those under 18.',
  175, 'PW-IGNITE-30', '{"Best Seller"}', '{"Vegan", "Gluten-Free", "Sugar-Free"}', 'active', true),

-- POST-WORKOUT
('BCAA Recovery Complex', 'bcaa-recovery-complex',
  'Branched-chain amino acids in the optimal 2:1:1 ratio with added electrolytes. Supports muscle recovery and reduces post-workout soreness.',
  'Optimal recovery with BCAAs + electrolytes',
  34.99, 39.99, '{}', 'post-workout',
  '{"serving_size": "1 scoop (10g)", "servings_per_container": 30, "nutrients": [{"name": "L-Leucine", "amount": "3 g"}, {"name": "L-Isoleucine", "amount": "1.5 g"}, {"name": "L-Valine", "amount": "1.5 g"}, {"name": "Sodium", "amount": "200 mg"}, {"name": "Potassium", "amount": "100 mg"}, {"name": "Magnesium", "amount": "50 mg"}], "other_ingredients": "Citric acid, natural flavors, stevia, silicon dioxide"}',
  'Mix 1 scoop with 10-12 oz water. Consume during or after exercise.', 'If pregnant, nursing, or taking medications, consult your physician.',
  130, 'PW-BCAA-30', '{}', '{"Vegan", "Gluten-Free", "Sugar-Free", "Non-GMO"}', 'active', false),

-- GUT HEALTH
('Probiotic 50 Billion CFU', 'probiotic-50-billion',
  '16-strain probiotic with 50 billion CFU for comprehensive digestive support. Shelf-stable formula with delayed-release capsules for maximum survival.',
  '16 strains for complete gut health',
  36.99, NULL, '{}', 'gut-health',
  '{"serving_size": "1 capsule", "servings_per_container": 30, "nutrients": [{"name": "Probiotic Blend (16 strains)", "amount": "50 Billion CFU"}], "other_ingredients": "Vegetable cellulose capsule, rice flour, silicon dioxide"}',
  'Take 1 capsule daily with or without food. Refrigeration recommended but not required.', 'If you have a compromised immune system, consult your physician before use.',
  200, 'GH-PROB-30', '{"Best Seller"}', '{"Vegan", "Gluten-Free", "Dairy-Free", "Soy-Free", "Non-GMO"}', 'active', true),

('Digestive Enzyme Complex', 'digestive-enzyme-complex',
  'Full-spectrum digestive enzyme blend to help break down proteins, fats, carbs, and fiber. Reduces bloating and supports nutrient absorption.',
  'Complete enzyme support for digestion',
  28.99, NULL, '{}', 'gut-health',
  '{"serving_size": "1 capsule", "servings_per_container": 90, "nutrients": [{"name": "Protease Blend", "amount": "40,000 HUT"}, {"name": "Lipase", "amount": "3,000 FIP"}, {"name": "Amylase", "amount": "15,000 DU"}, {"name": "Cellulase", "amount": "1,000 CU"}, {"name": "Lactase", "amount": "1,000 ALU"}], "other_ingredients": "Vegetable cellulose capsule, rice flour"}',
  'Take 1 capsule with each meal.', 'If pregnant, nursing, or taking medications, consult your physician.',
  160, 'GH-ENZYME-90', '{}', '{"Vegan", "Gluten-Free", "Non-GMO"}', 'active', false),

-- BUNDLES
('Lean Body Stack', 'lean-body-stack',
  'The ultimate fat loss bundle: Thermogenic Fat Burner + Whey Protein Isolate + BCAA Recovery. Save 20% vs buying separately. Everything you need to get lean.',
  'Complete fat loss + muscle preservation bundle',
  99.99, 129.97, '{}', 'bundles',
  NULL,
  'See individual product labels for serving instructions.', 'See individual product labels for warnings.',
  50, 'BUN-LEAN-01', '{"Best Seller", "Limited Edition"}', '{"Gluten-Free"}', 'active', true),

('Wellness Essentials Kit', 'wellness-essentials-kit',
  'Daily wellness starter pack: Multivitamin + Probiotic 50 Billion + Vitamin D3/K2. Three foundational supplements at 25% off.',
  'Your daily wellness foundation',
  67.99, 91.97, '{}', 'bundles',
  NULL,
  'See individual product labels for serving instructions.', 'See individual product labels for warnings.',
  75, 'BUN-WELL-01', '{"New Arrival"}', '{"Gluten-Free", "Non-GMO"}', 'active', false);
