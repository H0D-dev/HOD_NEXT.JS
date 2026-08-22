import AboutHero from "../../components/about/AboutHero";
import AboutMission from "../../components/about/AboutMission";
import AboutHandmade from "../../components/about/AboutHandmade";
import AboutConclusion from "../../components/about/AboutConclusion";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Artisanal Heritage & Bespoke Craftsmanship",
  description:
    "Learn about House of Decór, our mission to empower traditional weaving communities, and our luxury custom-made rugs, curtains, and architectural wallcoverings.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About House of Decór — Artisanal Heritage & Bespoke Craftsmanship",
    description:
      "Learn about House of Decór, our mission to empower traditional weaving communities, and our luxury custom-made rugs, curtains, and architectural wallcoverings.",
    url: "https://houseofdecor.ae/about",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "About House of Decór Atelier",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About House of Decór — Artisanal Heritage & Bespoke Craftsmanship",
    description:
      "Learn about House of Decór, our mission to empower traditional weaving communities, and our luxury custom-made rugs, curtains, and architectural wallcoverings.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
};

export default function AboutPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <AboutHero />
      <AboutMission />
      <AboutHandmade />
      <AboutConclusion />
    </main>
  );
}
