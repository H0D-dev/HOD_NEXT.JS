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
  { icon: Globe, num: "06", title: "Installation Worldwide", desc: "From Jaipur to the world, we ensure seamless delivery and installation." },
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
    <section id="process" ref={containerRef} className="py-16 md:py-32 bg-[var(--bg-secondary)] border-b border-[var(--border-secondary)]">
      <div className="container mx-auto px-6 max-w-[1600px]">
        <div className="flex justify-center w-full mb-16">
          <h2 className="process-item text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)] text-center">
            The Bespoke Process
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 lg:gap-8">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="process-item flex flex-col border border-[var(--border-secondary)] bg-[var(--surface-primary)] p-8 hover:border-[var(--text-primary)] transition-colors duration-500"
            >
              <div className="w-full flex justify-start mb-8 h-12 items-center">
                <step.icon strokeWidth={1} size={32} className="text-[var(--text-primary)]" />
              </div>
              
              <div className="flex flex-col flex-grow">
                <div className="text-[var(--text-muted)] font-serif text-2xl mb-4">
                  {step.num}
                </div>
                <h3 className="font-serif text-xl mb-4 text-[var(--text-primary)] leading-tight">
                  {step.title}
                </h3>
                <p className="font-sans text-sm text-[var(--text-secondary)] leading-relaxed mt-auto">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
