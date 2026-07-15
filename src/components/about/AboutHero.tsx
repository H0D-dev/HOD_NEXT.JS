"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function AboutHero() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section ref={containerRef} className="w-full lg:h-[100svh] pt-24 lg:pt-32 pb-6 md:pb-12 px-6 md:px-12 lg:px-16 bg-[var(--bg-primary)]">
      <div className="w-full h-full flex flex-col lg:flex-row border border-[var(--border-secondary)]">
        
      {/* Image Side (Left) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
          className="w-full lg:w-1/2 h-[50vh] lg:h-full relative overflow-hidden"
        >
          <motion.div className="absolute inset-0 w-full h-[120%]" style={{ y }}>
            <Image
              src="/about/designer.png"
              alt="Designer at House of Décor"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Text Side (Right) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-16 min-h-[50vh] lg:h-full bg-[var(--surface-primary)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
            className="flex flex-col items-center text-center max-w-lg mx-auto"
          >
            <span className="block text-[var(--text-secondary)] font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] mb-8 font-medium">
              House of Décor
            </span>
            
            <h1 className="font-serif text-xl md:text-4xl lg:text-[2.75rem] leading-[1.2] text-[var(--text-primary)] tracking-wide">
              Asia’s foremost design studio for luxury hand-crafted rugs, redefining modern spaces with timeless elegance.
            </h1>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
