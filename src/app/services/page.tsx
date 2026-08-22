import ServicesHero from "../../components/services/ServicesHero";
import ServicesList from "../../components/services/ServicesList";
import ServicesProcess from "../../components/services/ServicesProcess";
import ServicesCraftsmanship from "../../components/services/ServicesCraftsmanship";
import ServicesExpertise from "../../components/services/ServicesExpertise";
import ServicesWhyUs from "../../components/services/ServicesWhyUs";
import ServicesCTA from "../../components/services/ServicesCTA";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interior Design & Bespoke Rug Services — House of Decór",
  description:
    "Specializing in luxurious, custom-made home decór solutions including bespoke rugs, architectural drapery, wallcoverings, and turnkey trade installations.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Interior Design & Bespoke Rug Services | House of Decór",
    description:
      "Specializing in luxurious, custom-made home decór solutions including bespoke rugs, architectural drapery, wallcoverings, and turnkey trade installations.",
    url: "https://houseofdecor.ae/services",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "House of Decór Bespoke Services",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Design & Bespoke Rug Services | House of Decór",
    description:
      "Specializing in luxurious, custom-made home decór solutions including bespoke rugs, architectural drapery, wallcoverings, and turnkey trade installations.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
};

export default function ServicesPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <ServicesHero />
      <ServicesList />
      <ServicesProcess />
      <ServicesCraftsmanship />
      <ServicesExpertise />
      <ServicesWhyUs />
      <ServicesCTA />
    </main>
  );
}
