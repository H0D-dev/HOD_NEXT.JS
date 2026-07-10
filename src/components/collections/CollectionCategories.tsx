"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type CategoryData = {
  title: string;
  image: string;
  slug: string;
};

const dummyCategories: CategoryData[] = [
  {
    title: "Rugs",
    image: "/rugs/set1-room.png",
    slug: "rugs",
  },
  {
    title: "Curtains",
    image: "/curtains/set2-room.png",
    slug: "curtains",
  },
  {
    title: "Accessories",
    image: "https://images.unsplash.com/photo-1574180045827-681f8a1a9622?auto=format&fit=crop&q=80&w=1000",
    slug: "accessories",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function CollectionCategories() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const yMiddle = useTransform(smoothProgress, [0, 1], [150, 0]);
  const ySide = useTransform(smoothProgress, [0, 1], [50, 0]);

  return (
    <section ref={containerRef} className="w-full bg-[var(--bg-primary)] py-20 lg:py-24" id="collections-section">
      <div className="max-w-[var(--container-lg)] mx-auto px-6">
        
        {/* Header */}
        <motion.div
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <h2 className="font-sans text-xl lg:text-2xl font-medium text-[var(--text-primary)] m-0 flex items-center">
              Collections
            </h2>
            <Link 
              href="/products" 
              className="group relative inline-flex items-center gap-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)]"
            >
              <span>View All</span>
              <span className="relative w-6 h-[1px] bg-[var(--text-primary)] overflow-hidden">
                <span className="absolute inset-0 bg-[var(--text-primary)] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12 lg:gap-x-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {dummyCategories.map((category, index) => {
            const isMiddle = index === 1;
            return (
              <motion.div
                key={category.slug}
                variants={cardVariants}
                style={{ y: isMiddle ? yMiddle : ySide }}
                className="group flex flex-col"
              >
                <Link href={`/products/${category.slug}`} className="block overflow-hidden relative aspect-[2/3] max-h-[75vh] bg-[var(--bg-secondary)] mb-4">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
                
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-sans text-sm font-medium text-[var(--text-primary)]">
                    {category.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
