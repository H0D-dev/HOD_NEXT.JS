"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const topics = [
  {
    id: "weaving-techniques",
    title: "Weaving Techniques",
    description: "Explore our exquisite weaving techniques that blend tradition with modern artistry to create stunning, high-quality rugs.",
    image: "/rugs/set1-room.png", // Placeholder for: Woman weaving on a loom
  },
  {
    id: "fibers-material",
    title: "Fibers & Material",
    description: "Discover our premium fibers and materials, chosen for their durability and beauty, ensuring every rug is a masterpiece.",
    image: "/rugs/set1-texture.png", // Placeholder for: Spools of colorful thread
  },
  {
    id: "rug-making-process",
    title: "Rug Making Process",
    description: "Experience the meticulous rug-making process, where skilled artisans transform your design into a handcrafted work of art.",
    image: "/rugs/set2-texture.png", // Placeholder for: Partially finished woven rug
  },
  {
    id: "rug-guide",
    title: "Rug Guide",
    description: "Navigate your perfect rug choice with our comprehensive rug guide, featuring tips on style, size, and care for lasting beauty.",
    image: "/rugs/set2-room.png", // Placeholder for: Woman looking at folded rugs
  },
];

const getTopClass = (idx: number) => {
  const zIndexes = ["z-10", "z-20", "z-30", "z-40", "z-50"];
  switch (idx) {
    case 0: return `top-[4rem] md:top-[6rem] ${zIndexes[0]}`;
    case 1: return `top-[4.5rem] md:top-[6.5rem] ${zIndexes[1]}`;
    case 2: return `top-[5rem] md:top-[7rem] ${zIndexes[2]}`;
    case 3: return `top-[5.5rem] md:top-[7.5rem] ${zIndexes[3]}`;
    default: return `top-[6rem] md:top-[8rem] ${zIndexes[4]}`;
  }
};

export default function KnowGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="w-full bg-[var(--bg-secondary)] pb-16 md:pb-32 pt-16 md:pt-24" id="know-grid-section">
      <div className="flex flex-col w-full max-w-[1400px] mx-auto relative px-4 md:px-8 lg:px-12 space-y-12 md:space-y-24">

        {topics.map((topic, idx) => (
          <div
            key={topic.id}
            className={`craft-panel sticky ${getTopClass(idx)} w-full relative min-h-[450px] md:h-[550px] overflow-hidden`}
          >
            {/* Full Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
              <Image
                src={topic.image}
                alt={topic.title}
                fill
                className="object-cover"
              />
              {/* Gradient Overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            </div>

            {/* Text Overlay */}
            <div className="relative z-10 w-full h-full md:w-[70%] lg:w-[60%] flex flex-col justify-center items-start p-8 md:p-16 lg:p-24 text-white">
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-300 mb-4 block">
                0{idx + 1}
              </span>
              <h2 className="font-serif text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] leading-[1.1] tracking-tight text-white mb-4">
                {topic.title}
              </h2>
              <p className="font-sans max-w-xl text-neutral-300 text-[10px] md:text-xs uppercase tracking-[0.2em] mt-6 leading-relaxed mb-10">
                {topic.description}
              </p>
              <Link
                href={`/know-your-rug/${topic.id}`}
                className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-brand-gold border-b border-transparent hover:border-brand-gold transition-colors duration-300 font-sans w-fit flex"
              >
                EXPLORE {topic.title} &rarr;
              </Link>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
