"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const finishingSteps = [
  { step: 1, title: "Measurement", desc: "Due to natural variations in hand-knotting, carpets often differ slightly. Each rug is measured to ensure these variations stay within standard sizing limits for a precise fit." },
  { step: 2, title: "Knot Counting", desc: "Every knot is counted by hand. If any knot is missing, it is identified and surgically repaired to restore the intended pattern." },
  { step: 3, title: "Pile Height Checking", desc: "Ensures yarn isn’t wasted and that the pile height meets quality standards. Supervisors work with weavers to adjust their technique if needed." },
  { step: 4, title: "Raffu – Repairing", desc: "Master artisans, the 'doctors of rugs', use large needles to seamlessly fix discrepancies. Repairs leave no trace, restoring perfection." },
  { step: 5, title: "Thukai – Knot Beating", desc: "Craftsmen use iron nails and hammers to gently beat the knots into alignment, straightening the design with precision and care." },
  { step: 6, title: "Kachi Kainchi – First Shear", desc: "The first round of shearing levels the pile height across the entire carpet using a shearing machine to even it out." },
  { step: 7, title: "Sua Birai – Design Correction", desc: "Craftsmen use skewers to untangle and straighten intermingled yarn, restoring the clarity and sharpness of the pattern." },
  { step: 8, title: "Back-burning", desc: "Exposing the underside to a flame singes loose strands and tightens the knots, enhancing durability by causing the yarn to shrink." },
  { step: 9, title: "Back-burn Cleaning", desc: "After back-burning, the singed particles are brushed off, leaving the back of the rug clean and pristine." },
  { step: 10, title: "Dipping", desc: "The rug is submerged in a cleansing wash to remove impurities embedded in the fibers, flushing out all unwanted particles." },
  { step: 11, title: "Washing", desc: "An art form in itself. Laid flat, bathed in water and a mild solution, craftsmen use paddle-like tools to methodically wash and groom it." },
  { step: 12, title: "Khinchai – Stretching", desc: "After washing, the rug shrinks slightly. It is stretched on an iron frame to restore dimensions and ensure knots remain tight." },
  { step: 13, title: "Cutting", desc: "Temporary warp and weft bindings are cut off to allow for more intricate and durable edge finishing." },
  { step: 14, title: "Binding", desc: "Edges are bound to ensure durability and aesthetic appeal. Traditional rugs often feature tassels, while modern designs are fully bound." },
  { step: 15, title: "Pucci Kainchi – Final Shearing", desc: "The desired pile height is precisely set. This measured height determines the rug’s category before it is ready for sale." },
  { step: 16, title: "Kalam Birai – Detailing", desc: "Artisans meticulously refine the design with needles, separating each knot. 'Correcting by pen' gives the rug its final, perfected look." },
  { step: 17, title: "Chinte Nikalna – Snipping", desc: "Artisans comb through the rug to find and snip any visible cotton threads, ensuring a flawless finish requiring great attention to detail." },
  { step: 18, title: "Carving & Embossing", desc: "Khadi Gultarash (Carving) creates sharp cuts. Put Gultarash (Embossing) cuts at an angle for a three-dimensional high-low texture." }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export default function ProcessFinishing() {
  const [showAllMobile, setShowAllMobile] = useState(false);

  return (
    <section className="w-full py-16 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="block text-[var(--accent-primary)] font-sans text-xs uppercase tracking-widest mb-6 font-medium">
            Meticulous Detailing
          </span>
          <h2 className="font-serif text-[clamp(32px,5vw,64px)] text-[var(--text-primary)] tracking-tight mb-8">
            The 18 Steps of Finishing
          </h2>
          <div className="flex flex-col gap-6 text-center max-w-2xl mx-auto">
            <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed font-light">
              Completing a hand-crafted carpet involves 18 meticulous finishing steps, perfecting the rug to a gleaming finish over the course of a month.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {finishingSteps.map((step, idx) => (
            <motion.div
              key={step.step}
              variants={itemVariants}
              className={`bg-[var(--surface-primary)] p-6 md:p-8 border border-[var(--border-secondary)] flex flex-col group hover:border-[var(--border-primary)] transition-colors duration-[0.6s] ${!showAllMobile && idx >= 3 ? 'hidden md:flex' : 'flex'}`}
            >
              <span className="font-serif text-5xl text-[var(--border-primary)] group-hover:text-[var(--text-primary)] transition-colors duration-[0.6s] mb-6 opacity-30 group-hover:opacity-100">
                {step.step.toString().padStart(2, '0')}
              </span>
              <h3 className="font-sans font-medium text-lg text-[var(--text-primary)] mb-4">
                {step.title}
              </h3>
              <p className="font-sans text-sm text-[var(--text-secondary)] leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {!showAllMobile && (
          <div className="mt-12 flex justify-center md:hidden">
            <button
              onClick={() => setShowAllMobile(true)}
              className="px-8 py-4 border border-[var(--border-primary)] text-[var(--text-primary)] font-sans text-sm tracking-widest uppercase hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors duration-300"
            >
              View All 18 Steps
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
