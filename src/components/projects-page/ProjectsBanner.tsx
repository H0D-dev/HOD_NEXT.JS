"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ProjectsBanner() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth parallax for the background image
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={containerRef} className="w-full h-[60vh] md:h-[70vh] lg:h-[80vh] relative overflow-hidden flex items-center">
      
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 w-full h-[130%]" style={{ y }}>
        <Image 
          src="/projects_hero.png" // Reusing hero image but darkened
          alt="The Lana Dubai Dorchester Collection"
          fill
          className="object-cover object-[center_bottom]"
          sizes="100vw"
        />
      </motion.div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 md:bg-black/40 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative w-full max-w-[var(--container-lg)] mx-auto px-5 md:px-10 lg:px-16 flex flex-col justify-center">
        <div className="max-w-xl">
          <h2 className="font-sans font-light text-lg md:text-xl lg:text-2xl text-white mb-2 md:mb-3">
            The Lana Dubai Dorchester Collection
          </h2>
          
          <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/70 mb-3 md:mb-4">
            Dubai, UAE • Hospitality • 2024
          </p>
          
          <p className="text-xs md:text-sm font-light text-white/90 leading-relaxed mb-6 md:mb-8 max-w-sm md:max-w-md">
            Bespoke rugs for an ultra-luxury hotel, inspired by the movement of water and the surrounding architecture.
          </p>

          <Link href="/products/rugs" className="group inline-flex items-center gap-3 md:gap-4">
            <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
              Shop Now
            </span>
            <div className="w-8 md:w-12 h-[1px] bg-white transition-all duration-500 ease-out group-hover:w-16" />
          </Link>
        </div>
      </div>

    </section>
  );
}
