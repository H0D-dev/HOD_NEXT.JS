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
    <section ref={containerRef} className="py-24 md:py-40 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          {/* Left Text Column */}
          <div className="flex flex-col">
            <span className="animate-phil text-xs uppercase tracking-widest font-medium text-[var(--text-muted)] mb-8">
              Our Philosophy
            </span>
            <h2 className="animate-phil font-serif text-4xl md:text-5xl lg:text-7xl leading-[1.1] mb-10 text-[var(--text-primary)]">
              Not Made.<br />Composed.
            </h2>
            
            <div className="animate-phil space-y-6 text-[var(--text-secondary)] font-sans text-lg font-light max-w-lg mb-16">
              <p>
                True luxury is not manufactured; it is cultivated. Every House of Décor bespoke piece begins as an architectural concept, woven into existence by master artisans using time-honored techniques.
              </p>
              <p>
                We do not follow trends. We establish timelessness, ensuring that every knot and thread contributes to the enduring legacy of your space.
              </p>
            </div>

            <blockquote className="animate-phil relative pl-8 border-l border-[var(--border-primary)]">
              <p className="font-serif text-2xl md:text-3xl italic text-[var(--text-primary)] mb-4">
                &ldquo;A rug is not a product.<br />It is a surface of memory.&rdquo;
              </p>
            </blockquote>
          </div>

          {/* Right Image Column */}
          <div className="animate-phil relative h-[600px] lg:h-[800px] w-full overflow-hidden bg-[var(--bg-secondary)]">
            <div ref={imageRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
              <Image
                src="/images/bespoke/artisan_weaving.png"
                alt="Artisan weaving luxury rug"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
