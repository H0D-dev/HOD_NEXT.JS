"use client";

import { motion } from "framer-motion";
import RugShowcase from "./RugShowcase";
import "./HeroSection.css";

/* ── Animation Variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  },
};

const lineReveal = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  return (
    <section className="hero" id="hero-section">
      {/* ── Left Content ── */}
      <motion.div
        className="hero__left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero__heading-wrapper" variants={fadeUp}>
          <h1 className="hero__heading">
            Handwoven
            <span className="hero__heading-accent">Excellence</span>
          </h1>
        </motion.div>

        <motion.div
          className="hero__divider"
          variants={lineReveal}
          style={{ originX: 0 }}
        />

        <motion.p className="hero__description" variants={fadeUp}>
          Tailoring luxury, one thread at a time. Premium handmade rugs and
          bespoke interior solutions.
        </motion.p>

        <motion.div className="hero__cta-group" variants={fadeUp}>
          <a href="#book" className="hero__cta hero__cta--primary">
            Book Consultation
          </a>
        </motion.div>
      </motion.div>

      {/* ── Right Showcase ── */}
      <motion.div
        className="hero__right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      >
        <RugShowcase />
      </motion.div>
    </section>
  );
}
