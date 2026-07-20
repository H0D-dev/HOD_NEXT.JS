"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterCategory } from "../../lib/catalogConfig";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterCategory[];
  selectedFilters: Record<string, string[]>;
  toggleFilter: (categoryId: string, value: string) => void;
  clearAll: () => void;
}

export default function FilterDrawer({ isOpen, onClose, filters, selectedFilters, toggleFilter, clearAll }: FilterDrawerProps) {
  // Simple state to manage expanded accordion sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setExpandedSections(
      filters.reduce((acc, f, index) => ({ ...acc, [f.id]: index === 0 }), {})
    );
  }, [filters]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
            className="fixed inset-0 bg-black/40 z-[1050] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            className="fixed top-0 left-0 h-full w-full max-w-[420px] bg-[var(--bg-primary)] z-[1060] flex flex-col border-r border-[var(--border-secondary)] shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center p-6 lg:p-8 border-b border-[var(--border-secondary)]">
              <h2 className="font-sans text-[11px] md:text-xs font-medium text-[var(--text-primary)] uppercase tracking-[0.2em]">
                Filters
              </h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center border border-[var(--border-secondary)] hover:border-[var(--border-primary)] transition-colors rounded-none bg-transparent cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Scrollable Filters Area */}
            <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-4 hide-scrollbar">
              {filters.map((filter) => (
                <div key={filter.id} className="border-b border-[var(--border-secondary)] py-5">
                  <button 
                    onClick={() => toggleSection(filter.id)}
                    className="w-full flex justify-between items-center font-sans text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-[var(--text-primary)] bg-transparent cursor-pointer"
                  >
                    {filter.label}
                    <svg 
                      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" 
                      className={`transition-transform duration-300 ${expandedSections[filter.id] ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections[filter.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className={`pt-4 flex ${filter.id === "color" ? "flex-row flex-wrap gap-4" : "flex-col gap-3"}`}>
                          {filter.options.map(opt => {
                            const isSelected = (selectedFilters[filter.id] || []).includes(opt.value);
                            return (
                              <div 
                                key={opt.value} 
                                className={`flex items-center gap-3 cursor-pointer group`}
                                onClick={() => toggleFilter(filter.id, opt.value)}
                              >
                                {filter.id !== "color" && (
                                  <>
                                    <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${isSelected ? "bg-[#d4b06a] border-[#d4b06a]" : "border-[var(--border-primary)] group-hover:bg-[var(--bg-secondary)]"}`}>
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isSelected ? "#111111" : "transparent"} strokeWidth="3" className={!isSelected ? "group-hover:stroke-[#8C8C8C]" : ""}>
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                    </div>
                                    <span className={`font-sans text-[10px] uppercase tracking-[0.1em] transition-colors ${isSelected ? "text-[var(--text-primary)] font-medium" : "text-[#8C8C8C] group-hover:text-[var(--text-primary)]"}`}>
                                      {opt.label}
                                    </span>
                                  </>
                                )}

                                {filter.id === "color" && (
                                  <span 
                                    className={`w-8 h-8 rounded-sm inline-block shrink-0 shadow-sm transition-all duration-200 ${isSelected ? "scale-110 border-2 border-black outline outline-2 outline-offset-1 outline-[var(--text-primary)]" : "border border-black/20 hover:scale-105"}`} 
                                    style={{ backgroundColor: opt.label.startsWith("#") ? opt.label : opt.value }} 
                                    aria-label={`Color ${opt.label}`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="p-6 lg:p-8 border-t border-[var(--border-secondary)] bg-[var(--bg-primary)] grid grid-cols-2 gap-4">
              <button 
                className="border border-[var(--border-secondary)] py-4 font-sans text-[10px] uppercase tracking-[0.15em] text-[#8C8C8C] hover:text-[var(--text-primary)] hover:border-[var(--border-primary)] transition-colors bg-transparent cursor-pointer"
                onClick={clearAll}
              >
                Clear All
              </button>
              <button 
                className="bg-[#d4b06a] border border-[#d4b06a] text-[#111111] py-4 font-sans text-[10px] font-medium uppercase tracking-[0.15em] hover:bg-[#e0bc75] transition-colors cursor-pointer"
                onClick={onClose}
              >
                Apply Filter
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
