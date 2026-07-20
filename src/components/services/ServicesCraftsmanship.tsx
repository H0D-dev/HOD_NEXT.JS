"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function ServicesCraftsmanship() {
  const images = [
    "/services_craft_1.png",
    "/services_craft_2.png",
    "/services_craft_3.png",
    "/services_craft_4.png",
  ];

  return (
    <section className="w-full py-8 md:py-12 lg:py-16 px-5 md:px-10 lg:px-16 bg-[var(--bg-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left: Sticky Title & Text */}
        <div className="lg:w-1/4 shrink-0">
          <div className="sticky top-32 flex flex-col">
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6 font-medium">
              Craftsmanship
            </span>
            <h2 className="font-sans font-light text-xl lg:text-2xl text-[var(--text-primary)] mb-6 md:mb-8">
              Rooted in Tradition.<br className="hidden lg:block" /> Perfected by Hand.
            </h2>
            <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)] mb-10 max-w-sm">
              Our rugs are a celebration of time-honored techniques and masterful artistry. Every knot, every thread, and every detail reflects our unwavering commitment to quality.
            </p>
            <Link 
              href="/craft" 
              className="w-fit px-8 py-3 border border-[var(--border-primary)] text-[var(--text-primary)] font-sans text-[10px] uppercase tracking-[0.2em] font-medium hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[#111] transition-colors duration-300"
            >
              Discover Our Craft
            </Link>
          </div>
        </div>

        {/* Right: 2x2 Image Grid */}
        <div className="lg:w-3/4">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
                className="w-full aspect-square relative bg-[var(--surface-primary)] overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`Craftsmanship detail ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[2s] hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
