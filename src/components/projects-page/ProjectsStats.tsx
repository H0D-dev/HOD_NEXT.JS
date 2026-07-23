"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectsStats() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const stats = gsap.utils.toArray<HTMLElement>(".stat-number");
    
    stats.forEach(stat => {
      const target = parseFloat(stat.getAttribute("data-target") || "0");
      const suffix = stat.getAttribute("data-suffix") || "";
      
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: stat,
          start: "top 90%",
        },
        onUpdate: () => {
          stat.innerText = Math.floor(obj.val) + suffix;
        }
      });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full pt-16 pb-8 md:pt-24 md:pb-12 px-5 md:px-10 lg:px-16 bg-[var(--bg-primary)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        
        {/* Left: Text & Icons */}
        <div className="w-full lg:w-1/3 flex flex-col">
          <h3 className="font-sans text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)] mb-6">
            Designed Around Your Space
          </h3>
          <p className="text-sm font-light text-[var(--text-secondary)] leading-relaxed mb-10 max-w-sm">
            Every rug is made to order using traditional weaving techniques and premium natural materials. Whether the requirement is a single statement piece or a large-scale hospitality installation, every project receives the same level of craftsmanship, precision and attention to detail.
          </p>
          
          {/* Material Icons (Mocked with text for simplicity and elegance) */}
          <div className="flex gap-6 md:gap-8 items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-[var(--border-secondary)] flex items-center justify-center">
                <span className="text-[10px]">W</span>
              </div>
              <span className="text-[8px] uppercase tracking-widest text-[var(--text-secondary)] text-center">New Zealand<br/>Wool</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-[var(--border-secondary)] flex items-center justify-center">
                <span className="text-[10px]">S</span>
              </div>
              <span className="text-[8px] uppercase tracking-widest text-[var(--text-secondary)] text-center">Bamboo<br/>Silk</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-[var(--border-secondary)] flex items-center justify-center">
                <span className="text-[10px]">C</span>
              </div>
              <span className="text-[8px] uppercase tracking-widest text-[var(--text-secondary)] text-center">Cotton<br/>& Linen</span>
            </div>
          </div>
        </div>

        {/* Middle: Craft Image */}
        <div className="w-full lg:w-1/3 aspect-[4/3] relative bg-[var(--bg-secondary)] overflow-hidden">
          <Image
            src="/services_cta_bg.png" // Reusing an existing detailed texture/craft image
            alt="Craftsmanship and natural fibres"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        </div>

        {/* Right: Stats Grid */}
        <div className="w-full lg:w-1/3 grid grid-cols-2 gap-x-8 gap-y-12 pl-0 lg:pl-10">
          <div className="flex flex-col border-l border-[var(--border-secondary)] pl-4">
            <span className="stat-number text-lg lg:text-xl font-light text-[var(--text-primary)] mb-2" data-target="1000" data-suffix="+">0+</span>
            <span className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)]">Bespoke Rugs<br/>Delivered</span>
          </div>
          <div className="flex flex-col border-l border-[var(--border-secondary)] pl-4">
            <span className="stat-number text-lg lg:text-xl font-light text-[var(--text-primary)] mb-2" data-target="150" data-suffix="+">0+</span>
            <span className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)]">Interior<br/>Projects</span>
          </div>
          <div className="flex flex-col border-l border-[var(--border-secondary)] pl-4">
            <span className="stat-number text-lg lg:text-xl font-light text-[var(--text-primary)] mb-2" data-target="20" data-suffix="+">0+</span>
            <span className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)]">Countries<br/>Served</span>
          </div>
          <div className="flex flex-col border-l border-[var(--border-secondary)] pl-4">
            <span className="stat-number text-lg lg:text-xl font-light text-[var(--text-primary)] mb-2" data-target="100" data-suffix="%">0%</span>
            <span className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)]">Handmade<br/>Craftsmanship</span>
          </div>
        </div>

      </div>
    </section>
  );
}
