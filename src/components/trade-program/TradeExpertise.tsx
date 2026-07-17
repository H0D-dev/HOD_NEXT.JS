"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const expertiseAreas = [
  {
    id: "01",
    title: "Product Development",
    description: "Collaborate with artisans to develop custom designs tailored to your project.",
  },
  {
    id: "02",
    title: "Inspiration & Design Support",
    description: "Work with senior designers to conceptualize spaces and refine palettes.",
  },
  {
    id: "03",
    title: "Delivery & Installation",
    description: "White-glove delivery and expert installation for flawless execution.",
  },
  {
    id: "04",
    title: "Manufacturing",
    description: "Unparalleled quality control from ethical sourcing to final hand-stitching.",
  },
];

export default function TradeExpertise() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Heading animation
    gsap.fromTo(
      ".expertise-header",
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );

    // Cards staggered arrival
    gsap.fromTo(
      ".expertise-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".expertise-grid",
          start: "top 80%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full py-12 md:py-20 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8">
          <div className="expertise-header max-w-2xl">
            <h2 className="font-serif text-xl md:text-2xl lg:text-3xl leading-[1.2] text-[var(--text-primary)] tracking-tight mb-3">
              World-Class Expertise
            </h2>
            <p className="font-sans text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
              We provide end-to-end solutions, giving designers absolute control over quality, timeline, and aesthetic execution.
            </p>
          </div>
        </div>

        <div className="expertise-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-[var(--border-secondary)]">
          {expertiseAreas.map((item) => (
            <div
              key={item.id}
              className="expertise-card p-8 md:p-12 border-r border-b border-[var(--border-secondary)] bg-[var(--surface-primary)] hover:bg-[var(--bg-tertiary)] transition-colors duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group flex flex-col h-full"
            >
              <span className="font-sans text-xs text-[var(--text-muted)] tracking-widest mb-12 block group-hover:text-[var(--text-primary)] transition-colors duration-500">
                {item.id}
              </span>
              <h3 className="font-serif text-2xl text-[var(--text-primary)] mb-6">
                {item.title}
              </h3>
              <p className="font-sans text-[var(--text-secondary)] text-sm leading-relaxed mt-auto">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
