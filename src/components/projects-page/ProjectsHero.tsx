"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ProjectsHero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[100svh] overflow-hidden bg-[var(--bg-primary)]"
    >
      {/* Desktop Parallax Background */}
      <motion.div className="absolute inset-0 w-full h-full hidden md:block" style={{ y }}>
        <Image
          src="/images/projects/Project-hero.png"
          alt="House of Décor Luxury Projects"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay for Text Readability - Left side */}
        <div className="absolute inset-0 bg-black/30 md:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </motion.div>

      {/* Mobile Parallax Background */}
      <motion.div className="absolute inset-0 w-full h-full md:hidden" style={{ y }}>
        <Image
          src="/images/projects/Project-hero.png"
          alt="House of Décor Luxury Projects"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay for Text Readability - Bottom side on mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
      </motion.div>

      {/* Content Container - Positioned at bottom left */}
      <div className="w-full h-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 relative z-20 flex flex-col justify-end pb-24 md:pb-32 lg:pb-24">
        <div className="flex flex-col items-start gap-0 text-left text-white mt-auto w-full max-w-2xl">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="flex flex-col w-full"
          >
            <h1 className="font-light text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] leading-[1.1] tracking-wide mb-4 max-w-4xl text-left">
              Projects
            </h1>
            
            <p className="max-w-xl text-neutral-300 text-[10px] md:text-xs uppercase tracking-[0.2em] mt-2 md:mt-6 leading-relaxed mb-8 md:mb-6 text-left">
              From private villas to luxury hotels, we collaborate with architects and designers to create bespoke rugs that become part of the architecture itself.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start justify-start mt-4 w-full sm:w-auto">
              <Link href="/contact" className="group relative w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 sm:px-10 sm:py-4 border-[0.5px] border-white/60 overflow-hidden text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-center text-white">
                <span className="relative z-10 transition-colors duration-[0.6s] group-hover:text-white">Start Your Project</span>
                <div className="absolute inset-0 bg-[var(--accent-primary)] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
              </Link>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
