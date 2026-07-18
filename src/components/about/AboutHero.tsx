"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRefDesktop = useRef<HTMLDivElement>(null);
  const bgRefMobile = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Background parallax effect - desktop only to prevent mobile jitter
    gsap.to(bgRefDesktop.current, {
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
    <section ref={sectionRef} className="relative w-full h-screen flex flex-col justify-end lg:justify-center overflow-hidden bg-black" id="about-hero-section">
      
      {/* ── Background Image Desktop ── */}
      <div className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 hidden md:block" ref={bgRefDesktop}>
        <Image
          src="/about_hero_desktop.png"
          alt="House of Décor - Luxury Living Room"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Subtle gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-black/40 md:bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
      </div>
      
      {/* ── Background Image Mobile ── */}
      <div className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 block md:hidden" ref={bgRefMobile}>
        <Image
          src="/about_hero_mobile.png"
          alt="House of Décor - Luxury Living Room"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Subtle gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      {/* ── Content ── */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 relative z-20 flex flex-col py-24 md:py-32 lg:pb-0">
          {/* Hero Content Layer */}
          <div ref={contentRef} className="flex flex-col items-start gap-0 lg:-mt-16 max-w-2xl">
            
            <h1 className="font-serif text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] leading-[1.1] tracking-tight text-white mb-2 md:mb-4">
              About Us
            </h1>
            
            <h2 className="font-sans text-xs md:text-sm font-semibold tracking-[0.2em] text-white mb-6 uppercase">
              THE HOUSE OF DÉCOR PHILOSOPHY
            </h2>
            
            <p className="font-sans text-sm md:text-base leading-relaxed text-neutral-200 mb-8 max-w-md">
              House of Décor is a Dubai-based luxury rug brand creating timeless, handcrafted rugs with integrity, passion, and purpose.
            </p>

            <Link href="#our-story" className="inline-block border-b border-white text-white font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium pb-1 transition-colors hover:text-white/70 hover:border-white/70">
              DISCOVER OUR STORY
            </Link>
            
          </div>
        </div>

    </section>
  );
}
