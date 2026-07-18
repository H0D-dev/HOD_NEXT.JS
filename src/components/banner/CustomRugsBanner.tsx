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

  useGSAP(() => {
    gsap.from(".custom-rug-content", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      }
    });
  }, { scope: containerRef });

  return (
    <section className="w-full pt-6 pb-2 md:py-8 lg:py-12 bg-[#F9F9F6]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16" ref={containerRef}>
        <div className="relative w-full overflow-hidden min-h-[300px] md:min-h-[500px] flex items-center bg-[#E6E3DB]">
          
          {/* Background Image (Covering the full section) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/custom_rug_full_banner.png"
              alt="Custom Rug Craftsmanship"
              fill
              className="object-cover object-center md:object-right"
              sizes="(max-width: 1400px) 100vw, 1400px"
              priority
            />
          </div>
          
          {/* Text Content Overlay */}
          <div className="relative z-10 w-full md:w-[60%] lg:w-[50%] flex flex-col justify-center p-6 sm:p-10 md:p-16 lg:p-24 custom-rug-content">
            <span className="font-sans text-[11px] md:text-xs uppercase tracking-[0.15em] text-[#2C251F]/70 mb-5 block">
              CUSTOM RUGS
            </span>
            <h2 className="font-serif text-2xl md:text-4xl lg:text-[42px] text-[#2C251F] leading-[1.15] mb-4 md:mb-6">
              YOUR VISION,<br />OUR CRAFT
            </h2>
            <p className="font-sans text-[#2C251F]/80 text-sm md:text-[15px] leading-[1.6] mb-8 max-w-[300px]">
              Create a rug as unique as your space. Choose your size, colors, and materials.
            </p>
            
            <div>
              <Link 
                href="/custom" 
                className="inline-block bg-brand-gold text-white px-8 py-4 font-sans text-xs uppercase tracking-[0.15em] hover:bg-brand-gold-dark transition-colors duration-300"
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
