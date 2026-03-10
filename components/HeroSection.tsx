"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      /* ───────────────────────────────────
         SPLIT TEXT — per-character reveal on the heading
         ─────────────────────────────────── */
      const chars = sectionRef.current!.querySelectorAll("[data-char]");
      if (chars.length > 0) {
        gsap.set(chars, { opacity: 0, y: 60, rotateX: -90 });
        tl.to(chars, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.025,
          duration: 0.7,
          ease: "back.out(1.7)",
        }, 0.3);
      }

      /* Green underline draws in */
      tl.from("[data-underline] path", {
        strokeDashoffset: 300,
        duration: 0.8,
        ease: "power2.inOut",
      }, 0.9);

      /* Tag badge slides in */
      tl.from("[data-hero-tag]", {
        opacity: 0,
        x: -30,
        duration: 0.5,
      }, 0.1);

      /* Description fades up */
      tl.from("[data-hero-desc]", {
        opacity: 0,
        y: 25,
        duration: 0.6,
      }, 1.0);

      /* CTA buttons stagger */
      tl.from("[data-hero-cta] a", {
        opacity: 0,
        y: 20,
        scale: 0.9,
        stagger: 0.12,
        duration: 0.5,
        ease: "back.out(2)",
      }, 1.15);

      /* Stats counter-like reveal */
      tl.from("[data-stat]", {
        opacity: 0,
        y: 30,
        scale: 0.8,
        stagger: 0.08,
        duration: 0.5,
        ease: "back.out(1.5)",
      }, 1.3);

      /* Glass cards cascade with 3D rotation */
      tl.from("[data-glass-card]", {
        opacity: 0,
        scale: 0.7,
        y: 80,
        rotateY: -15,
        rotateX: 10,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.4)",
      }, 0.6);

      /* Background glow breathes in */
      tl.from("[data-hero-glow]", {
        opacity: 0,
        scale: 0.3,
        duration: 1.5,
        ease: "power2.out",
      }, 0.2);

      /* Floating botanicals spin in */
      tl.from("[data-botanical]", {
        opacity: 0,
        scale: 0,
        rotation: -180,
        stagger: 0.2,
        duration: 1.2,
        ease: "elastic.out(1, 0.6)",
      }, 0.9);

      /* Decorative rings expand outward */
      tl.from("[data-ring]", {
        scale: 0,
        opacity: 0,
        stagger: 0.15,
        duration: 1.8,
        ease: "power2.out",
      }, 0.4);

      /* ───────────────────────────────────
         SCROLL-BASED PARALLAX on the hero
         ─────────────────────────────────── */
      gsap.to("[data-parallax-slow]", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to("[data-parallax-fast]", {
        yPercent: 60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      /* Content fades out on scroll */
      gsap.to("[data-hero-content]", {
        opacity: 0,
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "60% top",
          end: "bottom top",
          scrub: true,
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ─── Split text helper: wraps each character in a span ─── */
  function SplitText({ text, className }: { text: string; className?: string }) {
    return (
      <span className={className} style={{ perspective: "500px", display: "inline" }}>
        {text.split("").map((char, i) => (
          <span
            key={i}
            data-char
            className="inline-block"
            style={{ transformOrigin: "bottom center" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    );
  }

  return (
    <section ref={sectionRef} className="relative bg-dark overflow-hidden noise-overlay min-h-screen" style={{ perspective: "1200px" }}>
      {/* Gradient mesh atmosphere */}
      <div className="absolute inset-0 gradient-mesh" data-parallax-slow />

      {/* Animated decorative rings */}
      <div data-ring data-parallax-slow className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.03] animate-rotate-slow hidden lg:block" />
      <div data-ring data-parallax-slow className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-green/[0.06] animate-rotate-slow hidden lg:block" style={{ animationDirection: "reverse", animationDuration: "25s" }} />
      <div data-ring className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-accent/[0.04] animate-rotate-slow hidden lg:block" style={{ animationDuration: "40s" }} />

      {/* Floating botanical elements */}
      <svg data-botanical data-parallax-fast className="absolute top-[15%] right-[25%] w-16 h-16 text-green/20 animate-float hidden lg:block" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c4 0 6-8 6-8s1.72 3.46 3.28 5.18A3.58 3.58 0 0020 18c0-3-3-5-3-5s4-2 4-6-4-4-4 1Z" />
      </svg>
      <svg data-botanical data-parallax-fast className="absolute bottom-[25%] right-[35%] w-10 h-10 text-accent/15 animate-float-slow hidden lg:block" style={{ animationDelay: "2s" }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c4 0 6-8 6-8s1.72 3.46 3.28 5.18A3.58 3.58 0 0020 18c0-3-3-5-3-5s4-2 4-6-4-4-4 1Z" />
      </svg>
      <svg data-botanical className="absolute top-[35%] right-[8%] w-8 h-8 text-green/10 animate-float hidden lg:block" style={{ animationDelay: "4s" }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c4 0 6-8 6-8s1.72 3.46 3.28 5.18A3.58 3.58 0 0020 18c0-3-3-5-3-5s4-2 4-6-4-4-4 1Z" />
      </svg>
      <svg data-botanical data-parallax-fast className="absolute bottom-[15%] left-[5%] w-12 h-12 text-sage/15 animate-float hidden lg:block" style={{ animationDelay: "3s" }} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c4 0 6-8 6-8s1.72 3.46 3.28 5.18A3.58 3.58 0 0020 18c0-3-3-5-3-5s4-2 4-6-4-4-4 1Z" />
      </svg>

      <div data-hero-content className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-screen py-16 md:py-20">
          {/* Left: Content */}
          <div>
            <span data-hero-tag className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green/10 border border-green/20 text-green text-xs font-semibold tracking-[0.15em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
              Premium Supplements
            </span>

            <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] font-heading text-white leading-[1.05] mb-6" style={{ perspective: "800px" }}>
              <SplitText text="Nourish Your" />
              <br />
              <span className="relative inline-block">
                <SplitText text="Wellness" className="text-green" />
                <svg data-underline className="absolute -bottom-2 left-0 w-full h-3 text-green/30" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                  <path
                    d="M2 8C40 3 80 2 100 5C120 8 160 10 198 4"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="300"
                    strokeDashoffset="0"
                  />
                </svg>
              </span>
              {" "}
              <SplitText text="Journey" />
            </h1>

            <p data-hero-desc className="text-base md:text-lg text-white/40 mb-10 max-w-md leading-relaxed">
              Science-backed, third-party tested supplements crafted from
              nature&apos;s finest ingredients. Your body deserves better.
            </p>

            <div data-hero-cta className="flex flex-wrap items-center gap-4 mb-12">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-green text-white font-semibold rounded-full hover:bg-green-light transition-all duration-300 animate-pulse-glow"
              >
                Shop Now
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/products?category=bundles"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 text-white/80 font-medium rounded-full hover:bg-white/5 hover:border-white/25 transition-all duration-300"
              >
                View Bundles
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 pt-8 border-t border-white/[0.06]">
              {[
                { value: "50K+", label: "Happy Customers" },
                { value: "120+", label: "Products" },
                { value: "4.8", label: "Avg. Rating", accent: true },
              ].map((stat) => (
                <div key={stat.label} data-stat>
                  <p className={`text-2xl font-bold font-heading ${stat.accent ? "text-green" : "text-white"}`}>
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-white/30 mt-0.5 tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating glass feature cards */}
          <div className="hidden lg:block relative" style={{ perspective: "1000px" }}>
            {/* Glow behind cards */}
            <div data-hero-glow className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-green/10 blur-[80px]" />

            <div className="relative flex flex-col gap-5 items-center">
              <div className="flex gap-5">
                <div data-glass-card className="glass rounded-2xl p-6 w-52 hover:bg-white/[0.06] transition-all duration-500 group cursor-default hover:-translate-y-1">
                  <div className="w-11 h-11 rounded-xl bg-green/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Quality</p>
                  <p className="text-white font-semibold text-sm">Third-Party Tested</p>
                </div>

                <div data-glass-card className="glass rounded-2xl p-6 w-52 mt-8 hover:bg-white/[0.06] transition-all duration-500 group cursor-default hover:-translate-y-1">
                  <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round">
                      <path d="M12 22V8M12 8C12 8 8 4 4 6C0 8 2 14 6 14C10 14 12 8 12 8ZM12 12C12 12 16 8 20 10C24 12 22 18 18 18C14 18 12 12 12 12Z" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Formula</p>
                  <p className="text-white font-semibold text-sm">Clean & Natural</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div data-glass-card className="glass rounded-2xl p-6 w-52 hover:bg-white/[0.06] transition-all duration-500 group cursor-default hover:-translate-y-1">
                  <div className="w-11 h-11 rounded-xl bg-green/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Origin</p>
                  <p className="text-white font-semibold text-sm">Made in USA</p>
                </div>

                <div data-glass-card className="glass rounded-2xl p-6 w-52 mt-8 hover:bg-white/[0.06] transition-all duration-500 group cursor-default hover:-translate-y-1">
                  <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Delivery</p>
                  <p className="text-white font-semibold text-sm">Free Over $75</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2" data-parallax-fast>
        <span className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-green animate-bounce" />
        </div>
      </div>
    </section>
  );
}
