"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ConsultationCTA() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".cta-content",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-[#111111] text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="lg:w-1/2">
            <h2 className="cta-content font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
              Your Space. Your Scale.<br />
              <span className="text-[#F7F77E] italic">Your Signature.</span>
            </h2>
          </div>

          <div className="lg:w-1/2 flex flex-col sm:flex-row gap-6 justify-end w-full">
            <Link href="#book" className="cta-content group relative inline-flex items-center justify-center px-8 py-5 border border-white overflow-hidden text-sm uppercase tracking-widest font-medium w-full sm:w-auto">
              <span className="relative z-10 transition-colors duration-[0.6s] group-hover:text-black">Book a Consultation</span>
              <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
            </Link>
            
            <Link href="#upload" className="cta-content group relative inline-flex items-center justify-center px-8 py-5 border border-white/30 overflow-hidden text-sm uppercase tracking-widest font-medium w-full sm:w-auto hover:border-white transition-colors duration-500">
              <span className="relative z-10 transition-colors duration-[0.6s]">Upload Floor Plan</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
