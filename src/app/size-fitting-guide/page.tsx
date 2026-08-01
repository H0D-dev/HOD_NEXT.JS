import type { Metadata } from "next";
import SizeGuideClient from "@/src/components/size-guide/SizeGuideClient";

export const metadata: Metadata = {
  title: "Rug Size & Placement Guide for Living Rooms",
  description:
    "Interactive size and placement guide for living rooms, dining spaces, and bedrooms. Find the perfect rug dimensions for your floorplan.",
  alternates: {
    canonical: "/size-fitting-guide",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Rug Size & Placement Guide for Living Rooms & Bedrooms | House of Decór",
    description:
      "Interactive size and placement guide for living rooms, dining spaces, and bedrooms. Find the perfect rug dimensions for your floorplan.",
    url: "https://houseofdecor.ae/size-fitting-guide",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "Rug Size & Fitting Guide",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rug Size & Placement Guide for Living Rooms & Bedrooms | House of Decór",
    description:
      "Interactive size and placement guide for living rooms, dining spaces, and bedrooms. Find the perfect rug dimensions for your floorplan.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
};

export default function SizeFittingGuidePage() {
  return <SizeGuideClient />;
}
