"use client";

import { motion } from "framer-motion";
import RugShowcase from "./RugShowcase";
import "./HeroSection.css";

/* ── Animation config ── */
const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease },
  },
};

const lineReveal = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.0, ease },
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
            <br />
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
          <a href="#collections" className="hero__cta hero__cta--primary" id="hero-explore-btn">
            Explore Collection
          </a>
          <a href="#contact" className="hero__cta hero__cta--secondary" id="hero-book-btn">
            Book Appointment
          </a>
        </motion.div>

        <motion.div className="hero__meta" variants={fadeUp}>
          <span className="hero__meta-item">Est. 2024</span>
          <span className="hero__meta-divider">—</span>
          <span className="hero__meta-item">Handmade with precision</span>
        </motion.div>
      </motion.div>
      {/* ── Right Showcase ── */}
      <motion.div
        className="hero__right"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <RugShowcase />
      </motion.div>
    </section>
  );
}
