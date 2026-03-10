export const CATEGORIES = [
  { slug: "vitamins", label: "Vitamins & Minerals" },
  { slug: "weight-loss", label: "Weight Loss & Fat Burners" },
  { slug: "protein", label: "Protein & Meal Replacements" },
  { slug: "pre-workout", label: "Pre-Workout" },
  { slug: "post-workout", label: "Post-Workout & Recovery" },
  { slug: "gut-health", label: "Gut Health & Probiotics" },
  { slug: "bundles", label: "Bundles & Stacks" },
] as const;

export const GOALS = [
  { slug: "protein", label: "Build Muscle", icon: "💪" },
  { slug: "weight-loss", label: "Lose Weight", icon: "🔥" },
  { slug: "pre-workout", label: "Boost Energy", icon: "⚡" },
  { slug: "gut-health", label: "Improve Digestion", icon: "🌿" },
  { slug: "vitamins", label: "Fill Nutritional Gaps", icon: "🛡️" },
  { slug: "post-workout", label: "Recovery", icon: "🧘" },
] as const;

export const DIETARY_FLAGS = [
  "Vegan",
  "Gluten-Free",
  "Non-GMO",
  "Organic",
  "Sugar-Free",
  "Keto-Friendly",
  "Dairy-Free",
  "Soy-Free",
] as const;

export const TRUST_BADGES = [
  { label: "Third-Party Tested", icon: "shield-check" },
  { label: "GMP Certified", icon: "badge" },
  { label: "Made in USA", icon: "flag" },
] as const;

export const FDA_DISCLAIMER =
  "*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.";

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
