"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BespokeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      bgRef.current,
      { yPercent: -15 },
      {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      ".animate-hero",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.2,
      }
    );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <div ref={bgRef} className="absolute inset-0 w-full h-[130%] -top-[15%]">
          <Image
            src="/images/bespoke/bespoke_hero_bg.png"
            alt="Bespoke luxury rug in an architectural space"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        {/* Header visibility gradient - this creates a light backdrop for the dark header without modifying the global header component */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/90 via-white/50 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white flex flex-col items-center">
        <h1 className="animate-hero font-serif text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] leading-[1.1] tracking-tight mb-8 max-w-4xl">
          Bespoke Rugs,<br />
          Crafted as Architecture
        </h1>
        <p className="animate-hero font-sans text-lg md:text-xl max-w-2xl text-gray-200 mb-12 font-light">
          Every space deserves a signature. We design and craft rugs tailored to your vision, scale, and story.
        </p>

        <div className="animate-hero flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
          <Link href="https://wa.me/971521236888?text=Hello%2C%20I%20would%20like%20to%20start%20my%20bespoke%20project!" target="_blank" rel="noopener noreferrer" className="group relative w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 sm:px-12 sm:py-5 border border-white overflow-hidden text-xs sm:text-sm uppercase tracking-widest font-medium text-center">
            <span className="relative z-10 transition-colors duration-[0.6s] group-hover:text-black">Start Your Bespoke Project</span>
            <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
          </Link>
          <Link href="#process" className="group relative w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 sm:px-12 sm:py-5 border border-white/40 overflow-hidden text-xs sm:text-sm uppercase tracking-widest font-medium hover:border-white transition-colors duration-500 text-center">
            <span className="relative z-10 transition-colors duration-[0.6s]">Explore Craft</span>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="animate-hero absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/60">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-[scrollDown_2s_ease-in-out_infinite]" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scrollDown {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(100%); }
        }
      `}} />
    </section>
  );
}
