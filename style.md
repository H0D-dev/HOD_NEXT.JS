# House of Décor — Design System & Style Guide

## Overview

This document defines the visual language, design rules, and design tokens for the **House of Décor** digital experience.

House of Décor is a luxury brand focused on:

* Handmade Rugs & Carpets
* Window Treatments
* Wallcoverings
* Bespoke Design Solutions

The digital experience should reflect:

* Premium craftsmanship
* Timeless luxury
* Geometric precision
* Modern minimalism
* Intentional structure

The UI should feel refined, bold, and expensive.

---

# Design Philosophy

## Core Principles

### 1. Precision Over Decoration

Every element must feel intentional.

Use:

* Strong grid systems
* Exact spacing
* Clear alignment
* 1px borders

Avoid:

* Random floating cards
* Excessive shadows
* Overly soft layouts

---

### 2. Texture Is The Hero

The product texture should dominate visually.

Rugs, carpets, and materials are the primary visual assets.

UI should support imagery—not overpower it.

---

### 3. Luxury Through Simplicity (Less Text, More Visuals)

Luxury is communicated through restraint and visual breathing room. The website theme strongly dictates **less text and more visuals**. Let the typography and imagery do the heavy lifting.

Use:

* Immense, intentional whitespace
* Highly minimal, punchy copy (remove paragraphs of descriptive text where possible)
* Bold, scalable typography
* Large, high-quality visuals taking center stage

Avoid:

* Long paragraphs of text
* Cluttered or overly verbose explanations
* Cramping imagery with text blocks

---

### 4. Motion Should Feel Premium

Motion should feel smooth and deliberate.

Animation style:

* Slow
* Fluid
* Elegant
* High-end

Recommended:

* Framer Motion
* GSAP

Use:

* Fade-up reveals
* Parallax image motion
* Smooth scrolling
* Text stagger animation

Avoid:

* Bouncy animations
* Playful transitions

---

# Visual Language

## The Look

* High-precision geometry
* 1px solid borders
* Stark typography
* Strong hierarchy
* Editorial layouts
* Minimal UI

Think:

* Luxury interior magazine
* High-end design studio
* Premium furniture brand

---

# Color System

## Light Mode

Primary background is a warm off-white.

```css
:root {
  --bg-primary: #F5F2EC;
  --bg-secondary: #EAE3D8;
  --bg-tertiary: #DFD6C9;

  --text-primary: #2B2B2B;
  --text-secondary: #595959;
  --text-muted: #8C857E;

  --border-primary: #2B2B2B;
  --border-secondary: #D4CFC6;

  --accent-primary: #B08A57;
  --accent-secondary: #6B5646;

  --surface-primary: #F5F2EC;
  --surface-secondary: #EAE3D8;
}
```

---

## Dark Mode

```css
[data-theme="dark"] {
  --bg-primary: #0D0D0D;
  --bg-secondary: #161616;
  --bg-tertiary: #202020;

  --text-primary: #FFFFFF;
  --text-secondary: #D0D0D0;
  --text-muted: #8C8C8C;

  --border-primary: #FFFFFF;
  --border-secondary: #333333;

  --accent-primary: #F7F77E;
  --accent-secondary: #D9D96A;

  --surface-primary: #111111;
  --surface-secondary: #181818;
}
```

---

# Typography

## Typography Philosophy — Unified Geometric Sans-Serif

The entire platform adopts a **single, clean geometric sans-serif typeface** for a premium, modern aesthetic. This creates a unified visual identity where hierarchy is expressed through **weight, size, case, tracking, and style (italic)** — not through mixing font families.

**Primary Typeface: Jost**

Jost is a geometric sans-serif inspired by Futura, providing a clean, modern, and premium feel that works across all use cases — from monumental hero headlines to tiny UI labels.

**Fallback Stack:** `'Jost', 'Outfit', 'Inter', system-ui, sans-serif`

