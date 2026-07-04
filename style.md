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

Primary background is pure white.

```css
:root {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8F8F6;
  --bg-tertiary: #F3F1EC;

  --text-primary: #111111;
  --text-secondary: #4A4A4A;
  --text-muted: #777777;

  --border-primary: #111111;
  --border-secondary: #D9D9D9;

  --accent-primary: #F7F77E;
  --accent-secondary: #ECEC8D;

  --surface-primary: #FFFFFF;
  --surface-secondary: #FAFAFA;
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

## Typography Philosophy

Typography should feel premium and editorial.

Use contrast:

* Elegant serif for headings
* Clean sans-serif for UI/body

---

## Heading Typeface (Serif)

Recommended:

* Playfair Display
* Cormorant Garamond
* Libre Baskerville
* EB Garamond

Primary recommendation:
**Cormorant Garamond**

Reason:
Luxury + timeless + premium.

---

## Body Typeface (Sans)

Recommended:

* Inter
* Geist
* Satoshi
* General Sans

Primary recommendation:
**Inter**

---

## Monumental Section Headings

For major architectural section breaks (like the Collections grid):

Use:

* Massive Sans-Serif font (Inter)
* Extreme dynamic scaling (e.g., `clamp(64px, 14vw, 180px)`)
* Medium weight (`400`) to retain structural solidity
* Compressed tracking (`-0.04em`)
* Compact line-height (`0.9`)
* Small superscript counters (`(02)`) top-aligned to the shoulder of the text
* Immense isolation whitespace (120px+ padding above, 180px+ margin below)

This establishes a brutalist-luxury, art-gallery exhibition feel.

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

To maintain the luxury aesthetic across all devices (mobile, tablet, desktop), **never use abrupt font size jumps**. 
Use CSS `clamp()` for all major headings and large text elements to ensure perfectly fluid scaling that doesn't break the layout on smaller screens.

**Examples:**
* **Hero/Monumental Headings:** `text-[clamp(48px,8vw,96px)]`
* **Section Headings:** `text-[clamp(32px,5vw,64px)]` or `text-[clamp(40px,6vw,80px)]`
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

Whitespace is a primary structural element of luxury design. It must scale appropriately depending on the device:

1. **Desktop (Luxurious Breathing Room):**
   * Use immense section padding to create a gallery-like feel.
   * *Example:* `py-32 md:py-48` or `py-40 md:py-56`
   * Allow empty spaces to act as visual rests.

2. **Mobile & Tablet (Restrained but Clean):**
   * Reduce massive paddings to prevent "endless scrolling" through blank space, but retain enough padding to maintain the minimalist aesthetic.
   * *Example:* Reduce `py-40` on desktop to `py-16` or `py-24` on mobile.
   * Ensure fixed-height containers (e.g., image wrappers, sliders) are reduced on mobile to prevent huge empty gaps (e.g., `h-[300px] md:h-[500px] lg:h-[800px]`).

Never let content feel cramped on mobile, but avoid leaving large 300px empty vertical voids.

---

# Components

## Buttons

Style:

* Sharp
* Minimal
* Bold

```css
padding: 16px 32px;
border: 1px solid var(--border-primary);
background: transparent;
font-weight: 500;
```

Hover:

* Background fills with accent
* Smooth transition

Primary CTA:

* Explore Collections

Secondary CTA:

* Book Appointment

---

## Cards

Cards should feel structured.

Use:

* White backgrounds
* 1px borders
* No shadows

Avoid:

* Floating glassmorphism cards

---

# Hero Section Rules

Hero section is the most important section.

Requirements:

* Full viewport height
* Large product imagery
* Strong serif headline
* Clear CTA
* Minimal text

Structure:

* Headline
* Supporting text
* CTA
* Product visual

Example headline:
**Handwoven Excellence**

or

**Tailoring Luxury, One Thread at a Time**

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
* Collections
* Projects
* About
* Contact

CTA:
Book Appointment

---

# AI Agent Instructions

When generating UI or code:

* Follow this design system strictly
* Prioritize whitespace
* Use strong typography hierarchy
* Use serif headings
* Use sharp borders
* Avoid generic SaaS layouts
* Avoid excessive shadows
* Keep visuals premium and minimal
* Product imagery must remain central
* Strongly prefer less text and more visual breathing room (remove verbose paragraphs)

The website must feel like a luxury design studio, not a typical e-commerce store.
