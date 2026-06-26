"use client";

import { motion } from "framer-motion";
import { MapPin, Factory, Mail, Phone } from "lucide-react";

const infoCards = [
  {
    id: 1,
    title: "Registered Office",
    value: "Sharjah, UAE",
    icon: MapPin,
    action: null,
  },
  {
    id: 2,
    title: "Factory",
    value: "India",
    icon: Factory,
    action: null,
  },
  {
    id: 3,
    title: "Email",
    value: "connect@houseofdecor.ae",
    icon: Mail,
    action: "mailto:connect@houseofdecor.ae",
  },
  {
    id: 4,
    title: "Mobile / WhatsApp",
    value: "+971 52 123 6888",
    icon: Phone,
    action: "tel:+971521236888",
    extraCTA: "Chat Now →",
    extraAction: "https://wa.me/971521236888",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ContactInfoSection() {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {infoCards.map((card) => {
            const Icon = card.icon;
            const CardContent = (
              <div className="h-full flex flex-col p-6 md:p-8 bg-[var(--surface-primary)] border border-[var(--border-secondary)] transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-[var(--border-primary)] group">
                <div className="mb-8 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors duration-[0.6s]">
                  <Icon size={32} strokeWidth={1} />
                </div>
                <div className="mt-auto">
                  <h3 className="font-sans text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3">
                    {card.title}
                  </h3>
                  <p className="font-sans text-lg md:text-xl font-medium text-[var(--text-primary)] break-words">
                    {card.value}
                  </p>
                  {card.extraCTA && (
                    <a
                      href={card.extraAction}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 font-sans text-sm font-medium text-[var(--text-primary)] hover:text-[var(--text-muted)] transition-colors duration-300"
                    >
                      {card.extraCTA}
                    </a>
                  )}
                </div>
              </div>
            );

            return (
              <motion.div key={card.id} variants={cardVariants} className="h-full">
                {card.action ? (
                  <a href={card.action} className="block h-full cursor-pointer">
                    {CardContent}
                  </a>
                ) : (
                  CardContent
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
