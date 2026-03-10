"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";

/**
 * A dramatic full-screen text reveal section.
 * Each word fades from dim to bright as the user scrolls through.
 */
export default function ScrollRevealText() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const words = sectionRef.current!.querySelectorAll("[data-word]");

      // Initially all words are dim
      gsap.set(words, { opacity: 0.15 });

      // As user scrolls, each word brightens in sequence
      gsap.to(words, {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 60%",
          scrub: 0.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const text = "We believe wellness should be simple. Pure ingredients. Backed by science. Trusted by thousands. No fillers. No compromises. Just results.";
  const words = text.split(" ");

  return (
    <section ref={sectionRef} className="py-32 md:py-44 bg-dark relative overflow-hidden noise-overlay">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green/[0.06] rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8">
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading text-white leading-[1.3] md:leading-[1.35]">
          {words.map((word, i) => (
            <span key={i} data-word className="inline-block mr-[0.3em]">
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
