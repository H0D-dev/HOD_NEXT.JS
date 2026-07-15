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

**Component Responsiveness & Font Consistency:**
- **Fluid, Not Broken:** Never use components that 'break' awkwardly or rely on massive layout shifts. Instead, components should fluently scale down using Tailwind breakpoints (`md:`, `lg:`).
- **Font Consistency:** Keep typography strictly tied to the predefined sizes. A label on the checkout page must exactly match a label on the product page. Use exact font pairings (e.g., `text-[10px] md:text-xs` for labels, `text-sm md:text-base` for standard UI text, and `text-xs md:text-sm` for tight spaces like mobile summaries). 
- **Gaps & Padding:** When dropping to mobile, do not just shrink fonts—shrink the empty spaces. Reduce huge desktop padding (`p-10` to `p-5`) and grid gaps (`gap-10` to `gap-6` or `gap-5` to `gap-4`) to optimize layout density for thumbs without making it feel claustrophobic.
- **Horizontal Real Estate:** On mobile screens, avoid aggressive text wrapping (e.g. 1 word per line) by combining titles and prices on the same line (`flex justify-between items-start`) and reducing font size appropriately.

**Buttons:**
- Sharp, minimal, transparent background with `1px solid var(--border-primary)`. Fill with accent on hover.
- **Primary CTAs (Checkout / Place Order):** `bg-[var(--accent-primary)] text-[#111] font-sans text-xs md:text-sm uppercase tracking-[0.2em] font-medium transition-colors hover:bg-[var(--accent-secondary)]`

## Forms, Cart & Checkout Experience

**Form Inputs & Labels:**
- **Labels:** `font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)] flex items-center`
- **Inputs (Mobile-First):** `w-full h-10 md:h-12 px-3 md:px-4 border border-[var(--border-secondary)] bg-transparent text-sm focus:border-[var(--text-primary)] rounded-none`
- **Textareas:** `min-h-[60px] md:min-h-[80px] p-3`
- Never use rounded corners (`rounded-none`).

**Form Layouts & Wrappers:**
- **Main Wrappers:** Give forms and order summaries a distinct, bordered box feel to separate them from the page background: `p-5 md:p-8 lg:p-10 border border-[var(--border-secondary)] bg-[var(--surface-primary)] flex flex-col gap-5 md:gap-8`
- **Inner Form Grids:** Use tighter gaps to avoid scrolling fatigue, especially on mobile: `grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-5 gap-y-4 md:gap-y-5`
- **Section Titles within Forms:** Keep them balanced: `font-serif text-lg md:text-xl font-medium mb-4`

**Order Summary & Product Variants:**
- **Summary Sidebar:** `sticky top-[100px]` to keep it visible while scrolling long forms.
- **Item Cards:** Use highly responsive layouts so text doesn't aggressively wrap on mobile. Keep the title and price side-by-side using `flex justify-between items-start` and smaller mobile fonts (`text-xs md:text-sm`).
- **Thumbnails:** Small and crisp: `w-16 h-20 md:w-20 md:h-24 shrink-0`.
- **Variant Display:** DO NOT display raw hex codes (e.g. `#8B5A2B`). Render hex colors as `10px` circular swatches with a `1px` border. Always append units like `cm` to raw size strings.

## AI Agent Instructions
- Follow this design system strictly.
- Prioritize immense whitespace and stark typographic hierarchy.
- Always use the defined Responsive Typography Rules (e.g., `text-[2.75rem] md:text-[4.75rem]`) instead of rigid clamps.
- Never use generic SaaS layouts, heavy shadows, or bouncy animations.
- Reduce verbose paragraphs; ensure luxury stems from visual breathing room.
