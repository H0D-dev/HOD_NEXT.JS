"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ProductsHero() {
  return (
    <section className="relative w-full h-[70vh] lg:h-screen flex flex-col justify-end lg:justify-center overflow-hidden bg-black border-b border-[var(--border-secondary)]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/products/Product-hero.png"
          alt="Luxury living room featuring a handcrafted area rug"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 relative z-20 flex flex-col pt-56 pb-8 md:pb-32 md:pt-32 lg:pb-0 mt-20 md:mt-12 lg:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
          className="flex flex-col items-start gap-0 text-white text-left max-w-4xl"
        >
          <h1 className="font-sans font-light text-[2.25rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.1] tracking-wide mb-4 drop-shadow-lg text-left">
            Curated Collections.<br />Art for Your Floors.
          </h1>
          <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] mt-6 leading-relaxed mb-10 text-white/90 max-w-xl drop-shadow-md text-left">
            Discover a hand-selected portfolio of luxury rugs, where traditional mastery meets contemporary elegance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
