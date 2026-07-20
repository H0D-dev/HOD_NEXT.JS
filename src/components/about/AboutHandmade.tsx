"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AboutHandmade() {
  const images = [
    { src: "/images/bespoke/nz_wool.png", alt: "New Zealand Wool" },
    { src: "/images/bespoke/bamboo_silk.png", alt: "Bamboo Silk" },
    { src: "/know_your_rug_hero_desktop.png", alt: "Finished Rug Texture" }
  ];

  return (
    <section className="w-full bg-[var(--bg-secondary)]">
      <div className="w-full px-6 md:px-12 lg:px-16 py-8 md:py-12 lg:py-16 flex flex-col lg:flex-row gap-12 lg:gap-0 justify-between items-center max-w-[var(--container-lg)] mx-auto">
        
        {/* Text Side (Left) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="w-full lg:w-[25%] flex flex-col items-start text-left shrink-0"
        >
          <h2 className="font-sans font-light text-xl lg:text-2xl leading-[1.2] tracking-wide text-[var(--text-primary)] mb-4">
            The Art of Handmade
          </h2>
          
          <p className="font-sans text-sm md:text-base font-light leading-relaxed text-[var(--text-secondary)] mb-8 w-full">
            From the selection of the finest wool and silk to the final wash and finish, every step is carried out by hand. The result is a rug with soul, character, and timeless beauty.
          </p>
          
          <Link
            href="/know-your-rug/rug-making-process"
            className="inline-block border-b border-[var(--text-primary)] text-[var(--text-primary)] font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold pb-1 transition-colors hover:text-[var(--text-secondary)] hover:border-[var(--text-secondary)]"
          >
            DISCOVER THE PROCESS
          </Link>
        </motion.div>

        {/* Image Grid Side (Right) */}
        <div className="w-full lg:w-[65%] grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative w-full aspect-square overflow-hidden"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-1000 hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
