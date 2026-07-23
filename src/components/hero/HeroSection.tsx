"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/images/home/Home-Hero-Image-1.png",
    "/images/home/Home-Hero-Image-2.png",
    "/images/home/Home-Hero-Image-3.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useGSAP(() => {
    // Background parallax effect
    gsap.to(bgRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    // Fade and translate content upwards
    gsap.from(gsap.utils.toArray(contentRef.current?.children || []), {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full h-[70vh] lg:h-screen flex flex-col justify-end lg:justify-center overflow-hidden bg-black" id="hero-section">
      
      {/* ── Background Image Desktop (Parallax) ── */}
      <div className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 hidden md:block" ref={bgRef}>
        <AnimatePresence>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={images[currentImageIndex]}
              alt="Luxury architectural interior"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 0vw, 100vw"
            />
          </motion.div>
        </AnimatePresence>
        {/* Subtle gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-black/40 md:bg-gradient-to-r from-black/70 to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* ── Background Image Mobile (Static to prevent jitter) ── */}
      <div className="absolute inset-0 w-full h-full z-0 block md:hidden">
        <AnimatePresence>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={images[currentImageIndex]}
              alt="Luxury architectural interior"
              fill
              priority
              className="object-cover object-[center_30%]"
              sizes="(max-width: 768px) 100vw, 0vw"
            />
          </motion.div>
        </AnimatePresence>
        {/* Subtle gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none"></div>
      </div>

      {/* ── Content ── */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32 relative z-20 flex flex-col pt-32 pb-24 md:py-32 lg:pb-0 mt-20 md:mt-12 lg:mt-16">
          {/* Hero Content Layer */}
          <div ref={contentRef} className="flex flex-col items-start gap-0 text-white text-left">
            
            <h1 className="font-light text-[2.25rem] sm:text-[2.75rem] md:text-[4rem] lg:text-[4rem] leading-[1.1] tracking-wide mb-4 max-w-4xl text-left">
              Luxury Beneath <br /> Every Space.
            </h1>
            
            <p className="max-w-xl text-neutral-300 text-[10px] md:text-xs uppercase tracking-[0.2em] mt-6 leading-relaxed mb-4 text-left">
              Premium handwoven rugs and bespoke curtains crafted for architectural interiors. Where heritage techniques meet modern luxury.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start justify-start mt-4 w-full sm:w-auto">
              <Link href="/bespoke" className="group relative w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 sm:px-10 sm:py-4 border-[0.5px] border-white/60 overflow-hidden text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-center text-white">
                <span className="relative z-10 transition-colors duration-[0.6s] group-hover:text-white">Start Your Project</span>
                <div className="absolute inset-0 bg-[var(--accent-primary)] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Element: Vertical SCROLL indicator */}
        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-4 z-20 pb-0 hidden md:flex">
          <span className="text-[10px] text-white uppercase tracking-[0.3em]" style={{ writingMode: 'vertical-rl' }}>
            SCROLL
          </span>
          <div className="w-[1px] h-16 bg-white/30 overflow-hidden">
            <div className="w-full h-full bg-white origin-top animate-pulse"></div>
          </div>
        </div>

    </section>
  );
}
