"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";

export default function SizeGuideHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".hero-element",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="min-h-[70vh] w-full flex flex-col justify-center items-center px-4 md:px-8 py-24 md:py-32 bg-[var(--bg-primary)] text-[var(--text-primary)]"
    >
      <div className="max-w-[768px] mx-auto flex flex-col items-center text-center">
        <span className="hero-element font-sans text-xs md:text-sm tracking-[0.2em] uppercase mb-8 text-[var(--text-muted)]">
          Guide
        </span>
        
        <h1 className="hero-element font-serif text-3xl md:text-5xl lg:text-[4rem] leading-[1.1] tracking-tight mb-8">
          Size & Fitting Guide
        </h1>
        
        <h2 className="hero-element font-sans text-lg md:text-xl lg:text-2xl font-light mb-8 max-w-[600px] mx-auto text-[var(--text-secondary)]">
          For Rugs & Bespoke Interior Styling
        </h2>
        
        <p className="hero-element font-sans text-base md:text-lg leading-relaxed mb-12 max-w-[500px] mx-auto text-[var(--text-secondary)]">
          Selecting the right rug size transforms a space. Our design experts help you understand ideal proportions and placement.
        </p>
        
        <a 
          href="https://wa.me/971521236888?text=Hello,%20I%20need%20help%20with%20sizing%20for%20my%20space."
          target="_blank"
          rel="noopener noreferrer"
          className="hero-element font-sans text-xs md:text-sm tracking-widest uppercase px-8 py-4 bg-[var(--accent-primary)] text-[#111] border border-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] hover:border-[var(--accent-secondary)] transition-all duration-500 ease-out"
        >
          Need Help in Size?
        </a>
      </div>
    </section>
  );
}
