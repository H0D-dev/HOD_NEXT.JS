"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PenTool, Users, Globe, Shield, Gem } from "lucide-react";

export default function ContactGlobalPresence() {
  const locations = [
    {
      city: "DUBAI STUDIO",
      country: "UAE",
      img: "/dubai_sketch.png",
      delay: 0
    },
    {
      city: "JAIPUR ATELIER",
      country: "INDIA",
      img: "/jaipur_sketch.png",
      delay: 0.2
    },
    {
      city: "INTERNATIONAL PROJECTS",
      country: "WORLDWIDE",
      img: "/world_map_sketch.png",
      delay: 0.4
    }
  ];

  const benefits = [
    { icon: <PenTool size={24} strokeWidth={1.5} />, text: "BESPOKE DESIGN ONLY" },
    { icon: <Users size={24} strokeWidth={1.5} />, text: "ARCHITECT & DESIGNER COLLABORATION" },
    { icon: <Globe size={24} strokeWidth={1.5} />, text: "WORLDWIDE INSTALLATION" },
    { icon: <Shield size={24} strokeWidth={1.5} />, text: "CONFIDENTIAL LUXURY PROJECTS" },
    { icon: <Gem size={24} strokeWidth={1.5} />, text: "HANDCRAFTED IN INDIA" }
  ];

  return (
    <section className="w-full pt-10 pb-8 md:pt-16 md:pb-12 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-16">
        
        {/* Title */}
        <div className="text-center mb-10">
          <h3 className="font-sans text-xs md:text-sm uppercase tracking-widest text-[var(--text-primary)] font-semibold relative inline-block">
            Our Global Presence
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-[1px] bg-[var(--accent-primary)]"></span>
          </h3>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 mb-12">
          {locations.map((loc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: loc.delay }}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="mb-4 text-[var(--text-primary)]">
                <h4 className="font-sans text-xs lg:text-sm uppercase tracking-widest font-semibold">{loc.city}</h4>
                <p className="font-sans text-[10px] lg:text-xs uppercase tracking-widest text-[var(--text-secondary)] mt-1">{loc.country}</p>
              </div>
              <div className="w-full relative h-48 md:h-56 lg:h-64 rounded border border-[var(--border-secondary)] overflow-hidden transition-all duration-500 group-hover:border-[var(--accent-primary)] shadow-sm">
                <Image 
                  src={loc.img} 
                  alt={loc.city} 
                  fill 
                  className="object-cover opacity-80 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Icon Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 text-center">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex flex-col items-center gap-3 text-[var(--text-primary)]"
            >
              <div className="text-[var(--accent-primary)]">
                {benefit.icon}
              </div>
              <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-widest font-semibold max-w-[120px] mx-auto leading-relaxed">
                {benefit.text}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
