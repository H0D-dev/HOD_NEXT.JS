"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ConsultationCTA() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".cta-content",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-[var(--bg-secondary)] text-[var(--text-primary)]">
      <div className="container mx-auto px-6">
        <div className="w-full flex justify-center text-center">
          <h2 className="cta-content font-serif text-3xl md:text-5xl lg:text-[4rem] leading-[1.1] tracking-tight text-center">
            Your Space. Your Scale.<br />
            <span className="italic text-[var(--text-secondary)] font-light">Your Signature.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
