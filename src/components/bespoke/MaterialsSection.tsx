"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const materials = [
  { img: "/images/bespoke/bamboo_silk.png", title: "Bamboo Silk", desc: "Luminous, soft, and sustainably sourced for a stunning visual sheen." },
  { img: "/images/bespoke/nz_wool.png", title: "New Zealand Wool", desc: "Incredibly durable, tactile, and rich with natural insulating properties." },
  { img: "/images/bespoke/bamboo_silk.png", title: "Silk Blends", desc: "A masterful combination of strength and undeniable luxury." }, // Reused image for demonstration
  { img: "/images/bespoke/nz_wool.png", title: "Natural Dyes", desc: "Time-honored extraction methods for deep, enduring colorways." }, // Reused image for demonstration
];

export default function MaterialsSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".animate-mat-text",
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      }
    );
    
    gsap.fromTo(
      ".mat-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".mat-grid",
          start: "top 80%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 md:py-56 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Text */}
          <div className="lg:w-1/3 flex flex-col justify-start lg:sticky lg:top-40 h-fit">
            <h2 className="animate-mat-text font-serif text-[clamp(32px,5vw,64px)] leading-[1.1] mb-8 text-[var(--text-primary)]">
              Materials chosen not for trends, but for timelessness.
            </h2>
          </div>

          {/* Right Grid */}
          <div className="lg:w-2/3 mat-grid grid grid-cols-1 sm:grid-cols-2 gap-8">
            {materials.map((mat, idx) => (
              <div key={idx} className="mat-card group cursor-pointer flex flex-col">
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--bg-secondary)] mb-6 border border-[var(--border-secondary)]">
                  <Image
                    src={mat.img}
                    alt={mat.title}
                    fill
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                </div>
                <h3 className="font-sans font-medium text-xl mb-2 text-[var(--text-primary)]">
                  {mat.title}
                </h3>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
