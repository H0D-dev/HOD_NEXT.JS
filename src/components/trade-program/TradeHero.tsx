"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function TradeHero() {
  return (
    <section className="w-full min-h-[90vh] flex flex-col md:flex-row bg-[var(--bg-primary)] pt-24 md:pt-32">
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 xl:px-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="max-w-xl"
        >
          <span className="block text-[var(--accent-primary)] font-sans text-xs md:text-sm uppercase tracking-widest mb-6 md:mb-8 font-medium">
            Partnership
          </span>
          <h1 className="font-serif text-[clamp(48px,8vw,80px)] leading-[1.05] tracking-tight text-[var(--text-primary)] mb-8">
            Designer Trade Program
          </h1>
          <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed mb-12 max-w-md">
            Exclusively for interior design professionals working on private residences and commercial spaces. Elevate your projects with our premium handmade rugs and bespoke curtains.
          </p>
          <button className="px-8 py-4 border border-[var(--border-primary)] text-[var(--text-primary)] bg-transparent font-sans font-medium text-sm md:text-base hover:bg-[var(--accent-secondary)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] w-full sm:w-auto">
            Apply Now
          </button>
        </motion.div>
      </div>

      {/* Right Image */}
      <div className="flex-1 relative min-h-[50vh] md:min-h-full p-6 md:p-12 lg:p-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as any }}
          className="w-full h-full min-h-[400px] relative overflow-hidden"
        >
          <Image
            src="/curtains/set2-room.png"
            alt="Luxury Interior Design Trade Program"
            fill
            className="object-cover transform hover:scale-105 transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)]"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
