"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DiningGuide() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const textBlocks = gsap.utils.toArray<HTMLElement>(".dining-reveal");
    textBlocks.forEach((block) => {
      gsap.fromTo(
        block,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: block,
            start: "top 85%",
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section id="dining-room" ref={containerRef} className="w-full py-16 md:py-32 px-4 md:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="dining-reveal text-center max-w-[800px] mx-auto mb-20">
          <h2 className="font-serif text-[clamp(32px,5vw,64px)] text-[var(--text-primary)] mb-6">
            Dining Room
          </h2>
          <p className="font-sans text-base md:text-lg text-[var(--text-secondary)] font-light">
            Allow enough rug clearance so chairs remain comfortably on the rug when pulled out.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left: Rectangular Dining */}
          <div className="dining-reveal flex flex-col items-center text-center">
            <div className="w-full aspect-square mb-8 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] overflow-hidden p-8 flex items-center justify-center">
              <img 
                src="/images/size-guide/dining_room_rect_1782565935874.png" 
                alt="Rectangular dining setup" 
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </div>
            <h3 className="font-serif text-[clamp(20px,4vw,32px)] text-[var(--text-primary)] mb-4">
              Rectangular Tables
            </h3>
            <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-[400px]">
              Maintain at least 1.5m clearance beyond the table edges to ensure chairs can be pulled out gracefully without catching on the rug&apos;s border.
            </p>
          </div>

          {/* Right: Circular Dining */}
          <div className="dining-reveal flex flex-col items-center text-center">
            <div className="w-full aspect-square mb-8 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] overflow-hidden p-8 flex items-center justify-center">
              <img 
                src="/images/size-guide/dining_room_round_1782565945704.png" 
                alt="Circular dining setup" 
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </div>
            <h3 className="font-serif text-[clamp(20px,4vw,32px)] text-[var(--text-primary)] mb-4">
              Circular Tables
            </h3>
            <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed max-w-[400px]">
              Circular rugs work beautifully with round tables. This combination echoes the room&apos;s geometry, fostering an intimate, continuous conversation space.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