### Why Jost over Serif Headings?

The previous system used Cormorant Garamond for headings + Inter for body. The new system uses Jost universally because:

* **Geometric consistency** — Unified typeface creates a more cohesive, modern luxury feel
* **Better hierarchy through weight/size** — Instead of relying on serif vs sans contrast, hierarchy comes from deliberate size jumps, weight changes, tracking, and italic usage
* **Center-aligned symmetry** — Geometric sans works better for the center-aligned, gallery-like layouts
* **Premium fashion/interior brands** use this approach (Jaipur Rugs, Aesop, COS)

### Global Rendering Rules

Apply these globally on `<body>` for crisp text:

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

---

## Detailed Typography Use Cases

### Hero Section Text (Overlaid on Full-Bleed Imagery)

Usage: Main headline text over hero slider images (e.g., "From the House of Décor with love.")

* **Size:** `text-4xl md:text-5xl lg:text-6xl` — or fluid: `clamp(36px, 6vw, 64px)`
* **Weight:** `font-light` (300) — thin letterforms against full-bleed imagery
* **Case:** Sentence case or Title Case (NOT all uppercase for the headline itself)
* **Tracking:** `tracking-wide` (0.05em) — airy, breathable
* **Line-height:** `leading-none` or `leading-tight` (0.9–1.1)
* **Color:** White with subtle `drop-shadow-md` for readability
* **CTA below hero text:** `text-xs font-semibold uppercase tracking-[0.2em]`

---

### Section Headers (e.g., "Collections", "Featured", "Our Projects")

Usage: Titles that introduce new grids, sliders, or content blocks on the homepage and inner pages.

* **Size:** `text-xl lg:text-2xl` — or fluid: `clamp(20px, 2.5vw, 28px)`
* **Weight:** `font-medium` (500) — solid but not heavy
* **Case:** Title Case (e.g., "Collections", "Featured")
* **Alignment:** Left-aligned with content, paired with a right-aligned "View All" link
* **Spacing:** `mb-10 md:mb-12` below
* **Superscript counter:** Small `(04)` style counters: `text-[10px] font-medium ml-1`

---

### Monumental Section Headings (Large Architectural Text)

Usage: For major structural breaks and banner-like sections (e.g., the "Our Process" section header, or quote-style banners like "Give Your Home a Softer Voice").

* **Size:** `text-2xl md:text-3xl lg:text-4xl` — or fluid: `clamp(28px, 5vw, 48px)` (scaled down for compactness)
* **Weight:** `font-light` (300) or `font-normal` (400) — retain structural elegance without heaviness
* **Tracking:** `tracking-wide` (0.02em) — airy and sophisticated
* **Line-height:** `leading-tight` (1.1) or `leading-none` (0.9)
* **Alignment:** `text-center`
* **Surrounding whitespace:** `py-20 lg:py-32` — immense isolation creates an art-gallery feel

---

### Product Card Titles (in Featured Sliders and Catalog Grids)

Usage: Product name displayed below the product image.

* **Size:** `text-sm` (14px)
* **Weight:** `font-medium` (500)
* **Case:** Title Case
* **Alignment:** Left-aligned (catalog grid) or center-aligned depending on context
* **Spacing:** `mt-4` above (after the image gap)

---

### Product Card Subtitles (Category, Material, Collection Name)

Usage: Secondary info like "Hand Knotted", collection name, material type.

* **Size:** `text-[10px] lg:text-xs` (10–12px)
* **Weight:** `font-normal` (400)
* **Case:** `uppercase`
* **Tracking:** `tracking-widest` (0.1em)
* **Color:** `var(--text-muted)`
* **Spacing:** `mb-1` below

---

### Product Card Meta (Price & Dimensions)

Usage: Price and sizing info on product cards.

* **Size:** `text-sm` (14px)
* **Weight:** `font-normal` (400)
* **Style:** Normal (not italic — keep clean for e-commerce clarity)
* **Color:** `var(--text-secondary)`

