"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Background parallax effect
    gsap.to(bgRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    // Fade and translate content upwards
    gsap.from(gsap.utils.toArray(contentRef.current?.children || []), {
      y: 30,
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
    <section ref={sectionRef} className="relative w-full h-screen flex flex-col justify-end lg:justify-center overflow-hidden bg-black" id="hero-section">
      
      {/* ── Background Image ── */}
      <div className="absolute inset-0 w-full h-[120%] -top-[10%] z-0" ref={bgRef}>
        <Image
          src="/hero_background.png"
          alt="Luxury architectural interior"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Subtle gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-black/40 md:bg-gradient-to-r from-black/70 to-transparent z-10"></div>
      </div>

      {/* ── Content ── */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 relative z-20 flex flex-col py-24 md:py-32 lg:pb-0">
          {/* Hero Content Layer */}
          <div ref={contentRef} className="flex flex-col items-start gap-0 lg:-mt-16">
            
            <h1 className="font-serif text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] leading-[1.1] tracking-tight text-white mb-4">
              Luxury Beneath <br /> Every Space.
            </h1>
            
            <p className="font-sans max-w-xl text-neutral-300 text-base md:text-lg mt-6">
              Premium handwoven rugs and bespoke curtains crafted for architectural interiors. Where heritage techniques meet modern luxury.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-10">
              <Link href="/bespoke" className="bg-brand-gold hover:bg-brand-gold-dark text-white text-[10px] md:text-xs uppercase tracking-[0.2em] py-4 px-8 transition-colors duration-300 font-sans text-center sm:text-left w-full sm:w-auto">
                Start Your Project
              </Link>
              
              <Link href="/collections" className="bg-transparent border border-white/40 hover:border-brand-gold hover:text-brand-gold text-white text-[10px] md:text-xs uppercase tracking-[0.2em] py-4 px-8 transition-colors duration-300 font-sans text-center sm:text-left w-full sm:w-auto">
                Explore Our World
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Element: Vertical SCROLL indicator */}
        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-4 z-20 pb-0 hidden md:flex">
          <span className="font-sans text-[10px] text-white uppercase tracking-[0.3em]" style={{ writingMode: 'vertical-rl' }}>
            SCROLL
          </span>
          <div className="w-[1px] h-16 bg-white/30 overflow-hidden">
            <div className="w-full h-full bg-white origin-top animate-pulse"></div>
          </div>
        </div>

    </section>
  );
}
