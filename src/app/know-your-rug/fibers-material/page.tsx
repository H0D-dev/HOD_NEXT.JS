import FibersHero from "../../../components/know-your-rug/FibersHero";
import FibersContent from "../../../components/know-your-rug/FibersContent";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rug Fibers & Materials Guide — Wool, Silk & Bamboo Silk",
  description:
    "Explore our guide to luxury rug materials: pure New Zealand wool, botanical bamboo silk, mulberry silk, and durable natural blends.",
  alternates: { canonical: "/know-your-rug/fibers-material" },
  openGraph: {
    title: "Rug Fibers & Materials Guide | House of Decór",
    description:
      "Explore our guide to luxury rug materials: pure New Zealand wool, botanical bamboo silk, mulberry silk, and durable natural blends.",
    url: "https://houseofdecor.ae/know-your-rug/fibers-material",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "Luxury Rug Fibers & Materials",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rug Fibers & Materials Guide | House of Decór",
    description:
      "Explore our guide to luxury rug materials: pure New Zealand wool, botanical bamboo silk, mulberry silk, and durable natural blends.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
};

export default function FibersMaterialPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <FibersHero />
      <FibersContent />
    </main>
  );
}
