"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PhilosophySection() {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".animate-phil",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      imageRef.current,
      { yPercent: -10 },
      {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 md:py-56 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          {/* Left Text Column */}
          <div className="flex flex-col">
            <span className="animate-phil text-xs uppercase tracking-widest font-medium text-[var(--text-muted)] mb-12">
              Our Philosophy
            </span>
            <h2 className="animate-phil font-serif text-[clamp(40px,6vw,80px)] leading-[1.1] mb-20 text-[var(--text-primary)]">
              Not Made.<br />Composed.
            </h2>
            
            <blockquote className="animate-phil relative pl-8 border-l border-[var(--border-primary)]">
              <p className="font-serif text-2xl md:text-3xl italic text-[var(--text-primary)] mb-4">
                &ldquo;A rug is not a product.<br />It is a surface of memory.&rdquo;
              </p>
            </blockquote>
          </div>

          {/* Right Image Column */}
          <div className="animate-phil relative h-[400px] md:h-[500px] lg:h-[800px] w-full max-w-xl mx-auto lg:max-w-none overflow-hidden bg-[var(--bg-secondary)]">
            <div ref={imageRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
              <Image
                src="/images/bespoke/artisan_weaving.png"
                alt="Artisan weaving luxury rug"
                fill
                className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
