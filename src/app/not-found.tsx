"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Layers, HelpCircle, PhoneCall, Sparkles } from "lucide-react";
import { findFuzzyUrlSuggestion, SearchResultItem } from "@/src/lib/search/searchEngine";
import IntelligentSearchModal from "@/src/components/search/IntelligentSearchModal";

export default function NotFound() {
  const [path, setPath] = useState("");
  const [suggestion, setSuggestion] = useState<SearchResultItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      setPath(currentPath);
      const match = findFuzzyUrlSuggestion(currentPath);
      setSuggestion(match);

      // Log 404 event for analytics
      console.log(`[404 Logged] Path: ${currentPath}, Referrer: ${document.referrer || 'Direct'}, Timestamp: ${new Date().toISOString()}`);
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(true);
  };

  return (
    <main className="w-full min-h-screen bg-[var(--bg-primary)] pt-24 pb-16 px-4 md:px-8 flex flex-col items-center">
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center">
        
        {/* 1. Friendly Luxury Header */}
        <span className="text-[var(--accent-primary)] text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium mb-3 block">
          404 — Page Not Found
        </span>
        <h1 className="font-sans text-3xl md:text-5xl font-light text-[var(--text-primary)] mb-4 leading-tight">
          The page you are looking for has moved or does not exist.
        </h1>
        <p className="text-xs md:text-sm text-[var(--text-secondary)] font-light max-w-lg mb-8 leading-relaxed">
          Allow us to guide you back to our curated collections of luxury handwoven rugs, custom architectural curtains, and interior design insights.
        </p>

        {/* 2. Primary Focus: Interactive Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-xl mb-8 relative">
          <div className="flex items-center border border-[var(--border-secondary)] bg-[var(--bg-secondary)] px-4 py-3 rounded-sm shadow-sm hover:border-[var(--accent-primary)] transition-colors">
            <Search className="w-5 h-5 text-[var(--accent-primary)] mr-3 flex-shrink-0" />
            <input
              type="text"
              value={initialSearchQuery}
              onChange={(e) => setInitialSearchQuery(e.target.value)}
              placeholder="Search rugs, curtains, size guides, care, blog insights..."
              className="w-full bg-transparent text-xs md:text-sm text-[var(--text-primary)] focus:outline-none placeholder-[var(--text-muted)]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--accent-primary)] text-white text-[10px] uppercase font-semibold tracking-wider hover:bg-[var(--accent-primary)]/90 transition-colors ml-2 flex-shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* 3. "Did you mean..." Content-Type Fuzzy URL Suggestion */}
        {suggestion && (
          <div className="w-full max-w-xl p-4 mb-10 border border-[var(--accent-primary)]/40 bg-[var(--bg-secondary)] rounded-sm text-left flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-primary)] flex items-center gap-1.5 mb-1">
                <HelpCircle className="w-3.5 h-3.5" /> Did you mean?
              </span>
              <p className="text-xs font-medium text-[var(--text-primary)] mb-0.5">{suggestion.title}</p>
              {suggestion.subtitle && <p className="text-[10px] text-[var(--text-secondary)]">{suggestion.subtitle}</p>}
            </div>
            <Link
              href={suggestion.url}
              className="px-4 py-2 text-[10px] uppercase font-semibold tracking-wider border border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              View Page <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* 4. Popular Categories */}
        <div className="w-full border-t border-[var(--border-secondary)] pt-10 mb-12">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-[var(--text-muted)] mb-6 text-center">
            Popular Collections
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              href="/products/rugs"
              className="group p-6 border border-[var(--border-secondary)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)] transition-all text-left flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--accent-primary)] block mb-1">Handmade</span>
                <h3 className="text-base font-light text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                  Luxury Rugs Collection
                </h3>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
            </Link>

            <Link
              href="/products/curtains"
              className="group p-6 border border-[var(--border-secondary)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)] transition-all text-left flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--accent-primary)] block mb-1">Bespoke</span>
                <h3 className="text-base font-light text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                  Custom Drapery & Curtains
                </h3>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
            </Link>
          </div>
        </div>

        {/* 5. Best Sellers & Quick Links */}
        <div className="w-full border-t border-[var(--border-secondary)] pt-10 mb-12">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-[var(--text-muted)] mb-6 text-center">
            Design Guides & Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <Link href="/size-fitting-guide" className="p-4 border border-[var(--border-secondary)] hover:border-[var(--text-primary)] transition-colors">
              <p className="text-xs font-medium text-[var(--text-primary)] mb-1">Size & Placement Guide</p>
              <p className="text-[10px] text-[var(--text-secondary)]">Living room, bedroom, and dining dimensions</p>
            </Link>
            <Link href="/care-cleaning" className="p-4 border border-[var(--border-secondary)] hover:border-[var(--text-primary)] transition-colors">
              <p className="text-xs font-medium text-[var(--text-primary)] mb-1">Care & Cleaning Guide</p>
              <p className="text-[10px] text-[var(--text-secondary)]">Preserving handmade silk and wool rugs</p>
            </Link>
            <Link href="/know-your-rug" className="p-4 border border-[var(--border-secondary)] hover:border-[var(--text-primary)] transition-colors">
              <p className="text-xs font-medium text-[var(--text-primary)] mb-1">Know Your Rug</p>
              <p className="text-[10px] text-[var(--text-secondary)]">Knot density and artisan weaving techniques</p>
            </Link>
          </div>
        </div>

        {/* 6. Recent Journal & Insights */}
        <div className="w-full border-t border-[var(--border-secondary)] pt-10 mb-12 text-left">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-[var(--text-muted)]">
              Latest Journal Insights
            </h2>
            <Link href="/blog" className="text-[10px] uppercase tracking-widest text-[var(--accent-primary)] hover:underline">
              View All Articles &rarr;
            </Link>
          </div>
          <div className="p-5 border border-[var(--border-secondary)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[var(--accent-primary)] block mb-1">Editorial</span>
              <p className="text-sm font-light text-[var(--text-primary)]">The Art of Hand-Knotted Rugs in Modern Luxury Interiors</p>
            </div>
            <Link href="/blog" className="px-4 py-2 text-[10px] uppercase font-semibold tracking-wider border border-[var(--border-secondary)] text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors">
              Read Article
            </Link>
          </div>
        </div>

        {/* 7. Contact & Consultation CTA */}
        <div className="w-full bg-[var(--bg-secondary)] py-10 px-6 border border-[var(--border-secondary)] flex flex-col items-center text-center">
          <PhoneCall className="w-6 h-6 text-[var(--accent-primary)] mb-3" />
          <h2 className="text-lg font-light text-[var(--text-primary)] mb-2">Need Custom Assistance?</h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mb-6">
            Our interior design consultants are ready to assist you with bespoke rug dimensions, curtain fittings, or trade inquiries.
          </p>
          <Link
            href="/contact"
            className="px-8 py-3 bg-[var(--accent-primary)] text-white text-[10px] uppercase font-semibold tracking-[0.15em] hover:bg-transparent hover:text-[var(--accent-primary)] border border-[var(--accent-primary)] transition-colors duration-300"
          >
            Request Consultation
          </Link>
        </div>

      </div>

      {/* Multi-Domain Search Modal Overlay */}
      <IntelligentSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={initialSearchQuery}
      />
    </main>
  );
}
