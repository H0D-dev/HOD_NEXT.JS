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
    <section id="overview" ref={sectionRef} className="w-full py-8 md:py-12 px-4 md:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-[1000px] mx-auto">
        {/* Section Header */}
        <div className="overview-item mb-12 md:mb-16 text-center">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl leading-[1.2] text-[var(--text-primary)]">
            Choosing the Right Fit
          </h2>
        </div>

        {/* Content Blocks */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Content Block 1 */}
          <div className="overview-item flex-1 py-6 md:py-8 border-t border-[var(--border-secondary)]">
            <h3 className="font-sans text-xs md:text-sm font-semibold tracking-widest uppercase mb-4 text-[var(--text-primary)]">
              Positioning & Balance
            </h3>
            <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
              A well-placed rug grounds the furniture, creating a cohesive visual anchor. Proportions and positioning are vital to harmonizing the entire architectural flow.
            </p>
          </div>

          {/* Content Block 2 */}
          <div className="overview-item flex-1 py-6 md:py-8 border-t border-[var(--border-secondary)]">
            <h3 className="font-sans text-xs md:text-sm font-semibold tracking-widest uppercase mb-4 text-[var(--text-primary)]">
              Size & Comfort
            </h3>
            <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
              Going too small can make a room feel disjointed. Opting for generous proportions ensures comfort underfoot and adds an undeniable sense of luxury.
            </p>
          </div>

          {/* Content Block 3 */}
          <div className="overview-item flex-1 py-6 md:py-8 border-t border-[var(--border-secondary)]">
            <h3 className="font-sans text-xs md:text-sm font-semibold tracking-widest uppercase mb-4 text-[var(--text-primary)]">
              Borders & Patterns
            </h3>
            <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
              Consider how furniture placement affects the visibility of intricate borders or central medallions. Allow adequate floor clearance to frame the design beautifully.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
