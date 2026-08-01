import type { Metadata } from "next";
import ProjectsClient from "@/src/components/projects-page/ProjectsClient";

export const metadata: Metadata = {
  title: "Interior Design Portfolio & Projects",
  description:
    "Explore our portfolio of luxury residential, commercial, and yacht interior design projects featuring custom rugs and bespoke curtains.",
  alternates: {
    canonical: "/projects",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Interior Design Portfolio & Projects | House of Decór",
    description:
      "Explore our portfolio of luxury residential, commercial, and yacht interior design projects featuring custom rugs and bespoke curtains.",
    url: "https://houseofdecor.ae/projects",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "House of Decór Portfolio & Projects",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Design Portfolio & Projects | House of Decór",
    description:
      "Explore our portfolio of luxury residential, commercial, and yacht interior design projects featuring custom rugs and bespoke curtains.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
