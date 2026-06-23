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

const maskReveal = {
  hidden: { y: "120%" },
  visible: {
    y: "0%",
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any },
  },
};

const lineReveal = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any },
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
        <div className="hero__heading-wrapper" >
          <motion.h1 className="hero__heading" variants={maskReveal}>
            Handwoven
            <span className="hero__heading-accent">Excellence</span>
          </motion.h1>
        </div>

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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          >
            <a href="#book" className="hero__cta hero__cta--primary">
              Book Consultation
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Right Showcase ── */}
      <motion.div
        className="hero__right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] as any, delay: 0.4 }}
      >
        <RugShowcase />
      </motion.div>
    </section>
  );
}
