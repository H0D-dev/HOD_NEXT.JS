"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  { img: "/images/bespoke/villa_lv01.png", title: "Villa LV01, Dubai", type: "Private Residence" },
  { img: "/images/bespoke/yacht_interior.png", title: "Project Azzurra", type: "Yacht Interior" },
  { img: "/images/bespoke/villa_lv01.png", title: "The Penthouse", type: "Private Residence" }, // Reused image
];

export default function FeaturedProjects() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".proj-title",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      ".proj-card",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".proj-grid",
          start: "top 75%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 md:py-40 bg-[var(--bg-secondary)] border-b border-[var(--border-secondary)]">
      <div className="container mx-auto px-6">
        <h2 className="proj-title font-sans text-xs uppercase tracking-widest font-medium text-[var(--text-muted)] mb-12 text-center">
          Featured Projects
        </h2>

        <div className="proj-grid flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-8 snap-x snap-mandatory md:snap-none hide-scrollbar">
          {projects.map((proj, idx) => (
            <div key={idx} className="proj-card group relative flex-shrink-0 w-[85vw] md:w-auto snap-center cursor-pointer overflow-hidden border border-[var(--border-secondary)]">
              <div className="relative w-full aspect-[4/5] bg-[var(--bg-primary)]">
                <Image
                  src={proj.img}
                  alt={proj.title}
                  fill
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-700" />
                
                {/* Text */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-white/80 font-mono text-xs uppercase tracking-widest mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                    {proj.type}
                  </span>
                  <h3 className="font-serif text-3xl text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-out delay-75">
                    {proj.title}
                  </h3>
                </div>
              </div>
            </div>
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
