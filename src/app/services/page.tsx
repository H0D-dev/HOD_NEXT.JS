import ServicesHero from "../../components/services/ServicesHero";
import ServicesList from "../../components/services/ServicesList";
import ServicesProcess from "../../components/services/ServicesProcess";
import ServicesCraftsmanship from "../../components/services/ServicesCraftsmanship";
import ServicesExpertise from "../../components/services/ServicesExpertise";
import ServicesWhyUs from "../../components/services/ServicesWhyUs";
import ServicesCTA from "../../components/services/ServicesCTA";

export const metadata = {
  title: "Our Services — House of Décor",
  description: "Specializing in luxurious, custom-made home décor solutions including bespoke rugs, wallcoverings, and artisanal handicrafts.",
};

export default function ServicesPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <ServicesHero />
      <ServicesList />
      <ServicesProcess />
      <ServicesCraftsmanship />
      <ServicesExpertise />
      <ServicesWhyUs />
      <ServicesCTA />
    </main>
  );
}
