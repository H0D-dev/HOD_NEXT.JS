import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://houseofdecor.ae"),
  title: {
    default: "House of Decór — Handwoven Luxury Rugs & Bespoke Interiors",
    template: "%s | House of Decór",
  },
  description:
    "Tailoring luxury, one thread at a time. Discover premium handmade rugs, bespoke curtains, and curated interior solutions by House of Decór.",
  authors: [{ name: "House of Decór", url: "https://houseofdecor.ae" }],
  creator: "House of Decór",
  publisher: "House of Decór",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CartDrawer from "../components/cart/CartDrawer";

import ScrollToTop from "../components/layout/ScrollToTop";
import { Toaster } from "react-hot-toast";

import { generateOrganizationSchema, generateWebSiteSchema } from "@/src/lib/seo/schema";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <html
      lang="en"
      className={`${jost.variable} antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://store.houseofdecor.ae" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://store.houseofdecor.ae" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body suppressHydrationWarning>
        <ScrollToTop />

        <Header />
        <CartDrawer />
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-inter)',
              border: '1px solid var(--border-color)',
            },
          }} 
        />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
