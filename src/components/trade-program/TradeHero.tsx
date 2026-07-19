"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function TradeHero() {
  return (
    <section className="w-full flex flex-col lg:flex-row bg-[var(--bg-primary)] pt-24 pb-8 md:pb-12 lg:pt-32 lg:pb-16 lg:min-h-[70vh]">
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
          <h1 className="font-sans text-[clamp(36px,6vw,72px)] font-light leading-none tracking-wide text-[var(--text-primary)] mb-6">
            Designer Trade Program
          </h1>
          <p className="font-sans text-[var(--text-secondary)] text-base md:text-lg font-light leading-relaxed mb-8 max-w-md">
            Exclusive benefits for interior design professionals. Elevate your spaces with our premium handmade rugs and bespoke carpets.
          </p>
          <a 
            href="https://wa.me/971521236888?text=I%20would%20like%20to%20apply%20for%20the%20Designer%20Trade%20Program."
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[var(--accent-primary)] text-[#111] border border-[var(--accent-primary)] font-sans font-medium text-xs md:text-sm hover:bg-[var(--accent-secondary)] hover:border-[var(--accent-secondary)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] w-full sm:w-auto inline-block text-center uppercase tracking-widest"
          >
            Apply Now
          </a>
        </motion.div>
      </div>

      {/* Right Image */}
      <div className="hidden md:flex flex-1 relative min-h-[50vh] lg:min-h-full p-6 md:p-12 lg:p-16 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as any }}
          className="w-full h-full min-h-[250px] md:min-h-[400px] relative overflow-hidden"
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
