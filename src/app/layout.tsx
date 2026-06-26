import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Bodoni_Moda } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "House of Décor — Handwoven Luxury Rugs & Bespoke Interiors",
  description:
    "Tailoring luxury, one thread at a time. Discover premium handmade rugs, bespoke curtains, and curated interior solutions by House of Décor.",
  icons: {
    icon: "/logo.png",
  },
};

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CartDrawer from "../components/cart/CartDrawer";
import CustomCursor from "../components/layout/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${bodoni.variable} antialiased`}
    >
      <body>
        <CustomCursor />
        <Header />
        <CartDrawer />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
