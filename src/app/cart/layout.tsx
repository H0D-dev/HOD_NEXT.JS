import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "View and manage items in your House of Decór shopping cart.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
