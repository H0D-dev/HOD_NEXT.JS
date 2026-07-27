import PrivacyHero from "../../components/privacy/PrivacyHero";
import PrivacyContent from "../../components/privacy/PrivacyContent";

export const metadata = {
  title: "Privacy Policy — House of Décor",
  description: "Review the Privacy Policy for House of Décor services and products.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)] relative">
      <PrivacyHero />
      <PrivacyContent />
    </main>
  );
}
