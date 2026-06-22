IMPORTANT DEVELOPMENT INSTRUCTIONS

This project is frontend-only for now.

Tech Stack:

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Framer Motion
* Optional GSAP for advanced animations

Backend/CMS:
This frontend will later receive dynamic data from external CMS or e-commerce platforms such as:

* WooCommerce
* Shopify
* Headless CMS
* Custom REST APIs

Important:
Do NOT hardcode product data directly inside components.

The architecture must be API-friendly and scalable.

---

DATA ARCHITECTURE

Design all components to accept data through props.

Example rug data structure:

```ts
type Rug = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price?: number;
  images: {
    full: string;
    roomView: string;
    texture: string;
  };
};
```

Hero section should accept dynamic data like:

```ts
type HeroData = {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  featuredCollections: Rug[];
};
```

Example usage:

```tsx
<LuxuryHero heroData={heroData} />
```

Avoid static imports like:

```tsx
import rug1 from "./rug1.jpg"
```

Instead use dynamic image URLs:

```tsx
imageUrl
```

This makes future API integration easier.

---

COMPONENT ARCHITECTURE

Use clean reusable components.

Recommended structure:

/components
/hero
LuxuryHero.tsx
HeroContent.tsx
HeroGallery.tsx
HeroCard.tsx
HeroNavigation.tsx

Each component should be modular.

Avoid monolithic large files.

---

STATE MANAGEMENT

Keep hero slider state isolated.

Use:

* useState
* useReducer
  OR
* Zustand (optional)

Example:

* currentCollectionIndex
* activeImageSet

---

API READINESS

Future API data may arrive asynchronously.

Components must handle:

* loading states
* missing images
* fallback content
* null values

Example:

* Skeleton loaders
* Graceful fallback UI

Never assume data always exists.

---

IMAGE HANDLING

Use Next.js Image component.

Requirements:

* Optimized loading
* Responsive sizes
* Lazy loading where needed

All images should support CMS URLs.

Example:

```tsx
<Image src={imageUrl} fill alt={rug.name} />
```

Ensure compatibility with:

* WooCommerce image URLs
* Shopify CDN URLs

---

RESPONSIVENESS

Desktop:

* Split layout

Tablet:

* Reduced overlap

Mobile:

* Stack vertically
* Text first
* Gallery second

Animations should remain smooth on all devices.

Avoid heavy animations on mobile.

---

PERFORMANCE

This is a luxury visual website.
Performance is critical.

Optimize:

* Images
* Animation rendering
* Component re-renders

Use:

* memo
* lazy loading
* dynamic imports if needed

Avoid unnecessary rerenders.

---

CODE QUALITY

Requirements:

* Clean folder structure
* Reusable components
* Type-safe props
* Maintainable code

Follow production-grade standards.

Code should be easy for future backend integration with WooCommerce or Shopify APIs.
