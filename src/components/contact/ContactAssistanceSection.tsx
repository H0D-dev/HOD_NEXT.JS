"use client";

import { motion } from "framer-motion";
import { Aperture, Armchair, Building2, Ship, Mail } from "lucide-react";

const assistanceItems = [
  {
    id: 1,
    title: "Bespoke Rug Enquiry",
    icon: Aperture,
  },
  {
    id: 2,
    title: "Interior Design",
    icon: Armchair,
  },
  {
    id: 3,
    title: "Hospitality /\nCommercial Projects",
    icon: Building2,
  },
  {
    id: 4,
    title: "General\nInquiry",
    icon: Mail,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
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

import { useRouter } from "next/navigation";

export default function ContactAssistanceSection() {
  const router = useRouter();

  const handleCardClick = (title: string) => {
    const formattedTitle = title.replace(/\n/g, ' ');
    router.push(`?subject=${encodeURIComponent(formattedTitle)}#studio-request`, { scroll: true });
  };

  return (
    <section className="w-full bg-[var(--bg-primary)] pt-4 md:pt-6 lg:pt-8 pb-4 md:pb-6 lg:pb-8">
      <div className="max-w-[var(--container-lg)] mx-auto px-4 md:px-12 lg:px-16">
        
        <div className="text-center mb-6 md:mb-8">
          <h2 className="font-sans font-light text-xl lg:text-2xl text-[var(--text-primary)]">
            How Can We Assist You?
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {assistanceItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                onClick={() => handleCardClick(item.title)}
                className="flex flex-col items-center justify-center text-center p-4 md:p-5 lg:p-6 bg-[var(--surface-primary)] hover:shadow-md transition-all duration-300 group cursor-pointer"
              >
                <div className="text-[var(--accent-primary)] mb-3 transition-transform duration-500 group-hover:scale-110">
                  <Icon size={36} strokeWidth={1} />
                </div>
                <h3 className="font-sans text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)] whitespace-pre-line leading-relaxed group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                  {item.title}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