---

### Storytelling / Banner Text (e.g., "Materials chosen not for trends, but for timelessness.")

Usage: Narrative, quote-style banners between major sections. Centered, impactful, poetic.

* **Size:** `text-xl md:text-2xl lg:text-3xl` — or fluid: `clamp(20px, 4vw, 36px)` (compact, highly legible)
* **Weight:** `font-light` (300) for the main phrase
* **Style:** Pair with `italic` on a secondary phrase for visual rhythm
* **Alignment:** `text-center`
* **Line-height:** `leading-tight`
* **Max-width:** `max-w-4xl mx-auto` — constrain for readability
* **Surrounding whitespace:** `py-20 lg:py-32`

---

### Body / Descriptive Text (Supporting copy under section headers)

Usage: Short supporting paragraphs beneath section titles (e.g., "Explore our curated collection of handcrafted rugs...").

* **Size:** `text-sm lg:text-base` (14–16px)
* **Weight:** `font-light` (300)
* **Color:** `var(--text-secondary)`
* **Line-height:** `leading-relaxed` (1.6+)
* **Max-width:** `max-w-[400px]` — constrain to prevent overly wide text blocks

---

### Small UI Labels (Buttons, CTAs, Category Tags, Navigation)

Usage: "EXPLORE COLLECTION", "VIEW ALL", nav links, category tags like "RUGS", "CURTAINS".

* **Size:** `text-[10px] sm:text-[11px]` (10–11px)
* **Weight:** `font-semibold` (600)
* **Case:** `uppercase`
* **Tracking:** `tracking-[0.2em]` — widest tracking for tiny text
* **Interaction:** Pair with an animated underline or arrow on hover

---

### Footer Text

Usage: Footer links, copyright, secondary navigation.

* **Size:** `text-xs` to `text-sm` (12–14px)
* **Weight:** `font-normal` (400) for links, `font-light` (300) for copyright
* **Case:** Regular case for links, uppercase for section titles within footer
* **Tracking:** `tracking-wide` for uppercase footer section titles
* **Color:** `var(--text-secondary)` for links, `var(--text-muted)` for copyright

---

### Newsletter / Form Labels & Inputs

Usage: Email input fields, subscribe buttons, form headings.

* **Heading:** `text-2xl md:text-3xl font-light text-center`
* **Subtitle:** `text-sm font-light text-center text-[var(--text-secondary)]`
* **Input text:** `text-sm font-normal`
* **Button text:** `text-xs font-semibold uppercase tracking-[0.15em]`

---

# Typography Scale

```css
--text-xs: 12px;
--text-sm: 14px;
--text-md: 16px;
--text-lg: 20px;
--text-xl: 24px;
--text-2xl: 32px;
--text-3xl: 48px;
--text-4xl: 64px;
--text-5xl: 96px;
```

---

## Fluid Typography & Responsive Consistency

To maintain the luxury aesthetic across all devices, **never use abrupt font size jumps**.
Use CSS `clamp()` for all major headings and large text elements.

**Examples:**
* **Hero/Monumental Headings:** `text-[clamp(48px,8vw,96px)]`
* **Section Headings:** `text-[clamp(20px,2.5vw,28px)]`
* **Banner/Quote Text:** `text-[clamp(28px,5vw,56px)]`
* **Large Quotes:** `text-[clamp(24px,5vw,56px)]`

This guarantees that typography always feels perfectly proportioned, whether on a 320px phone or a 4K display.

---

# Layout System

## Container Widths

```css
--container-sm: 768px;
--container-md: 1200px;
--container-lg: 1440px;
```

---

## Grid System

Use:

* 12-column grid desktop
* 6-column tablet
* 4-column mobile

Spacing must feel precise.

---

## Primary Alignment Philosophy

**Center alignment** is the default for:
* Monumental/banner headings
* Storytelling paragraphs
* Newsletter sections
* Standalone quote blocks

