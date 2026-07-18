"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SofterVoiceBanner() {
  return (
    <section className="w-full bg-[var(--bg-secondary)] border-y border-[var(--border-secondary)] py-20 lg:py-32 flex justify-center items-center overflow-hidden">
      <motion.div
        className="px-6 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal leading-tight tracking-tight flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <span className="relative flex items-center gap-3">
            Give Your Home
          </span>
          <span className="flex items-center gap-3 italic text-[var(--text-secondary)]">
            <svg
              className="w-8 h-8 md:w-12 md:h-12 text-[var(--accent-secondary)] opacity-80"
              viewBox="0 0 100 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 10 10 C 20 70, 50 90, 90 90"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 70 70 L 95 90 L 70 105"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            a Softer Voice.
          </span>
        </h2>
      </motion.div>
    </section>
  );
}
