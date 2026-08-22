export interface ProjectPartner {
  name: string;
  role: string;
  url?: string;
}

export interface ProjectSpec {
  clientType: string;
  location: string;
  year: string;
  areaSqFt?: string;
  materials: string[];
  techniques: string[];
  leadTime?: string;
  scope: string;
}

export interface ProjectCaseStudy {
  id: string;
  slug: string;
  title: string;
  category: "Residential" | "Commercial" | "Royal Palaces" | "Luxury Villas";
  subtitle: string;
  location: string;
  year: string;
  heroImage: string;
  gallery: string[];
  summary: string;
  theBrief: string;
  craftsmanshipNarrative: string;
  result: string;
  specs: ProjectSpec;
  partnerCredits?: ProjectPartner[];
}

export const projectsData: ProjectCaseStudy[] = [
  {
    id: "villa-lv",
    slug: "villa-lv",
    title: "VILLA LV",
    category: "Luxury Villas",
    subtitle: "Custom Architectural Carpets & Hand-Knotted Living Room Centerpieces",
    location: "Dubai, UAE",
    year: "2023",
    heroImage: "/images/home/featured-projects/FP-Villa-LV.webp",
    gallery: [
      "/images/home/featured-projects/FP-Villa-LV.webp",
      "/about_hero_desktop.png",
      "/images/craftsmanship/craft_hero.webp",
    ],
    summary:
      "A bespoke collection of hand-knotted rugs created for Villa LV's expansive living spaces and private suites, crafted in New Zealand wool and botanical bamboo silk to harmonize with monumental marble architecture.",
    theBrief:
      "The client and architectural team requested an understated, multi-textured floor covering solution across 8,500 sq.ft of open-plan living areas. The challenge was balancing expansive stone floors with warm acoustic dampening while maintaining clean, modern lines.",
    craftsmanshipNarrative:
      "Over four months, our master artisans hand-knotted each piece using 100-knot density, blending hand-spun New Zealand wool with luminous bamboo silk highlights. Gradient dyeing created subtle shifts in tone under shifting natural light.",
    result:
      "The residence achieved an intimate yet elevated atmosphere, where architectural geometry meets tactile softness, earning praise from the regional design community.",
    specs: {
      clientType: "Private Residential Commission",
      location: "Emirates Hills, Dubai, UAE",
      year: "2023",
      areaSqFt: "8,500 sq.ft",
      materials: ["Pure New Zealand Wool", "High-Grade Bamboo Silk"],
      techniques: ["Hand-Knotted 100-Knot", "Tip-Sheared Relief", "Hand-Dyed Gradient"],
      leadTime: "16 Weeks",
      scope: "Living Hall, Majlis, Master Bedroom Suite, Dining Salon",
    },
    partnerCredits: [
      { name: "Dubai Interior Architecture Studio", role: "Interior Architecture", url: "https://houseofdecor.ae/designer-trade-program" },
      { name: "House of Decór Atelier", role: "Rug Design & Hand-Weaving", url: "https://houseofdecor.ae/bespoke" },
    ],
  },
  {
    id: "luxury-penthouse",
    slug: "luxury-penthouse",
    title: "LUXURY PENTHOUSE",
    category: "Residential",
    subtitle: "Pure Silk & Hand-Spun Wool Suites with Arabian Gulf Vistas",
    location: "Palm Jumeirah, Dubai, UAE",
    year: "2026",
    heroImage: "/images/home/featured-projects/FP-Penthouse.webp",
    gallery: [
      "/images/home/featured-projects/FP-Penthouse.webp",
      "/about_hero_desktop.png",
      "/images/craftsmanship/craft_hero.webp",
    ],
    summary:
      "A bespoke suite of rugs tailored to complement custom Italian furnishings in a prestigious Palm Jumeirah penthouse, balancing durability with pure silk luster against panoramic sea views.",
    theBrief:
      "Design and produce seamless, oversized floorpieces that frame the floor-to-ceiling panoramic views of Dubai's skyline without competing with the owner's curated collection of contemporary fine art.",
    craftsmanshipNarrative:
      "Utilizing an ultra-fine 150-knot weave in pure mulberry silk and high-twist wool, our weavers achieved a low-profile pile that glimmers delicately in the Gulf sunlight while offering resilience for high-traffic entertaining spaces.",
    result:
      "A penthouse interior defined by quiet luxury, where bespoke textures subtly frame the bespoke furniture and sea-facing terraces.",
    specs: {
      clientType: "Private Luxury Residence",
      location: "Palm Jumeirah, Dubai, UAE",
      year: "2026",
      areaSqFt: "6,200 sq.ft",
      materials: ["Pure Mulberry Silk", "Hand-Spun Mountain Wool"],
      techniques: ["Hand-Knotted 150-Knot", "Loom-Finished Edging"],
      leadTime: "14 Weeks",
      scope: "Grand Salon, Private Study, Master Penthouse Suite",
    },
    partnerCredits: [
      { name: "Palm Jumeirah Design Consultants", role: "Interior Styling", url: "https://houseofdecor.ae/designer-trade-program" },
      { name: "House of Decór Atelier", role: "Custom Drapery & Floorcoverings", url: "https://houseofdecor.ae/bespoke" },
    ],
  },
  {
    id: "gharafa-palace",
    slug: "gharafa-palace",
    title: "GHARAFA PALACE",
    category: "Royal Palaces",
    subtitle: "Monumental Palace-Scale Rugs Honoring Regional Heritage",
    location: "Doha, Qatar",
    year: "2024",
    heroImage: "/images/home/featured-projects/FP-Gharafa-Palace-Qatar.webp",
    gallery: [
      "/images/home/featured-projects/FP-Gharafa-Palace-Qatar.webp",
      "/about_hero_desktop.png",
      "/images/craftsmanship/craft_hero.webp",
    ],
    summary:
      "Palace-sized rugs handcrafted from the finest materials, combining traditional Arabesque motifs with refined contemporary finishing for ceremonial majlis and grand reception halls.",
    theBrief:
      "Produce seamless custom rugs exceeding 14 meters in length for ceremonial reception halls, requiring exact color matching to historical royal tapestry accents and marble inlay patterns.",
    craftsmanshipNarrative:
      "Built on custom-built oversized looms with master weaver teams working simultaneously, incorporating gold silk accents and rich natural mineral dyes resistant to heavy ambient lighting.",
    result:
      "A ceremonial showcase of heritage weaving that enhances the monumental scale of the palace while ensuring supreme longevity under state reception protocols.",
    specs: {
      clientType: "Royal & Government Commission",
      location: "Doha, Qatar",
      year: "2024",
      areaSqFt: "18,000 sq.ft",
      materials: ["Finest Bikaner Wool", "Pure Gold Thread Silk Accents"],
      techniques: ["Traditional Master Knotting", "Intricate Arabesque Carving"],
      leadTime: "24 Weeks",
      scope: "Grand Majlis, Royal State Reception Halls, Banquet Suites",
    },
    partnerCredits: [
      { name: "Palatial Architectural Group", role: "Architectural Oversight", url: "https://houseofdecor.ae/projects" },
      { name: "House of Decór Bespoke Division", role: "Handcrafted Floor Art", url: "https://houseofdecor.ae/bespoke" },
    ],
  },
  {
    id: "galeries-lafayette-dubai-mall",
    slug: "galeries-lafayette-dubai-mall",
    title: "GALERIES LAFAYETTE DUBAI MALL",
    category: "Commercial",
    subtitle: "High-Traffic Luxury Retail Installation at The Dubai Mall",
    location: "Dubai, UAE",
    year: "2025",
    heroImage: "/images/home/featured-projects/FP-Dubai-Mall.webp",
    gallery: [
      "/images/home/featured-projects/FP-Dubai-Mall.webp",
      "/about_hero_desktop.png",
      "/images/craftsmanship/craft_hero.webp",
    ],
    summary:
      "A contemporary rug and luxury carpet installation created for Galeries Lafayette at Dubai Mall, engineered for exceptional acoustic warmth and durability in a world-class luxury shopping environment.",
    theBrief:
      "Design, test, and install bespoke carpets for luxury retail VIP styling rooms and premium display zones that satisfy heavy footfall fire and wear certifications without sacrificing plush sensory touch.",
    craftsmanshipNarrative:
      "Custom high-density tufted wool construction treated with international commercial flame-retardant and soil-resist coatings, coupled with acoustic underlays tailored for retail environments.",
    result:
      "Elevated the customer journey within the department store, establishing an inviting, acoustic-dampened sanctuary within the bustling Dubai Mall.",
    specs: {
      clientType: "Commercial Retail Installation",
      location: "The Dubai Mall, Downtown Dubai, UAE",
      year: "2025",
      areaSqFt: "4,500 sq.ft",
      materials: ["Commercial-Grade New Zealand Wool", "Reinforced Botanical Silk"],
      techniques: ["High-Density Hand-Tufted", "Commercial Acoustic Backing"],
      leadTime: "10 Weeks",
      scope: "VIP Personal Shopping Salons & Premium Retail Zones",
    },
    partnerCredits: [
      { name: "Galeries Lafayette Retail Design Team", role: "Retail Concepts", url: "https://houseofdecor.ae/designer-trade-program" },
      { name: "House of Decór Commercial Solutions", role: "Fabrication & On-Site Installation", url: "https://houseofdecor.ae/services" },
    ],
  },
];

export function getProjects(): ProjectCaseStudy[] {
  return projectsData;
}

export function getProjectBySlug(slug: string): ProjectCaseStudy | undefined {
  return projectsData.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}
