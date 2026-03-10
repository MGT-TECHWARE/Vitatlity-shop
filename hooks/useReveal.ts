"use client";

import { useEffect, useRef } from "react";

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    // Observe the container and all children with .reveal class
    const children = el.querySelectorAll(".reveal");
    children.forEach((child) => observer.observe(child));
    if (el.classList.contains("reveal")) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}
