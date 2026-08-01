import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Login",
  description: "Sign in to your House of Decór customer or trade partner account.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
