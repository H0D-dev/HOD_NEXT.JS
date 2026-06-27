"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function CareCTA() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".cta-element",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full py-32 md:py-48 px-4 md:px-8 bg-[var(--text-primary)] border-t border-[var(--border-secondary)] flex justify-center">
      <div className="max-w-[800px] mx-auto text-center flex flex-col items-center">
        <span className="cta-element block text-[var(--text-muted)] font-sans text-xs uppercase tracking-widest mb-8 text-[var(--bg-primary)] opacity-70">
          Restoration & Maintenance
        </span>
        <h2 className="cta-element font-serif text-4xl md:text-5xl lg:text-7xl text-[var(--bg-primary)] mb-8">
          Need Professional Assistance?
        </h2>
        <p className="cta-element font-sans text-[var(--bg-secondary)] opacity-80 text-lg md:text-xl font-light mb-16 max-w-lg mx-auto">
          If your piece requires deep cleaning, stain removal, or professional restoration, our team can recommend certified specialists.
        </p>
        
        <div className="cta-element flex flex-col sm:flex-row items-center gap-6 justify-center">
          <Link 
            href="/contact"
            className="group relative inline-flex items-center justify-center px-12 py-5 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--bg-primary)] font-sans font-medium text-sm tracking-widest uppercase overflow-hidden transition-all duration-[0.6s]"
          >
            <span className="relative z-10 transition-colors duration-[0.6s] group-hover:text-[var(--bg-primary)]">Contact Support</span>
            <div className="absolute inset-0 bg-[var(--text-primary)] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
          </Link>
          <a 
            href="https://wa.me/971521236888?text=I%20would%20like%20to%20visit%20the%20showroom."
            target="_blank"
            rel="noopener noreferrer"
            className="px-12 py-5 bg-transparent text-[var(--bg-primary)] border border-[var(--bg-secondary)] font-sans font-medium text-sm tracking-widest uppercase hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] text-center"
          >
            Visit Showroom
          </a>
        </div>
      </div>
    </section>
  );
}
