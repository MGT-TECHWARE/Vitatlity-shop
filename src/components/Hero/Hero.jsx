import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IconArrowRight } from '../icons';

gsap.registerPlugin(ScrollTrigger);
import './Hero.css';

export default function Hero() {
  const heroRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Background image slow zoom
      gsap.fromTo(bgRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 2.5, ease: 'power2.out' }
      );

      // Staggered content reveal
      tl.fromTo('.hero-label',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3 }
      )
      .fromTo('.hero-title-line',
        { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.9, stagger: 0.15 },
        '-=0.4'
      )
      .fromTo('.hero-subtitle',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.4'
      )
      .fromTo('.hero-cta-item',
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
        '-=0.3'
      )
      .fromTo('.hero-trust',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.2'
      );

      // Parallax on scroll
      gsap.to(bgRef.current, {
        y: 120,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-bg">
        <img src="/hero-bg.png" alt="" className="hero-bg-img" ref={bgRef} />
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <span className="hero-label">NEXORA PEPTIDES</span>
        <h1 className="hero-title">
          <span className="hero-title-line">Healthcare</span>
          <span className="hero-title-line"><em>Delivered.</em></span>
        </h1>
        <p className="hero-subtitle">
          Research-grade peptides and wellness compounds from a trusted supplier. Third-party tested, fast shipping, expert support.
        </p>
        <div className="hero-ctas">
          <a href="#products" className="hero-cta-primary hero-cta-item">
            Browse Catalog
            <span className="hero-cta-arrow"><IconArrowRight width={14} height={14} /></span>
          </a>
          <a href="#services" className="hero-cta-secondary hero-cta-item">
            Learn More
          </a>
        </div>
        <div className="hero-trust">
          <span className="hero-trust-text">
            Third-Party Tested <span className="hero-trust-sep">|</span> GMP Compliant <span className="hero-trust-sep">|</span> US-Based Shipping
          </span>
        </div>
      </div>
    </section>
  );
}
