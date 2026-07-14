"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const techniques = [
  {
    id: "hand-knotted",
    title: "Hand Knotted",
    image: "/rugs/set1-texture.png",
    paragraphs: [
      "A meticulous, time-honored process taking up to a year, where each knot is individually tied to build incredibly dense and intricate patterns."
    ]
  },
  {
    id: "hand-tufted",
    title: "Hand Tufted",
    image: "/rugs/set2-texture.png",
    paragraphs: [
      "Artisans use a tufting tool to punch yarn through a canvas backing, creating plush, beautifully textured designs with remarkable efficiency."
    ]
  },
  {
    id: "handloom",
    title: "Handloom",
    image: "/rugs/set3-texture.png",
    paragraphs: [
      "Woven on a traditional loom by interlocking warp and weft threads, offering a refined, printed finish that perfectly highlights natural fibers."
    ]
  },
  {
    id: "flat-weave",
    title: "Flat Weave",
    image: "/rugs/set1-room.png",
    paragraphs: [
      "Highly versatile and durable, these rugs are created without a pile, making them lightweight and perfect for displaying striking geometric patterns."
    ]
  }
];

export default function TechniqueList() {
  return (
    <section className="w-full pb-16 md:pb-40 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)] pt-12 md:pt-20">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
          {techniques.map((technique, index) => (
            <motion.div
              key={technique.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
              className="flex flex-col group cursor-pointer"
            >
              {/* Image */}
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-[var(--surface-primary)] border border-[var(--border-secondary)] mb-8">
                <Image
                  src={technique.image}
                  alt={technique.title}
                  fill
                  className="object-cover transition-transform duration-[1.5s] group-hover:scale-105 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </div>

              {/* Text */}
              <span className="font-sans text-[10px] md:text-xs text-[var(--text-muted)] tracking-widest mb-4 uppercase">
                Technique 0{index + 1}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-4 transition-colors duration-300">
                {technique.title}
              </h2>
              {technique.paragraphs.map((p, i) => (
                <p key={i} className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                  {p}
                </p>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
