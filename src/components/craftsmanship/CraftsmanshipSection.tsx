"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CraftsmanshipSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 120px", "start 20px"]
  });

  const backgroundColor = useTransform(scrollYProgress, [0, 1], ["#F5F2EC", "#2C251F"]);

  return (
    <motion.section 
      ref={sectionRef} 
      style={{ backgroundColor }}
      className="w-full pt-6 pb-2 md:py-8 lg:pb-16" 
      id="craftsmanship-section"
    >
      <div className="flex flex-col w-full max-w-[1400px] mx-auto relative px-4 md:px-8 lg:px-12 md:pt-12 space-y-4 md:space-y-6 lg:space-y-6">

        {/* Panel 1: Craftsmanship */}
        <div className="craft-panel sticky top-16 md:top-24 w-full relative min-h-[280px] md:min-h-0 h-[280px] md:h-[450px] lg:h-[550px] overflow-hidden z-10">
          {/* Full Background Image */}
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src="/images/craftsmanship.png"
              alt="Craftsmanship"
              fill
              className="object-cover object-center"
            />
            {/* Gradient Overlay for text legibility */}
            <div className="absolute inset-0 bg-black/40 md:bg-gradient-to-r from-black/60 via-black/10 to-transparent"></div>
          </div>

          {/* Text Overlay */}
          <div className="relative z-10 w-full h-full md:w-[60%] lg:w-[50%] flex flex-col justify-center items-start p-6 md:p-16 lg:p-24 text-white">
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-300 mb-2 md:mb-4 block">CRAFTSMANSHIP</span>
            <h2 className="font-sans font-light text-xl lg:text-2xl leading-[1.2] tracking-wide text-white">Rooted in heritage.<br />Defined by detail.</h2>
            <Link href="/know-your-rug/weaving-techniques" className="mt-6 md:mt-8 text-[10px] md:text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-brand-gold transition-colors duration-300 font-sans w-fit flex">
              EXPLORE MORE &rarr;
            </Link>
          </div>
        </div>

        {/* Panel 2: Materials */}
        <div className="craft-panel sticky top-20 md:top-32 w-full relative min-h-[280px] md:min-h-0 h-[280px] md:h-[450px] lg:h-[550px] overflow-hidden z-20">
          {/* Full Background Image */}
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src="/images/materials.png"
              alt="Materials"
              fill
              className="object-cover object-center"
            />
            {/* Gradient Overlay for text legibility */}
            <div className="absolute inset-0 bg-black/40 md:bg-gradient-to-r from-black/60 via-black/10 to-transparent"></div>
          </div>

          {/* Text Overlay */}
          <div className="relative z-10 w-full h-full md:w-[60%] lg:w-[50%] flex flex-col justify-center items-start p-6 md:p-16 lg:p-24 text-white">
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-300 mb-2 md:mb-4 block">MATERIALS</span>
            <h2 className="font-sans font-light text-xl lg:text-2xl leading-[1.2] tracking-wide text-white">
              Finest natural fibers.<br />Exceptional organic dyes.
            </h2>
            <Link href="/know-your-rug/fibers-material" className="mt-6 md:mt-8 text-[10px] md:text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-brand-gold transition-colors duration-300 font-sans w-fit flex">
              EXPLORE MATERIALS &rarr;
            </Link>
          </div>
        </div>

        {/* Panel 3: Why House of Decor */}
        <div className="craft-panel sticky top-24 md:top-40 w-full relative min-h-[280px] md:min-h-0 h-[280px] md:h-[450px] lg:h-[550px] overflow-hidden z-30">
          {/* Full Background Image */}
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src="/images/architecture.png"
              alt="Architecture"
              fill
              className="object-cover object-center"
            />
            {/* Gradient Overlay for text legibility */}
            <div className="absolute inset-0 bg-black/40 md:bg-gradient-to-r from-black/60 via-black/10 to-transparent"></div>
          </div>

          {/* Text Overlay */}
          <div className="relative z-10 w-full h-full md:w-[60%] lg:w-[50%] flex flex-col justify-center items-start p-6 md:p-16 lg:p-24 text-white">
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-300 mb-2 md:mb-4 block">WHY HOUSE OF DÉCOR</span>
            <h2 className="font-sans font-light text-xl lg:text-2xl leading-[1.2] tracking-wide text-white">
              Architectural design.<br />Bespoke customization.
            </h2>
            <Link href="/bespoke" className="mt-6 md:mt-8 text-[10px] md:text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-brand-gold transition-colors duration-300 font-sans w-fit flex">
              DISCOVER MORE &rarr;
            </Link>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
