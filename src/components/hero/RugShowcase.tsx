"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RugCard from "./RugCard";
import "./RugShowcase.css";

const showcaseSets = [
  {
    id: "premium-curtains",
    label: "Premium Curtains",
    cards: [
      { src: "/curtains/set1-full.png", alt: "Premium Curtain — full view" },
      { src: "/curtains/set1-room.png", alt: "Premium Curtain — room placement" },
      { src: "/curtains/set1-texture.png", alt: "Premium Curtain — texture detail" },
    ],
  },
  {
    id: "artisan-rugs",
    label: "Artisan Rugs",
    cards: [
      { src: "/rugs/set1-full.png", alt: "Artisan Rug — full view" },
      { src: "/rugs/set1-room.png", alt: "Artisan Rug — room placement" },
      {
        src: "/rugs/set1-texture.png",
        alt: "Artisan Rug — texture detail",
      },
    ],
  },
];

/* ── Card config ── */
const cardConfig = [
  {
    className: "rug-showcase__card--top",
    parallaxMultiplier: 0.05,
    animation: {
      initial: { opacity: 0, x: 80, y: -60, scale: 0.9 },
      animate: { opacity: 1, x: 0, y: 0, scale: 1 },
      exit: { opacity: 0, x: 80, y: -60, scale: 0.9 },
    },
  },
  {
    className: "rug-showcase__card--center",
    parallaxMultiplier: 0.02,
    animation: {
      initial: { opacity: 0, y: 60, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -40, scale: 0.95 },
    },
  },
  {
    className: "rug-showcase__card--bottom",
    parallaxMultiplier: 0.08,
    animation: {
      initial: { opacity: 0, x: -80, y: 60, scale: 0.9 },
      animate: { opacity: 1, x: 0, y: 0, scale: 1 },
      exit: { opacity: 0, x: -80, y: 60, scale: 0.9 },
    },
  },
];

const easing = [0.22, 1, 0.36, 1] as const;

export default function RugShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Mouse parallax tracking ── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  /* ── Preload all images on mount ── */
  useEffect(() => {
    showcaseSets.forEach((set) => {
      set.cards.forEach((card) => {
        const img = new window.Image();
        img.src = card.src;
      });
    });
  }, []);

  /* ── Navigation ── */
  const navigate = useCallback((dir: number) => {
    setActiveIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return showcaseSets.length - 1;
      if (next >= showcaseSets.length) return 0;
      return next;
    });
  }, []);

  /* ── Auto-play slideshow ── */
  useEffect(() => {
    const interval = setInterval(() => {
      navigate(1);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(interval);
  }, [navigate]);

  const currentSet = showcaseSets[activeIndex];

  return (
    <div className="rug-showcase" ref={containerRef}>
      {/* ── Card area ── */ }
      <div className="rug-showcase__cards">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSet.id}
            className="rug-showcase__card-group"
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {currentSet.cards.map((card, i) => {
              const cfg = cardConfig[i];
              const parallax = {
                x: mousePos.x * cfg.parallaxMultiplier * 100,
                y: mousePos.y * cfg.parallaxMultiplier * 100,
              };

              return (
                <motion.div
                  key={`${currentSet.id}-${i}`}
                  className={`rug-showcase__card-wrapper ${cfg.className}`}
                  initial={cfg.animation.initial}
                  animate={cfg.animation.animate}
                  exit={cfg.animation.exit}
                  transition={{
                    duration: 0.8 + i * 0.1, /* Faster, more responsive transition */
                    ease: easing,
                    delay: i * 0.1, /* Tighter staggered delay */
                  }}
                >
                  <RugCard
                    src={card.src}
                    alt={card.alt}
                    parallaxOffset={parallax}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer: label + navigation ── */}
      <div className="rug-showcase__footer">
        <div className="rug-showcase__label">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentSet.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.8, ease: easing }}
              className="rug-showcase__label-text"
            >
              {currentSet.label}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="rug-showcase__nav">
          <button
            className="rug-showcase__arrow"
            onClick={() => navigate(-1)}
            aria-label="Previous rug collection"
            id="hero-prev-btn"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 4L7 12L15 20"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="square"
              />
            </svg>
          </button>

          <div className="rug-showcase__dots">
            {showcaseSets.map((_, i) => (
              <span
                key={i}
                className={`rug-showcase__dot ${i === activeIndex ? "rug-showcase__dot--active" : ""}`}
              />
            ))}
          </div>

          <button
            className="rug-showcase__arrow"
            onClick={() => navigate(1)}
            aria-label="Next rug collection"
            id="hero-next-btn"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 4L17 12L9 20"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="square"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
