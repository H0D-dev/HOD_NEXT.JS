import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your House of Decór customer account details and order history.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
