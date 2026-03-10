"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * GSAP scroll-triggered reveal for a container.
 * All children with `data-reveal` will animate in with stagger.
 */
export function useScrollReveal(options?: {
  stagger?: number;
  y?: number;
  duration?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const children = el.querySelectorAll("[data-reveal]");
    if (children.length === 0) return;

    gsap.set(children, { opacity: 0, y: options?.y ?? 40 });

    const tween = gsap.to(children, {
      opacity: 1,
      y: 0,
      duration: options?.duration ?? 0.8,
      stagger: options?.stagger ?? 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: options?.start ?? "top 80%",
        once: true,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [options?.stagger, options?.y, options?.duration, options?.start]);

  return ref;
}

/**
 * GSAP parallax effect for background elements.
 */
export function useParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const tween = gsap.to(ref.current, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, [speed]);

  return ref;
}
