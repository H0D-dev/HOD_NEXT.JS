"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";

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
    description: "Custom rugs, drapes, and curtains tailored to elevate modern and timeless homes.",
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
  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } }
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any } },
    exit: { opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } }
  };

  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-24 bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto px-6">
        
        {/* TOP ROW */}
        <div className="flex flex-col md:flex-row justify-between md:items-end pt-[80px] lg:pt-[120px] mb-[100px] lg:mb-[180px] gap-8 text-left">
          <h2 className="font-sans text-[clamp(64px,14vw,180px)] font-normal tracking-[-0.04em] leading-[0.9] text-[var(--text-primary)] relative inline-flex m-0">
            Projects
            <sup className="text-2xl md:text-4xl font-light ml-2 md:ml-4 mt-2 md:mt-6 tracking-normal text-[var(--text-secondary)]">(05)</sup>
          </h2>
          <button className="text-sm font-medium hover:text-[var(--text-muted)] transition-colors uppercase tracking-[0.2em] flex items-center gap-2 pb-2 md:pb-6">
            Explore All <span>&rarr;</span>
          </button>
        </div>

        {/* MOBILE VIEW - Swipeable Cards (Hidden on Desktop) */}
        <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 w-[calc(100%+3rem)] -ml-6 px-6" style={{ scrollbarWidth: 'none' }}>
          {projects.map((proj) => (
            <div key={proj.id} className="min-w-[88vw] snap-center flex flex-col border border-[var(--border-secondary)] bg-[var(--bg-secondary)] pb-8">
              
              {/* Large Project Image */}
              <div className="relative w-full h-[280px] mb-8">
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw"
                />
              </div>

              {/* Category Label */}
              <span className="px-6 uppercase text-[11px] tracking-[0.2em] text-[var(--text-muted)] mb-3 block font-sans">
                {proj.category}
              </span>

              {/* Project Title with better wrapping */}
              <h3 className="px-6 font-serif text-3xl mb-5 leading-tight pr-4">
                {proj.title}
              </h3>

              {/* Description */}
              <p className="px-6 text-[var(--text-secondary)] text-base leading-relaxed mb-10 font-sans font-light">
                {proj.description}
              </p>

              {/* View Project Button */}
              <div className="px-6 mt-auto">
                <button className="py-2 border-b border-[var(--text-primary)] bg-transparent text-[var(--text-primary)] uppercase text-[11px] tracking-[0.2em] font-medium w-max">
                  View Project
                </button>
              </div>
              
            </div>
          ))}
        </div>

        {/* MAIN AREA - Split Layout (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col lg:flex-row h-auto lg:h-[580px] border border-[var(--border-secondary)]">
          
          {/* LEFT SIDE: Content */}
          <div className="w-full lg:w-1/3 p-8 lg:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[var(--border-secondary)] relative overflow-hidden bg-[var(--bg-secondary)] min-h-[400px] lg:min-h-0 lg:h-full">
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
                  <button className="px-10 py-5 border border-[var(--border-primary)] bg-transparent text-[var(--text-primary)] uppercase text-xs tracking-[0.2em] font-medium hover:bg-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all duration-500 w-max">
                    View Project
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT SIDE: Image */}
          <div className="w-full lg:w-2/3 relative h-[400px] lg:h-full overflow-hidden bg-[var(--bg-tertiary)]">
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

        {/* BOTTOM: Tabs (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col md:flex-row border-x border-b border-[var(--border-secondary)]">
          {projects.map((proj, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={proj.id}
                onClick={() => setActiveIndex(idx)}
                className={`w-full md:flex-1 py-4 md:py-5 text-center text-xs tracking-[0.15em] uppercase font-medium transition-all duration-500 border-b md:border-b-0 md:border-r last:border-0 border-[var(--border-secondary)] 
                  ${isActive 
                    ? 'bg-[var(--accent-primary)] text-[var(--text-primary)]' 
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
