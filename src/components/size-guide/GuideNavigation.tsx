"use client";

import React, { useEffect, useState } from "react";

const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Living Room", href: "#living-room" },
  { label: "Bedroom", href: "#bedroom" },
  { label: "Dining Room", href: "#dining-room" },
  { label: "Curtains", href: "#curtains" },
];

export default function GuideNavigation() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      for (const link of navLinks) {
        const section = document.getElementById(link.href.substring(1));
        if (section) {
          const sectionTop = section.offsetTop;
          if (window.scrollY >= sectionTop - 120) {
            current = link.href;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.getElementById(href.substring(1));
    if (target) {
      // Offset for the sticky header
      const top = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-primary)] transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 overflow-x-auto hide-scrollbar">
        <ul className="flex items-center md:justify-center gap-2 md:gap-8 min-w-max">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={`font-sans text-xs md:text-sm tracking-widest uppercase px-4 py-2 border rounded-[var(--radius-sm,0px)] transition-colors duration-300 ${
                  activeSection === link.href
                    ? "border-[var(--border-primary)] bg-[var(--border-primary)] text-[var(--bg-primary)]"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
