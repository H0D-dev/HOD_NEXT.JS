"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const services = [
  {
    id: 1,
    title: "Virtual Sales Representative",
    description: "Connect with a dedicated expert for immediate assistance and custom requirements.",
    image: "/curtains/set1-room.png",
  },
  {
    id: 2,
    title: "Budget & Project Management",
    description: "Comprehensive project support ensuring designs meet timelines and budgets.",
    image: "/rugs/set1-room.png",
  },
  {
    id: 3,
    title: "Dedicated Account Manager",
    description: "Your single point of contact for personalized service and seamless communication.",
    image: "/curtains/set3-room.png",
  },
  {
    id: 4,
    title: "After Sales Support",
    description: "Extensive guidance on installation, care, and long-term maintenance.",
    image: "/rugs/set2-room.png",
  },
];

export default function TradeExpertService() {
  return (
    <section className="w-full py-16 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-md)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="text-center mb-20 md:mb-32"
        >
          <span className="block text-[var(--text-muted)] font-sans text-xs uppercase tracking-widest mb-6">
            Our Commitment
          </span>
          <h2 className="font-serif text-[clamp(32px,5vw,64px)] text-[var(--text-primary)] tracking-tight">
            Expert Service & <br className="hidden md:block" /> Trusted Guidance
          </h2>
        </motion.div>

        <div className="flex flex-col gap-24 md:gap-32">
          {services.map((service, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <div
                key={service.id}
                className={`flex flex-col ${
                  isReversed ? "md:flex-row-reverse" : "md:flex-row"
                } items-center gap-12 md:gap-24`}
              >
                {/* Image Side */}
                <motion.div
                  initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
                  className="flex-1 w-full aspect-[4/5] md:aspect-square relative overflow-hidden bg-[var(--bg-secondary)]"
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-[1.5s] hover:scale-105 ease-[cubic-bezier(0.22,1,0.36,1)]"
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
                  <span className="font-sans text-xs text-[var(--text-muted)] tracking-widest mb-4">
                    0{service.id}
                  </span>
                  <h3 className="font-serif text-[clamp(24px,5vw,40px)] text-[var(--text-primary)] mb-6">
                    {service.title}
                  </h3>
                  <p className="font-sans text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-md">
                    {service.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
