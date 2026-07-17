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
    <section id="dining-room" ref={containerRef} className="w-full py-8 md:py-12 px-4 md:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="dining-header text-center mb-10 md:mb-12">
          <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-[var(--text-primary)] mb-4 md:mb-6 leading-[1.2]">
            Dining Room
          </h2>
          <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] font-light max-w-[600px] mx-auto">
            Allow enough rug clearance so chairs remain comfortably on the rug when pulled out, protecting your floors and adding elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Rectangular Dining */}
          <div className="dining-reveal group flex flex-col border border-[var(--border-secondary)] bg-[var(--bg-primary)] overflow-hidden transition-colors duration-500 hover:border-[var(--text-primary)]">
            <div className="w-full aspect-[4/3] lg:aspect-square bg-[var(--bg-secondary)] border-b border-[var(--border-secondary)] overflow-hidden relative">
              <img 
                src="/images/size-guide/dining_room_rect_1782565935874.png" 
                alt="Rectangular dining setup" 
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col items-center text-center">
              <h3 className="font-serif text-lg md:text-xl text-[var(--text-primary)] mb-3 md:mb-4">
                Rectangular Tables
              </h3>
              <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed flex-1">
                Maintain at least 1.5m clearance beyond the table edges to ensure chairs can be pulled out gracefully without catching on the rug's border.
              </p>
            </div>
          </div>

          {/* Right: Circular Dining */}
          <div className="dining-reveal group flex flex-col border border-[var(--border-secondary)] bg-[var(--bg-primary)] overflow-hidden transition-colors duration-500 hover:border-[var(--text-primary)]">
            <div className="w-full aspect-[4/3] lg:aspect-square bg-[var(--bg-secondary)] border-b border-[var(--border-secondary)] overflow-hidden relative">
              <img 
                src="/images/size-guide/dining_room_round_1782565945704.png" 
                alt="Circular dining setup" 
                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col items-center text-center">
              <h3 className="font-serif text-lg md:text-xl text-[var(--text-primary)] mb-3 md:mb-4">
                Circular Tables
              </h3>
              <p className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed flex-1">
                Circular rugs work beautifully with round tables. This combination echoes the room's geometry, fostering an intimate, continuous conversation space.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
