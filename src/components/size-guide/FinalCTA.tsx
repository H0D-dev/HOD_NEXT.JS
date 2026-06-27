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
    <section ref={ctaRef} className="w-full py-32 md:py-48 px-4 md:px-8 bg-[var(--text-primary)] text-[var(--bg-primary)] flex justify-center items-center">
      <div className="max-w-[800px] mx-auto flex flex-col items-center text-center">
        <h2 className="cta-element font-serif text-4xl md:text-5xl lg:text-7xl mb-8">
          Need Expert Guidance?
        </h2>
        <p className="cta-element font-sans text-sm md:text-base font-light leading-relaxed max-w-[500px] mb-12 text-[var(--bg-secondary)] opacity-90">
          Our design specialists can help you choose the perfect rug or curtain dimensions for your space. Let us tailor a solution exactly for your architectural needs.
        </p>
        <div className="cta-element flex flex-col md:flex-row gap-6 w-full md:w-auto">
          <Link 
            href="/contact" 
            className="font-sans text-sm tracking-wider uppercase px-8 py-4 border border-[var(--bg-primary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] transition-colors duration-500 ease-out w-full md:w-auto text-center"
          >
            Contact Us
          </Link>
          <Link 
            href="/services" 
            className="font-sans text-sm tracking-wider uppercase px-8 py-4 bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--accent-primary)] border border-transparent transition-colors duration-500 ease-out w-full md:w-auto text-center"
          >
            Book Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
