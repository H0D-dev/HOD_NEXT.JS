"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="w-full pt-32 pb-16 md:pt-48 md:pb-24 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="lg:w-1/2 flex flex-col items-start text-left"
        >
          <span className="block text-[var(--accent-primary)] font-sans text-xs md:text-sm uppercase tracking-widest mb-6 font-medium">
            Who we are
          </span>
          <h1 className="font-serif text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] leading-[1.1] tracking-tight text-[var(--text-primary)] mb-8">
            House of Décor
          </h1>
          <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed">
            House of Décor offers luxury custom-made rugs, carpets, curtains, wallcoverings, handicrafts, and more. Through our exclusive network of international suppliers, we provide architects, designers, and private clients with the material to transform their commercial or residential spaces into beautiful masterpieces.
          </p>
        </motion.div>

        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
          className="lg:w-1/2 w-full aspect-[4/5] relative bg-[var(--surface-primary)] overflow-hidden border border-[var(--border-secondary)]"
        >
          <Image
            src="/rugs/set1-room.png"
            alt="Luxury Interior by House of Décor"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

      </div>
    </section>
  );
}
