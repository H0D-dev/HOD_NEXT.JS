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
    <section id="process" ref={containerRef} className="py-32 md:py-48 bg-[var(--bg-secondary)] border-b border-[var(--border-secondary)] overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1600px]">
        <h2 className="process-item font-sans text-sm tracking-[0.2em] md:text-base mb-24 text-[var(--text-primary)] text-center uppercase font-medium">
          The Bespoke Process
        </h2>
        
        <div className="flex overflow-x-auto lg:overflow-visible pb-8 snap-x snap-mandatory hide-scrollbar gap-8 lg:gap-0">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div 
                className="process-item flex-shrink-0 w-[80vw] sm:w-[40vw] lg:w-auto lg:flex-1 snap-center flex flex-col border border-[var(--border-secondary)] bg-transparent p-8"
              >
                {/* Icon centered above text block */}
                <div className="w-full flex justify-center mb-8 h-16 items-center">
                  <step.icon strokeWidth={1} size={48} className="text-[var(--text-primary)]" />
                </div>
                
                {/* Text Block left aligned */}
                <div className="flex flex-col">
                  <div className="text-[var(--text-primary)] font-serif text-lg mb-1">
                    {step.num}
                  </div>
                  <h3 className="font-serif font-medium text-[16px] mb-3 text-[var(--text-primary)] leading-tight">
                    {step.title}
                  </h3>
                </div>
              </div>

              {/* Chevron Divider - only visible on large screens */}
              {idx < steps.length - 1 && (
                <div className="process-item hidden lg:flex flex-col pt-6 items-center justify-start text-[var(--border-secondary)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="7 13 12 18 17 13"></polyline>
                    <polyline points="7 6 12 11 17 6"></polyline>
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
