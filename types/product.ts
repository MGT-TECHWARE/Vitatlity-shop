export interface SupplementFact {
  name: string;
  amount: string;
  daily_value?: string;
}

export interface SupplementFacts {
  serving_size: string;
  servings_per_container: number;
  nutrients: SupplementFact[];
  other_ingredients?: string;
}

export type ProductCategory =
  | "vitamins"
  | "weight-loss"
  | "protein"
  | "pre-workout"
  | "post-workout"
  | "gut-health"
  | "bundles";

export type ProductStatus = "draft" | "active" | "archived";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  images: string[];
  category: ProductCategory;
  supplement_facts: SupplementFacts | null;
  serving_instructions: string | null;
  warnings: string | null;
  stock: number;
  sku: string | null;
  tags: string[];
  dietary_flags: string[];
  status: ProductStatus;
  featured: boolean;
  created_at: string;
  updated_at: string;
  avg_rating?: number;
  review_count?: number;
}
