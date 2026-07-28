import PolicyHero from "../../components/legal/PolicyHero";
import PolicyContent from "../../components/legal/PolicyContent";
import { cookiePolicyData } from "../../lib/legal/cookiePolicyData";

export const metadata = {
  title: "Cookie Policy — House of Decór",
  description: "Review the Cookie Policy for House of Decór.",
};

export default function CookiePolicyPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)] relative">
      <PolicyHero 
        title="Cookie Policy" 
        description="This policy explains how we use cookies and similar technologies when you visit our website." 
        lastUpdated="July 27, 2026" 
      />
      <PolicyContent sections={cookiePolicyData} />
    </main>
  );
}