**Left alignment** is the default for:
* Section headers paired with "View All" CTAs (flex justify-between)
* Product card text
* Navigation and footer links
* Form labels and body copy

---

# In-Depth Layout & Structural Hierarchy

## A. The Header Navigation

The header spans the full screen width, keeping the layout airy and expansive.

* **Top Bar (if promo):** `w-full py-2 flex justify-center items-center text-xs`
* **Main Header:** Fixed position, transparent on hero → solid `var(--bg-primary)` on scroll
* **Left Container:** Logo + Desktop navigation links (`flex gap-[var(--space-5)] items-center`)
* **Right Container:** Cart icon, currency selector, account icon (`flex gap-4 items-center`)
* **Mobile:** Hamburger menu → slide-in drawer from right (85% width, max 360px)
* **Nav Link Style:** `text-sm font-normal tracking-[0.05em]` with 1px underline on hover
* **Logo:** Brand logotype in Jost `text-[26px] md:text-[32px] font-medium tracking-[-0.02em]`
* **Icon Styling:** All header icons should feel thin and elegant — use `strokeWidth="1.5"`

---

## B. The Hero Section

Full-bleed, viewport-height hero with overlaid text.

* **Container:** `relative w-full h-[100svh] overflow-hidden`
* **Background:** Full-bleed `<Image>` with `object-cover`, parallax via Framer Motion `useTransform`
* **Overlay:** Gradient overlay for text readability — `bg-gradient-to-t from-black/80 via-black/40 to-transparent` (mobile) / `bg-gradient-to-r from-black/60 via-black/10 to-transparent` (desktop)
* **Text Position:** Left-aligned on desktop (`w-1/2 px-20`), bottom-aligned on mobile
* **Headline:** `font-[Jost] clamp(2.5rem, 8vw, 4.5rem) font-medium leading-[1.1] text-white`
* **Subtitle:** `text-sm sm:text-base font-light text-white/90 leading-relaxed`
* **CTA:** `text-[10px] font-semibold uppercase tracking-[0.2em] text-white` with animated line

---

## C. Standard Section Spacing

Wrap every major section in a `<section>` tag with compact, deliberate vertical padding:

* **Standard sections:** `py-12 lg:py-16`
* **Banner/storytelling sections:** `py-12 lg:py-20`
* **Heavy architectural sections (Process, About):** `py-12 md:py-16 lg:py-20` (max ~80px)

Do not use excessive gaps between sections. The layout must remain compact to prevent endless scrolling through empty negative space, while still feeling connected and breathable.

---

## D. Collection Category Grid

Image-first category cards using lifestyle/room imagery.

* **Grid:** `grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12 lg:gap-x-10`
* **Card Structure:**
  * Image wrapper: `aspect-[2/3] max-h-[75vh] overflow-hidden bg-[var(--bg-secondary)]`
  * Image hover: `transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105`
  * Title below: `text-sm font-medium` — left-aligned, minimal
* **Section Header:** Left-aligned `text-xl lg:text-2xl font-medium` with "View All" link on the right

---

## E. Featured Products Slider

Horizontal scrolling product sliders with drag interaction.

* **Container:** Full-width overflow hidden, horizontal drag via Framer Motion
* **Card Structure (flex column):**
  * Image: `aspect-[3/4] overflow-hidden bg-[var(--bg-secondary)]`
  * Image hover: `scale-[1.03]` transition
  * Product name: `text-sm font-medium` below the image
* **Section Header:** Same pattern as Collection Categories — left-aligned title + supporting text on the right

---

## F. Storytelling / Banner Blocks (e.g., "Give Your Home a Softer Voice")

Centered, poetic, full-width interludes between data-heavy sections.

