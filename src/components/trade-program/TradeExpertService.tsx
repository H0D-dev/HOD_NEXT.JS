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
    <section className="w-full py-8 md:py-12 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="font-sans text-xl lg:text-2xl font-light text-[var(--text-primary)] tracking-tight">
            Expert Services
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {services.map((service, index) => {
            return (
              <div
                key={service.id}
                className="flex flex-col gap-6 group"
              >
                {/* Image Side */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
                  className="w-full aspect-[16/9] relative overflow-hidden bg-[var(--bg-secondary)]"
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-105 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                </motion.div>

                {/* Text Side */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: [0.22, 1, 0.36, 1] as any }}
                  className="w-full flex flex-col"
                >
                  <span className="font-sans text-xs text-[var(--text-muted)] tracking-widest mb-3">
                    0{service.id}
                  </span>
                  <h3 className="font-sans text-xl lg:text-2xl font-light text-[var(--text-primary)] mb-2">
                    {service.title}
                  </h3>
                  <p className="font-sans text-sm md:text-base font-light text-[var(--text-secondary)] leading-relaxed max-w-md">
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
