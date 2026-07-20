"use client";

import { motion } from "framer-motion";
import { MessageSquare, PenTool, LayoutTemplate, Scissors, Factory, SearchCheck, Truck, Wrench } from "lucide-react";

export default function ServicesProcess() {
  const steps = [
    { num: "01", icon: <MessageSquare strokeWidth={1} size={28} />, title: "Consultation" },
    { num: "02", icon: <PenTool strokeWidth={1} size={28} />, title: "Design\nDevelopment" },
    { num: "03", icon: <LayoutTemplate strokeWidth={1} size={28} />, title: "Material\nSelection" },
    { num: "04", icon: <Scissors strokeWidth={1} size={28} />, title: "Sampling" },
    { num: "05", icon: <Factory strokeWidth={1} size={28} />, title: "Production" },
    { num: "06", icon: <SearchCheck strokeWidth={1} size={28} />, title: "Quality\nInspection" },
    { num: "07", icon: <Truck strokeWidth={1} size={28} />, title: "Delivery" },
    { num: "08", icon: <Wrench strokeWidth={1} size={28} />, title: "Installation" },
  ];

  return (
    <section className="w-full pt-8 md:pt-12 lg:pt-16 pb-4 lg:pb-8 px-5 md:px-10 lg:px-16 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)] overflow-hidden">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left: Sticky Title */}
        <div className="lg:w-1/4 shrink-0">
          <div className="sticky top-32 flex flex-col">
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6 font-medium">
              Our Process
            </span>
            <h2 className="font-sans font-light text-xl lg:text-2xl text-[var(--text-primary)]">
              A Seamless Journey<br className="hidden lg:block" /> From Concept to<br className="hidden lg:block" /> Completion.
            </h2>
          </div>
        </div>

        {/* Right: Timeline Grid */}
        <div className="lg:w-3/4 w-full relative">
          <div className="absolute top-4 left-0 w-full h-[1px] bg-[var(--border-secondary)] hidden lg:block" />
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-x-3 md:gap-x-6 gap-y-6 md:gap-y-4 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center md:items-start text-center md:text-left gap-2 md:gap-4"
              >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-secondary)] flex items-center justify-center font-sans text-[9px] md:text-[10px] font-medium text-[var(--text-secondary)] relative z-20">
                  {step.num}
                </div>
                <div className="text-[var(--accent-primary)] mt-1 md:mt-2 [&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-7 md:[&>svg]:h-7">
                  {step.icon}
                </div>
                <h3 className="font-sans text-[8.5px] md:text-[9px] uppercase tracking-[0.2em] font-medium text-[var(--text-primary)] whitespace-pre-line leading-[1.6]">
                  {step.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
