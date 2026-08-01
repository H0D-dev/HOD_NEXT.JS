import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Register a new account with House of Decór for bespoke luxury interior services.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
