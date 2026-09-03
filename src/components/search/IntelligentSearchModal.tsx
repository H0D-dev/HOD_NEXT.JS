"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight, Package, BookOpen, Layers, Compass } from "lucide-react";
import { performMultiDomainSearch, GroupedSearchResults, SearchResultItem } from "@/src/lib/search/searchEngine";
import { useAnalytics } from "@/src/lib/analytics/useAnalytics";

interface IntelligentSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export default function IntelligentSearchModal({ isOpen, onClose, initialQuery = "" }: IntelligentSearchModalProps) {
  const { trackSearch, trackSearchResultClick, trackSearchNoResults } = useAnalytics();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<GroupedSearchResults>({
    products: [],
    collections: [],
    guides: [],
    blog: [],
    projects: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], collections: [], guides: [], blog: [], projects: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await performMultiDomainSearch(query);
      setResults(res);
      setLoading(false);

      const totalCount =
        res.products.length +
        res.collections.length +
        res.guides.length +
        res.blog.length +
        res.projects.length;

      if (totalCount === 0) {
        trackSearchNoResults({ query });
      } else {
        trackSearch({ query, resultCount: totalCount });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, trackSearch, trackSearchNoResults]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalResultsCount =
    results.products.length +
    results.collections.length +
    results.guides.length +
    results.blog.length +
    results.projects.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md transition-opacity duration-300">
      <div className="w-full max-w-3xl bg-[var(--bg-primary)] border border-[var(--border-secondary)] shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[80vh]" data-lenis-prevent>
        {/* Search Header Input */}
        <div className="relative flex items-center px-6 py-4 border-b border-[var(--border-secondary)] bg-[var(--bg-secondary)]">
          <Search className="w-5 h-5 text-[var(--accent-primary)] mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search luxury rugs, size guides, care, blog insights..."
            className="w-full bg-transparent text-[var(--text-primary)] font-sans text-sm md:text-base focus:outline-none placeholder-[var(--text-muted)]"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery("")} className="mr-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-3 py-1 text-xs uppercase tracking-widest border border-[var(--border-secondary)] text-[var(--text-primary)] hover:border-[var(--text-primary)]">
            Close
          </button>
        </div>

        {/* Search Results Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar overscroll-contain" data-lenis-prevent style={{ overscrollBehavior: "contain" }}>
          {loading && (
            <div className="py-8 text-center text-xs uppercase tracking-widest text-[var(--text-secondary)]">
              Searching House of Decór catalog...
            </div>
          )}

          {!loading && query && totalResultsCount === 0 && (
            <div className="py-8 text-center flex flex-col items-center">
              <Compass className="w-8 h-8 text-[var(--accent-primary)] mb-3 opacity-80" />
              <p className="text-sm font-sans font-medium text-[var(--text-primary)] mb-1">No direct matches found for "{query}"</p>
              <p className="text-xs text-[var(--text-secondary)] max-w-md mb-6">
                Explore popular collections, artisan weaving guides, or commission a bespoke custom piece.
              </p>

              {/* Clickable Quick Suggestion Chips */}
              <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-lg">
                {[
                  { label: "Hand Knotted", term: "Hand Knotted" },
                  { label: "Silk Rugs", term: "silk" },
                  { label: "Wool Rugs", term: "wool" },
                  { label: "Size Guide", term: "Size Guide" },
                  { label: "Care & Cleaning", term: "Care" },
                ].map((chip) => (
                  <button
                    key={chip.term}
                    onClick={() => setQuery(chip.term)}
                    className="px-3 py-1.5 text-xs bg-[var(--surface-secondary,#222)] hover:bg-[var(--accent-primary)] hover:text-black transition-colors rounded-full border border-[var(--border-secondary)] text-[var(--text-primary)]"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Bespoke Concierge Card */}
              <div className="w-full max-w-md p-4 border border-[var(--border-secondary)] bg-[var(--bg-secondary)] rounded-sm text-left flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-1">Looking for a custom design?</h4>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                    Commission custom sizes, materials, patterns, and colors tailored to your floorplan.
                  </p>
                </div>
                <Link
                  href="/bespoke"
                  onClick={onClose}
                  className="shrink-0 px-3 py-2 bg-[var(--accent-primary)] text-black text-[10px] uppercase font-semibold tracking-wider hover:opacity-90 transition-opacity"
                >
                  Custom Rug
                </Link>
              </div>
            </div>
          )}

          {!loading && results.products.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest font-semibold text-[var(--accent-primary)]">
                <Package className="w-4 h-4" /> Products ({results.products.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.products.map((item, idx) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={() => {
                      trackSearchResultClick({
                        query,
                        productId: typeof item.id === 'number' ? item.id : parseInt(String(item.id), 10) || 0,
                        position: idx + 1,
                        resultCount: results.products.length,
                      });
                      onClose();
                    }}
                    className="flex items-center gap-3 p-3 border border-[var(--border-secondary)] bg-[var(--bg-primary)] hover:border-[var(--accent-primary)] transition-colors group rounded-sm"
                  >
                    {item.image && (
                      <div className="w-12 h-12 relative flex-shrink-0 bg-[var(--bg-secondary)] overflow-hidden rounded-sm">
                        <Image src={item.image} alt={item.title} fill sizes="48px" className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                        {item.title}
                      </p>
                      {item.subtitle && <p className="text-[10px] text-[var(--text-secondary)] truncate">{item.subtitle}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading && results.collections.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest font-semibold text-[var(--accent-primary)]">
                <Layers className="w-4 h-4" /> Collections
              </div>
              <div className="space-y-2">
                {results.collections.map((item) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 border border-[var(--border-secondary)] bg-[var(--bg-primary)] hover:border-[var(--accent-primary)] transition-colors group rounded-sm"
                  >
                    <div>
                      <p className="text-xs md:text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {item.title}
                      </p>
                      {item.subtitle && <p className="text-[10px] text-[var(--text-secondary)]">{item.subtitle}</p>}
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading && results.guides.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest font-semibold text-[var(--accent-primary)]">
                <BookOpen className="w-4 h-4" /> Guides & Placement
              </div>
              <div className="space-y-2">
                {results.guides.map((item) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 border border-[var(--border-secondary)] bg-[var(--bg-primary)] hover:border-[var(--accent-primary)] transition-colors group rounded-sm"
                  >
                    <div>
                      <p className="text-xs md:text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {item.title}
                      </p>
                      {item.subtitle && <p className="text-[10px] text-[var(--text-secondary)]">{item.subtitle}</p>}
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading && results.blog.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-widest font-semibold text-[var(--accent-primary)]">
                <BookOpen className="w-4 h-4" /> Journal & Insights
              </div>
              <div className="space-y-2">
                {results.blog.map((item) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 border border-[var(--border-secondary)] bg-[var(--bg-primary)] hover:border-[var(--accent-primary)] transition-colors group rounded-sm"
                  >
                    <div>
                      <p className="text-xs md:text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {item.title}
                      </p>
                      {item.subtitle && <p className="text-[10px] text-[var(--text-secondary)]">{item.subtitle}</p>}
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
