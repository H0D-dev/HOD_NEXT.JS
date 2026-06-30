"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FinalCTA() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".final-cta-anim",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 md:py-48 bg-[var(--bg-secondary)] border-b border-[var(--border-secondary)] text-center px-6">
      <div className="container mx-auto flex flex-col items-center">
        
        <h2 className="final-cta-anim font-sans font-medium text-[clamp(40px,7vw,120px)] leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)] mb-16 uppercase max-w-6xl">
          Begin Your<br />Bespoke Journey
        </h2>

        <div className="final-cta-anim flex flex-col sm:flex-row items-center justify-center gap-6 mb-24 w-full sm:w-auto">
          <Link href="/contact" className="group relative inline-flex items-center justify-center px-12 py-5 border border-[var(--border-primary)] overflow-hidden text-sm uppercase tracking-widest font-medium w-full sm:w-auto">
            <span className="relative z-10 transition-colors duration-[0.6s] group-hover:text-[var(--bg-primary)] text-[var(--text-primary)]">Contact Studio</span>
            <div className="absolute inset-0 bg-[var(--text-primary)] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
          </Link>
          <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="group relative inline-flex items-center justify-center px-12 py-5 border border-[var(--border-secondary)] hover:border-[var(--border-primary)] overflow-hidden text-sm uppercase tracking-widest font-medium w-full sm:w-auto transition-colors duration-500 text-[var(--text-primary)]">
            <span className="relative z-10 transition-colors duration-[0.6s]">WhatsApp Inquiry</span>
          </a>
        </div>

        <div className="final-cta-anim flex flex-col sm:flex-row gap-12 sm:gap-24 text-[var(--text-secondary)]">
          <div className="flex flex-col items-center sm:items-start text-sm">
            <span className="font-medium text-[var(--text-primary)] mb-2 uppercase tracking-widest text-xs">Studios</span>
            <span>Jaipur, India</span>
            <span>Dubai, UAE</span>
          </div>
          <div className="flex flex-col items-center sm:items-start text-sm">
            <span className="font-medium text-[var(--text-primary)] mb-2 uppercase tracking-widest text-xs">Direct Connect</span>
            <a href="mailto:info@houseofdecor.com" className="hover:text-[var(--text-primary)] transition-colors">info@houseofdecor.com</a>
            <a href="tel:+971000000000" className="hover:text-[var(--text-primary)] transition-colors">+971 00 000 0000</a>
          </div>
        </div>
      </div>
    </section>
  );
}
