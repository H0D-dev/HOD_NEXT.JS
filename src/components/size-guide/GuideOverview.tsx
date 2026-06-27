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
    <section id="overview" ref={sectionRef} className="w-full py-24 md:py-32 px-4 md:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
        {/* Left Column */}
        <div className="md:col-span-5 overview-item">
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-[var(--text-primary)]">
            Choosing the Right Fit
          </h2>
        </div>

        {/* Right Column */}
        <div className="md:col-span-7 flex flex-col">
          {/* Content Block 1 */}
          <div className="overview-item py-8 border-t border-[var(--border-secondary)]">
            <h3 className="font-sans text-sm md:text-base font-semibold tracking-widest uppercase mb-4 text-[var(--text-primary)]">
              Positioning & Balance
            </h3>
            <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
              A well-placed rug grounds the furniture, creating a cohesive visual anchor. Curtains positioned correctly can enhance the perceived height and width of your space.
            </p>
          </div>

          {/* Content Block 2 */}
          <div className="overview-item py-8 border-t border-[var(--border-secondary)]">
            <h3 className="font-sans text-sm md:text-base font-semibold tracking-widest uppercase mb-4 text-[var(--text-primary)]">
              Size & Comfort
            </h3>
            <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
              Going too small can make a room feel disjointed. Opting for generous proportions ensures comfort underfoot and adds an undeniable sense of luxury.
            </p>
          </div>

          {/* Content Block 3 */}
          <div className="overview-item py-8 border-t border-b border-[var(--border-secondary)]">
            <h3 className="font-sans text-sm md:text-base font-semibold tracking-widest uppercase mb-4 text-[var(--text-primary)]">
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
