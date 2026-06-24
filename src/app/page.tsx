import HeroSection from "@/src/components/hero/HeroSection";
import CollectionCategories from "@/src/components/collections/CollectionCategories";
import SofterVoiceBanner from "@/src/components/banner/SofterVoiceBanner";
import FeaturedProducts from "@/src/components/products/FeaturedProducts";
import ProcessSection from "@/src/components/process/ProcessSection";
import ProjectsSection from "@/src/components/projects/ProjectsSection";
import AboutSection from "@/src/components/about/AboutSection";
import NewsletterSection from "@/src/components/newsletter/NewsletterSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CollectionCategories />
      <SofterVoiceBanner />
      <FeaturedProducts />
      <ProcessSection />
      <ProjectsSection />
      <AboutSection />
      <NewsletterSection />
    </main>
  );
}
