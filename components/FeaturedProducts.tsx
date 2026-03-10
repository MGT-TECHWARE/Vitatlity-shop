"use client";

import Link from "next/link";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { useScrollReveal } from "@/hooks/useGsap";

export default function FeaturedProducts({
  products,
}: {
  products: Product[];
}) {
  const gridRef = useScrollReveal({ stagger: 0.08, y: 50, duration: 0.7 });
  const sidebarRef = useScrollReveal({ y: 40, duration: 0.8 });

  if (products.length === 0) return null;

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[340px_1fr] gap-8 lg:gap-14 items-start">
          {/* Left: Section intro card */}
          <div ref={sidebarRef} className="lg:sticky lg:top-24">
            <div data-reveal className="relative bg-dark rounded-3xl p-8 md:p-10 text-white overflow-hidden noise-overlay">
              {/* Atmospheric glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-green/10 rounded-full blur-[60px]" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-green/15 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-green" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c4 0 6-8 6-8s1.72 3.46 3.28 5.18A3.58 3.58 0 0020 18c0-3-3-5-3-5s4-2 4-6-4-4-4 1Z" />
                  </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-heading leading-snug mb-4">
                  Our Best
                  <br />
                  Selling Products
                </h2>
                <p className="text-sm text-white/40 leading-relaxed mb-8">
                  Trusted by thousands of customers. These are the supplements
                  people keep coming back for.
                </p>

                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 text-green text-sm font-semibold hover:text-green-light transition-colors"
                >
                  Go to Shop
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>

                {/* Decorative line */}
                <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center gap-6">
                  <div>
                    <p className="text-xl font-bold font-heading text-green">100K+</p>
                    <p className="text-[10px] text-white/30 tracking-wider uppercase">Sold</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <p className="text-xl font-bold font-heading">4.9</p>
                    <p className="text-[10px] text-white/30 tracking-wider uppercase">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product grid with GSAP staggered reveals */}
          <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {products.slice(0, 6).map((product) => (
              <div key={product.id} data-reveal>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
