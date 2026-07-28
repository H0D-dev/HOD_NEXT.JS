import PolicyHero from "../../components/legal/PolicyHero";
import PolicyContent from "../../components/legal/PolicyContent";
import { termsOfServiceData } from "../../lib/legal/termsOfServiceData";

export const metadata = {
  title: "Terms of Service — House of Decór",
  description: "Review the Terms of Service for House of Decór services and products.",
};

export default function TermsOfServicePage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)] relative">
      <PolicyHero 
        title="Terms of Service" 
        description="Please review our terms of service carefully. These terms govern your use of our website and services." 
        lastUpdated="July 27, 2026" 
      />
      <PolicyContent sections={termsOfServiceData} />
    </main>
  );
}
