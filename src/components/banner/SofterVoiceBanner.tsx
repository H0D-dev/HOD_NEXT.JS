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
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
      >
        <h2 className="softer-voice__heading">
          <span className="softer-voice__line-1 relative w-fit">
            Give Your Home
            <svg
              className="absolute -top-6 -right-6 w-10 h-10 sm:-top-10 sm:-right-10 sm:w-16 sm:h-16 md:-top-16 md:-right-20 md:w-24 md:h-24 drop-shadow-sm"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Base */}
              <path d="M 20 53 C 20 75 25 90 35 90 C 45 90 55 90 65 90 C 75 90 80 75 80 53 Z" fill="var(--bg-primary)" />
              {/* Inner Window/Door */}
              <path d="M 33 55 C 33 70 38 75 45 75 C 52 75 55 70 55 55 Z" fill="none" />
              {/* Awning/Roof */}
              <path d="M 25 20 C 35 15 65 15 75 20 C 85 30 95 45 90 55 C 85 60 75 58 65 50 C 55 60 45 60 35 50 C 25 58 15 60 10 55 C 5 45 15 30 25 20 Z" fill="var(--bg-primary)" />
              {/* Highlights */}
              <path d="M 20 40 C 25 25 40 22 55 22" stroke="currentColor" strokeWidth="4" fill="none" />
              <path d="M 37 60 C 37 70 40 72 46 72" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </span>
          <div className="softer-voice__bottom-row">
            <svg
              className="softer-voice__arrow"
              viewBox="0 0 100 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 10 10 C 20 70, 50 90, 90 90"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 70 70 L 95 90 L 70 105"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="softer-voice__line-2">
              a <em>Softer Voice.</em>
            </span>
          </div>
        </h2>
      </motion.div>
    </section>
  );
}
