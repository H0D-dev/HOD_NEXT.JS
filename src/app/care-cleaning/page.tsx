import type { Metadata } from "next";
import CareClient from "@/src/components/care/CareClient";

export const metadata: Metadata = {
  title: "Rug Care, Cleaning & Maintenance Guide",
  description:
    "Expert guide on preserving handmade silk and wool rugs. Learn professional care, stain removal, and long-term maintenance techniques.",
  alternates: {
    canonical: "/care-cleaning",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Rug Care, Cleaning & Maintenance Guide | House of Decór",
    description:
      "Expert guide on preserving handmade silk and wool rugs. Learn professional care, stain removal, and long-term maintenance techniques.",
    url: "https://houseofdecor.ae/care-cleaning",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "Rug Care & Cleaning Guide",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rug Care, Cleaning & Maintenance Guide | House of Decór",
    description:
      "Expert guide on preserving handmade silk and wool rugs. Learn professional care, stain removal, and long-term maintenance techniques.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
};

export default function CareCleaningPage() {
  return <CareClient />;
}
