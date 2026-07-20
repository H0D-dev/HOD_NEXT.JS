"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import ProjectsHero from "@/src/components/projects-page/ProjectsHero";
import ProjectsFeatured from "@/src/components/projects-page/ProjectsFeatured";
import ProjectsBanner from "@/src/components/projects-page/ProjectsBanner";
import ProjectsCategories from "@/src/components/projects-page/ProjectsCategories";
import ProjectsProcess from "@/src/components/projects-page/ProjectsProcess";
import ProjectsStats from "@/src/components/projects-page/ProjectsStats";
import ProjectsTestimonials from "@/src/components/projects-page/ProjectsTestimonials";
import ContactGlobalPresence from "@/src/components/contact/ContactGlobalPresence";

export default function ProjectsPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <ProjectsHero />
      <ProjectsFeatured />
      <ProjectsBanner />
      <ProjectsCategories />
      <ProjectsProcess />
      <ProjectsStats />
      <ProjectsTestimonials />
      {/* Reusing the beautiful contact banner at the bottom before the footer */}
      <div className="w-full bg-[var(--bg-secondary)] py-12 lg:py-16 flex flex-col items-center text-center px-5">
        <h2 className="font-sans font-light text-2xl md:text-3xl lg:text-4xl text-[var(--text-primary)] mb-4">
          Start Your <span className="italic text-[var(--text-secondary)]">Project</span>
        </h2>
        <p className="text-xs md:text-sm font-light text-[var(--text-secondary)] max-w-md mb-6">
          Whether you're designing a private residence, luxury hotel or commercial development, our team will help bring your vision to life.
        </p>
        <div className="flex gap-4">
          <a href="/contact" className="px-8 py-4 bg-[var(--accent-primary)] text-white text-[10px] font-semibold uppercase tracking-[0.15em] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors duration-500">
            Request Consultation
          </a>
        </div>
      </div>
    </main>
  );
}
