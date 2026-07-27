import TermsHero from "../../components/terms/TermsHero";
import TermsContent from "../../components/terms/TermsContent";

export const metadata = {
  title: "Terms & Conditions — House of Decór",
  description: "Review the Terms & Conditions and legal policies for House of Decór services and products.",
};

export default function TermsConditionsPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)] relative">
      <TermsHero />
      <TermsContent />
    </main>
  );
}
