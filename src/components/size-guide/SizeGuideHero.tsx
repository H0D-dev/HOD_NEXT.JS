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
      className="relative min-h-[50vh] lg:min-h-[60vh] w-full flex flex-col justify-center items-center px-4 md:px-8 py-24 md:py-32 bg-[var(--bg-primary)] text-[var(--text-primary)]"
    >
      <div className="max-w-[768px] mx-auto flex flex-col items-center text-center">
        <span className="hero-element font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase mb-6 md:mb-8 text-[var(--accent-primary)] font-medium">
          Guide
        </span>
        
        <h1 className="hero-element font-sans text-[clamp(32px,5vw,64px)] font-light leading-none tracking-wide text-[var(--text-primary)] mb-8 md:mb-12">
          Size & Fitting Guide
        </h1>
        
        <a 
          href="https://wa.me/971521236888?text=Hello,%20I%20need%20help%20with%20sizing%20for%20my%20space."
          target="_blank"
          rel="noopener noreferrer"
          className="hero-element font-sans text-xs md:text-sm tracking-widest uppercase px-8 py-4 bg-[var(--accent-primary)] text-[#111] border border-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] hover:border-[var(--accent-secondary)] transition-all duration-500 ease-out"
        >
          Need Help in Size?
        </a>
      </div>

      {/* Premium connecting line spanning the gap */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-16 lg:h-24 bg-[var(--border-primary)] block"></div>
    </section>
  );
}
