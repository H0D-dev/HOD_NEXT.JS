"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  const { scrollY } = useScroll();
  // Image moves down by 300px when the user scrolls down by 1000px
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  return (
    <section className="relative w-full h-[100svh] flex flex-col justify-end lg:justify-center pb-28 sm:pb-32 lg:pb-0 overflow-hidden" id="hero-section">

      {/* ── Background Image ── */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <motion.div
          className="absolute w-full h-[120%] -top-[10%]"
          style={{ y }}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <Image
            src="/hero/Firefly_Gemini Flash_Revision Instructions__The current composition does not follow the intended layout. P 909020.png"
            alt="Luxury rugs and curtains background"
            fill
            priority
            quality={100}
            unoptimized
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent lg:bg-gradient-to-r lg:from-black/60 lg:via-black/10 lg:to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* ── Left Content (Text) ── */}
      <div className="w-full lg:w-1/2 px-6 sm:px-12 md:px-16 lg:px-20 xl:px-32 relative z-20 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[85vw] sm:max-w-md md:max-w-lg"
        >
          <h1 className="font-sans text-[clamp(2.5rem,8vw,4.5rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white mb-4 sm:mb-6 drop-shadow-md">
            From the <br /> House of Décor <br /> with love.
          </h1>

          <p className="font-sans text-sm sm:text-base md:text-lg text-white/90 font-light max-w-[90%] sm:max-w-sm mb-8 sm:mb-10 leading-relaxed drop-shadow">
            Premium handmade rugs and bespoke interior solutions, crafted for luxury living spaces.
          </p>

          <motion.a
            href="#collections-section"
            className="group relative inline-flex items-center gap-4 font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-white drop-shadow-sm"
            whileHover="hover"
          >
            <span>Explore Collection</span>
            <span className="relative w-8 h-[1px] bg-white overflow-hidden">
              <motion.span
                className="absolute inset-0 bg-white"
                initial={{ x: "-100%" }}
                variants={{
                  hover: { x: "100%", transition: { duration: 0.8, repeat: Infinity, ease: "linear" } }
                }}
              />
            </span>
          </motion.a>
        </motion.div>
      </div>

    </section>
  );
}
