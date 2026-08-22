import KnowHero from "../../components/know-your-rug/KnowHero";
import KnowGrid from "../../components/know-your-rug/KnowGrid";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Know Your Rug — The Definitive Guide to Handmade Rugs",
  description:
    "Discover the craftsmanship behind House of Decór. Comprehensive guides on weaving techniques, luxury fibers, natural dyes, and the artisanal rug-making process.",
  alternates: { canonical: "/know-your-rug" },
  openGraph: {
    title: "Know Your Rug — The Definitive Guide to Handmade Rugs | House of Decór",
    description:
      "Discover the craftsmanship behind House of Decór. Comprehensive guides on weaving techniques, luxury fibers, natural dyes, and the artisanal rug-making process.",
    url: "https://houseofdecor.ae/know-your-rug",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "Know Your Rug — House of Decór Knowledge Hub",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Know Your Rug — The Definitive Guide to Handmade Rugs | House of Decór",
    description:
      "Discover the craftsmanship behind House of Decór. Comprehensive guides on weaving techniques, luxury fibers, natural dyes, and the artisanal rug-making process.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
};

export default function KnowYourRugPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <KnowHero />
      <KnowGrid />
    </main>
  );
}
