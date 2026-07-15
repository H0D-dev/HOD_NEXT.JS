import ServicesHero from "../../components/services/ServicesHero";
import PrimaryOfferings from "../../components/services/PrimaryOfferings";
import SupportServices from "../../components/services/SupportServices";
import ServicesCTA from "../../components/services/ServicesCTA";

export const metadata = {
  title: "Our Services — House of Décor",
  description: "Specializing in luxurious, custom-made home décor solutions including bespoke rugs, wallcoverings, and artisanal handicrafts.",
};

export default function ServicesPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <ServicesHero />
      <PrimaryOfferings />
      <SupportServices />
      <ServicesCTA />
    </main>
  );
}
