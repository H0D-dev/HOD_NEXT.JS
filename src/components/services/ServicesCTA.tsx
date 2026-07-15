"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";

export default function ServicesCTA() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="bg-[var(--surface-primary)] p-8 md:p-12 lg:p-16 border border-[var(--border-secondary)] flex flex-col items-start gap-8"
        >
          <div>
            <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-[var(--text-primary)] mb-4">
              Looking for Professional Services?
            </h3>
            <p className="font-sans text-[var(--text-secondary)] text-xs md:text-sm leading-relaxed">
              Explore our Designer Trade Program tailored for architects, interior designers, and trade professionals.
            </p>
          </div>
          <Link
            href="/designer-trade-program"
            className="group flex items-center gap-4 bg-transparent border border-[var(--border-primary)] text-[var(--text-primary)] px-8 py-4 rounded-none font-sans text-[10px] md:text-xs tracking-[0.2em] font-medium uppercase transition-all duration-500 hover:bg-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:text-[#111] mt-auto"
          >
            Find Out More
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
          className="bg-[var(--surface-primary)] p-8 md:p-12 lg:p-16 border border-[var(--border-secondary)] flex flex-col items-start gap-8"
        >
          <div>
            <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-[var(--text-primary)] mb-4">
              Need Some Expert Guidance?
            </h3>
            <p className="font-sans text-[var(--text-secondary)] text-xs md:text-sm leading-relaxed">
              Whether you need styling advice, you’re looking for a custom size, or you have a bespoke project - our expert advisors are here to answer all of your questions.
            </p>
          </div>
          <a
            href="tel:+971521236888"
            className="group flex items-center gap-4 bg-[var(--text-primary)] border border-[var(--text-primary)] text-[var(--bg-primary)] px-8 py-4 rounded-none font-sans text-[10px] md:text-xs tracking-[0.2em] font-medium uppercase transition-all duration-500 hover:bg-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:text-[#111] mt-auto"
          >
            Call Now
            <PhoneCall size={18} />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
