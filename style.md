# House of Décor — Design System & Style Guide

## Overview
This document defines the visual language, design rules, and design tokens for the House of Décor digital experience. The UI should reflect premium craftsmanship, timeless luxury, and modern minimalism.

## Core Philosophy
1. **Precision Over Decoration:** 1px borders, strong grids, exact spacing. No excessive shadows or floating cards.
2. **Texture Is The Hero:** Rugs and materials are the primary visual assets.
3. **Luxury Through Simplicity:** Immense whitespace, bold typography, less text, more visuals.
4. **Premium Motion:** Slow, fluid, elegant transitions (Framer Motion/GSAP). Avoid bouncy animations.

## Color System

**Light Mode:**
- Backgrounds: `--bg-primary` (#FFFFFF), `--bg-secondary` (#F8F8F6), `--surface-primary` (#FFFFFF)
- Text: `--text-primary` (#111111), `--text-secondary` (#4A4A4A), `--text-muted` (#777777)
- Borders: `--border-primary` (#111111), `--border-secondary` (#D9D9D9)
- Accent: `--accent-primary` (#F7F77E)

**Dark Mode:**
- Backgrounds: `--bg-primary` (#0D0D0D), `--bg-secondary` (#161616), `--surface-primary` (#111111)
- Text: `--text-primary` (#FFFFFF), `--text-secondary` (#D0D0D0), `--text-muted` (#8C8C8C)
- Borders: `--border-primary` (#FFFFFF), `--border-secondary` (#333333)

## Typography

**Fonts:**
- Headings: **Cormorant Garamond** (Serif - Luxury, Timeless)
- Body/UI: **Inter** (Sans-Serif - Clean, Modern)

**Responsive Typography Rules (The "Know Your Rugs" Standard):**
Do not use abrupt font jumps or arbitrary `clamp()` values. Use Tailwind responsive classes for perfect fluid consistency:

1. **Hero & Monumental Headings (H1):**
   - `font-serif text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] leading-[1.1] tracking-tight`
2. **Section Headings & Cards (H2/H3):**
   - `font-serif text-3xl md:text-4xl lg:text-5xl`
3. **Subtitles / Quotes:**
   - `font-sans text-lg md:text-xl font-light italic`
4. **Pre-titles & Labels:**
   - `font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium`
5. **Body Text & Descriptions:**
   - `font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]`

## Layout & Components

**Grids & Spacing:**
- **Desktop:** Massive padding (`py-32 md:py-48`), 12-column grid.
- **Mobile/Tablet:** Reduced padding (`py-16 md:py-24`) to prevent empty voids, but maintain breathing room. 4/6-column grid.
- **Container Widths:** `max-w-[1400px]` (`--container-lg`) for major grids.

**Cards (Editorial Layouts):**
- **Option 1 (The 2x2 Editorial Grid):** Use side-by-side or 2x2 grids for feature lists (e.g., Weaving Techniques, Rug Making Process). Stack elements closely, use 1px borders, and apply `group-hover:scale-105` to images inside hidden-overflow containers.
- **Option 2 (Interactive Accordions):** For dense content (e.g., Fibers & Material), use sticky imagery on the left (55% width) and a clean, expanding text accordion on the right (45% width).
- **Sticky Stack (File Folder Effect):** Use incremental `top-` values and `z-index` classes to create overlapping, sticky scroll effects for multi-card sections.

**Borders & Radius:**
- **Borders:** `1px solid var(--border-primary)` or `--border-secondary`. Hard edges only.
- **Radius:** `0px` (or max `2px`). No rounded SaaS elements.

**Buttons:**
- Sharp, minimal, transparent background with `1px solid var(--border-primary)`. Fill with accent on hover.

## AI Agent Instructions
- Follow this design system strictly.
- Prioritize immense whitespace and stark typographic hierarchy.
- Always use the defined Responsive Typography Rules (e.g., `text-[2.75rem] md:text-[4.75rem]`) instead of rigid clamps.
- Never use generic SaaS layouts, heavy shadows, or bouncy animations.
- Reduce verbose paragraphs; ensure luxury stems from visual breathing room.
