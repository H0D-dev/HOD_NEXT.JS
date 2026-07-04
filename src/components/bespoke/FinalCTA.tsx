"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
        
        <h2 className="final-cta-anim font-sans font-medium text-[clamp(40px,7vw,120px)] leading-[0.9] tracking-[-0.04em] text-[var(--text-primary)] uppercase max-w-6xl">
          Begin Your<br />Bespoke Journey
        </h2>

      </div>
    </section>
  );
}
