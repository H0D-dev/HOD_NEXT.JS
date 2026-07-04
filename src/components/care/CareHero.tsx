"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function CareHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".care-hero-el",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="w-full pt-32 pb-16 md:pt-40 md:pb-32 px-4 md:px-8 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
        <span className="care-hero-el block text-[var(--text-muted)] font-sans text-xs md:text-sm uppercase tracking-widest mb-6 md:mb-8 font-medium">
          Guidance
        </span>
        <h1 className="care-hero-el font-serif text-[clamp(48px,8vw,80px)] leading-[1.05] tracking-tight text-[var(--text-primary)] mb-8">
          Care & Cleaning
        </h1>
        <h2 className="care-hero-el font-sans text-[var(--text-primary)] text-xl md:text-2xl font-light tracking-wide mb-8">
          Designed for Real Life
        </h2>
        <p className="care-hero-el font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-16">
          With proper care and understanding of natural materials, your House of Décor pieces will age gracefully for generations.
        </p>

        {/* Hero Image */}
        <div className="care-hero-el w-full max-w-[1200px] aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden border border-[var(--border-secondary)]">
          <img 
            src="/images/care/care_hero_1782566445248.png" 
            alt="Care and cleaning luxury rug" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
