"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import "./CollectionCategories.css";

type CategoryData = {
  title: string;
  badge?: string;
  description: string;
  image: string;
  slug: string;
};

const dummyCategories: CategoryData[] = [
  {
    title: "Premium Artisan Rugs",
    description:
      "Hand-knotted, hand-tufted, and bespoke rugs crafted with timeless artistry.",
    image: "/carpets/set1-room.png",
    slug: "artisan-rugs",
  },
  {
    title: "Premium Luxury Curtains",
    description:
      "Elegant curtains and window treatments tailored for modern luxury interiors.",
    image: "/carpets/set2-room.png",
    slug: "luxury-curtains",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export default function CollectionCategories() {
  return (
    <section className="collections" id="collections-section">
      <div className="collections__container">
        <motion.div
          className="collections__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any },
            },
          }}
        >
          <div className="flex justify-between items-end">
            <h2 className="collections__heading font-sans relative inline-flex">
              Collections
              <sup className="text-2xl md:text-4xl font-light ml-2 md:ml-4 mt-2 md:mt-6 tracking-normal text-[var(--text-secondary)]">(02)</sup>
            </h2>
          </div>
        </motion.div>

        <motion.div
          className="collections__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {dummyCategories.map((category) => (
            <motion.div
              className="collections__card"
              key={category.slug}
              variants={cardVariants}
            >
              <div className="collections__card-image-wrapper">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="collections__card-image"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="collections__card-content">
                <div className="collections__card-text">
                  <h3 className="collections__card-title font-serif">
                    {category.title}
                  </h3>
                </div>
                <a
                  href={`/collections/${category.slug}`}
                  className="collections__card-cta font-sans"
                >
                  Explore Collection &rarr;
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
