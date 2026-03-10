"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";

const panels = [
  {
    title: "Vitamins & Minerals",
    desc: "Essential micronutrients to fill gaps in your daily diet",
    icon: "💊",
    color: "from-green/20 to-sage/20",
    href: "/products?category=vitamins",
  },
  {
    title: "Protein & Recovery",
    desc: "Fuel muscle growth and speed up post-workout repair",
    icon: "💪",
    color: "from-accent/20 to-clay/20",
    href: "/products?category=protein",
  },
  {
    title: "Weight Management",
    desc: "Clean energy & metabolism support for your fitness goals",
    icon: "🔥",
    color: "from-warning/20 to-accent/20",
    href: "/products?category=weight-loss",
  },
  {
    title: "Gut Health",
    desc: "Probiotics and digestive enzymes for optimal gut balance",
    icon: "🌿",
    color: "from-sage/20 to-green/20",
    href: "/products?category=gut-health",
  },
  {
    title: "Bundles & Stacks",
    desc: "Curated combinations designed to work better together",
    icon: "📦",
    color: "from-green/20 to-accent/20",
    href: "/products?category=bundles",
  },
];

export default function HorizontalScroll() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Parallax on each panel's icon
      const cards = track.querySelectorAll("[data-hcard]");
      cards.forEach((card) => {
        gsap.from(card, {
          scale: 0.85,
          opacity: 0.5,
          scrollTrigger: {
            trigger: card,
            containerAnimation: gsap.getById?.("hscroll") ?? undefined,
            start: "left 80%",
            end: "left 30%",
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-surface overflow-hidden">
      {/* Section header — pinned above the scroll */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-12 pb-4 px-6 sm:px-8 bg-gradient-to-b from-surface via-surface/95 to-transparent">
        <div className="max-w-7xl mx-auto">
          <span className="text-green text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
            Explore
          </span>
          <h2 className="text-3xl md:text-4xl font-heading">Shop by Category</h2>
        </div>
      </div>

      {/* Horizontal scrolling track */}
      <div
        ref={trackRef}
        className="flex items-center gap-6 px-8 pt-32 pb-16"
        style={{ width: `${panels.length * 420 + 200}px` }}
      >
        {panels.map((panel, i) => (
          <Link
            key={panel.title}
            href={panel.href}
            data-hcard
            className="group flex-shrink-0 w-[360px] h-[400px] rounded-3xl bg-card border border-border/30 shadow-soft hover:shadow-card transition-all duration-500 overflow-hidden relative"
          >
            {/* Gradient backdrop */}
            <div className={`absolute inset-0 bg-gradient-to-br ${panel.color} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />

            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
              <div>
                <span className="text-6xl block mb-6 group-hover:scale-110 transition-transform duration-500 inline-block">
                  {panel.icon}
                </span>
                <h3 className="text-2xl font-heading mb-3 text-primary group-hover:text-green transition-colors duration-300">
                  {panel.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{panel.desc}</p>
              </div>

              <div className="flex items-center gap-2 text-green text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                Explore
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            {/* Card number */}
            <span className="absolute top-6 right-6 text-[80px] font-heading text-primary/[0.04] leading-none">
              {String(i + 1).padStart(2, "0")}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
