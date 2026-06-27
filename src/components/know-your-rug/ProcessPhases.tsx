"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const phases = [
  {
    id: "sourcing",
    title: "Sourcing Raw Materials",
    subtitle: "The Foundation of Handcrafting",
    image: "/rugs/set1-texture.png",
    content: [
      {
        heading: "True craftsmanship begins with the finest raw materials, each of which is carefully selected to uphold the artistry of the final product.",
        body: ""
      },
      {
        heading: "Wool",
        body: "We source Chokla wool, regarded as the finest Indian wool for rugs, from biannual auctions in Bikaner. This wool, sheared from sheep in the spring and fall, arrives in mixed textures and qualities, which are then meticulously hand-sorted by local artisans with irreplaceable expertise."
      },
      {
        heading: "Merino Wool",
        body: "Imported from New Zealand, Merino wool is used in our premium 14/14 quality carpets and is also blended with other wools to create yarns of exceptional softness, durability, and sheen. We source wool from 18 different countries to create custom blends that unite lustre, texture, and resilience."
      },
      {
        heading: "Silk",
        body: "For the finest quality silk, we look to both domestic traders and international sources, importing the best silk from China to complement our creations."
      }
    ]
  },
  {
    id: "carding-spinning",
    title: "Carding & Spinning",
    subtitle: "A Heritage of Craft",
    image: "/rugs/set2-texture.png",
    content: [
      {
        heading: "",
        body: "Once the wool is hand-selected, sorted, and washed, it is passed to one of India’s rarest artisans: the Katwari, or spinner."
      },
      {
        heading: "",
        body: "The Katwari begins with the process of carding, where wool is combed on bristled pads to remove dirt, knots, and clumps, ensuring uniformity and consistency. This labor-intensive process is followed by spinning the wool into yarn on a traditional charka (spinning wheel). The spinning process, steeped in India's heritage, transforms wool fibers into durable yarn with a textured pattern of thick and thin strands—much like the fabric of Indian history itself."
      },
      {
        heading: "",
        body: "Today, more than 3,000 of these skilled artisans have found a home with us, preserving and advancing this ancient craft."
      }
    ]
  },
  {
    id: "dyeing",
    title: "Dyeing",
    subtitle: "Art in Color",
    image: "/rugs/set3-texture.png",
    content: [
      {
        heading: "",
        body: "Dyeing is an art form that allows artisans to add vibrant decorative effects to the yarn. Before dyeing, the wool is segregated by color and texture. Lighter wools are reserved for paler dyes, while darker wools absorb richer hues. Blends of different wool types help to create yarns with the perfect balance of softness and resilience."
      },
      {
        heading: "",
        body: "We use eco-friendly, GOTS-certified dyes from trusted sources like Colourtex and Huntsman, which ensure that the colors do not bleed or damage the yarn. Our custom recipes allow us to offer over 3,000 colors, with the ability to tailor hues to each project’s specific needs."
      },
      {
        heading: "",
        body: "Once the yarn is prepared, artisans wind it onto frames and immerse it in boiling vats of dye. After soaking, the yarn is hung in the sun to dry before being stored for use. Each batch of yarn carries subtle color variations, a hallmark of handcrafted rugs known as Abrash or Antique, where these natural shifts give each rug a distinctive character that only time and traditional methods can achieve."
      }
    ]
  },
  {
    id: "weaving",
    title: "Weaving",
    subtitle: "The Craft of Precision",
    image: "/rugs/set1-room.png",
    content: [
      {
        heading: "",
        body: "Weaving is the heart of rug-making, where skilled artisans meticulously transform yarn into intricate patterns and textures. Each rug’s character is defined by the weaving technique used, which directly impacts its design, quality, durability, and value."
      },
      {
        heading: "",
        body: "Different weaving methods create distinct styles of rugs, from tightly woven, durable pieces to more textured, artistic designs. The precision and expertise of the weavers bring each design to life, knot by knot, row by row. Their hands work with remarkable accuracy, following centuries-old techniques that have been passed down through generations."
      },
      {
        heading: "",
        body: "The choice of weaving technique is not only a reflection of artistic vision but also a measure of the rug’s longevity. Hand-knotted rugs, for example, are known for their exceptional durability, while hand-tufted and flat-woven rugs offer unique aesthetic qualities. The density of knots and the type of weave define the texture and intricacy of the design, ensuring that each rug is a masterpiece of both form and function."
      },
      {
        heading: "",
        body: "At the core of the weaving process is a deep respect for tradition, combined with a passion for innovation. Whether creating a classic pattern or an entirely new design, the weaver’s skill is what ultimately transforms raw materials into a piece of art that will endure for generations."
      }
    ]
  }
];

export default function ProcessPhases() {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col gap-24 md:gap-40">
        {phases.map((phase, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <div
              key={phase.id}
              className={`flex flex-col ${
                isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
              } gap-12 lg:gap-24 lg:items-start`}
            >
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
                className="flex-1 w-full relative overflow-hidden bg-[var(--surface-primary)] border border-[var(--border-secondary)] min-h-[400px] sticky top-32 lg:h-[600px] xl:h-[700px]"
              >
                <Image
                  src={phase.image}
                  alt={phase.title}
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Text Side */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
                className="flex-1 w-full flex flex-col justify-center"
              >
                <span className="font-sans text-xs text-[var(--text-muted)] tracking-widest mb-6 uppercase">
                  Phase 0{index + 1}
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-[var(--text-primary)] mb-4">
                  {phase.title}
                </h2>
                <h3 className="font-sans text-lg text-[var(--text-secondary)] italic mb-10">
                  {phase.subtitle}
                </h3>
                
                <div className="flex flex-col gap-8">
                  {phase.content.map((block, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      {block.heading && (
                        <h4 className="font-sans font-medium text-[var(--text-primary)] text-lg">
                          {block.heading}
                        </h4>
                      )}
                      {block.body && (
                        <p className="font-sans text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                          {block.body}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
