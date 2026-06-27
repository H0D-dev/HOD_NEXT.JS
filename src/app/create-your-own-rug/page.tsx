import CreateHero from "../../components/create/CreateHero";
import CreateSteps from "../../components/create/CreateSteps";

export const metadata = {
  title: "Create Your Own Rug — House of Décor",
  description: "Unleash your creativity with our bespoke service. Design a masterpiece that reflects your unique style in 6 simple steps.",
};

export default function CreateYourOwnRugPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <CreateHero />
      <CreateSteps />
    </main>
  );
}
