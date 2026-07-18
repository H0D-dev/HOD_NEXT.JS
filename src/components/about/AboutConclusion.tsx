"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AboutConclusion() {
  return (
    <section className="w-full bg-[var(--bg-primary)]">
      <div className="w-full px-6 md:px-12 lg:px-16 py-8 lg:py-12 flex flex-col lg:flex-row gap-12 lg:gap-16 justify-between items-center max-w-[var(--container-lg)] mx-auto">
        
        {/* Text Side (Left) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="w-full lg:w-[40%] flex flex-col items-start text-left"
        >
          <h2 className="font-sans text-xs md:text-sm font-semibold tracking-[0.2em] text-[var(--text-primary)] mb-4 uppercase">
            DESIGNED FOR BEAUTIFUL SPACES
          </h2>
          
          <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)] mb-8">
            "A rug is not just a piece of decor; it is the foundation of a room, the soul of a space." We believe that every space should reflect the character of its inhabitants. Our bespoke creations are crafted to anchor your home with timeless elegance and unparalleled quality.
          </p>
          
          <Link
            href="/bespoke"
            className="inline-block border-b border-[var(--text-primary)] text-[var(--text-primary)] font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium pb-1 transition-colors hover:text-[var(--text-secondary)] hover:border-[var(--text-secondary)]"
          >
            DISCOVER BESPOKE
          </Link>
        </motion.div>

        {/* Image Side (Right) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
          className="relative w-full lg:w-[55%] aspect-[16/9] overflow-hidden"
        >
          <Image
            src="/contact_hero_desktop.png"
            alt="Luxury interior setting"
            fill
            className="object-cover object-[center_75%] transition-transform duration-1000 hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        </motion.div>
        
      </div>
    </section>
  );
}
