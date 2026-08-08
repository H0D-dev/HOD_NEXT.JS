"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CustomRugsBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Scroll-linked animation: Starts slightly at bottom with larger size,
    // then moves up to original position while shrinking to 100% size as user scrolls into view.
    gsap.fromTo(
      bannerRef.current,
      {
        y: 70,
        scale: 1.1,
      },
      {
        y: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 95%",
          end: "top 25%",
          scrub: 1,
        },
      }
    );

    gsap.from(".custom-rug-content", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      }
    });
  }, { scope: containerRef });

  return (
    <section className="w-full pt-6 pb-2 md:py-8 lg:py-12 bg-[#F9F9F6] overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-2 sm:px-4 md:px-6 lg:px-12" ref={containerRef}>
        <div ref={bannerRef} className="relative w-full overflow-hidden aspect-[4/3] sm:aspect-auto sm:min-h-[440px] md:min-h-[540px] lg:min-h-[560px] flex items-center bg-[#E6E3DB] will-change-transform">

          {/* Background Image (Covering the full section) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/rugs/Custom-Rug.png"
              alt="Custom Rug Craftsmanship"
              fill
              className="object-cover object-center md:object-right"
              sizes="(max-width: 1400px) 100vw, 1400px"
              priority
            />
          </div>

          {/* Gradient Overlay for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent pointer-events-none z-[1]" />

          {/* Text Content Overlay */}
          <div className="relative z-10 w-full md:w-[70%] lg:w-[50%] flex flex-col justify-center p-4 sm:p-8 md:p-10 lg:p-16 xl:p-24 custom-rug-content">
            <span className="font-sans text-[9px] sm:text-[11px] lg:text-[10px] xl:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 mb-2 sm:mb-5 block">
              CUSTOM RUGS
            </span>

            <h2 className="font-sans font-light text-xl sm:text-2xl md:text-2xl lg:text-3xl text-white leading-[1.1] mb-3 sm:mb-6 tracking-wide drop-shadow-sm">
              YOUR VISION,<br />OUR CRAFT
            </h2>

            <p className="hidden sm:block font-sans text-sm sm:text-base md:text-lg lg:text-base xl:text-lg text-white/85 mb-10 max-w-md leading-relaxed">
              Create a rug as unique as your space. Choose your size, colors, and materials.
            </p>

            <div>
              <Link
                href="/contact"
                className="inline-block bg-brand-gold text-white px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-6 lg:py-3 xl:px-8 xl:py-4 font-sans text-[9px] sm:text-[10px] md:text-[11px] lg:text-[10px] xl:text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-brand-gold-dark transition-colors duration-300 shadow-sm"
              >
                DESIGN YOUR RUG
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
