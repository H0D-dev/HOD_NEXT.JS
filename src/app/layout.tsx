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
  title: "House of Décor — Handwoven Luxury Rugs & Bespoke Interiors",
  description:
    "Tailoring luxury, one thread at a time. Discover premium handmade rugs, bespoke curtains, and curated interior solutions by House of Décor.",
  icons: {
    icon: "/logo/HOD_LOGO.webp",
  },
};

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CartDrawer from "../components/cart/CartDrawer";

import ScrollToTop from "../components/layout/ScrollToTop";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jost.variable} antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
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
