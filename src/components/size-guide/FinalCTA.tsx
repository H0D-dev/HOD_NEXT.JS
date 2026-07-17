"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const ctaRef = useRef<HTMLDivElement>(null);

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
          trigger: ctaRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: ctaRef });

  return (
    <section ref={ctaRef} className="w-full py-8 md:py-12 px-4 md:px-8 bg-[var(--bg-secondary)] text-[var(--text-primary)] flex justify-center items-center border-t border-[var(--border-secondary)]">
      <div className="max-w-[800px] mx-auto flex flex-col items-center text-center">
        <h2 className="cta-element font-serif text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6">
          Need Expert Guidance?
        </h2>
        <p className="cta-element font-sans text-sm md:text-base font-light leading-relaxed max-w-[500px] mb-8 md:mb-10 text-[var(--text-secondary)]">
          Our design specialists can help you choose the perfect rug dimensions for your space. Let us tailor a solution exactly for your architectural needs.
        </p>
        <div className="cta-element flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto">
          <Link 
            href="/contact" 
            className="font-sans text-xs md:text-sm tracking-widest uppercase px-6 py-4 md:px-10 md:py-5 bg-transparent border border-[var(--border-secondary)] text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors duration-500 ease-out w-full md:w-auto text-center"
          >
            Contact Us
          </Link>
          <a 
            href="https://wa.me/971521236888?text=Hello,%20I%20need%20help%20with%20sizing%20for%20my%20space."
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs md:text-sm tracking-widest uppercase px-6 py-4 md:px-10 md:py-5 bg-transparent border border-[var(--accent-primary)] text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-[#111] transition-colors duration-500 ease-out w-full md:w-auto text-center"
          >
            Need Help in Size?
          </a>
        </div>
      </div>
    </section>
  );
}
