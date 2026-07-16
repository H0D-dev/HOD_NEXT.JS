"use client";

import React, { useRef } from "react";
import Image from "next/image";

const materials = [
  { img: "/images/bespoke/bamboo_silk.png", title: "Bamboo Silk", desc: "Luminous, soft, and sustainably sourced for a stunning visual sheen." },
  { img: "/images/bespoke/nz_wool.png", title: "New Zealand Wool", desc: "Incredibly durable, tactile, and rich with natural insulating properties." },
  { img: "/images/bespoke/bamboo_silk.png", title: "Silk Blends", desc: "A masterful combination of strength and undeniable luxury." },
  { img: "/images/bespoke/nz_wool.png", title: "Natural Dyes", desc: "Time-honored extraction methods for deep, enduring colorways." },
];

const getTopClass = (idx: number) => {
  const zIndexes = ["z-10", "z-20", "z-30", "z-40", "z-50"];
  switch (idx) {
    case 0: return `top-[4rem] md:top-[6rem] ${zIndexes[0]}`;
    case 1: return `top-[4.5rem] md:top-[6.5rem] ${zIndexes[1]}`;
    case 2: return `top-[5rem] md:top-[7rem] ${zIndexes[2]}`;
    case 3: return `top-[5.5rem] md:top-[7.5rem] ${zIndexes[3]}`;
    default: return `top-[6rem] md:top-[8rem] ${zIndexes[4]}`;
  }
};

export default function MaterialsSection() {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section ref={containerRef} className="w-full bg-[#2C251F] pb-16 md:pb-32 pt-16 md:pt-32">
      <div className="container mx-auto px-6 max-w-[1400px]">
        {/* Top Header */}
        <div className="flex flex-col items-center text-center w-full mb-16 md:mb-24 px-4 md:px-8">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[#F7F77E] mb-6 font-sans">
            Our Materials
          </span>
          <h2 className="font-serif text-xl md:text-4xl lg:text-[2.75rem] leading-[1.2] tracking-wide text-white max-w-4xl">
            Materials chosen not for trends, but for timelessness.
          </h2>
        </div>

        {/* Sticky Stacking Grid */}
        <div className="flex flex-col w-full relative space-y-12 md:space-y-24">
          {materials.map((mat, idx) => (
            <div
              key={idx}
              className={`craft-panel sticky ${getTopClass(idx)} w-full relative min-h-[450px] md:h-[550px] overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]`}
            >
              {/* Full Background Image */}
              <div className="absolute inset-0 w-full h-full z-0">
                <Image
                  src={mat.img}
                  alt={mat.title}
                  fill
                  className="object-cover"
                />
                {/* Gradient Overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#2C251F]/90 via-[#2C251F]/50 to-transparent"></div>
              </div>

              {/* Text Overlay */}
              <div className="relative z-10 w-full h-full md:w-[70%] lg:w-[60%] flex flex-col justify-center items-start p-8 md:p-16 lg:p-24 text-white">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-neutral-300 mb-4 block font-sans">
                  0{idx + 1}
                </span>
                <h3 className="font-serif text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] leading-[1.1] tracking-tight text-white mb-6">
                  {mat.title}
                </h3>
                <p className="font-sans max-w-xl text-neutral-300 text-sm md:text-base leading-relaxed mb-10">
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
