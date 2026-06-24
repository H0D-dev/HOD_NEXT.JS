"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export type Project = {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
};

// Dummy JSON data matching the user's requirement
const DUMMY_PROJECTS: Project[] = [
  {
    id: "proj-1",
    category: "Residential",
    title: "Living Spaces That Breathe",
    description: "Custom rugs, carpets, and curtains tailored to elevate modern and timeless homes.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000"
  },
  {
    id: "proj-2",
    category: "Hospitality",
    title: "Memorable Guest Experiences",
    description: "Luxury textile solutions crafted for boutique hotels and premium hospitality spaces.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2000"
  },
  {
    id: "proj-3",
    category: "Commercial",
    title: "Elevate Your Brand Space",
    description: "Premium interior solutions designed for retail, offices, and commercial environments.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
  }
];

interface ProjectsSectionProps {
  projects?: Project[];
}

export default function ProjectsSection({ projects = DUMMY_PROJECTS }: ProjectsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  // Motion variants for smooth transitions
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-24 bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto px-6">
        
        {/* TOP ROW */}
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 border-b border-[var(--border-secondary)] pb-8 gap-6">
          <h2 className="font-serif text-4xl md:text-6xl tracking-wide leading-none">Projects</h2>
          <button className="text-sm font-medium hover:text-[var(--text-muted)] transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
            Explore All <span>&rarr;</span>
          </button>
        </div>

        {/* MAIN AREA - Split Layout */}
        <div className="flex flex-col lg:flex-row min-h-[500px] border border-[var(--border-secondary)]">
          
          {/* LEFT SIDE: Content */}
          <div className="w-full lg:w-1/3 p-8 lg:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[var(--border-secondary)] relative overflow-hidden bg-[var(--bg-secondary)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col h-full justify-center"
              >
                <span className="uppercase text-xs tracking-[0.2em] text-[var(--text-muted)] mb-6 block font-sans">
                  {activeProject.category}
                </span>
                
                <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-[1.1]">
                  {activeProject.title}
                </h3>
                
                <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-12 font-sans font-light max-w-md">
                  {activeProject.description}
                </p>
                
                <div className="mt-auto pt-8">
                  <button className="px-10 py-5 border border-[var(--border-primary)] bg-transparent text-[var(--text-primary)] uppercase text-xs tracking-[0.2em] font-medium hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-500 w-max">
                    View Project
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT SIDE: Image */}
          <div className="w-full lg:w-2/3 relative h-[500px] lg:h-auto overflow-hidden bg-[var(--bg-tertiary)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0"
              >
                <Image
                  src={activeProject.image}
                  alt={activeProject.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>

        {/* BOTTOM: Tabs */}
        <div className="flex flex-wrap border-x border-b border-[var(--border-secondary)]">
          {projects.map((proj, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={proj.id}
                onClick={() => setActiveIndex(idx)}
                className={`flex-1 min-w-[120px] py-5 text-center text-xs tracking-[0.15em] uppercase font-medium transition-all duration-500 border-r last:border-r-0 border-[var(--border-secondary)] 
                  ${isActive 
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' 
                    : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                  }`}
              >
                {proj.category}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
