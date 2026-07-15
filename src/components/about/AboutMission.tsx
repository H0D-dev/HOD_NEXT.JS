"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutMission() {
  return (
    <section className="w-full py-16 lg:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)] border-y border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-md)] mx-auto flex flex-col items-center text-center gap-12">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="flex flex-col gap-8"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[var(--text-primary)]">
            Our Vision & Mission
          </h2>
          <p className="font-sans text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
            House of Décor came into existence with a vision to provide an international platform to artisans to showcase their incredible craftsmanship to the world, and to provide high-quality handmade products to customers across the globe.
          </p>
          <p className="font-sans text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
            Our mission is to promote sustainable materials in the home décor industry and to create a sustainable business ecosystem for the artisan community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
        >
          <Link
            href="/services"
            className="group flex mx-auto w-max items-center justify-center gap-4 bg-transparent border border-[var(--border-primary)] text-[var(--text-primary)] px-8 py-4 font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-500 hover:bg-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:text-[#111] mt-8 rounded-none"
          >
            View Services
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
