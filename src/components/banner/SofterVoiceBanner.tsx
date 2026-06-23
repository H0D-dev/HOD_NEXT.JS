"use client";

import React from "react";
import { motion } from "framer-motion";
import "./SofterVoiceBanner.css";

export default function SofterVoiceBanner() {
  return (
    <section className="softer-voice">
      <motion.div
        className="softer-voice__container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="softer-voice__heading">
          <span className="softer-voice__line-1">Give Your Home</span>
          <br />
          <span className="softer-voice__line-2">a <em>Softer Voice.</em></span>
        </h2>
      </motion.div>
    </section>
  );
}
