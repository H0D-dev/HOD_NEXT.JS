"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PhilosophySection() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section ref={containerRef} className="w-full pt-12 lg:pt-16 pb-6 md:pb-8 px-6 md:px-12 lg:px-16 bg-[var(--bg-primary)]">
      <div className="w-full flex flex-col lg:flex-row border border-[var(--border-secondary)]">
        
        {/* Left Side (Image) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-1/2 h-[50vh] lg:h-auto lg:min-h-[50svh] relative overflow-hidden bg-[var(--bg-secondary)]"
        >
          <motion.div className="absolute inset-0 w-full h-[120%]" style={{ y }}>
            <Image
              src="/images/bespoke/artisan_weaving.png"
              alt="Artisan weaving luxury rug"
              fill
              className="object-cover object-center"
            />
          </motion.div>
        </motion.div>

        {/* Right Side (Text) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 lg:p-12 min-h-[50vh] lg:min-h-[50svh] bg-[var(--surface-primary)]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center w-full max-w-lg"
          >
            <span className="block text-[var(--text-secondary)] text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3 font-medium">
              Our Philosophy
            </span>
            <h2 className="font-light text-2xl md:text-3xl lg:text-4xl leading-[1.2] text-[var(--text-primary)] tracking-wide mb-6">
              Not Made. Composed.
            </h2>
            
            <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed text-center lg:text-left max-w-md">
              We believe that a bespoke rug is the foundation of any architectural space. By collaborating closely with designers and clients, we translate distinct visions into tactile realities. Each piece is meticulously hand-knotted by master artisans using only the finest natural fibers, ensuring a legacy of unmatched quality and timeless design.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
