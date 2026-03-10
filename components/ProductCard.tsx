"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import { formatPrice } from "@/utils/format";
import StarRating from "./StarRating";
import { useCart } from "@/utils/cart-context";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const firstImage = product.images?.[0];
  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;
  const firstTag = product.tags?.[0];
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: firstImage || "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-card rounded-2xl overflow-hidden border border-border/20 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-500 ease-out"
    >
      {/* Image */}
      <div className="relative aspect-square bg-surface overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-14 h-14 text-border" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c4 0 6-8 6-8s1.72 3.46 3.28 5.18A3.58 3.58 0 0020 18c0-3-3-5-3-5s4-2 4-6-4-4-4 1Z" />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Tag Badge */}
        {firstTag && (
          <span className="absolute top-3 left-3 bg-dark/70 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-medium tracking-wider uppercase">
            {firstTag}
          </span>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-accent text-white text-[10px] px-3 py-1 rounded-full font-bold tracking-wide">
            Sale
          </span>
        )}

        {/* Quick add button */}
        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center
            opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0
            transition-all duration-400 ease-out
            ${added
              ? "bg-white text-green scale-110"
              : "bg-green text-white hover:bg-green-light shadow-glow-green"
            }`}
          aria-label="Quick add to cart"
        >
          {added ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-primary line-clamp-1 mb-1.5">
          {product.name}
        </h3>

        {/* Rating */}
        {product.avg_rating ? (
          <div className="flex items-center gap-1.5 mb-2.5">
            <StarRating rating={product.avg_rating} size="sm" />
            <span className="text-[11px] text-muted">
              ({product.review_count})
            </span>
          </div>
        ) : null}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted line-through">
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
