"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, PenTool, SwatchBook, Scissors, CheckCircle, Globe, ChevronsRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  { icon: Search, num: "01", title: "Discovery & Brief", desc: "We begin with a conversation to understand your space, vision, and functional needs." },
  { icon: PenTool, num: "02", title: "Concept Sketching", desc: "Our design team translates ideas into bespoke concepts and visual compositions." },
  { icon: SwatchBook, num: "03", title: "Material Selection", desc: "We curate the finest natural fibers, textures, and dyes from around the world." },
  { icon: Scissors, num: "04", title: "Artisan Crafting", desc: "Skilled hands bring the design to life using time-honored techniques and patience." },
  { icon: CheckCircle, num: "05", title: "Quality & Finishing", desc: "Each rug undergoes a rigorous inspection and finishing for enduring beauty." },
  { icon: Globe, num: "06", title: "Delivery Worldwide", desc: "From Jaipur to the world, we ensure seamless delivery." },
];

export default function BespokeProcess() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".process-item",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section id="process" ref={containerRef} className="py-6 md:py-8 lg:py-10 bg-[var(--bg-secondary)] border-b border-[var(--border-secondary)]">
      <div className="container mx-auto px-6 max-w-[1600px]">
        <div className="flex justify-center w-full mb-6">
          <h2 className="process-item text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)] text-center">
            The Bespoke Process
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="process-item group relative flex flex-col border border-[var(--border-secondary)] bg-[var(--surface-primary)] p-5 transition-colors duration-500"
            >
              <div className="absolute top-0 left-0 h-[2px] bg-[var(--accent-primary)] w-0 group-hover:w-full transition-all duration-[0.8s] ease-[cubic-bezier(0.22,1,0.36,1)] z-10" />
              <div className="w-full flex justify-start mb-3 md:mb-4 h-6 md:h-8 items-center">
                <step.icon strokeWidth={1} className="w-5 h-5 md:w-6 md:h-6 text-[var(--text-primary)]" />
              </div>
              
              <div className="flex flex-col flex-grow">
                <div className="text-[var(--text-muted)] font-light text-base md:text-xl mb-1">
                  {step.num}
                </div>
                <h3 className="font-medium text-sm sm:text-base md:text-lg text-[var(--text-primary)] leading-tight">
                  {step.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
