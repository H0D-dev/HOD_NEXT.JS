"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, Users, Globe, Shield, Gem } from "lucide-react";

export default function ContactGlobalPresence() {
  const [activeIndex, setActiveIndex] = useState(0);

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
    { icon: <Globe size={24} strokeWidth={1.5} />, text: "DELIVERY WORLDWIDE" },
    { icon: <Shield size={24} strokeWidth={1.5} />, text: "CONFIDENTIAL LUXURY PROJECTS" },
    { icon: <Gem size={24} strokeWidth={1.5} />, text: "HANDCRAFTED IN INDIA" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % locations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [locations.length]);

  return (
    <section className="w-full py-8 md:py-12 lg:py-16 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-16">
        
        {/* Title */}
        <div className="text-center mb-10">
          <h3 className="font-sans font-light text-xl lg:text-2xl text-[var(--text-primary)] relative inline-block">
            Our Global Presence
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-[1px] bg-[var(--accent-primary)]"></span>
          </h3>
        </div>

        {/* Locations Grid - Mobile Carousel */}
        <div className="block md:hidden mb-12">
          <div className="w-full flex flex-col items-center text-center cursor-pointer">
            
            {/* Cross-fading Text */}
            <div className="mb-4 text-[var(--text-primary)] relative h-10 w-full flex justify-center items-center">
              {locations.map((loc, idx) => (
                <div 
                  key={idx} 
                  className={`absolute w-full flex flex-col items-center transition-opacity duration-500 ${activeIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <h4 className="font-sans text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em]">{loc.city}</h4>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mt-1 font-semibold">{loc.country}</p>
                </div>
              ))}
            </div>

            {/* Cross-fading Images */}
            <div className="w-full relative h-64 rounded border border-[var(--border-secondary)] overflow-hidden shadow-sm bg-[var(--bg-primary)]">
              {locations.map((loc, idx) => (
                <div 
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <Image 
                    src={loc.img} 
                    alt={loc.city} 
                    fill 
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-80 mix-blend-multiply"
                  />
                </div>
              ))}
            </div>

          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center gap-3 mt-6 items-center h-4">
            {locations.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-2 h-2 bg-[var(--accent-primary)]' : 'w-2 h-2 border border-[var(--text-muted)] bg-transparent hover:border-[var(--accent-primary)]'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Locations Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-4 lg:gap-8 mb-12">
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
                <h4 className="font-sans text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em]">{loc.city}</h4>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mt-1 font-semibold">{loc.country}</p>
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
              <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-widest font-semibold lg:max-w-none max-w-[140px] mx-auto leading-relaxed">
                {benefit.text}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
