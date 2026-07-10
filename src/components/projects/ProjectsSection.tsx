"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useCursorStore } from "@/src/lib/store/useCursorStore";

export type Project = {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
};

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
  },
  {
    id: "proj-4",
    category: "Bespoke",
    title: "The Artisan Studio",
    description: "Exclusive, one-of-a-kind pieces crafted in collaboration with leading interior designers.",
    image: "https://images.unsplash.com/photo-1600607688066-890987f18a86?auto=format&fit=crop&q=80&w=2000"
  }
];

interface ProjectsSectionProps {
  projects?: Project[];
}

export default function ProjectsSection({ projects = DUMMY_PROJECTS }: ProjectsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const x = useMotionValue(0);
  const springX = useSpring(x, { damping: 50, stiffness: 400 });
  const isDraggingRef = useRef(false);
  const setCursorMode = useCursorStore((state) => state.setMode);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      updateConstraints();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateConstraints = () => {
    if (containerRef.current && trackRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const trackWidth = trackRef.current.scrollWidth;
      
      const computedStyle = window.getComputedStyle(containerRef.current);
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;

      const scrollableWidth = Math.max(0, trackWidth - containerWidth + paddingRight + paddingLeft);

      setConstraints({ right: 0, left: -scrollableWidth });
    }
  };

  useEffect(() => {
    const timer = setTimeout(updateConstraints, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!projects || projects.length === 0) return null;

  return (
    <section 
      className="py-20 lg:py-24 bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border-secondary)] overflow-hidden"
      onMouseEnter={() => setCursorMode("default")}
    >
      
      {/* Header */}
      <div className="max-w-[var(--container-lg)] mx-auto px-6 mb-12">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-sans text-xl lg:text-2xl font-medium text-[var(--text-primary)] m-0 flex items-center">
            Projects
            <sup className="font-sans text-[10px] font-medium ml-1 mt-1 text-[var(--text-secondary)]">
              (05)
            </sup>
          </h2>
          
          <Link 
            href="/projects" 
            className="group relative inline-flex items-center gap-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)]"
          >
            <span>Explore All</span>
            <span className="relative w-6 h-[1px] bg-[var(--text-primary)] overflow-hidden">
              <span className="absolute inset-0 bg-[var(--text-primary)] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Gallery Slider */}
      <div 
        className="w-full pl-6 min-[1440px]:pl-[max(1.5rem,calc((100vw-var(--container-lg))/2+1.5rem))]" 
        ref={containerRef}
        onMouseEnter={() => setCursorMode("drag")}
        onMouseLeave={() => setCursorMode("default")}
      >
        {isMobile ? (
          /* Mobile Scroll */
          <div className="flex gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory pr-6 pb-8 hide-scrollbar">
            {projects.map((proj) => (
              <div key={proj.id} className="snap-start flex-none w-[85vw] md:w-[60vw]">
                <ProjectCard project={proj} />
              </div>
            ))}
          </div>
        ) : (
          /* Desktop Drag */
          <motion.div
            ref={trackRef}
            className="flex gap-6 will-change-transform cursor-grab active:cursor-grabbing pr-6 min-[1440px]:pr-[max(1.5rem,calc((100vw-var(--container-lg))/2+1.5rem))]"
            drag="x"
            dragConstraints={constraints}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 60 }}
            style={{ x: springX }}
            onDragStart={() => {
              isDraggingRef.current = true;
            }}
            onDragEnd={() => {
              setTimeout(() => {
                isDraggingRef.current = false;
              }, 150);
            }}
          >
            {projects.map((proj) => (
              <div 
                key={proj.id} 
                className="shrink-0 w-[45vw] max-w-[800px] min-w-[500px]"
                onClickCapture={(e) => {
                  if (isDraggingRef.current) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <ProjectCard 
                  project={proj} 
                  onMouseEnter={() => setCursorMode("view")}
                  onMouseLeave={() => setCursorMode("default")}
                />
              </div>
            ))}
          </motion.div>
        )}
      </div>

    </section>
  );
}

function ProjectCard({ 
  project, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  project: Project;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <Link 
      href={`/projects/${project.id}`} 
      className="group block relative w-full aspect-[4/3] overflow-hidden bg-[var(--bg-secondary)]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      draggable={false}
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        sizes="(max-width: 1024px) 85vw, 45vw"
        draggable={false}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end text-white z-10">
        <span className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase mb-2 opacity-80 pointer-events-none">
          {project.category}
        </span>
        <h3 className="font-sans text-lg lg:text-xl font-medium mb-3 leading-tight pointer-events-none">
          {project.title}
        </h3>
        
        {/* Subtle Underline CTA */}
        <div className="mt-1 w-0 group-hover:w-8 h-[1px] bg-white transition-all duration-500 ease-out pointer-events-none" />
      </div>
    </Link>
  );
}
