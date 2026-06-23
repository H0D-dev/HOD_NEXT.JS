import HeroSection from "@/src/components/hero/HeroSection";
import CollectionCategories from "@/src/components/collections/CollectionCategories";
import SofterVoiceBanner from "@/src/components/banner/SofterVoiceBanner";
import FeaturedProducts from "@/src/components/products/FeaturedProducts";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CollectionCategories />
      <SofterVoiceBanner />
      <FeaturedProducts />
    </main>
  );
}
