import dynamic from "next/dynamic";
import HeroSection from "@/src/components/hero/HeroSection";
import FeaturedProductsSection from "@/src/components/products/featured/FeaturedProductsSection";
import CustomRugsBanner from "@/src/components/banner/CustomRugsBanner";
import CollectionCategories from "@/src/components/collections/CollectionCategories";
import ProjectsSection from "@/src/components/projects/ProjectsSection";
import CraftsmanshipSection from "@/src/components/craftsmanship/CraftsmanshipSection";
import TextMarquee from "@/src/components/marquee/TextMarquee";

const SocialFeedSection = dynamic(
  () => import("@/src/components/social/SocialFeedSection")
);



export default function Home() {
  return (
    <main className="bg-[#F9F9F6]">
      <HeroSection />
      <TextMarquee />
      {/* <CoreValuesSection /> */}
      <FeaturedProductsSection />
      <CollectionCategories />
      <ProjectsSection />
      <CraftsmanshipSection />
      <CustomRugsBanner />
      <SocialFeedSection />
    </main>
  );
}
