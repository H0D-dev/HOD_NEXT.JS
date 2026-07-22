"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function KnowHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRefDesktop = useRef<HTMLDivElement>(null);
  const bgRefMobile = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Background parallax effect
    gsap.to([bgRefDesktop.current, bgRefMobile.current], {
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
    <section ref={sectionRef} className="relative w-full h-[70vh] lg:h-screen flex flex-col justify-end lg:justify-center overflow-hidden bg-black" id="know-hero-section">
      
      {/* ── Background Image Desktop ── */}
      <div className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 hidden md:block" ref={bgRefDesktop}>
        <Image
          src="/know_your_rug_hero_desktop.png"
          alt="Macro close-up of luxurious hand-knotted rug"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Subtle gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-black/40 md:bg-gradient-to-r from-black/80 to-transparent z-10"></div>
      </div>
      
      {/* ── Background Image Mobile ── */}
      <div className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 block md:hidden" ref={bgRefMobile}>
        <Image
          src="/know_your_rug_hero_mobile_v2.png"
          alt="Macro close-up of luxurious hand-knotted rug"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Subtle gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
      </div>

      {/* ── Content ── */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 relative z-20 flex flex-col pt-32 pb-24 md:py-32 lg:pb-0 mt-20 md:mt-12 lg:mt-16">
        <div ref={contentRef} className="flex flex-col items-start gap-0 text-white text-left">
          
          <h1 className="font-light text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] leading-[1.1] tracking-wide mb-4 max-w-4xl text-left font-sans">
            Know <br /> Your Rug
          </h1>
          
          <p className="max-w-xl text-neutral-300 text-[10px] md:text-xs uppercase tracking-[0.2em] mt-6 leading-relaxed mb-4 text-left font-sans">
            UNDERSTANDING CRAFTSMANSHIP, MATERIALS, TEXTURES, AND TECHNIQUES BEHIND TIMELESS HANDMADE RUGS.
          </p>

          <div className="mt-2 group cursor-pointer">
            <span className="font-sans text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-white flex items-center gap-2 relative pb-1">
              EXPLORE CRAFTSMANSHIP
              <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"></span>
            </span>
          </div>
          
        </div>
      </div>

    </section>
  );
}
