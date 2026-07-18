"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const materials = [
  { img: "/images/bespoke/bamboo_silk.png", title: "Bamboo Silk", desc: "Luminous, soft, and sustainably sourced for a stunning visual sheen." },
  { img: "/images/bespoke/nz_wool.png", title: "New Zealand Wool", desc: "Incredibly durable, tactile, and rich with natural insulating properties." },
  { img: "/images/bespoke/cashmere_blend.png", title: "Cashmere Blends", desc: "A masterful combination of strength and undeniable luxury." },
  { img: "/images/materials.png", title: "Natural Dyes", desc: "Time-honored extraction methods for deep, enduring colorways." },
];

export default function MaterialsSection() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={containerRef} className="w-full bg-[#2C251F] py-8 md:py-10 lg:py-12 border-b border-[#3d332b]">
      <div className="container mx-auto px-6 max-w-[1400px]">
        {/* Top Header */}
        <div className="flex flex-col items-center text-center w-full mb-8 md:mb-10 px-4 md:px-8">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--accent-primary)] mb-4">
            Our Materials
          </span>
          <h2 className="font-light text-xl md:text-2xl lg:text-3xl leading-[1.2] tracking-wide text-white max-w-3xl">
            Materials chosen not for trends, but for timelessness.
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {materials.map((mat, idx) => (
            <div key={idx} className="group flex flex-col cursor-pointer">
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#1f1a16] mb-5">
                <motion.div 
                  className="absolute inset-0 w-full h-[130%] -top-[15%]"
                  style={{ y: imgY }}
                >
                  <Image
                    src={mat.img}
                    alt={mat.title}
                    fill
                    className="object-cover transition-transform duration-[1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                </motion.div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent-primary)] mb-2 block font-medium">
                  0{idx + 1}
                </span>
                <h3 className="font-medium text-base md:text-lg leading-tight text-white mb-2">
                  {mat.title}
                </h3>
                <p className="text-neutral-400 text-xs md:text-sm font-light leading-relaxed max-w-sm">
                  {mat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
