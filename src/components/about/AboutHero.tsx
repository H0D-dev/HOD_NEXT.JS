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
    <section ref={sectionRef} className="relative w-full h-[70vh] lg:h-screen flex flex-col justify-end lg:justify-center overflow-hidden bg-black" id="about-hero-section">
      
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
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 relative z-20 flex flex-col pt-32 pb-24 md:py-32 lg:pb-0 mt-20 md:mt-12 lg:mt-16">
          {/* Hero Content Layer */}
          <div ref={contentRef} className="flex flex-col items-start gap-0 lg:-mt-16 max-w-2xl text-left">
            
            <h1 className="font-sans text-[2.25rem] sm:text-[2.75rem] md:text-[4rem] lg:text-[4rem] font-light leading-[1.1] tracking-wide text-white mb-2 md:mb-4 text-left">
              About Us
            </h1>
            
            <h2 className="font-sans text-[10px] md:text-xs font-semibold tracking-[0.2em] text-white mb-6 uppercase text-left">
              THE HOUSE OF DÉCOR PHILOSOPHY
            </h2>
            
            <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] leading-relaxed text-white/90 mb-8 max-w-md text-left">
              House of Décor is a Dubai-based luxury rug brand creating timeless, handcrafted rugs with integrity, passion, and purpose.
            </p>

            <div className="flex flex-col sm:flex-row items-start justify-start w-full sm:w-auto">
              <Link href="#our-story" className="group relative w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 sm:px-10 sm:py-4 border-[0.5px] border-white/60 overflow-hidden text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-center text-white">
                <span className="relative z-10 transition-colors duration-[0.6s] group-hover:text-black">DISCOVER OUR STORY</span>
                <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
              </Link>
            </div>
            
          </div>
        </div>

    </section>
  );
}
