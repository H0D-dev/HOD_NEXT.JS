"use client";

import { motion } from "framer-motion";
import { AlertCircle, Lightbulb, MonitorSmartphone } from "lucide-react";

export default function GuideContent() {
  return (
    <section className="w-full pt-16 lg:pt-24 pb-16 lg:pb-24 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)] border-b border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col gap-16 lg:gap-24">
        
        {/* Hand-made vs Machine-made & Regal History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
            className="flex flex-col gap-6"
          >
            <h3 className="font-sans text-xl lg:text-2xl font-light text-[var(--text-primary)] mb-4">
              Hand-Made vs. Machine-Made Rugs
            </h3>
            <p className="font-sans text-[var(--text-secondary)] text-base md:text-lg font-light leading-relaxed">
              Ever wonder why handmade rugs are more expensive than machine-made ones? Handmade rugs are unique works of art, with their value increasing over time. Natural fibers and dyes contribute to slight variations in color, and each rug tells a story of craftsmanship and culture.
            </p>
            <p className="font-sans text-[var(--text-secondary)] text-base md:text-lg font-light leading-relaxed">
              Machine-made rugs, produced in mass, lack this uniqueness and personal touch, offering consistency but without the care and emotion poured into handmade creations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
            className="flex flex-col gap-6"
          >
            <h3 className="font-sans text-xl lg:text-2xl font-light text-[var(--text-primary)] mb-4">
              The Regal Hand-Knotted Rugs
            </h3>
            <p className="font-sans text-[var(--text-secondary)] text-base md:text-lg font-light leading-relaxed">
              The tradition of luxury hand-knotted rugs in India dates back to the Mughal era. Emperor Akbar established the carpet-weaving tradition in 1580 AD, blending Persian influences with Indian artistry. Mughal rugs, renowned for their detailed court scenes, animal motifs, and floral designs, evolved over time into uniquely Indian masterpieces.
            </p>
            <p className="font-sans text-[var(--text-secondary)] text-base md:text-lg font-light leading-relaxed">
              These hand-knotted rugs were woven for royal palaces and also gifted abroad, continuing a legacy of luxury. Today, this centuries-old tradition is still alive, where each knot is meticulously tied by hand, creating rugs that are both functional and works of art.
            </p>
          </motion.div>
        </div>

        {/* Lighting & Screen Considerations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            className="bg-[var(--surface-primary)] p-6 lg:p-8 border-t-2 border-[var(--text-primary)] flex flex-col gap-6"
          >
            <Lightbulb size={32} className="text-[var(--text-muted)]" strokeWidth={1} />
            <h4 className="font-sans text-xl font-light text-[var(--text-primary)]">Lighting Conditions</h4>
            <p className="font-sans text-[var(--text-secondary)] text-base md:text-lg font-light leading-relaxed">
              Rug fibers reflect light differently. A rug may appear lighter or darker in photos compared to real life. Similarly, the lighting in the room can affect how the rug’s colors look once placed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
            className="bg-[var(--surface-primary)] p-6 lg:p-8 border-t-2 border-[var(--text-primary)] flex flex-col gap-6"
          >
            <MonitorSmartphone size={32} className="text-[var(--text-muted)]" strokeWidth={1} />
            <h4 className="font-sans text-xl font-light text-[var(--text-primary)]">On-Screen vs. Real Life</h4>
            <p className="font-sans text-[var(--text-secondary)] text-base md:text-lg font-light leading-relaxed">
              Colors can vary between screens, print images, and actual rugs. For accurate color representation, it's best to view rug samples before making a final decision.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
