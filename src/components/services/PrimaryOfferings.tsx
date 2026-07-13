"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const offerings = [
  {
    title: "Custom Rugs and Carpets",
    desc: "Handcrafted to your specifications, our rugs and carpets combine exquisite design with unparalleled quality, perfect for enhancing any room.",
    image: "/rugs/set1-room.png"
  },
  {
    title: "Custom Flatweaves",
    desc: "Elevate your interiors with our tailor-made flatweaves, designed to fit your style and space while ensuring durability and elegance.",
    image: "/rugs/rug3.png"
  },
  {
    title: "Unique Wallcoverings",
    desc: "From sophisticated wallpapers to innovative wall art, our wallcoverings add depth and character to your walls.",
    image: "/rugs/set2-room.png"
  },
  {
    title: "Artisanal Handicrafts",
    desc: "We showcase a curated selection of unique handicrafts, connecting you to the rich traditions and skills of artisans from around the globe.",
    image: "/rugs/set3-room.png"
  }
];

export default function PrimaryOfferings() {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {offerings.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
              className="group flex flex-col gap-8"
            >
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-[var(--surface-primary)] border border-[var(--border-secondary)]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="font-sans text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
