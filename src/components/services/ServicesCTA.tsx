"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function ServicesCTA() {
  return (
    <section className="w-full relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-[var(--bg-primary)]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/services_cta_bg.png"
          alt="Luxury rug texture"
          fill
          className="object-cover opacity-90"
          sizes="100vw"
        />
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto px-5 md:px-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="flex flex-col items-center w-full"
        >
          <h2 className="font-sans font-light text-[2.25rem] sm:text-[2.75rem] md:text-[4rem] text-white leading-[1.1] mb-6 drop-shadow-lg">
            Let's Create<br />Something Exceptional.
          </h2>
          <p className="font-sans text-sm md:text-base text-white/90 mb-10 max-w-md drop-shadow-md">
            Your vision. Our craftsmanship. Timeless elegance for every space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 border border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[#111] font-sans text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-transparent hover:text-white transition-all duration-300 text-center w-full sm:w-auto"
            >
              Book a Consultation
            </Link>
            <Link
              href="/contact?type=custom"
              className="px-8 py-4 bg-white text-[var(--text-primary)] font-sans text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-gray-100 transition-colors duration-300 text-center w-full sm:w-auto"
            >
              Start Custom Project
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