* **Container:** `w-full bg-[var(--bg-secondary)] border-y border-[var(--border-secondary)] py-20 lg:py-32 flex justify-center items-center`
* **Layout:** `flex flex-col items-center text-center`
* **Heading:** `text-3xl md:text-4xl lg:text-5xl font-normal leading-tight tracking-tight`
* **Italic accent:** Apply `italic text-[var(--text-secondary)]` to a portion of the heading for visual rhythm
* **Optional CTA:** `mt-6 uppercase text-sm underline`

---

## G. Product Catalog Grid (Listing Pages)

The core e-commerce product listing layout.

* **Grid:** `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 px-4 md:px-8`
* **Product Card Structure (flex column):**
  * Image: `aspect-square overflow-hidden bg-[var(--bg-secondary)] mb-4`
  * Image hover: `scale-105 transition-transform duration-700`
  * Collection label: `text-[10px] lg:text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1`
  * Product name: `text-[var(--text-lg)] leading-tight mb-1`
  * Price/meta: `text-sm text-[var(--text-secondary)]`
* **Text alignment:** Left-aligned (`items-start`)

---

## H. Process Section

Step-by-step craftsmanship process display.

* **Layout:** Numbered steps with imagery
* **Step numbers:** `text-xs uppercase tracking-widest text-[var(--text-muted)]`
* **Step titles:** `text-xl md:text-2xl font-medium`
* **Step description:** `text-sm font-light text-[var(--text-secondary)] leading-relaxed`
* **Spacing:** `py-[var(--space-8)]`

---

## I. Projects Section

Showcase completed interior design projects.

* **Grid:** Asymmetric or masonry-style for visual interest
* **Project titles:** `text-lg font-medium`
* **Project meta:** `text-xs uppercase tracking-widest text-[var(--text-muted)]`
* **Image treatment:** Large, full-bleed room shots with `aspect-[4/3]` or `aspect-[16/9]`

---

## J. About Section (Homepage)

Brief brand story block on the homepage.

* **Layout:** Two-column — text + image, or centered text block
* **Heading:** `text-2xl md:text-3xl font-light`
* **Body:** `text-sm md:text-base font-light text-[var(--text-secondary)] leading-relaxed max-w-lg`
* **CTA:** Understated `text-xs uppercase tracking-[0.15em] underline`

---

## K. Newsletter Section

Email capture section at the bottom of pages.

* **Container:** `py-20 lg:py-32 flex flex-col items-center text-center`
* **Heading:** `text-2xl md:text-3xl font-light`
* **Subtitle:** `text-sm font-light text-[var(--text-secondary)] mt-4`
* **Input:** Clean, borderless or 1px bottom-border, `text-sm`
* **Submit button:** `text-xs font-semibold uppercase tracking-[0.15em]` with filled hover state

---

## L. Contact Page

* **Hero:** Full-width banner with centered text overlay
* **Form section:** Clean, minimal form fields with `border-b` style inputs
* **Info section:** Address, phone, email in a structured grid
* **Form labels:** `text-xs uppercase tracking-widest text-[var(--text-muted)]`

---

## M. Footer

* **Container:** `w-full bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)]`
* **Layout:** Multi-column grid — brand info, navigation, services, contact
* **Section titles:** `text-xs uppercase tracking-widest font-medium mb-4`
* **Links:** `text-sm font-normal text-[var(--text-secondary)]` with hover color shift
* **Copyright bar:** `text-xs text-[var(--text-muted)] border-t border-[var(--border-secondary)] py-6`

---

# Border System

Use hard edges.

```css
--border-thin: 1px solid var(--border-primary);
```

Rules:

* No thick borders
* No soft borders
* Prefer 1px lines

---

# Radius

Minimal or none.

```css
--radius-sm: 0px;
--radius-md: 2px;
```

Avoid rounded-heavy modern SaaS look.

---

# Spacing System

8px scale.

```css
--space-1: 8px;
--space-2: 16px;
--space-3: 24px;
--space-4: 32px;
--space-5: 48px;
--space-6: 64px;
--space-7: 96px;
--space-8: 128px;
```

