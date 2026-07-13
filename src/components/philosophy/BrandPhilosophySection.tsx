"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BrandPhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const elements = [leftContentRef.current, rightContentRef.current];

    gsap.from(elements, {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-brand-light py-24 md:py-32 overflow-hidden" id="philosophy-section">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-stretch">

          {/* ── Left Column (Image) ── */}
          <div ref={leftContentRef} className="w-full relative min-h-[300px] lg:min-h-[350px]">
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200"
              alt="Minimalist room detail"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          {/* ── Right Column (Text) ── */}
          <div ref={rightContentRef} className="flex flex-col items-start justify-between text-left h-full py-0">
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#2C251F]/60 mb-3 block">
                OUR PHILOSOPHY
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] text-[#2C251F] leading-[1.1] mb-5">
                Crafted Beyond Decoration.
              </h2>
              <p className="font-sans text-[#2C251F]/80 text-base md:text-lg leading-snug max-w-lg">
                House of Décor creates bespoke rugs that become part of architecture. Every commission is designed around the proportions, materials, and identity of the space, then handcrafted by master artisans using time-honoured techniques.
              </p>
            </div>

            <blockquote className="border-l-2 border-[#C9A87C]/50 pl-5 text-lg md:text-xl text-[#2C251F] font-serif italic mt-6">
              "A rug should never simply fill a room. It should define it."
            </blockquote>
          </div>

        </div>

      </div>
    </section>
  );
}
