"use client";

import { motion } from "framer-motion";
import {
  PenTool,
  Maximize,
  Palette,
  Users,
  Home,
  Scissors,
  Truck,
  Droplets
} from "lucide-react";

export default function ServicesList() {
  const services = [
    { icon: <PenTool strokeWidth={1} size={32} />, title: "Bespoke\nRug Design" },
    { icon: <Maximize strokeWidth={1} size={32} />, title: "Custom Size\n& Shape" },
    { icon: <Palette strokeWidth={1} size={32} />, title: "Material & Color\nConsultation" },
    { icon: <Users strokeWidth={1} size={32} />, title: "Interior Designer\nCollaboration" },
    { icon: <Home strokeWidth={1} size={32} />, title: "Villa & Residential\nProjects" },
    { icon: <Scissors strokeWidth={1} size={32} />, title: "Sampling &\nPrototyping" },
    { icon: <Truck strokeWidth={1} size={32} />, title: "Delivery & Professional\nInstallation" },
    { icon: <Droplets strokeWidth={1} size={32} />, title: "Rug Care & Maintenance\nGuidance" },
  ];

  return (
    <section className="w-full pt-8 md:pt-12 lg:pt-16 pb-4 lg:pb-8 px-5 md:px-10 lg:px-16 bg-[var(--bg-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16">

        {/* Left: Sticky Title */}
        <div className="lg:w-1/3 shrink-0">
          <div className="sticky top-32 flex flex-col">
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6 font-medium">
              Our Services
            </span>
            <h2 className="font-sans font-light text-xl lg:text-2xl text-[var(--text-primary)] mb-6 md:mb-8">
              Tailored to Your Vision.<br className="hidden lg:block" /> Crafted to Perfection.
            </h2>
            <div className="w-12 h-[1px] bg-[var(--border-primary)]"></div>
          </div>
        </div>

        {/* Right: Grid */}
        <div className="lg:w-2/3">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-x-3 md:gap-x-6 gap-y-6 md:gap-y-10">
            {services.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center md:items-start text-center md:text-left gap-3 md:gap-4 group cursor-pointer"
              >
                <div className="text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors duration-300 [&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-8 md:[&>svg]:h-8">
                  {svc.icon}
                </div>
                <h3 className="font-sans text-[8.5px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-primary)] whitespace-pre-line leading-relaxed group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                  {svc.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
