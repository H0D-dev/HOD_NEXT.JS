import TechniqueHero from "../../../components/know-your-rug/TechniqueHero";
import TechniqueList from "../../../components/know-your-rug/TechniqueList";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weaving Techniques — Hand-Knotted, Tufted & Handloom Rugs",
  description:
    "Master comparison of artisanal rug constructions: hand-knotted vs. hand-tufted, handloom flatweaves, knot density metrics, and durability ratings.",
  alternates: { canonical: "/know-your-rug/weaving-techniques" },
  openGraph: {
    title: "Weaving Techniques — Hand-Knotted, Tufted & Handloom | House of Decór",
    description:
      "Master comparison of artisanal rug constructions: hand-knotted vs. hand-tufted, handloom flatweaves, knot density metrics, and durability ratings.",
    url: "https://houseofdecor.ae/know-your-rug/weaving-techniques",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "Artisanal Weaving Techniques",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weaving Techniques — Hand-Knotted, Tufted & Handloom | House of Decór",
    description:
      "Master comparison of artisanal rug constructions: hand-knotted vs. hand-tufted, handloom flatweaves, knot density metrics, and durability ratings.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
};

export default function WeavingTechniquesPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <TechniqueHero />
      <TechniqueList />
    </main>
  );
}
