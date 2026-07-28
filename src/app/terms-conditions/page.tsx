import PolicyHero from "../../components/legal/PolicyHero";
import PolicyContent from "../../components/legal/PolicyContent";
import { termsConditionsData } from "../../lib/legal/termsConditionsData";

export const metadata = {
  title: "Terms & Conditions — House of Decór",
  description: "Review the Terms & Conditions and legal policies for House of Decór services and products.",
};

export default function TermsConditionsPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)] relative">
      <PolicyHero 
        title="Terms & Conditions" 
        description="Please review our policies carefully. These terms govern your use of our services and the purchase of goods from House of Decór." 
        lastUpdated="July 27, 2026" 
      />
      <PolicyContent sections={termsConditionsData} />
    </main>
  );
}
