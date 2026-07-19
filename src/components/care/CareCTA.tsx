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
    <section ref={containerRef} className="w-full py-8 md:py-12 px-4 md:px-8 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)] flex justify-center">
      <div className="max-w-[800px] mx-auto text-center flex flex-col items-center">
        <span className="cta-element block text-[var(--text-muted)] font-sans text-xs uppercase tracking-widest mb-6">
          Restoration & Maintenance
        </span>
        <h2 className="cta-element font-sans font-light text-xl md:text-2xl lg:text-3xl leading-[1.2] tracking-wide text-[var(--text-primary)] mb-4 md:mb-6">
          Need Professional Assistance?
        </h2>
        <p className="cta-element font-sans text-[var(--text-secondary)] text-xs md:text-sm lg:text-base leading-relaxed mb-10 max-w-xl">
          If your piece requires deep cleaning, stain removal, or professional restoration, our team can recommend certified specialists.
        </p>
        
        <div className="cta-element flex flex-col sm:flex-row items-center gap-6 justify-center w-full sm:w-auto">
          <Link 
            href="/contact"
            className="px-6 py-4 md:px-10 md:py-5 bg-[var(--accent-primary)] text-[#111] border border-[var(--accent-primary)] font-sans font-medium text-xs md:text-sm tracking-widest uppercase hover:bg-[var(--accent-secondary)] hover:border-[var(--accent-secondary)] transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] w-full sm:w-auto text-center"
          >
            Contact Support
          </Link>
          <a 
            href="https://wa.me/971521236888?text=I%20would%20like%20to%20visit%20the%20showroom."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 md:px-10 md:py-5 bg-transparent text-[var(--text-primary)] border border-[var(--accent-primary)] font-sans font-medium text-xs md:text-sm tracking-widest uppercase hover:bg-[var(--accent-primary)] hover:text-[#111] transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] w-full sm:w-auto text-center"
          >
            Visit Showroom
          </a>
        </div>
      </div>
    </section>
  );
}
