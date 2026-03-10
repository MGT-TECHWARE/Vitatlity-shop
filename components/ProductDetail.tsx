"use client";

import { useState, useEffect, useRef } from "react";
import type { Product } from "@/types/product";
import type { Review } from "@/types/review";
import ImageGallery from "./ImageGallery";
import SupplementFacts from "./SupplementFacts";
import StarRating from "./StarRating";
import TrustBadges from "./TrustBadges";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import { useCart } from "@/utils/cart-context";
import { formatPrice } from "@/utils/format";
import { gsap } from "@/hooks/useGsap";

export default function ProductDetail({
  product,
  reviews,
}: {
  product: Product;
  reviews: Review[];
}) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "facts" | "serving" | "reviews"
  >("description");
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();
  const infoRef = useRef<HTMLDivElement>(null);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;

  useEffect(() => {
    if (!infoRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-pd-reveal]", {
        opacity: 0,
        y: 25,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.15,
      });
    }, infoRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images?.[0] || "",
      },
      quantity
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const tabs = [
    { key: "description" as const, label: "Description" },
    ...(product.supplement_facts
      ? [{ key: "facts" as const, label: "Supplement Facts" }]
      : []),
    ...(product.serving_instructions
      ? [{ key: "serving" as const, label: "Serving Instructions" }]
      : []),
    { key: "reviews" as const, label: `Reviews (${reviews.length})` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Images */}
        <ImageGallery images={product.images || []} />

        {/* Right: Info */}
        <div ref={infoRef}>
          {/* Category */}
          <span data-pd-reveal className="text-[11px] font-bold text-green uppercase tracking-[0.15em] block">
            {product.category.replace("-", " ")}
          </span>

          <h1 data-pd-reveal className="text-2xl md:text-3xl font-bold font-heading mt-1 mb-2">
            {product.name}
          </h1>

          {/* Rating */}
          {avgRating > 0 && (
            <div data-pd-reveal className="flex items-center gap-2 mb-3">
              <StarRating rating={avgRating} size="sm" />
              <span className="text-sm text-muted">
                {avgRating.toFixed(1)} ({reviews.length} review
                {reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          {/* Price */}
          <div data-pd-reveal className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.short_description && (
            <p data-pd-reveal className="text-primary/60 mb-5 leading-relaxed">
              {product.short_description}
            </p>
          )}

          {/* Dietary Flags */}
          {product.dietary_flags.length > 0 && (
            <div data-pd-reveal className="flex flex-wrap gap-2 mb-6">
              {product.dietary_flags.map((flag) => (
                <span
                  key={flag}
                  className="text-[11px] px-3 py-1 bg-surface rounded-full text-muted font-medium"
                >
                  {flag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div data-pd-reveal className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-2.5 text-sm hover:bg-surface transition-colors"
              >
                -
              </button>
              <span className="px-4 py-2.5 text-sm font-semibold min-w-[44px] text-center border-x border-border">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3.5 py-2.5 text-sm hover:bg-surface transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                addedToCart
                  ? "bg-green text-white scale-[1.02]"
                  : product.stock === 0
                    ? "bg-muted/20 text-muted cursor-not-allowed"
                    : "bg-green text-white hover:bg-green-light hover:shadow-glow-green shadow-card"
              }`}
            >
              {addedToCart
                ? "Added to Cart!"
                : product.stock === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
            </button>
          </div>

          {/* Stock indicator */}
          {product.stock > 0 && product.stock <= 10 && (
            <p data-pd-reveal className="text-xs text-accent font-medium mb-4">
              Only {product.stock} left in stock!
            </p>
          )}

          {/* Trust Badges */}
          <div data-pd-reveal className="mb-6">
            <TrustBadges />
          </div>

          {/* Warning */}
          {product.warnings && (
            <div data-pd-reveal className="text-xs text-muted bg-surface rounded-xl p-3.5 mb-4">
              <span className="font-semibold text-primary">Warning: </span>
              {product.warnings}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-14">
        <div className="flex gap-1 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-green text-green"
                  : "border-transparent text-muted hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === "description" && (
            <div className="prose prose-sm max-w-none text-primary/70">
              <p className="leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === "facts" && product.supplement_facts && (
            <SupplementFacts facts={product.supplement_facts} />
          )}

          {activeTab === "serving" && product.serving_instructions && (
            <div className="prose prose-sm max-w-none text-primary/70">
              <p>{product.serving_instructions}</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8">
              <ReviewList reviews={reviews} />
              <div className="border-t border-border pt-6">
                <ReviewForm productId={product.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
