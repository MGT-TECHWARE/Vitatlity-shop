"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/utils/constants";

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const handleClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => handleClick(null)}
        className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
          !activeCategory
            ? "bg-dark text-white border-dark"
            : "bg-card text-primary border-border/50 hover:border-primary/20"
        }`}
      >
        All Items
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => handleClick(cat.slug)}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
            activeCategory === cat.slug
              ? "bg-dark text-white border-dark"
              : "bg-card text-primary border-border/50 hover:border-primary/20"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
