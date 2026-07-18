"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AboutMission() {
  const images = [
    { src: "/about/mid_artisan_weaving_1784353786135.png", alt: "Modern heritage weaving" },
    { src: "/about/mid_artisan_yarn_1784353795576.png", alt: "Bright artisan studio" },
    { src: "/about/mid_artisan_unrolling_1784353805809.png", alt: "Unrolling finished luxury rug" }
  ];

  return (
    <section className="w-full bg-[var(--bg-primary)]">
      {/* Text Section */}
      <div className="w-full py-8 lg:py-12 px-6 md:px-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="flex flex-col items-center max-w-2xl gap-6 md:gap-8"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="font-sans text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-[var(--text-secondary)]">
              ROOTED IN HERITAGE. MADE FOR TODAY.
            </span>
            <h2 className="font-serif text-xl md:text-2xl lg:text-3xl leading-[1.2] tracking-tight text-[var(--text-primary)]">
              OUR STORY
            </h2>
          </div>

          <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
            We collaborate with master artisans whose skills have been passed down through generations. Each rug is a work of art—hand-knotted, hand-finished, and created using the finest natural materials.
          </p>

        </motion.div>
      </div>

      {/* Image Grid Section */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 bg-[var(--bg-primary)]">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="relative w-full aspect-square md:aspect-[4/5]"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
