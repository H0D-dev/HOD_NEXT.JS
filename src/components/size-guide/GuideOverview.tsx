"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GuideOverview() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".overview-item",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section id="overview" ref={sectionRef} className="w-full pt-0 pb-12 lg:pb-16 px-4 md:px-8 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[1440px] mx-auto bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)] px-6 md:px-12 lg:px-16 py-12 md:py-16">
        {/* Section Header & Quote */}
        <div className="overview-item mb-8 md:mb-16 text-center flex flex-col items-center">
          <h2 className="font-sans text-xl lg:text-2xl font-light leading-[1.2] text-[var(--text-primary)] mb-6 md:mb-12">
            Choosing the Right Fit
          </h2>
          <div className="max-w-[800px] mx-auto text-center px-2">
            <h3 className="font-sans text-base md:text-xl lg:text-2xl font-light italic leading-relaxed md:leading-relaxed text-[var(--text-primary)] mb-4 md:mb-6">
              “A beautifully proportioned rug can anchor a room, define a space, and completely transform how a home feels.”
            </h3>
            <span className="font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
              House of Décor
            </span>
          </div>
        </div>

        {/* Content Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {/* Content Block 1 */}
          <div className="overview-item border border-[var(--border-secondary)] bg-[var(--bg-primary)] p-6 flex flex-col items-center text-center">
            <h3 className="font-sans text-sm md:text-base font-light tracking-wide uppercase text-[var(--text-primary)] mb-3">
              Positioning
            </h3>
            <p className="font-sans text-xs md:text-sm font-light leading-relaxed text-[var(--text-secondary)]">
              A well-placed rug grounds the furniture, creating a cohesive visual anchor.
            </p>
          </div>

          {/* Content Block 2 */}
          <div className="overview-item border border-[var(--border-secondary)] bg-[var(--bg-primary)] p-6 flex flex-col items-center text-center">
            <h3 className="font-sans text-sm md:text-base font-light tracking-wide uppercase text-[var(--text-primary)] mb-3">
              Size & Comfort
            </h3>
            <p className="font-sans text-xs md:text-sm font-light leading-relaxed text-[var(--text-secondary)]">
              Generous proportions ensure comfort underfoot and add an undeniable sense of luxury.
            </p>
          </div>

          {/* Content Block 3 */}
          <div className="overview-item border border-[var(--border-secondary)] bg-[var(--bg-primary)] p-6 flex flex-col items-center text-center">
            <h3 className="font-sans text-sm md:text-base font-light tracking-wide uppercase text-[var(--text-primary)] mb-3">
              Design Flow
            </h3>
            <p className="font-sans text-xs md:text-sm font-light leading-relaxed text-[var(--text-secondary)]">
              Allow adequate floor clearance to beautifully frame intricate borders and medallions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
