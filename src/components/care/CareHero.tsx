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
      className="w-full pt-24 pb-12 lg:pt-32 lg:pb-16 px-4 md:px-8 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
        <span className="care-hero-el block text-[var(--accent-primary)] font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6 md:mb-8 font-medium">
          Guidance
        </span>
        <h1 className="care-hero-el font-sans text-[clamp(32px,5vw,64px)] font-light leading-none tracking-wide text-[var(--text-primary)] mb-6">
          Care & Cleaning
        </h1>
        <h2 className="care-hero-el font-sans text-[var(--text-primary)] text-sm md:text-base lg:text-lg font-light leading-relaxed mb-6">
          Designed for Real Life
        </h2>
        <p className="care-hero-el font-sans text-[var(--text-secondary)] text-xs md:text-sm lg:text-base leading-relaxed max-w-xl mx-auto mb-12">
          With proper care and understanding of natural materials, your House of Décor pieces will age gracefully for generations.
        </p>

        {/* Hero Image */}
        <div className="care-hero-el w-full max-w-[1200px] aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden border border-[var(--border-secondary)]">
          <img 
            src="/images/care/care_hero_1782566445248.png" 
            alt="Care and cleaning luxury rug" 
            className="w-full h-full object-cover object-bottom"
          />
        </div>
      </div>
    </section>
  );
}
