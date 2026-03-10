"use client";

import Link from "next/link";
import { GOALS } from "@/utils/constants";
import { useEffect, useRef } from "react";
import { gsap } from "@/hooks/useGsap";

export default function ShopByGoal() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header fade in
      gsap.from("[data-goal-header]", {
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-goal-header]",
          start: "top 85%",
          once: true,
        },
      });

      // Grid items stagger with a bouncy ease
      gsap.from("[data-goal-card]", {
        opacity: 0,
        y: 40,
        scale: 0.9,
        stagger: 0.06,
        duration: 0.6,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: "[data-goal-grid]",
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-surface relative overflow-hidden">
      {/* Subtle gradient wash */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green/[0.03] rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div data-goal-header className="text-center mb-14">
          <span className="text-green text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
            Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-heading">
            Shop by Goal
          </h2>
        </div>

        <div data-goal-grid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {GOALS.map((goal) => (
            <div key={goal.slug} data-goal-card>
              <Link
                href={`/products?category=${goal.slug}`}
                className="group block bg-card rounded-2xl p-5 border border-border/20 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-500 text-center"
              >
                <span className="w-14 h-14 flex items-center justify-center rounded-2xl bg-surface text-3xl mb-3 mx-auto group-hover:scale-110 group-hover:bg-green/10 transition-all duration-400">
                  {goal.icon}
                </span>
                <h3 className="text-sm font-semibold text-primary group-hover:text-green transition-colors duration-300">
                  {goal.label}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