---

## Responsive Whitespace & Padding

Whitespace is a primary structural element of luxury design, but it must be applied compactly to avoid vast voids of negative space:

1. **Desktop (Compact & Cohesive):**
   * Use constrained section padding so that content flows densely without losing elegance.
   * *Example:* `py-12 md:py-16 lg:py-20` maximum.
   * Avoid immense padding classes like `py-32` or `py-[128px]` which create disjointed, isolated sections.

2. **Mobile & Tablet (Restrained but Clean):**
   * Keep paddings extremely tight to prevent "endless scrolling" through blank space.
   * *Example:* `py-8` or `py-12` on mobile.
   * Ensure fixed-height containers are heavily reduced on mobile (e.g., `h-[250px] md:h-[400px] lg:min-h-[70svh]`).

The UI must feel intentionally dense and compact. Never let content feel completely suffocated, but aggressively avoid large empty vertical voids.

---

# Components

## Buttons

Style:

* Sharp
* Minimal
* Sharp
* **Thin (0.5px borders, compact padding)**

```css
padding: 12px 32px;
border: 0.5px solid var(--border-primary);
background: transparent;
font-weight: 500;
font-family: 'Jost', sans-serif;
font-size: 12px;
text-transform: uppercase;
letter-spacing: 0.15em;
```

Hover:

* Background fills with `var(--accent-primary)` (preferably a slide-up effect)
* Text color inverts to contrast properly (typically white)
* Smooth transition: `transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)`

Primary CTA:

* Explore Collections

Secondary CTA:

* Book Appointment

---

## Cards

Cards should feel structured.

Use:

* White / `var(--bg-primary)` backgrounds
* 1px borders (optional — can also be borderless for product cards)
* No shadows (or extremely subtle: `shadow-[0_8px_30px_rgb(0,0,0,0.04)]` on hover only)

Avoid:

* Floating glassmorphism cards
* Heavy drop shadows

---

# Hero Section Rules

Hero section is the most important section.

Requirements:

* Full viewport height (`100svh`)
* Full-bleed product/lifestyle imagery with parallax
* Strong sans-serif headline (Jost, light weight, large scale)
* Clear CTA with animated underline
* Minimal text — headline + one line of supporting copy + CTA link

Structure:

* Background image (full-bleed, parallax)
* Gradient overlay
* Headline (left-aligned on desktop, bottom-aligned on mobile)
* Supporting text
* CTA link with animated line

Example headline:
**From the House of Décor with love.**

---

# Motion Rules

Animation Duration:

* 0.6s
* 0.8s
* 1.2s

Easing:

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

Use for:

* Hero text reveal
* Section transitions
* Image parallax
* CTA hover interactions
* Staggered card reveals

---

# UX Guidelines

Must feel:

* Premium
* Clean
* Fast
* Intentional

User journey:

1. Discover brand
2. Explore collections
3. View projects
4. Book consultation

Navigation should be minimal and elegant.

Recommended Nav:

* Home
* Products
* Projects
* About
* Contact

CTA:
Book Appointment

---

# AI Agent Instructions

When generating UI or code:

* Follow this design system strictly
* **Use Jost as the single typeface** — do NOT mix serif and sans-serif fonts
* Express hierarchy through **size, weight, tracking, case, and italic style** — not through font family switching
* **Center-align** storytelling/banner text, newsletter blocks, and monumental headings
* **Left-align** section headers paired with CTAs, product card text, navigation, and form content
* Prioritize whitespace
* Use sharp borders (1px, no border-radius)
* Avoid generic SaaS layouts
* Avoid excessive shadows
* Keep visuals premium and minimal
* Product imagery must remain central
* **Ensure all sections are compact.** Keep margins and padding constrained (max `py-16` or `py-20`). Avoid massive gaps of negative space.

The website must feel like a luxury design studio, not a typical e-commerce store.
