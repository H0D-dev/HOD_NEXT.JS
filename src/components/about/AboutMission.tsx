"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutMission() {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)] border-y border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-md)] mx-auto flex flex-col items-center text-center gap-12">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="flex flex-col gap-8"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)]">
            Our Vision & Mission
          </h2>
          <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed">
            House of Décor came into existence with a vision to provide an international platform to artisans to showcase their incredible craftsmanship to the world, and to provide high-quality handmade products to customers across the globe.
          </p>
          <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed">
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
            className="group flex items-center gap-4 bg-[var(--text-primary)] text-[var(--bg-primary)] px-8 py-4 rounded-full font-sans text-sm tracking-widest uppercase transition-transform hover:scale-105 duration-300 mt-8"
          >
            View Services
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
