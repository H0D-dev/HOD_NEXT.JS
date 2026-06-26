import HeroSection from "@/src/components/hero/HeroSection";
import CollectionCategories from "@/src/components/collections/CollectionCategories";
import SofterVoiceBanner from "@/src/components/banner/SofterVoiceBanner";
import FeaturedProductsSection from "@/src/components/products/featured/FeaturedProductsSection";
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
      <FeaturedProductsSection />
      <ProcessSection />
      <ProjectsSection />
      <AboutSection />
      <NewsletterSection />
    </main>
  );
}
