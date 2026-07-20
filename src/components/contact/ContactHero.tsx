"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactHero() {
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
    <section ref={sectionRef} className="relative w-full h-screen flex flex-col justify-end lg:justify-center overflow-hidden bg-black" id="contact-hero-section">
      
      {/* ── Background Image Desktop ── */}
      <div className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 hidden md:block" ref={bgRefDesktop}>
        <Image
          src="/contact_hero_desktop.png"
          alt="Luxury architectural interior"
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
          src="/contact_hero_mobile.png"
          alt="Luxury architectural interior"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Subtle gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      {/* ── Content ── */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 relative z-20 flex flex-col pt-32 pb-24 md:py-32 lg:pb-0 mt-20 md:mt-12 lg:mt-16">
          {/* Hero Content Layer */}
          <div ref={contentRef} className="flex flex-col items-start gap-0 lg:-mt-16">
            
            <h1 className="font-sans text-[2.25rem] sm:text-[2.75rem] md:text-[4rem] lg:text-[4rem] font-light leading-[1.1] tracking-wide text-white mb-4">
              Let&apos;s Begin <br /> a Conversation
            </h1>
            
            <p className="font-sans max-w-xl text-white/90 text-[10px] md:text-xs uppercase tracking-[0.2em] mt-6 leading-relaxed">
              FOR BESPOKE RUGS, INTERIOR COLLABORATIONS, <br className="hidden sm:block" />
              HOSPITALITY PROJECTS, AND PRIVATE COMMISSIONS.
            </p>

            <div className="mt-8 border-t border-white/30 w-16 mb-4"></div>
            
          </div>
        </div>

    </section>
  );
}
