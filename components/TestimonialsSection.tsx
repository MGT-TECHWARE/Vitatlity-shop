"use client";

import StarRating from "./StarRating";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";

const testimonials = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "The Probiotic 50 Billion has completely changed my digestion. I feel lighter and more energized every day. Best supplement purchase I've ever made!",
    product: "Probiotic 50 Billion CFU",
    initials: "SM",
  },
  {
    name: "James T.",
    rating: 5,
    text: "I've tried countless protein powders and the Whey Isolate from Nexora is by far the smoothest. No bloating, mixes perfectly, and tastes great.",
    product: "Whey Protein Isolate",
    initials: "JT",
  },
  {
    name: "Maria L.",
    rating: 5,
    text: "The Lean Body Stack helped me lose 12 lbs in 8 weeks alongside my training. The fat burner gives clean energy without jitters. Highly recommend!",
    product: "Lean Body Stack",
    initials: "ML",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.from("[data-test-header]", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-test-header]",
          start: "top 85%",
          once: true,
        },
      });

      // Cards stagger in with scale + rotation
      gsap.from("[data-test-card]", {
        opacity: 0,
        y: 60,
        scale: 0.92,
        rotateX: 8,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-test-grid]",
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-dark relative overflow-hidden noise-overlay" style={{ perspective: "1000px" }}>
      {/* Atmospheric gradients */}
      <div className="absolute top-1/3 left-[10%] w-[400px] h-[400px] bg-green/[0.06] rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-[20%] w-[300px] h-[300px] bg-accent/[0.04] rounded-full blur-[80px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div data-test-header className="text-center mb-14">
          <span className="text-green text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-heading text-white mb-6">
            What Our Customers Say
          </h2>

          {/* Rating summary */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl font-bold text-white font-heading">4.8</span>
            <StarRating rating={4.8} />
            <span className="text-sm text-white/30">(4,582 Reviews)</span>
          </div>
        </div>

        <div data-test-grid className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              data-test-card
              className="glass rounded-2xl p-7 hover:bg-white/[0.06] transition-colors duration-500 group"
            >
              <StarRating rating={t.rating} />
              <p className="text-sm text-white/60 mt-5 mb-6 leading-relaxed group-hover:text-white/70 transition-colors duration-500">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-5 border-t border-white/[0.06]">
                <div className="w-10 h-10 rounded-full bg-green/15 flex items-center justify-center">
                  <span className="text-xs font-bold text-green">{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-[11px] text-white/30">{t.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
